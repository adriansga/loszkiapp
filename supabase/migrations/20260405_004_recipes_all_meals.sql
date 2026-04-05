-- Przepnij weekly_plan tydzień 16 na oryginalne IDs (1–55) zamiast duplikatów (56–62)
UPDATE weekly_plan SET meal_id = 8  WHERE week_number = 16 AND day_of_week = 1; -- Udka z kurczaka
UPDATE weekly_plan SET meal_id = 38 WHERE week_number = 16 AND day_of_week = 2; -- Makaron pesto
UPDATE weekly_plan SET meal_id = 10 WHERE week_number = 16 AND day_of_week = 3; -- Kebab domowy
UPDATE weekly_plan SET meal_id = 44 WHERE week_number = 16 AND day_of_week = 4; -- Burrito bowl
UPDATE weekly_plan SET meal_id = 6  WHERE week_number = 16 AND day_of_week = 5; -- Kasza z kiełbasą
UPDATE weekly_plan SET meal_id = 36 WHERE week_number = 16 AND day_of_week = 6; -- Kasza z jajkiem
UPDATE weekly_plan SET meal_id = 30 WHERE week_number = 16 AND day_of_week = 7; -- Ryż z jabłkami

-- Usuń duplikaty (ID 56+) stworzone przez wielokrotne uruchomienie migracji 003
DELETE FROM meals WHERE id >= 56;

-- Dodaj przepisy i składniki do wszystkich oryginalnych dań (ID 1–55)

UPDATE meals SET
  recipe = '1. Pierś kurczaka pokrój w kostkę, obsmaż na oleju 5 min.
2. Dodaj cebulę i czosnek, smaż 2 min.
3. Wlej passatę, dodaj paprykę, sól, pieprz, gotuj 15 min na małym ogniu.
4. Ugotuj ryż wg przepisu (1:2 z wodą, 15 min). Podaj razem.',
  ingredients = '500g pierś kurczaka, 300g ryż, 1 puszka passaty pomidorowej (400g), 1 cebula, 3 ząbki czosnku, papryka słodka mielona, sól, pieprz, olej'
WHERE id = 1; -- Kurczak w sosie + ryż

UPDATE meals SET
  recipe = '1. Ugotuj spaghetti al dente. Zostaw szklankę wody z gotowania.
2. Boczek/pancetta pokrój w kostkę, podsmaż na suchej patelni na złoto.
3. W misce wymieszaj żółtka z tartym parmezanem i pieprzem.
4. Odcedź makaron, dodaj do patelni z boczkiem (bez ognia!).
5. Wlej mieszankę jajeczną, dodaj wodę z gotowania łyżka po łyżce — mieszaj do kremowej konsystencji.',
  ingredients = '400g spaghetti, 150g boczek wędzony lub pancetta, 4 żółtka, 80g parmezan tarty, sól, dużo czarnego pieprzu'
WHERE id = 2; -- Makaron carbonara

UPDATE meals SET
  recipe = '1. Pierś kurczaka ugotuj lub usmaż na patelni, ostudź i pokrój w paski.
2. Sałatę porwij, pomidory pokrój w ćwiartki, ogórek w plastry.
3. Sos: oliwa + ocet + musztarda + sól + pieprz — wymieszaj.
4. Wszystko połącz na talerzu, posyp serem feta lub parmezanem.',
  ingredients = '400g pierś kurczaka, 1 sałata lodowa, 2 pomidory, 1 ogórek, 100g ser feta lub parmezan, oliwa z oliwek, ocet winny, łyżeczka musztardy, sól, pieprz'
WHERE id = 3; -- Sałatka z kurczakiem

UPDATE meals SET
  recipe = '1. Cebulę i czosnek zeszklij na oleju 3 min.
2. Dodaj mięso mielone, smaż mieszając aż zmieni kolor (ok. 8 min).
3. Wlej passatę, dodaj oregano, sól, pieprz — gotuj 20 min.
4. Ugotuj spaghetti al dente. Podaj z sosem i tartym parmezanem.',
  ingredients = '400g spaghetti, 500g mięso mielone wołowo-wieprzowe, 1 puszka passaty (400g), 1 cebula, 3 ząbki czosnku, oregano, sól, pieprz, parmezan, olej'
WHERE id = 4; -- Spaghetti bolognese

UPDATE meals SET
  recipe = '1. Ziemniaki obierz, ugotuj w osolonej wodzie ok. 20 min.
2. Jajka usmaż na maśle — sadzone z lekko ściętym białkiem.
3. Surówka: zetrzyj marchew na tarce, dodaj oliwę, sól, cukier, ocet.
4. Podaj na jednym talerzu: ziemniaki, jajka, surówka.',
  ingredients = '4 ziemniaki, 3 jajka, 2 marchew, masło, oliwa z oliwek, ocet, szczypta cukru, sól, pieprz'
WHERE id = 5; -- Jajko sadzone + ziemniaki + surówka

UPDATE meals SET
  recipe = '1. Ugotuj kaszę gryczaną (1:2 z wodą, ok. 15 min).
2. Kiełbasę pokrój w plasterki, podsmaż na patelni bez tłuszczu do zrumienienia.
3. Ogórki kiszone pokrój w kostkę.
4. Wymieszaj kaszę z kiełbasą i ogórkami, dopraw pieprzem.',
  ingredients = '300g kasza gryczana, 400g kiełbasa śląska lub zwyczajna, 4 ogórki kiszone, pieprz, sól'
WHERE id = 6; -- Kasza z kiełbasą i ogórkami

UPDATE meals SET
  recipe = '1. Wymieszaj mąkę, jajka, mleko, szczyptę soli na gładkie ciasto (konsystencja śmietany). Odstaw 15 min.
2. Smaż na rozgrzanej patelni z odrobiną masła — cienkie naleśniki.
3. Podawaj z wybranym nadzieniem: Nutella, dżem truskawkowy lub ser biały z cukrem.',
  ingredients = '250g mąka pszenna, 2 jajka, 400ml mleko, szczypta soli, masło do smażenia, Nutella lub dżem lub ser biały + cukier'
WHERE id = 7; -- Naleśniki (Nutella/dżem/ser biały)

UPDATE meals SET
  recipe = '1. Udka natrzyj solą, pieprzem, czosnkiem, papryką słodką i oliwą. Odstaw 30 min.
2. Piecz w 200°C przez 45 min, aż skórka się zarumieni.
3. Surówka: poszatkuj kapustę, zetrzyj marchew, dodaj sól, cukier, ocet, oliwę. Wymieszaj.',
  ingredients = '4 udka kurczaka, 1/2 główki kapusty białej, 2 marchew, 3 ząbki czosnku, papryka słodka mielona, sól, pieprz, oliwa z oliwek, ocet, szczypta cukru'
WHERE id = 8; -- Udka z kurczaka z piekarnika + surówka

UPDATE meals SET
  recipe = '1. Pieczarki pokrój w plastry, zeszklij na maśle z czosnkiem 5 min.
2. Wlej śmietanę 18%, dopraw solą, pieprzem, szczyptą gałki muszkatołowej. Gotuj 5 min.
3. Ugotuj makaron al dente. Wymieszaj z sosem.
4. Posyp natką pietruszki.',
  ingredients = '400g makaron (penne lub tagliatelle), 500g pieczarki, 200ml śmietana 18%, 2 ząbki czosnku, masło, gałka muszkatołowa, natka pietruszki, sól, pieprz'
WHERE id = 9; -- Makaron z pieczarkami w śmietanie

UPDATE meals SET
  recipe = '1. Pierś kurczaka pokrój w paski, zamarynuj w przyprawach kebab, soli i jogurcie 15 min.
2. Usmaż na patelni na oleju 8–10 min.
3. Sos: wymieszaj jogurt, czosnek, koperek, sól.
4. Złóż kebab w tortilli z warzywami i sosem.',
  ingredients = '500g pierś kurczaka, 4 tortille, 1 cebula, 1 pomidor, 1 ogórek, 1 sałata lodowa, przyprawa kebab, 200g jogurt naturalny, 2 ząbki czosnku, koperek, sól, olej'
WHERE id = 10; -- Kebab domowy

UPDATE meals SET
  recipe = '1. Karkówkę pokrój w plastry (1 cm), rozbij lekko i obsmaż na oleju z obu stron 3 min.
2. Cebulę pokrój w piórka, zeszklij na tym samym oleju.
3. Dodaj karkówkę z powrotem, wlej trochę wody lub bulionu, duś pod przykryciem 15 min.
4. Ugotuj kaszę gryczaną (1:2 z wodą). Podaj razem.',
  ingredients = '600g karkówka wieprzowa, 300g kasza gryczana, 2 cebule, sól, pieprz, majeranek, olej'
WHERE id = 11; -- Karkówka z patelni z cebulą + kasza

UPDATE meals SET
  recipe = '1. Karkówkę z poprzedniego dnia lub świeżą usmaż/podgrzej, pokrój w paski.
2. Warzywa pokrój w paski lub plastry.
3. Sos: wymieszaj jogurt z czosnkiem, koperkiem, solą.
4. Ułóż w tortilli: karkówkę, warzywa, sos. Zawiń.',
  ingredients = '400g karkówka wieprzowa, 4 tortille, 1 cebula, 1 pomidor, 1 ogórek, 1 sałata, 200g jogurt naturalny, 2 ząbki czosnku, koperek, sól, olej'
WHERE id = 12; -- Tortille z karkówką

UPDATE meals SET
  recipe = '1. Na dużej patelni rozgrzej oliwę, dodaj pokrojoną cebulę i papryki w kostkę — smaż 5 min.
2. Dodaj czosnek i passatę, dopraw kumin, paprykę ostrą, sól. Gotuj 5 min.
3. Zrób łyżką 3–4 zagłębienia w sosie, wbij jajka.
4. Przykryj pokrywką, gotuj 5–7 min aż białka się zetną.',
  ingredients = '4 jajka, 2 papryki (czerwona + żółta), 1 cebula, 400g passata pomidorowa, 2 ząbki czosnku, kumin, papryka ostra, sól, pieprz, oliwa'
WHERE id = 13; -- Szakszuka

UPDATE meals SET
  recipe = '1. Wymieszaj mąkę, jajka, mleko, szczyptę soli na ciasto naleśnikowe. Odstaw 10 min.
2. Smaż na patelni racuchy (grubsze placuszki) lub w gofrownicę wlej ciasto.
3. Podawaj z dżemem, śmietaną lub cukrem pudrem.',
  ingredients = '300g mąka pszenna, 2 jajka, 300ml mleko, szczypta soli, 1 łyżeczka proszku do pieczenia, masło, dżem lub śmietana lub cukier puder'
WHERE id = 14; -- Racuchy / Gofry

UPDATE meals SET
  recipe = '1. Pierś kurczaka rozbij tłuczkiem na kotlety, panieruj: mąka → jajko → bułka tarta.
2. Smaż na oleju z obu stron po 4–5 min na złoty kolor.
3. Ziemniaki ugotuj w osolonej wodzie.
4. Surówka z kapusty: poszatkuj, dodaj sól, cukier, ocet, oliwę.',
  ingredients = '600g pierś kurczaka, 4 ziemniaki, 1/4 kapusty białej, 2 jajka, bułka tarta, mąka pszenna, sól, pieprz, olej, ocet, szczypta cukru'
WHERE id = 15; -- Kurczak kotlet + ziemniaki + sałatka

UPDATE meals SET
  recipe = '1. Ugotuj ryż (1:2 z wodą, 15 min), ostudź.
2. Na rozgrzanym oleju podsmaż cebulę i marchew 3 min.
3. Dodaj ryż, smaż mieszając 3 min.
4. Zepchnij ryż na bok, wbij jajka i szybko mieszaj.
5. Połącz z ryżem, dodaj sos sojowy, groszek i kukurydzę. Dopraw.',
  ingredients = '300g ryż, 3 jajka, 1 cebula, 1 marchew, 100g mrożony groszek, 1 puszka kukurydzy, 3 łyżki sos sojowy, olej, sól, pieprz'
WHERE id = 16; -- Smażony ryż z jajkiem i warzywami

UPDATE meals SET
  recipe = '1. Pierś kurczaka pokrój w paski, zamarynuj w oliwie, czosnku, oregano, papryce, soli — 20 min.
2. Piecz w 200°C przez 25 min lub usmaż na patelni grillowej.
3. Podaj w tortilli lub na talerzu z sałatą, pomidorem, sosem czosnkowym.
4. Sos: jogurt + czosnek + sól.',
  ingredients = '600g pierś kurczaka, 4 tortille lub bułki, 1 sałata, 2 pomidory, 1 ogórek, 200g jogurt, 3 ząbki czosnku, oregano, papryka słodka, oliwa, sól'
WHERE id = 17; -- Gyros domowy z piekarnika

UPDATE meals SET
  recipe = '1. Mięso mielone wymieszaj z solą, pieprzem, czosnkiem, cebulą. Uformuj 4 burgery.
2. Smaż na patelni grillowej 4 min z każdej strony. W ostatniej minucie połóż ser.
3. Bułki przekrój i podsmaż lekko na patelni.
4. Złóż burgery: bułka → sałata → burger z serem → pomidor → cebula → sos.',
  ingredients = '600g mięso mielone wołowe lub mieszane, 4 bułki hamburgerowe, 4 plastry ser żółty, 1 sałata, 2 pomidory, 1 cebula, ketchup, musztarda, sól, pieprz, czosnek granulowany'
WHERE id = 18; -- Domowe burgerki

UPDATE meals SET
  recipe = '1. Jajka ugotuj na twardo (10 min), obierz i przekrój na połówki.
2. Ziemniaki ugotuj w osolonej wodzie.
3. Sos koperkowy: zasmażka z masła i mąki, wlej bulion lub wodę z ziemniaków, dodaj śmietanę i koperek. Gotuj 5 min.
4. Ułóż jajka na talerzu z ziemniakami, polej sosem.',
  ingredients = '4 jajka, 4 ziemniaki, 200ml śmietana 18%, 1 łyżka mąka, masło, pęczek koperku, sól, pieprz'
WHERE id = 19; -- Jajko na twardo w sosie koperkowym + ziemniaki

UPDATE meals SET
  recipe = '1. Na oleju podsmaż czosnek i papryczki chili (lub płatki chili) 1 min.
2. Wlej passatę, gotuj 10 min, dopraw solą, oregano.
3. Ugotuj penne al dente. Wymieszaj z sosem.
4. Posyp parmezanem i natką pietruszki.',
  ingredients = '400g makaron penne, 400g passata pomidorowa, 4 ząbki czosnku, 1–2 papryczki chili lub 1 łyżeczka płatków chili, oregano, oliwa z oliwek, parmezan, sól'
WHERE id = 20; -- Makaron penne arrabiata

UPDATE meals SET
  recipe = '1. Oddziel białka od żółtek. Białka ubij na sztywną pianę ze szczyptą soli.
2. Żółtka wymieszaj z białkiem proteinowym, mąką owsianą/ryżową, mlekiem.
3. Połącz z pianą delikatnie mieszając.
4. Smaż na maśle na małym ogniu — grube puchate omlety. Podaj z owocami lub dżemem.',
  ingredients = '4 jajka, 1 miarka białko proteinowe (opcjonalnie), 3 łyżki mąka owsiana lub ryżowa, 50ml mleko, szczypta soli, masło, dżem lub owoce'
WHERE id = 21; -- Omlety / pancakes białkowe

UPDATE meals SET
  recipe = '1. Karkówkę lub łopatkę pokrój w kostkę (3 cm), obsmaż na oleju ze wszystkich stron.
2. Dodaj cebulę, czosnek, zasmażaj 3 min.
3. Wlej bulion lub wodę, dodaj majeranek, liść laurowy, ziele angielskie. Duś pod przykryciem 45 min.
4. Ugotuj kaszę gryczaną (1:2 z wodą). Podaj razem.',
  ingredients = '700g karkówka lub łopatka wieprzowa, 300g kasza gryczana, 2 cebule, 3 ząbki czosnku, majeranek, liść laurowy, ziele angielskie, sól, pieprz, olej'
WHERE id = 22; -- Świinka duszona + kasza gryczana

UPDATE meals SET
  recipe = '1. Ugotuj ryż (1:2 z wodą, 15 min).
2. Pierś kurczaka pokrój w kostkę, obsmaż na oleju 5 min.
3. Dodaj paprykę w kostkę i cebulę — smaż 5 min.
4. Dodaj passatę lub pomidory z puszki, paprykę słodką i ostrą, sól. Gotuj 15 min.
5. Pod koniec dodaj śmietanę. Podaj z ryżem.',
  ingredients = '500g pierś kurczaka, 300g ryż, 2 papryki czerwone, 1 cebula, 400g passata, 100ml śmietana 18%, papryka słodka, papryka ostra, sól, olej'
WHERE id = 23; -- Kurczak w papryce (paprykarz) + ryż

UPDATE meals SET
  recipe = '1. Świinki z poprzedniego dnia podgrzej, pokrój w paski.
2. Warzywa pokrój.
3. Sos: jogurt z czosnkiem i koperkiem.
4. Ułóż w tortilli: mięso, warzywa, sos. Zawiń.',
  ingredients = '400g duszona wieprzowina, 4 tortille, 1 pomidor, 1 ogórek, 1 sałata, 200g jogurt, 2 ząbki czosnku, koperek, sól'
WHERE id = 24; -- Tortille ze świinką

UPDATE meals SET
  recipe = '1. Pierś kurczaka pokrój w kostkę, obsmaż na oleju 5 min z cebulą.
2. Dodaj pastę curry (1–2 łyżki), smaż 1 min.
3. Wlej mleczko kokosowe, gotuj 15 min. Dopraw solą i limonką.
4. Ugotuj ryż. Podaj razem, posyp kolendrą.',
  ingredients = '500g pierś kurczaka, 300g ryż, 400ml mleczko kokosowe, 2 łyżki pasta curry (czerwone lub żółte), 1 cebula, 2 ząbki czosnku, imbir, sok z limonki, kolendra, olej, sól'
WHERE id = 25; -- Curry z kurczakiem i ryżem

UPDATE meals SET
  recipe = '1. Na oleju zeszklij cebulę i czosnek 3 min.
2. Dodaj passatę, 500ml wody lub bulionu, sól, cukier. Gotuj 10 min.
3. Wrzuć makaron (złamany) i gotuj w zupie do miękkości (ok. 8 min).
4. Dopraw do smaku, podaj ze śmietaną i natką pietruszki.',
  ingredients = '400g passata pomidorowa, 200g makaron nitki lub łamany, 1 cebula, 2 ząbki czosnku, 1 litr wody lub bulion, 100ml śmietana 18%, cukier, sól, olej, natka pietruszki'
WHERE id = 26; -- Zupa pomidorowa z makaronem

UPDATE meals SET
  recipe = '1. Mięso mielone wymieszaj z solą, pieprzem, majerankiem i bułką tartą. Uformuj kotlety.
2. Panieruj: mąka → jajko → bułka tarta.
3. Smaż na oleju po 4–5 min z każdej strony na złoty kolor.
4. Ziemniaki ugotuj. Surówka z kapusty z octem i cukrem.',
  ingredients = '600g mięso mielone, 4 ziemniaki, 1/4 kapusty białej, 2 jajka, bułka tarta, mąka, majeranek, sól, pieprz, olej, ocet, szczypta cukru'
WHERE id = 27; -- Kotlet schabowy (mielony) + ziemniaki + surówka

UPDATE meals SET
  recipe = '1. Ziemniaki zetrzyj na tarce (grube oczka), odciśnij nadmiar wody. Dodaj jajka, mąkę, sól, pieprz.
2. Smaż łyżką na rozgrzanym oleju — spłaszczone placki, ok. 4 min z każdej strony.
3. Podawaj ze śmietaną 18% lub kwaśną śmietaną.',
  ingredients = '1 kg ziemniaki, 2 jajka, 3 łyżki mąka pszenna, 1 cebula, sól, pieprz, olej, 200ml śmietana 18%'
WHERE id = 28; -- Placki ziemniaczane + śmietana

UPDATE meals SET
  recipe = '1. Tortillę posmaruj passatą pomidorową (cienką warstwą).
2. Posyp startym serem żółtym, dodaj ulubione dodatki (szynka, pieczarki, papryka).
3. Piecz w 200°C przez 10 min lub na suchej patelni pod przykryciem 5 min.',
  ingredients = '4 tortille, 200g ser żółty tarty, 200g passata pomidorowa, 100g szynka lub salami, 1 papryka, 50g pieczarki, oregano, sól'
WHERE id = 29; -- Pizza na tortilli

UPDATE meals SET
  recipe = '1. Ugotuj ryż na mleku (1 szklanka ryżu + 2 szklanki mleka + szczypta soli, 15 min na małym ogniu).
2. Jabłka obierz i pokrój w kostkę, podsmaż na maśle z cukrem i cynamonem 5 min.
3. Podaj ryż z jabłkami na wierzchu, posyp cynamonem.',
  ingredients = '200g ryż, 500ml mleko, 2 jabłka, masło, 2 łyżki cukru, cynamon, szczypta soli'
WHERE id = 30; -- Ryż z jabłkami i cynamonem

UPDATE meals SET
  recipe = '1. Mięso (szynka lub łopatka) pokrój w plastry 1 cm, rozbij tłuczkiem.
2. Obsmaż na oleju z obu stron 3 min — tylko zapieczenie.
3. Przełóż do garnka, zalej wodą z cebulą i liściem laurowym, duś 40 min.
4. Sos: woda z duszenia + zasmażka z mąki i masła. Dopraw.
5. Ziemniaki ugotuj.',
  ingredients = '700g wieprzowina (szynka lub łopatka), 4 ziemniaki, 2 cebule, liść laurowy, ziele angielskie, 1 łyżka mąka, masło, sól, pieprz, olej'
WHERE id = 31; -- Bitki wieprzowe w sosie + ziemniaki

UPDATE meals SET
  recipe = '1. Sos teriyaki: sos sojowy + miód + czosnek + imbir — wymieszaj.
2. Pierś kurczaka pokrój w paski, zamarynuj w sosie 15 min.
3. Usmaż na patelni na oleju sezamowym 5–7 min, polewając pozostałym sosem.
4. Ugotuj ryż. Podaj z ryżem i sezamem.',
  ingredients = '500g pierś kurczaka, 300g ryż, 4 łyżki sos sojowy, 2 łyżki miód, 3 ząbki czosnku, łyżeczka imbir tarty, olej sezamowy, sezam do posypania'
WHERE id = 32; -- Kurczak teriyaki + ryż

UPDATE meals SET
  recipe = '1. Ziemniaki ugotuj w osolonej wodzie, odcedź, rozgnieć na gładkie puree.
2. Dodaj mąkę i jajko — wyrób ciasto (nie za długo, będą twarde).
3. Formuj kopytka — wałeczek, krojony ukośnie.
4. Gotuj w osolonej wodzie ok. 3 min po wypłynięciu.
5. Podaj z roztopionym masłem i tartym serem.',
  ingredients = '1 kg ziemniaki, 200g mąka pszenna, 1 jajko, 100g masło, 100g ser żółty tarty, sól'
WHERE id = 33; -- Kopytka z masłem i serem

UPDATE meals SET
  recipe = '1. Grzyby suszone namocz w gorącej wodzie 20 min (lub użyj pieczarek).
2. Cebulę zeszklij na maśle, dodaj posiekane grzyby — smaż 5 min.
3. Dodaj śmietanę, wlej wodę z moczenia (przez sito), gotuj 10 min. Dopraw.
4. Ugotuj kaszę gryczaną (1:2 z wodą).',
  ingredients = '300g kasza gryczana, 30g grzyby suszone lub 400g pieczarki, 1 cebula, 200ml śmietana 18%, masło, natka pietruszki, sól, pieprz'
WHERE id = 34; -- Kasza z sosem grzybowym

UPDATE meals SET
  recipe = '1. Parówki lub kiełbaski podsmaż na patelni lub ugotuj w wodzie 3 min.
2. Bułki hot-dog podgrzej lub przekrój i podsmaż.
3. Złóż: bułka → sałata → kiełbaska → ketchup + musztarda.
4. Podaj z frytkami lub surówką.',
  ingredients = '4 kiełbaski hot-dog lub parówki, 4 bułki hot-dog, ketchup, musztarda, 1 sałata, 1 cebula marynowana (opcjonalnie)'
WHERE id = 35; -- Hot dogi

UPDATE meals SET
  recipe = '1. Ugotuj kaszę gryczaną (1:2 z wodą, ok. 15 min).
2. Jajka usmaż na maśle — sadzone lub jajecznica.
3. Cebulę zeszklij na maśle.
4. Podaj kaszę z jajkami i zeszkloną cebulą, posól.',
  ingredients = '300g kasza gryczana, 4 jajka, 1 cebula, masło, sól, pieprz'
WHERE id = 36; -- Kasza z jajkiem

UPDATE meals SET
  recipe = '1. Ugotuj i odcedź pierogi (z torebki lub mrożone) wg opakowania (ok. 5 min po wypłynięciu).
2. Opcjonalnie: podsmaż na maśle z obu stron na złoto.
3. Cebulę podsmaż na maśle na złoto.
4. Podaj z cebulką i śmietaną.',
  ingredients = '1 opakowanie pierogi wytrawne (ruskie lub z mięsem, ok. 500g), 2 cebule, masło, 200ml śmietana 18%, sól'
WHERE id = 37; -- Pierogi wytrawne

UPDATE meals SET
  recipe = '1. Ugotuj makaron al dente wg instrukcji na opakowaniu.
2. Na patelni podsmaż czosnek na oliwie przez 1 min.
3. Wymieszaj odcedzony makaron z pesto i podsmażonym czosnkiem.
4. Podaj z tartym parmezanem.',
  ingredients = '400g makaron (spaghetti lub penne), 1 słoiczek pesto bazyliowe (190g), 2 ząbki czosnku, parmezan do posypania, oliwa z oliwek, sól'
WHERE id = 38; -- Makaron pesto

UPDATE meals SET
  recipe = '1. Ryż arborio obsmaż na maśle z cebulą 2 min — ziarno musi się zeszklić.
2. Wlej białe wino (opcjonalnie), poczekaj aż odparuje.
3. Dodawaj ciepły bulion chochlą co 3 min, mieszając — ok. 18 min.
4. Pod koniec dodaj pokrojony kurczak (wcześniej podsmażony) i parmezan.',
  ingredients = '300g ryż arborio, 400g pierś kurczaka, 1 cebula, 150ml bulion drobiowy, 100g parmezan, 50g masło, 1 ząbek czosnku, sól, pieprz, oliwa'
WHERE id = 39; -- Risotto z kurczakiem

UPDATE meals SET
  recipe = '1. Pierś kurczaka pokrój w cienkie paski, dopraw solą, papryką.
2. Usmaż na patelni 5–7 min.
3. Tortillę połóż na suchej patelni, posyp serem na połowie, ułóż kurczaka.
4. Złóż tortillę na pół. Smaż po 2 min z każdej strony.',
  ingredients = '400g pierś kurczaka, 4 duże tortille, 200g ser żółty tarty, 1 cebula, papryka czerwona, papryka słodka mielona, sól, olej'
WHERE id = 40; -- Quesadilla z kurczakiem

UPDATE meals SET
  recipe = '1. Sos bolognese: obsmaż mięso mielone z cebulą, dodaj passatę, gotuj 20 min.
2. Sos beszamelowy: masło + mąka (zasmażka), wlej mleko stopniowo, gotuj mieszając, dodaj parmezan.
3. W naczyniu żaroodpornym układaj warstwy: makaron lasagne → bolognese → beszamel.
4. Wierzch: ser. Piecz 35 min w 180°C pod folią, ostatnie 10 min bez foii.',
  ingredients = '500g mięso mielone, 12 płatów makaron lasagne, 400g passata, 500ml mleko, 50g masło, 3 łyżki mąka, 200g parmezan, 1 cebula, 3 ząbki czosnku, oregano, sól, olej'
WHERE id = 41; -- Lasagne

UPDATE meals SET
  recipe = '1. Mięso mielone dopraw przyprawą taco, solą, pieprzem. Obsmaż na patelni 8 min.
2. Podgrzej muszle taco (lub małe tortille) w piekarniku 5 min.
3. Podaj jako "bar tacosowy": mięso, starty ser, sałata, pomidor, kukurydza, śmietana, sos.',
  ingredients = '500g mięso mielone wołowe lub mieszane, 8 muszli taco lub 8 małych tortilli, 200g ser żółty tarty, 1 sałata, 2 pomidory, 1 puszka kukurydzy, 200ml śmietana lub jogurt, przyprawa taco, sól, olej'
WHERE id = 42; -- Tacos domowe

UPDATE meals SET
  recipe = '1. Kiełbasę pokrój w plasterki, obsmaż na patelni na złoto.
2. Kapustę kiszoną odciśnij, dodaj do kiełbasy. Smaż razem 5 min.
3. Dodaj cebulę, liść laurowy, ziele angielskie, trochę wody. Duś pod przykryciem 20 min.
4. Podaj z chlebem lub ziemniakami.',
  ingredients = '400g kiełbasa śląska lub wiejska, 600g kapusta kiszona, 1 cebula, liść laurowy, ziele angielskie, sól, pieprz, olej'
WHERE id = 43; -- Kiełbasa z kapustą

UPDATE meals SET
  recipe = '1. Ugotuj ryż (1:2 z wodą, 15 min).
2. Pierś kurczaka dopraw kumin, papryką, solą — usmaż na patelni pokrojoną w kostkę.
3. W misce ułóż warstwy: ryż, kurczak, kukurydza, fasola, pokrojony pomidor, awokado.
4. Polej sosem: jogurt + limonka + sól.',
  ingredients = '500g pierś kurczaka, 200g ryż, 1 puszka kukurydzy, 1 puszka fasoli czerwonej, 2 pomidory, 1 awokado, 200g jogurt naturalny, 1 limonka, kumin, papryka słodka, sól, olej'
WHERE id = 44; -- Burrito bowl z kurczakiem

UPDATE meals SET
  recipe = '1. Kiełbasę pokrój w plasterki, obsmaż na patelni.
2. Paprykę pokrój w paski, dodaj do kiełbasy, smaż 5 min.
3. Ugotuj makaron al dente.
4. Wymieszaj makaron z kiełbasą i papryką, dopraw passatą lub sosem pomidorowym, sól, pieprz.',
  ingredients = '400g makaron (penne lub rotini), 300g kiełbasa, 2 papryki (czerwona i żółta), 200g passata pomidorowa lub sos pomidorowy, 1 cebula, 2 ząbki czosnku, sól, pieprz, olej'
WHERE id = 45; -- Makaron z kiełbasą i papryką

UPDATE meals SET
  recipe = '1. Karkówkę pokrój w plastry, obsmaż na oleju z cebulą.
2. Wlej trochę wody lub bulionu, duś pod przykryciem 15 min.
3. Ugotuj ryż (1:2 z wodą, 15 min).
4. Podaj razem.',
  ingredients = '600g karkówka wieprzowa, 300g ryż, 2 cebule, sól, pieprz, majeranek, olej'
WHERE id = 46; -- Karkówka z patelni z cebulą + ryż

UPDATE meals SET
  recipe = '1. Przygotuj kopytka: ziemniaki ugotuj i ugnieć, wymieszaj z mąką i jajkiem.
2. Ugotuj kopytka w osolonej wodzie (3 min po wypłynięciu).
3. Gulasz: kiełbasę pokrój, obsmaż z cebulą, dodaj passatę lub sos pomidorowy, majeranek. Gotuj 15 min.
4. Podaj kopytka z gulaszem.',
  ingredients = '1 kg ziemniaki, 200g mąka, 1 jajko, 400g kiełbasa, 400g passata pomidorowa, 1 cebula, majeranek, sól, pieprz, masło'
WHERE id = 47; -- Kopytka z gulaszem kiełbasianym

UPDATE meals SET
  recipe = '1. Ziemniaki ugotuj i ugnieć. Wymieszaj z mąką, jajkiem, solą — ciasto jak na kopytka ale rzadsze.
2. Uformuj kulki (pyzy) o średnicy 5 cm.
3. Gotuj w osolonej wodzie ok. 10 min po wypłynięciu.
4. Podaj z zasmażoną cebulką i śmietaną.',
  ingredients = '1 kg ziemniaki, 300g mąka pszenna, 2 jajka, 2 cebule, masło, 200ml śmietana 18%, sól'
WHERE id = 48; -- Pyzy ziemniaczane

UPDATE meals SET
  recipe = '1. Wymieszaj mąkę, drożdże (lub proszek do pieczenia), sól, mleko, jajka — ciasto powinno być rzadkie.
2. Natrzyj miseczki (lub duże kubki parowe) masłem, napełnij do połowy.
3. Gotuj na parze 15–20 min (nie otwieraj!).
4. Podaj z dowolnym sosem — grzybowym lub mięsnym.',
  ingredients = '300g mąka pszenna, 1 saszetka drożdże lub 2 łyżeczki proszku do pieczenia, 250ml mleko, 2 jajka, masło, szczypta soli'
WHERE id = 49; -- Pampuchy / kluski na parze

UPDATE meals SET
  recipe = '1. Pieczarki pokrój, zeszklij na maśle z cebulą i czosnkiem 5 min.
2. Wlej bulion lub wodę (1 litr), gotuj 15 min.
3. Dodaj śmietanę, dopraw solą, pieprzem, natką pietruszki.
4. Ugotuj makaron osobno, dodaj do zupy.',
  ingredients = '600g pieczarki, 200g makaron nitki lub lane ciasto, 1 cebula, 2 ząbki czosnku, 200ml śmietana 18%, 1 litr bulion, masło, natka pietruszki, sól, pieprz'
WHERE id = 50; -- Zupa pieczarkowa z makaronem

UPDATE meals SET
  recipe = '1. Ugotuj ryż na mleku (1 szklanka ryżu + 2 szklanki mleka + szczypta soli).
2. Truskawki pokrój, posyp cukrem. Zostaw 10 min.
3. Podaj ryż z truskawkami, posyp cukrem pudrem.',
  ingredients = '200g ryż, 500ml mleko, 300g truskawki świeże lub mrożone, cukier, cukier puder, szczypta soli'
WHERE id = 51; -- Ryż z truskawkami

UPDATE meals SET
  recipe = '1. Ugotuj kaszę gryczaną (1:2 z wodą, ok. 15 min).
2. Kiełbasę pokrój w plastry, podsmaż na patelni do zrumienienia.
3. Wymieszaj kaszę z kiełbasą. Dopraw solą i pieprzem.',
  ingredients = '300g kasza gryczana, 400g kiełbasa gryczana lub śląska, sól, pieprz'
WHERE id = 52; -- Kasza gryczana z kiełbasą

UPDATE meals SET
  recipe = '1. Bitki z poprzedniego dnia podgrzej, pokrój w paski.
2. Sos z duszenia podgrzej lub zrób nowy sos czosnkowy (jogurt + czosnek + sól).
3. Ułóż w tortilli: mięso, warzywa, sos. Zawiń.',
  ingredients = '400g bitki wieprzowe (podgrzane), 4 tortille, 1 pomidor, 1 ogórek, 1 sałata, 200g jogurt lub sos z duszenia, sól'
WHERE id = 53; -- Tortille z bitkami

UPDATE meals SET
  recipe = '1. Pieczarki pokrój w plastry, zeszklij na maśle z cebulą i czosnkiem 5 min.
2. Dodaj śmietanę, gotuj 5 min. Dopraw solą, pieprzem, gałką muszkatołową.
3. Kopytka ugotuj wg przepisu (ziemniaki + mąka + jajko, gotuj 3 min po wypłynięciu).
4. Podaj kopytka z sosem.',
  ingredients = '1 kg ziemniaki, 200g mąka, 1 jajko, 500g pieczarki, 1 cebula, 200ml śmietana 18%, masło, gałka muszkatołowa, sól, pieprz'
WHERE id = 54; -- Kopytka z sosem pieczarkowym

UPDATE meals SET
  recipe = '1. Kapustę kiszoną odciśnij, posiekaj jeśli bardzo długa.
2. W garnku obsmaż kiełbasę w plastrach z cebulą.
3. Dodaj kapustę, wodę lub bulion, liść laurowy, ziele angielskie, pieprz. Gotuj 30 min.
4. Dopraw do smaku. Podaj z chlebem.',
  ingredients = '800g kapusta kiszona, 400g kiełbasa wiejska, 2 cebule, liść laurowy, ziele angielskie, sól, pieprz, 500ml woda lub bulion'
WHERE id = 55; -- Kapuśniak z kiełbasą
