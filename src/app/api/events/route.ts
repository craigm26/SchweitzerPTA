import { NextResponse } from 'next/server';

// Mock data for serverless deployment
const mockEvents = [
  {
    id: 1,
    title: 'Fall Festival',
    date: '2023-10-28',
    time: '10:00 AM - 4:00 PM',
    location: 'School Playground',
    description: 'Annual fall festival with games, food, and fun for the whole family!'
  },
  {
    id: 2,
    title: 'PTA General Meeting',
    date: '2023-11-12',
    time: '7:00 PM',
    location: 'Library',
    description: 'Monthly PTA meeting to discuss upcoming events and initiatives.'
  },
  {
    id: 3,
    title: 'Thanksgiving Feast',
    date: '2023-11-24',
    time: '11:00 AM',
    location: 'Cafeteria',
    description: 'School-wide Thanksgiving celebration with traditional dishes.'
  },
  {
    id: 4,
    title: 'Winter Concert',
    date: '2023-12-15',
    time: '6:30 PM',
    location: 'Auditorium',
    description: 'Annual winter concert featuring performances by all grade levels.'
  },
  {
    id: 5,
    title: 'Book Fair',
    date: '2023-11-06',
    time: '8:00 AM - 3:00 PM',
    location: 'Library',
    description: 'Scholastic Book Fair - great books for young readers!'
  }
];

export async function GET() {
  return NextResponse.json(mockEvents);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newEvent = {
    id: mockEvents.length + 1,
    ...body
  };
  // In production, this would save to a database
  return NextResponse.json(newEvent);
}
