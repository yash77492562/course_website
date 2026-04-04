import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: lessonId } = await params;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
    
    console.log(`[Lesson API] Fetching lesson ${lessonId} from ${apiUrl}/courses/lessons/${lessonId}`);
    
    const response = await fetch(`${apiUrl}/courses/lessons/${lessonId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const data = await response.json();
    
    console.log(`[Lesson API] Response status: ${response.status}`);
    console.log(`[Lesson API] Response data:`, data);

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to fetch lesson' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('[Lesson API] Error fetching lesson:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: String(error) },
      { status: 500 }
    );
  }
}
