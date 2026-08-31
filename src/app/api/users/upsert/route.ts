import { STATUS_CODE } from '@/constants/http-status-code';
import database from '@/database';
import { userTable } from '@/database/schema';
import { CreateUserSchema, EditUserSchema } from '@/features/accounts/schema/user.scheme';
import { withAuth } from '@/helpers/with-auth';
import { parseQueryParams } from '@/lib/parse-query';
import { parseRequest } from '@/lib/parse-request';
import { withCatch } from '@/lib/try-catch';
import type { ResponseData, Users } from '@/typings';
import { clerkClient } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export const POST = withAuth(async (req): Promise<NextResponse<ResponseData<Users | null>>> => {
  try {
    const parsedSchema = await parseRequest(req, CreateUserSchema);

    if (!parsedSchema.success) {
      return parsedSchema.response;
    }

    const { firstName, lastName, username, password, image, emailAddress, phoneNumber, role } =
      parsedSchema.data;

    const client = await clerkClient();

    const [clerkUser, clerkUserError] = await withCatch(
      client.users.createUser({
        firstName,
        lastName,
        username: username!,
        password,
        // emailAddress: ['doe+clerk_test@example.com'],
        // phoneNumber: ['+12015550100'],
      }),
    );

    if (clerkUserError) {
      return NextResponse.json(
        {
          success: false,
          message: `Failed to create new clerk user: ${clerkUserError.message}`,
          data: null,
          metadata: null,
        },
        { status: STATUS_CODE.BAD_REQUEST },
      );
    }

    if (image) {
      const [, imageError] = await withCatch(
        client.users.updateUserProfileImage(clerkUser.id, {
          file: image,
        }),
      );

      if (imageError) {
        return NextResponse.json(
          {
            success: false,
            message: `Failed to upload user avatar: ${imageError.message}`,
            data: null,
            metadata: null,
          },
          { status: STATUS_CODE.BAD_REQUEST },
        );
      }
    }

    const [updatedUser, updatedUserError] = await withCatch<Users[]>(
      database
        .update(userTable)
        .set({
          role,
        })
        .where(eq(userTable.clerkId, clerkUser.id)),
    );

    if (updatedUserError) {
      return NextResponse.json(
        {
          success: false,
          message: `Failed to create new user: ${updatedUserError.message}`,
          data: null,
          metadata: null,
        },
        { status: STATUS_CODE.BAD_REQUEST },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully created user',
        data: updatedUser[0]!,
        metadata: null,
      },
      { status: STATUS_CODE.CREATED },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'An unknown error occured',
        data: null,
        metadata: null,
      },
      { status: STATUS_CODE.BAD_REQUEST },
    );
  }
});

export const PUT = withAuth(async (req): Promise<NextResponse<ResponseData<Users | null>>> => {
  try {
    const { raw } = parseQueryParams(req);
    const userId = raw.get('userId') as string;
    const parsedSchema = await parseRequest(req, EditUserSchema);

    if (!parsedSchema.success) {
      return parsedSchema.response;
    }

    const { firstName, lastName, phoneNumber, emailAddress, image, role } = parsedSchema.data;

    const client = await clerkClient();

    const [clerkUser, clerkUserError] = await withCatch(
      client.users.updateUser(userId, {
        firstName,
        lastName,
      }),
    );

    if (clerkUserError) {
      return NextResponse.json(
        {
          success: false,
          message: `Failed to update clerk user: ${clerkUserError.message}`,
          data: null,
          metadata: null,
        },
        { status: STATUS_CODE.BAD_REQUEST },
      );
    }

    const existingPhoneNumberId = clerkUser.phoneNumbers[0]?.id;

    // If the user already has an phone number, create the new one and delete the old one
    const [, phoneNumberError] = await withCatch(
      client.phoneNumbers.createPhoneNumber({
        userId: clerkUser.id,
        phoneNumber: '+12015550100',
        primary: true,
        verified: true,
      }),
    );

    if (phoneNumberError) {
      return NextResponse.json(
        {
          success: false,
          message: `Failed to update email address: ${phoneNumberError.message}`,
          data: null,
          metadata: null,
        },
        { status: STATUS_CODE.BAD_REQUEST },
      );
    }

    // Delete the old email address if it exists and is different
    if (existingPhoneNumberId && clerkUser.phoneNumbers[0]?.phoneNumber !== phoneNumber) {
      await client.phoneNumbers.deletePhoneNumber(existingPhoneNumberId);
    }

    // If the user already has an email, create the new one and delete the old one
    const [, emailError] = await withCatch(
      client.emailAddresses.createEmailAddress({
        userId: clerkUser.id,
        emailAddress: 'bisenio+clerk_test@example.com',
        primary: true,
        verified: true,
      }),
    );

    if (emailError) {
      return NextResponse.json(
        {
          success: false,
          message: `Failed to update email address: ${emailError.message}`,
          data: null,
          metadata: null,
        },
        { status: STATUS_CODE.BAD_REQUEST },
      );
    }

    const existingEmailId = clerkUser.emailAddresses[0]?.id;

    // Delete the old email address if it exists and is different
    if (existingEmailId && clerkUser.emailAddresses[0]?.emailAddress !== emailAddress) {
      await client.emailAddresses.deleteEmailAddress(existingEmailId);
    }

    if (image) {
      const [, imageError] = await withCatch(
        client.users.updateUserProfileImage(clerkUser.id, {
          file: image,
        }),
      );

      if (imageError) {
        return NextResponse.json(
          {
            success: false,
            message: `Failed to upload user avatar: ${imageError.message}`,
            data: null,
            metadata: null,
          },
          { status: STATUS_CODE.BAD_REQUEST },
        );
      }
    }

    const [updatedUser, updatedUserError] = await withCatch<Users[]>(
      database
        .update(userTable)
        .set({
          role,
        })
        .where(eq(userTable.clerkId, clerkUser.id)),
    );

    if (updatedUserError) {
      return NextResponse.json(
        {
          success: false,
          message: `Failed to create new user: ${updatedUserError.message}`,
          data: null,
          metadata: null,
        },
        { status: STATUS_CODE.BAD_REQUEST },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully created user',
        data: updatedUser[0]!,
        metadata: null,
      },
      { status: STATUS_CODE.OK },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'An unknown error occured',
        data: null,
        metadata: null,
      },
      { status: STATUS_CODE.BAD_REQUEST },
    );
  }
});
