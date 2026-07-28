import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mic, MicOff } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorName: string;
  bookingType: "call" | "video" | "appointment";
}

// Ensure TypeScript knows about the Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const BookingModal = ({ isOpen, onClose, doctorName, bookingType }: BookingModalProps) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [mode, setMode] = useState<"Video" | "In-Person">(bookingType === "video" ? "Video" : "In-Person");
  const [symptoms, setSymptoms] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth(); // ← real user from saarthi-auth
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = "hi-IN"; // Set language to Hindi by default

        recognitionRef.current.onresult = (event: any) => {
          let interimTranscript = "";
          let finalTranscript = "";

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          
          if (finalTranscript) {
            setSymptoms((prev) => prev + (prev ? " " : "") + finalTranscript);
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsRecording(false);
          toast({
            title: "Microphone Error",
            description: "Could not use microphone. Please try typing your symptoms.",
            variant: "destructive"
          });
        };

        recognitionRef.current.onend = () => {
          setIsRecording(false);
        };
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [toast]);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      if (!recognitionRef.current) {
        toast({
          title: "Not Supported",
          description: "Voice typing is not supported in this browser.",
          variant: "destructive"
        });
        return;
      }
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        toast({
          title: "Listening...",
          description: "Speak in Hindi or English to describe your symptoms.",
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleConfirmBooking = async () => {
    // Guard: ensure user is loaded from saarthi-auth or MongoDB
    if (!user) {
      toast({
        title: "Please Log In",
        description: "User profile could not be loaded.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast({
        title: "Missing Date/Time",
        description: "Please select both date and time to book.",
        variant: "destructive",
      });
      return;
    }
    
    if (!symptoms.trim()) {
      toast({
        title: "Missing Symptoms",
        description: "Please describe your symptoms briefly.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Parse local date and time to UTC for the backend
      // Format: "YYYY-MM-DD" and "h:mm A"
      const dateObj = new Date(selectedDate);
      const [time, modifier] = selectedTime.split(" ");
      let [hours, minutes] = time.split(":");
      if (hours === "12") {
        hours = "00";
      }
      if (modifier === "PM") {
        hours = (parseInt(hours, 10) + 12).toString();
      }
      dateObj.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
      
      const payload = {
        user_id: user.id,         // ← real MongoDB _id from saarthi-auth
        user_email: user.email,   // ← real email — confirmation will go here
        appointment_datetime: dateObj.toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        consultation_mode: mode,
        original_symptoms: symptoms
      };

      await axios.post("http://127.0.0.1:8000/api/appointments", payload);

      toast({
        title: "Booking Confirmed! ✅",
        description: `Your ${mode} consultation is set for ${selectedDate} at ${selectedTime}. A confirmation email is on the way!`,
      });
      
      // Save symptoms for the VideoConsult page to display
      localStorage.setItem("gyno_latest_symptoms", symptoms);
      
      // Reset and close
      setSymptoms("");
      setSelectedDate("");
      setSelectedTime("");
      onClose();
      
    } catch (error: any) {
      console.error(error);
      const errorMsg = error.response?.data?.detail || "Failed to book appointment. Please try again.";
      toast({
        title: "Booking Failed",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const timeSlots = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isLoading && onClose()}>
      <DialogContent className="bg-[#fff7f2] border-[#fde0e0] max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <DialogTitle className="text-[#5c3b28] flex items-center justify-center space-x-2 text-xl font-bold">
            <span>📅</span>
            <span>Book Consultation</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-2">
          {/* Doctor Info */}
          <div className="text-sm text-[#5c3b28] bg-[#fde0e0]/50 p-4 rounded-xl border border-[#fde0e0] flex justify-between items-center">
            <div className="font-semibold text-base">👩‍⚕️ {doctorName}</div>
            <div className="text-xs bg-white px-2 py-1 rounded-full border border-[#fde0e0] font-medium">Gynecology</div>
          </div>

          {/* Consultation Mode */}
          <div className="space-y-2">
            <Label className="text-[#5c3b28] font-bold text-sm">Consultation Mode</Label>
            <div className="flex bg-[#fde0e0]/30 p-1 rounded-lg border border-[#fde0e0]">
              <button 
                onClick={() => setMode("Video")}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${mode === 'Video' ? 'bg-white shadow-sm text-[#e03131] border border-[#fde0e0]' : 'text-[#5c3b28]/70 hover:text-[#5c3b28]'}`}
              >
                📹 Video Call
              </button>
              <button 
                onClick={() => setMode("In-Person")}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${mode === 'In-Person' ? 'bg-white shadow-sm text-[#e03131] border border-[#fde0e0]' : 'text-[#5c3b28]/70 hover:text-[#5c3b28]'}`}
              >
                🏥 In-Person
              </button>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date" className="text-[#5c3b28] font-bold text-sm">Select Date</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="mt-1 border-[#fde0e0] focus:border-[#e03131] rounded-lg shadow-sm"
              />
            </div>
          </div>

          <div>
            <Label className="text-[#5c3b28] font-bold text-sm">Select Time</Label>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mt-2">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`py-1.5 px-1 text-xs rounded-lg font-medium transition-all border ${
                    selectedTime === time 
                      ? "bg-[#e03131] border-[#e03131] text-white shadow-md" 
                      : "bg-white border-[#fde0e0] text-[#5c3b28] hover:border-[#e03131]/50 hover:bg-[#fde0e0]/20"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Symptoms (with Hindi Voice Typing) */}
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <Label htmlFor="symptoms" className="text-[#5c3b28] font-bold text-sm">
                Describe your symptoms (English/Hindi)
              </Label>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                onClick={toggleRecording}
                className={`h-8 px-2 rounded-full text-xs font-medium border ${
                  isRecording 
                    ? "bg-red-50 text-red-600 border-red-200 animate-pulse hover:bg-red-100 hover:text-red-700" 
                    : "bg-white text-blue-600 border-blue-200 hover:bg-blue-50"
                }`}
              >
                {isRecording ? (
                  <><MicOff className="w-3 h-3 mr-1" /> Stop</>
                ) : (
                  <><Mic className="w-3 h-3 mr-1" /> Hindi Mic</>
                )}
              </Button>
            </div>
            
            <Textarea
              id="symptoms"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="E.g. Mujhe pichle 3 din se pet dard ho raha hai..."
              className="border-[#fde0e0] focus:border-[#e03131] rounded-lg shadow-sm resize-none"
              rows={3}
            />
            <p className="text-[10px] text-[#5c3b28]/60 leading-tight">
              Our AI securely summarizes these details for the doctor.
            </p>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-2">
            <Button
              onClick={onClose}
              variant="outline"
              disabled={isLoading}
              className="flex-1 border-[#fde0e0] text-[#5c3b28] hover:bg-[#fde0e0]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmBooking}
              disabled={isLoading}
              className="flex-1 bg-[#2f9e44] hover:bg-[#2f9e44]/90 text-white font-bold"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
              ) : (
                "Confirm Booking"
              )}
            </Button>
          </div>
          
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
