import Papa from 'papaparse';

export interface FlightData {
  'Tail Number': string;
  'Flight Number': string;
  Date: string;
  Origin: string;
  Destination: string;
  'Aircraft Type': string;
  'Gross Weight (kg)': string;
  Passengers: string;
  'Free_space(m³)': string;
  'Occupied_space(m³)': string;
  'Total_space(m³)': string;
}

export interface LuggageData {
  booking_id: string;
  flight_number: string;
  flight_date: string;
  origin: string;
  destination: string;
  passenger_name: string;
  user_email: string;
  seat_number: string;
  ticket_class: string;
  ticket_price: string;
  booking_date: string;
  'Luggage_volume (m³)': string;
}

let flightCache: FlightData[] | null = null;
let luggageCache: LuggageData[] | null = null;

export async function parseFlightData(): Promise<FlightData[]> {
  if (flightCache) {
    return flightCache;
  }

  try {
    const response = await fetch('/flights.csv?t=' + Date.now());
    if (!response.ok) {
      throw new Error('Failed to fetch flights.csv');
    }
    const csvText = await response.text();
    
    return new Promise((resolve) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          flightCache = results.data as FlightData[];
          resolve(flightCache);
        },
        error: (error) => {
          console.error('CSV parse error:', error);
          resolve([]);
        }
      });
    });
  } catch (error) {
    console.error('Error loading flights.csv:', error);
    return [];
  }
}

export async function parseLuggageData(): Promise<LuggageData[]> {
  if (luggageCache) {
    return luggageCache;
  }

  try {
    const response = await fetch('/bookings.csv?t=' + Date.now());
    if (!response.ok) {
      throw new Error('Failed to fetch bookings.csv');
    }
    const csvText = await response.text();
    
    return new Promise((resolve) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          luggageCache = results.data as LuggageData[];
          resolve(luggageCache);
        },
        error: (error) => {
          console.error('CSV parse error:', error);
          resolve([]);
        }
      });
    });
  } catch (error) {
    console.error('Error loading bookings.csv:', error);
    return [];
  }
}

export function getLuggageByFlight(luggage: LuggageData[], flightNumber: string): LuggageData[] {
  return luggage.filter((item) => item.flight_number === flightNumber);
}

export function getFlightNumber(flight: FlightData): string {
  return flight['Flight Number'];
}
