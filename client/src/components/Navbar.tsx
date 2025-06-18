import { Button } from "@/components/ui/button";
import { RefreshCw, BookOpen, Sun, Moon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/contexts/ThemeContext";
import apiClient from "@/api/axiosConfig";

export const Navbar = () => {
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();

  const handleSyncAll = async () => {
    toast({
      title: "Syncing all students...",
      description: "This may take a few minutes.",
    });

    try {
      const response = await apiClient.post('/students/sync-all');

      if (!response) {
        throw new Error("Sync failed");
      }

      const data = await response.data;

      toast({
        title: "Sync completed!",
        description: data.message || "All student data has been updated.",
      });
    } catch (error) {
      toast({
        title: "Sync failed",
        description: "There was an error syncing student data.",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-b border-emerald-200 dark:border-slate-600 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-700 dark:from-emerald-400 dark:to-teal-500 bg-clip-text text-transparent">
                Student Progress Manager
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              onClick={toggleTheme}
              variant="outline"
              size="sm"
              className="border-emerald-300 dark:border-slate-600 hover:bg-emerald-50 dark:hover:bg-slate-700"
            >
              {theme === "light" ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </Button>
            <Button
              onClick={handleSyncAll}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Sync All
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
