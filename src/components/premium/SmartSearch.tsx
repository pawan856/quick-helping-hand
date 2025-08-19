import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  User, 
  Calendar, 
  FileText, 
  Filter,
  X,
  Clock,
  Star
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  type: 'patient' | 'appointment' | 'record' | 'doctor';
  title: string;
  subtitle: string;
  metadata?: string;
  priority?: 'high' | 'medium' | 'low';
}

interface SmartSearchProps {
  placeholder?: string;
  className?: string;
  onResultSelect?: (result: SearchResult) => void;
  showFilters?: boolean;
}

export function SmartSearch({ 
  placeholder = "Search patients, appointments, records...",
  className,
  onResultSelect,
  showFilters = true
}: SmartSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches] = useState<string[]>([
    "John Smith", "Blood Test Results", "Tomorrow's Appointments"
  ]);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock search results
  const mockResults: SearchResult[] = [
    {
      id: "1",
      type: "patient",
      title: "John Smith",
      subtitle: "Patient ID: P-001",
      metadata: "Last visit: 2 days ago",
      priority: "high"
    },
    {
      id: "2", 
      type: "appointment",
      title: "Follow-up with Dr. Wilson",
      subtitle: "Tomorrow 10:30 AM",
      metadata: "Room 204",
      priority: "medium"
    },
    {
      id: "3",
      type: "record",
      title: "Blood Test Results",
      subtitle: "John Smith - Lab Report",
      metadata: "Ready for review",
      priority: "high"
    }
  ];

  const filterOptions = [
    { id: "patients", label: "Patients", icon: User },
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "records", label: "Records", icon: FileText },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length > 0) {
      setResults(mockResults.filter(result => 
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.subtitle.toLowerCase().includes(query.toLowerCase())
      ));
    } else {
      setResults([]);
    }
  }, [query]);

  const toggleFilter = (filterId: string) => {
    setActiveFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'patient': return <User className="h-4 w-4" />;
      case 'appointment': return <Calendar className="h-4 w-4" />;
      case 'record': return <FileText className="h-4 w-4" />;
      default: return <Search className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div ref={searchRef} className={cn("relative w-full max-w-2xl", className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="pl-11 pr-12 h-12 text-base glass border-2 hover:border-primary/30 focus:border-primary transition-all duration-300"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setQuery("");
              setResults([]);
            }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? 'auto' : 0 }}
          className="flex gap-2 mt-3 overflow-hidden"
        >
          {filterOptions.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilters.includes(filter.id) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleFilter(filter.id)}
              className="hover-lift"
            >
              <filter.icon className="h-3 w-3 mr-1" />
              {filter.label}
            </Button>
          ))}
        </motion.div>
      )}

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 glass-premium rounded-xl border shadow-strong z-50 max-h-96 overflow-y-auto"
          >
            {/* Recent Searches */}
            {query === "" && recentSearches.length > 0 && (
              <div className="p-4 border-b border-border/50">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <Clock className="h-4 w-4" />
                  Recent Searches
                </div>
                <div className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <div
                      key={index}
                      onClick={() => setQuery(search)}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <Search className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{search}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results */}
            {results.length > 0 && (
              <div className="p-2">
                {results.map((result) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => onResultSelect?.(result)}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-primary/5 cursor-pointer transition-all duration-200 hover-lift"
                  >
                    <div className={cn("p-2 rounded-lg", {
                      "bg-primary/10 text-primary": result.type === 'patient',
                      "bg-accent/10 text-accent": result.type === 'appointment',
                      "bg-gold/10 text-gold": result.type === 'record'
                    })}>
                      {getResultIcon(result.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-foreground truncate">
                          {result.title}
                        </h4>
                        {result.priority && (
                          <div className={cn("w-2 h-2 rounded-full", {
                            "bg-destructive animate-pulse": result.priority === 'high',
                            "bg-warning": result.priority === 'medium',
                            "bg-success": result.priority === 'low'
                          })} />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {result.subtitle}
                      </p>
                      {result.metadata && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {result.metadata}
                        </p>
                      )}
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {result.type}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            )}

            {/* No Results */}
            {query && results.length === 0 && (
              <div className="p-8 text-center">
                <Search className="h-8 w-8 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">No results found for "{query}"</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting your search terms or filters
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}