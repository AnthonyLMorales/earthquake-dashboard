import type { EarthquakeGeoJSON } from "@/types/earthquake";

const USGS_API_URL =
  "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2025-01-01&limit=20000";

export async function fetchEarthquakes(): Promise<EarthquakeGeoJSON> {
  try {
    const response = await fetch(USGS_API_URL, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch earthquake data: ${response.statusText}`);
    }

    const data: EarthquakeGeoJSON = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching earthquake data:", error);
    throw error;
  }
}
