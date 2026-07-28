import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Loader2, RefreshCw } from "lucide-react";
import DoctorCard from "./DoctorCard";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet's default icon path
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const API_BASE_URL = "http://127.0.0.1:8000";

const NearbyDoctors = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(() => {
    const saved = localStorage.getItem("gyno_location");
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [hasSearched, setHasSearched] = useState(() => {
    return localStorage.getItem("gyno_hasSearched") === "true";
  });
  const [doctors, setDoctors] = useState<any[]>(() => {
    const saved = localStorage.getItem("gyno_doctors");
    return saved ? JSON.parse(saved) : [];
  });
  const { toast } = useToast();

  useEffect(() => {
    if (location) localStorage.setItem("gyno_location", JSON.stringify(location));
    localStorage.setItem("gyno_hasSearched", hasSearched.toString());
    localStorage.setItem("gyno_doctors", JSON.stringify(doctors));
  }, [location, hasSearched, doctors]);

  const handleUseLocation = () => {
    setIsLoading(true);
    setIsError(false);
    setHasSearched(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });

          toast({
            title: "Location found!",
            description: "Fetching real clinics near you from OpenStreetMap...",
          });

          try {
            const response = await axios.get(`${API_BASE_URL}/gynecologists`, {
              params: {
                lat: latitude,
                lng: longitude,
                radius_km: 10, // 10km radius
              },
            });

            const data = response.data;
            setDoctors(data || []);
            
            if (!data || data.length === 0) {
              toast({
                title: "No clinics found",
                description: "Try expanding your search area later.",
              });
            } else {
              toast({
                title: "Clinics loaded successfully!",
                description: `Found ${data.length} clinics near you.`,
              });
            }
          } catch (error: any) {
            console.error("API error:", error);
            setIsError(true);
            toast({
              title: "Error fetching doctors",
              description: error.message || "Failed to connect to the backend server.",
              variant: "destructive",
            });
          } finally {
            setIsLoading(false);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoading(false);
          setIsError(true);
          toast({
            title: "Location access denied",
            description: "Please allow location access in your browser settings.",
            variant: "destructive",
          });
        },
        { timeout: 10000 }
      );
    } else {
      setIsLoading(false);
      setIsError(true);
      toast({
        title: "Geolocation not supported",
        description: "Your browser does not support geolocation.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Location Section */}
      <Card className="bg-[#fff7f2] border-[#fde0e0]">
        <CardHeader>
          <CardTitle className="text-[#5c3b28] flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span>Find Real Clinics Nearby</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Button
              onClick={handleUseLocation}
              disabled={isLoading}
              className="bg-[#e03131] hover:bg-[#e03131]/90 text-white rounded-full flex items-center space-x-2 w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Scanning area...</span>
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4" />
                  <span>📍 Locate Clinics Near Me</span>
                </>
              )}
            </Button>
            {location && (
              <div className="text-sm font-medium text-[#2f9e44] bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
                ✅ Location detected successfully
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* State Handling: Loading, Error, Empty, Success */}
      
      {/* 1. INITIAL STATE */}
      {!hasSearched && (
        <Card className="bg-white border-dashed border-2 border-[#fde0e0]">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-6xl mb-4">🏥</div>
            <h3 className="text-xl font-bold text-[#5c3b28] mb-2">Discover Clinics Near You</h3>
            <p className="text-[#5c3b28]/70 max-w-md">
              Click the button above to allow location access and discover real gynecology clinics and hospitals in your area.
            </p>
          </CardContent>
        </Card>
      )}

      {/* 2. LOADING STATE */}
      {isLoading && hasSearched && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse bg-white overflow-hidden">
              <div className="h-40 bg-gray-200 w-full"></div>
              <CardContent className="p-5 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
                <div className="flex flex-col space-y-2 pt-4">
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 3. ERROR STATE */}
      {!isLoading && isError && hasSearched && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-bold text-red-800 mb-2">Failed to load clinics</h3>
            <p className="text-red-600/80 max-w-md mb-6">
              There was a problem accessing your location or connecting to the server. Please ensure the backend is running.
            </p>
            <Button onClick={handleUseLocation} variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* 4. EMPTY STATE */}
      {!isLoading && !isError && hasSearched && doctors.length === 0 && (
        <Card className="bg-white border-[#fde0e0]">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-5xl mb-4">🏜️</div>
            <h3 className="text-lg font-bold text-[#5c3b28] mb-2">No clinics found nearby</h3>
            <p className="text-[#5c3b28]/70 max-w-md">
              We couldn't find any gynecology clinics within a 10km radius of your current location.
            </p>
          </CardContent>
        </Card>
      )}

      {/* 5. SUCCESS STATE: Doctor Cards */}
      {!isLoading && !isError && doctors.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor: any) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      )}

      {/* SUCCESS STATE: Map Section */}
      {!isLoading && !isError && doctors.length > 0 && location && (
        <Card className="bg-white border-[#fde0e0] shadow-sm overflow-hidden">
          <CardHeader className="bg-[#fff7f2] border-b border-[#fde0e0]">
            <CardTitle className="text-[#5c3b28] text-lg flex items-center">
              <span>🗺️</span>
              <span className="ml-2">Interactive Map View</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <MapContainer
              center={[location.lat, location.lng]}
              zoom={13}
              scrollWheelZoom={false}
              style={{ height: "450px", width: "100%", zIndex: 10 }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* User Marker */}
              <Marker position={[location.lat, location.lng]} icon={customIcon}>
                <Popup>
                  <div className="font-bold text-blue-600">You are here</div>
                </Popup>
              </Marker>

              {/* Clinic Markers */}
              {doctors.map((doc: any) => (
                <Marker
                  key={doc.id}
                  position={[doc.lat, doc.lng]}
                  icon={customIcon}
                >
                  <Popup>
                    <div className="p-1">
                      <strong className="text-sm block mb-1">{doc.name}</strong>
                      <span className="text-xs text-gray-600 block mb-1">{doc.address}</span>
                      <span className="text-xs font-semibold text-red-600">{doc.distance_km} km away</span>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NearbyDoctors;
