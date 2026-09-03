// src/routes/index.tsx
import { calculateWeeklyScore, getCards } from '../lib/scoring';
import { Student } from '../types';

export default function IndexPage() {
  const students = useStore(store => store.students);

  const topPerformers = students
    .map(s => ({ ...s, score: calculateWeeklyScore(s.scores, s.absences, s.discipline, s.level) }))
    .sort((a, b) => b.score.total - a.score.total)
    .slice(0, 9);

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {topPerformers.map((student, i) => (
          <div key={student.id} className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                {i + 1}
              </div>
              <div>
                <h3 className="font-bold">{student.name}</h3>
                <p className="text-3xl font-bold text-emerald-600">{student.score.total} امتیاز</p>
                {student.score.cards && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold">
                      {student.score.cards.type}
                    </span>
                    <span className="text-emerald-600">+{student.score.cards.points} امتیاز</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">کارت‌های جایزه طبق سطح</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {students.map(s => {
            const score = calculateWeeklyScore(s.scores, s.absences, s.discipline, s.level);
            if (!score.cards) return null;
            return (
              <div key={s.id} className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-6 rounded-2xl">
                <div className="text-sm opacity-75">{s.name} — {s.level}</div>
                <div className="text-4xl font-bold mt-2">{score.cards.type}</div>
                <div className="mt-1 text-2xl">+{score.cards.points} امتیاز</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
