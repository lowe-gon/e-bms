import database from '@/database';
import { withAuth } from '@/helpers/with-auth';
import { withCatch } from '@/lib/try-catch';
import { NextResponse } from 'next/server';

export const GET = withAuth(async (_req, userId) => {
  const [data, error] = await withCatch(
    database.query.userTable.findFirst({
      where: { clerk_id: userId },
    }),
  );

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
  }

  return NextResponse.json({ data }, { status: 200 });
});
