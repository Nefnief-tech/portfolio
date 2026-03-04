import { describe, expect, test } from "bun:test";
import { buildStartupTranscript } from "./startup";

describe("startup transcript", () => {
  test("includes header, profile neofetch, and initial command list", () => {
    const { lines } = buildStartupTranscript();
    const text = lines.join("\n");

    expect(text).toContain("PORTFOLIO OS");
    expect(text).toContain("Your Name");
    expect(text).toContain("Student. Builder. Tinkerer.");

    expect(text).toContain("OS:");
    expect(text).toContain("User:");
    expect(text).toContain("Shell:");

    expect(text).toContain("Available commands:");
    expect(text).toContain("help");
    expect(text).toContain("about");
    expect(text).toContain("projects");
    expect(text).toContain("skills");
    expect(text).toContain("contact");
    expect(text).toContain("clear");
  });
});
