import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Vital = Database["public"]["Tables"]["vitals"]["Row"] & {
  patients?: {
    full_name: string;
    mrn: string;
  } | null;
};

export type InsertVital = Database["public"]["Tables"]["vitals"]["Insert"];

export function useVitals(patientId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["vitals", patientId || "all"],
    queryFn: async (): Promise<Vital[]> => {
      let q = supabase
        .from("vitals")
        .select(`
          *,
          patients:patient_id (full_name, mrn)
        `)
        .order("recorded_at", { ascending: false });

      if (patientId) {
        q = q.eq("patient_id", patientId);
      }

      const { data, error } = await q;
      if (error) throw error;
      return (data as Vital[]) || [];
    },
  });

  const recordVital = useMutation({
    mutationFn: async (newVital: InsertVital) => {
      const { data, error } = await supabase
        .from("vitals")
        .insert(newVital)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vitals"] });
    },
  });

  const deleteVital = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("vitals").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vitals"] });
    },
  });

  return {
    ...query,
    vitals: query.data || [],
    recordVital,
    deleteVital,
  };
}
