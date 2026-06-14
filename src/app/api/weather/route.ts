// src/app/api/weather/route.ts
import { NextResponse } from 'next/server';
import { getMumbaiWeather } from '@/lib/weather/openWeather';

export async function GET() {
  const weather = await getMumbaiWeather();
  if (!weather) {
    return NextResponse.json({ success: false, error: "Failed to fetch weather" }, { status: 500 });
  }
  return NextResponse.json({ success: true, weather }, { status: 200 });
}
