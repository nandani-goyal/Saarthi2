import { useState } from "react";
import { MessageCircle } from "lucide-react";
import FunctionalChat from "./FunctionalChat";

const Footer = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <footer className="bg-[#fff7f2] border-t border-[#fde0e0] mt-12">
        <div className="container mx-auto px-4 max-w-7xl py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-8 h-8 bg-[#fde0e0] rounded-full">
                  <span>🩺</span>
                </div>
                <span className="font-bold text-[#5c3b28] text-lg">GynoConnect</span>
              </div>
              <p className="text-[#5c3b28]/70 text-sm">
                Connecting women with trusted gynecological care, anytime, anywhere.
              </p>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold text-[#5c3b28] mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-[#5c3b28]/70">
                <li>Find Nearby Doctors</li>
                <li>Video Consultations</li>
                <li>Symptom Checker</li>
                <li>Health Library</li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold text-[#5c3b28] mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-[#5c3b28]/70">
                <li>
                  <button 
                    onClick={() => setIsChatOpen(true)}
                    className="flex items-center space-x-2 hover:text-[#e03131] transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat Support</span>
                  </button>
                </li>
                <li>Emergency Helpline</li>
                <li>FAQ</li>
                <li>Contact Us</li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold text-[#5c3b28] mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-[#5c3b28]/70">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Medical Disclaimer</li>
                <li>HIPAA Compliance</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#fde0e0] mt-8 pt-6 text-center">
            <div className="flex items-center justify-center space-x-2 text-[#5c3b28]/70 text-sm">
              <span>❤️</span>
              <span>Built by SheCare</span>
              <span>•</span>
              <span>© 2025 GynoConnect. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>

      <FunctionalChat
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </>
  );
};

export default Footer;
