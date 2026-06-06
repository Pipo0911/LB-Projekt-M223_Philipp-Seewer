import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Games from "../Games";

// Echter API-Client wird gemockt (Methoden entsprechen services/api.js).
vi.mock("../../services/api", () => ({
  api: {
    listGames: vi.fn(),
    createGame: vi.fn(),
    updateGame: vi.fn(),
    deleteGame: vi.fn(),
  },
}));

import { api } from "../../services/api";

const sample = [
  {
    id: 1,
    title: "Half-Life",
    steamAppId: 70,
    playtimeHours: 12,
    installed: true,
    lastPlayed: "2024-01-01",
  },
  { id: 2, title: "Portal", steamAppId: 400, playtimeHours: 4, installed: false, lastPlayed: null },
];

beforeEach(() => {
  vi.clearAllMocks();
});

test("Games lädt und zeigt die Liste", async () => {
  api.listGames.mockResolvedValueOnce(sample);

  render(<Games />);

  expect(await screen.findByText("Half-Life")).toBeInTheDocument();
  expect(screen.getByText("Portal")).toBeInTheDocument();
});

test("Bearbeiten → Speichern ruft updateGame auf", async () => {
  api.listGames.mockResolvedValueOnce(sample);
  api.updateGame.mockResolvedValueOnce({ ok: true });
  api.listGames.mockResolvedValueOnce(sample); // Neuladen nach dem Speichern

  render(<Games />);

  const row = (await screen.findByText("Half-Life")).closest("tr");
  await userEvent.click(within(row).getByRole("button", { name: /bearbeiten/i }));

  const titleInput = screen.getByDisplayValue("Half-Life");
  await userEvent.clear(titleInput);
  await userEvent.type(titleInput, "Half-Life 2");

  await userEvent.click(screen.getByRole("button", { name: /speichern/i }));

  expect(api.updateGame).toHaveBeenCalledWith(
    1,
    expect.objectContaining({ title: "Half-Life 2", steamAppId: 70 })
  );
});

test("Löschen entfernt das Game und ruft deleteGame auf", async () => {
  api.listGames.mockResolvedValueOnce(sample);
  api.deleteGame.mockResolvedValueOnce({ ok: true });
  window.confirm = vi.fn(() => true);

  render(<Games />);

  const row = (await screen.findByText("Portal")).closest("tr");
  await userEvent.click(within(row).getByRole("button", { name: /löschen/i }));

  expect(api.deleteGame).toHaveBeenCalledWith(2);
  expect(screen.queryByText("Portal")).not.toBeInTheDocument();
});
