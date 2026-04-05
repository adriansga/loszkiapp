import { supabase } from '@/lib/db';
import Link from 'next/link';

function getWeekNumber(date: Date) {
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = date.getTime() - start.getTime();
  return Math.ceil((diff / 86400000 + start.getDay() + 1) / 7);
}

const proteinColors: Record<string, string> = {
  hi: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  md: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  ok: 'bg-blue-100 text-blue-800 border-blue-200',
  lo: 'bg-red-50 text-red-700 border-red-200',
};
const proteinLabels: Record<string, string> = { hi: '💪💪💪 >90g', md: '💪💪 60–90g', ok: '💪 30–60g', lo: '⚠️ <30g' };
const dayLabels = ['', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'];

export default async function ObiadyPage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string; view?: string }>;
}) {
  const params = await searchParams;
  const today = new Date();
  const currentWeek = getWeekNumber(today);
  const selectedWeek = params.week ? parseInt(params.week) : currentWeek;
  const view = params.view || 'week';

  const { data: weekPlan } = await supabase
    .from('weekly_plan')
    .select('*')
    .eq('week_number', selectedWeek)
    .order('day_of_week');

  const { data: allMeals } = await supabase
    .from('meals')
    .select('*')
    .order('category')
    .order('name');

  const mealsData = (allMeals || []) as Array<{
    id: number;
    name: string;
    category: string;
    prep_time: number;
    protein_per_serving: number;
    protein_rating: string;
    notes: string;
  }>;

  const mealsMap = mealsData.reduce((acc, m) => { acc[m.id] = m; return acc; }, {} as Record<number, typeof mealsData[0]>);

  const weekMeals = (weekPlan || []).map(wp => ({
    day_of_week: wp.day_of_week as number,
    meal_name: wp.meal_name as string,
    protein_rating: mealsMap[wp.meal_id]?.protein_rating || '',
    prep_time: mealsMap[wp.meal_id]?.prep_time || null,
    notes: mealsMap[wp.meal_id]?.notes || '',
    category: mealsMap[wp.meal_id]?.category || '',
    ingredient_chain: wp.ingredient_chain as string || '',
    cost_estimate: wp.cost_estimate as number || 0,
  }));

  const categoryGroups = mealsData.reduce((acc, m) => {
    if (!acc[m.category]) acc[m.category] = [];
    acc[m.category].push(m);
    return acc;
  }, {} as Record<string, typeof mealsData>);

  const categoryLabels: Record<string, string> = {
    kurczak: '🍗 Kurczak',
    wieprzowina: '🥩 Wieprzowina',
    makaron: '🍝 Makarony',
    jajka: '🥚 Jajka',
    kasza: '🌾 Kasza',
    ziemniaki: '🥔 Ziemniaki',
    slodkie: '🍬 Słodkie (niedziela)',
    szybkie: '⚡ Szybkie',
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-800">Plan obiadów</h1>
          <p className="text-zinc-500 text-sm mt-0.5">Tydzień {selectedWeek} / 52</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/obiady?week=${selectedWeek - 1}&view=${view}`}
            className="px-3 py-1.5 text-sm rounded-lg border border-zinc-200 hover:bg-zinc-100 text-zinc-600"
          >
            ← Poprzedni
          </Link>
          <span className="text-sm font-medium text-zinc-700 w-20 text-center">
            Tydz. {selectedWeek}
            {selectedWeek === currentWeek && <span className="ml-1 text-xs text-emerald-600">(obecny)</span>}
          </span>
          <Link
            href={`/obiady?week=${selectedWeek + 1}&view=${view}`}
            className="px-3 py-1.5 text-sm rounded-lg border border-zinc-200 hover:bg-zinc-100 text-zinc-600"
          >
            Następny →
          </Link>
          <Link
            href={`/obiady?week=${currentWeek}&view=${view}`}
            className="px-3 py-1.5 text-sm rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Dziś
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-zinc-100 rounded-lg p-1 w-fit">
        {['week', 'meals'].map(v => (
          <Link
            key={v}
            href={`/obiady?week=${selectedWeek}&view=${v}`}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              view === v ? 'bg-white shadow-sm text-zinc-800' : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            {v === 'week' ? '📅 Tydzień' : '🍽️ Wszystkie dania'}
          </Link>
        ))}
      </div>

      {view === 'week' && (
        <div className="flex flex-col gap-3">
          {weekMeals.length === 0 ? (
            <div className="bg-white rounded-xl p-8 border border-zinc-200 text-center">
              <p className="text-zinc-400 mb-2">Brak planu na tydzień {selectedWeek}</p>
              <p className="text-sm text-zinc-400">Plan tygodniowy możesz dodać przez edycję bazy danych</p>
            </div>
          ) : (
            weekMeals.map(meal => (
              <div
                key={meal.day_of_week}
                className={`bg-white rounded-xl p-4 border ${proteinColors[meal.protein_rating] || 'border-zinc-200'} shadow-sm`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-zinc-400 w-12 shrink-0">
                      {dayLabels[meal.day_of_week]}
                    </span>
                    <div>
                      <p className="font-semibold text-zinc-800">{meal.meal_name}</p>
                      {meal.notes && (
                        <p className="text-xs text-zinc-500 mt-0.5">{meal.notes}</p>
                      )}
                      {meal.ingredient_chain && (
                        <p className="text-xs text-blue-600 mt-0.5">← {meal.ingredient_chain}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {meal.prep_time && (
                      <span className="text-xs text-zinc-400">⏱️ {meal.prep_time} min</span>
                    )}
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${proteinColors[meal.protein_rating] || ''}`}>
                      {proteinLabels[meal.protein_rating]}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
          {weekMeals.length > 0 && (
            <div className="mt-2">
              <Link
                href={`/zakupy?week=${selectedWeek}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700"
              >
                🛒 Generuj listę zakupów na ten tydzień
              </Link>
            </div>
          )}
        </div>
      )}

      {view === 'meals' && (
        <div className="flex flex-col gap-6">
          {Object.entries(categoryGroups).map(([cat, meals]) => (
            <div key={cat}>
              <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide mb-3">
                {categoryLabels[cat] || cat}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {meals.map(meal => (
                  <div
                    key={meal.id}
                    className={`bg-white rounded-lg p-3 border ${proteinColors[meal.protein_rating] || 'border-zinc-200'}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-zinc-800 text-sm">{meal.name}</p>
                        {meal.notes && (
                          <p className="text-xs text-zinc-500 mt-0.5 leading-snug">{meal.notes}</p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-xs">{proteinLabels[meal.protein_rating]}</span>
                        {meal.prep_time && (
                          <span className="text-xs text-zinc-400">⏱️ {meal.prep_time} min</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
