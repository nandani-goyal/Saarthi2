
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DoctorCard from "./DoctorCard";

const SymptomFilter = () => {
  const [selectedSymptom, setSelectedSymptom] = useState<string>("");

  const symptoms = [
    { id: "pcos", label: "PCOS / Irregular Periods", icon: "🔴", color: "bg-red-100 text-red-700" },
    { id: "pregnancy", label: "No Pregnancy / Contraceptive Help", icon: "🚫", color: "bg-gray-100 text-gray-700" },
    { id: "infection", label: "Infection / Hygiene Issues", icon: "🧫", color: "bg-blue-100 text-blue-700" },
    { id: "pain", label: "Pain / Discomfort", icon: "😣", color: "bg-orange-100 text-orange-700" },
    { id: "reports", label: "Report Diagnosis Help", icon: "🔬", color: "bg-purple-100 text-purple-700" }
  ];

  const doctorsBySymptom = {
    pcos: [
      {
        id: 1,
        name: "Dr. Radhika Sen",
        rating: 4.7,
        clinic: "Lotus Women's Clinic",
        address: "Delhi",
        timings: "Mon-Sat, 10AM–6PM",
        specialization: "PCOS Expert",
        image: "👩‍⚕️",
        phone: "+91-9876543210"
      }
    ],
    infection: [
      {
        id: 3,
        name: "Dr. Anjali Sharma",
        rating: 4.6,
        clinic: "Care Women's Center",
        address: "Bangalore",
        timings: "Tue-Sun, 11AM–7PM",
        specialization: "Infection Specialist",
        image: "👩‍⚕️",
        phone: "+91-9876543212"
      }
    ],
    pregnancy: [
      {
        id: 2,
        name: "Dr. Nidhi Kapoor",
        rating: 4.8,
        clinic: "Bliss Women's Hospital",
        address: "Mumbai",
        timings: "Mon-Fri, 9AM–5PM",
        specialization: "Pregnancy Support",
        image: "👩‍⚕️",
        phone: "+91-9876543211"
      }
    ]
  };

  return (
    <div className="space-y-6">
      <Card className="bg-[#fff7f2] border-[#fde0e0]">
        <CardHeader>
          <CardTitle className="text-[#5c3b28] flex items-center space-x-2">
            <span>🧬</span>
            <span>What are you experiencing?</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {symptoms.map((symptom) => (
              <Button
                key={symptom.id}
                variant={selectedSymptom === symptom.id ? "default" : "outline"}
                onClick={() => setSelectedSymptom(symptom.id)}
                className={`p-4 h-auto text-left justify-start rounded-lg transition-all ${
                  selectedSymptom === symptom.id
                    ? "bg-[#e03131] text-white"
                    : "border-[#fde0e0] hover:bg-[#fde0e0] text-[#5c3b28]"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{symptom.icon}</span>
                  <span className="text-sm font-medium">{symptom.label}</span>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Smart Doctor Matching */}
      {selectedSymptom && (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-[#5c3b28] mb-2">
              🤖 Smart Doctor Matching
            </h3>
            <p className="text-[#5c3b28]/70">
              Doctors specialized in your selected concern
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(doctorsBySymptom[selectedSymptom as keyof typeof doctorsBySymptom] || []).map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>

          {(!doctorsBySymptom[selectedSymptom as keyof typeof doctorsBySymptom] || 
            doctorsBySymptom[selectedSymptom as keyof typeof doctorsBySymptom].length === 0) && (
            <Card className="bg-[#fff7f2] border-[#fde0e0]">
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold text-[#5c3b28] mb-2">
                  Finding specialists for you...
                </h3>
                <p className="text-[#5c3b28]/70">
                  We're matching you with doctors who specialize in your concern.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Health Tips Based on Symptom */}
      {selectedSymptom && (
        <Card className="bg-gradient-to-r from-[#fff7f2] to-[#fde0e0] border-[#fde0e0]">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="text-3xl">💡</div>
              <div>
                <h4 className="font-semibold text-[#5c3b28] mb-2">Quick Health Tip</h4>
                <p className="text-[#5c3b28]/80 text-sm">
                  {selectedSymptom === "pcos" && "PCOS can be managed with proper diet, exercise, and medical care. Regular check-ups are important."}
                  {selectedSymptom === "infection" && "Maintain good hygiene, wear breathable fabrics, and consult a doctor for proper treatment."}
                  {selectedSymptom === "pregnancy" && "Contraceptive counseling helps you make informed choices about your reproductive health."}
                  {selectedSymptom === "pain" && "Pelvic pain should not be ignored. Early consultation can help identify and treat the cause."}
                  {selectedSymptom === "reports" && "Bring all your medical reports and test results for accurate diagnosis and treatment."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SymptomFilter;
