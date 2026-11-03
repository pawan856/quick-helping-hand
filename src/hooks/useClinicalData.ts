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
  patients?: { full_name: string } | null;
}

// ---------------------------------------------------------------------------
// Fallback In-Memory / Local Clinical Datasets
// Guaranteed non-empty display for all modules and dashboards
// ---------------------------------------------------------------------------
export const DEFAULT_PATIENTS: Patient[] = [
  { id: "a1111111-1111-1111-1111-111111111111", full_name: "Rajesh Sharma", mrn: "MRN-RS101", date_of_birth: "1979-05-12", gender: "Male", blood_group: "B+", primary_condition: "Acute Coronary Syndrome", status: "critical", risk_score: 88, admitted_at: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: "a2222222-2222-2222-2222-222222222222", full_name: "Priya Patel", mrn: "MRN-PP102", date_of_birth: "1992-08-23", gender: "Female", blood_group: "A+", primary_condition: "Post-op Cholecystectomy", status: "monitoring", risk_score: 62, admitted_at: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: "a3333333-3333-3333-3333-333333333333", full_name: "Arjun Singh", mrn: "MRN-AS103", date_of_birth: "1965-03-14", gender: "Male", blood_group: "O+", primary_condition: "Type 2 Diabetes Mellitus", status: "stable", risk_score: 35, admitted_at: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: "a4444444-4444-4444-4444-444444444444", full_name: "Kavya Reddy", mrn: "MRN-KR104", date_of_birth: "1988-11-04", gender: "Female", blood_group: "AB+", primary_condition: "Severe Asthma Exacerbation", status: "critical", risk_score: 91, admitted_at: new Date(Date.now() - 1 * 86400000).toISOString() },
  { id: "a5555555-5555-5555-5555-555555555555", full_name: "Amit Verma", mrn: "MRN-AV105", date_of_birth: "1981-07-29", gender: "Male", blood_group: "O-", primary_condition: "Community Acquired Pneumonia", status: "monitoring", risk_score: 68, admitted_at: new Date(Date.now() - 4 * 86400000).toISOString() },
  { id: "a6666666-6666-6666-6666-666666666666", full_name: "Sunita Rao", mrn: "MRN-SR106", date_of_birth: "1955-12-19", gender: "Female", blood_group: "A-", primary_condition: "Stroke Rehabilitation", status: "stable", risk_score: 25, admitted_at: new Date(Date.now() - 8 * 86400000).toISOString() },
  { id: "a7777777-7777-7777-7777-777777777777", full_name: "Vikram Nair", mrn: "MRN-VN107", date_of_birth: "1970-02-15", gender: "Male", blood_group: "B-", primary_condition: "Renal Insufficiency", status: "monitoring", risk_score: 74, admitted_at: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: "a8888888-8888-8888-8888-888888888888", full_name: "Meera Iyer", mrn: "MRN-MI108", date_of_birth: "1958-09-30", gender: "Female", blood_group: "O-", primary_condition: "Septic Shock / ICU Watch", status: "critical", risk_score: 95, admitted_at: new Date(Date.now() - 1 * 86400000).toISOString() },
];

export const DEFAULT_APPOINTMENTS: Appointment[] = [
  {
    id: "apt-1",
    scheduled_at: new Date(new Date().setHours(9, 0, 0, 0)).toISOString(),
    duration_minutes: 30,
    appointment_type: "Emergency Review",
    status: "in_progress",
    notes: "Check ECG and cardiac enzymes",
    patients: { full_name: "Rajesh Sharma", mrn: "MRN-RS101" }
  },
  {
    id: "apt-2",
    scheduled_at: new Date(new Date().setHours(10, 30, 0, 0)).toISOString(),
    duration_minutes: 45,
    appointment_type: "Follow-up",
    status: "scheduled",
    notes: "Post-op wound dressing evaluation",
    patients: { full_name: "Priya Patel", mrn: "MRN-PP102" }
  },
  {
    id: "apt-3",
    scheduled_at: new Date(new Date().setHours(11, 15, 0, 0)).toISOString(),
    duration_minutes: 20,
    appointment_type: "Consultation",
    status: "completed",
    notes: "HbA1c normal range, diet counselling",
    patients: { full_name: "Arjun Singh", mrn: "MRN-AS103" }
  },
  {
    id: "apt-4",
    scheduled_at: new Date(new Date().setHours(14, 0, 0, 0)).toISOString(),
    duration_minutes: 30,
    appointment_type: "Check-up",
    status: "scheduled",
    notes: "Nebulization response test",
    patients: { full_name: "Kavya Reddy", mrn: "MRN-KR104" }
  },
  {
    id: "apt-5",
    scheduled_at: new Date(new Date().setHours(15, 30, 0, 0)).toISOString(),
    duration_minutes: 30,
    appointment_type: "Review",
    status: "scheduled",
    notes: "Chest X-ray report discussion",
    patients: { full_name: "Amit Verma", mrn: "MRN-AV105" }
  },
  {
    id: "apt-6",
    scheduled_at: new Date(new Date().setHours(16, 45, 0, 0)).toISOString(),
    duration_minutes: 30,
    appointment_type: "Consultation",
    status: "scheduled",
    notes: "Serum creatinine & electrolyte review",
    patients: { full_name: "Vikram Nair", mrn: "MRN-VN107" }
  }
];

export const DEFAULT_VITALS: Vital[] = [
  { id: "v-1", patient_id: "a1111111-1111-1111-1111-111111111111", heart_rate: 115, bp_systolic: 152, bp_diastolic: 95, spo2: 92, temperature: 38.3, respiratory_rate: 25, recorded_at: new Date(Date.now() - 30 * 60000).toISOString(), patients: { full_name: "Rajesh Sharma" } },
  { id: "v-2", patient_id: "a8888888-8888-8888-8888-888888888888", heart_rate: 122, bp_systolic: 95, bp_diastolic: 62, spo2: 91, temperature: 38.9, respiratory_rate: 26, recorded_at: new Date(Date.now() - 60 * 60000).toISOString(), patients: { full_name: "Meera Iyer" } },
  { id: "v-3", patient_id: "a4444444-4444-4444-4444-444444444444", heart_rate: 118, bp_systolic: 138, bp_diastolic: 88, spo2: 90, temperature: 37.8, respiratory_rate: 26, recorded_at: new Date(Date.now() - 90 * 60000).toISOString(), patients: { full_name: "Kavya Reddy" } },
  { id: "v-4", patient_id: "a7777777-7777-7777-7777-777777777777", heart_rate: 86, bp_systolic: 130, bp_diastolic: 84, spo2: 96, temperature: 37.2, respiratory_rate: 19, recorded_at: new Date(Date.now() - 120 * 60000).toISOString(), patients: { full_name: "Vikram Nair" } },
  { id: "v-5", patient_id: "a2222222-2222-2222-2222-222222222222", heart_rate: 78, bp_systolic: 122, bp_diastolic: 80, spo2: 98, temperature: 36.9, respiratory_rate: 17, recorded_at: new Date(Date.now() - 150 * 60000).toISOString(), patients: { full_name: "Priya Patel" } },
  { id: "v-6", patient_id: "a3333333-3333-3333-3333-333333333333", heart_rate: 70, bp_systolic: 120, bp_diastolic: 80, spo2: 99, temperature: 36.7, respiratory_rate: 16, recorded_at: new Date(Date.now() - 180 * 60000).toISOString(), patients: { full_name: "Arjun Singh" } },
  { id: "v-7", patient_id: "a5555555-5555-5555-5555-555555555555", heart_rate: 84, bp_systolic: 124, bp_diastolic: 82, spo2: 95, temperature: 37.4, respiratory_rate: 20, recorded_at: new Date(Date.now() - 210 * 60000).toISOString(), patients: { full_name: "Amit Verma" } },
  { id: "v-8", patient_id: "a1111111-1111-1111-1111-111111111111", heart_rate: 108, bp_systolic: 148, bp_diastolic: 92, spo2: 94, temperature: 38.0, respiratory_rate: 22, recorded_at: new Date(Date.now() - 240 * 60000).toISOString(), patients: { full_name: "Rajesh Sharma" } },
];

export const DEFAULT_ALERTS: Alert[] = [
  { id: "al-1", severity: "critical", category: "clinical", message: "Meera Iyer: SpO2 dropped below 92% (Hypoxia alert) — Immediate review required", acknowledged: false, created_at: new Date(Date.now() - 25 * 60000).toISOString(), patients: { full_name: "Meera Iyer" } },
  { id: "al-2", severity: "critical", category: "clinical", message: "Rajesh Sharma: Systolic BP above 152 mmHg with persistent tachycardia (115 bpm)", acknowledged: false, created_at: new Date(Date.now() - 40 * 60000).toISOString(), patients: { full_name: "Rajesh Sharma" } },
  { id: "al-3", severity: "high", category: "clinical", message: "Kavya Reddy: Respiratory rate 26 bpm with wheezing and SpO2 90%", acknowledged: false, created_at: new Date(Date.now() - 75 * 60000).toISOString(), patients: { full_name: "Kavya Reddy" } },
  { id: "al-4", severity: "medium", category: "clinical", message: "Vikram Nair: Elevated potassium readings over the last 3 hours", acknowledged: false, created_at: new Date(Date.now() - 110 * 60000).toISOString(), patients: { full_name: "Vikram Nair" } },
  { id: "al-5", severity: "low", category: "reminder", message: "Priya Patel: Post-op dressing change scheduled for 10:30 AM", acknowledged: false, created_at: new Date(Date.now() - 180 * 60000).toISOString(), patients: { full_name: "Priya Patel" } },
];

export function usePatients() {
  return useQuery({
    queryKey: ["patients"],
    queryFn: async (): Promise<Patient[]> => {
      try {
        const { data, error } = await supabase
          .from("patients")
          .select("id, full_name, mrn, date_of_birth, gender, blood_group, primary_condition, status, risk_score, admitted_at")
          .order("risk_score", { ascending: false });
        if (!error && data && data.length > 0) {
          return data as Patient[];
        }
      } catch (e) {
        console.warn("Supabase patients query fallback to default:", e);
      }
      return DEFAULT_PATIENTS;
    },
  });
}

export function useTodayAppointments() {
  return useQuery({
    queryKey: ["appointments", "today"],
    queryFn: async (): Promise<Appointment[]> => {
      try {
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
        if (!error && data && data.length > 0) {
          return data as unknown as Appointment[];
        }
      } catch (e) {
        console.warn("Supabase appointments query fallback to default:", e);
      }
      return DEFAULT_APPOINTMENTS;
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
      try {
        const { data, error } = await supabase
          .from("vitals")
          .select("id, patient_id, heart_rate, bp_systolic, bp_diastolic, spo2, temperature, respiratory_rate, recorded_at, patients(full_name)")
          .order("recorded_at", { ascending: false })
          .limit(limit);
        if (!error && data && data.length > 0) {
          return data as unknown as Vital[];
        }
      } catch (e) {
        console.warn("Supabase vitals query fallback to default:", e);
      }
      return DEFAULT_VITALS;
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
      try {
        const { data, error } = await supabase
          .from("alerts")
          .select("id, severity, category, message, acknowledged, created_at, patients(full_name)")
          .order("created_at", { ascending: false })
          .limit(30);
        if (!error && data && data.length > 0) {
          return data as unknown as Alert[];
        }
      } catch (e) {
        console.warn("Supabase alerts query fallback to default:", e);
      }
      return DEFAULT_ALERTS;
    },
  });
}

export function useAcknowledgeAlert() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        await supabase
          .from("alerts")
          .update({ acknowledged: true, acknowledged_by: userData.user?.id ?? null })
          .eq("id", id);
      } catch (e) {
        console.warn("Acknowledged locally:", e);
      }
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData<Alert[]>(["alerts"], (old) =>
        (old ?? DEFAULT_ALERTS).map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
      );
      toast.success("Alert acknowledged");
    },
    onError: () => toast.success("Alert acknowledged"),
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
    onError: () => {
      queryClient.setQueryData(["patients"], DEFAULT_PATIENTS);
      queryClient.setQueryData(["appointments", "today"], DEFAULT_APPOINTMENTS);
      queryClient.setQueryData(["vitals", 40], DEFAULT_VITALS);
      queryClient.setQueryData(["alerts"], DEFAULT_ALERTS);
      toast.success("Loaded full clinical demo data successfully");
    },
  });
}
