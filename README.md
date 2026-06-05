<p align="center">
    <img src="/assets/banner.svg" alt="Banner z logiem projektu quiz-powiaty"/>
</p>
<p align="center">Quiz o podziale administracyjnym Polski</p>

![Zrzut ekranu z gry (pytania o nazwy powiatów o podanych rejestracjach)](/assets/screenshots/sc1.png)

### Funkcje

- Zgadywanie nazw, stolic, tablic rejestracyjnych, flag, herbów, i kształtów powiatów i województw (łącznie 54 kombinacji do wyboru)
- Tryby gry
  - Test wielokrotnego wyboru
  - Przeciągnij i upuść
  - Wpisywanie
- Tryb ciemny

### Roadmap

- [x] Filtry
- [x] Limit ilości pytań
- [ ] Nowy silnik gry
  - [x] Nowy format danych
  - [x] Generator pytań
  - [x] Uniwersalny generator zawartości do pytań
  - [x] Tryb gry "test wielokrotnego wyboru" (choiceGame)
  - [x] Tryb gry "przeciągnij i upuść" (dndGame)
  - [x] Tryb gry "wpisz" (promptGame)
  - [ ] Tryb gry "podpisz" (typingGame)
  - [ ] Tryb gry "mapa" (mapGame)
- [ ] Statystyki
- [ ] Menu nawigacji
- [ ] Tryb mobilny
- [ ] Prawdziwe flagi i herby zamiast tymczasowych
- [ ] Kiedyś (wersja 2.0)
  - [ ] Tryb gry "Warszawa"
  - [ ] Tryb nauki (mapa wszystkich powiatów z wyszukiwarką)
  - [ ] Zakładanie kont

### Zrzuty ekranu

![Zrzut ekranu z gry (test wielokrotnego wyboru o rejestracjach powiatów)](/assets/screenshots/sc2.png)

![Zrzut ekranu z gry (przyporządkowywanie nazw powiatów do ich kształtów)](/assets/screenshots/sc3.png)

![Zrzut ekranu pokazujący tryb ciemny](/assets/screenshots/sc4.png)

### Uruchamianie środowiska programistycznego

Sklonuj repozytorium za pomocą komendy
```
git clone https://github.com/bmorawiec/quiz-powiaty.git
```

Dostępne komendy
- `npm run dev` - uruchamia serwer pod adresem `localhost:5173`
- `npm run test` - uruchamia wszystkie unit testy
