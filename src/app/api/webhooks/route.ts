import database from '@/database';
import { userTable } from '@/database/schema';
import { tryCatch } from '@/lib/try-catch';
import type { TUsers } from '@/typings';
import { verifyWebhook } from '@clerk/nextjs/webhooks';
import { eq } from 'drizzle-orm';
import { NextResponse, type NextRequest } from 'next/server';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // verifyWebhook automatically reads Svix headers and verifies signature
    const evt = await verifyWebhook(req);
    const { id } = evt.data;
    const eventType = evt.type;

    switch (eventType) {
      case 'user.created':
      case 'user.updated': {
        const newUser = {
          clerkId: id ?? '',
          firstName: evt.data.first_name ?? '',
          lastName: evt.data.last_name ?? '',
          avatarUrl: evt.data.image_url ?? '',
          phoneNumber: evt.data.phone_numbers?.[0]?.phone_number ?? '',
          username: evt.data.username ?? null,
          emailAddress: evt.data.email_addresses?.[0]?.email_address ?? null,
          lastSignInAt: evt.data.last_sign_in_at
            ? new Date(evt.data.last_sign_in_at).toISOString()
            : null,
          updatedAt: new Date(evt.data.updated_at).toISOString(),
        } as TUsers;

        const [, error] = await tryCatch(
          database.insert(userTable).values(newUser).onConflictDoUpdate({
            target: userTable.clerkId,
            set: newUser,
          }),
        );

        if (error) {
          console.error('Supabase Upsert Error:', error);
          return new NextResponse('Database sync failed', { status: 500 });
        }
        break;
      }

      case 'user.deleted': {
        if (id) {
          const [, error] = await tryCatch(
            database.delete(userTable).where(eq(userTable.clerkId, id)),
          );

          if (error) {
            console.error('Supabase Delete Error:', error);
            return new NextResponse('Database deletion failed', { status: 500 });
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${eventType}`);
    }

    return new NextResponse('Webhook processed successfully', { status: 200 });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new NextResponse('Error verifying webhook', { status: 400 });
  }
}
