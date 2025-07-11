import { NextResponse } from 'next/server';
import qs from 'qs';

const PHONEPE_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.phonepe.com/apis/identity-manager'
  : 'https://api-preprod.phonepe.com/apis/pg-sandbox';

let accessToken: string = '';
let tokenExpiry: number = 0;


export async function POST() {
  try {
    const currentTime = Math.floor(Date.now() / 1000);
    
    // Return cached token if still valid
    if (accessToken && currentTime < tokenExpiry) {
      return NextResponse.json({ accessToken });
    }

    const data = qs.stringify({
      client_id: process.env.PHONEPE_CLIENT_ID,
      client_secret: process.env.PHONEPE_CLIENT_SECRET,
      client_version: process.env.NODE_ENV === 'production' ? '1' : '1', // Use your prod version
      grant_type: 'client_credentials',
    });

    const response = await fetch(`${PHONEPE_BASE_URL}/v1/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: data,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch PhonePe auth token');
    }

    const result = await response.json();
    accessToken = result.access_token;
    tokenExpiry = currentTime + (result.expires_in || 3600) - 60; // 1 minute buffer

    return NextResponse.json({ accessToken });
  } catch (error: any) {
    console.log('Error fetching PhonePe auth token:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch PhonePe auth token' },
      { status: 500 }
    );
  }
}