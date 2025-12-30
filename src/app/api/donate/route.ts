import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// TODO: Replace with your actual Stripe secret key
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-06-20' as any,
  })
  : null;

export async function POST(request: Request) {
  if (!stripe) {
    return NextResponse.json(
      { error: { message: 'Stripe Secret Key is missing' } },
      { status: 500 }
    );
  }

  const { amount } = await request.json();

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'PTA Donation',
            },
            unit_amount: amount * 100, // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/?success=true`,
      cancel_url: `${request.headers.get('origin')}/?canceled=true`,
    });

    return NextResponse.json({ id: session.id });
  } catch (err: any) {
    return NextResponse.json({ error: { message: err.message } }, { status: 500 });
  }
}
