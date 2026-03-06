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

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

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
  const safeVolunteerName = escapeHtml(volunteerName);
  const safeEventTitle = escapeHtml(eventTitle);
  const safeEventLocation = escapeHtml(eventLocation);
  const safeShiftTitle = escapeHtml(shiftTitle);
  const safeShiftTimeLabel = escapeHtml(shiftTimeLabel);
  const safeReplyTo = escapeHtml(replyTo);
  const html = `
    <div style="margin:0; padding:24px; background:#f7f4f1; font-family: Arial, sans-serif; color:#181411; line-height:1.6;">
      <div style="max-width:640px; margin:0 auto; background:#ffffff; border:1px solid #eadfd4; border-radius:16px; overflow:hidden;">
        <div style="background:#181411; color:#ffffff; padding:24px 28px;">
          <div style="font-size:13px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:#f97316;">Schweitzer Elementary PTA</div>
          <h1 style="margin:10px 0 0; font-size:28px; line-height:1.2;">Thanks for volunteering!</h1>
        </div>
        <div style="padding:28px;">
          <p style="margin-top:0;">Hi ${safeVolunteerName},</p>
          <p>We are so grateful you signed up to help with <strong>${safeEventTitle}</strong>. Your response has been received, and we have recorded you for the shift below.</p>
          <div style="margin:24px 0; padding:20px; border:1px solid #eadfd4; border-radius:12px; background:#fcfaf8;">
            <div style="font-size:13px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:#6b5b50; margin-bottom:12px;">Signup Details</div>
            <p style="margin:6px 0;"><strong>Event:</strong> ${safeEventTitle}</p>
            <p style="margin:6px 0;"><strong>Date:</strong> ${formattedDate}</p>
            <p style="margin:6px 0;"><strong>Location:</strong> ${safeEventLocation}</p>
            <p style="margin:6px 0;"><strong>Volunteer Role:</strong> ${safeShiftTitle}</p>
            <p style="margin:6px 0;"><strong>Shift Time:</strong> ${safeShiftTimeLabel}</p>
          </div>
          <p>If anything changes or you need to update your availability, just reply to this email at <a href="mailto:${safeReplyTo}" style="color:#f97316; text-decoration:none;">${safeReplyTo}</a> and we will help.</p>
          <p style="margin-bottom:0;">Thank you again for supporting our Wildcats and school community.<br /><br />Schweitzer Elementary PTA</p>
        </div>
      </div>
    </div>
  `;
  const text = [
    `Hi ${volunteerName},`,
    '',
    `Thank you for signing up to volunteer with Schweitzer Elementary PTA for ${eventTitle}. Your response has been received.`,
    '',
    `Event: ${eventTitle}`,
    `Date: ${formattedDate}`,
    `Location: ${eventLocation}`,
    `Volunteer Role: ${shiftTitle}`,
    `Shift Time: ${shiftTimeLabel}`,
    '',
    `If anything changes, just reply to this email at ${replyTo} and we will help.`,
    '',
    'Thank you again for supporting our Wildcats and school community.',
    '',
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
