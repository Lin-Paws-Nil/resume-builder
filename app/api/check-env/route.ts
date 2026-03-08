// Diagnostic endpoint to check if environment variables are set
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    razorpayKeyIdExists: !!process.env.RAZORPAY_KEY_ID,
    razorpayKeySecretExists: !!process.env.RAZORPAY_KEY_SECRET,
    publicKeyIdExists: !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    appUrlExists: !!process.env.NEXT_PUBLIC_APP_URL,
    
    // Show first few characters for verification (not full keys!)
    razorpayKeyIdPrefix: process.env.RAZORPAY_KEY_ID?.substring(0, 15) + '...',
    publicKeyIdPrefix: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.substring(0, 15) + '...',
    appUrl: process.env.NEXT_PUBLIC_APP_URL,
    
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
}
