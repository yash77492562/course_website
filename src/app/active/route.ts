import { NextResponse } from 'next/server';

/**
 * Frontend liveness check — GET /active.
 *
 * This is the ONLY API route the frontend serves itself. Every other API call
 * goes directly to the backend (NEXT_PUBLIC_API_URL). Used by load balancers /
 * uptime monitors to confirm the Next server is up.
 */
export function GET() {
  return NextResponse.json({ status: 'ok', service: 'frontend' });
}
