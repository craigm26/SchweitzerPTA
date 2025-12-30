import { NextResponse } from 'next/server';

// Mock data for serverless deployment
const mockSponsors = [
  {
    id: 1,
    name: 'Tech Solutions Inc.',
    website: 'https://techsolutions.example.com',
    level: 'Gold',
    logo: '🏢'
  },
  {
    id: 2,
    name: 'Main Street Pizza',
    website: 'https://mainstreetpizza.example.com',
    level: 'Gold',
    logo: '🍕'
  },
  {
    id: 3,
    name: 'First National Bank',
    website: 'https://fnb.example.com',
    level: 'Gold',
    logo: '🏦'
  },
  {
    id: 4,
    name: 'Schweitzer Realty Group',
    website: 'https://schweitzerrealty.example.com',
    level: 'Silver',
    logo: '🏠'
  },
  {
    id: 5,
    name: 'Local Market',
    website: 'https://localmarket.example.com',
    level: 'Silver',
    logo: '🛒'
  },
  {
    id: 6,
    name: 'The Diner',
    website: 'https://thediner.example.com',
    level: 'Bronze',
    logo: '🍽️'
  }
];

export async function GET() {
  return NextResponse.json(mockSponsors);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newSponsor = {
    id: mockSponsors.length + 1,
    ...body
  };
  // In production, this would save to a database
  return NextResponse.json(newSponsor);
}
