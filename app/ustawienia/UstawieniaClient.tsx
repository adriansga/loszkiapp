'use client';

import { useState } from 'react';

export default function UstawieniaClient() {
  const [loading, setLoading] = useState(false);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function generateInvite() {
    setLoading(true);
    setCopied(false);
    try {
      const res = await fetch('/api/invite/generate', { method: 'POST' });
      const data = await res.json();
      if (data.url) setInviteUrl(data.url);
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    if (!inviteUrl) return;
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-xl font-bold mb-2">Zaproś do domu</h2>
      <p className="text-gray-600 mb-4 text-sm">Wygeneruj link (ważny 7 dni). Wyślij osobie, którą chcesz dodać.</p>

      <button
        onClick={generateInvite}
        disabled={loading}
        className="bg-pink-600 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50 hover:bg-pink-700"
      >
        {loading ? 'Generuję...' : 'Wygeneruj link zaproszenia'}
      </button>

      {inviteUrl && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700 break-all mb-2">{inviteUrl}</p>
          <button onClick={copy} className="text-sm text-pink-600 font-semibold">
            {copied ? '✓ Skopiowano' : 'Kopiuj link'}
          </button>
        </div>
      )}
    </section>
  );
}
