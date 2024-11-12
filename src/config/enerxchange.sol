// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

contract EnerXchange is ERC20, Ownable2Step, ReentrancyGuard, Pausable {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    struct EnergyListing {
        address seller;
        uint256 amount;
        uint256 pricePerUnit;
        uint256 expirationTime;
        bool active;
        uint256 minimumPurchase;
        string energySource; // solar, wind, etc.
        uint256 carbonCredits;
    }

    struct UserProfile {
        bool isVerified;
        uint256 totalEnergyTraded;
        uint256 reputationScore;
        string[] certifications;
    }

    // State variables
    mapping(uint256 => EnergyListing) public energyListings;
    mapping(address => UserProfile) public userProfiles;
    mapping(address => bool) public authorizedMeters;
    mapping(string => bool) public validEnergySources;
    
    uint256 public nextListingId;
    uint256 public platformFee;
    address public feeCollector;
    AggregatorV3Interface public priceOracle;
    
    // Events
    event EnergyListed(uint256 indexed listingId, address indexed seller, uint256 amount, uint256 pricePerUnit, uint256 expirationTime);
    event EnergyPurchased(uint256 indexed listingId, address indexed buyer, uint256 amount, uint256 totalPrice);
    event ListingCancelled(uint256 indexed listingId);
    event EnergyMinted(address indexed to, uint256 amount);
    event UserVerified(address indexed user);
    event MeterAuthorized(address indexed meter);
    event ReputationUpdated(address indexed user, uint256 newScore);
    event CarbonCreditsEarned(address indexed user, uint256 amount);
    event CertificationAdded(address indexed user, string certification);

    constructor(
        address initialOwner,
        address _priceOracle,
        uint256 _platformFee
    ) 
        ERC20("EnerXchange Token", "EXT") 
        Ownable(initialOwner)
        payable
    {
        priceOracle = AggregatorV3Interface(_priceOracle);
        platformFee = _platformFee;
        feeCollector = initialOwner;
        
        // Initialize valid energy sources
        validEnergySources["solar"] = true;
        validEnergySources["wind"] = true;
        validEnergySources["biomass"] = true;
    }
    // Modifiers
    modifier validListing(uint256 listingId) {
        require(energyListings[listingId].active, "Listing not active");
        _;
    }

    modifier onlyVerifiedUser() {
        require(userProfiles[msg.sender].isVerified, "User not verified");
        _;
    }

    modifier onlyAuthorizedMeter() {
        require(authorizedMeters[msg.sender], "Unauthorized meter");
        _;
    }

    // Smart meter integration
    function authorizeSmartMeter(address meter) external onlyOwner {
        authorizedMeters[meter] = true;
        emit MeterAuthorized(meter);
    }

    function reportEnergyProduction(
        address producer,
        uint256 amount,
        string calldata source,
        bytes calldata signature
    ) 
        external 
        onlyAuthorizedMeter 
    {
        require(validEnergySources[source], "Invalid energy source");
        
        // Verify the signature
        bytes32 messageHash = keccak256(abi.encodePacked(producer, amount, source));
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        address signer = ECDSA.recover(ethSignedMessageHash, signature);
        require(signer == producer, "Invalid signature");
        
        // Calculate carbon credits based on energy source
        uint256 carbonCredits = calculateCarbonCredits(amount, source);
        
        // Mint energy tokens and update user profile
        _mint(producer, amount);
        userProfiles[producer].totalEnergyTraded += amount;
        emit CarbonCreditsEarned(producer, carbonCredits);
    }

    // Enhanced listing functionality
    function listEnergy(
        uint256 amount,
        uint256 pricePerUnit,
        uint256 duration,
        uint256 minimumPurchase,
        string calldata energySource
    ) 
        external
        onlyVerifiedUser
        whenNotPaused 
    {
        require(amount >= minimumPurchase, "Minimum purchase exceeds amount");
        require(validEnergySources[energySource], "Invalid energy source");
        
        uint256 listingId = nextListingId++;
        EnergyListing storage newListing = energyListings[listingId];
        newListing.seller = msg.sender;
        newListing.amount = amount;
        newListing.pricePerUnit = pricePerUnit;
        newListing.expirationTime = block.timestamp + duration;
        newListing.active = true;
        newListing.minimumPurchase = minimumPurchase;
        newListing.energySource = energySource;
        
        _transfer(msg.sender, address(this), amount);
        
        // Update reputation score
        updateReputationScore(msg.sender, amount);
        
        emit EnergyListed(listingId, msg.sender, amount, pricePerUnit, newListing.expirationTime);
    }

    // Enhanced purchase functionality with dynamic pricing
    function purchaseEnergy(uint256 listingId, uint256 amount) 
        external 
        nonReentrant 
        validListing(listingId)
        whenNotPaused 
    {
        EnergyListing storage listing = energyListings[listingId];
        require(amount >= listing.minimumPurchase, "Below minimum purchase");
        
        uint256 actualPrice = getAdjustedPrice(listing.pricePerUnit);
        uint256 totalPrice = amount * actualPrice;
        uint256 fee = (totalPrice * platformFee) / 10000; // Platform fee in basis points
        
        // Transfer tokens
        _transfer(msg.sender, listing.seller, totalPrice - fee);
        _transfer(msg.sender, feeCollector, fee);
        _transfer(address(this), msg.sender, amount);
        
        // Update listing
        listing.amount -= amount;
        if (listing.amount < listing.minimumPurchase) {
            listing.active = false;
        }
        
        // Update reputation scores
        updateReputationScore(msg.sender, amount);
        updateReputationScore(listing.seller, amount);
        
        emit EnergyPurchased(listingId, msg.sender, amount, totalPrice);
    }

    // Utility functions
    function getAdjustedPrice(uint256 basePrice) public view returns (uint256) {
        (, int256 price,,,) = priceOracle.latestRoundData();
        return uint256(price) * basePrice / 1e8; // Adjust for Chainlink decimals
    }

    function calculateCarbonCredits(uint256 amount, string memory source) internal pure returns (uint256) {
        // Implementation depends on energy source and amount
        // This is a simplified version
        if (keccak256(bytes(source)) == keccak256(bytes("solar"))) {
            return amount * 2;
        } else if (keccak256(bytes(source)) == keccak256(bytes("wind"))) {
            return amount * 3;
        }
        return amount;
    }

    function updateReputationScore(address user, uint256 amount) internal {
        UserProfile storage profile = userProfiles[user];
        profile.reputationScore = (profile.reputationScore * 9 + amount) / 10;
        emit ReputationUpdated(user, profile.reputationScore);
    }

    // Admin functions
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function setFeeCollector(address newCollector) external onlyOwner {
        feeCollector = newCollector;
    }

    function setPlatformFee(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "Fee too high"); // Max 10%
        platformFee = newFee;
    }

    function verifyUser(address user) external onlyOwner {
        UserProfile storage profile = userProfiles[user];
        profile.isVerified = true;
        emit UserVerified(user);
    }

    // New function to add certifications one at a time
    function addUserCertification(address user, string calldata certification) external onlyOwner {
        require(userProfiles[user].isVerified, "User must be verified first");
        userProfiles[user].certifications.push(certification);
        emit CertificationAdded(user, certification);
    }

    // Function to get user certifications
    function getUserCertifications(address user) external view returns (string[] memory) {
        return userProfiles[user].certifications;
    }

}