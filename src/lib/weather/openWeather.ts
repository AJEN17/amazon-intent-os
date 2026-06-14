// src/lib/weather/openWeather.ts

export interface WeatherData {
  temp: number;
  mainCondition: string; // e.g., "Clear", "Rain", "Clouds"
  description: string; // e.g., "scattered clouds"
  iconUrl: string;
}

export async function getMumbaiWeather(): Promise<WeatherData | null> {
  const API_KEY = process.env.OPENWEATHER_API_KEY;
  if (!API_KEY) {
    console.error("OPENWEATHER_API_KEY is not defined");
    return null;
  }

  // Mumbai coordinates
  const lat = 19.0760;
  const lon = 72.8777;

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`,
      { next: { revalidate: 1800 } } // Cache for 30 minutes
    );

    if (!res.ok) {
      throw new Error(`Weather API Error: ${res.statusText}`);
    }

    const data = await res.json();
    return {
      temp: Math.round(data.main.temp),
      mainCondition: data.weather[0].main,
      description: data.weather[0].description,
      iconUrl: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
    };
  } catch (error) {
    console.error("Failed to fetch weather:", error);
    return null;
  }
}
