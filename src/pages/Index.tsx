import { useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ClinicalAssistant } from "@/components/premium/ClinicalAssistant";
import { useAuth } from "@/hooks/useAuth";
import {
  usePatients,
  useTodayAppointments,
  useRecentVitals,
  useAlerts,
  useAcknowledgeAlert,
  useSeedDemoData,
} from "@/hooks/useClinicalData";
import {
  Users,
  Calendar,
  Activity,
  AlertCircle,
  Clock,
  HeartPulse,
  Database,
  Loader2,
  CheckCheck,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const statusTone: Record<string, string> = {
  critical: "bg-destructive/10 text-destructive border border-destructive/20",
  monitoring: "bg-warning/10 text-warning-foreground border border-warning/30",
  stable: "bg-success/10 text-success border border-success/20",
  discharged: "bg-muted text-muted-foreground border border-border",
};

const severityTone: Record<string, string> = {
  critical: "bg-destructive",
  high: "bg-medical-critical",
  medium: "bg-warning",
  low: "bg-success",
};

const Index = () => {
  const { profile } = useAuth();
  const patients = usePatients();
  const appointments = useTodayAppointments();
  const vitals = useRecentVitals();
  const alerts = useAlerts();
  const acknowledge = useAcknowledgeAlert();
  const seed = useSeedDemoData();

  const openAlerts = (alerts.data ?? []).filter((a) => !a.acknowledged);
  const criticalPatients = (patients.data ?? []).filter((p) => p.status === "critical");
  const activePatients = (patients.data ?? []).filter((p) => p.status !== "discharged");

  const occupancy = useMemo(() => {
    const total = patients.data?.length ?? 0;
    if (!total) return 0;
    return Math.round((activePatients.length / total) * 100);
  }, [patients.data, activePatients.length]);

  const vitalsSeries = useMemo(() => {
    const rows = [...(vitals.data ?? [])].reverse();
    return rows.map((v) => ({
      time: new Date(v.recorded_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      heartRate: v.heart_rate ?? 0,
      spo2: v.spo2 ?? 0,
    }));
  }, [vitals.data]);

  const avgRisk = useMemo(() => {
    const list = patients.data ?? [];
    if (!list.length) return 0;
    return Math.round(list.reduce((sum, p) => sum + p.risk_score, 0) / list.length);
  }, [patients.data]);

  const isEmpty =
    !patients.isLoading && (patients.data?.length ?? 0) === 0;

  const greetingName = profile?.full_name ?? "Doctor";

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-foreground">Welcome back, {greetingName}</h1>
            <p className="text-muted-foreground">
              {appointments.data?.length ?? 0} appointments today · {openAlerts.length} open alerts ·{" "}
              {criticalPatients.length} critical patients
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isEmpty && (
              <Button onClick={() => seed.mutate()} disabled={seed.isPending}>
                {seed.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Database className="h-4 w-4 mr-2" />
                )}
                Load demo data
              </Button>
            )}
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Active Patients"
            value={activePatients.length}
            description="currently under care"
            icon={<Users className="h-4 w-4" />}
          />
          <StatCard
            title="Today's Appointments"
            value={appointments.data?.length ?? 0}
            description="across all departments"
            icon={<Calendar className="h-4 w-4" />}
          />
          <StatCard
            title="Open Alerts"
            value={openAlerts.length}
            description="awaiting acknowledgement"
            icon={<AlertCircle className="h-4 w-4" />}
            status={openAlerts.some((a) => a.severity === "critical") ? "critical" : undefined}
          />
          <StatCard
            title="Average Risk Score"
            value={`${avgRisk}`}
            description="cohort weighted"
            icon={<Activity className="h-4 w-4" />}
            status={avgRisk > 70 ? "warning" : "success"}
          />
        </div>

        {/* Vitals stream + assistant */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Card className="xl:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <span className="p-2 rounded-lg bg-primary/10 text-primary">
                  <HeartPulse className="h-4 w-4" />
                </span>
                Live vitals stream
              </CardTitle>
              <Badge variant="secondary" className="text-xs">Realtime</Badge>
            </CardHeader>
            <CardContent className="h-[300px]">
              {vitalsSeries.length === 0 ? (
                <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                  No vitals recorded yet.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={vitalsSeries}>
                    <defs>
                      <linearGradient id="hrGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="spo2Gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "0.5rem",
                        color: "hsl(var(--popover-foreground))",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="heartRate"
                      name="Heart rate"
                      stroke="hsl(var(--primary))"
                      fill="url(#hrGradient)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="spo2"
                      name="SpO2"
                      stroke="hsl(var(--accent))"
                      fill="url(#spo2Gradient)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <ClinicalAssistant />
        </div>

        {/* Roster + alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-4 w-4" />
                Highest-risk patients
              </CardTitle>
              <Badge variant="secondary" className="text-xs">Bed utilisation {occupancy}%</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {(patients.data ?? []).slice(0, 6).map((patient) => (
                <div
                  key={patient.id}
                  className="flex items-center justify-between gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="font-medium truncate">{patient.full_name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {patient.mrn} · {patient.primary_condition ?? "No condition recorded"}
                    </p>
                  </div>
                  <div className="w-28 hidden sm:block">
                    <Progress value={patient.risk_score} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">Risk {patient.risk_score}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusTone[patient.status]}`}>
                    {patient.status}
                  </span>
                </div>
              ))}
              {(patients.data?.length ?? 0) === 0 && (
                <p className="text-sm text-muted-foreground">No patients yet.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertCircle className="h-4 w-4" />
                Alert center
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {openAlerts.length === 0 && (
                <p className="text-sm text-muted-foreground">All alerts acknowledged.</p>
              )}
              {openAlerts.slice(0, 6).map((alert) => (
                <div key={alert.id} className="p-3 border rounded-lg space-y-2">
                  <div className="flex items-start gap-2">
                    <span className={`w-2 h-2 rounded-full mt-1.5 ${severityTone[alert.severity]}`} />
                    <p className="text-sm flex-1">{alert.message}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground uppercase">{alert.severity}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs"
                      onClick={() => acknowledge.mutate(alert.id)}
                      disabled={acknowledge.isPending}
                    >
                      <CheckCheck className="h-3 w-3 mr-1" />
                      Acknowledge
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-4 w-4" />
              Today's schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(appointments.data ?? []).length === 0 && (
              <p className="text-sm text-muted-foreground">No appointments scheduled for today.</p>
            )}
            {(appointments.data ?? []).map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {new Date(appointment.scheduled_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <div>
                    <p className="font-medium">{appointment.patients?.full_name ?? "Unknown patient"}</p>
                    <p className="text-xs text-muted-foreground">{appointment.appointment_type}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs capitalize">
                  {appointment.status.replace("_", " ")}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Index;
