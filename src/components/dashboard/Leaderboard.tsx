// components/dashboard/Leaderboard.tsx
export function Leaderboard() {
    const topCreators = [
      { name: 'Creator A', earnings: 5000 },
      { name: 'Creator B', earnings: 4500 },
      { name: 'Creator C', earnings: 4000 },
    ];
  
    return (
      <div className="border p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-6">LEADERBOARD</h2>
        <ul>
          {topCreators.map((creator, index) => (
            <li key={index} className="flex justify-between py-2">
              <span>{creator.name}</span>
              <span>${creator.earnings}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }