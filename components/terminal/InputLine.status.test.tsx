import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { InputLine } from "./InputLine";

describe("InputLine status", () => {
  test("shows printing indicator and hides caret when status is printing", () => {
    const html = renderToStaticMarkup(
      <InputLine
        value=""
        onType={() => {}}
        onBackspace={() => {}}
        onSubmit={() => {}}
        disabled
        status="printing"
      />,
    );

    expect(html).toContain("printing");
    expect(html).not.toContain("w-[9px]");
  });

  test("does not render typing indicator while printing", () => {
    const html = renderToStaticMarkup(
      <InputLine
        value=""
        onType={() => {}}
        onBackspace={() => {}}
        onSubmit={() => {}}
        disabled
        status="printing"
      />,
    );

    expect(html).not.toContain("typing");
  });
});
