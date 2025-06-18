import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProblemChartProps {
  barChartData: Record<number, number>; // { 800: 2, 900: 3, 1200: 5, ... }
}

export const ProblemChart = ({ barChartData }: ProblemChartProps) => {
  // Transform the backend data into chart-compatible format
  const getChartData = () => {
    const buckets = [
      { range: '800-900', min: 800, max: 900, count: 0 },
      { range: '900-1000', min: 900, max: 1000, count: 0 },
      { range: '1000-1200', min: 1000, max: 1200, count: 0 },
      { range: '1200-1400', min: 1200, max: 1400, count: 0 },
      { range: '1400-1600', min: 1400, max: 1600, count: 0 },
      { range: '1600-1800', min: 1600, max: 1800, count: 0 },
      { range: '1800+', min: 1800, max: Infinity, count: 0 }
    ];

    // Count problems in each bucket from the backend data
    Object.entries(barChartData).forEach(([ratingStr, count]) => {
      const rating = parseInt(ratingStr);
      const bucket = buckets.find(b => rating >= b.min && rating < b.max);
      if (bucket) bucket.count += count;
    });

    return buckets.filter(bucket => bucket.count > 0);
  };

  const chartData = getChartData();

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" stroke="currentColor" />
          <XAxis 
            dataKey="range" 
            tick={{ fontSize: 12, fill: 'currentColor' }}
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
            formatter={(value: number) => [value, 'Problems Solved']}
          />
          <Bar 
            dataKey="count" 
            fill="url(#barGradient)"
            radius={[4, 4, 0, 0]}
          />
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};