interface SubmissionHeatmapProps {
  heatmap: Record<string, number>;
}

export const SubmissionHeatmap = ({ heatmap }: SubmissionHeatmapProps) => {
  const generateHeatmapData = () => {
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    
    const heatmapData = [];
    const currentDate = new Date(oneYearAgo);
    
    while (currentDate <= today) {
      const dateStr = currentDate.toISOString().slice(0, 10); // YYYY-MM-DD format
      const count = heatmap[dateStr] || 0;
      
      heatmapData.push({
        date: new Date(currentDate),
        count: count,
        level: count === 0 ? 0 : count <= 2 ? 1 : count <= 4 ? 2 : count <= 6 ? 3 : 4
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return heatmapData;
  };

  const heatmapData = generateHeatmapData();
  const totalSubmissions = Object.values(heatmap).reduce((sum, count) => sum + count, 0);
  const weeks = [];
  
  for (let i = 0; i < heatmapData.length; i += 7) {
    weeks.push(heatmapData.slice(i, i + 7));
  }

  const getColor = (level: number) => {
    switch (level) {
      case 0: return '#ebedf0';
      case 1: return '#9be9a8';
      case 2: return '#40c463';
      case 3: return '#30a14e';
      case 4: return '#216e39';
      default: return '#ebedf0';
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="inline-flex flex-col space-y-1 p-4">
        <div className="text-sm text-gray-600 mb-2">
          {totalSubmissions} submissions in the last year
        </div>
        <div className="flex space-x-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col space-y-1">
              {week.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className="w-3 h-3 rounded-sm border border-gray-200"
                  style={{ backgroundColor: getColor(day.level) }}
                  title={`${day.date.toDateString()}: ${day.count} submissions`}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
          <span>Less</span>
          <div className="flex space-x-1">
            {[0, 1, 2, 3, 4].map(level => (
              <div
                key={level}
                className="w-3 h-3 rounded-sm border border-gray-200"
                style={{ backgroundColor: getColor(level) }}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
};