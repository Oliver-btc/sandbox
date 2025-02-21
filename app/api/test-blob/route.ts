// app/api/test-blob/route.ts
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  try {
    // Create test data
    const testData = { test: 'Hello World', timestamp: Date.now() };
    const testSessionId = 'test-' + Date.now();
    
    // Store test data
    const blob = await put(`sessions/${testSessionId}.json`, JSON.stringify(testData), {
      access: 'public',
      addRandomSuffix: false,
      token: process.env.BLOB_READ_WRITE_TOKEN
    });

    // Try to read it back
    const response = await fetch(blob.url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch test data: ${response.status}`);
    }

    const fetchedData = await response.json();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Blob storage test successful',
      testData: fetchedData
    });
  } catch (error) {
    console.error('Blob test failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Blob test failed',
      },
      { status: 500 }
    );
  }
}