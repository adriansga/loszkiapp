# CLAUDE.md — Loszki App

> Instrukcja dla AI. Czytaj przed jakąkolwiek pracą z tym projektem.

---

## CO TO JEST

**Loszki App** — webowa aplikacja domowa dla Adriana i Kasi. Zarządza obiadami, zakupami, spiżarnią, budżetem i posiada AI agenta znającego cały kontekst domu.

Stack: **Next.js 16** (App Router) + **better-sqlite3** (lokalna baza SQLite) + **Tailwind CSS v4** + **Anthropic SDK** (agent AI)

---

## JAK URUCHOMIĆ

### Pierwsze uruchomienie (lub gdy brak node_modules/.bin):
```
1. Otwórz terminal w: G:\Mój dysk\.AI\PROJEKTY\AKTYWNE\MIESZKANKO LOSZKI\loszki-app\
2. Uruchom: npm install
3. Uruchom: npm run dev
4. Otwórz: http://localhost:3000
```

Lub kliknij dwukrotnie `START.bat` w folderze loszki-app.

### Agent AI wymaga klucza:
Otwórz `.env.local` i uzupełnij:
```
ANTHROPIC_API_KEY=sk-ant-...
```
Klucz pobierz z: https://console.anthropic.com/

### Problem z node_modules:
Jeśli brakuje `node_modules/.bin` — Windows junction symlinks mogą być niewidoczne przez bash.
Użyj PowerShell: `Set-Location 'ścieżka'; npm install`

---

## STRUKTURA PROJEKTU

```
loszki-app/
├── app/                    — Next.js App Router
│   ├── page.tsx            — Dashboard (/)
│   ├── layout.tsx          — Layout z nawigacją
│   ├── obiady/page.tsx     — Plan obiadów (/obiady)
│   ├── zakupy/             — Lista zakupów (/zakupy)
│   │   ├── page.tsx
│   │   ├── ShoppingListClient.tsx
│   │   └── actions.ts
│   ├── spizarnia/          — Stan spiżarni (/spizarnia)
│   │   ├── page.tsx
│   │   ├── PantryClient.tsx
│   │   └── actions.ts
│   ├── budzet/             — Budżet i rachunki (/budzet)
│   │   ├── page.tsx
│   │   ├── BudzetClient.tsx
│   │   └── actions.ts
│   └── agent/              — AI Agent (/agent)
│       ├── page.tsx
│       ├── AgentClient.tsx
│       └── actions.ts
├── lib/
│   └── db.ts               — SQLite singleton + schema + seed data
├── .env.local              — ANTHROPIC_API_KEY (uzupełnij!)
├── next.config.ts          — serverExternalPackages: ['better-sqlite3']
├── loszki.db               — Baza danych (tworzy się automatycznie przy pierwszym starcie)
└── START.bat               — Skrypt startowy dla Windows
```

---

## BAZA DANYCH (SQLite)

Plik: `loszki.db` w katalogu projektu. Tworzy się automatycznie przy pierwszym `npm run dev`.

### Tabele:

| Tabela | Opis |
|--------|------|
| `meals` | Baza 34 dań: name, category, prep_time, protein_per_serving, protein_rating (hi/md/ok/lo), notes |
| `weekly_plan` | Plan tygodniowy: week_number, day_of_week (1=Pon, 7=Nd), meal_id, meal_name |
| `pantry` | Spiżarnia: name, quantity, unit, category, purchase_date, expiry_days |
| `expenses` | Wydatki: date, category, amount, description, week_number |
| `bills` | Rachunki cykliczne: name, amount, due_day, category, active |
| `shopping_lists` | Listy zakupów: week_number, created_at, status |
| `shopping_items` | Pozycje na liście: list_id, name, quantity, unit, checked, category |
| `seeded` | Flaga seed (klucz 'v1') — zapobiega podwójnemu seedowaniu |

### Dane startowe (seed):
- **34 dania** z bazy Adriana (kurczak, wieprzowina, makaron, jajka, kasza, ziemniaki, słodkie, szybkie)
- **5 rachunków**: Czynsz 1500zł/10., Prąd 80zł/15., Internet 50zł/20., Telefon Adrian 35zł/5., Telefon Kasia 35zł/5.
- `weekly_plan` i `pantry` — puste, użytkownik wypełnia przez aplikację

---

## MODUŁY APLIKACJI

### Dashboard (`/`)
- Dzisiejszy obiad z protein rating i czasem przygotowania
- Podgląd całego tygodnia (7 dni)
- Alerty: rachunki w ciągu 7 dni + produkty bliskie przeterminowania (expiry_days - 2)
- Szybkie linki do zakupów, spiżarni, budżetu, agenta

### Obiady (`/obiady`)
- **Widok "Tydzień"**: plan tygodniowy z nawigacją przez tygodnie, color-coded po protein_rating
- **Widok "Wszystkie dania"**: 34 dań pogrupowanych kategoriami
- Przycisk "Generuj listę zakupów na ten tydzień" → redirect do `/zakupy?week=N`

### Zakupy (`/zakupy`) — Server + Client
- Generator listy zakupów na wybrany tydzień (na podstawie meal_name w weekly_plan)
- Checkboxy do odznaczania pozycji w sklepie (mobile-friendly)
- Dodawanie własnych pozycji do listy
- Server Actions: generateShoppingList, toggleItem, addCustomItem, deleteList

### Spiżarnia (`/spizarnia`) — Server + Client
- Dodawanie produktów z kategorią, datą zakupu, terminem przydatności
- Automatyczne suggestie expiry_days na podstawie nazwy produktu (np. kurczak: 2 dni)
- Ostrzeżenia o produktach bliskich wygaśnięcia
- Server Actions: addPantryItem, deletePantryItem, updatePantryQuantity

### Budżet (`/budzet`) — Server + Client
- Lista rachunków cyklicznych z odliczaniem dni do terminu
- Tracker wydatków bieżącego miesiąca (kategorie: jedzenie, transport, rozrywka, inne)
- Budżet na jedzenie: 220 zł/miesiąc (hardcoded w BudzetClient.tsx)
- Server Actions: addExpense, deleteExpense

### Agent AI (`/agent`)
- Chat z Claude (model: claude-sonnet-4-6)
- System prompt ładuje aktualny kontekst z bazy: plan tygodniowy, spiżarnia, rachunki, wydatki miesięczne
- Profil hardcoded w context: Adrian cel 150-160g białka/dzień, Kasia 75-100g/dzień, zakupy soboty, budżet 220zł
- Szybkie pytania: "Co mam dziś ugotować?", "Co kupić w sobotę?"
- Bez klucza API — zwraca info o konieczności ustawienia ANTHROPIC_API_KEY

---

## ARCHITEKTURA (WZORZEC)

Każdy moduł (zakupy, spiżarnia, budżet) używa wzorca:
- `page.tsx` — Server Component, pobiera dane z SQLite, przekazuje do Client Component
- `[Nazwa]Client.tsx` — Client Component (`'use client'`), obsługuje UI i stan
- `actions.ts` — Server Actions (`'use server'`), mutacje bazy przez better-sqlite3

Agent (`/agent`) jest wyjątkiem: `page.tsx` + `AgentClient.tsx` (client) + `actions.ts` (server, wywołuje Anthropic API).

Obiady (`/obiady`) — czysto Server Component, bez Client Component (brak mutacji).

---

## PROFIL UŻYTKOWNIKÓW

- **Adrian**: cel białkowy 150-160g/dzień, shake białkowy ~47g/dzień
- **Kasia**: cel białkowy 75-100g/dzień
- Zakupy: soboty
- Budżet na jedzenie: ~220 zł/miesiąc
- Lokalizacja: Nowy Sącz

---

## TYPOWE ZADANIA DLA AI

**Dodać danie do bazy:**
→ Edytuj `lib/db.ts` w funkcji `seedData()` lub SQL: `INSERT INTO meals ...`

**Dodać plan tygodniowy:**
→ SQL: `INSERT INTO weekly_plan (week_number, day_of_week, meal_id, meal_name) VALUES (?, ?, ?, ?)`

**Zmienić budżet na jedzenie:**
→ `app/budzet/BudzetClient.tsx` linia z `const FOOD_BUDGET = 220`

**Zmienić profil agenta:**
→ `app/agent/actions.ts` — sekcja `PROFIL:` w funkcji `getContext()`

**Dodać rachunek:**
→ SQL lub przez edycję seed w `lib/db.ts`

---

## ZNANE PROBLEMY

1. **node_modules/.bin niewidoczny przez bash** — Windows junction symlinks. Używaj PowerShell lub CMD.
2. **Brak planu tygodniowego** — weekly_plan jest pusta po instalacji. Trzeba dodać plan przez SQL lub dodać UI do dodawania planu.
3. **Zakupy generowane z meal_name** — brak składników per danie. Generator zakupów jest uproszczony (wypisuje nazwy dań, nie składniki).
