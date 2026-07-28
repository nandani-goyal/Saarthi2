
import { MapPin, Calendar, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Header = ({ activeSection, setActiveSection }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-[#fff7f2] shadow-sm z-50 border-b border-[#fde0e0]">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 bg-[#fde0e0] rounded-full">
              <span className="text-lg">🩺</span>
            </div>
            <span className="text-xl font-bold text-[#5c3b28] font-['Inter']">GynoConnect</span>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center space-x-2">
            <Button
              variant={activeSection === "nearby" ? "default" : "ghost"}
              onClick={() => setActiveSection("nearby")}
              className={`flex items-center space-x-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                activeSection === "nearby"
                  ? "bg-[#e03131] text-white hover:bg-[#e03131]/90"
                  : "text-[#5c3b28] hover:bg-[#fde0e0]"
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Nearest Doctors</span>
            </Button>
            
            <Button
              variant={activeSection === "symptoms" ? "default" : "ghost"}
              onClick={() => setActiveSection("symptoms")}
              className={`flex items-center space-x-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                activeSection === "symptoms"
                  ? "bg-[#e03131] text-white hover:bg-[#e03131]/90"
                  : "text-[#5c3b28] hover:bg-[#fde0e0]"
              }`}
            >
              <span className="text-sm">🧬</span>
              <span className="hidden sm:inline">Symptom Filter</span>
            </Button>
            
            <Button
              variant={activeSection === "consult" ? "default" : "ghost"}
              onClick={() => setActiveSection("consult")}
              className={`flex items-center space-x-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                activeSection === "consult"
                  ? "bg-[#e03131] text-white hover:bg-[#e03131]/90"
                  : "text-[#5c3b28] hover:bg-[#fde0e0]"
              }`}
            >
              <Video className="w-4 h-4" />
              <span className="hidden sm:inline">Online Consult</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
