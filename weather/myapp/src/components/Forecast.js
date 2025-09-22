import React from "react";

const Forecast = ({ data, selectedDay, setSelectedDay, darkMode }) => {
  if (!data?.list) return null;

  // Group by local date (YYYY-MM-DD)
  const daysMap = {};
  data.list.forEach((item) => {
    const d = new Date(item.dt * 1000);
    const dayKey = d.toISOString().slice(0, 10);
    if (!daysMap[dayKey]) daysMap[dayKey] = [];
    daysMap[dayKey].push(item);
  });

  const entries = Object.entries(daysMap);

  return (
    <div className={`${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-200'} backdrop-blur-md p-6 rounded-2xl shadow-xl mb-6 border`}>
      <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>6-Day Forecast</h3>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {entries.slice(0, 6).map(([date, items]) => {
          const d = new Date(date);
          const label = d.toLocaleDateString("en-US", {
            weekday: "short",
            day: "numeric",
            month: "short",
          });
          
          const maxTemp = Math.round(Math.max(...items.map(item => item.main.temp_max)));
          const minTemp = Math.round(Math.min(...items.map(item => item.main.temp_min)));
          
          const willRain = items.some(item => 
            item.weather[0].main.toLowerCase().includes('rain')
          );
          
          const middayItem = items.find(item => {
            const hour = new Date(item.dt * 1000).getHours();
            return hour >= 10 && hour <= 14;
          }) || items[Math.floor(items.length/2)];
          
          const icon = middayItem.weather?.[0]?.icon;

          return (
           <button
             key={date}
             onClick={() => setSelectedDay(items)}
             className={`min-w-[160px] p-6 rounded-2xl flex-shrink-0 transition-all flex flex-col items-center border ${
               selectedDay === items
                 ? `${darkMode ? 'bg-blue-700 border-blue-600' : 'bg-blue-500 border-blue-400'} scale-105 text-white`
                 : `${darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-white border-gray-300 hover:bg-gray-100'} ${
                    darkMode ? 'text-white' : 'text-gray-900'
                   } hover:scale-105`
             }`}
           >
             <div className={`text-sm font-medium mb-2 ${
               selectedDay === items ? 'text-white' : darkMode ? 'text-gray-200' : 'text-gray-700'
             }`}>
               {label}
             </div>
             {willRain && (
               <div className={`text-xs mb-1 ${
                 selectedDay === items ? 'text-blue-200' : darkMode ? 'text-blue-300' : 'text-blue-600'
               }`}>
                 💧 Rain
               </div>
             )}
             <img
               src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
               alt=""
               className="w-16 h-16 mx-auto my-2"
             />
             <div className="flex gap-2 mt-1">
               <span className={`font-bold ${
                 selectedDay === items ? 'text-white' : darkMode ? 'text-gray-100' : 'text-gray-900'
               }`}>
                 {maxTemp}°
               </span>
               <span className={
                 selectedDay === items ? 'text-blue-200' : darkMode ? 'text-gray-400' : 'text-gray-600'
               }>
                 {minTemp}°
               </span>
             </div>
           </button>
          );
        })}
      </div>
    </div>
  );
};

export default Forecast;