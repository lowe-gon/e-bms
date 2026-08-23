import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export function withAuth(handler: (req: NextRequest, userId: string) => Promise<NextResponse>) {
  return async function (req: NextRequest) {
    const { userId, isAuthenticated } = await auth();

    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized: No active session found.' },
        { status: 401 },
      );
    }

    return handler(req, userId);
  };
}
