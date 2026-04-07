// Import paragonu Lidl 2026-04-07 do spiżarni
const url = 'https://qlqnrsxpmoeoukfgovmy.supabase.co/rest/v1/pantry';
const key = 'sb_publishable_H4esPhmhBIIUJSb78_JLOw_kE1VOmty';

const items = [
  // WARZYWA
  { name: 'Mix sałat klas. 200g',        quantity: 1,   unit: 'szt', category: 'warzywa',    purchase_date: '2026-04-07', expiry_days: 3 },
  { name: 'Ogórki zielone',              quantity: 2,   unit: 'szt', category: 'warzywa',    purchase_date: '2026-04-07', expiry_days: 4 },
  { name: 'Ziemniaki mączyste 2,5kg',   quantity: 2,   unit: 'szt', category: 'warzywa',    purchase_date: '2026-04-07', expiry_days: 20 },
  { name: 'Jabłka Jonagold',             quantity: 0.8, unit: 'kg',  category: 'warzywa',    purchase_date: '2026-04-07', expiry_days: 7 },
  { name: 'Papryka czerwona',            quantity: 1,   unit: 'szt', category: 'warzywa',    purchase_date: '2026-04-07', expiry_days: 4 },
  { name: 'Bio Szczypiorek doniczkowy',  quantity: 1,   unit: 'szt', category: 'warzywa',    purchase_date: '2026-04-07', expiry_days: 14 },
  { name: 'Koperek swiezy',              quantity: 1,   unit: 'szt', category: 'warzywa',    purchase_date: '2026-04-07', expiry_days: 7 },
  { name: 'Cebula zolta',                quantity: 1,   unit: 'kg',  category: 'warzywa',    purchase_date: '2026-04-07', expiry_days: 30 },
  { name: 'Czosnek',                     quantity: 1,   unit: 'szt', category: 'warzywa',    purchase_date: '2026-04-07', expiry_days: 30 },
  // NABIAL
  { name: 'Mleko UHT 1,5%',             quantity: 1,   unit: 'szt', category: 'nabial',     purchase_date: '2026-04-07', expiry_days: 60 },
  { name: 'Smietana 18% 400g',           quantity: 1,   unit: 'szt', category: 'nabial',     purchase_date: '2026-04-07', expiry_days: 7 },
  { name: 'Ser Krolewski',               quantity: 1,   unit: 'szt', category: 'nabial',     purchase_date: '2026-04-07', expiry_days: 14 },
  // SUCHE
  { name: 'Makaron Pipe Rigate',         quantity: 1,   unit: 'szt', category: 'suche',      purchase_date: '2026-04-07', expiry_days: 730 },
  { name: 'Makaron Spaghetti',           quantity: 1,   unit: 'szt', category: 'suche',      purchase_date: '2026-04-07', expiry_days: 730 },
  { name: 'Makaron Penne Rigate',        quantity: 1,   unit: 'szt', category: 'suche',      purchase_date: '2026-04-07', expiry_days: 730 },
  { name: 'Ryz bialy 1kg',               quantity: 1,   unit: 'szt', category: 'suche',      purchase_date: '2026-04-07', expiry_days: 730 },
  { name: 'Kasza jeczmienma 1kg',        quantity: 1,   unit: 'szt', category: 'suche',      purchase_date: '2026-04-07', expiry_days: 730 },
  { name: 'Platki owsiane XXL',          quantity: 1,   unit: 'szt', category: 'suche',      purchase_date: '2026-04-07', expiry_days: 180 },
  { name: 'Granola',                     quantity: 0.5, unit: 'kg',  category: 'suche',      purchase_date: '2026-04-07', expiry_days: 90 },
  { name: 'Platki Lion cynamonowe',      quantity: 2,   unit: 'szt', category: 'suche',      purchase_date: '2026-04-07', expiry_days: 180 },
  { name: 'Olej rzepakowy 3l',           quantity: 1,   unit: 'szt', category: 'suche',      purchase_date: '2026-04-07', expiry_days: 180 },
  { name: 'Dzem truskawkowy',            quantity: 1,   unit: 'szt', category: 'suche',      purchase_date: '2026-04-07', expiry_days: 365 },
  { name: 'Sos pomidorowy',              quantity: 1,   unit: 'szt', category: 'suche',      purchase_date: '2026-04-07', expiry_days: 365 },
  { name: 'Winiary Majonez 400ml',       quantity: 1,   unit: 'szt', category: 'suche',      purchase_date: '2026-04-07', expiry_days: 90 },
  { name: 'Nutella krem',                quantity: 1,   unit: 'szt', category: 'slodycze',   purchase_date: '2026-04-07', expiry_days: 180 },
  { name: 'Sos czosnkowy',               quantity: 1,   unit: 'szt', category: 'suche',      purchase_date: '2026-04-07', expiry_days: 365 },
  { name: 'Sos Street Food',             quantity: 2,   unit: 'szt', category: 'suche',      purchase_date: '2026-04-07', expiry_days: 365 },
  { name: 'Sos Szlachetne Smaki',        quantity: 2,   unit: 'szt', category: 'suche',      purchase_date: '2026-04-07', expiry_days: 365 },
  { name: 'Winiary Sos do pieczeni',     quantity: 3,   unit: 'szt', category: 'suche',      purchase_date: '2026-04-07', expiry_days: 365 },
  { name: 'Knorr Sos sałatkowy',         quantity: 1,   unit: 'szt', category: 'suche',      purchase_date: '2026-04-07', expiry_days: 365 },
  { name: 'Sosy salatowe 5pak',          quantity: 2,   unit: 'szt', category: 'suche',      purchase_date: '2026-04-07', expiry_days: 180 },
  { name: 'Amino Zupa blyskawiczna',     quantity: 4,   unit: 'szt', category: 'suche',      purchase_date: '2026-04-07', expiry_days: 365 },
  { name: 'Knorr Nudle',                 quantity: 1,   unit: 'szt', category: 'suche',      purchase_date: '2026-04-07', expiry_days: 365 },
  { name: 'Proszek do pieczenia 4x',     quantity: 1,   unit: 'szt', category: 'suche',      purchase_date: '2026-04-07', expiry_days: 365 },
  { name: 'Maka tortowa 450g',           quantity: 1,   unit: 'szt', category: 'suche',      purchase_date: '2026-04-07', expiry_days: 365 },
  { name: 'Bulka tarta 750g',            quantity: 1,   unit: 'szt', category: 'suche',      purchase_date: '2026-04-07', expiry_days: 180 },
  { name: 'Chleb pszenno-zytni',         quantity: 1,   unit: 'szt', category: 'suche',      purchase_date: '2026-04-07', expiry_days: 5 },
  { name: 'Chleb Baltonowski',           quantity: 2,   unit: 'szt', category: 'suche',      purchase_date: '2026-04-07', expiry_days: 5 },
  // PRZYPRAWY
  { name: 'Cynamon mielony',             quantity: 1,   unit: 'szt', category: 'przyprawy',  purchase_date: '2026-04-07', expiry_days: 365 },
  { name: 'Cukier wanilinowy 5pak',      quantity: 1,   unit: 'op',  category: 'przyprawy',  purchase_date: '2026-04-07', expiry_days: 365 },
  { name: 'Sol warzona jodowana',        quantity: 1,   unit: 'szt', category: 'przyprawy',  purchase_date: '2026-04-07', expiry_days: 1095 },
  { name: 'Pieprz czarny mielony 100g',  quantity: 1,   unit: 'szt', category: 'przyprawy',  purchase_date: '2026-04-07', expiry_days: 730 },
  { name: 'Papryka wedzona slodka',      quantity: 1,   unit: 'szt', category: 'przyprawy',  purchase_date: '2026-04-07', expiry_days: 730 },
  { name: 'Papryka slodka mielona 100g', quantity: 2,   unit: 'szt', category: 'przyprawy',  purchase_date: '2026-04-07', expiry_days: 730 },
  { name: 'Przyprawa do mies 75g',       quantity: 1,   unit: 'szt', category: 'przyprawy',  purchase_date: '2026-04-07', expiry_days: 365 },
  { name: 'Przyprawa do kurczaka XXL',   quantity: 1,   unit: 'szt', category: 'przyprawy',  purchase_date: '2026-04-07', expiry_days: 365 },
  // NAPOJE / HERBATY
  { name: 'Herbapol Syrop owocowy',      quantity: 2,   unit: 'szt', category: 'napoje',     purchase_date: '2026-04-07', expiry_days: 180 },
  { name: 'Herbata zielona 40tb',        quantity: 3,   unit: 'szt', category: 'napoje',     purchase_date: '2026-04-07', expiry_days: 365 },
  { name: 'Herbatka owocowa',            quantity: 2,   unit: 'szt', category: 'napoje',     purchase_date: '2026-04-07', expiry_days: 365 },
  { name: 'Herbatka Rooibos',            quantity: 1,   unit: 'szt', category: 'napoje',     purchase_date: '2026-04-07', expiry_days: 365 },
  { name: 'Herbatka mieta/melisa/rumianek', quantity: 1, unit: 'szt', category: 'napoje',    purchase_date: '2026-04-07', expiry_days: 365 },
  { name: 'Herbatka mieta/rumianek',     quantity: 2,   unit: 'szt', category: 'napoje',     purchase_date: '2026-04-07', expiry_days: 365 },
  { name: 'Herbapol Zielnik Polski',     quantity: 1,   unit: 'szt', category: 'napoje',     purchase_date: '2026-04-07', expiry_days: 365 },
  { name: 'Duo Smaki herbatka',          quantity: 1,   unit: 'szt', category: 'napoje',     purchase_date: '2026-04-07', expiry_days: 365 },
  { name: 'Teekanne Herbatka',           quantity: 2,   unit: 'szt', category: 'napoje',     purchase_date: '2026-04-07', expiry_days: 365 },
  // SLODYCZE
  { name: 'Kisiel SlodkaPrzerwa',        quantity: 3,   unit: 'szt', category: 'slodycze',   purchase_date: '2026-04-07', expiry_days: 365 },
];

const res = await fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': key,
    'Authorization': 'Bearer ' + key,
    'Prefer': 'return=minimal'
  },
  body: JSON.stringify(items)
});

console.log('Status:', res.status);
const text = await res.text();
console.log('Response:', text || '(pusty — OK)');
