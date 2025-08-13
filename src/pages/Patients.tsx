import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Search, 
  Plus, 
  Edit, 
  Eye,
  Phone,
  Mail,
  Calendar
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Patients = () => {
  const patients = [
    {
      id: 1,
      name: "John Smith",
      age: 45,
      gender: "Male",
      phone: "+1 234-567-8901",
      email: "john.smith@email.com",
      lastVisit: "2024-01-15",
      condition: "Hypertension",
      status: "Active"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      age: 32,
      gender: "Female",
      phone: "+1 234-567-8902",
      email: "sarah.j@email.com",
      lastVisit: "2024-01-12",
      condition: "Diabetes",
      status: "Active"
    },
    {
      id: 3,
      name: "Mike Brown",
      age: 28,
      gender: "Male",
      phone: "+1 234-567-8903",
      email: "mike.brown@email.com",
      lastVisit: "2024-01-10",
      condition: "Asthma",
      status: "Inactive"
    },
    {
      id: 4,
      name: "Emma Davis",
      age: 55,
      gender: "Female",
      phone: "+1 234-567-8904",
      email: "emma.davis@email.com",
      lastVisit: "2024-01-08",
      condition: "Arthritis",
      status: "Active"
    },
    {
      id: 5,
      name: "James Wilson",
      age: 38,
      gender: "Male",
      phone: "+1 234-567-8905",
      email: "james.w@email.com",
      lastVisit: "2024-01-05",
      condition: "Migraine",
      status: "Active"
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center">
              <Users className="mr-3 h-8 w-8 text-primary" />
              Patient Management
            </h1>
            <p className="text-muted-foreground">Manage and monitor all patients</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Add New Patient
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Search Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search by name, email, or phone..." 
                    className="pl-10"
                  />
                </div>
              </div>
              <Button variant="outline">Filter</Button>
              <Button variant="outline">Export</Button>
            </div>
          </CardContent>
        </Card>

        {/* Patients Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Patients ({patients.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{patient.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {patient.age} years • {patient.gender}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Phone className="mr-2 h-3 w-3" />
                          {patient.phone}
                        </div>
                        <div className="flex items-center text-sm">
                          <Mail className="mr-2 h-3 w-3" />
                          {patient.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Calendar className="mr-2 h-3 w-3" />
                        {patient.lastVisit}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{patient.condition}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={patient.status === "Active" ? "default" : "secondary"}
                        className={patient.status === "Active" ? "bg-green-100 text-green-800" : ""}
                      >
                        {patient.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Patients;