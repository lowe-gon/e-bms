import { STATUS_CODE } from '@/constants/http-status-code';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export type ParseRequestResult<TSchema extends z.ZodType> =
  | { success: true; data: z.output<TSchema> }
  | { success: false; response: NextResponse<{ message: string }> };

/**
 * Validates request JSON against a Zod schema.
 * Returns inferred output data or an error NextResponse.
 */
export async function parseRequest<TSchema extends z.ZodType>(
  request: NextRequest,
  schema: TSchema,
): Promise<ParseRequestResult<TSchema>> {
  try {
    const contentType = request.headers.get('content-type') ?? '';
    let payload: unknown;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const entries: Record<string, unknown> = {};

      formData.forEach((value, key) => {
        entries[key] = value;
      });

      payload = entries;
    } else {
      payload = await request.json();
    }

    const result = schema.safeParse(payload);

    if (!result.success) {
      return {
        success: false,
        response: NextResponse.json(
          {
            message: result.error.issues.map((issue) => issue.message).join(', '),
          },
          {
            status: STATUS_CODE.BAD_REQUEST,
          },
        ),
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch {
    return {
      success: false,
      response: NextResponse.json(
        { message: 'Invalid JSON payload' },
        { status: STATUS_CODE.BAD_REQUEST },
      ),
    };
  }
}
