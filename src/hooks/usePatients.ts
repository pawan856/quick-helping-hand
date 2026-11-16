import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Patient = Database["public"]["Tables"]["patients"]["Row"];
export type InsertPatient = Database["public"]["Tables"]["patients"]["Insert"];
export type UpdatePatient = Database["public"]["Tables"]["patients"]["Update"];

export function usePatients() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["patients"],
    queryFn: async (): Promise<Patient[]> => {
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    },
  });

  const createPatient = useMutation({
    mutationFn: async (newPatient: InsertPatient) => {
      const { data, error } = await supabase
        .from("patients")
        .insert(newPatient)
        .select()
        .single();

      if (error) {
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });

  const updatePatient = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdatePatient }) => {
      const { data, error } = await supabase
        .from("patients")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });

  const deletePatient = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("patients").delete().eq("id", id);
      if (error) {
        throw error;
      }
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });

  return {
    ...query,
    patients: query.data || [],
    createPatient,
    updatePatient,
    deletePatient,
  };
}
