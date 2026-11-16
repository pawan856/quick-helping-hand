import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  ArrowDownToLine,
  CalendarDays,
  HeartPulse,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

type RangeDays = 7 | 30 | 90;

const rangeOptions: { value: RangeDays; label: string }[] = [
  { value: 7, label: "Last 7 days" },
  { value: 30, label: "Last 30 days" },
  { value: 90, label: "Last 90 days" },
];

const statusColors: Record<string, string> = {
  stable: "hsl(var(--success))",
  monitoring: "hsl(var(--warning))",
  critical: "hsl(var(--destructive))",
  discharged: "hsl(var(--muted-foreground))",
};

function csvCell(value: unknown) {
  const text = String(value ?? "");
  const safeText = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
  return `"${safeText.replace(/"/g, '""')}"`;
}

function downloadCsv(rows: (string | number)[][]) {
  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `healthcare-analytics-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function Analytics() {
  const [rangeDays, setRangeDays] = useState<RangeDays>(30);
  const bounds = useMemo(() => {
    const end = new Date();
    const start = new Date(end);
    start.setDate(start.getDate() - rangeDays + 1);
    start.setHours(0, 0, 0, 0);
    return { start, end };
  }, [rangeDays]);

  const analytics = useQuery({
    queryKey: ["analytics", rangeDays],
    refetchInterval: 60_000,
    queryFn: async () => {
      const [patientResult, appointmentResult, vitalResult] = await Promise.all([
        supabase
          .from("patients")
          .select("id, admitted_at, status, risk_score, primary_condition")
          .order("admitted_at", { ascending: false })
          .limit(1000),
        supabase
          .from("appointments")
          .select("id, scheduled_at, appointment_type, status, patients(full_name)")
          .gte("scheduled_at", bounds.start.toISOString())
          .lte("scheduled_at", bounds.end.toISOString())
          .order("scheduled_at", { ascending: true })
          .limit(1000),
        supabase
          .from("vitals")
          .select("id, heart_rate, bp_systolic, bp_diastolic, spo2, recorded_at")
          .gte("recorded_at", bounds.start.toISOString())
          .lte("recorded_at", bounds.end.toISOString())
          .order("recorded_at", { ascending: false })
          .limit(1000),
      ]);

      if (patientResult.error) throw patientResult.error;
      if (appointmentResult.error) throw appointmentResult.error;
      if (vitalResult.error) throw vitalResult.error;

      return {
        patients: patientResult.data ?? [],
        appointments: appointmentResult.data ?? [],
        vitals: vitalResult.data ?? [],
      };
    },
  });

  const data = analytics.data;
  const activePatients = (data?.patients ?? []).filter((patient) => patient.status !== "discharged");
  const criticalPatients = activePatients.filter((patient) => patient.status === "critical");
  const meanRisk = activePatients.length
    ? Math.round(activePatients.reduce((sum, patient) => sum + patient.risk_score, 0) / activePatients.length)
    : 0;
  const meanHeartRate = (data?.vitals ?? []).filter((vital) => vital.heart_rate !== null);
  const averageHeartRate = meanHeartRate.length
    ? Math.round(meanHeartRate.reduce((sum, vital) => sum + (vital.heart_rate ?? 0), 0) / meanHeartRate.length)
    : null;

  const admissions = (data?.patients ?? []).filter(
    (patient) => patient.admitted_at && new Date(patient.admitted_at) >= bounds.start && new Date(patient.admitted_at) <= bounds.end,
  );
  const timeSeries = useMemo(() => {
    const bucketDays = Math.max(1, Math.ceil(rangeDays / 10));
    const bucketCount = Math.ceil(rangeDays / bucketDays);
    const buckets = Array.from({ length: bucketCount }, (_, index) => {
      const date = new Date(bounds.start);
      date.setDate(date.getDate() + index * bucketDays);
      return {
        date,
        label: date.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        admissions: 0,
        appointments: 0,
      };
    });

    admissions.forEach((patient) => {
      if (!patient.admitted_at) return;
      const offset = Math.floor((new Date(patient.admitted_at).getTime() - bounds.start.getTime()) / (bucketDays * 86_400_000));
      const bucket = buckets[offset];
      if (bucket) bucket.admissions += 1;
    });
    (data?.appointments ?? []).forEach((appointment) => {
      const offset = Math.floor((new Date(appointment.scheduled_at).getTime() - bounds.start.getTime()) / (bucketDays * 86_400_000));
      const bucket = buckets[offset];
      if (bucket) bucket.appointments += 1;
    });
    return buckets;
  }, [admissions, bounds.start, data?.appointments, rangeDays]);

  const appointmentTypes = useMemo(() => {
    const counts = new Map<string, number>();
    (data?.appointments ?? []).forEach((appointment) => {
      const type = appointment.appointment_type || "Other";
      counts.set(type, (counts.get(type) ?? 0) + 1);
    });
    return Array.from(counts, ([name, total]) => ({ name, total })).sort((a, b) => b.total - a.total);
  }, [data?.appointments]);

  const patientStatuses = useMemo(() => {
    const counts = new Map<string, number>();
    (data?.patients ?? []).forEach((patient) => counts.set(patient.status, (counts.get(patient.status) ?? 0) + 1));
    return Array.from(counts, ([name, value]) => ({ name, value }));
  }, [data?.patients]);

  const exportReport = () => {
    const rows: (string | number)[][] = [
      ["Record type", "Date", "Patient", "Category", "Status / value"],
      ...admissions.map((patient) => [
        "Admission",
        patient.admitted_at ? new Date(patient.admitted_at).toLocaleString() : "",
        patient.id,
        patient.primary_condition ?? "",
        patient.status,
      ]),
      ...(data?.appointments ?? []).map((appointment) => [
        "Appointment",
        new Date(appointment.scheduled_at).toLocaleString(),
        appointment.patients?.full_name ?? "",
        appointment.appointment_type,
        appointment.status,
      ]),
      ...(data?.vitals ?? []).map((vital) => [
        "Vital reading",
        new Date(vital.recorded_at).toLocaleString(),
        vital.id,
        "Heart rate / SpO₂",
        `${vital.heart_rate ?? "—"} bpm / ${vital.spo2 ?? "—"}%`,
      ]),
    ];
    downloadCsv(rows);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">Operations overview</p>
            <h1 className="mt-1 text-3xl font-bold text-foreground">Analytics</h1>
            <p className="mt-2 text-muted-foreground">A live view of admissions, appointments, and patient acuity.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={String(rangeDays)} onValueChange={(value) => setRangeDays(Number(value) as RangeDays)}>
              <SelectTrigger className="w-[160px]" aria-label="Analytics date range">
                <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {rangeOptions.map((option) => (
                  <SelectItem key={option.value} value={String(option.value)}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={exportReport} disabled={!data}>
              <ArrowDownToLine className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {analytics.isError && (
          <div role="alert" className="border-l-4 border-l-destructive bg-destructive/5 px-4 py-3 text-sm text-destructive">
            Analytics could not be loaded. Check your connection and try again.
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Active patients" value={analytics.isLoading ? "—" : activePatients.length} description="Currently under care" icon={<Users className="h-4 w-4" />} />
          <StatCard title="New admissions" value={analytics.isLoading ? "—" : admissions.length} description={`In the last ${rangeDays} days`} icon={<TrendingUp className="h-4 w-4" />} status="stable" />
          <StatCard title="Appointments" value={analytics.isLoading ? "—" : data?.appointments.length ?? 0} description={`Scheduled in ${rangeDays} days`} icon={<CalendarDays className="h-4 w-4" />} />
          <StatCard title="Critical patients" value={analytics.isLoading ? "—" : criticalPatients.length} description={`Average risk score: ${meanRisk}`} icon={<Activity className="h-4 w-4" />} status={criticalPatients.length ? "critical" : "success"} />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div>
                <CardTitle className="text-lg">Admissions & appointment activity</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">Activity grouped across the selected period</p>
              </div>
              <Badge variant="secondary" className="shrink-0">Live data</Badge>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                {analytics.isLoading ? (
                  <div className="h-full animate-pulse rounded bg-muted" />
                ) : timeSeries.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={timeSeries} margin={{ top: 12, right: 10, left: -18, bottom: 0 }}>
                      <defs>
                        <linearGradient id="analyticsAdmissions" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.26} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                      <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                      <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--popover-foreground))" }} />
                      <Area type="monotone" dataKey="admissions" name="Admissions" stroke="hsl(var(--primary))" fill="url(#analyticsAdmissions)" strokeWidth={2.5} />
                      <Area type="monotone" dataKey="appointments" name="Appointments" stroke="hsl(var(--accent))" fill="transparent" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No activity recorded in this period.</div>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-5 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-primary" />Admissions</span>
                <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-accent" />Appointments</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Patient status mix</CardTitle>
              <p className="text-sm text-muted-foreground">Current patient census</p>
            </CardHeader>
            <CardContent>
              <div className="relative h-[220px]">
                {analytics.isLoading ? (
                  <div className="h-full animate-pulse rounded bg-muted" />
                ) : patientStatuses.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={patientStatuses} dataKey="value" nameKey="name" innerRadius={58} outerRadius={86} paddingAngle={3}>
                        {patientStatuses.map((entry) => <Cell key={entry.name} fill={statusColors[entry.name] ?? "hsl(var(--primary))"} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--popover-foreground))" }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No patient records yet.</div>
                )}
                {!analytics.isLoading && activePatients.length > 0 && (
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-semibold">{activePatients.length}</span>
                    <span className="text-xs text-muted-foreground">active</span>
                  </div>
                )}
              </div>
              <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-2">
                {patientStatuses.map((status) => (
                  <div key={status.name} className="flex items-center justify-between gap-2 text-sm">
                    <span className="flex min-w-0 items-center gap-2 capitalize text-muted-foreground">
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: statusColors[status.name] ?? "hsl(var(--primary))" }} />
                      <span className="truncate">{status.name}</span>
                    </span>
                    <span className="font-medium tabular-nums">{status.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Appointments by type</CardTitle>
              <p className="text-sm text-muted-foreground">Scheduled during the selected period</p>
            </CardHeader>
            <CardContent>
              <div className="h-[260px]">
                {analytics.isLoading ? (
                  <div className="h-full animate-pulse rounded bg-muted" />
                ) : appointmentTypes.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={appointmentTypes} layout="vertical" margin={{ top: 4, right: 12, left: 8, bottom: 4 }}>
                      <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                      <YAxis type="category" dataKey="name" width={112} tickLine={false} axisLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                      <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--popover-foreground))" }} />
                      <Bar dataKey="total" name="Appointments" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={22} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No appointments in this period.</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Clinical snapshot</CardTitle>
              <p className="text-sm text-muted-foreground">Latest observations within {rangeDays} days</p>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between gap-4 border-b pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary"><HeartPulse className="h-5 w-5" /></span>
                  <div><p className="font-medium">Average heart rate</p><p className="text-sm text-muted-foreground">Across recorded readings</p></div>
                </div>
                <span className="text-xl font-semibold tabular-nums">{averageHeartRate === null ? "—" : `${averageHeartRate} bpm`}</span>
              </div>
              <div className="flex items-center justify-between gap-4 border-b pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-destructive/10 text-destructive"><Activity className="h-5 w-5" /></span>
                  <div><p className="font-medium">High-acuity patients</p><p className="text-sm text-muted-foreground">Currently marked critical</p></div>
                </div>
                <span className="text-xl font-semibold tabular-nums">{analytics.isLoading ? "—" : criticalPatients.length}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-accent/30 text-accent-foreground"><Activity className="h-5 w-5" /></span>
                  <div><p className="font-medium">Vitals recorded</p><p className="text-sm text-muted-foreground">In the selected period</p></div>
                </div>
                <span className="text-xl font-semibold tabular-nums">{analytics.isLoading ? "—" : data?.vitals.length ?? 0}</span>
              </div>
              {analytics.dataUpdatedAt > 0 && (
                <p className="pt-1 text-xs text-muted-foreground">Updated {new Date(analytics.dataUpdatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}