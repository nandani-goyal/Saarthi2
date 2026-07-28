
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FunctionalChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const FunctionalChat = ({ isOpen, onClose }: FunctionalChatProps) => {
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<Array<{type: 'question' | 'answer', text: string}>>([
    { type: 'answer', text: 'Hi! I\'m here to help you with common questions. How can I assist you today?' }
  ]);

  const faqData = {
    "What are your consultation fees?": "Our video consultations start from ₹500 for 15 minutes and ₹800 for 30 minutes. In-person appointments vary by doctor and location.",
    "How do I book an appointment?": "You can book through our app by selecting 'Find Nearby Doctors' or 'Video Consultation', choose your preferred doctor, date and time.",
    "Can I upload my medical reports?": "Yes! You can upload reports in PDF, JPG, or PNG format during the booking process or before your consultation.",
    "What if I need to reschedule?": "You can reschedule up to 2 hours before your appointment through the app or by calling our reception.",
    "Are consultations confidential?": "Absolutely! All consultations are completely confidential and follow strict medical privacy guidelines.",
    "Do you provide prescriptions online?": "Yes, our doctors can provide digital prescriptions after video consultations when medically appropriate."
  };

  const handleQuestionClick = (question: string) => {
    const answer = faqData[question as keyof typeof faqData];
    setChatHistory(prev => [
      ...prev,
      { type: 'question', text: question },
      { type: 'answer', text: answer }
    ]);
  };

  const handleSendMessage = () => {
    if (!currentQuestion.trim()) return;
    
    // Simple keyword matching
    let response = "I understand your question. For specific medical concerns, please book a consultation with our doctors. For general queries, please call our reception.";
    
    const lowerQuestion = currentQuestion.toLowerCase();
    if (lowerQuestion.includes('fee') || lowerQuestion.includes('cost') || lowerQuestion.includes('price')) {
      response = faqData["What are your consultation fees?"];
    } else if (lowerQuestion.includes('book') || lowerQuestion.includes('appointment')) {
      response = faqData["How do I book an appointment?"];
    } else if (lowerQuestion.includes('report') || lowerQuestion.includes('upload')) {
      response = faqData["Can I upload my medical reports?"];
    }

    setChatHistory(prev => [
      ...prev,
      { type: 'question', text: currentQuestion },
      { type: 'answer', text: response }
    ]);
    
    setCurrentQuestion("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#fff7f2] border-[#fde0e0] max-w-md max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-[#5c3b28] flex items-center space-x-2">
            <span>💬</span>
            <span>Chat Support</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* FAQ Quick Buttons */}
          <div className="space-y-2">
            <p className="text-sm text-[#5c3b28] font-medium">Quick Questions:</p>
            <div className="flex flex-wrap gap-2">
              {Object.keys(faqData).slice(0, 3).map((question) => (
                <Button
                  key={question}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuestionClick(question)}
                  className="text-xs border-[#fde0e0] text-[#5c3b28] hover:bg-[#fde0e0]"
                >
                  {question.length > 20 ? question.substring(0, 20) + '...' : question}
                </Button>
              ))}
            </div>
          </div>

          {/* Chat History */}
          <div className="max-h-60 overflow-y-auto space-y-3 bg-white p-3 rounded-lg border border-[#fde0e0]">
            {chatHistory.map((message, index) => (
              <div
                key={index}
                className={`${
                  message.type === 'question' 
                    ? 'bg-[#e03131] text-white ml-auto max-w-xs' 
                    : 'bg-[#fde0e0] text-[#5c3b28] mr-auto max-w-xs'
                } rounded-lg p-3 text-sm`}
              >
                {message.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex space-x-2">
            <Input
              placeholder="Type your message..."
              value={currentQuestion}
              onChange={(e) => setCurrentQuestion(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 border-[#fde0e0] focus:border-[#e03131] rounded-full"
            />
            <Button 
              onClick={handleSendMessage}
              className="bg-[#e03131] hover:bg-[#e03131]/90 text-white rounded-full px-6"
            >
              Send
            </Button>
          </div>

          <div className="text-xs text-[#5c3b28]/60 text-center">
            For medical emergencies, please call emergency services immediately
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FunctionalChat;
