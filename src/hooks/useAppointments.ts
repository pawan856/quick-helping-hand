import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Appointment = Database["public"]["Tables"]["appointments"]["Row"] & {
  patients?: {
    full_name: string;
    phone: string | null;
    mrn: string;
  } | null;
  profiles?: {
    full_name: string | null;
  } | null;
};

export type InsertAppointment = Database["public"]["Tables"]["appointments"]["Insert"];
export type UpdateAppointment = Database["public"]["Tables"]["appointments"]["Update"];

export function useAppointments() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["appointments"],
    queryFn: async (): Promise<Appointment[]> => {
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          *,
          patients:patient_id (full_name, phone, mrn)
        `)
        .order("scheduled_at", { ascending: true });

      if (error) {
        throw error;
      }

      return (data as Appointment[]) || [];
    },
  });

  const createAppointment = useMutation({
    mutationFn: async (newAppt: InsertAppointment) => {
      const { data, error } = await supabase
        .from("appointments")
        .insert(newAppt)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  const updateAppointment = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateAppointment }) => {
      const { data, error } = await supabase
        .from("appointments")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  const deleteAppointment = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("appointments").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  return {
    ...query,
    appointments: query.data || [],
    createAppointment,
    updateAppointment,
    deleteAppointment,
  };
}
