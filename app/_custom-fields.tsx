"use client";
import CodeBlock from "@/components/ui/code-block";
import ZForm, { zf } from "@/zform";
import { z } from "zod";

export default function CustomFields() {
  return (
    <main className="grid grid-cols-3 p-4">
      <div>
        <ZForm
          className="w-full"
          schema={z.object({ country: zf.countrySelect() })}
          config={{ country: { typeOverride: "country-select" } }}
          onSubmit={(data) => alert(JSON.stringify(data.country, null, 2))}
          withSubmit
          submitProps={{ children: "Validate", size: "sm" }}
        />

        <CodeBlock
          code={`
<ZForm
  className="w-full"
  schema={z.object({ country: zf.countrySelect() })}
  config={{ country: { typeOverride: "country-select" } }}
  onSubmit={(data) => alert(JSON.stringify(data.country, null, 2))}
  withSubmit
  submitProps={{ children: "Validate", size: "sm" }}
/>
      `}
          language="tsx"
        />
      </div>
    </main>
  );
}
