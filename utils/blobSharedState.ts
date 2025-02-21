// utils/blobSharedState.ts
import { put } from '@vercel/blob';
import { nanoid } from 'nanoid';

// Define interfaces for type safety
interface GeneralPitch {
  description: string;
  imageUrl: string;
}

interface SpecificPitch {
  description: string;
  imageUrl: string;
}

interface CustomerFeedback {
  testimonial: string;
  imageUrl: string;
  customerName?: string;
}

interface Quiz {
  question: string;
  options: string[];
  correctAnswer: number;
  logoUrl: string;
  siteName: string;
}

interface AnalysisState {
  generalPitch: GeneralPitch;
  specificPitch: SpecificPitch;
  customerFeedback: CustomerFeedback;
  quiz?: Quiz;
}

interface StoredAnalysisState extends AnalysisState {
  timestamp: number;
}

/**
 * Stores analysis results in Vercel Blob storage
 * @param analysisResults The analysis results to store
 * @returns Promise containing the session ID
 */
export async function storeAnalysisResults(analysisResults: AnalysisState): Promise<string> {
  try {
    // Generate a unique session ID
    const sessionId = nanoid();
    
    // Create the filename for this session
    const filename = `sessions/${sessionId}.json`;
    
    // Add timestamp to the data
    const dataToStore: StoredAnalysisState = {
      ...analysisResults,
      timestamp: Date.now()
    };

    // Store in Blob
    await put(filename, JSON.stringify(dataToStore), {
      access: 'public',
      addRandomSuffix: false,
      token: process.env.BLOB_READ_WRITE_TOKEN
    });

    console.log(`Successfully stored session data with ID: ${sessionId}`);
    return sessionId;
  } catch (error) {
    console.error('Error storing analysis results:', error);
    throw new Error('Failed to store analysis results');
  }
}

/**
 * Retrieves analysis results from Vercel Blob storage
 * @param sessionId The session ID to retrieve
 * @returns Promise containing the analysis results or null if not found/expired
 */
export async function getAnalysisResults(sessionId: string): Promise<AnalysisState | null> {
  try {
    if (!sessionId) {
      console.error('No session ID provided');
      return null;
    }

    // Construct the URL for the stored session
    const blobUrl = `${process.env.NEXT_PUBLIC_BLOB_BASE_URL}/sessions/${sessionId}.json`;
    console.log(`Fetching session data from: ${blobUrl}`);

    const response = await fetch(blobUrl);
    
    if (!response.ok) {
      console.error(`Failed to fetch session data: ${response.status} ${response.statusText}`);
      return null;
    }

    const data: StoredAnalysisState = await response.json();
    
    // Check if the data is expired (older than 1 hour)
    if (Date.now() - data.timestamp > 3600000) {
      console.log(`Session ${sessionId} has expired`);
      return null;
    }

    // Remove timestamp from returned data
    const { timestamp, ...analysisResults } = data;
    return analysisResults;
  } catch (error) {
    console.error('Error retrieving analysis results:', error);
    return null;
  }
}

/**
 * Validates if a session ID exists and is not expired
 * @param sessionId The session ID to validate
 * @returns Promise<boolean> indicating if the session is valid
 */
export async function isValidSession(sessionId: string): Promise<boolean> {
  try {
    const results = await getAnalysisResults(sessionId);
    return results !== null;
  } catch {
    return false;
  }
}

/**
 * Generates the full URL for accessing analysis results
 * @param baseUrl The base URL of your application
 * @param sessionId The session ID
 * @returns The complete URL with session parameter
 */
export function generateAnalysisUrl(baseUrl: string, sessionId: string): string {
  const url = new URL(baseUrl);
  url.searchParams.set('session', sessionId);
  return url.toString();
}

export async function testBlobConnection(): Promise<boolean> {
    try {
      // Try to store a small test file
      const testData = { test: 'Hello World', timestamp: Date.now() };
      const testSessionId = 'test-' + Date.now();
      
      // Store test data
      await put(`sessions/${testSessionId}.json`, JSON.stringify(testData), {
        access: 'public',
        addRandomSuffix: false,
        token: process.env.BLOB_READ_WRITE_TOKEN
      });
  
      // Try to read it back
      const response = await fetch(`${process.env.NEXT_PUBLIC_BLOB_BASE_URL}/sessions/${testSessionId}.json`);
      
      if (!response.ok) {
        console.error('Failed to fetch test data:', response.status, response.statusText);
        return false;
      }
  
      const fetchedData = await response.json();
      console.log('Test successful:', fetchedData);
      return true;
    } catch (error) {
      console.error('Blob connection test failed:', error);
      return false;
    }
  }