
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface CallReceptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CallReceptionModal = ({ isOpen, onClose }: CallReceptionModalProps) => {
  const { toast } = useToast();
  
  const receptionNumbers = [
    "+91 98765 43210",
    "+91 87654 32109", 
    "+91 76543 21098"
  ];
  
  const randomNumber = receptionNumbers[Math.floor(Math.random() * receptionNumbers.length)];

  const handleCallNow = () => {
    toast({
      title: "Calling Reception...",
      description: `Connecting you to ${randomNumber}`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#fff7f2] border-[#fde0e0] max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-[#5c3b28] flex items-center space-x-2">
            <span>📞</span>
            <span>Reception Contact</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 text-center">
          <div className="text-4xl">🏥</div>
          
          <div>
            <p className="text-[#5c3b28] font-medium mb-2">Call our reception for further assistance</p>
            <div className="bg-[#fde0e0] p-4 rounded-lg">
              <p className="text-[#e03131] font-bold text-lg">{randomNumber}</p>
            </div>
          </div>
          
          <p className="text-[#5c3b28]/70 text-sm">
            Available 24/7 for appointments, queries, and emergency support
          </p>

          <div className="flex space-x-2">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-[#fde0e0] text-[#5c3b28] hover:bg-[#fde0e0]"
            >
              Close
            </Button>
            <Button
              onClick={handleCallNow}
              className="flex-1 bg-[#e03131] hover:bg-[#e03131]/90 text-white"
            >
              📞 Call Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CallReceptionModal;
