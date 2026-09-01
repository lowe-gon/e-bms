import { STATUS_CODE } from '@/constants/status-code';
import type { ApiResponse, ResponseMetadata } from '@/typings/api.types';
import { NextResponse } from 'next/server';

export function unauthorized(message = 'Authentication required'): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    {
      success: false,
      code: 'UNAUTHORIZED',
      message,
      data: null,
      metadata: null,
    },
    { status: STATUS_CODE.UNAUTHORIZED },
  );
}

export function forbidden(
  message = 'You do not have permission to perform this action',
): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    {
      success: false,
      code: 'FORBIDDEN',
      message,
      data: null,
      metadata: null,
    },
    { status: STATUS_CODE.FORBIDDEN },
  );
}

export function badRequest(message = 'Bad request'): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    {
      success: false,
      code: 'BAD_REQUEST',
      message,
      data: null,
      metadata: null,
    },
    { status: STATUS_CODE.BAD_REQUEST },
  );
}

export function serverError(message = 'An unknown error occured'): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    {
      success: false,
      code: 'SERVER_ERROR',
      message,
      data: null,
      metadata: null,
    },
    { status: STATUS_CODE.SERVER_ERROR },
  );
}

export function created<TData>(
  data: TData,
  message = 'Successfully created.',
): NextResponse<ApiResponse<TData>> {
  return NextResponse.json(
    {
      success: false,
      code: 'OK',
      message,
      data,
      metadata: null,
    },
    { status: STATUS_CODE.CREATED },
  );
}

export function ok<TData>(
  data: TData,
  message = 'Success.',
  metadata: ResponseMetadata | null = null,
): NextResponse<ApiResponse<TData>> {
  return NextResponse.json(
    {
      success: false,
      code: 'OK',
      message,
      data,
      metadata: metadata ?? null,
    },
    { status: STATUS_CODE.OK },
  );
}
