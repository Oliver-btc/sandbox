// app/api/logger/route.ts
import { NextRequest, NextResponse } from 'next/server';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwTSU7F79nzd6dFnXFM4h2wvhDgVE369Z2vUzgMcuNtlBiVRUjx8aounVeo7sH5-Ug/exec';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Forward the request to Google Apps Script
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error('Failed to log to Google Sheet');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logging error:', error);
    return NextResponse.json(
      { error: 'Failed to log submission' },
      { status: 500 }
    );
  }
}