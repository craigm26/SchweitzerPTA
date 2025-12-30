import { NextResponse } from 'next/server';
import db from '@/utils/db';

export async function GET() {
  const sponsors = await new Promise((resolve, reject) => {
    db.all('SELECT * FROM sponsors', (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
  return NextResponse.json(sponsors);
}

export async function POST(request: Request) {
  const { name, website, level, logo } = await request.json();
  const result = await new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO sponsors (name, website, level, logo) VALUES (?, ?, ?, ?)',
      [name, website, level, logo],
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
