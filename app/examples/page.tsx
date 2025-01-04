import Link from "next/link";

const examples = [
  {
    name: "Sign Up Form",
    path: "/examples/signup",
    description: "A basic sign-up form with validation.",
  },
  {
    name: "Contact Form",
    path: "/examples/contact",
    description: "A contact form with multiple fields.",
  },
  {
    name: "Feedback Form",
    path: "/examples/feedback",
    description: "A feedback form with ratings.",
  },
];

export default function ExamplesIndex() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Examples</h1>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {examples.map((example) => (
          <div
            key={example.path}
            className="p-4 border rounded-lg shadow hover:shadow-md"
          >
            <h2 className="text-xl font-semibold">{example.name}</h2>
            <p className="text-gray-600">{example.description}</p>
            <Link
              href={example.path}
              className="mt-4 inline-block text-blue-500 hover:underline"
            >
              View Example →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
