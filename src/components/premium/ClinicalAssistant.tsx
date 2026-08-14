import { useRef, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sparkles, Send, Loader2, Square } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Summarise today's highest-risk patients",
  "Which open alerts need action first?",
  "Draft a handover note for the evening shift",
  "Any patterns across current vitals?",
];

export function ClinicalAssistant({ className }: { className?: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streaming]);

  const send = async (text: string) => {
    const prompt = text.trim();
    if (!prompt || streaming) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: prompt }];
    setMessages(nextMessages);
    setInput("");
    setStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      const response = await fetch(
        `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/clinical-assistant`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ messages: nextMessages }),
          signal: controller.signal,
        },
      );

      if (!response.ok || !response.body) {
        const payload = await response.json().catch(() => ({ error: "Assistant unavailable" }));
        throw new Error(payload.error ?? "Assistant unavailable");
      }

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6).trim();
          if (payload === "[DONE]") continue;
          try {
            const json = JSON.parse(payload);
            const delta: string = json.choices?.[0]?.delta?.content ?? "";
            if (delta) {
              setMessages((prev) => {
                const copy = [...prev];
                copy[copy.length - 1] = {
                  role: "assistant",
                  content: copy[copy.length - 1].content + delta,
                };
                return copy;
              });
            }
          } catch {
            // partial chunk, ignore
          }
        }
      }
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        toast.error((error as Error).message);
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  };

  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <span className="p-2 rounded-lg bg-primary/10 text-primary">
            <Sparkles className="h-4 w-4" />
          </span>
          AI Clinical Assistant
        </CardTitle>
        <Badge variant="secondary" className="text-xs">Grounded in live data</Badge>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4">
        <ScrollArea className="h-[280px] pr-3" viewportRef={scrollRef}>
          {messages.length === 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Ask about your roster, alerts, vitals trends or handover notes.
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:bg-muted transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "text-sm rounded-lg px-3 py-2 whitespace-pre-wrap max-w-[92%]",
                    message.role === "user"
                      ? "ml-auto bg-primary text-primary-foreground"
                      : "bg-muted text-foreground",
                  )}
                >
                  {message.content || (streaming ? "Thinking…" : "")}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the clinical assistant…"
            disabled={streaming}
          />
          {streaming ? (
            <Button type="button" variant="outline" size="icon" onClick={() => abortRef.current?.abort()}>
              <Square className="h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" size="icon" disabled={!input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          )}
          {streaming && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </form>
        <p className="text-xs text-muted-foreground">
          Decision support only — always confirm with the treating clinician.
        </p>
      </CardContent>
    </Card>
  );
}
