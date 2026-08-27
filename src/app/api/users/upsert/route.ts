import { STATUS_CODE } from '@/constants/http-status-code';
import database from '@/database';
import { userTable } from '@/database/schema';
import { EditUserSchema } from '@/features/accounts/schema/edit-user.schema';
import { NewUserSchema } from '@/features/accounts/schema/new-user.schema';
import { withAuth } from '@/helpers/with-auth';
import { parseQueryParams } from '@/lib/parse-query';
import { parseRequest } from '@/lib/parse-request';
import { withCatch } from '@/lib/try-catch';
import type { Users } from '@/typings';
import { clerkClient } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export const POST = withAuth(async (req) => {
  const { raw } = parseQueryParams(req);
  const mode = raw.get('mode') || 'create';
  const userId = raw.get('userId') || '';

  const targetSchema = mode === 'edit' ? EditUserSchema : NewUserSchema;
  const parsed = await parseRequest(req, targetSchema);

  if (!parsed.success) {
    return parsed.response;
  }

  const { firstName, lastName, role, image } = parsed.data;
  const client = await clerkClient();

  if (mode === 'edit') {
    if (!userId) {
      return NextResponse.json(
        { message: 'User ID is required for editing.' },
        { status: STATUS_CODE.BAD_REQUEST },
      );
    }

    const [, updateUserError] = await withCatch(
      client.users.updateUser(userId, {
        firstName,
        lastName,
      }),
    );

    if (updateUserError) {
      console.error('Clerk Error Details:', updateUserError);
      return NextResponse.json(
        { message: `Clerk Update Failed: ${updateUserError.message}` },
        { status: STATUS_CODE.BAD_REQUEST },
      );
    }

    if (image) {
      const [, imageError] = await withCatch(
        client.users.updateUserProfileImage(userId, { file: image }),
      );
      if (imageError) {
        return NextResponse.json(
          { message: `Profile Image Upload Failed: ${imageError.message}` },
          { status: STATUS_CODE.BAD_REQUEST },
        );
      }
    }

    const [data, error] = await withCatch(
      database
        .update(userTable)
        .set({ role: role as Users['role'] })
        .where(eq(userTable.clerk_id, userId))
        .returning(),
    );

    if (error) {
      return NextResponse.json(
        { message: `Failed to update users: ${error.message}` },
        { status: STATUS_CODE.BAD_REQUEST },
      );
    }

    return NextResponse.json({ data }, { status: STATUS_CODE.OK });
  }

  // --- CREATE MODE ---
  const username =
    'username' in parsed.data && typeof parsed.data.username === 'string'
      ? parsed.data.username
      : undefined;
  const password =
    'password' in parsed.data && typeof parsed.data.password === 'string'
      ? parsed.data.password
      : undefined;

  if (!username || !password) {
    return NextResponse.json(
      { message: 'Username and password are required for new users.' },
      { status: STATUS_CODE.BAD_REQUEST },
    );
  }

  const [newUser, newUserError] = await withCatch(
    client.users.createUser({
      firstName,
      lastName,
      username,
      password,
    }),
  );

  if (newUserError) {
    console.error('Clerk Error Details:', newUserError);
    return NextResponse.json(
      { message: `Clerk Update Failed: ${newUserError.message}` },
      { status: STATUS_CODE.BAD_REQUEST },
    );
  }

  if (image) {
    const [, imageError] = await withCatch(
      client.users.updateUserProfileImage(newUser.id, { file: image }),
    );
    if (imageError) {
      return NextResponse.json(
        { message: `Profile Image Upload Failed: ${imageError.message}` },
        { status: STATUS_CODE.BAD_REQUEST },
      );
    }
  }

  const [data, error] = await withCatch(
    database
      .update(userTable)
      .set({ role: role as Users['role'] })
      .where(eq(userTable.clerk_id, newUser.id))
      .returning(),
  );

  if (error) {
    return NextResponse.json(
      { message: `Failed to insert users: ${error.message}` },
      { status: STATUS_CODE.BAD_REQUEST },
    );
  }

  return NextResponse.json({ data }, { status: STATUS_CODE.CREATED });
});
