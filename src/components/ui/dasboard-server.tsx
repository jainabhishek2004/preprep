import { currentUser } from "@clerk/nextjs/server";

export default async function DashboardServer() {
  const user = await currentUser();

  if (!user) return <div>Not signed in</div>;

  return (
    <div>
      <h1>Welcome, {user.firstName} 👋</h1>
    </div>
  );
}
