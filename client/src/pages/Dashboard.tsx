import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Download, Eye } from "lucide-react";
import { StudentForm } from "@/components/StudentForm";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import apiClient from "@/api/axiosConfig"; // Import Axios client

interface Student {
  _id: string;
  name: string;
  email: string;
  phone: string;
  codeforcesHandle: string;
  currentRating: number;
  maxRating: number;
  lastSynced: string;
  autoEmailDisabled: boolean;
  emailRemindersSent: number;
}

const Dashboard = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.get('/students');
        setStudents(response.data);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Failed to load student data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleAddStudent = async (studentData: Omit<Student, "_id" | "lastSynced" | "emailRemindersSent">) => {
    try {
      const response = await apiClient.post('/students', {
        ...studentData,
        lastSynced: new Date().toISOString(),
        emailRemindersSent: 0,
      });
      setStudents([...students, response.data]);
      setShowAddForm(false);
      toast({
        title: "Student added successfully!",
        description: "The student has been added to the system.",
      });
    } catch (error) {
      console.error("Error adding student:", error);
      toast({
        title: "Error",
        description: "Failed to add student. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditStudent = async (studentData: Omit<Student, "_id" | "lastSynced" | "emailRemindersSent">) => {
    if (!editingStudent) return;

    try {
      const updatedStudent = {
        ...studentData,
        _id: editingStudent._id,
        lastSynced: new Date().toISOString(),
        emailRemindersSent: editingStudent.emailRemindersSent,
      };

      await apiClient.put(`/students/${updatedStudent._id}`, updatedStudent);
      setStudents(students.map(s => s._id === updatedStudent._id ? updatedStudent : s));
      setEditingStudent(null);
      toast({
        title: "Student updated successfully!",
        description: "The student information has been updated.",
      });
    } catch (error) {
      console.error("Error updating student:", error);
      toast({
        title: "Error",
        description: "Failed to update student. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteStudent = async (id: string) => {
    try {
      await apiClient.delete(`/students/${id}`);
      setStudents(students.filter(s => s._id !== id));
      toast({
        title: "Student deleted",
        description: "The student has been removed from the system.",
        variant: "destructive",
      });
    } catch (error) {
      console.error("Error deleting student:", error);
      toast({
        title: "Error",
        description: "Failed to delete student. Please try again.",
        variant: "destructive",
      });
    }
  };

  const exportToCSV = async () => {
    try {
      const response = await apiClient.get('/students');
      const headers = ["Name", "Email", "Phone", "CF Handle", "Current Rating", "Max Rating", "Last Synced"];
      const csvContent = [
        headers.join(","),
        ...response.data.map(s => [
          s.name,
          s.email,
          s.phone,
          s.codeforcesHandle,
          s.currentRating,
          s.maxRating,
          new Date(s.lastSynced).toLocaleDateString()
        ].join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "students.csv";
      a.click();
      toast({
        title: "CSV exported!",
        description: "Student data has been downloaded.",
      });
    } catch (error) {
      console.error("Error fetching students for CSV export:", error);
      toast({
        title: "Error",
        description: "Failed to export CSV. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatLastSynced = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 1900) return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    if (rating >= 1600) return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
    if (rating >= 1400) return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
    if (rating >= 1200) return "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300";
    return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Student Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Manage and track student progress</p>
          </div>
          <div className="flex space-x-3">
            <Button
              onClick={exportToCSV}
              variant="outline"
              className="border-emerald-300 dark:border-slate-600 hover:bg-emerald-50 dark:hover:bg-slate-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Student
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Avg Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {students.length > 0 ? Math.round(students.reduce((acc, s) => acc + s.currentRating, 0) / students.length) : 0}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-violet-500 to-purple-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Active Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.filter(s => !s.autoEmailDisabled).length}</div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Card className="shadow-lg bg-white dark:bg-slate-800 transition-colors duration-300">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-slate-700 border-b dark:border-slate-600">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Codeforces</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Last Sync</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-600">
                {students.map((student) => (
                  <tr key={student._id} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{student.name}</div>
                        {student.autoEmailDisabled && (
                          <Badge className="mt-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">Email Disabled</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">{student.email}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{student.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-mono text-gray-900 dark:text-white">{student.codeforcesHandle}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Badge className={getRatingColor(student.currentRating)}>
                          {student.currentRating}
                        </Badge>
                        <span className="text-xs text-gray-500 dark:text-gray-400">max: {student.maxRating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">{formatLastSynced(student.lastSynced)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Link to={`/students/${student._id}`}>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingStudent(student)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteStudent(student._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      {showAddForm && (
        <StudentForm
          onSubmit={handleAddStudent}
          onCancel={() => setShowAddForm(false)}
        />
      )}
      {editingStudent && (
        <StudentForm
          student={editingStudent}
          onSubmit={handleEditStudent}
          onCancel={() => setEditingStudent(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;




