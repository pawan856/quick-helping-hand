import { motion } from 'framer-motion';
import { Calendar, Clock, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const departments = [
  'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 
  'Emergency', 'Radiology', 'Laboratory', 'Pharmacy'
];

const timeSlots = [
  '8:00', '9:00', '10:00', '11:00', '12:00', 
  '13:00', '14:00', '15:00', '16:00', '17:00'
];

// Generate mock heatmap data
const generateHeatmapData = () => {
  return departments.map(dept => 
    timeSlots.map(time => ({
      department: dept,
      time,
      appointments: Math.floor(Math.random() * 12) + 1,
      capacity: 15
    }))
  ).flat();
};

const heatmapData = generateHeatmapData();

const getIntensityClass = (appointments: number, capacity: number) => {
  const ratio = appointments / capacity;
  if (ratio >= 0.9) return 'bg-destructive text-white shadow-lg';
  if (ratio >= 0.7) return 'bg-warning text-warning-foreground shadow-md';
  if (ratio >= 0.5) return 'bg-accent text-accent-foreground shadow-sm';
  if (ratio >= 0.3) return 'bg-primary/20 text-primary';
  return 'bg-muted/50 text-muted-foreground';
};

const getIntensityLabel = (appointments: number, capacity: number) => {
  const ratio = appointments / capacity;
  if (ratio >= 0.9) return 'Critical';
  if (ratio >= 0.7) return 'High';
  if (ratio >= 0.5) return 'Medium';
  if (ratio >= 0.3) return 'Low';
  return 'Very Low';
};

export function AppointmentHeatmap() {
  const totalAppointments = heatmapData.reduce((sum, item) => sum + item.appointments, 0);
  const peakHour = timeSlots[Math.floor(Math.random() * timeSlots.length)];
  const busiestDept = departments[Math.floor(Math.random() * departments.length)];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="hover-lift glass border-2 hover:border-accent/20 transition-all duration-500">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 font-heading text-xl">
              <div className="p-2 rounded-lg bg-gradient-to-r from-accent to-accent/80 shadow-glow">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              Appointment Load Heatmap
            </CardTitle>
            <Badge variant="outline" className="font-medium">
              Today
            </Badge>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{totalAppointments} appointments</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Peak: {peakHour}</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {/* Heatmap Grid */}
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Time Header */}
                <div className="grid grid-cols-11 gap-1 mb-2">
                  <div className="text-xs font-medium text-muted-foreground p-2">
                    Department
                  </div>
                  {timeSlots.map(time => (
                    <div key={time} className="text-xs font-medium text-center text-muted-foreground p-2">
                      {time}
                    </div>
                  ))}
                </div>
                
                {/* Heatmap Rows */}
                {departments.map((dept, deptIndex) => (
                  <motion.div
                    key={dept}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: deptIndex * 0.05 }}
                    className="grid grid-cols-11 gap-1 mb-1"
                  >
                    <div className="text-sm font-medium text-foreground p-2 truncate">
                      {dept}
                    </div>
                    {timeSlots.map(time => {
                      const dataPoint = heatmapData.find(d => d.department === dept && d.time === time);
                      if (!dataPoint) return null;
                      
                      return (
                        <motion.div
                          key={`${dept}-${time}`}
                          whileHover={{ scale: 1.1, z: 10 }}
                          className={`
                            relative p-2 rounded-lg text-xs font-medium text-center cursor-pointer
                            transition-all duration-300 hover:shadow-strong
                            ${getIntensityClass(dataPoint.appointments, dataPoint.capacity)}
                          `}
                          title={`${dept} at ${time}: ${dataPoint.appointments}/${dataPoint.capacity} appointments`}
                        >
                          {dataPoint.appointments}
                          {dataPoint.appointments >= dataPoint.capacity * 0.9 && (
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full animate-pulse" />
                          )}
                        </motion.div>
                      );
                    })}
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Legend and Insights */}
            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-foreground">Load Intensity:</span>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-muted/50"></div>
                  <span className="text-xs text-muted-foreground">Low</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-primary/20"></div>
                  <span className="text-xs text-muted-foreground">Medium</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-warning"></div>
                  <span className="text-xs text-muted-foreground">High</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-destructive"></div>
                  <span className="text-xs text-muted-foreground">Critical</span>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Busiest Department:</p>
                <p className="font-medium text-primary">{busiestDept}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}