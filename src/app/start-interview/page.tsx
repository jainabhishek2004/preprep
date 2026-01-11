// app/start-interview/page.tsx
import amazonHR  from "@/data/amazon-hr.json";

export default async function StartInterviewPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const company = (searchParams?.company as string) || "Unknown Company";
  const round = (searchParams?.round as string) || "Unknown Round";
  console.log("amazonHR:", amazonHR);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-8">Start Interview of {company}</h1>
      <p className="text-lg mb-4">
        This is where the {round} interview process begins.
      </p>

      {/* Button as a client component */}
      <form action={`/interview/start?company=${company}&round=${round}`}>
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Begin Interview
        </button>
      </form>
    </div>
  );
}
