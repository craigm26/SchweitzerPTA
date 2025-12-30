import { NextResponse } from 'next/server';
import db from '@/utils/db';

export async function GET() {
  const events = await new Promise((resolve, reject) => {
    db.all('SELECT * FROM events', (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
  return NextResponse.json(events);
}

export async function POST(request: Request) {
  const { title, date, time, location, description } = await request.json();
  const result = await new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO events (title, date, time, location, description) VALUES (?, ?, ?, ?, ?)',
      [title, date, time, location, description],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID });
        }
      }
    );
  });
  return NextResponse.json(result);
}
