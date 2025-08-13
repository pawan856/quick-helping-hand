import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Search, 
  Plus, 
  Download, 
  Eye,
  Calendar,
  User,
  Activity,
  Pill,
  TestTube,
  Heart
} from "lucide-react";

const MedicalRecords = () => {
  const records = [
    {
      id: 1,
      patient: "John Smith",
      date: "2024-01-15",
      type: "Consultation",
      doctor: "Dr. Johnson",
      diagnosis: "Hypertension",
      status: "completed",
      category: "cardiology"
    },
    {
      id: 2,
      patient: "Sarah Johnson",
      date: "2024-01-12",
      type: "Lab Results",
      doctor: "Dr. Smith",
      diagnosis: "Blood Sugar Test",
      status: "reviewed",
      category: "laboratory"
    },
    {
      id: 3,
      patient: "Mike Brown",
      date: "2024-01-10",
      type: "Prescription",
      doctor: "Dr. Wilson",
      diagnosis: "Asthma Medication",
      status: "active",
      category: "pharmacy"
    },
    {
      id: 4,
      patient: "Emma Davis",
      date: "2024-01-08",
      type: "X-Ray",
      doctor: "Dr. Brown",
      diagnosis: "Knee Joint",
      status: "completed",
      category: "radiology"
    }
  ];

  const vitals = [
    { label: "Blood Pressure", value: "120/80", unit: "mmHg", status: "normal" },
    { label: "Heart Rate", value: "72", unit: "bpm", status: "normal" },
    { label: "Temperature", value: "98.6", unit: "°F", status: "normal" },
    { label: "Weight", value: "165", unit: "lbs", status: "normal" },
    { label: "Blood Sugar", value: "95", unit: "mg/dL", status: "normal" },
    { label: "Oxygen Saturation", value: "98", unit: "%", status: "normal" }
  ];

  const medications = [
    { name: "Lisinopril", dosage: "10mg", frequency: "Once daily", prescribed: "2024-01-01" },
    { name: "Metformin", dosage: "500mg", frequency: "Twice daily", prescribed: "2024-01-05" },
    { name: "Albuterol", dosage: "90mcg", frequency: "As needed", prescribed: "2024-01-10" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800';
      case 'active':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cardiology':
        return <Heart className="h-4 w-4" />;
      case 'laboratory':
        return <TestTube className="h-4 w-4" />;
      case 'pharmacy':
        return <Pill className="h-4 w-4" />;
      case 'radiology':
        return <Activity className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center">
              <FileText className="mr-3 h-8 w-8 text-primary" />
              Medical Records
            </h1>
            <p className="text-muted-foreground">Comprehensive patient health records and history</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            New Record
          </Button>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search records by patient, diagnosis, or doctor..." 
                    className="pl-10"
                  />
                </div>
              </div>
              <Button variant="outline">Filter</Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="records" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="records">All Records</TabsTrigger>
            <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="records" className="space-y-4">
            {records.map((record) => (
              <Card key={record.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-accent rounded-lg">
                        {getCategoryIcon(record.category)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{record.patient}</h3>
                          <Badge variant="outline" className="text-xs">
                            {record.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{record.diagnosis}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Calendar className="mr-1 h-3 w-3" />
                            {record.date}
                          </span>
                          <span className="flex items-center">
                            <User className="mr-1 h-3 w-3" />
                            {record.doctor}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={getStatusColor(record.status)}>
                        {record.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="vitals" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vitals.map((vital, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{vital.label}</p>
                        <p className="text-2xl font-bold">
                          {vital.value} <span className="text-sm font-normal text-muted-foreground">{vital.unit}</span>
                        </p>
                      </div>
                      <Badge variant={vital.status === 'normal' ? 'default' : 'destructive'} className="bg-green-100 text-green-800">
                        {vital.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="medications" className="space-y-4">
            {medications.map((medication, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Pill className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{medication.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {medication.dosage} • {medication.frequency}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Prescribed: {medication.prescribed}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardContent className="p-6 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Reports Available</h3>
                <p className="text-muted-foreground">Medical reports and lab results will appear here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MedicalRecords;