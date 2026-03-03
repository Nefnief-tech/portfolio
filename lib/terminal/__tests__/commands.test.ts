import { describe, it, expect } from "bun:test";
import { COMMANDS, closestCommand } from "../commands";

describe("COMMANDS", () => {
  it("has help command", () => expect(COMMANDS.help).toBeDefined());
  it("about maps to section about", () => expect(COMMANDS.about.target).toBe("about"));
  it("clear maps to clear action", () => expect(COMMANDS.clear.action).toBe("clear"));
});

describe("closestCommand", () => {
  it("returns closest match for typo", () => expect(closestCommand("abut")).toBe("about"));
  it("returns null for totally unknown", () => expect(closestCommand("zzzzz")).toBeNull());
  it("returns exact match", () => expect(closestCommand("skills")).toBe("skills"));
});
