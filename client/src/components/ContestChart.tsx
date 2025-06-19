import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RatingData {
  x: string; // ISO date string
  y: number; // newRating
}

interface ContestChartProps {
  ratingData: RatingData[];
}

export const ContestChart = ({ ratingData }: ContestChartProps) => {
  // Sort by date
  const sortedData = [...ratingData].sort(
    (a, b) => new Date(a.x).getTime() - new Date(b.x).getTime()
  );

  // Format for Recharts
  const chartData = sortedData.map(item => ({
    date: new Date(item.x).toLocaleDateString(),
    rating: item.y,
  }));

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" stroke="currentColor" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12, fill: 'currentColor' }}
            angle={-45}
            textAnchor="end"
            height={60}
            stroke="currentColor"
          />
          <YAxis tick={{ fontSize: 12, fill: 'currentColor' }} stroke="currentColor" />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              color: 'hsl(var(--card-foreground))'
            }}
            formatter={(value: number) => [value, 'Rating']}
          />
          <Line 
            type="monotone" 
            dataKey="rating" 
            stroke="url(#colorGradient)" 
            strokeWidth={3}
            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#059669' }}
          />
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#0891b2" />
            </linearGradient>
          </defs>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};




// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// interface Contest {
//   name: string;
//   date: string;
//   ratingChange: number;
//   rank: number;
//   unsolvedProblems: number;
//   newRating: number;
// }

// interface ContestChartProps {
//   contests: Contest[];
// }

// export const ContestChart = ({ contests }: ContestChartProps) => {
//   const chartData = contests
//     .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
//     .map(contest => ({
//       date: new Date(contest.date).toLocaleDateString(),
//       rating: contest.newRating,
//       change: contest.ratingChange
//     }));

//   return (
//     <div className="h-80">
//       <ResponsiveContainer width="100%" height="100%">
//         <LineChart data={chartData}>
//           <CartesianGrid strokeDasharray="3 3" className="opacity-30" stroke="currentColor" />
//           <XAxis 
//             dataKey="date" 
//             tick={{ fontSize: 12, fill: 'currentColor' }}
//             angle={-45}
//             textAnchor="end"
//             height={60}
//             stroke="currentColor"
//           />
//           <YAxis tick={{ fontSize: 12, fill: 'currentColor' }} stroke="currentColor" />
//           <Tooltip 
//             contentStyle={{
//               backgroundColor: 'hsl(var(--card))',
//               border: '1px solid hsl(var(--border))',
//               borderRadius: '8px',
//               boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
//               color: 'hsl(var(--card-foreground))'
//             }}
//             formatter={(value: number, name: string) => [
//               name === 'rating' ? value : `${value > 0 ? '+' : ''}${value}`,
//               name === 'rating' ? 'Rating' : 'Change'
//             ]}
//           />
//           <Line 
//             type="monotone" 
//             dataKey="rating" 
//             stroke="url(#colorGradient)" 
//             strokeWidth={3}
//             dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
//             activeDot={{ r: 6, fill: '#059669' }}
//           />
//           <defs>
//             <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
//               <stop offset="0%" stopColor="#10b981" />
//               <stop offset="100%" stopColor="#0891b2" />
//             </linearGradient>
//           </defs>
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };
