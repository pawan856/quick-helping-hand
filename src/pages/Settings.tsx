import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Globe, 
  Palette, 
  Accessibility,
  Upload,
  Save,
  Moon,
  Sun,
  Monitor
} from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "Dr. Sarah",
    lastName: "Wilson",
    email: "sarah.wilson@healthcare.com",
    phone: "+91 98765 43210",
    role: "Chief Medical Officer",
    department: "Cardiology",
    employeeId: "EMP-2024-001"
  });

  const [preferences, setPreferences] = useState({
    language: "english",
    timezone: "asia/kolkata",
    dateFormat: "dd/mm/yyyy",
    theme: "system",
    notifications: true,
    emailNotifications: true,
    smsNotifications: false
  });

  const [accessibility, setAccessibility] = useState({
    fontSize: "medium",
    highContrast: false,
    reducedMotion: false,
    screenReader: false,
    keyboardShortcuts: true
  });

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  const handleSavePreferences = () => {
    toast({
      title: "Preferences Updated", 
      description: "Your preferences have been saved successfully.",
    });
  };

  const handleSaveAccessibility = () => {
    toast({
      title: "Accessibility Settings Updated",
      description: "Your accessibility preferences have been saved.",
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
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground mt-1">Manage your account preferences and system settings</p>
          </div>
        </motion.div>

        {/* Settings Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center gap-2">
                <SettingsIcon className="h-4 w-4" />
                Preferences
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="accessibility" className="flex items-center gap-2">
                <Accessibility className="h-4 w-4" />
                Accessibility
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card className="glass-morphism">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center gap-6">
                    <Avatar className="h-24 w-24">
                      <AvatarFallback className="text-2xl">
                        {profile.firstName[0]}{profile.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Photo
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        Recommended: Square image, at least 400x400px
                      </p>
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profile.firstName}
                        onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profile.lastName}
                        onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input
                        id="role"
                        value={profile.role}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        value={profile.department}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSaveProfile}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences">
              <Card className="glass-morphism">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <SettingsIcon className="h-5 w-5 text-primary" />
                    System Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Language & Region */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        Language & Region
                      </h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Language</Label>
                          <Select value={preferences.language} onValueChange={(value) => 
                            setPreferences({...preferences, language: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="english">English</SelectItem>
                              <SelectItem value="hindi">Hindi</SelectItem>
                              <SelectItem value="tamil">Tamil</SelectItem>
                              <SelectItem value="bengali">Bengali</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Timezone</Label>
                          <Select value={preferences.timezone} onValueChange={(value) => 
                            setPreferences({...preferences, timezone: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="asia/kolkata">Asia/Kolkata (IST)</SelectItem>
                              <SelectItem value="asia/mumbai">Asia/Mumbai (IST)</SelectItem>
                              <SelectItem value="utc">UTC</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Date Format</Label>
                          <Select value={preferences.dateFormat} onValueChange={(value) => 
                            setPreferences({...preferences, dateFormat: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                              <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                              <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Appearance */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Palette className="h-5 w-5" />
                        Appearance
                      </h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Theme</Label>
                          <Select value={preferences.theme} onValueChange={(value) => 
                            setPreferences({...preferences, theme: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="light">
                                <div className="flex items-center gap-2">
                                  <Sun className="h-4 w-4" />
                                  Light
                                </div>
                              </SelectItem>
                              <SelectItem value="dark">
                                <div className="flex items-center gap-2">
                                  <Moon className="h-4 w-4" />
                                  Dark
                                </div>
                              </SelectItem>
                              <SelectItem value="system">
                                <div className="flex items-center gap-2">
                                  <Monitor className="h-4 w-4" />
                                  System
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSavePreferences}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card className="glass-morphism">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    Notification Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications in the application
                        </p>
                      </div>
                      <Switch
                        checked={preferences.notifications}
                        onCheckedChange={(checked) => 
                          setPreferences({...preferences, notifications: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive important updates via email
                        </p>
                      </div>
                      <Switch
                        checked={preferences.emailNotifications}
                        onCheckedChange={(checked) => 
                          setPreferences({...preferences, emailNotifications: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive critical alerts via SMS
                        </p>
                      </div>
                      <Switch
                        checked={preferences.smsNotifications}
                        onCheckedChange={(checked) => 
                          setPreferences({...preferences, smsNotifications: checked})}
                      />
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Notification Types</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Appointment Reminders</span>
                        <Badge variant="secondary">Email + Push</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Critical Lab Results</span>
                        <Badge variant="destructive">All Channels</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>System Updates</span>
                        <Badge variant="outline">Push Only</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSavePreferences}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Accessibility Tab */}
            <TabsContent value="accessibility">
              <Card className="glass-morphism">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Accessibility className="h-5 w-5 text-primary" />
                    Accessibility Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Font Size</Label>
                      <Select value={accessibility.fontSize} onValueChange={(value) => 
                        setAccessibility({...accessibility, fontSize: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                          <SelectItem value="extra-large">Extra Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>High Contrast Mode</Label>
                        <p className="text-sm text-muted-foreground">
                          Increase contrast for better visibility
                        </p>
                      </div>
                      <Switch
                        checked={accessibility.highContrast}
                        onCheckedChange={(checked) => 
                          setAccessibility({...accessibility, highContrast: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Reduced Motion</Label>
                        <p className="text-sm text-muted-foreground">
                          Minimize animations and transitions
                        </p>
                      </div>
                      <Switch
                        checked={accessibility.reducedMotion}
                        onCheckedChange={(checked) => 
                          setAccessibility({...accessibility, reducedMotion: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Screen Reader Support</Label>
                        <p className="text-sm text-muted-foreground">
                          Enhanced compatibility with screen readers
                        </p>
                      </div>
                      <Switch
                        checked={accessibility.screenReader}
                        onCheckedChange={(checked) => 
                          setAccessibility({...accessibility, screenReader: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Keyboard Shortcuts</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable keyboard navigation shortcuts
                        </p>
                      </div>
                      <Switch
                        checked={accessibility.keyboardShortcuts}
                        onCheckedChange={(checked) => 
                          setAccessibility({...accessibility, keyboardShortcuts: checked})}
                      />
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Keyboard Shortcuts</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Ctrl + / - Show shortcuts</div>
                      <div>Ctrl + K - Quick search</div>
                      <div>Ctrl + N - New record</div>
                      <div>Ctrl + S - Save</div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSaveAccessibility}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </AppLayout>
  );
}