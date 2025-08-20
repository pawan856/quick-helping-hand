import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VitalSignsGauge } from "@/components/charts/VitalSignsGauge";
import { DataTable } from "@/components/ui/data-table";
import { Activity, Heart, Thermometer, Droplets, Calendar, Filter, Download } from "lucide-react";
import { motion } from "framer-motion";

const vitalHistoryData = [
  {
    id: "1",
    timestamp: "2024-01-20 14:30",
    heartRate: 72,
    bloodPressure: "120/80",
    temperature: 98.6,
    oxygenSaturation: 98,
    status: "Normal",
    recordedBy: "Nurse Priya Sharma"
  },
  {
    id: "2", 
    timestamp: "2024-01-20 10:15",
    heartRate: 78,
    bloodPressure: "125/82",
    temperature: 99.1,
    oxygenSaturation: 97,
    status: "Elevated",
    recordedBy: "Dr. Rajesh Kumar"
  },
  {
    id: "3",
    timestamp: "2024-01-20 06:00",
    heartRate: 68,
    bloodPressure: "118/76",
    temperature: 98.4,
    oxygenSaturation: 99,
    status: "Normal",
    recordedBy: "Nurse Kavya Reddy"
  }
];

const vitalColumns = [
  {
    key: "timestamp" as keyof typeof vitalHistoryData[0],
    header: "Time",
    sortable: true
  },
  {
    key: "heartRate" as keyof typeof vitalHistoryData[0],
    header: "Heart Rate",
    cell: (row: typeof vitalHistoryData[0]) => `${row.heartRate} bpm`
  },
  {
    key: "bloodPressure" as keyof typeof vitalHistoryData[0],
    header: "Blood Pressure",
    cell: (row: typeof vitalHistoryData[0]) => `${row.bloodPressure} mmHg`
  },
  {
    key: "temperature" as keyof typeof vitalHistoryData[0],
    header: "Temperature", 
    cell: (row: typeof vitalHistoryData[0]) => `${row.temperature}°F`
  },
  {
    key: "oxygenSaturation" as keyof typeof vitalHistoryData[0],
    header: "SpO₂",
    cell: (row: typeof vitalHistoryData[0]) => `${row.oxygenSaturation}%`
  },
  {
    key: "status" as keyof typeof vitalHistoryData[0],
    header: "Status",
    cell: (row: typeof vitalHistoryData[0]) => (
      <Badge variant={row.status === "Normal" ? "secondary" : row.status === "Critical" ? "destructive" : "default"}>
        {row.status}
      </Badge>
    )
  },
  {
    key: "recordedBy" as keyof typeof vitalHistoryData[0],
    header: "Recorded By"
  }
];

export default function VitalsMonitor() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("daily");
  const [selectedPatient, setSelectedPatient] = useState("Arjun Singh");

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">Vitals Monitor</h1>
            <p className="text-muted-foreground mt-1">Real-time patient vital signs monitoring</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
              <div className="w-2 h-2 rounded-full bg-success mr-2 animate-pulse"></div>
              Live Monitoring
            </Badge>
          </div>
        </motion.div>

        {/* Patient Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{selectedPatient}</h3>
                    <p className="text-muted-foreground">Patient ID: #P-2024-001</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Monitoring Since:</span>
                  <Badge variant="outline">06:00 AM</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Real-time Gauges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <VitalSignsGauge />
        </motion.div>

        {/* Time Range Selector and History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-morphism">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Vitals History
                </CardTitle>
                <Tabs value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="hourly">Hourly</TabsTrigger>
                    <TabsTrigger value="daily">Daily</TabsTrigger>
                    <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedTimeRange} className="w-full">
                <TabsContent value="hourly" className="mt-6">
                  <DataTable
                    data={vitalHistoryData}
                    columns={vitalColumns}
                  />
                </TabsContent>
                <TabsContent value="daily" className="mt-6">
                  <DataTable
                    data={vitalHistoryData}
                    columns={vitalColumns}
                  />
                </TabsContent>
                <TabsContent value="weekly" className="mt-6">
                  <DataTable
                    data={vitalHistoryData.slice(0, 5)}
                    columns={vitalColumns}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        {/* Alert Thresholds */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            { icon: Heart, label: "Heart Rate", range: "60-100 bpm", status: "Normal" },
            { icon: Activity, label: "Blood Pressure", range: "<120/80 mmHg", status: "Normal" },
            { icon: Thermometer, label: "Temperature", range: "97-99°F", status: "Normal" },
            { icon: Droplets, label: "SpO₂", range: ">95%", status: "Normal" }
          ].map((threshold, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <threshold.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{threshold.label}</p>
                    <p className="text-xs text-muted-foreground">{threshold.range}</p>
                  </div>
                  <Badge variant="secondary" className="bg-success/10 text-success">
                    {threshold.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>
    </AppLayout>
  );
}