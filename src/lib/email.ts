type VolunteerAcknowledgementInput = {
  volunteerEmail: string;
  volunteerName: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  shiftTitle: string;
  shiftTimeLabel: string;
};

const RESEND_API_URL = 'https://api.resend.com/emails';
const DEFAULT_REPLY_TO = 'AlbertSchweitzerPTA@gmail.com';
const DEFAULT_CC = 'AlbertSchweitzerPTA@gmail.com';

function formatEventDate(date: string) {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export async function sendVolunteerSignupAcknowledgement({
  volunteerEmail,
  volunteerName,
  eventTitle,
  eventDate,
  eventLocation,
  shiftTitle,
  shiftTimeLabel,
}: VolunteerAcknowledgementInput) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.SITE_EMAIL_FROM_VOLUNTEER_SIGNUP?.trim();
  const replyTo = process.env.SITE_EMAIL_REPLY_TO?.trim() || DEFAULT_REPLY_TO;
  const cc = process.env.SITE_EMAIL_CC?.trim() || DEFAULT_CC;

  if (!apiKey || !from) {
    throw new Error('Email configuration is missing. Set RESEND_API_KEY and SITE_EMAIL_FROM_VOLUNTEER_SIGNUP.');
  }

  const formattedDate = formatEventDate(eventDate);
  const subject = `We received your volunteer signup for ${eventTitle}`;
  const html = `
    <div style="font-family: Arial, sans-serif; color: #181411; line-height: 1.6;">
      <p>Hi ${volunteerName},</p>
      <p>Thanks for signing up to volunteer with Schweitzer Elementary PTA. We received your response.</p>
      <p><strong>Event:</strong> ${eventTitle}<br />
      <strong>Date:</strong> ${formattedDate}<br />
      <strong>Location:</strong> ${eventLocation}<br />
      <strong>Shift:</strong> ${shiftTitle}<br />
      <strong>Time:</strong> ${shiftTimeLabel}</p>
      <p>If anything changes, just reply to this email and we’ll help.</p>
      <p>Thank you,<br />Schweitzer Elementary PTA</p>
    </div>
  `;
  const text = [
    `Hi ${volunteerName},`,
    '',
    'Thanks for signing up to volunteer with Schweitzer Elementary PTA. We received your response.',
    '',
    `Event: ${eventTitle}`,
    `Date: ${formattedDate}`,
    `Location: ${eventLocation}`,
    `Shift: ${shiftTitle}`,
    `Time: ${shiftTimeLabel}`,
    '',
    'If anything changes, just reply to this email and we’ll help.',
    '',
    'Thank you,',
    'Schweitzer Elementary PTA',
  ].join('\n');

  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [volunteerEmail],
      cc: [cc],
      reply_to: [replyTo],
      subject,
      html,
      text,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Resend email failed: ${response.status} ${errorBody}`);
  }

  return response.json();
}
