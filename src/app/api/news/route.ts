import { NextResponse } from 'next/server';
import db from '@/utils/db';

export async function GET() {
  const news = await new Promise((resolve, reject) => {
    db.all('SELECT * FROM news', (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
  return NextResponse.json(news);
}

export async function POST(request: Request) {
  const { title, content, author } = await request.json();
  const result = await new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO news (title, content, author) VALUES (?, ?, ?)',
      [title, content, author],
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
