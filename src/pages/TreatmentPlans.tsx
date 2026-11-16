import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { 
  UserCheck, 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle, 
  Circle,
  AlertCircle,
  Users,
  Activity,
  FileText,
  Trash2
} from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";

interface Milestone {
  id: number;
  title: string;
  status: "completed" | "in-progress" | "pending";
  dueDate: string;
  completedDate: string | null;
}

interface TreatmentPlan {
  id: string;
  patientName: string;
  patientId: string;
  condition: string;
  startDate: string;
  endDate: string;
  status: "Active" | "Completed" | "Pending";
  progress: number;
  assignedDoctors: string[];
  department: string;
  milestones: Milestone[];
}

const initialTreatmentPlansData: TreatmentPlan[] = [
  {
    id: "1",
    patientName: "Arjun Singh",
    patientId: "P-2024-001",
    condition: "Hypertension Management",
    startDate: "2024-01-15",
    endDate: "2024-04-15",
    status: "Active",
    progress: 65,
    assignedDoctors: ["Dr. Priya Patel", "Dr. Rajesh Kumar"],
    department: "Cardiology",
    milestones: [
      { id: 1, title: "Initial Assessment", status: "completed", dueDate: "2024-01-15", completedDate: "2024-01-15" },
      { id: 2, title: "Medication Start", status: "completed", dueDate: "2024-01-16", completedDate: "2024-01-16" },
      { id: 3, title: "First Follow-up", status: "completed", dueDate: "2024-01-30", completedDate: "2024-01-30" },
      { id: 4, title: "Lab Tests Review", status: "in-progress", dueDate: "2024-02-15", completedDate: null },
      { id: 5, title: "Treatment Adjustment", status: "pending", dueDate: "2024-03-01", completedDate: null },
      { id: 6, title: "Final Assessment", status: "pending", dueDate: "2024-04-15", completedDate: null }
    ]
  },
  {
    id: "2",
    patientName: "Kavya Reddy",
    patientId: "P-2024-002",
    condition: "Diabetes Type 2 Management",
    startDate: "2024-01-10",
    endDate: "2024-07-10",
    status: "Active",
    progress: 40,
    assignedDoctors: ["Dr. Sunita Sharma"],
    department: "Endocrinology",
    milestones: [
      { id: 1, title: "Initial Consultation", status: "completed", dueDate: "2024-01-10", completedDate: "2024-01-10" },
      { id: 2, title: "Diet Plan Creation", status: "completed", dueDate: "2024-01-12", completedDate: "2024-01-12" },
      { id: 3, title: "Medication Protocol", status: "in-progress", dueDate: "2024-02-01", completedDate: null },
      { id: 4, title: "HbA1c Test", status: "pending", dueDate: "2024-03-01", completedDate: null },
      { id: 5, title: "Lifestyle Review", status: "pending", dueDate: "2024-04-01", completedDate: null }
    ]
  },
  {
    id: "3",
    patientName: "Vikram Gupta",
    patientId: "P-2024-003",
    condition: "Post-Surgery Cardiac Rehab",
    startDate: "2024-01-05",
    endDate: "2024-03-05",
    status: "Active",
    progress: 80,
    assignedDoctors: ["Dr. Rajesh Kumar"],
    department: "Cardiology",
    milestones: [
      { id: 1, title: "Surgery Follow-up", status: "completed", dueDate: "2024-01-05", completedDate: "2024-01-05" },
      { id: 2, title: "Physical Therapy Phase 1", status: "completed", dueDate: "2024-01-20", completedDate: "2024-01-20" },
      { id: 3, title: "Stress Test", status: "in-progress", dueDate: "2024-02-10", completedDate: null },
      { id: 4, title: "Final Clearance", status: "pending", dueDate: "2024-03-05", completedDate: null }
    ]
  }
];

export default function TreatmentPlans() {
  const { toast } = useToast();
  const [treatmentPlans, setTreatmentPlans] = useState<TreatmentPlan[]>(initialTreatmentPlansData);
  const [selectedPlan, setSelectedPlan] = useState<TreatmentPlan | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    patientName: "",
    condition: "",
    department: "Cardiology",
    assignedDoctor: "Dr. Rajesh Kumar",
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10),
  });

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientName.trim()) {
      toast({ title: "Patient Name is required", variant: "destructive" });
      return;
    }

    const newPlan: TreatmentPlan = {
      id: String(Date.now()),
      patientName: formData.patientName,
      patientId: `P-${Math.floor(1000 + Math.random() * 9000)}`,
      condition: formData.condition || "General Therapy",
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: "Active",
      progress: 10,
      assignedDoctors: [formData.assignedDoctor],
      department: formData.department,
      milestones: [
        { id: 1, title: "Initial Workup & Evaluation", status: "completed", dueDate: formData.startDate, completedDate: formData.startDate },
        { id: 2, title: "Therapy Protocol Implementation", status: "in-progress", dueDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10), completedDate: null },
        { id: 3, title: "Mid-Term Clinical Evaluation", status: "pending", dueDate: new Date(Date.now() + 45 * 86400000).toISOString().slice(0, 10), completedDate: null },
        { id: 4, title: "Discharge & Outcome Review", status: "pending", dueDate: formData.endDate, completedDate: null }
      ]
    };

    setTreatmentPlans([newPlan, ...treatmentPlans]);
    toast({ title: "New Treatment Plan created successfully" });
    setIsDialogOpen(false);
    setFormData({
      patientName: "",
      condition: "",
      department: "Cardiology",
      assignedDoctor: "Dr. Rajesh Kumar",
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10),
    });
  };

  const handleDeletePlan = (id: string) => {
    if (confirm("Are you sure you want to delete this treatment plan?")) {
      setTreatmentPlans(treatmentPlans.filter(p => p.id !== id));
      if (selectedPlan?.id === id) setSelectedPlan(null);
      toast({ title: "Treatment plan deleted successfully" });
    }
  };

  const activePlans = treatmentPlans.filter(plan => plan.status === "Active").length;
  const completedPlans = treatmentPlans.filter(plan => plan.status === "Completed").length;
  const totalMilestones = treatmentPlans.reduce((acc, plan) => acc + plan.milestones.length, 0);
  const completedMilestones = treatmentPlans.reduce((acc, plan) => 
    acc + plan.milestones.filter(m => m.status === "completed").length, 0);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Treatment Plans</h1>
            <p className="text-muted-foreground mt-1">Manage patient treatment timelines, protocols, and milestones</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            New Treatment Plan
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">{treatmentPlans.length}</p>
                  <p className="text-sm text-muted-foreground">Total Plans</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <UserCheck className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">{activePlans}</p>
                  <p className="text-sm text-muted-foreground">Active Plans</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">{completedMilestones}/{totalMilestones}</p>
                  <p className="text-sm text-muted-foreground">Milestones Met</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">{completedPlans}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Treatment Plans Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {treatmentPlans.map((plan) => (
            <Card key={plan.id} className="hover:shadow-lg transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{plan.patientName}</CardTitle>
                      <Badge variant="outline" className="text-xs">{plan.patientId}</Badge>
                    </div>
                    <p className="text-sm font-medium text-primary">{plan.condition}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={plan.status === "Active" ? "default" : "secondary"}>
                      {plan.status}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive h-8 w-8"
                      onClick={() => handleDeletePlan(plan.id)}
                      title="Delete Plan"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{plan.progress}%</span>
                  </div>
                  <Progress value={plan.progress} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Start: {plan.startDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Target: {plan.endDate}</span>
                  </div>
                </div>

                <div className="border-t pt-3 space-y-2">
                  <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                    Key Milestones ({plan.milestones.filter(m => m.status === 'completed').length}/{plan.milestones.length})
                  </p>
                  <div className="space-y-1.5">
                    {plan.milestones.map((milestone) => (
                      <div key={milestone.id} className="flex items-center justify-between text-xs py-1">
                        <div className="flex items-center gap-2">
                          {milestone.status === "completed" ? (
                            <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                          ) : milestone.status === "in-progress" ? (
                            <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                          ) : (
                            <Circle className="h-3.5 w-3.5 text-muted-foreground" />
                          )}
                          <span className={milestone.status === "completed" ? "line-through text-muted-foreground" : "font-medium"}>
                            {milestone.title}
                          </span>
                        </div>
                        <span className="text-muted-foreground text-[11px]">{milestone.dueDate}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Create Treatment Plan Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>New Treatment Plan</DialogTitle>
              <DialogDescription>
                Set up a structured therapeutic protocol and timeline.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreatePlan} className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="plan_patient">Patient Name *</Label>
                <Input
                  id="plan_patient"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="plan_condition">Diagnosis / Treatment Goal *</Label>
                <Input
                  id="plan_condition"
                  required
                  placeholder="e.g. Post-Cardiac Stent Rehabilitation"
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plan_dept">Department</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(val) => setFormData({ ...formData, department: val })}
                  >
                    <SelectTrigger id="plan_dept">
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cardiology">Cardiology</SelectItem>
                      <SelectItem value="Endocrinology">Endocrinology</SelectItem>
                      <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                      <SelectItem value="Neurology">Neurology</SelectItem>
                      <SelectItem value="General Medicine">General Medicine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="plan_doc">Primary Doctor</Label>
                  <Select
                    value={formData.assignedDoctor}
                    onValueChange={(val) => setFormData({ ...formData, assignedDoctor: val })}
                  >
                    <SelectTrigger id="plan_doc">
                      <SelectValue placeholder="Doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dr. Rajesh Kumar">Dr. Rajesh Kumar</SelectItem>
                      <SelectItem value="Dr. Priya Patel">Dr. Priya Patel</SelectItem>
                      <SelectItem value="Dr. Sunita Sharma">Dr. Sunita Sharma</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_date">Target End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Plan</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
