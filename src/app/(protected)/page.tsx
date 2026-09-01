import { auth } from '@clerk/nextjs/server';

export default async function DashboardPage() {
  const { isAuthenticated } = await auth();
  return <div>Dashboard: {isAuthenticated ?? false}</div>;
}
