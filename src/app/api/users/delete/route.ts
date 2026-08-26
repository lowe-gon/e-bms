import { STATUS_CODE } from '@/constants/http-status-code';
import { withAuth } from '@/helpers/with-auth';
import { parseQueryParams } from '@/lib/parse-query';
import { withCatch } from '@/lib/try-catch';
import { clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export const DELETE = withAuth(async (req) => {
  const { raw } = parseQueryParams(req);
  const userId = raw.get('userId');

  if (!userId) {
    return NextResponse.json(
      { message: 'Required parameter: userId' },
      { status: STATUS_CODE.BAD_REQUEST },
    );
  }

  const client = await clerkClient();

  const [, deleteUserError] = await withCatch(client.users.deleteUser(userId));

  if (deleteUserError) {
    console.log(`Failed to delete user: ${deleteUserError.message}`);
    return NextResponse.json(
      { message: `Failed to delete user: ${deleteUserError.message}` },
      { status: STATUS_CODE.BAD_REQUEST },
    );
  }

  return NextResponse.json({ message: 'Successfuly deleted user' }, { status: STATUS_CODE.OK });
});
