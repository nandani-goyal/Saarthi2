import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Upload, FileText, Plus, Heart, Activity, Shield, Calculator, Stethoscope, Pill, Scan, Camera, Eye, Database, Lock, Key, Sparkles, Loader2, Clock, CheckCircle2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { 
  uploadPrescription, 
  uploadMedicalScan, 
  fetchPrescriptions, 
  fetchMedicalScans, 
  getSignedDocumentUrl, 
  PrescriptionRecord, 
  MedicalScanRecord, 
  SignedUrlResponse 
} from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Health Metrics State
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState("");
  const [bp, setBp] = useState({ systolic: "", diastolic: "" });
  const [sugar, setSugar] = useState("");
  const [bpResult, setBpResult] = useState("");
  const [sugarResult, setSugarResult] = useState("");

  // Backend Integration & Security State
  const [prescriptions, setPrescriptions] = useState<PrescriptionRecord[]>([]);
  const [scans, setScans] = useState<MedicalScanRecord[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);
  const [ocrStatusMessage, setOcrStatusMessage] = useState("");
  const [uploadCategory, setUploadCategory] = useState<'prescription' | 'scan'>('prescription');

  // Secure Signed Document Viewer Modal State
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [signedDocData, setSignedDocData] = useState<SignedUrlResponse | null>(null);
  const [isLoadingSignedUrl, setIsLoadingSignedUrl] = useState(false);

  // Health monitoring data
  const healthData = [
    { month: 'Jan', weight: 70, bp: 120, sugar: 95 },
    { month: 'Feb', weight: 69, bp: 118, sugar: 92 },
    { month: 'Mar', weight: 68, bp: 122, sugar: 88 },
    { month: 'Apr', weight: 67, bp: 115, sugar: 94 },
    { month: 'May', weight: 66, bp: 120, sugar: 90 },
    { month: 'Jun', weight: 65, bp: 118, sugar: 87 },
  ];

  // Fetch initial prescriptions & scans from MongoDB on mount
  useEffect(() => {
    loadDatabaseRecords();
  }, []);

  const loadDatabaseRecords = async () => {
    try {
      const fetchedPrescriptions = await fetchPrescriptions();
      setPrescriptions(fetchedPrescriptions);
      const fetchedScans = await fetchMedicalScans();
      setScans(fetchedScans);
    } catch (err) {
      console.warn("Could not connect to live backend server, using cached demo data:", err);
      // Fallback initial data if server is booting up
      setPrescriptions([
        {
          _id: "demo-1",
          doctorName: "Dr. Sarah Johnson",
          specialization: "Internal Medicine",
          date: "2024-06-15",
          status: "Active",
          medicines: [
            { name: "Iron Supplement (Ferrous Fumarate)", dosage: "325mg", frequency: "Take once daily with food", duration: "30 days" },
            { name: "Vitamin D3 Cholecalciferol", dosage: "2000 IU", frequency: "Take once daily", duration: "60 days" }
          ],
          createdAt: new Date().toISOString()
        }
      ]);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setIsUploading(true);

    if (uploadCategory === 'prescription') {
      setIsOcrProcessing(true);
      setOcrStatusMessage("Encrypting server-side (AES-256) & Running Tesseract.js OCR engine...");

      try {
        const result = await uploadPrescription(file);
        setOcrStatusMessage("Auto-populating extracted medicine names and prescription details...");
        
        toast({
          title: "Prescription Processed & Encrypted!",
          description: `AES-256 Encrypted at rest. Tesseract OCR extracted ${result.prescription.medicines.length} medicines.`,
        });

        await loadDatabaseRecords();
      } catch (error: any) {
        toast({
          title: "Upload Failed",
          description: error.message || "Failed to process prescription with OCR",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
        setIsOcrProcessing(false);
        setOcrStatusMessage("");
      }
    } else {
      try {
        await uploadMedicalScan(file);
        toast({
          title: "Medical Scan Encrypted & Saved!",
          description: "Scan encrypted with AES-256 and saved to MongoDB saarthi-auth database.",
        });
        await loadDatabaseRecords();
      } catch (error: any) {
        toast({
          title: "Upload Failed",
          description: error.message || "Failed to upload medical scan",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleViewSecureDocument = async (documentId?: string) => {
    if (!documentId) {
      toast({
        title: "No Encrypted Document Attached",
        description: "This sample prescription is demonstration data without an attached document buffer.",
      });
      return;
    }

    setIsLoadingSignedUrl(true);
    try {
      const signedData = await getSignedDocumentUrl(documentId);
      setSignedDocData(signedData);
      setPreviewModalOpen(true);
      toast({
        title: "Expiring Signed URL Generated",
        description: `URL generated with HMAC-SHA256 verification (Expires in ${signedData.ttlSeconds}s).`,
      });
    } catch (err: any) {
      toast({
        title: "Access Denied",
        description: err.message || "Failed to acquire signed access URL",
        variant: "destructive",
      });
    } finally {
      setIsLoadingSignedUrl(false);
    }
  };

  const calculateBMI = () => {
    if (weight && height) {
      const heightInMeters = parseFloat(height) / 100;
      const calculatedBMI = parseFloat(weight) / (heightInMeters * heightInMeters);
      setBmi(parseFloat(calculatedBMI.toFixed(1)));
      
      if (calculatedBMI < 18.5) setBmiCategory("Underweight - Consider increasing caloric intake");
      else if (calculatedBMI >= 18.5 && calculatedBMI < 25) setBmiCategory("Normal weight - Excellent! Keep maintaining");
      else if (calculatedBMI >= 25 && calculatedBMI < 30) setBmiCategory("Overweight - Consider diet and exercise");
      else setBmiCategory("Obese - Consult healthcare provider");
    }
  };

  const checkBloodPressure = () => {
    if (bp.systolic && bp.diastolic) {
      const systolic = parseInt(bp.systolic);
      const diastolic = parseInt(bp.diastolic);
      
      if (systolic < 120 && diastolic < 80) {
        setBpResult("Normal - Your blood pressure is in the healthy range");
      } else if (systolic < 130 && diastolic < 80) {
        setBpResult("Elevated - Monitor closely and consider lifestyle changes");
      } else if (systolic < 140 || diastolic < 90) {
        setBpResult("High Blood Pressure Stage 1 - Consult your doctor");
      } else {
        setBpResult("High Blood Pressure Stage 2 - Seek immediate medical attention");
      }
    }
  };

  const checkBloodSugar = () => {
    if (sugar) {
      const sugarLevel = parseInt(sugar);
      
      if (sugarLevel < 100) {
        setSugarResult("Normal - Your blood sugar is in healthy range");
      } else if (sugarLevel < 126) {
        setSugarResult("Pre-diabetes - Consider dietary changes and exercise");
      } else {
        setSugarResult("Diabetes range - Consult your doctor immediately");
      }
    }
  };

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-stone-100">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        className="hidden" 
        accept="image/*,application/pdf"
      />

      {/* Header Section */}
      <div className="border-b border-stone-300 bg-gradient-to-r from-stone-100 to-stone-200 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-stone-800 to-amber-900 rounded-xl flex items-center justify-center shadow-lg"
               style={{ color: 'hsl(25, 50%, 20%)' }}
              >
                <Database className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-3xl font-bold font-serif" style={{ color: 'hsl(25, 50%, 20%)' }}>MediVault</h1>
                  <Badge className="bg-amber-800 text-white font-sans text-xs">Saarthi Module</Badge>
                </div>
                <p className="text-sm text-stone-700 font-medium">Project Saarthi - Medical Records & Health Journal Vault</p>
              </div>
            </div>
            
            {/* Security Badges Header */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center space-x-2 bg-emerald-100 px-3 py-1.5 rounded-full border border-emerald-300">
                <Lock className="w-4 h-4 text-emerald-800" />
                <span className="text-emerald-900 font-semibold text-xs">AES-256 Encrypted</span>
              </div>
              <div className="flex items-center space-x-2 bg-amber-100 px-3 py-1.5 rounded-full border border-amber-300">
                <Key className="w-4 h-4 text-amber-800" />
                <span className="text-amber-900 font-semibold text-xs">Expiring Signed URLs</span>
              </div>
              <div className="flex items-center space-x-2 bg-blue-100 px-3 py-1.5 rounded-full border border-blue-300">
                <Sparkles className="w-4 h-4 text-blue-800" />
                <span className="text-blue-900 font-semibold text-xs">Tesseract.js OCR</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cream-500/20 to-amber-800/20 z-10"></div>
        <div 
          className="bg-cover bg-center bg-no-repeat py-16" 
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')`
          }}
        >
          <div className="container mx-auto px-6 relative z-20">
            <div className="text-center mb-8 bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-stone-200">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 font-serif leading-tight" style={{ color: 'hsl(25, 50%, 20%)' }}>
                Encrypted Medical Vault & OCR Auto-Parser
              </h2>
              <p className="text-lg text-stone-800 mb-6 max-w-4xl mx-auto leading-relaxed">
                Store prescriptions and scans with <strong>AES-256 server-side encryption at rest</strong>, stream with <strong>expiring signed URLs</strong>, and auto-extract medicine data with <strong>Tesseract.js OCR</strong>.
              </p>

              {/* Navigation Action Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3 justify-center">
                <Button 
                  onClick={() => scrollToSection('upload-section')}
                  className="bg-gradient-to-r from-amber-950 to-amber-600 px-4 py-3 rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all text-sm"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload & OCR
                </Button>
                <Button 
                  onClick={() => scrollToSection('bmi-section')}
                  className="bg-gradient-to-r from-amber-950 to-amber-600 px-4 py-3 rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all text-sm"
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Calculators
                </Button>
                <Button 
                  onClick={() => scrollToSection('prescriptions-section')}
                  className="bg-gradient-to-r from-amber-950 to-amber-600 px-4 py-3 rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all text-sm"
                >
                  <Pill className="w-4 h-4 mr-2" />
                  Prescriptions
                </Button>
                <Button 
                  onClick={() => scrollToSection('records-section')}
                  className="bg-gradient-to-r from-amber-950 to-amber-600 px-4 py-3 rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all text-sm"
                >
                  <Stethoscope className="w-4 h-4 mr-2" />
                  Records
                </Button>
                <Button 
                  onClick={() => scrollToSection('scans-section')}
                  className="bg-gradient-to-r from-amber-950 to-amber-600 px-4 py-3 rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all text-sm"
                >
                  <Scan className="w-4 h-4 mr-2" />
                  Scans & X-Rays
                </Button>
                <Button 
                  onClick={() => scrollToSection('monitoring-section')}
                  className="bg-gradient-to-r from-amber-950 to-amber-600 px-4 py-3 rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all text-sm"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Monitoring
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12" style={{ color: 'hsl(25, 50%, 20%)' }}>
        
        {/* Upload Section with Tesseract.js OCR Pipeline */}
        <section id="upload-section" className="mb-16">
          <Card className="border-3 border-stone-300 bg-gradient-to-br from-white to-stone-50 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-stone-100 to-stone-200 rounded-t-lg flex flex-row items-center justify-between">
              <CardTitle className="text-2xl font-bold flex items-center" style={{ color: 'hsl(25, 50%, 15%)' }}>
                <Upload className="w-7 h-7 mr-3 text-amber-900" />
                Upload & Auto-Extract Prescription (OCR)
              </CardTitle>
              <div className="flex gap-2">
                <Button 
                  variant={uploadCategory === 'prescription' ? 'default' : 'outline'}
                  onClick={() => setUploadCategory('prescription')}
                  className={uploadCategory === 'prescription' ? 'bg-amber-900 text-white' : 'border-stone-400'}
                  size="sm"
                >
                  <Pill className="w-4 h-4 mr-1" /> Prescription + OCR
                </Button>
                <Button 
                  variant={uploadCategory === 'scan' ? 'default' : 'outline'}
                  onClick={() => setUploadCategory('scan')}
                  className={uploadCategory === 'scan' ? 'bg-stone-900 text-white' : 'border-stone-400'}
                  size="sm"
                >
                  <Scan className="w-4 h-4 mr-1" /> Scan / X-Ray
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-3 border-dashed border-amber-400 rounded-2xl p-10 mb-6 bg-gradient-to-br from-stone-50 via-amber-50 to-stone-100 hover:from-amber-100 hover:to-orange-50 transition-all cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-amber-800 to-stone-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        {isUploading ? <Loader2 className="w-10 h-10 animate-spin" /> : <Upload className="w-10 h-10" />}
                      </div>
                      <h3 className="text-2xl font-bold mb-2" style={{ color: 'hsl(25, 50%, 20%)' }}>
                        {uploadCategory === 'prescription' ? 'Upload Prescription Image / PDF' : 'Upload Medical Scan / X-Ray'}
                      </h3>
                      <p className="text-amber-800 mb-4 font-medium text-sm">
                        {uploadCategory === 'prescription' 
                          ? 'Auto-extracts medicines & dates using Tesseract.js OCR pipeline.' 
                          : 'Encrypted server-side at rest with AES-256-GCM.'}
                      </p>

                      {isOcrProcessing && (
                        <div className="mb-4 p-3 bg-amber-100 border border-amber-300 rounded-xl flex items-center justify-center space-x-2 text-amber-900 font-semibold text-sm animate-pulse">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>{ocrStatusMessage}</span>
                        </div>
                      )}

                      <div className="flex gap-2 justify-center">
                        <Button className="bg-amber-900 hover:bg-amber-800 text-white" disabled={isUploading}>
                          <FileText className="w-4 h-4 mr-2" />
                          {isUploading ? 'Processing File...' : 'Browse Local Files'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Feature Card */}
                <div className="bg-gradient-to-br from-stone-900 to-amber-950 rounded-2xl border-2 border-stone-700 p-6 shadow-xl text-white flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <Shield className="w-8 h-8 text-amber-400" />
                      <h3 className="text-2xl font-bold font-serif text-amber-100">Medical Data Security Architecture</h3>
                    </div>
                    <div className="space-y-4 text-stone-300 text-sm">
                      <div className="flex items-start space-x-3 bg-white/5 p-3 rounded-lg border border-white/10">
                        <Lock className="w-5 h-5 text-amber-400 mt-0.5" />
                        <div>
                          <strong className="text-white block">Server-Side AES-256-GCM Encryption at Rest</strong>
                          Files are encrypted before touching disk/storage with unique initialization vectors (IV) and authentication tags.
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 bg-white/5 p-3 rounded-lg border border-white/10">
                        <Key className="w-5 h-5 text-emerald-400 mt-0.5" />
                        <div>
                          <strong className="text-white block">Expiring HMAC Signed URLs (Zero Public Access)</strong>
                          No public storage buckets. Files are streamed only through time-limited HMAC-SHA256 signed access tokens.
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 bg-white/5 p-3 rounded-lg border border-white/10">
                        <Database className="w-5 h-5 text-blue-400 mt-0.5" />
                        <div>
                          <strong className="text-white block">Shared MongoDB Database (saarthi-auth)</strong>
                          Prescription and document collections reside directly in the unified Project Saarthi database.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Prescription Management Section (Auto-Populated via Tesseract.js OCR) */}
        <section id="prescriptions-section" className="mb-16">
          <Card className="border-3 border-stone-300 bg-gradient-to-br from-white to-stone-50 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-stone-100 to-stone-200 rounded-t-lg flex items-center justify-between">
              <CardTitle className="text-2xl font-bold flex items-center" style={{ color: 'hsl(25, 50%, 20%)' }}>
                <Pill className="w-7 h-7 mr-3 text-amber-900" />
                Prescription Management (OCR Auto-Extracted)
              </CardTitle>
              <Button onClick={() => fileInputRef.current?.click()} className="bg-amber-900 hover:bg-amber-800 text-white" size="sm">
                <Plus className="w-4 h-4 mr-2" /> Upload New Prescription
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold" style={{ color: 'hsl(25, 50%, 20%)' }}>
                      Stored Prescriptions ({prescriptions.length})
                    </h3>
                  </div>
                  
                  {prescriptions.map((rx) => (
                    <div key={rx._id} className="bg-gradient-to-r from-white to-amber-50/40 border-2 border-stone-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-bold text-stone-900 text-lg flex items-center">
                            {rx.doctorName}
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 ml-2" />
                          </h4>
                          <p className="text-stone-600 text-sm">{rx.specialization || 'Internal Medicine'}</p>
                          <p className="text-xs text-stone-500 mt-1">Prescribed Date: <strong>{rx.date}</strong></p>
                        </div>
                        <Badge className="bg-emerald-100 text-emerald-900 border-emerald-300">Active</Badge>
                      </div>
                      
                      {/* Extracted Medicines List */}
                      <div className="space-y-2 mb-4">
                        <div className="text-xs font-bold text-amber-900 uppercase tracking-wider">Auto-Extracted Medicines (OCR):</div>
                        {rx.medicines.map((med, idx) => (
                          <div key={idx} className="flex justify-between items-center p-3 bg-stone-50 rounded-lg border border-stone-200 text-sm">
                            <div>
                              <div className="font-semibold text-stone-900">{med.name}</div>
                              <div className="text-xs text-stone-600">{med.dosage} • {med.frequency}</div>
                            </div>
                            <div className="text-xs font-semibold text-stone-700 bg-stone-200 px-2.5 py-1 rounded">
                              {med.duration || '30 days'}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleViewSecureDocument(rx.documentId)}
                          disabled={isLoadingSignedUrl}
                          className="border-stone-400 hover:bg-stone-100 text-stone-900"
                        >
                          <Eye className="w-4 h-4 mr-2 text-amber-800" />
                          View Document (Signed URL)
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <div 
                    className="h-80 bg-cover bg-center rounded-2xl border-2 border-stone-300 shadow-lg mb-4"
                    style={{
                      backgroundImage: `url('https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')`
                    }}
                  >
                    <div className="h-full bg-gradient-to-t from-stone-900/80 to-transparent rounded-2xl flex items-end p-6">
                      <div className="text-white">
                        <h3 className="text-2xl font-bold mb-1">OCR Prescription Scanning</h3>
                        <p className="text-stone-200 text-sm">Tesseract.js extracts medicine names, dosages, frequencies, and doctor dates automatically.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Health Calculators Section */}
        <section id="bmi-section" className="mb-16">
          <Card className="border-3 border-stone-300 bg-gradient-to-br from-white to-stone-50 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-stone-100 to-stone-200 rounded-t-lg">
              <CardTitle className="text-2xl font-bold flex items-center">
                <Calculator className="w-7 h-7 mr-3 text-stone-800" style={{ color: 'hsl(25, 50%, 25%)' }}/>
                Health Metrics Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* BMI Calculator */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold " style={{ color: 'hsl(25, 50%, 20%)' }}>BMI Calculator</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-stone-800 font-semibold mb-2 block">Weight (kg)</Label>
                      <Input 
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="Enter weight"
                        className="border-stone-300 focus:border-stone-500 bg-white text-lg p-3"
                      />
                    </div>
                    <div>
                      <Label className="text-stone-800 font-semibold mb-2 block">Height (cm)</Label>
                      <Input 
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        placeholder="Enter height"
                        className="border-stone-300 focus:border-stone-500 bg-white text-lg p-3"
                      />
                    </div>
                  </div>
                  
                  <Button 
                    onClick={calculateBMI}
                    className="w-full bg-gradient-to-r from-amber-800 to-stone-900 text-white py-4 text-lg font-semibold shadow-lg"
                  >
                    Calculate BMI
                  </Button>

                  {bmi && (
                    <div className="p-6 bg-gradient-to-br from-stone-100 to-stone-200 rounded-xl border-2 border-stone-300 shadow-lg">
                      <div className="text-center mb-4">
                        <div className="text-4xl font-bold text-stone-900 mb-2">{bmi}</div>
                        <div className="text-lg text-stone-700 font-semibold">{bmiCategory}</div>
                      </div>
                      <Progress value={Math.min((bmi / 35) * 100, 100)} className="h-4" />
                    </div>
                  )}
                </div>

                {/* Blood Pressure Calculator */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold " style={{ color: 'hsl(25, 50%, 20%)' }}>Blood Pressure</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-stone-800 font-semibold mb-2 block">Systolic</Label>
                      <Input 
                        value={bp.systolic}
                        onChange={(e) => setBp({...bp, systolic: e.target.value})}
                        placeholder="120"
                        className="border-stone-300 focus:border-stone-500 bg-white text-lg p-3"
                      />
                    </div>
                    <div>
                      <Label className="text-stone-800 font-semibold mb-2 block">Diastolic</Label>
                      <Input 
                        value={bp.diastolic}
                        onChange={(e) => setBp({...bp, diastolic: e.target.value})}
                        placeholder="80"
                        className="border-stone-300 focus:border-stone-500 bg-white text-lg p-3"
                      />
                    </div>
                  </div>
                  
                  <Button 
                    onClick={checkBloodPressure}
                    className="w-full bg-gradient-to-r from-amber-800 to-stone-900 text-white py-4 text-lg font-semibold shadow-lg"
                  >
                    Check BP
                  </Button>

                  {bpResult && (
                    <div className="p-6 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl border-2 border-amber-300 shadow-lg">
                      <div className="text-center">
                        <div className="text-lg text-stone-700 font-semibold">{bpResult}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Blood Sugar Calculator */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold " style={{ color: 'hsl(25, 50%, 20%)' }}>Blood Sugar</h3>
                  <div>
                    <Label className=" font-semibold mb-2 block" style={{ color: 'hsl(25, 50%, 20%)' }}>Sugar Level (mg/dL)</Label>
                    <Input 
                      value={sugar}
                      onChange={(e) => setSugar(e.target.value)}
                      placeholder="90-100"
                      className="border-amber-300 focus:border-amber-500 bg-white text-lg p-3"
                      style={{ color: 'hsl(25, 50%, 20%)' }}
                    />
                  </div>
                  
                  <Button 
                    onClick={checkBloodSugar}
                    className="w-full bg-gradient-to-r from-amber-800 to-stone-900 text-white py-4 text-lg font-semibold shadow-lg"
                  >
                    Check Sugar
                  </Button>

                  {sugarResult && (
                    <div className="p-6 bg-gradient-to-br from-stone-100 to-stone-200 rounded-xl border-2 border-stone-300 shadow-lg">
                      <div className="text-center">
                        <div className="text-lg text-stone-700 font-semibold">{sugarResult}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Health Monitoring Section with Graph */}
        <section id="monitoring-section" className="mb-16">
          <Card className="border-3 border-amber-300 bg-gradient-to-br from-white to-amber-50 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-stone-50 to-stone-200 rounded-t-lg">
              <CardTitle className=" text-2xl font-bold flex items-center" style={{ color: 'hsl(25, 50%, 20%)' }}>
                <Activity className="w-7 h-7 mr-3 text-stone-800" />
                Health Monitoring Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-stone-50 to-stone-100 p-6 rounded-2xl border-2 border-stone-200 shadow-lg">
                  <h3 className="text-xl font-bold text-stone-900 mb-6 flex items-center">
                    <div className="w-3 h-3 bg-stone-600 rounded-full mr-3"></div>
                    Weight & BP Trends
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={healthData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#A8A29E" />
                      <XAxis dataKey="month" stroke="#57534E" fontSize={12} fontWeight="bold" />
                      <YAxis stroke="#57534E" fontSize={12} fontWeight="bold" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#F5F5F4', 
                          border: '2px solid #78716C',
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px rgba(107, 64, 35, 0.46)'
                        }} 
                      />
                      <Line type="monotone" dataKey="weight" stroke="#78716C" strokeWidth={3} dot={{ fill: '#78716C', strokeWidth: 2, r: 5 }} />
                      <Line type="monotone" dataKey="bp" stroke="#44403C" strokeWidth={3} dot={{ fill: '#44403C', strokeWidth: 2, r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-gradient-to-br from-stone-50 to-stone-100 p-6 rounded-2xl border-2 border-stone-200 shadow-lg">
                  <h3 className="text-xl font-bold text-stone-900 mb-6 flex items-center">
                    <div className="w-3 h-3 bg-stone-600 rounded-full mr-3"></div>
                    Blood Sugar Levels
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={healthData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#A8A29E" />
                      <XAxis dataKey="month" stroke="#57534E" fontSize={12} fontWeight="bold" />
                      <YAxis stroke="#57534E" fontSize={12} fontWeight="bold" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#F5F5F4', 
                          border: '2px solid #78716C',
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                        }} 
                      />
                      <Bar dataKey="sugar" fill="#78716C" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Scans & Reports Section */}
        <section id="scans-section" className="mb-16">
          <Card className="border-3 border-stone-300 bg-gradient-to-br from-white to-stone-50 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-stone-100 to-stone-200 rounded-t-lg">
              <CardTitle className="text-stone-900 text-2xl font-bold flex items-center">
                <Scan className="w-7 h-7 mr-3 text-stone-800" />
                Medical Scans & X-Rays (Encrypted)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-stone-900">Stored Medical Scans</h3>
                    <Button onClick={() => { setUploadCategory('scan'); fileInputRef.current?.click(); }} className="bg-stone-800 hover:bg-stone-900 text-white">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Scan
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {scans.length === 0 ? (
                      <div className="p-6 bg-stone-50 border-2 border-stone-200 rounded-2xl text-center text-stone-600">
                        No medical scans uploaded yet. Use the upload button above to add AES-256 encrypted X-Rays or lab scans.
                      </div>
                    ) : (
                      scans.map((scanItem) => (
                        <div key={scanItem.id} className="bg-gradient-to-r from-white to-stone-50 border-2 border-stone-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center border-2 border-blue-300">
                              <Scan className="w-8 h-8 text-blue-700" />
                            </div>
                            <div>
                              <h4 className="font-bold text-stone-900 text-lg">{scanItem.originalName}</h4>
                              <p className="text-stone-600 text-sm">Uploaded: {new Date(scanItem.createdAt).toLocaleDateString()}</p>
                              <Badge className="bg-emerald-100 text-emerald-900 border-emerald-300 mt-1">AES-256 Encrypted</Badge>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleViewSecureDocument(scanItem.id)} className="border-stone-400">
                              <Eye className="w-4 h-4 mr-2 text-amber-800" />
                              View (Expiring Signed URL)
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div>
                  <div 
                    className="h-80 bg-cover bg-center rounded-2xl border-2 border-stone-300 shadow-lg mb-6"
                    style={{
                      backgroundImage: `url('https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')`
                    }}
                  >
                    <div className="h-full bg-gradient-to-t from-stone-900/70 to-transparent rounded-2xl flex items-end p-6">
                      <div className="text-white">
                        <h3 className="text-2xl font-bold mb-2">Digital Imaging Vault</h3>
                        <p className="text-stone-200">Advanced medical imaging storage protected with HMAC signed access links.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

      </div>

      {/* Secure Expiring Signed URL Viewer Dialog */}
      <Dialog open={previewModalOpen} onOpenChange={setPreviewModalOpen}>
        <DialogContent className="max-w-3xl bg-stone-900 text-white border-amber-500/50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-amber-400 flex items-center space-x-2">
              <Key className="w-6 h-6 text-amber-400" />
              <span>Secure Document Stream (Signed Token Verified)</span>
            </DialogTitle>
            <DialogDescription className="text-stone-300 text-sm">
              This stream is decrypted on-the-fly and served using an HMAC-SHA256 expiring signed URL.
            </DialogDescription>
          </DialogHeader>

          {signedDocData && (
            <div className="space-y-4 pt-2">
              <div className="bg-amber-950/60 border border-amber-500/40 p-4 rounded-xl space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center text-amber-200 font-sans text-sm font-semibold">
                  <span className="flex items-center"><Clock className="w-4 h-4 mr-1.5 text-amber-400" /> URL Expiration:</span>
                  <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/50">Valid for {signedDocData.ttlSeconds} seconds</Badge>
                </div>
                <div className="break-all text-stone-400 bg-black/40 p-2 rounded">
                  <span className="text-amber-500 font-bold">Signed Stream Endpoint: </span>
                  {signedDocData.signedUrl}
                </div>
                <div className="text-emerald-400 font-sans text-xs">
                  ✓ AES-256 Decrypted server-side on-the-fly | Zero public bucket exposure.
                </div>
              </div>

              {/* Document Display Frame */}
              <div className="h-96 w-full bg-black rounded-xl overflow-hidden border border-stone-700 flex items-center justify-center">
                <iframe 
                  src={signedDocData.signedUrl} 
                  className="w-full h-full border-none"
                  title="Secure Encrypted Document Stream"
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
