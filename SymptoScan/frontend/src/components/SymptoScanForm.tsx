import { useState } from "react";
import CreatableSelect from "react-select/creatable";
import { getTips, analyzeSymptoms } from "../api/symptoScan";
import { 
  Stethoscope, BookOpen, ScanFace, Phone, AlertTriangle, 
  ChevronRight, ChevronLeft, Calendar, ShieldAlert, Languages 
} from "lucide-react";

const symptomOptions = [
  { value: "fatigue", label: "💧 Fatigue" },
  { value: "irregular periods", label: "🔄 Irregular Periods" },
  { value: "pelvic pain", label: "⚡ Pelvic Pain" },
  { value: "mood swings", label: "🌪️ Mood Swings" },
  { value: "acne", label: "🌸 Acne" },
  { value: "bloating", label: "💨 Bloating" },
  { value: "hot flashes", label: "🌡️ Hot Flashes" },
  { value: "chest pain", label: "🚨 Chest Pain (Emergency)" },
  { value: "severe bleeding", label: "🚨 Severe Bleeding (Emergency)" },
  { value: "fainting", label: "🚨 Fainting / Dizziness (Emergency)" },
];

const FRONTEND_EMERGENCY_WORDS = [
  "chest pain", "shortness of breath", "fainting", "severe bleeding", 
  "difficulty breathing", "unconscious", "extreme abdominal pain", "severe pelvic pain"
];

export const SymptoScanForm = () => {
  const [step, setStep] = useState(1);
  const [selectedSymptoms, setSelectedSymptoms] = useState<any[]>([]);
  const [duration, setDuration] = useState("2-7 days");
  const [severity, setSeverity] = useState("moderate");
  const [language, setLanguage] = useState("English");
  
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [tips, setTips] = useState<string[]>([]);
  const [loadingTips, setLoadingTips] = useState(false);

  const handleSelfCareClick = async () => {
    setShowTips(true);
    if (result && result.self_care && result.self_care.length > 0) {
      setTips(result.self_care);
    } else if (tips.length === 0) {
      try {
        setLoadingTips(true);
        const res = await getTips();
        setTips(res.tips || []);
      } catch (error) {
        console.error("Failed to fetch tips:", error);
      } finally {
        setLoadingTips(false);
      }
    }
  };

  const checkEmergencyLocal = () => {
    const symptomList = selectedSymptoms.map((s) => s.value.toLowerCase());
    return symptomList.some(sym => 
      FRONTEND_EMERGENCY_WORDS.some(keyword => sym.includes(keyword))
    );
  };

  const handleCheck = async () => {
    const symptomList = selectedSymptoms.map((s) => s.value);
    if (symptomList.length === 0) {
      alert("Please select or type at least one symptom.");
      return;
    }

    setLoading(true);
    setResult(null);

    // 1. Local Safety Red-Flag Override (Deterministic Bypass)
    const isEmergency = checkEmergencyLocal();
    if (isEmergency) {
      setTimeout(() => {
        const isHindi = language.toLowerCase() === "hindi";
        setResult({
          possible_conditions: ["Urgent Medical Attention Required"],
          urgency: "Emergency",
          recommendation: isHindi 
            ? "आपातकालीन: कृपया तुरंत निकटतम आपातकालीन क्लिनिक में जाएं या आपातकालीन चिकित्सा सेवाओं को कॉल करें।"
            : "EMERGENCY: Please proceed to the nearest emergency clinic or contact emergency services immediately.",
          self_care: isHindi
            ? [
                "स्व-देखभाल उपचारों की प्रतीक्षा न करें।",
                "एक सुरक्षित और आरामदायक स्थिति में आराम करें।",
                "किसी को तुरंत अपनी स्थिति के बारे में सूचित रखें।"
              ]
            : [
                "Do not wait for self-care remedies.",
                "Rest in a comfortable, safe position.",
                "Keep someone informed of your situation immediately."
              ]
        });
        setLoading(false);
      }, 500); // Small delay to feel realistic
      return;
    }

    // 2. Standard Gemini Request
    try {
      const res = await analyzeSymptoms(symptomList, duration, severity, language);
      setResult(res);
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    const cleanUrgency = (urgency || "").toLowerCase();
    if (cleanUrgency.includes("emergency") || cleanUrgency.includes("high")) {
      return "bg-red-100 text-red-800 border-red-300";
    }
    if (cleanUrgency.includes("medium")) {
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    }
    return "bg-green-100 text-green-800 border-green-300";
  };

  return (
    <div
      className="min-h-screen bg-white p-8 flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/736x/ed/56/9f/ed569f400860eb1928f4f7c1be745a9d.jpg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="backdrop-blur-sm bg-white/70 p-8 rounded-xl shadow-xl w-full max-w-xl z-10 border border-white/20">
        {/* Centered Heading */}
        <div className="flex items-center gap-2 text-brown mb-4 justify-center">
          <ScanFace className="w-6 h-6" />
          <h1 className="text-3xl font-bold">SymptoScan AI</h1>
        </div>

        {/* Stepper Progress Bar */}
        <div className="flex justify-between items-center mb-6 px-4">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                step === s ? "bg-brown text-white ring-4 ring-brown/20" : 
                step > s ? "bg-brown/85 text-white" : "bg-gray-200 text-gray-500"
              }`}>
                {s}
              </span>
              {s < 4 && <div className={`h-1 w-10 md:w-16 transition-all ${step > s ? "bg-brown/85" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        {/* Steps Container */}
        <div className="flex flex-col justify-center space-y-6 min-h-[16rem]">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-brown text-center flex items-center gap-2 justify-center">
                <Stethoscope className="w-5 h-5" /> What symptoms are you experiencing?
              </h2>
              <CreatableSelect
                isMulti
                options={symptomOptions}
                placeholder="Select or type symptoms (e.g. fatigue, acne...)"
                onChange={(val) => setSelectedSymptoms(val as any[])}
                value={selectedSymptoms}
                className="text-black"
              />
              <p className="text-xs text-gray-500 italic text-center">
                Type custom symptoms if they are not listed in the options above.
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-brown text-center flex items-center gap-2 justify-center">
                <Calendar className="w-5 h-5" /> How long have you had these symptoms?
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "under 24h", label: "⏱️ Under 24 Hours" },
                  { value: "2-7 days", label: "🗓️ 2 to 7 Days" },
                  { value: "1-4 weeks", label: "📅 1 to 4 Weeks" },
                  { value: "chronic", label: "⏳ Chronic / Ongoing" }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setDuration(option.value)}
                    className={`p-3 rounded-lg border text-sm font-semibold transition-all ${
                      duration === option.value
                        ? "border-brown bg-brown text-white shadow-md"
                        : "border-gray-200 bg-white/50 text-gray-700 hover:bg-white"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-brown text-center flex items-center gap-2 justify-center">
                <ShieldAlert className="w-5 h-5" /> Select the severity of symptoms
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "mild", label: "🟢 Mild", desc: "Easily ignored" },
                  { value: "moderate", label: "🟡 Moderate", desc: "Noticeable pain" },
                  { value: "severe", label: "🔴 Severe", desc: "Interrupts activity" }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSeverity(option.value)}
                    className={`p-3 rounded-lg border text-sm font-semibold transition-all flex flex-col items-center justify-center ${
                      severity === option.value
                        ? "border-brown bg-brown text-white shadow-md"
                        : "border-gray-200 bg-white/50 text-gray-700 hover:bg-white"
                    }`}
                  >
                    <span>{option.label}</span>
                    <span className="text-[10px] opacity-75 font-normal mt-0.5">{option.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-brown text-center flex items-center gap-2 justify-center">
                <Languages className="w-5 h-5" /> Choose Preferred Language
              </h2>
              <div className="flex justify-center gap-4">
                {[
                  { value: "English", label: "🇺🇸 English" },
                  { value: "Hindi", label: "🇮🇳 हिन्दी (Hindi)" }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setLanguage(option.value)}
                    className={`px-6 py-3 rounded-lg border text-base font-semibold transition-all ${
                      language === option.value
                        ? "border-brown bg-brown text-white shadow-md"
                        : "border-gray-200 bg-white/50 text-gray-700 hover:bg-white"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <div className="pt-4 flex justify-center">
                <button
                  onClick={handleCheck}
                  disabled={loading}
                  className="bg-brown text-white px-8 py-3 rounded-lg hover:bg-[#5c2f00] transition-all font-bold w-full max-w-xs shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-1.5">
                      <span className="dot-loader"></span>
                      <span className="dot-loader delay-200"></span>
                      <span className="dot-loader delay-400"></span>
                    </div>
                  ) : (
                    <>
                      <span>Analyze Health Vector</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Step Navigation Controls */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200/50">
          <button
            onClick={() => setStep((prev) => Math.max(prev - 1, 1))}
            disabled={step === 1 || loading}
            className="flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-brown disabled:opacity-40 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          
          {step < 4 && (
            <button
              onClick={() => setStep((prev) => Math.min(prev + 1, 4))}
              disabled={selectedSymptoms.length === 0}
              className="flex items-center gap-1 text-sm font-semibold text-brown hover:text-[#5c2f00] disabled:opacity-40 transition-all"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Result Analysis Card */}
        {result && (
          <div className="mt-8 bg-white p-5 rounded-lg shadow-lg space-y-4 border border-brown/10 animation-fade-in animate-pulse-once">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-brown flex items-center gap-2">
                <Stethoscope className="w-5 h-5" />
                {language.toLowerCase() === "hindi" ? "विश्लेषण परिणाम" : "Analysis Result"}
              </span>
              {result.urgency && (
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider ${getUrgencyColor(result.urgency)}`}>
                  {language.toLowerCase() === "hindi" ? "त्वरित आवश्यकता" : "Urgency"}: {result.urgency}
                </span>
              )}
            </div>

            {result.urgency === "Emergency" && (
              <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-red-800 flex items-start gap-2.5">
                <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold block mb-1">
                    {language.toLowerCase() === "hindi" ? "🚨 तत्काल चिकित्सा चेतावनी" : "🚨 IMMEDIATE MEDICAL WARNING"}
                  </span>
                  {language.toLowerCase() === "hindi" 
                    ? "कृपया इस सलाह की प्रतीक्षा न करें। तुरंत निकटतम अस्पताल या आपातकालीन कक्ष में जाएं।" 
                    : "Do not wait. If you are experiencing symptoms like severe chest pain, shortness of breath, or heavy bleeding, seek emergency medical care immediately."}
                </div>
              </div>
            )}

            {result.possible_conditions && result.possible_conditions.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-1.5">
                  {language.toLowerCase() === "hindi" ? "संभावित स्थितियां:" : "Possible Conditions:"}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.possible_conditions.map((cond: string, idx: number) => (
                    <span key={idx} className="bg-brown/10 text-brown text-xs px-2.5 py-1 rounded font-medium">
                      {cond}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {result.recommendation && (
              <div className="bg-beige/20 p-3 rounded-lg border border-brown/5">
                <h4 className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-brown" />
                  {language.toLowerCase() === "hindi" ? "एआई सिफारिश:" : "AI Recommendation:"}
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">{result.recommendation}</p>
              </div>
            )}

            <div className="italic text-beige bg-brown px-4 py-2 rounded text-center text-sm font-medium">
              {language.toLowerCase() === "hindi" 
                ? "“जागरूकता ही कल्याण का पहला कदम है।”" 
                : "“Awareness is the first step to wellness.”"}
            </div>

            <div className="flex gap-4 pt-2 justify-center">
              <a
                href="https://gyno-connect-oasis.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-brown text-white px-4 py-2 rounded hover:bg-[#4d2200] transition-all text-sm font-semibold shadow-md"
              >
                <Phone className="w-4 h-4" />
                {language.toLowerCase() === "hindi" ? "डॉक्टर से बात करें" : "Talk to a Doctor"}
              </a>

              <button
                onClick={handleSelfCareClick}
                className="flex items-center gap-2 border border-brown text-brown px-4 py-2 rounded hover:bg-brown hover:text-white transition-all text-sm font-semibold shadow-sm"
              >
                <BookOpen className="w-4 h-4" />
                {language.toLowerCase() === "hindi" ? "स्व-देखभाल युक्तियाँ" : "See Self-Care Tips"}
              </button>

              {showTips && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                  <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative border border-gray-100">
                    <button
                      onClick={() => setShowTips(false)}
                      className="absolute top-2.5 right-3 text-gray-600 hover:text-black text-sm p-1"
                    >
                      ❌
                    </button>
                    <h3 className="text-xl font-bold text-brown mb-4 text-center">
                      🌿 {language.toLowerCase() === "hindi" ? "स्व-देखभाल युक्तियाँ" : "Self-Care Tips"}
                    </h3>
                    {loadingTips ? (
                      <p className="text-center text-gray-500">Loading tips...</p>
                    ) : (
                      <ul className="list-disc list-inside text-sm text-gray-700 space-y-2.5">
                        {(tips.length > 0 ? tips : result.self_care || []).map((tip: string, idx: number) => (
                          <li key={idx} className="leading-relaxed">{tip}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};