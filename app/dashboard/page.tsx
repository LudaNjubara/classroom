import fetchUserSession from "@/lib/fetch-user-session";

export default function DashboardPage() {
  const userSession = fetchUserSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold text-center">Welcome to Dashboard page</h1>

      {userSession.isAuthenticated && (
        <p className="text-center">You are signed in as {userSession.user.email}</p>
      )}
    </main>
  );
}
