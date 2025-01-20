"use client";
import CodeBlock from "@/components/ui/code-block";
import ZForm, { zf } from "@/zform";
import { z } from "zod";

function CountrySelect() {
  return (
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
/>`}
        language="tsx"
      />
    </div>
  );
}

function PhoneNumber() {
  return (
    <div>
      <ZForm
        className="w-full"
        schema={z.object({ phone_number: zf.phoneNumber() })}
        config={{ phone_number: { typeOverride: "phone-number" } }}
        onSubmit={(data) => alert(JSON.stringify(data.phone_number, null, 2))}
        withSubmit
        submitProps={{ children: "Validate", size: "sm" }}
      />
      <CodeBlock
        code={`
<ZForm
  className="w-full"
  schema={z.object({ phone_number: zf.phoneNumber() })}
  config={{ phone_number: { typeOverride: "phone-number" } }}
  onSubmit={(data) => alert(JSON.stringify(data.phone_number, null, 2))}
  withSubmit
  submitProps={{ children: "Validate", size: "sm" }}
/>`}
        language="tsx"
      />
    </div>
  );
}

function DateRange() {
  return (
    <div>
      <ZForm
        className="w-full"
        schema={z.object({ date_range: zf.dateRange() })}
        config={{
          date_range: {
            typeOverride: "date-range",
          },
        }}
        onSubmit={(data) => alert(JSON.stringify(data.date_range, null, 2))}
        withSubmit
        submitProps={{ children: "Validate", size: "sm" }}
      />
      <CodeBlock
        code={`
<ZForm
  className="w-full"
  schema={z.object({ date_range: zf.dateRange() })}
  config={{ date_range: { typeOverride: "date-range" } }}
  onSubmit={(data) => alert(JSON.stringify(data.date_range, null, 2))}
  withSubmit
  submitProps={{ children: "Validate", size: "sm" }}
/>`}
        language="tsx"
      />
    </div>
  );
}

export default function CustomFields() {
  return (
    <main className="grid grid-cols-3 p-4 gap-2">
      <CountrySelect />
      <PhoneNumber />
      <DateRange />
    </main>
  );
}
