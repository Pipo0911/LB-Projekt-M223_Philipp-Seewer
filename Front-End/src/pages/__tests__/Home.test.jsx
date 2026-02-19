import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "../Home";

vi.mock("../../services/api", () => ({
  api: {
    importSteam: vi.fn()
  }
}));

import { api } from "../../services/api";

test("Home rendert Import-Button", () => {
  render(<Home />);
  expect(screen.getByRole("button", { name: /steam games importieren/i })).toBeInTheDocument();
});

test("Home zeigt Erfolgsmeldung nach Import", async () => {
  api.importSteam.mockResolvedValueOnce({ imported: 3, seconds: 0.12 });

  render(<Home />);
  await userEvent.click(screen.getByRole("button", { name: /steam games importieren/i }));

  expect(await screen.findByText(/import ok/i)).toBeInTheDocument();
  expect(api.importSteam).toHaveBeenCalledTimes(1);
});