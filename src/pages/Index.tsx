import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PatientTrendChart } from "@/components/charts/PatientTrendChart";
import { AppointmentHeatmap } from "@/components/charts/AppointmentHeatmap";
import { VitalSignsGauge } from "@/components/charts/VitalSignsGauge";
import { SmartSearch } from "@/components/premium/SmartSearch";
import { 
  Users, 
  Calendar, 
  FileText, 
  Activity,
  TrendingUp,
  Clock,
  Heart,
  AlertCircle,
  Search
} from "lucide-react";

const Index = () => {
  const stats = [
    {
      title: "Total Patients",
      value: "2,847",
      change: "+12%",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Today's Appointments",
      value: "24",
      change: "+3",
      icon: Calendar,
      color: "text-green-600"
    },
    {
      title: "Medical Records",
      value: "1,293",
      change: "+5%",
      icon: FileText,
      color: "text-purple-600"
    },
    {
      title: "Health Score",
      value: "94.2%",
      change: "+2.1%",
      icon: Activity,
      color: "text-orange-600"
    }
  ];

  const recentAppointments = [
    { id: 1, patient: "John Smith", time: "09:00 AM", type: "Consultation", status: "completed" },
    { id: 2, patient: "Sarah Johnson", time: "10:30 AM", type: "Follow-up", status: "in-progress" },
    { id: 3, patient: "Mike Brown", time: "11:15 AM", type: "Check-up", status: "upcoming" },
    { id: 4, patient: "Emma Davis", time: "02:00 PM", type: "Consultation", status: "upcoming" },
  ];

  const alerts = [
    { id: 1, message: "Patient John Smith requires follow-up", priority: "high" },
    { id: 2, message: "Lab results ready for review", priority: "medium" },
    { id: 3, message: "Equipment maintenance scheduled", priority: "low" },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-foreground">Good morning, Dr. Wilson</h1>
            <p className="text-muted-foreground">
              You have 24 appointments today and 5 critical alerts requiring attention.
            </p>
          </div>
          <Button className="hover-lift hover-glow">
            <Heart className="h-4 w-4 mr-2" />
            Add Patient
          </Button>
        </div>

        {/* Key Metrics using StatCard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              description="from last month"
              icon={<stat.icon className="h-4 w-4" />}
              trend={{ value: parseInt(stat.change.replace(/[^0-9]/g, '')), isPositive: !stat.change.includes('-') }}
              className="animate-fade-in hover-glow"
            />
          ))}
        </div>

        {/* Rest of dashboard content */}
        {/* Premium Smart Search */}
        <div className="flex justify-center">
          <SmartSearch className="w-full max-w-4xl" />
        </div>

        {/* Enhanced Dashboard with Premium Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <PatientTrendChart />
          <AppointmentHeatmap />
        </div>

        {/* Real-time Vital Signs */}
        <VitalSignsGauge />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 hover-lift glass-premium">
            <CardHeader>
              <CardTitle className="flex items-center font-heading">
                <Calendar className="mr-2 h-5 w-5" />
                Today's Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-all duration-300 hover-lift">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{appointment.time}</span>
                      </div>
                      <div>
                        <p className="font-medium">{appointment.patient}</p>
                        <p className="text-sm text-muted-foreground">{appointment.type}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      appointment.status === 'completed' 
                        ? 'status-stable' 
                        : appointment.status === 'in-progress'
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'status-warning'
                    }`}>
                      {appointment.status}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="mr-2 h-5 w-5" />
                Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        alert.priority === 'high' 
                          ? 'bg-destructive' 
                          : alert.priority === 'medium'
                          ? 'bg-warning'
                          : 'bg-success'
                      }`} />
                      <p className="text-sm">{alert.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
