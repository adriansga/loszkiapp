import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(process.cwd(), 'loszki.db');

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;
  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  initSchema(db);
  return db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS meals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      prep_time INTEGER,
      protein_per_serving INTEGER,
      protein_rating TEXT CHECK(protein_rating IN ('hi','md','ok','lo')),
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS weekly_plan (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      week_number INTEGER NOT NULL,
      day_of_week INTEGER NOT NULL CHECK(day_of_week BETWEEN 1 AND 7),
      meal_id INTEGER REFERENCES meals(id),
      meal_name TEXT NOT NULL,
      ingredient_chain TEXT,
      cost_estimate REAL
    );

    CREATE TABLE IF NOT EXISTS pantry (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      barcode TEXT,
      quantity REAL NOT NULL DEFAULT 0,
      unit TEXT NOT NULL DEFAULT 'szt',
      category TEXT,
      purchase_date TEXT,
      expiry_days INTEGER,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      category TEXT NOT NULL,
      amount REAL NOT NULL,
      description TEXT,
      week_number INTEGER
    );

    CREATE TABLE IF NOT EXISTS bills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      amount REAL NOT NULL,
      due_day INTEGER NOT NULL,
      category TEXT DEFAULT 'cykliczny',
      active INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS shopping_lists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      week_number INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      status TEXT DEFAULT 'active'
    );

    CREATE TABLE IF NOT EXISTS shopping_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      list_id INTEGER NOT NULL REFERENCES shopping_lists(id),
      name TEXT NOT NULL,
      quantity TEXT,
      unit TEXT,
      checked INTEGER DEFAULT 0,
      category TEXT
    );

    CREATE TABLE IF NOT EXISTS seeded (
      key TEXT PRIMARY KEY
    );
  `);

  const seeded = db.prepare('SELECT key FROM seeded WHERE key = ?').get('v1');
  if (!seeded) {
    seedData(db);
    db.prepare('INSERT INTO seeded (key) VALUES (?)').run('v1');
  }

  const seededV2 = db.prepare('SELECT key FROM seeded WHERE key = ?').get('v2');
  if (!seededV2) {
    seedSweets(db);
    db.prepare('INSERT INTO seeded (key) VALUES (?)').run('v2');
  }
}

function seedSweets(db: Database.Database) {
  const today = new Date().toISOString().split('T')[0];
  const insertPantry = db.prepare(`
    INSERT INTO pantry (name, quantity, unit, category, purchase_date, expiry_days)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const sweets = [
    ['Żelki kablowe', 2, 'szt', 'słodycze', today, 60],
    ['Żelki Frulusie', 2, 'szt', 'słodycze', today, 60],
    ['Żelki mleczne', 1, 'szt', 'słodycze', today, 60],
    ['Rurki waniliowe', 1, 'szt', 'słodycze', today, 90],
    ['Wafle', 1, 'szt', 'słodycze', today, 90],
    ['JELLY BEANS', 1, 'szt', 'słodycze', today, 60],
    ['BIG HIT orzech/czek', 1, 'szt', 'słodycze', today, 60],
  ];
  const insert = db.transaction((items: typeof sweets) => {
    for (const item of items) {
      insertPantry.run(...item);
    }
  });
  insert(sweets);
}

function seedData(db: Database.Database) {
  const insertMeal = db.prepare(`
    INSERT INTO meals (name, category, prep_time, protein_per_serving, protein_rating, notes)
    VALUES (@name, @category, @prep_time, @protein_per_serving, @protein_rating, @notes)
  `);

  const meals = [
    { name: 'Kurczak w sosie + ryż', category: 'kurczak', prep_time: 30, protein_per_serving: 93, protein_rating: 'hi', notes: 'Ugotuj 600g filetu, zostaje 400g na D+2' },
    { name: 'Makaron carbonara', category: 'makaron', prep_time: 15, protein_per_serving: 38, protein_rating: 'ok', notes: 'Boczek + jajka' },
    { name: 'Sałatka z kurczakiem', category: 'kurczak', prep_time: 10, protein_per_serving: 62, protein_rating: 'md', notes: 'Użyj ugotowanego kurczaka z poprzedniego dnia' },
    { name: 'Spaghetti bolognese', category: 'makaron', prep_time: 25, protein_per_serving: 54, protein_rating: 'md', notes: 'Mięso mielone rozmroź wieczór wcześniej' },
    { name: 'Jajko sadzone + ziemniaki + surówka', category: 'jajka', prep_time: 20, protein_per_serving: 24, protein_rating: 'lo', notes: null },
    { name: 'Kasza z kiełbasą i ogórkami', category: 'kasza', prep_time: 20, protein_per_serving: 48, protein_rating: 'ok', notes: null },
    { name: 'Naleśniki (Nutella/dżem/ser biały)', category: 'slodkie', prep_time: 20, protein_per_serving: 18, protein_rating: 'lo', notes: 'Niedziela słodka 🍬 — dodaj shake białkowy' },
    { name: 'Udka z kurczaka z piekarnika + surówka', category: 'kurczak', prep_time: 50, protein_per_serving: 108, protein_rating: 'hi', notes: 'Piecz wszystkie naraz, reszta na kebab D+2' },
    { name: 'Makaron z pieczarkami w śmietanie', category: 'makaron', prep_time: 20, protein_per_serving: 22, protein_rating: 'lo', notes: 'Dodaj shake białkowy' },
    { name: 'Kebab domowy', category: 'kurczak', prep_time: 10, protein_per_serving: 72, protein_rating: 'md', notes: 'Mięso z udek pieczonych' },
    { name: 'Karkówka z patelni z cebulą + kasza', category: 'wieprzowina', prep_time: 25, protein_per_serving: 66, protein_rating: 'md', notes: 'Użyj 400g, zostaje na tortille D+1' },
    { name: 'Tortille z karkówką', category: 'wieprzowina', prep_time: 10, protein_per_serving: 44, protein_rating: 'ok', notes: 'Resztki karkówki' },
    { name: 'Szakszuka', category: 'jajka', prep_time: 15, protein_per_serving: 28, protein_rating: 'lo', notes: 'Jajka + passata + cebula' },
    { name: 'Racuchy / Gofry', category: 'slodkie', prep_time: 20, protein_per_serving: 20, protein_rating: 'lo', notes: 'Niedziela słodka 🍬 — dodaj białko waniliowe do ciasta' },
    { name: 'Kurczak kotlet + ziemniaki + sałatka', category: 'kurczak', prep_time: 30, protein_per_serving: 93, protein_rating: 'hi', notes: '500g filetu, zostaje na gyros D+2' },
    { name: 'Smażony ryż z jajkiem i warzywami', category: 'jajka', prep_time: 15, protein_per_serving: 32, protein_rating: 'ok', notes: 'Ryż ugotowany poprzedniego dnia' },
    { name: 'Gyros domowy z piekarnika', category: 'kurczak', prep_time: 45, protein_per_serving: 78, protein_rating: 'md', notes: 'Reszta kurczaka + tortille' },
    { name: 'Domowe burgerki', category: 'wieprzowina', prep_time: 20, protein_per_serving: 54, protein_rating: 'md', notes: 'Mięso mielone rozmrożone' },
    { name: 'Jajko na twardo w sosie koperkowym + ziemniaki', category: 'jajka', prep_time: 20, protein_per_serving: 24, protein_rating: 'lo', notes: null },
    { name: 'Makaron penne arrabiata', category: 'makaron', prep_time: 20, protein_per_serving: 18, protein_rating: 'lo', notes: 'Passata + czosnek + chili — dodaj shake' },
    { name: 'Omlety / pancakes białkowe', category: 'slodkie', prep_time: 15, protein_per_serving: 38, protein_rating: 'ok', notes: 'Niedziela słodka 🍬 — białkowe!' },
    { name: 'Świinka duszona + kasza gryczana', category: 'wieprzowina', prep_time: 90, protein_per_serving: 66, protein_rating: 'md', notes: '90 min pasywnie — duży garnek, dusi się sama' },
    { name: 'Kurczak w papryce (paprykarz) + ryż', category: 'kurczak', prep_time: 30, protein_per_serving: 78, protein_rating: 'md', notes: 'Zostaje na curry D+2' },
    { name: 'Tortille ze świinką', category: 'wieprzowina', prep_time: 10, protein_per_serving: 44, protein_rating: 'ok', notes: 'Resztki świinki duszonej' },
    { name: 'Curry z kurczakiem i ryżem', category: 'kurczak', prep_time: 30, protein_per_serving: 78, protein_rating: 'md', notes: 'Reszta kurczaka z paprykarz D-2' },
    { name: 'Zupa pomidorowa z makaronem', category: 'makaron', prep_time: 20, protein_per_serving: 18, protein_rating: 'lo', notes: 'Passata + bulion — dodaj shake' },
    { name: 'Kotlet schabowy (mielony) + ziemniaki + surówka', category: 'wieprzowina', prep_time: 25, protein_per_serving: 54, protein_rating: 'md', notes: null },
    { name: 'Placki ziemniaczane + śmietana', category: 'ziemniaki', prep_time: 25, protein_per_serving: 14, protein_rating: 'lo', notes: 'Resztki ziemniaków — koniecznie shake!' },
    { name: 'Pizza na tortilli', category: 'szybkie', prep_time: 10, protein_per_serving: 28, protein_rating: 'lo', notes: 'Tortille + passata + ser + co masz' },
    { name: 'Ryż z jabłkami i cynamonem', category: 'slodkie', prep_time: 20, protein_per_serving: 14, protein_rating: 'lo', notes: 'Niedziela słodka 🍬 — dodaj białko' },
    { name: 'Bitki wieprzowe w sosie + ziemniaki', category: 'wieprzowina', prep_time: 40, protein_per_serving: 66, protein_rating: 'md', notes: null },
    { name: 'Kurczak teriyaki + ryż', category: 'kurczak', prep_time: 25, protein_per_serving: 78, protein_rating: 'md', notes: 'Sos teriyaki: soja + miód + czosnek' },
    { name: 'Kopytka z masłem i serem', category: 'ziemniaki', prep_time: 30, protein_per_serving: 16, protein_rating: 'lo', notes: 'Dodaj shake' },
    { name: 'Kasza z sosem grzybowym', category: 'kasza', prep_time: 25, protein_per_serving: 18, protein_rating: 'lo', notes: 'Suszone grzyby + śmietana — dodaj shake' },
  ];

  const insertMany = db.transaction((meals: typeof meals) => {
    for (const meal of meals) {
      insertMeal.run(meal);
    }
  });
  insertMany(meals);

  const insertBill = db.prepare(`
    INSERT INTO bills (name, amount, due_day, category)
    VALUES (@name, @amount, @due_day, @category)
  `);

  const bills = [
    { name: 'Czynsz + opłaty', amount: 1500, due_day: 10, category: 'mieszkanie' },
    { name: 'Prąd', amount: 80, due_day: 15, category: 'media' },
    { name: 'Internet', amount: 50, due_day: 20, category: 'media' },
    { name: 'Telefon (Adrian)', amount: 35, due_day: 5, category: 'telefon' },
    { name: 'Telefon (Kasia)', amount: 35, due_day: 5, category: 'telefon' },
  ];

  for (const bill of bills) {
    insertBill.run(bill);
  }
}
