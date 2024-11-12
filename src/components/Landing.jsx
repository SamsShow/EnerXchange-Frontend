import HeroSection from '../components/LandingPage/HeroSection';
import FeaturesSection from '../components/LandingPage/FeatureSection';
import CTASection from '../components/LandingPage/CTASection';

function LandingPage({ account }) {
  return (
    <div className="bg-black text-white ">
      <HeroSection account={account} />
      <FeaturesSection />
      <CTASection />
    </div>
  );
}

export default LandingPage;