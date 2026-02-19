import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Games from "../Games";

vi.mock("../../services/api", () => ({
  api: {
    listGames: vi.fn(),
    patchGame: vi.fn(),
    deleteGame: vi.fn()
  }
}));

import { api } from "../../services/api";

const sample = [
  { appid: 10, name: "Half-Life", hours: 12.3, icon: null, header: null, status: null, note: null },
  { appid: 20, name: "Portal", hours: 4.1, icon: null, header: null, status: "backlog", note: "spÃ¤ter" }
];

test("Games lÃ¤dt und zeigt Liste", async () => {
  api.listGames.mockResolvedValueOnce(sample);

  render(<Games />);
  expect(await screen.findByText("Half-Life")).toBeInTheDocument();
  expect(screen.getByText("Portal")).toBeInTheDocument();
});

test("Games: Bearbeiten -> Speichern ruft patchGame auf", async () => {
  api.listGames.mockResolvedValueOnce(sample);
  api.patchGame.mockResolvedValueOnce({ ok: true });
  // reload after save
  api.listGames.mockResolvedValueOnce([
    { ...sample[0], status: "playing", note: "now" },
    sample[1]
  ]);

  render(<Games />);

  const row = await screen.findByText("Half-Life");
  const tr = row.closest("tr");

  await userEvent.click(within(tr).getByRole("button", { name: /bearbeiten/i }));

  const statusInput = screen.getByPlaceholderText(/backlog/i);
  const noteInput = screen.getByPlaceholderText(/max 500/i);

  await userEvent.clear(statusInput);
  await userEvent.type(statusInput, "playing");
  await userEvent.clear(noteInput);
  await userEvent.type(noteInput, "now");

  await userEvent.click(screen.getByRole("button", { name: /speichern/i }));

  expect(api.patchGame).toHaveBeenCalledWith(10, { status: "playing", note: "now" });
});

test("Games: LÃ¶schen entfernt Game aus UI und ruft deleteGame auf", async () => {
  api.listGames.mockResolvedValueOnce(sample);
  api.deleteGame.mockResolvedValueOnce({ ok: true });
  window.confirm = vi.fn(() => true);

  render(<Games />);

  const row = await screen.findByText("Portal");
  const tr = row.closest("tr");

  await userEvent.click(within(tr).getByRole("button", { name: /lÃ¶schen/i }));

  expect(api.deleteGame).toHaveBeenCalledWith(20);
  expect(screen.queryByText("Portal")).not.toBeInTheDocument();
});