import { render, screen } from "@testing-library/react";
import Home from "../Home";

vi.mock("../../services/api", () => ({
  api: {
    listGames: vi.fn(),
  },
}));

import { api } from "../../services/api";

const sample = [
  { id: 1, title: "Half-Life", playtimeHours: 12, lastPlayed: "2024-01-01" },
  { id: 2, title: "Portal", playtimeHours: 4, lastPlayed: "2024-03-10" },
];

beforeEach(() => {
  vi.clearAllMocks();
});

test("Home zeigt das Dashboard mit Statistiken", async () => {
  api.listGames.mockResolvedValueOnce(sample);

  render(<Home />);

  // Überschrift sofort sichtbar
  expect(screen.getByText("Dashboard")).toBeInTheDocument();

  // Summe der Spielstunden (12 + 4 = 16) nach dem Laden
  expect(await screen.findByText("16")).toBeInTheDocument();
  // Letztes Spieldatum (max. der lastPlayed-Werte)
  expect(screen.getByText("2024-03-10")).toBeInTheDocument();
});
