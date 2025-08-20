import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  FileText
} from "lucide-react";
import { motion } from "framer-motion";

const treatmentPlansData = [
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
    condition: "Post-Surgery Recovery",
    startDate: "2024-01-05",
    endDate: "2024-02-05",
    status: "Completed",
    progress: 100,
    assignedDoctors: ["Dr. Amit Verma", "Dr. Priya Patel"],
    department: "Surgery",
    milestones: [
      { id: 1, title: "Post-Op Assessment", status: "completed", dueDate: "2024-01-06", completedDate: "2024-01-06" },
      { id: 2, title: "Pain Management", status: "completed", dueDate: "2024-01-10", completedDate: "2024-01-08" },
      { id: 3, title: "Physiotherapy Start", status: "completed", dueDate: "2024-01-15", completedDate: "2024-01-15" },
      { id: 4, title: "Wound Check", status: "completed", dueDate: "2024-01-25", completedDate: "2024-01-25" },
      { id: 5, title: "Final Clearance", status: "completed", dueDate: "2024-02-05", completedDate: "2024-02-03" }
    ]
  }
];

const MilestoneTimeline = ({ milestones }: { milestones: any[] }) => {
  return (
    <div className="space-y-4">
      {milestones.map((milestone, index) => (
        <div key={milestone.id} className="flex items-start gap-4">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              milestone.status === 'completed' 
                ? 'bg-success text-success-foreground' 
                : milestone.status === 'in-progress'
                ? 'bg-warning text-warning-foreground animate-pulse'
                : 'bg-muted text-muted-foreground'
            }`}>
              {milestone.status === 'completed' ? (
                <CheckCircle className="h-4 w-4" />
              ) : milestone.status === 'in-progress' ? (
                <AlertCircle className="h-4 w-4" />
              ) : (
                <Circle className="h-4 w-4" />
              )}
            </div>
            {index < milestones.length - 1 && (
              <div className={`w-0.5 h-8 mt-2 ${
                milestone.status === 'completed' ? 'bg-success' : 'bg-muted'
              }`} />
            )}
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{milestone.title}</h4>
              <Badge variant={
                milestone.status === 'completed' ? 'secondary' :
                milestone.status === 'in-progress' ? 'default' : 'outline'
              }>
                {milestone.status === 'completed' ? 'Completed' : 
                 milestone.status === 'in-progress' ? 'In Progress' : 'Pending'}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Due: {milestone.dueDate}</span>
              {milestone.completedDate && (
                <span>Completed: {milestone.completedDate}</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function TreatmentPlans() {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const activePlans = treatmentPlansData.filter(plan => plan.status === "Active").length;
  const completedPlans = treatmentPlansData.filter(plan => plan.status === "Completed").length;
  const totalMilestones = treatmentPlansData.reduce((acc, plan) => acc + plan.milestones.length, 0);
  const completedMilestones = treatmentPlansData.reduce((acc, plan) => 
    acc + plan.milestones.filter(m => m.status === "completed").length, 0);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">Treatment Plans</h1>
            <p className="text-muted-foreground mt-1">Manage patient treatment timelines and progress tracking</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Treatment Plan
          </Button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card className="hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">{treatmentPlansData.length}</p>
                  <p className="text-sm text-muted-foreground">Total Plans</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <UserCheck className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-success">{activePlans}</p>
                  <p className="text-sm text-muted-foreground">Active</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-muted-foreground">{completedPlans}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-muted/10 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-accent">{Math.round((completedMilestones / totalMilestones) * 100)}%</p>
                  <p className="text-sm text-muted-foreground">Avg Progress</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Treatment Plans Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {treatmentPlansData.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer glass-morphism"
                    onClick={() => setSelectedPlan(plan)}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{plan.patientName}</CardTitle>
                      <p className="text-sm text-muted-foreground">{plan.patientId}</p>
                    </div>
                    <Badge variant={plan.status === "Active" ? "secondary" : "outline"}>
                      {plan.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm mb-1">Condition</h4>
                    <p className="text-sm text-muted-foreground">{plan.condition}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Start Date</p>
                      <p className="font-medium">{plan.startDate}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">End Date</p>
                      <p className="font-medium">{plan.endDate}</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm text-muted-foreground">{plan.progress}%</span>
                    </div>
                    <Progress value={plan.progress} className="h-2" />
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Assigned Team</p>
                    <div className="flex items-center gap-2">
                      {plan.assignedDoctors.map((doctor, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {doctor.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground">{doctor}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{plan.department}</Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <CheckCircle className="h-3 w-3" />
                      {plan.milestones.filter(m => m.status === "completed").length}/{plan.milestones.length} milestones
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Selected Plan Details Modal */}
        {selectedPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedPlan(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-background rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedPlan.condition}</h2>
                    <p className="text-muted-foreground">{selectedPlan.patientName} - {selectedPlan.patientId}</p>
                  </div>
                  <Button variant="ghost" onClick={() => setSelectedPlan(null)}>
                    ×
                  </Button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{selectedPlan.progress}%</p>
                    <p className="text-sm text-muted-foreground">Complete</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-success">
                      {selectedPlan.milestones.filter((m: any) => m.status === "completed").length}
                    </p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-warning">
                      {selectedPlan.milestones.filter((m: any) => m.status === "pending").length}
                    </p>
                    <p className="text-sm text-muted-foreground">Pending</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Treatment Timeline</h3>
                  <MilestoneTimeline milestones={selectedPlan.milestones} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}