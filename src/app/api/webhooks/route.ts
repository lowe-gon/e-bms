import database from '@/database';
import { userTable } from '@/database/schema';
import { withCatch } from '@/lib/try-catch';
import type { Users } from '@/typings';
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
          clerk_id: id ?? '',
          first_name: evt.data.first_name ?? '',
          last_name: evt.data.last_name ?? '',
          avatar_url: evt.data.image_url ?? '',
          phone_number: evt.data.phone_numbers?.[0]?.phone_number ?? '',
          updated_at: new Date(evt.data.updated_at).toISOString(),
        } as Users;

        const [, error] = await withCatch(
          database.insert(userTable).values(newUser).onConflictDoUpdate({
            target: userTable.clerk_id,
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
          const [, error] = await withCatch(
            database.delete(userTable).where(eq(userTable.clerk_id, id)),
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
