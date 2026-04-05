'use client';

import { useState, useTransition } from 'react';
import { addExpense, deleteExpense } from './actions';

type Bill = { id: number; name: string; amount: number; due_day: number; category: string; daysLeft: number };
type Expense = { id: number; date: string; category: string; amount: number; description: string };

const FOOD_BUDGET = 220;

export default function BudzetClient({
  bills,
  expenses: initialExpenses,
  totalBills,
  totalExpenses: initialTotal,
  currentMonth,
}: {
  bills: Bill[];
  expenses: Expense[];
  totalBills: number;
  totalExpenses: number;
  currentMonth: string;
}) {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [totalExpenses, setTotalExpenses] = useState(initialTotal);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0, 10), category: 'jedzenie', amount: '', description: '' });
  const [isPending, startTransition] = useTransition();

  const urgentBills = bills.filter(b => b.daysLeft <= 5);
  const foodExpenses = expenses.filter(e => e.category === 'jedzenie').reduce((sum, e) => sum + e.amount, 0);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.amount) return;
    startTransition(async () => {
      const result = await addExpense(form);
      if (result.expense) {
        setExpenses(prev => [result.expense as Expense, ...prev]);
        setTotalExpenses(prev => prev + (result.expense as Expense).amount);
        setForm(prev => ({ ...prev, amount: '', description: '' }));
        setShowForm(false);
      }
    });
  }

  function handleDelete(id: number, amount: number) {
    startTransition(async () => {
      await deleteExpense(id);
      setExpenses(prev => prev.filter(e => e.id !== id));
      setTotalExpenses(prev => prev - amount);
    });
  }

  const categoryColors: Record<string, string> = {
    jedzenie: 'bg-emerald-100 text-emerald-700',
    transport: 'bg-blue-100 text-blue-700',
    rozrywka: 'bg-purple-100 text-purple-700',
    zdrowie: 'bg-red-100 text-red-700',
    inne: 'bg-zinc-100 text-zinc-600',
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-800">Budżet i rachunki</h1>
          <p className="text-zinc-500 text-sm mt-0.5">
            {new Date(currentMonth + '-01').toLocaleDateString('pl-PL', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700"
        >
          + Dodaj wydatek
        </button>
      </div>

      {/* Karty podsumowania */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-zinc-200">
          <p className="text-xs text-zinc-400 uppercase tracking-wide mb-1">Rachunki cykliczne</p>
          <p className="text-2xl font-bold text-zinc-800">{totalBills} zł</p>
          <p className="text-xs text-zinc-400 mt-1">miesięcznie</p>
        </div>
        <div className={`bg-white rounded-xl p-4 border ${foodExpenses > FOOD_BUDGET ? 'border-red-300 bg-red-50' : 'border-zinc-200'}`}>
          <p className="text-xs text-zinc-400 uppercase tracking-wide mb-1">Jedzenie</p>
          <p className={`text-2xl font-bold ${foodExpenses > FOOD_BUDGET ? 'text-red-600' : 'text-zinc-800'}`}>
            {foodExpenses} zł
          </p>
          <p className="text-xs text-zinc-400 mt-1">
            budżet: {FOOD_BUDGET} zł · {foodExpenses > FOOD_BUDGET ? `przekroczono o ${foodExpenses - FOOD_BUDGET} zł` : `zostało ${FOOD_BUDGET - foodExpenses} zł`}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-zinc-200">
          <p className="text-xs text-zinc-400 uppercase tracking-wide mb-1">Wszystkie wydatki</p>
          <p className="text-2xl font-bold text-zinc-800">{totalExpenses} zł</p>
          <p className="text-xs text-zinc-400 mt-1">w tym miesiącu</p>
        </div>
      </div>

      {/* Alert rachunki */}
      {urgentBills.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-5">
          <p className="text-sm font-semibold text-orange-800 mb-2">💳 Płatności w ciągu 5 dni</p>
          {urgentBills.map(b => (
            <div key={b.id} className="flex items-center justify-between text-sm py-1">
              <span className="text-orange-700 font-medium">{b.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-orange-600">{b.amount} zł</span>
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                  {b.daysLeft === 0 ? 'DZIŚ!' : `za ${b.daysLeft} dni`}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Rachunki cykliczne */}
        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
          <div className="px-4 py-3 bg-zinc-50 border-b border-zinc-200">
            <p className="text-sm font-semibold text-zinc-700">Rachunki cykliczne</p>
          </div>
          <div className="divide-y divide-zinc-100">
            {bills.map(b => (
              <div key={b.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-zinc-800">{b.name}</p>
                  <p className="text-xs text-zinc-400">{b.due_day}. każdego miesiąca</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-zinc-700">{b.amount} zł</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    b.daysLeft <= 3 ? 'bg-red-100 text-red-700' :
                    b.daysLeft <= 7 ? 'bg-orange-100 text-orange-700' :
                    'bg-zinc-100 text-zinc-500'
                  }`}>
                    {b.daysLeft === 0 ? 'dziś' : `${b.daysLeft}d`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wydatki */}
        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
          <div className="px-4 py-3 bg-zinc-50 border-b border-zinc-200">
            <p className="text-sm font-semibold text-zinc-700">Wydatki w tym miesiącu</p>
          </div>

          {showForm && (
            <form onSubmit={handleAdd} className="p-4 border-b border-zinc-100 bg-zinc-50">
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                    className="flex-1 px-3 py-2 text-sm border border-zinc-200 rounded-lg"
                  />
                  <select
                    value={form.category}
                    onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                    className="px-2 py-2 text-sm border border-zinc-200 rounded-lg bg-white"
                  >
                    {['jedzenie', 'transport', 'rozrywka', 'zdrowie', 'inne'].map(c => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <input
                    value={form.description}
                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    placeholder="Opis (np. Biedronka)"
                    className="flex-1 px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <input
                    value={form.amount}
                    onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
                    placeholder="Kwota"
                    type="number"
                    step="0.01"
                    className="w-24 px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isPending}
                    className="px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50"
                  >
                    ✓
                  </button>
                </div>
              </div>
            </form>
          )}

          <div className="divide-y divide-zinc-100 max-h-80 overflow-y-auto">
            {expenses.length === 0 ? (
              <p className="text-sm text-zinc-400 px-4 py-6 text-center">Brak wydatków w tym miesiącu</p>
            ) : (
              expenses.map(e => (
                <div key={e.id} className="flex items-center justify-between px-4 py-2.5 group">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-1.5 py-0.5 rounded ${categoryColors[e.category] || categoryColors.inne}`}>
                        {e.category}
                      </span>
                      <span className="text-sm text-zinc-700">{e.description || '—'}</span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">{e.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-zinc-800">{e.amount} zł</span>
                    <button
                      onClick={() => handleDelete(e.id, e.amount)}
                      className="text-zinc-200 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
