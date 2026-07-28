
import { useState } from "react";
import Header from "@/components/Header";
import NearbyDoctors from "@/components/NearbyDoctors";
// import SymptomFilter from "@/components/SymptomFilter";
import VideoConsult from "@/components/VideoConsult";
import HealthLibrary from "@/components/HealthLibrary";
import Footer from "@/components/Footer";

const Index = () => {
  const [activeSection, setActiveSection] = useState<string>("nearby");

  return (
    <div className="min-h-screen bg-[#fefaf6]">
      <Header activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <main className="pt-20 pb-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Welcome Section */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#fde0e0] rounded-full mb-4">
              <span className="text-2xl">🩺</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#5c3b28] mb-3 font-['Inter']">
              Welcome to GynoConnect 💖
            </h1>
            <p className="text-[#5c3b28]/70 text-lg max-w-2xl mx-auto">
              Connect with trusted gynecologists nearby or online. Get expert care, personalized advice, and take control of your reproductive health.
            </p>
          </div>

          {/* Content Sections */}
          {activeSection === "nearby" && <NearbyDoctors />}
          {/* {activeSection === "symptoms" && <SymptomFilter />} */}
          {activeSection === "consult" && <VideoConsult />}
          {activeSection === "library" && <HealthLibrary />}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
