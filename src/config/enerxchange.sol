// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract EnerXchange is ERC20, Ownable2Step, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    // Custom errors
    error InvalidAmount();
    error InvalidListing();
    error Unauthorized();
    error ExpiredListing();
    error InsufficientBalance();
    error FeeTooHigh();
    error InvalidIPFSHash();

    struct EnergyListing {
        address seller;
        uint256 amount;
        uint256 pricePerUnit;
        uint256 expirationTime;
        bool active;
        uint256 minimumPurchase;
        uint256 creationTime;
    }

    struct UserProfile {
        bool isVerified;
        uint256 totalEnergyTraded;
        uint256 reputationScore;
        uint256 lastActivityTime;
        string certificationIPFSHash;  // IPFS hash of user's certification
        uint256 certificationTimestamp;
        string certificationType;      // Type of certification (e.g., "Solar Provider", "Grid Operator")
        bool certificationValid;       // Whether the certification is currently valid
    }

    // State variables
    mapping(uint256 => EnergyListing) public energyListings;
    mapping(address => UserProfile) public userProfiles;
    mapping(address => bool) public authorizedMeters;
    
    uint256 public nextListingId;
    uint256 public platformFee;
    address public feeCollector;
    AggregatorV3Interface public immutable priceOracle;
    
    uint256 public constant MAX_PLATFORM_FEE = 1000; // 10%
    uint256 public constant MAX_LISTING_DURATION = 30 days;
    uint256 public constant MIN_AMOUNT = 1e15; // 0.001 tokens minimum

    // Events
    event EnergyListed(uint256 indexed listingId, address indexed seller, uint256 amount, uint256 pricePerUnit, uint256 expirationTime);
    event EnergyPurchased(uint256 indexed listingId, address indexed buyer, uint256 amount, uint256 totalPrice);
    event ListingCancelled(uint256 indexed listingId, address indexed seller);
    event EnergyMinted(address indexed to, uint256 amount);
    event UserVerified(address indexed user, uint256 timestamp);
    event ReputationUpdated(address indexed user, uint256 newScore);
    event BatchMintCompleted(uint256 totalAmount, uint256 recipientCount);
    event CertificationUpdated(
        address indexed user, 
        string ipfsHash, 
        string certificationType, 
        uint256 timestamp
    );
    event CertificationStatusChanged(
        address indexed user, 
        bool isValid, 
        uint256 timestamp
    );

    // Add the missing modifier
    modifier validListing(uint256 listingId) {
        EnergyListing storage listing = energyListings[listingId];
        if (!listing.active) revert InvalidListing();
        if (block.timestamp >= listing.expirationTime) revert ExpiredListing();
        _;
    }

    constructor(
        address initialOwner,
        address _priceOracle,
        uint256 _platformFee
    ) 
        ERC20("Solar Energy Token", "SET") 
        Ownable(initialOwner)
    {
        if (_priceOracle == address(0)) revert InvalidAmount();
        if (_platformFee > MAX_PLATFORM_FEE) revert FeeTooHigh();
        
        priceOracle = AggregatorV3Interface(_priceOracle);
        platformFee = _platformFee;
        feeCollector = initialOwner;
    }


    function updateUserCertification(
        address user,
        string calldata ipfsHash,
        string calldata certType
    ) 
        external 
        onlyOwner 
    {
        if (bytes(ipfsHash).length == 0) revert InvalidIPFSHash();
        
        UserProfile storage profile = userProfiles[user];
        profile.certificationIPFSHash = ipfsHash;
        profile.certificationType = certType;
        profile.certificationTimestamp = block.timestamp;
        profile.certificationValid = true;
        profile.isVerified = true;
        
        emit CertificationUpdated(user, ipfsHash, certType, block.timestamp);
        emit CertificationStatusChanged(user, true, block.timestamp);
    }

    function invalidateCertification(address user) 
        external 
        onlyOwner 
    {
        UserProfile storage profile = userProfiles[user];
        profile.certificationValid = false;
        profile.isVerified = false;
        
        emit CertificationStatusChanged(user, false, block.timestamp);
    }

    // View function to get full user profile including certification details
    function getUserProfile(address user) 
        external 
        view 
        returns (
            bool isVerified,
            uint256 totalEnergyTraded,
            uint256 reputationScore,
            uint256 lastActivityTime,
            string memory certificationIPFSHash,
            uint256 certificationTimestamp,
            string memory certificationType,
            bool certificationValid
        ) 
    {
        UserProfile storage profile = userProfiles[user];
        return (
            profile.isVerified,
            profile.totalEnergyTraded,
            profile.reputationScore,
            profile.lastActivityTime,
            profile.certificationIPFSHash,
            profile.certificationTimestamp,
            profile.certificationType,
            profile.certificationValid
        );
    }

    function listEnergy(
        uint256 amount,
        uint256 pricePerUnit,
        uint256 duration,
        uint256 minimumPurchase
    ) 
        external
        whenNotPaused 
    {
        if (amount < MIN_AMOUNT) revert InvalidAmount();
        if (amount < minimumPurchase) revert InvalidAmount();
        if (duration > MAX_LISTING_DURATION) revert InvalidAmount();
        if (balanceOf(msg.sender) < amount) revert InsufficientBalance();
        
        uint256 listingId = nextListingId++;
        EnergyListing storage newListing = energyListings[listingId];
        newListing.seller = msg.sender;
        newListing.amount = amount;
        newListing.pricePerUnit = pricePerUnit;
        newListing.expirationTime = block.timestamp + duration;
        newListing.active = true;
        newListing.minimumPurchase = minimumPurchase;
        newListing.creationTime = block.timestamp;
        
        _transfer(msg.sender, address(this), amount);
        
        UserProfile storage profile = userProfiles[msg.sender];
        profile.lastActivityTime = block.timestamp;
        updateReputationScore(msg.sender, amount);
        
        emit EnergyListed(listingId, msg.sender, amount, pricePerUnit, newListing.expirationTime);
    }

    function purchaseEnergy(uint256 listingId, uint256 amount) 
        external 
        nonReentrant 
        validListing(listingId)
        whenNotPaused 
    {
        EnergyListing storage listing = energyListings[listingId];
        if (amount < listing.minimumPurchase) revert InvalidAmount();
        if (amount > listing.amount) revert InvalidAmount();
        
        uint256 actualPrice = getAdjustedPrice(listing.pricePerUnit);
        uint256 totalPrice = amount * actualPrice;
        uint256 fee = (totalPrice * platformFee) / 10000;
        
        if (balanceOf(msg.sender) < totalPrice) revert InsufficientBalance();
        
        _transfer(msg.sender, listing.seller, totalPrice - fee);
        _transfer(msg.sender, feeCollector, fee);
        _transfer(address(this), msg.sender, amount);
        
        listing.amount -= amount;
        if (listing.amount < listing.minimumPurchase) {
            listing.active = false;
        }
        
        updateReputationScore(msg.sender, amount);
        updateReputationScore(listing.seller, amount);
        
        emit EnergyPurchased(listingId, msg.sender, amount, totalPrice);
    }

    function cancelListing(uint256 listingId) 
        external 
        nonReentrant 
        validListing(listingId) 
    {
        EnergyListing storage listing = energyListings[listingId];
        if (listing.seller != msg.sender) revert Unauthorized();
        
        listing.active = false;
        _transfer(address(this), msg.sender, listing.amount);
        
        emit ListingCancelled(listingId, msg.sender);
    }

    function adminMint(
        address[] calldata recipients,
        uint256[] calldata amounts
    ) 
        external 
        onlyOwner 
        whenNotPaused 
    {
        if (recipients.length != amounts.length) revert InvalidAmount();
        if (recipients.length == 0) revert InvalidAmount();

        uint256 totalMinted = 0;
        
        for (uint256 i = 0; i < recipients.length; i++) {
            if (recipients[i] == address(0)) revert InvalidAmount();
            if (amounts[i] < MIN_AMOUNT) revert InvalidAmount();
            
            _mint(recipients[i], amounts[i]);
            totalMinted += amounts[i];
            
            emit EnergyMinted(recipients[i], amounts[i]);
        }
        
        emit BatchMintCompleted(totalMinted, recipients.length);
    }

    // View functions
    function getAdjustedPrice(uint256 basePrice) public view returns (uint256) {
        (
            uint80 roundID,
            int256 price,
            uint256 startedAt,
            uint256 timeStamp,
            uint80 answeredInRound
        ) = priceOracle.latestRoundData();
        
        require(timeStamp > 0, "Round not complete");
        require(answeredInRound >= roundID, "Stale price");
        require(price > 0, "Invalid price");
        
        return uint256(price) * basePrice / 1e8;
    }

    function updateReputationScore(address user, uint256 amount) internal {
        UserProfile storage profile = userProfiles[user];
        uint256 newScore = (
            profile.reputationScore * 8 + 
            amount * 2 + 
            (block.timestamp - profile.lastActivityTime) / 1 days
        ) / 10;
        
        profile.reputationScore = newScore;
        profile.lastActivityTime = block.timestamp;
        profile.totalEnergyTraded += amount;
        
        emit ReputationUpdated(user, newScore);
    }

    // Admin functions
    function verifyUser(address user) external onlyOwner {
        if (user == address(0)) revert InvalidAmount();
        UserProfile storage profile = userProfiles[user];
        profile.isVerified = true;
        profile.lastActivityTime = block.timestamp;
        emit UserVerified(user, block.timestamp);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}