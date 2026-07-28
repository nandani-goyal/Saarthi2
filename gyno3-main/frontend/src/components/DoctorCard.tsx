import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import BookingModal from "./BookingModal";
import { Navigation } from "lucide-react";

interface Doctor {
  id: string | number;
  name: string;
  rating: number;
  clinic: string;
  address: string;
  timings: string;
  specialization: string;
  image?: string;
  phone: string;
  distance_km?: number;
  isOpen?: boolean;
  lat?: number;
  lng?: number;
}

interface DoctorCardProps {
  doctor: Doctor;
}

const DoctorCard = ({ doctor }: DoctorCardProps) => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingType, setBookingType] = useState<"call" | "video" | "appointment">("appointment");

  const handleBook = () => {
    setBookingType("appointment");
    setIsBookingModalOpen(true);
  };

  const handleGetDirections = () => {
    if (doctor.lat && doctor.lng) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${doctor.lat},${doctor.lng}`, '_blank');
    }
  };

  // Default placeholder image for clinics
  const defaultImage = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=400&auto=format&fit=crop";

  return (
    <>
      <Card className="bg-[#fff7f2] border-[#fde0e0] hover:shadow-lg transition-all duration-300 hover:scale-105 flex flex-col h-full overflow-hidden">
        {/* Clinic Photo Header */}
        <div className="h-40 w-full relative">
          <img 
            src={doctor.image || defaultImage} 
            alt={doctor.name}
            className="w-full h-full object-cover"
          />
          {/* Open/Closed Status Badge */}
          <div className="absolute top-3 right-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${doctor.isOpen ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
              {doctor.isOpen ? '🟢 Open Now' : '🔴 Closed'}
            </span>
          </div>
        </div>

        <CardContent className="p-5 flex-1 flex flex-col">
          <div className="flex-1 space-y-3">
            {/* Name & Rating */}
            <div>
              <h3 className="font-bold text-[#5c3b28] text-xl line-clamp-2" title={doctor.name}>{doctor.name}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <div className="flex items-center bg-white px-2 py-0.5 rounded-full shadow-sm border border-[#fde0e0]">
                  <span className="text-yellow-500 mr-1 text-sm">★</span>
                  <span className="text-sm font-bold text-[#5c3b28]">{doctor.rating}</span>
                </div>
                {doctor.distance_km !== undefined && (
                  <span className="text-sm font-medium text-[#e03131] bg-[#fde0e0] px-2 py-0.5 rounded-full">
                    {doctor.distance_km} km away
                  </span>
                )}
              </div>
            </div>

            {/* Address & Timings */}
            <div className="space-y-2 text-sm text-[#5c3b28]/80 pt-2 border-t border-[#fde0e0]">
              <div className="flex items-start space-x-2">
                <span className="mt-0.5">📍</span>
                <span className="line-clamp-2">{doctor.address}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>⏰</span>
                <span>{doctor.timings}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-2 mt-5">
            <Button
              onClick={handleGetDirections}
              variant="outline"
              className="w-full border-[#e03131] text-[#e03131] hover:bg-[#e03131] hover:text-white"
              disabled={!doctor.lat || !doctor.lng}
            >
              <Navigation className="w-4 h-4 mr-2" />
              Get Directions
            </Button>
            <Button
              onClick={handleBook}
              className="w-full bg-[#2f9e44] hover:bg-[#2f9e44]/90 text-white"
            >
              📅 Book Consultation
            </Button>
          </div>
        </CardContent>
      </Card>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        doctorName={doctor.name}
        bookingType={bookingType}
      />
    </>
  );
};

export default DoctorCard;
