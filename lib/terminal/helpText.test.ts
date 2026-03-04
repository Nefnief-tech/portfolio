import { describe, expect, test } from "bun:test";
import { buildHelpText } from "./commands";

describe("buildHelpText", () => {
  test("lists canonical commands and hides aliases/easter eggs", () => {
    const text = buildHelpText();

    expect(text).toContain("Available commands:");

    expect(text).toContain("help");
    expect(text).toContain("about");
    expect(text).toContain("projects");
    expect(text).toContain("skills");
    expect(text).toContain("contact");
    expect(text).toContain("clear");

    expect(text).not.toContain("whoami");
    expect(text).not.toContain("ls projects");
    expect(text).not.toContain("cat skills.json");
    expect(text).not.toContain("./contact");
    expect(text).not.toContain("cls");
    expect(text).not.toContain("? ");

    expect(text).not.toContain("exit");
    expect(text).not.toContain("sudo");
  });
});
