import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useToast } from "@/components/ui/use-toast";

export type Alert = Database["public"]["Tables"]["alerts"]["Row"] & {
  patients?: {
    full_name: string;
    mrn: string;
  } | null;
};

export type InsertAlert = Database["public"]["Tables"]["alerts"]["Insert"];

export function useNotifications() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const query = useQuery({
    queryKey: ["alerts"],
    queryFn: async (): Promise<Alert[]> => {
      const { data, error } = await supabase
        .from("alerts")
        .select(`
          *,
          patients:patient_id (full_name, mrn)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data as Alert[]) || [];
    },
  });

  // Real-time Supabase subscription
  useEffect(() => {
    // Unique channel per hook mount to prevent duplicate subscribe error
    const channelName = `realtime-alerts-${Math.random().toString(36).slice(2, 9)}`;
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "alerts" },
        (payload) => {
          const newAlert = payload.new as Alert;
          toast({
            title: `Alert: ${newAlert?.category ? newAlert.category.toUpperCase() : "HOSPITAL"}`,
            description: newAlert?.message || "New alert triggered",
            variant: newAlert?.severity === "critical" || newAlert?.severity === "high" ? "destructive" : "default",
          });
          queryClient.invalidateQueries({ queryKey: ["alerts"] });
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "alerts" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["alerts"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, toast]);

  const acknowledgeAlert = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("alerts")
        .update({ acknowledged: true })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });

  const createAlert = useMutation({
    mutationFn: async (alert: InsertAlert) => {
      const { data, error } = await supabase
        .from("alerts")
        .insert(alert)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });

  const deleteAlert = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("alerts").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });

  return {
    ...query,
    alerts: query.data || [],
    acknowledgeAlert,
    createAlert,
    deleteAlert,
  };
}
