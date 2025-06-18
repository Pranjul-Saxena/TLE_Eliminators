
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";

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

interface StudentFormProps {
  student?: Student;
  onSubmit: (data: Omit<Student, "_id" | "lastSynced" | "emailRemindersSent">) => void;
  onCancel: () => void;
}

export const StudentForm = ({ student, onSubmit, onCancel }: StudentFormProps) => {
  const [formData, setFormData] = useState({
    name: student?.name || "",
    email: student?.email || "",
    phone: student?.phone || "",
    codeforcesHandle: student?.codeforcesHandle || "",
    currentRating: student?.currentRating || 0,
    maxRating: student?.maxRating || 0,
    autoEmailDisabled: student?.autoEmailDisabled || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white dark:bg-slate-800 transition-colors duration-300">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-gray-900 dark:text-white">{student ? "Edit Student" : "Add New Student"}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel} className="hover:bg-gray-100 dark:hover:bg-slate-700">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
                className="bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white"
              />
            </div>
            
            <div>
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
                className="bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white"
              />
            </div>
            
            <div>
              <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                required
                className="bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white"
              />
            </div>
            
            <div>
              <Label htmlFor="codeforcesHandle" className="text-gray-700 dark:text-gray-300">Codeforces Handle</Label>
              <Input
                id="codeforcesHandle"
                value={formData.codeforcesHandle}
                onChange={(e) => handleChange("codeforcesHandle", e.target.value)}
                required
                className="bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currentRating" className="text-gray-700 dark:text-gray-300">Current Rating</Label>
                <Input
                  id="currentRating"
                  type="number"
                  value={formData.currentRating}
                  onChange={(e) => handleChange("currentRating", parseInt(e.target.value) || 0)}
                  required
                  className="bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="maxRating" className="text-gray-700 dark:text-gray-300">Max Rating</Label>
                <Input
                  id="maxRating"
                  type="number"
                  value={formData.maxRating}
                  onChange={(e) => handleChange("maxRating", parseInt(e.target.value) || 0)}
                  required
                  className="bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="autoEmailDisabled"
                checked={formData.autoEmailDisabled}
                onChange={(e) => handleChange("autoEmailDisabled", e.target.checked)}
                className="rounded border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700"
              />
              <Label htmlFor="autoEmailDisabled" className="text-gray-700 dark:text-gray-300">Disable Auto Email</Label>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                className="border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
              >
                {student ? "Update" : "Add"} Student
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
