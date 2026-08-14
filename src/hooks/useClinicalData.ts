import { useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type PatientStatus = "stable" | "monitoring" | "critical" | "discharged";

export interface Patient {
  id: string;
  full_name: string;
  mrn: string;
  date_of_birth: string | null;
  gender: string | null;
  blood_group: string | null;
  primary_condition: string | null;
  status: PatientStatus;
  risk_score: number;
  admitted_at: string | null;
}

export interface Appointment {
  id: string;
  scheduled_at: string;
  duration_minutes: number;
  appointment_type: string;
  status: "scheduled" | "in_progress" | "completed" | "cancelled" | "no_show";
  notes: string | null;
  patients: { full_name: string; mrn: string } | null;
}

export interface Vital {
  id: string;
  patient_id: string;
  heart_rate: number | null;
  bp_systolic: number | null;
  bp_diastolic: number | null;
  spo2: number | null;
  temperature: number | null;
  respiratory_rate: number | null;
  recorded_at: string;
  patients?: { full_name: string } | null;
}

export interface Alert {
  id: string;
  severity: "low" | "medium" | "high" | "critical";
  category: string;
  message: string;
  acknowledged: boolean;
  created_at: string;
  patients: { full_name: string } | null;
}

export function usePatients() {
  return useQuery({
    queryKey: ["patients"],
    queryFn: async (): Promise<Patient[]> => {
      const { data, error } = await supabase
        .from("patients")
        .select("id, full_name, mrn, date_of_birth, gender, blood_group, primary_condition, status, risk_score, admitted_at")
        .order("risk_score", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Patient[];
    },
  });
}

export function useTodayAppointments() {
  return useQuery({
    queryKey: ["appointments", "today"],
    queryFn: async (): Promise<Appointment[]> => {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      const { data, error } = await supabase
        .from("appointments")
        .select("id, scheduled_at, duration_minutes, appointment_type, status, notes, patients(full_name, mrn)")
        .gte("scheduled_at", start.toISOString())
        .lt("scheduled_at", end.toISOString())
        .order("scheduled_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as Appointment[];
    },
  });
}

export function useRecentVitals(limit = 40) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("vitals-stream")
      .on("postgres_changes", { event: "*", schema: "public", table: "vitals" }, () => {
        queryClient.invalidateQueries({ queryKey: ["vitals"] });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ["vitals", limit],
    queryFn: async (): Promise<Vital[]> => {
      const { data, error } = await supabase
        .from("vitals")
        .select("id, patient_id, heart_rate, bp_systolic, bp_diastolic, spo2, temperature, respiratory_rate, recorded_at, patients(full_name)")
        .order("recorded_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return (data ?? []) as unknown as Vital[];
    },
  });
}

export function useAlerts() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("alerts-stream")
      .on("postgres_changes", { event: "*", schema: "public", table: "alerts" }, () => {
        queryClient.invalidateQueries({ queryKey: ["alerts"] });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ["alerts"],
    queryFn: async (): Promise<Alert[]> => {
      const { data, error } = await supabase
        .from("alerts")
        .select("id, severity, category, message, acknowledged, created_at, patients(full_name)")
        .order("created_at", { ascending: false })
        .limit(30);
      if (error) throw error;
      return (data ?? []) as unknown as Alert[];
    },
  });
}

export function useAcknowledgeAlert() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data: userData } = await supabase.auth.getUser();
      const { error } = await supabase
        .from("alerts")
        .update({ acknowledged: true, acknowledged_by: userData.user?.id ?? null })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      toast.success("Alert acknowledged");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

const DEMO_PATIENTS = [
  { full_name: "Rajesh Sharma", gender: "Male", blood_group: "B+", primary_condition: "Post-op cardiac monitoring", status: "critical", risk_score: 88, date_of_birth: "1962-04-11" },
  { full_name: "Priya Patel", gender: "Female", blood_group: "O+", primary_condition: "Type 2 diabetes", status: "monitoring", risk_score: 61, date_of_birth: "1978-09-02" },
  { full_name: "Arjun Singh", gender: "Male", blood_group: "A+", primary_condition: "Hypertension", status: "stable", risk_score: 34, date_of_birth: "1985-01-23" },
  { full_name: "Kavya Reddy", gender: "Female", blood_group: "AB+", primary_condition: "Asthma follow-up", status: "stable", risk_score: 22, date_of_birth: "1994-06-30" },
  { full_name: "Meera Iyer", gender: "Female", blood_group: "O-", primary_condition: "Sepsis watch", status: "critical", risk_score: 92, date_of_birth: "1957-11-19" },
  { full_name: "Vikram Nair", gender: "Male", blood_group: "B-", primary_condition: "Renal insufficiency", status: "monitoring", risk_score: 70, date_of_birth: "1969-03-08" },
] as const;

export function useSeedDemoData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id ?? null;

      const { data: patients, error: patientError } = await supabase
        .from("patients")
        .insert(
          DEMO_PATIENTS.map((p) => ({
            ...p,
            admitted_at: new Date(Date.now() - Math.random() * 6 * 86400000).toISOString(),
            primary_doctor_id: userId,
            created_by: userId,
          })),
        )
        .select("id, full_name, risk_score");
      if (patientError) throw patientError;

      const now = Date.now();
      const appointments = (patients ?? []).map((p, i) => ({
        patient_id: p.id,
        doctor_id: userId,
        scheduled_at: new Date(new Date().setHours(9 + i, i % 2 === 0 ? 0 : 30, 0, 0)).toISOString(),
        appointment_type: ["Consultation", "Follow-up", "Check-up", "Review"][i % 4],
        status: (i === 0 ? "completed" : i === 1 ? "in_progress" : "scheduled") as "completed" | "in_progress" | "scheduled",
      }));
      const { error: apptError } = await supabase.from("appointments").insert(appointments);
      if (apptError) throw apptError;

      const vitals = (patients ?? []).flatMap((p) =>
        Array.from({ length: 8 }, (_, k) => {
          const critical = p.risk_score > 80;
          return {
            patient_id: p.id,
            heart_rate: Math.round((critical ? 108 : 74) + Math.random() * 14 - 7),
            bp_systolic: Math.round((critical ? 148 : 120) + Math.random() * 12 - 6),
            bp_diastolic: Math.round((critical ? 94 : 78) + Math.random() * 8 - 4),
            spo2: Math.round((critical ? 92 : 98) - Math.random() * 2),
            temperature: Number(((critical ? 38.4 : 36.8) + Math.random() * 0.6 - 0.3).toFixed(1)),
            respiratory_rate: Math.round((critical ? 24 : 16) + Math.random() * 4 - 2),
            recorded_at: new Date(now - (7 - k) * 45 * 60000).toISOString(),
            recorded_by: userId,
          };
        }),
      );
      const { error: vitalError } = await supabase.from("vitals").insert(vitals);
      if (vitalError) throw vitalError;

      const alerts = (patients ?? [])
        .filter((p) => p.risk_score > 55)
        .map((p) => ({
          patient_id: p.id,
          severity: (p.risk_score > 85 ? "critical" : p.risk_score > 68 ? "high" : "medium") as "critical" | "high" | "medium",
          category: "clinical",
          message:
            p.risk_score > 85
              ? `${p.full_name}: SpO2 trending below 93% — immediate review required`
              : `${p.full_name}: elevated readings over the last 3 hours`,
        }));
      if (alerts.length) {
        const { error: alertError } = await supabase.from("alerts").insert(alerts);
        if (alertError) throw alertError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success("Demo clinical data loaded");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
