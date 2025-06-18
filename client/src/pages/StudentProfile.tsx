import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Trophy, TrendingUp, Calendar, Target } from "lucide-react";
import { ContestChart } from "@/components/ContestChart";
import { ProblemChart } from "@/components/ProblemChart";
import { SubmissionHeatmap } from "@/components/SubmissionHeatmap";
import apiClient from "@/api/axiosConfig";

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

interface Contest {
  name: string;
  date: string;
  ratingChange: number;
  rank: number;
  newRating: number;
}

interface ProblemStats {
  mostDifficult: number;
  totalSolved: number;
  avgRating: string;
  avgPerDay: string;
  barChartData: Record<number, number>;
  heatmap: Record<string, number>;
}

interface SubmissionHeatmapProps {
  heatmap: Record<string, number>; // Matches your backend's heatmap structure
  // Add any other props the component needs
}

const StudentProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [contests, setContests] = useState<Contest[]>([]);
  const [problemStats, setProblemStats] = useState<ProblemStats | null>(null);
  const [contestFilter, setContestFilter] = useState<"30" | "90" | "365">("90");
  const [problemFilter, setProblemFilter] = useState<"7" | "30" | "90">("30");
  const [loading, setLoading] = useState({
    student: true,
    contests: true,
    problems: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading((prev) => ({ ...prev, student: true }));
        const studentRes = await apiClient.get(`/students/${id}`);
        setStudent(studentRes.data);
        console.log(studentRes.data);
        setLoading((prev) => ({ ...prev, student: false }));

        setLoading((prev) => ({ ...prev, contests: true }));
        const contestsRes = await apiClient.get(
          `/students/${id}/contests?range=${contestFilter}`
        );
        setContests(contestsRes.data.contestList || []);
        console.log(contestsRes.data);
        setLoading((prev) => ({ ...prev, contests: false }));

        setLoading((prev) => ({ ...prev, problems: true }));
        const problemsRes = await apiClient.get(
          `/students/${id}/problems?range=${problemFilter}`
        );
        setProblemStats(problemsRes.data);
        console.log(problemsRes.data);
        setLoading((prev) => ({ ...prev, problems: false }));
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading({
          student: false,
          contests: false,
          problems: false,
        });
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, contestFilter, problemFilter]);

  const getRatingColor = (rating: number) => {
    if (rating >= 1900)
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    if (rating >= 1600)
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
    if (rating >= 1400)
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
    if (rating >= 1200)
      return "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300";
    return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  };

  const getFilteredContests = () => {
    if (loading.contests) return [];
    return contests;
  };

  if (loading.student || !student) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link to="/dashboard">
          <Button
            variant="outline"
            className="mb-4 border-emerald-300 dark:border-slate-600 hover:bg-emerald-50 dark:hover:bg-slate-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {student.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              @{student.codeforcesHandle}
            </p>
          </div>
          <Badge
            className={
              getRatingColor(student.currentRating) + " text-lg px-4 py-2"
            }
          >
            {student.currentRating}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90 flex items-center">
              <Trophy className="w-4 h-4 mr-2" />
              Current Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{student.currentRating}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Max Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{student.maxRating}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-violet-500 to-purple-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90 flex items-center">
              <Target className="w-4 h-4 mr-2" />
              Problems Solved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {problemStats?.totalSolved || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-pink-500 to-rose-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Avg Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {problemStats?.avgRating || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="contests" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-white dark:bg-slate-800">
          <TabsTrigger value="contests">Contest History</TabsTrigger>
          <TabsTrigger value="problems">Problem Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="contests" className="space-y-6">
          <Card className="bg-white dark:bg-slate-800 transition-colors duration-300">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-gray-900 dark:text-white">
                  Rating Progress
                </CardTitle>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant={contestFilter === "30" ? "default" : "outline"}
                    onClick={() => setContestFilter("30")}
                    className={
                      contestFilter === "30"
                        ? "bg-emerald-500 hover:bg-emerald-600"
                        : ""
                    }
                  >
                    30 days
                  </Button>
                  <Button
                    size="sm"
                    variant={contestFilter === "90" ? "default" : "outline"}
                    onClick={() => setContestFilter("90")}
                    className={
                      contestFilter === "90"
                        ? "bg-emerald-500 hover:bg-emerald-600"
                        : ""
                    }
                  >
                    90 days
                  </Button>
                  <Button
                    size="sm"
                    variant={contestFilter === "365" ? "default" : "outline"}
                    onClick={() => setContestFilter("365")}
                    className={
                      contestFilter === "365"
                        ? "bg-emerald-500 hover:bg-emerald-600"
                        : ""
                    }
                  >
                    1 year
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading.contests ? (
                <div className="flex justify-center items-center h-64">
                  Loading contest data...
                </div>
              ) : (
                <ContestChart
                  contests={getFilteredContests().map((contest) => ({
                    ...contest,
                    unsolvedProblems: 0, // Add default value if ContestChart requires it
                  }))}
                />
              )}
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 transition-colors duration-300">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">
                Contest Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading.contests ? (
                <div className="flex justify-center items-center h-64">
                  Loading contest details...
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b dark:border-slate-600">
                        <th className="text-left py-2 text-gray-900 dark:text-white">
                          Contest
                        </th>
                        <th className="text-left py-2 text-gray-900 dark:text-white">
                          Date
                        </th>
                        <th className="text-left py-2 text-gray-900 dark:text-white">
                          Rank
                        </th>
                        <th className="text-left py-2 text-gray-900 dark:text-white">
                          Rating Change
                        </th>
                        <th className="text-left py-2 text-gray-900 dark:text-white">
                          New Rating
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredContests().map((contest, index) => (
                        <tr
                          key={index}
                          className="border-b dark:border-slate-600"
                        >
                          <td className="py-2 font-medium text-gray-900 dark:text-white">
                            {contest.name}
                          </td>
                          <td className="py-2 text-gray-900 dark:text-white">
                            {new Date(contest.date).toLocaleDateString()}
                          </td>
                          <td className="py-2 text-gray-900 dark:text-white">
                            {contest.rank}
                          </td>
                          <td className="py-2">
                            <span
                              className={
                                contest.ratingChange > 0
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-red-600 dark:text-red-400"
                              }
                            >
                              {contest.ratingChange > 0 ? "+" : ""}
                              {contest.ratingChange}
                            </span>
                          </td>
                          <td className="py-2 text-gray-900 dark:text-white">
                            {contest.newRating}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="problems" className="space-y-6">
          <Card className="bg-white dark:bg-slate-800 transition-colors duration-300">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-gray-900 dark:text-white">
                  Problem Solving Metrics
                </CardTitle>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant={problemFilter === "7" ? "default" : "outline"}
                    onClick={() => setProblemFilter("7")}
                    className={
                      problemFilter === "7"
                        ? "bg-emerald-500 hover:bg-emerald-600"
                        : ""
                    }
                  >
                    7 days
                  </Button>
                  <Button
                    size="sm"
                    variant={problemFilter === "30" ? "default" : "outline"}
                    onClick={() => setProblemFilter("30")}
                    className={
                      problemFilter === "30"
                        ? "bg-emerald-500 hover:bg-emerald-600"
                        : ""
                    }
                  >
                    30 days
                  </Button>
                  <Button
                    size="sm"
                    variant={problemFilter === "90" ? "default" : "outline"}
                    onClick={() => setProblemFilter("90")}
                    className={
                      problemFilter === "90"
                        ? "bg-emerald-500 hover:bg-emerald-600"
                        : ""
                    }
                  >
                    90 days
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading.problems ? (
                <div className="flex justify-center items-center h-64">
                  Loading problem stats...
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {problemStats?.totalSolved || 0}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Total Solved
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                        {problemStats?.avgRating || 0}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Avg Rating
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                        {problemStats?.avgPerDay || 0}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Problems/Day
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                        {problemStats?.mostDifficult || 0}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Hardest Solved
                      </div>
                    </div>
                  </div>
                  <ProblemChart
                    barChartData={problemStats?.barChartData || {}}
                  />
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 transition-colors duration-300">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">
                Submission Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading.problems ? (
                <div className="flex justify-center items-center h-64">
                  Loading heatmap...
                </div>
              ) : (
                <SubmissionHeatmap heatmap={problemStats?.heatmap || {}} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentProfile;






// import { useState, useEffect } from "react";
// import { useParams, Link } from "react-router-dom";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { ArrowLeft, Trophy, TrendingUp, Calendar, Target } from "lucide-react";
// import { ContestChart } from "@/components/ContestChart";
// import { ProblemChart } from "@/components/ProblemChart";
// import { SubmissionHeatmap } from "@/components/SubmissionHeatmap";
// import apiClient from "@/api/axiosConfig";

// interface Student {
//   _id: string;
//   name: string;
//   email: string;
//   phone: string;
//   codeforcesHandle: string;
//   currentRating: number;
//   maxRating: number;
//   lastSynced: string;
//   autoEmailDisabled: boolean;
//   emailRemindersSent: number;
// }

// interface Contest {
//   name: string;
//   date: string;
//   ratingChange: number;
//   rank: number;
//   unsolvedProblems: number;
//   newRating: number;
// }

// interface Problem {
//   name: string;
//   rating: number;
//   solvedAt: string;
//   tags: string[];
// }

// const StudentProfile = () => {
//   const { id } = useParams<{ id: string }>();
//   const [student, setStudent] = useState<Student | null>(null);
//   const [contests, setContests] = useState<Contest[]>([]);
//   const [problems, setProblems] = useState<Problem[]>([]);
//   const [contestFilter, setContestFilter] = useState<"30" | "90" | "365">("90");
//   const [problemFilter, setProblemFilter] = useState<"7" | "30" | "90">("30");

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const studentRes = await apiClient.get(`/students/${id}`);
//         setStudent(studentRes.data);

//         const contestsRes = await apiClient.get(`/students/${id}/contests`);
//         setContests(contestsRes.data.contestList || []);

//         const problemsRes = await apiClient.get(`/students/${id}/problems`);
//         setProblems(problemsRes.data.problemList || []);
//         console.log("Student:", studentRes.data);
//         console.log("Contests:", contestsRes.data.contestList);
//         console.log("Problems:", problemsRes.data.problemList);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     if (id) {
//       fetchData();
//     }
//   }, [id]);

//   if (!student) {
//     return <div>Loading...</div>;
//   }

//   const getRatingColor = (rating: number) => {
//     if (rating >= 1900)
//       return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
//     if (rating >= 1600)
//       return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
//     if (rating >= 1400)
//       return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
//     if (rating >= 1200)
//       return "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300";
//     return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
//   };

//   const getFilteredContests = () => {
//     const days = parseInt(contestFilter);
//     const cutoffDate = new Date();
//     cutoffDate.setDate(cutoffDate.getDate() - days);
//     return contests.filter((contest) => new Date(contest.date) >= cutoffDate);
//   };

//   const getFilteredProblems = () => {
//     const days = parseInt(problemFilter);
//     const cutoffDate = new Date();
//     cutoffDate.setDate(cutoffDate.getDate() - days);
//     return problems.filter(
//       (problem) => new Date(problem.solvedAt) >= cutoffDate
//     );
//   };

//   const getProblemStats = () => {
//     const filteredProblems = getFilteredProblems();
//     const totalSolved = filteredProblems.length;
//     const avgRating =
//       totalSolved > 0
//         ? Math.round(
//             filteredProblems.reduce((acc, p) => acc + p.rating, 0) / totalSolved
//           )
//         : 0;
//     const avgPerDay = totalSolved / parseInt(problemFilter);
//     const maxRating = Math.max(...filteredProblems.map((p) => p.rating), 0);

//     return { totalSolved, avgRating, avgPerDay, maxRating };
//   };

//   const stats = getProblemStats();

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <div className="mb-6">
//         <Link to="/dashboard">
//           <Button
//             variant="outline"
//             className="mb-4 border-emerald-300 dark:border-slate-600 hover:bg-emerald-50 dark:hover:bg-slate-700"
//           >
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Back to Dashboard
//           </Button>
//         </Link>

//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
//               {student.name}
//             </h1>
//             <p className="text-gray-600 dark:text-gray-300">
//               @{student.codeforcesHandle}
//             </p>
//           </div>
//           <Badge
//             className={
//               getRatingColor(student.currentRating) + " text-lg px-4 py-2"
//             }
//           >
//             {student.currentRating}
//           </Badge>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//         <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-medium opacity-90 flex items-center">
//               <Trophy className="w-4 h-4 mr-2" />
//               Current Rating
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{student.currentRating}</div>
//           </CardContent>
//         </Card>

//         <Card className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-medium opacity-90 flex items-center">
//               <TrendingUp className="w-4 h-4 mr-2" />
//               Max Rating
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{student.maxRating}</div>
//           </CardContent>
//         </Card>

//         <Card className="bg-gradient-to-r from-violet-500 to-purple-600 text-white">
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-medium opacity-90 flex items-center">
//               <Target className="w-4 h-4 mr-2" />
//               Problems Solved
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{stats.totalSolved}</div>
//           </CardContent>
//         </Card>

//         <Card className="bg-gradient-to-r from-pink-500 to-rose-600 text-white">
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-medium opacity-90 flex items-center">
//               <Calendar className="w-4 h-4 mr-2" />
//               Avg Rating
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{stats.avgRating}</div>
//           </CardContent>
//         </Card>
//       </div>

//       <Tabs defaultValue="contests" className="space-y-6">
//         <TabsList className="grid w-full grid-cols-2 bg-white dark:bg-slate-800">
//           <TabsTrigger value="contests">Contest History</TabsTrigger>
//           <TabsTrigger value="problems">Problem Analytics</TabsTrigger>
//         </TabsList>

//         <TabsContent value="contests" className="space-y-6">
//           <Card className="bg-white dark:bg-slate-800 transition-colors duration-300">
//             <CardHeader>
//               <div className="flex justify-between items-center">
//                 <CardTitle className="text-gray-900 dark:text-white">
//                   Rating Progress
//                 </CardTitle>
//                 <div className="flex space-x-2">
//                   <Button
//                     size="sm"
//                     variant={contestFilter === "30" ? "default" : "outline"}
//                     onClick={() => setContestFilter("30")}
//                     className={
//                       contestFilter === "30"
//                         ? "bg-emerald-500 hover:bg-emerald-600"
//                         : ""
//                     }
//                   >
//                     30 days
//                   </Button>
//                   <Button
//                     size="sm"
//                     variant={contestFilter === "90" ? "default" : "outline"}
//                     onClick={() => setContestFilter("90")}
//                     className={
//                       contestFilter === "90"
//                         ? "bg-emerald-500 hover:bg-emerald-600"
//                         : ""
//                     }
//                   >
//                     90 days
//                   </Button>
//                   <Button
//                     size="sm"
//                     variant={contestFilter === "365" ? "default" : "outline"}
//                     onClick={() => setContestFilter("365")}
//                     className={
//                       contestFilter === "365"
//                         ? "bg-emerald-500 hover:bg-emerald-600"
//                         : ""
//                     }
//                   >
//                     1 year
//                   </Button>
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <ContestChart contests={getFilteredContests()} />
//             </CardContent>
//           </Card>

//           <Card className="bg-white dark:bg-slate-800 transition-colors duration-300">
//             <CardHeader>
//               <CardTitle className="text-gray-900 dark:text-white">
//                 Contest Details
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead>
//                     <tr className="border-b dark:border-slate-600">
//                       <th className="text-left py-2 text-gray-900 dark:text-white">
//                         Contest
//                       </th>
//                       <th className="text-left py-2 text-gray-900 dark:text-white">
//                         Date
//                       </th>
//                       <th className="text-left py-2 text-gray-900 dark:text-white">
//                         Rank
//                       </th>
//                       <th className="text-left py-2 text-gray-900 dark:text-white">
//                         Rating Change
//                       </th>
//                       <th className="text-left py-2 text-gray-900 dark:text-white">
//                         Unsolved
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {getFilteredContests().map((contest, index) => (
//                       <tr
//                         key={index}
//                         className="border-b dark:border-slate-600"
//                       >
//                         <td className="py-2 font-medium text-gray-900 dark:text-white">
//                           {contest.name}
//                         </td>
//                         <td className="py-2 text-gray-900 dark:text-white">
//                           {new Date(contest.date).toLocaleDateString()}
//                         </td>
//                         <td className="py-2 text-gray-900 dark:text-white">
//                           {contest.rank}
//                         </td>
//                         <td className="py-2">
//                           <span
//                             className={
//                               contest.ratingChange > 0
//                                 ? "text-emerald-600 dark:text-emerald-400"
//                                 : "text-red-600 dark:text-red-400"
//                             }
//                           >
//                             {contest.ratingChange > 0 ? "+" : ""}
//                             {contest.ratingChange}
//                           </span>
//                         </td>
//                         <td className="py-2 text-gray-900 dark:text-white">
//                           {contest.unsolvedProblems}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="problems" className="space-y-6">
//           <Card className="bg-white dark:bg-slate-800 transition-colors duration-300">
//             <CardHeader>
//               <div className="flex justify-between items-center">
//                 <CardTitle className="text-gray-900 dark:text-white">
//                   Problem Solving Metrics
//                 </CardTitle>
//                 <div className="flex space-x-2">
//                   <Button
//                     size="sm"
//                     variant={problemFilter === "7" ? "default" : "outline"}
//                     onClick={() => setProblemFilter("7")}
//                     className={
//                       problemFilter === "7"
//                         ? "bg-emerald-500 hover:bg-emerald-600"
//                         : ""
//                     }
//                   >
//                     7 days
//                   </Button>
//                   <Button
//                     size="sm"
//                     variant={problemFilter === "30" ? "default" : "outline"}
//                     onClick={() => setProblemFilter("30")}
//                     className={
//                       problemFilter === "30"
//                         ? "bg-emerald-500 hover:bg-emerald-600"
//                         : ""
//                     }
//                   >
//                     30 days
//                   </Button>
//                   <Button
//                     size="sm"
//                     variant={problemFilter === "90" ? "default" : "outline"}
//                     onClick={() => setProblemFilter("90")}
//                     className={
//                       problemFilter === "90"
//                         ? "bg-emerald-500 hover:bg-emerald-600"
//                         : ""
//                     }
//                   >
//                     90 days
//                   </Button>
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
//                     {stats.totalSolved}
//                   </div>
//                   <div className="text-sm text-gray-600 dark:text-gray-400">
//                     Total Solved
//                   </div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
//                     {stats.avgRating}
//                   </div>
//                   <div className="text-sm text-gray-600 dark:text-gray-400">
//                     Avg Rating
//                   </div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">
//                     {stats.avgPerDay.toFixed(1)}
//                   </div>
//                   <div className="text-sm text-gray-600 dark:text-gray-400">
//                     Problems/Day
//                   </div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">
//                     {stats.maxRating}
//                   </div>
//                   <div className="text-sm text-gray-600 dark:text-gray-400">
//                     Hardest Solved
//                   </div>
//                 </div>
//               </div>
//               <ProblemChart problems={getFilteredProblems()} />
//             </CardContent>
//           </Card>

//           <Card className="bg-white dark:bg-slate-800 transition-colors duration-300">
//             <CardHeader>
//               <CardTitle className="text-gray-900 dark:text-white">
//                 Submission Activity
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <SubmissionHeatmap problems={problems} />
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// };

// export default StudentProfile;
