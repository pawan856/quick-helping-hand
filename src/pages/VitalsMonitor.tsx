import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Activity,
  Heart,
  Thermometer,
  Droplets,
  Plus,
  Trash2,
  Wind
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

export interface LocalVital {
  id: string | number;
  patientName: string;
  heartRate: number;
  bloodPressure: string;
  temperature: number;
  spo2: number;
  respiratoryRate: number;
  timestamp: string;
  recordedBy: string;
  status: "Normal" | "Elevated" | "Critical";
}

const INITIAL_VITALS: LocalVital[] = [
  {
    id: "v-1",
    patientName: "Rajesh Sharma",
    heartRate: 72,
    bloodPressure: "120/80",
    temperature: 98.6,
    spo2: 98,
    respiratoryRate: 16,
    timestamp: "2024-01-20 14:30",
    status: "Normal",
    recordedBy: "Nurse Priya Sharma"
  },
  {
    id: "v-2",
    patientName: "Priya Patel",
    heartRate: 78,
    bloodPressure: "125/82",
    temperature: 99.1,
    spo2: 97,
    respiratoryRate: 18,
    timestamp: "2024-01-20 10:15",
    status: "Elevated",
    recordedBy: "Dr. Rajesh Kumar"
  },
  {
    id: "v-3",
    patientName: "Arjun Singh",
    heartRate: 68,
    bloodPressure: "118/76",
    temperature: 98.4,
    spo2: 99,
    respiratoryRate: 15,
    timestamp: "2024-01-20 06:00",
    status: "Normal",
    recordedBy: "Nurse Kavya Reddy"
  },
  {
    id: "v-4",
    patientName: "Kavya Reddy",
    heartRate: 110,
    bloodPressure: "145/95",
    temperature: 100.4,
    spo2: 93,
    respiratoryRate: 24,
    timestamp: "2024-01-20 04:30",
    status: "Critical",
    recordedBy: "Dr. Sunita Sharma"
  }
];

const LOCAL_STORAGE_KEY_VITALS = "hospital_vitals_data";

export default function VitalsMonitor() {
  const { toast } = useToast();

  const [vitals, setVitals] = useState<LocalVital[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_VITALS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return INITIAL_VITALS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_VITALS, JSON.stringify(vitals));
    } catch (e) {
      // ignore
    }
  }, [vitals]);

  const [selectedPatientFilter, setSelectedPatientFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    patientName: "Rajesh Sharma",
    heartRate: 75,
    bloodPressure: "120/80",
    temperature: 98.6,
    spo2: 98,
    respiratoryRate: 16,
    recordedBy: "Duty Nurse",
  });

  const latestVital = vitals[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hr = Number(formData.heartRate);
    const sp = Number(formData.spo2);
    let calcStatus: "Normal" | "Elevated" | "Critical" = "Normal";

    if (sp < 94 || hr > 105 || hr < 55) {
      calcStatus = "Critical";
    } else if (sp < 96 || hr > 95 || Number(formData.temperature) > 99.5) {
      calcStatus = "Elevated";
    }

    const newVital: LocalVital = {
      id: `v-${Date.now()}`,
      patientName: formData.patientName,
      heartRate: hr,
      bloodPressure: formData.bloodPressure,
      temperature: Number(formData.temperature),
      spo2: sp,
      respiratoryRate: Number(formData.respiratoryRate),
      timestamp: new Date().toLocaleString(),
      recordedBy: formData.recordedBy,
      status: calcStatus,
    };

    setVitals((prev) => [newVital, ...prev]);
    toast({ title: "Vitals recorded successfully" });
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string | number) => {
    if (confirm("Are you sure you want to delete this vital record?")) {
      setVitals((prev) => prev.filter((v) => v.id !== id));
      toast({ title: "Vital record deleted successfully" });
    }
  };

  const filteredVitals = vitals.filter((v) => {
    if (selectedPatientFilter === "all") return true;
    return v.patientName === selectedPatientFilter;
  });

  const uniquePatients = Array.from(new Set(vitals.map((v) => v.patientName)));

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center">
              <Activity className="mr-3 h-8 w-8 text-primary" />
              Real-time Vitals Monitor
            </h1>
            <p className="text-muted-foreground">Monitor and track patient physiological vital signs</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedPatientFilter} onValueChange={setSelectedPatientFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter Patient" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Patients</SelectItem>
                {uniquePatients.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={() => setIsDialogOpen(true)} className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Record Vitals
            </Button>
          </div>
        </div>

        {/* Latest Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Heart Rate</CardTitle>
              <Heart className="h-5 w-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {latestVital ? latestVital.heartRate : "—"}{" "}
                <span className="text-sm font-normal text-muted-foreground">bpm</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Normal: 60 - 100 bpm</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Blood Pressure</CardTitle>
              <Activity className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {latestVital ? latestVital.bloodPressure : "—"}{" "}
                <span className="text-sm font-normal text-muted-foreground">mmHg</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Target: 120/80 mmHg</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-cyan-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Oxygen (SpO2)</CardTitle>
              <Droplets className="h-5 w-5 text-cyan-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {latestVital ? latestVital.spo2 : "—"}{" "}
                <span className="text-sm font-normal text-muted-foreground">%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Target: ≥ 95%</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Temperature</CardTitle>
              <Thermometer className="h-5 w-5 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {latestVital ? latestVital.temperature : "—"}{" "}
                <span className="text-sm font-normal text-muted-foreground">°F</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Normal: 97.8°F - 99.1°F</p>
            </CardContent>
          </Card>
        </div>

        {/* History Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Vitals History ({filteredVitals.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredVitals.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Activity className="mx-auto h-12 w-12 opacity-30 mb-3" />
                <p className="text-base font-medium">No vitals records found</p>
                <p className="text-sm">Click "Record Vitals" to add a reading.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Heart Rate</TableHead>
                      <TableHead>Blood Pressure</TableHead>
                      <TableHead>SpO2</TableHead>
                      <TableHead>Temperature</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Recorded By</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVitals.map((v) => (
                      <TableRow key={v.id}>
                        <TableCell className="text-xs font-medium">{v.timestamp}</TableCell>
                        <TableCell className="font-semibold">{v.patientName}</TableCell>
                        <TableCell>
                          <Badge variant={v.heartRate > 100 || v.heartRate < 60 ? "destructive" : "outline"}>
                            {v.heartRate} bpm
                          </Badge>
                        </TableCell>
                        <TableCell>{v.bloodPressure} mmHg</TableCell>
                        <TableCell>
                          <Badge variant={v.spo2 < 95 ? "destructive" : "secondary"}>
                            {v.spo2}%
                          </Badge>
                        </TableCell>
                        <TableCell>{v.temperature}°F</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              v.status === "Critical"
                                ? "destructive"
                                : v.status === "Elevated"
                                ? "secondary"
                                : "outline"
                            }
                            className={v.status === "Normal" ? "text-emerald-700 bg-emerald-50" : ""}
                          >
                            {v.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{v.recordedBy}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(v.id)}
                            title="Delete Vital Record"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Record Vitals Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Record Patient Vitals</DialogTitle>
              <DialogDescription>
                Input clinical observations and vitals for a patient.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="vital_patient">Patient Name *</Label>
                <Input
                  id="vital_patient"
                  required
                  placeholder="e.g. Rajesh Sharma"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                  <Input
                    id="heartRate"
                    type="number"
                    value={formData.heartRate}
                    onChange={(e) => setFormData({ ...formData, heartRate: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="spo2">SpO2 Oxygen (%)</Label>
                  <Input
                    id="spo2"
                    type="number"
                    value={formData.spo2}
                    onChange={(e) => setFormData({ ...formData, spo2: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bp">Blood Pressure</Label>
                  <Input
                    id="bp"
                    placeholder="120/80"
                    value={formData.bloodPressure}
                    onChange={(e) => setFormData({ ...formData, bloodPressure: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="temp">Temperature (°F)</Label>
                  <Input
                    id="temp"
                    type="number"
                    step="0.1"
                    value={formData.temperature}
                    onChange={(e) => setFormData({ ...formData, temperature: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resp">Respiratory (/min)</Label>
                  <Input
                    id="resp"
                    type="number"
                    value={formData.respiratoryRate}
                    onChange={(e) => setFormData({ ...formData, respiratoryRate: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="by">Recorded By</Label>
                  <Input
                    id="by"
                    value={formData.recordedBy}
                    onChange={(e) => setFormData({ ...formData, recordedBy: e.target.value })}
                  />
                </div>
              </div>

              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Vitals</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
