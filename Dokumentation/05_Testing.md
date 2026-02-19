# Testing

## Unit-Tests

Zur Sicherstellung der Kernfunktionalität wurden 5 Unit-Tests implementiert.

Getestet werden:

- Abrufen aller Spiele
- Erstellen eines gültigen Spiels
- Erstellen eines ungültigen Spiels
- Löschen eines Spiels
- Fehlerfall bei nicht existierender ID

Die Tests können mit folgendem Befehl ausgeführt werden:

mvn test

---

## Manueller Testplan

| Testfall | Erwartetes Ergebnis |
|----------|--------------------|
| Neues Spiel erstellen | HTTP 201 |
| Spiel ohne Pflichtfeld | HTTP 400 |
| Spiel abrufen | HTTP 200 |
| Spiel löschen | HTTP 204 |
| Ungültige ID abrufen | HTTP 404 |

---

## Testdurchführung

Alle definierten Testfälle wurden erfolgreich durchgeführt.
Die API reagiert stabil und liefert korrekte HTTP-Statuscodes.
