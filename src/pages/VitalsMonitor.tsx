import { useState } from "react";
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
  Loader2,
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
import { useVitals } from "@/hooks/useVitals";
import { usePatients } from "@/hooks/usePatients";
import { useToast } from "@/components/ui/use-toast";
import { format, parseISO } from "date-fns";

const VitalsMonitor = () => {
  const { patients } = usePatients();
  const [selectedPatientId, setSelectedPatientId] = useState<string>("all");
  const { vitals, isLoading, error, recordVital, deleteVital } = useVitals(
    selectedPatientId === "all" ? undefined : selectedPatientId
  );
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    patient_id: "",
    heart_rate: 75,
    bp_systolic: 120,
    bp_diastolic: 80,
    spo2: 98,
    temperature: 98.6,
    respiratory_rate: 16,
  });

  const latestVital = vitals[0];

  const openRecordDialog = () => {
    setFormData({
      patient_id: selectedPatientId !== "all" ? selectedPatientId : (patients[0]?.id || ""),
      heart_rate: 75,
      bp_systolic: 120,
      bp_diastolic: 80,
      spo2: 98,
      temperature: 98.6,
      respiratory_rate: 16,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patient_id) {
      toast({ title: "Please select a patient", variant: "destructive" });
      return;
    }

    try {
      await recordVital.mutateAsync({
        patient_id: formData.patient_id,
        heart_rate: Number(formData.heart_rate),
        bp_systolic: Number(formData.bp_systolic),
        bp_diastolic: Number(formData.bp_diastolic),
        spo2: Number(formData.spo2),
        temperature: Number(formData.temperature),
        respiratory_rate: Number(formData.respiratory_rate),
        recorded_at: new Date().toISOString(),
      });
      toast({ title: "Vitals recorded successfully" });
      setIsDialogOpen(false);
    } catch (err: any) {
      toast({
        title: "Error saving vitals",
        description: err.message || "Failed to record",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this vital reading?")) {
      try {
        await deleteVital.mutateAsync(id);
        toast({ title: "Vital record deleted" });
      } catch (err: any) {
        toast({ title: "Error deleting vital", variant: "destructive" });
      }
    }
  };

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
            <p className="text-muted-foreground">Monitor and record continuous patient physiological signals</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by Patient" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Patients</SelectItem>
                {patients.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={openRecordDialog} className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Record Vitals
            </Button>
          </div>
        </div>

        {/* Latest Vitals Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Heart Rate</CardTitle>
              <Heart className="h-5 w-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {latestVital?.heart_rate ?? "—"}{" "}
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
                {latestVital ? `${latestVital.bp_systolic || 120}/${latestVital.bp_diastolic || 80}` : "—"}{" "}
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
                {latestVital?.spo2 ?? "—"} <span className="text-sm font-normal text-muted-foreground">%</span>
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
                {latestVital?.temperature ?? "—"} <span className="text-sm font-normal text-muted-foreground">°F</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Normal: 97.8°F - 99.1°F</p>
            </CardContent>
          </Card>
        </div>

        {/* History Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center text-lg">
              <span>Vitals History ({vitals.length})</span>
              {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="text-center py-8 text-destructive">
                Error loading vitals: {(error as any).message}
              </div>
            ) : vitals.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Activity className="mx-auto h-12 w-12 opacity-30 mb-3" />
                <p className="text-base font-medium">No vitals recorded yet</p>
                <p className="text-sm">Click "Record Vitals" to add the first measurement.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time Recorded</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Heart Rate</TableHead>
                      <TableHead>Blood Pressure</TableHead>
                      <TableHead>SpO2</TableHead>
                      <TableHead>Temp</TableHead>
                      <TableHead>Respiratory</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vitals.map((v) => {
                      let dateStr = v.recorded_at;
                      try {
                        dateStr = format(parseISO(v.recorded_at), "PPP p");
                      } catch (e) {
                        // ignore
                      }

                      return (
                        <TableRow key={v.id}>
                          <TableCell className="text-xs font-medium">{dateStr}</TableCell>
                          <TableCell>
                            <span className="font-medium text-foreground">
                              {v.patients?.full_name || "Patient"}
                            </span>
                            {v.patients?.mrn && (
                              <span className="text-xs text-muted-foreground ml-1">({v.patients.mrn})</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={v.heart_rate && (v.heart_rate < 60 || v.heart_rate > 100) ? "destructive" : "outline"}>
                              {v.heart_rate || "—"} bpm
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {v.bp_systolic && v.bp_diastolic ? `${v.bp_systolic}/${v.bp_diastolic} mmHg` : "—"}
                          </TableCell>
                          <TableCell>
                            <Badge variant={v.spo2 && v.spo2 < 95 ? "destructive" : "secondary"}>
                              {v.spo2 || "—"}%
                            </Badge>
                          </TableCell>
                          <TableCell>{v.temperature ? `${v.temperature}°F` : "—"}</TableCell>
                          <TableCell>{v.respiratory_rate ? `${v.respiratory_rate}/min` : "—"}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDelete(v.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
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
                Input clinical vital sign observations for the selected patient.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="vital_patient">Select Patient *</Label>
                <Select
                  value={formData.patient_id}
                  onValueChange={(val) => setFormData({ ...formData, patient_id: val })}
                >
                  <SelectTrigger id="vital_patient">
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.full_name} ({p.mrn})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="heart_rate">Heart Rate (bpm)</Label>
                  <Input
                    id="heart_rate"
                    type="number"
                    value={formData.heart_rate}
                    onChange={(e) => setFormData({ ...formData, heart_rate: Number(e.target.value) })}
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
                  <Label htmlFor="bp_systolic">Systolic BP (mmHg)</Label>
                  <Input
                    id="bp_systolic"
                    type="number"
                    value={formData.bp_systolic}
                    onChange={(e) => setFormData({ ...formData, bp_systolic: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bp_diastolic">Diastolic BP (mmHg)</Label>
                  <Input
                    id="bp_diastolic"
                    type="number"
                    value={formData.bp_diastolic}
                    onChange={(e) => setFormData({ ...formData, bp_diastolic: Number(e.target.value) })}
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
                  <Label htmlFor="resp">Respiratory Rate (/min)</Label>
                  <Input
                    id="resp"
                    type="number"
                    value={formData.respiratory_rate}
                    onChange={(e) => setFormData({ ...formData, respiratory_rate: Number(e.target.value) })}
                  />
                </div>
              </div>

              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={recordVital.isPending}>
                  {recordVital.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Vitals
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default VitalsMonitor;
