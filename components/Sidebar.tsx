'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const nav = [
  { href: '/', label: 'Dashboard', icon: '🏠' },
  { href: '/obiady', label: 'Obiady', icon: '🍽️' },
  { href: '/zakupy', label: 'Zakupy', icon: '🛒' },
  { href: '/spizarnia', label: 'Spiżarnia', icon: '📦' },
  { href: '/budzet', label: 'Budżet', icon: '💰' },
  { href: '/agent', label: 'Agent AI', icon: '🤖' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 min-h-screen bg-zinc-900 text-white flex flex-col">
      <div className="px-5 py-6 border-b border-zinc-700">
        <h1 className="text-lg font-bold tracking-tight">🏠 Loszki</h1>
        <p className="text-xs text-zinc-400 mt-0.5">Panel domowy</p>
      </div>
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {nav.map(({ href, label, icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-emerald-600 text-white'
                  : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              <span className="text-base">{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="px-5 py-4 border-t border-zinc-700">
        <p className="text-xs text-zinc-500">Adrian & Kasia</p>
        <p className="text-xs text-zinc-600">v0.1 · Faza 1</p>
      </div>
    </aside>
  );
}
