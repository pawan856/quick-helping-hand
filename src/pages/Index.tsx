import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Calendar, 
  FileText, 
  Activity,
  TrendingUp,
  Clock,
  Heart,
  AlertCircle
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
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Healthcare Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, Dr. Smith</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Heart className="mr-2 h-4 w-4" />
            New Patient
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Appointments */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Today's Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
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
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      appointment.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : appointment.status === 'in-progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appointment.status}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="mr-2 h-5 w-5" />
                Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="p-3 border rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        alert.priority === 'high' 
                          ? 'bg-red-500' 
                          : alert.priority === 'medium'
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
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
    </Layout>
  );
};

export default Index;
