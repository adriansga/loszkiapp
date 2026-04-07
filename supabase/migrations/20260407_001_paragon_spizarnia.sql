-- Paragon Lidl 2026-04-07 → import do spiżarni
-- Pominięte (niespożywcze): folia aluminiowa, chusteczki higieniczne, chusteczki uni., płatki kosmetyczne

INSERT INTO pantry (name, quantity, unit, category, purchase_date, expiry_days) VALUES
-- WARZYWA
('Mix sałat klas. 200g',        1,    'szt', 'warzywa',    '2026-04-07', 3),
('Ogórki zielone',               2,    'szt', 'warzywa',    '2026-04-07', 4),
('Ziemniaki mączyste 2,5kg',    2,    'szt', 'warzywa',    '2026-04-07', 20),
('Jabłka Jonagold',              0.8,  'kg',  'warzywa',    '2026-04-07', 7),
('Papryka czerwona',             1,    'szt', 'warzywa',    '2026-04-07', 4),
('Bio Szczypiorek doniczkowy',   1,    'szt', 'warzywa',    '2026-04-07', 14),
('Koperek świeży',               1,    'szt', 'warzywa',    '2026-04-07', 7),
('Cebula żółta',                 1,    'kg',  'warzywa',    '2026-04-07', 30),
('Czosnek',                      1,    'szt', 'warzywa',    '2026-04-07', 30),

-- NABIAŁ
('Mleko UHT 1,5%',              1,    'szt', 'nabiał',     '2026-04-07', 60),
('Śmietana 18% 400g',           1,    'szt', 'nabiał',     '2026-04-07', 7),
('Ser Królewski',                1,    'szt', 'nabiał',     '2026-04-07', 14),

-- SUCHE / ZAPAS
('Makaron Pipe Rigate',          1,    'szt', 'suche',      '2026-04-07', 730),
('Makaron Spaghetti',            1,    'szt', 'suche',      '2026-04-07', 730),
('Makaron Penne Rigate',         1,    'szt', 'suche',      '2026-04-07', 730),
('Ryż biały 1kg',                1,    'szt', 'suche',      '2026-04-07', 730),
('Kasza jęczmienna 1kg',         1,    'szt', 'suche',      '2026-04-07', 730),
('Płatki owsiane XXL',           1,    'szt', 'suche',      '2026-04-07', 180),
('Granola',                      0.5,  'kg',  'suche',      '2026-04-07', 90),
('Płatki Lion cynamonowe',       2,    'szt', 'suche',      '2026-04-07', 180),
('Olej rzepakowy 3l',            1,    'szt', 'suche',      '2026-04-07', 180),
('Dżem truskawkowy',             1,    'szt', 'suche',      '2026-04-07', 365),
('Sos pomidorowy',               1,    'szt', 'suche',      '2026-04-07', 365),
('Winiary Majonez 400ml',        1,    'szt', 'suche',      '2026-04-07', 90),
('Nutella krem d.smarowania',    1,    'szt', 'słodycze',   '2026-04-07', 180),
('Sos czosnkowy',                1,    'szt', 'suche',      '2026-04-07', 365),
('Sos Street Food',              2,    'szt', 'suche',      '2026-04-07', 365),
('Sos Szlachetne Smaki',         2,    'szt', 'suche',      '2026-04-07', 365),
('Winiary Sos do pieczeni',      3,    'szt', 'suche',      '2026-04-07', 365),
('Knorr Sos sałatkowy',          1,    'szt', 'suche',      '2026-04-07', 365),
('Sosy sałatkowe 5pak',          2,    'szt', 'suche',      '2026-04-07', 180),
('Amino Zupa błyskawiczna',      4,    'szt', 'suche',      '2026-04-07', 365),
('Knorr Nudle',                  1,    'szt', 'suche',      '2026-04-07', 365),
('Proszek do pieczenia 4x',      1,    'szt', 'suche',      '2026-04-07', 365),
('Mąka tortowa 450g',            1,    'szt', 'suche',      '2026-04-07', 365),
('Bułka tarta 750g',             1,    'szt', 'suche',      '2026-04-07', 180),
('Chleb pszenno-żytni',          1,    'szt', 'suche',      '2026-04-07', 5),
('Chleb Bałtonowski',            2,    'szt', 'suche',      '2026-04-07', 5),

-- PRZYPRAWY
('Cynamon mielony',              1,    'szt', 'przyprawy',  '2026-04-07', 365),
('Cukier waniliowy 5pak',        1,    'op',  'przyprawy',  '2026-04-07', 365),
('Sól warzona jodowana',         1,    'szt', 'przyprawy',  '2026-04-07', 1095),
('Pieprz czarny mielony 100g',   1,    'szt', 'przyprawy',  '2026-04-07', 730),
('Papryka wędzona słodka',       1,    'szt', 'przyprawy',  '2026-04-07', 730),
('Papryka słodka mielona 100g',  2,    'szt', 'przyprawy',  '2026-04-07', 730),
('Przyprawa do mięs 75g',        1,    'szt', 'przyprawy',  '2026-04-07', 365),
('Przyprawa do kurczaka XXL',    1,    'szt', 'przyprawy',  '2026-04-07', 365),

-- NAPOJE / HERBATY
('Herbapol Syrop owocowy',       2,    'szt', 'napoje',     '2026-04-07', 180),
('Herbata zielona 40tb',         3,    'szt', 'napoje',     '2026-04-07', 365),
('Herbatka owocowa',             2,    'szt', 'napoje',     '2026-04-07', 365),
('Herbatka Rooibos',             1,    'szt', 'napoje',     '2026-04-07', 365),
('Herbatka mięta/melisa/rumianek',1,   'szt', 'napoje',     '2026-04-07', 365),
('Herbatka mięta/rumianek',      2,    'szt', 'napoje',     '2026-04-07', 365),
('Herbapol Zielnik Polski',      1,    'szt', 'napoje',     '2026-04-07', 365),
('Duo Smaki herbatka',           1,    'szt', 'napoje',     '2026-04-07', 365),
('Teekanne Herbatka',            2,    'szt', 'napoje',     '2026-04-07', 365),

-- SŁODYCZE
('Kisiel SłodkaPrzerwa',         3,    'szt', 'słodycze',   '2026-04-07', 365);
