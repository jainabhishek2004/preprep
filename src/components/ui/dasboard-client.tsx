
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardServer from "@/components/ui/dasboard-server";

export default function DashboardPage() {
  useEffect(() => {
    fetch("/api/sync-user", { method: "POST" });
  }, []);

  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    const company = e.target.company.value;
    const round = e.target.round.value;

    // Navigate to the route with query parameters
    router.push(`/start-interview?company=${company}&round=${round}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="company">Select Company:</label>
      <select
        id="company"
        name="company"
        required
        className="border rounded-md p-2 ml-2"
      >
        <option value="">--Choose a company--</option>
        <option value="google">Google</option>
        <option value="microsoft">Microsoft</option>
        <option value="amazon">Amazon</option>
        <option value="meta">Meta</option>
      </select>

      <br /><br />

      <label htmlFor="round">Select Round:</label>
      <select
        id="round"
        name="round"
        required
        className="border rounded-md p-2 ml-2"
      >
        <option value="">--Choose a round--</option>
        <option value="hr">HR</option>
        <option value="coding">Coding</option>
        <option value="technical">Technical</option>
        <option value="full">Full Experience</option>
      </select>

      <br /><br />

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Start Interview
      </button>
    </form>
  );
}
