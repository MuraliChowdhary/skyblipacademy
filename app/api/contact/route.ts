import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, program, message } = body;

    const webhookUrl = process.env.EXCEL_WEBHOOK_URL;

    if (!webhookUrl) {
      return NextResponse.json({ error: 'Excel Webhook URL is missing in .env.local' }, { status: 500 });
    }

    const payload = {
      timestamp: new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
      name,
      email,
      phone: phone || 'N/A',
      program: program || 'General Inquiry',
      message: message || 'N/A',
    };

    // Post to Google Apps Script Webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      redirect: 'follow',
    });

    if (!response.ok) {
      throw new Error('Failed to post data to Google Sheet.');
    }

    return NextResponse.json({ success: true, message: 'Inquiry saved successfully!' });
  } catch (error) {
    console.error('Submission Error:', error);
    return NextResponse.json({ error: 'Failed to record entry.' }, { status: 500 });
  }
}