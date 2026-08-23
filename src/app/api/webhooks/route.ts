import { createServiceSupabaseClient } from '@/lib/supabase/sevice';
import { verifyWebhook } from '@clerk/nextjs/webhooks';
import { NextResponse, type NextRequest } from 'next/server';

// Service role client bypasses Row-Level Security for server-side sync

export async function POST(req: NextRequest): Promise<NextResponse> {
  const supabase = createServiceSupabaseClient();
  try {
    // verifyWebhook automatically reads Svix headers and verifies signature
    const evt = await verifyWebhook(req);
    const { id } = evt.data;
    const eventType = evt.type;

    switch (eventType) {
      case 'user.created':
      case 'user.updated': {
        const firstName = evt.data.first_name ?? '';
        const lastName = evt.data.last_name ?? '';
        const avatarUrl = evt.data.image_url ?? '';
        const phoneNumber = evt.data.phone_numbers?.[0]?.phone_number ?? '';
        const updatedAt = evt.data.updated_at;

        const { error } = await supabase.from('users').upsert(
          {
            clerk_id: id ?? '',
            first_name: firstName,
            last_name: lastName,
            avatar_url: avatarUrl,
            phone_number: phoneNumber,
            updated_at: new Date(updatedAt).toISOString(),
          },
          {
            onConflict: 'clerk_id',
          },
        );

        if (error) {
          console.error('Supabase Upsert Error:', error);
          return new NextResponse('Database sync failed', { status: 500 });
        }
        break;
      }

      case 'user.deleted': {
        if (id) {
          const { error } = await supabase.from('users').delete().eq('id', id);
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
