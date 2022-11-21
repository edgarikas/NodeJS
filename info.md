### Duomanų bazių tipai:

- SQL | (naudojama SQL kalba)
- NoSQL | (nenaudojama SQL kalba)

- SQL: Database -> Tables -> Rows/Culumn
- NoSQL: Database -> Collections -> Documents
- SQL: MySQL, PostgreSQL ...
- NoSQL: MongoDB, Fauna, Firebase ...
  MongoDB duomenų bazių projektavimas (plačiau: https://docs.mongodb.com/manual/core/data-modeling-introduction/)

---

#### Praktika

Aplikacija, kurioje vartotojai gali užsiregistruoti ir patalpinti turimą DVD filmą, kurį galės išsinuomoti kiti vartotojai

reikia duomenų bazėje laikyti: vartotojus, filmus, užsakymus
Aplikacijos duomenų bazių projektai:

- Embedded būdas (kuriamas vienas arba keli dideli Collections duomenims laikyti)
  ---- vartotojai (collection)
  ------ ID
  ------ vardas ir pavardė
  ------ el. paštas
  ------ slaptažodis
  ------ nuomojami filmai (filmai, kuriuos kitiems isšinuomoti siūlo vartotjas)
  ------ -- filmo ID
  ------ -- filmo pavadinimas
  ------ -- filmo kategorija
  ------ -- filmo nuomos kaina
  ------ -- nuomos statusas
  ------ užsakymai (filmai, kuriuos yra isšinuomavęs vartotojas iš kitų vartotojų)
  ------ -- užsakymo ID
  ------ -- filmo ID
  ------ -- apmokėjimas
  ------ -- terminas
  ------------ Comunication: one - to one

- References (listed) būdas (kuriama daug Collections duomenims laikyti)
  ---- vartotojai (collection)
  - ----- ID
    ------ vardas ir pavardė
    ------ el. paštas
    ------ slaptažodis
    ---- filmus (collection)
    ------ ID
    ------ vartotojo ID (kuris patalpino filmą nuomai)
    ------ filmo pavadinimas
    ------ filmo kategorija
    ------ filmo nuomos kaina
    ------ nuomos statusas
    ---- užsakymus (collection)
    ------ ID
    ------ filmo ID
    ------ vartotojo ID
    ------ terminas
    ------------ Comunication: one - to one ir one - to - many
