import { z } from 'zod';

export const inquirySchema = z.object({
  name: z.string().trim().min(2, 'Enter your full name').max(120),
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
  phone: z.string().trim().min(6, 'Enter a valid phone number').max(30),
  interest: z.enum(['buy', 'sell', 'viewing', 'general']),
  message: z.string().trim().min(10, 'Tell us a little more (10 characters minimum)').max(2000),
  // Honeypot: real users never see or fill this field (hidden via CSS).
  // A bot that fills every field on the form will fill this too. We don't
  // want Zod to *reject* the submission here (that would show the bot an
  // error, telling it something to fix) — we just read this value after a
  // successful parse and silently drop the submission if it's non-empty.
  website: z.string().optional(),
});

export type InquiryFormValues = z.infer<typeof inquirySchema>;
