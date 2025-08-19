import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
  { month: 'Jan', patients: 120, newPatients: 15, returnPatients: 105 },
  { month: 'Feb', patients: 145, newPatients: 22, returnPatients: 123 },
  { month: 'Mar', patients: 167, newPatients: 28, returnPatients: 139 },
  { month: 'Apr', patients: 189, newPatients: 35, returnPatients: 154 },
  { month: 'May', patients: 212, newPatients: 31, returnPatients: 181 },
  { month: 'Jun', patients: 234, newPatients: 38, returnPatients: 196 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-premium p-4 rounded-lg shadow-strong border">
        <p className="font-medium text-foreground mb-2">{`${label} 2024`}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.dataKey}:</span>
            <span className="font-medium text-foreground">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function PatientTrendChart() {
  const currentMonth = data[data.length - 1];
  const previousMonth = data[data.length - 2];
  const growthRate = ((currentMonth.patients - previousMonth.patients) / previousMonth.patients * 100).toFixed(1);
  const isPositive = parseFloat(growthRate) > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="hover-lift glass border-2 hover:border-primary/20 transition-all duration-500">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 font-heading text-xl">
              <div className="p-2 rounded-lg bg-gradient-primary shadow-glow">
                <Users className="h-5 w-5 text-white" />
              </div>
              Patient Growth Trends
            </CardTitle>
            <div className="flex items-center gap-2">
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-success" />
              ) : (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
              <span className={`text-sm font-medium ${isPositive ? 'text-success' : 'text-destructive'}`}>
                {isPositive ? '+' : ''}{growthRate}%
              </span>
            </div>
          </div>
          <p className="text-muted-foreground text-sm">
            Monthly patient registration and retention analysis
          </p>
        </CardHeader>
        
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="patientGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="newPatientGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="hsl(var(--border))" 
                  opacity={0.3}
                />
                
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                />
                
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                />
                
                <Tooltip content={<CustomTooltip />} />
                
                <Area
                  type="monotone"
                  dataKey="patients"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  fill="url(#patientGradient)"
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                  activeDot={{ 
                    r: 6, 
                    fill: 'hsl(var(--primary))',
                    stroke: 'hsl(var(--background))',
                    strokeWidth: 2,
                    filter: 'drop-shadow(0 0 6px hsl(var(--primary) / 0.5))'
                  }}
                />
                
                <Line
                  type="monotone"
                  dataKey="newPatients"
                  stroke="hsl(var(--accent))"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2, r: 3 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border/50">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary shadow-sm"></div>
              <span className="text-sm text-muted-foreground">Total Patients</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-1 bg-accent rounded-full"></div>
              <span className="text-sm text-muted-foreground">New Patients</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}