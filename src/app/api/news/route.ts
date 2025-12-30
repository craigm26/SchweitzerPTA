import { NextResponse } from 'next/server';

// Mock data for serverless deployment
const mockNews = [
  {
    id: 1,
    title: 'Annual Fun Run Raises Record Funds for New Playground!',
    content: 'The annual Schweitzer Elementary Fun Run was a massive success this year, breaking all previous fundraising records.',
    author: 'Jane Doe',
    createdAt: '2023-10-24T10:00:00Z'
  },
  {
    id: 2,
    title: 'October PTA Meeting Minutes',
    content: 'Catch up on the budget approval, new playground plans, and volunteer opportunities for the winter season.',
    author: 'Sarah Jenkins',
    createdAt: '2023-10-20T14:00:00Z'
  },
  {
    id: 3,
    title: 'Book Fair Volunteers Needed',
    content: 'We need help setting up and running the Scholastic Book Fair next week. Sign up for a 1-hour slot!',
    author: 'Lisa Wong',
    createdAt: '2023-10-18T09:00:00Z'
  },
  {
    id: 4,
    title: 'Fall Festival Tickets Now Available',
    content: 'Purchase your tickets early for a discount! Fun, games, and food for the whole family await at our biggest fundraiser of the year.',
    author: 'Mike Ross',
    createdAt: '2023-10-15T11:00:00Z'
  }
];

export async function GET() {
  return NextResponse.json(mockNews);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newArticle = {
    id: mockNews.length + 1,
    createdAt: new Date().toISOString(),
    ...body
  };
  // In production, this would save to a database
  return NextResponse.json(newArticle);
}
