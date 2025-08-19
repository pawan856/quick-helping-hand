import { motion } from 'framer-motion';
import { Heart, Activity, Thermometer, Wind } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface VitalSignGaugeProps {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  optimal: [number, number];
  icon: React.ReactNode;
  color: string;
}

function CircularGauge({ 
  label, 
  value, 
  unit, 
  min, 
  max, 
  optimal, 
  icon, 
  color 
}: VitalSignGaugeProps) {
  const percentage = ((value - min) / (max - min)) * 100;
  const isOptimal = value >= optimal[0] && value <= optimal[1];
  const isHigh = value > optimal[1];
  const isLow = value < optimal[0];
  
  const strokeColor = isOptimal ? 'hsl(var(--success))' : 
                     isHigh ? 'hsl(var(--destructive))' : 
                     'hsl(var(--warning))';
  
  const status = isOptimal ? 'Normal' : isHigh ? 'High' : 'Low';
  const statusColor = isOptimal ? 'success' : isHigh ? 'destructive' : 'warning';

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <Card className="hover-lift glass border-2 hover:border-primary/20 transition-all duration-500">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${color} shadow-glow`}>
                {icon}
              </div>
              {label}
            </div>
            <Badge 
              variant={statusColor === 'success' ? 'default' : 'destructive'}
              className={`${
                statusColor === 'success' ? 'bg-success/10 text-success border-success/20' :
                statusColor === 'warning' ? 'bg-warning/10 text-warning border-warning/20' :
                'bg-destructive/10 text-destructive border-destructive/20'
              }`}
            >
              {status}
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex flex-col items-center">
          <div className="relative w-32 h-32 mb-4">
            {/* Background Circle */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="45"
                stroke="hsl(var(--muted))"
                strokeWidth="8"
                fill="none"
                opacity="0.3"
              />
              
              {/* Optimal Range Arc */}
              <circle
                cx="60"
                cy="60"
                r="45"
                stroke="hsl(var(--success))"
                strokeWidth="4"
                fill="none"
                opacity="0.2"
                strokeDasharray={`${((optimal[1] - optimal[0]) / (max - min)) * 283} 283`}
                strokeDashoffset={283 - ((optimal[0] - min) / (max - min)) * 283}
              />
              
              {/* Current Value Arc */}
              <motion.circle
                cx="60"
                cy="60"
                r="45"
                stroke={strokeColor}
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="283"
                initial={{ strokeDashoffset: 283 }}
                animate={{ strokeDashoffset: 283 - (percentage / 100) * 283 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                filter="drop-shadow(0 0 6px currentColor)"
              />
            </svg>
            
            {/* Center Value */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                className="text-2xl font-bold text-foreground"
              >
                {value}
              </motion.span>
              <span className="text-sm text-muted-foreground">{unit}</span>
            </div>
          </div>
          
          {/* Range Information */}
          <div className="text-center space-y-1">
            <p className="text-xs text-muted-foreground">
              Optimal: {optimal[0]}-{optimal[1]} {unit}
            </p>
            <p className="text-xs text-muted-foreground">
              Range: {min}-{max} {unit}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function VitalSignsGauge() {
  const vitals = [
    {
      label: "Heart Rate",
      value: 72,
      unit: "bpm",
      min: 40,
      max: 180,
      optimal: [60, 100] as [number, number],
      icon: <Heart className="h-4 w-4 text-white" />,
      color: "bg-gradient-to-r from-destructive to-destructive/80"
    },
    {
      label: "Blood Pressure",
      value: 120,
      unit: "mmHg",
      min: 80,
      max: 200,
      optimal: [90, 140] as [number, number],
      icon: <Activity className="h-4 w-4 text-white" />,
      color: "bg-gradient-to-r from-primary to-primary/80"
    },
    {
      label: "Temperature",
      value: 98.6,
      unit: "°F",
      min: 95,
      max: 105,
      optimal: [97.0, 99.5] as [number, number],
      icon: <Thermometer className="h-4 w-4 text-white" />,
      color: "bg-gradient-to-r from-warning to-warning/80"
    },
    {
      label: "Oxygen Level",
      value: 98,
      unit: "%",
      min: 70,
      max: 100,
      optimal: [95, 100] as [number, number],
      icon: <Wind className="h-4 w-4 text-white" />,
      color: "bg-gradient-to-r from-accent to-accent/80"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-heading font-semibold text-foreground">
          Real-time Vital Signs
        </h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span className="text-sm text-muted-foreground">Live monitoring</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {vitals.map((vital, index) => (
          <motion.div
            key={vital.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <CircularGauge {...vital} />
          </motion.div>
        ))}
      </div>
      
      {/* Alert Status */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="glass-premium p-4 rounded-xl border"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
            <span className="font-medium text-foreground">Patient Status: Stable</span>
          </div>
          <span className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </motion.div>
    </div>
  );
}