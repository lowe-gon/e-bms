import { STATUS_CODE } from '@/constants/http-status-code';
import database from '@/database';
import { userTable } from '@/database/schema';
import { NewUserSchema } from '@/features/accounts/schema/new-user.schema';
import { withAuth } from '@/helpers/with-auth';
import { parseRequest } from '@/lib/parse-request';
import { withCatch } from '@/lib/try-catch';
import type { Users } from '@/typings';
import { clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export const POST = withAuth(async (req) => {
  try {
    const parsed = await parseRequest(req, NewUserSchema);

    if (!parsed.success) {
      return parsed.response;
    }

    const { firstName, lastName, password, username, role, image } = parsed.data;

    const client = await clerkClient();

    const newUser = await client.users.createUser({
      username,
      password,
      firstName,
      lastName,
    });

    await client.users.updateUserProfileImage(newUser.id, {
      file: image,
    });

    const [data, error] = await withCatch(
      database
        .insert(userTable)
        .values({
          clerk_id: newUser.id,
          role: role as Users['role'],
        })
        .onConflictDoUpdate({
          target: userTable.clerk_id,
          set: { role: role as Users['role'] },
        })
        .returning(),
    );

    if (error) {
      return NextResponse.json({ message: error.message }, { status: STATUS_CODE.BAD_REQUEST });
    }

    return NextResponse.json({ data }, { status: STATUS_CODE.CREATED });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'An unexpected error occurred.' },
      { status: STATUS_CODE.SERVER_ERROR },
    );
  }
});
