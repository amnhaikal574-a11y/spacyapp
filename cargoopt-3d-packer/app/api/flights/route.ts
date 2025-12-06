import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'flights.csv');
    const csvText = fs.readFileSync(filePath, 'utf-8');
    
    const parsed = await new Promise((resolve) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve(results.data);
        },
      });
    });

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Error loading flights:', error);
    return NextResponse.json({ error: 'Failed to load flights' }, { status: 500 });
  }
}
