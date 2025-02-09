import ComplianceSection from '@/components/group/Home/ComplianceSection';
import DashboardSection from '@/components/group/Home/DashboardSection';
import HeroSection from '@/components/group/Home/HeroSection';
import FloatingNav from '@/components/navbar/FloatingNav';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div>
        <div>
          <FloatingNav />
          <HeroSection />
          <DashboardSection />
          <ComplianceSection />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
