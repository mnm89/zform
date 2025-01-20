import Link from "next/link";
import CustomFields from "./_custom-fields";

export default function Home() {
  return (
    <main className="flex flex-col gap-4">
      <div className="bg-gray-50 flex flex-col items-center justify-center py-4">
        <h1 className="text-4xl font-bold text-center mb-6">ZForm Demo</h1>
        <p className="text-lg text-center mb-10 max-w-xl">
          Dynamically generate forms based on Zod schemas with fully
          customizable fields and validation. Explore examples below.
        </p>
        <Link
          href="/examples"
          className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
        >
          View Examples
        </Link>
      </div>
      <h1 className="text-4xl font-bold text-center mb-6">Custom ZF Fields</h1>
      <CustomFields />
    </main>
  );
}
