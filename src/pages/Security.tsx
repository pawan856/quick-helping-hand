import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DataTable } from "@/components/ui/data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Shield, 
  Smartphone, 
  Key, 
  History, 
  AlertTriangle,
  CheckCircle,
  X,
  QrCode,
  Monitor,
  MapPin,
  Clock
} from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const loginHistoryData = [
  {
    id: "1",
    device: "Chrome on Windows",
    location: "Mumbai, Maharashtra",
    ipAddress: "192.168.1.100",
    timestamp: "2024-01-21 09:30:00",
    status: "Success"
  },
  {
    id: "2",
    device: "Safari on iPhone",
    location: "Mumbai, Maharashtra", 
    ipAddress: "192.168.1.101",
    timestamp: "2024-01-20 18:45:00",
    status: "Success"
  },
  {
    id: "3",
    device: "Firefox on Ubuntu",
    location: "Delhi, Delhi",
    ipAddress: "203.192.12.45",
    timestamp: "2024-01-20 14:22:00",
    status: "Failed"
  },
  {
    id: "4",
    device: "Chrome on Android",
    location: "Bangalore, Karnataka",
    ipAddress: "172.16.0.50",
    timestamp: "2024-01-19 11:15:00",
    status: "Success"
  }
];

const activeSessionsData = [
  {
    id: "1",
    device: "Chrome on Windows",
    location: "Mumbai, Maharashtra",
    ipAddress: "192.168.1.100",
    lastActive: "2024-01-21 10:30:00",
    current: true
  },
  {
    id: "2",
    device: "Safari on iPhone",
    location: "Mumbai, Maharashtra",
    ipAddress: "192.168.1.101", 
    lastActive: "2024-01-21 08:15:00",
    current: false
  },
  {
    id: "3",
    device: "Chrome on Android",
    location: "Bangalore, Karnataka",
    ipAddress: "172.16.0.50",
    lastActive: "2024-01-20 22:30:00",
    current: false
  }
];

const loginColumns = [
  {
    key: "device" as keyof typeof loginHistoryData[0],
    header: "Device",
    cell: (value: any) => (
      <div className="flex items-center gap-2">
        <Monitor className="h-4 w-4 text-muted-foreground" />
        {value}
      </div>
    )
  },
  {
    key: "location" as keyof typeof loginHistoryData[0],
    header: "Location",
    cell: (value: any) => (
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        {value}
      </div>
    )
  },
  {
    key: "ipAddress" as keyof typeof loginHistoryData[0],
    header: "IP Address"
  },
  {
    key: "timestamp" as keyof typeof loginHistoryData[0],
    header: "Time",
    cell: (value: any) => (
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        {value}
      </div>
    )
  },
  {
    key: "status" as keyof typeof loginHistoryData[0],
    header: "Status",
    cell: (value: any) => (
      <Badge variant={value === "Success" ? "secondary" : "destructive"}>
        {value === "Success" ? (
          <CheckCircle className="h-3 w-3 mr-1" />
        ) : (
          <AlertTriangle className="h-3 w-3 mr-1" />
        )}
        {value}
      </Badge>
    )
  }
];

const sessionColumns = [
  {
    key: "device" as keyof typeof activeSessionsData[0],
    header: "Device",
    cell: (row: any) => (
      <div className="flex items-center gap-2">
        <Monitor className="h-4 w-4 text-muted-foreground" />
        <div>
          <p className="font-medium">{row.device}</p>
          {row.current && <Badge variant="secondary" className="text-xs">Current Session</Badge>}
        </div>
      </div>
    )
  },
  {
    key: "location" as keyof typeof activeSessionsData[0],
    header: "Location",
    cell: (row: any) => (
      <div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          {row.location}
        </div>
        <p className="text-xs text-muted-foreground">{row.ipAddress}</p>
      </div>
    )
  },
  {
    key: "lastActive" as keyof typeof activeSessionsData[0],
    header: "Last Active",
    cell: (row: any) => (
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        {row.lastActive}
      </div>
    )
  },
  {
    key: "actions" as keyof typeof activeSessionsData[0],
    header: "Actions",
    cell: (row: any) => (
      row.current ? (
        <Badge variant="outline">Current</Badge>
      ) : (
        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
          <X className="h-4 w-4" />
          End Session
        </Button>
      )
    )
  }
];

export default function Security() {
  const { toast } = useToast();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [showQRCode, setShowQRCode] = useState(false);

  const handleEnable2FA = () => {
    setShowQRCode(true);
  };

  const handleComplete2FA = () => {
    setTwoFactorEnabled(true);
    setShowQRCode(false);
    toast({
      title: "2FA Enabled",
      description: "Two-factor authentication has been successfully enabled for your account.",
    });
  };

  const handleDisable2FA = () => {
    setTwoFactorEnabled(false);
    toast({
      title: "2FA Disabled",
      description: "Two-factor authentication has been disabled for your account.",
      variant: "destructive",
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">Security</h1>
            <p className="text-muted-foreground mt-1">Manage your account security and authentication settings</p>
          </div>
        </motion.div>

        {/* Security Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card className="hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-success">Secure</p>
                  <p className="text-sm text-muted-foreground">Account Status</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">{activeSessionsData.length}</p>
                  <p className="text-sm text-muted-foreground">Active Sessions</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Monitor className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-warning">1</p>
                  <p className="text-sm text-muted-foreground">Failed Attempts</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-accent">7</p>
                  <p className="text-sm text-muted-foreground">Days Since Password Change</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Key className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Two-Factor Authentication */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-primary" />
                Two-Factor Authentication
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-medium">Authenticator App</h3>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security using an authenticator app
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={twoFactorEnabled ? "secondary" : "outline"}>
                    {twoFactorEnabled ? "Enabled" : "Disabled"}
                  </Badge>
                  {twoFactorEnabled ? (
                    <Button variant="outline" onClick={handleDisable2FA}>
                      Disable
                    </Button>
                  ) : (
                    <Button onClick={handleEnable2FA}>
                      Enable 2FA
                    </Button>
                  )}
                </div>
              </div>

              {showQRCode && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-muted/50 p-6 rounded-lg space-y-4"
                >
                  <h4 className="font-medium">Setup Authenticator App</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        1. Install an authenticator app like Google Authenticator or Authy
                      </p>
                      <p className="text-sm text-muted-foreground">
                        2. Scan the QR code or enter the setup code manually
                      </p>
                      <p className="text-sm text-muted-foreground">
                        3. Enter the 6-digit code from your app below
                      </p>
                    </div>
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center border">
                        <QrCode className="h-24 w-24 text-muted-foreground" />
                      </div>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        JBSWY3DPEHPK3PXP
                      </code>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Input placeholder="Enter 6-digit code" className="max-w-48" />
                    <Button onClick={handleComplete2FA}>Verify & Enable</Button>
                    <Button variant="outline" onClick={() => setShowQRCode(false)}>Cancel</Button>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Security Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Login Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when someone logs into your account
                      </p>
                    </div>
                    <Switch
                      checked={loginAlerts}
                      onCheckedChange={setLoginAlerts}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Session Timeout</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={sessionTimeout}
                        onChange={(e) => setSessionTimeout(Number(e.target.value))}
                        className="w-20"
                      />
                      <span className="text-sm text-muted-foreground">minutes</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button variant="outline" className="w-full">
                    <Key className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full">
                    Download Recovery Codes
                  </Button>
                  <Button variant="destructive" className="w-full">
                    <X className="h-4 w-4 mr-2" />
                    End All Other Sessions
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Login History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                Login History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                data={loginHistoryData}
                columns={loginColumns}
                searchPlaceholder="Search login history..."
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Active Sessions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-primary" />
                Active Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                data={activeSessionsData}
                columns={sessionColumns}
                searchPlaceholder="Search active sessions..."
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
}