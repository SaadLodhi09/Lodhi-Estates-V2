import type { FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { useSubmitInquiry } from '@/hooks/useInquiries';
import type { Property } from '@/types/property';

const inputClasses =
  'w-full border-b border-line bg-transparent py-3 text-ink outline-none transition-colors placeholder:text-stone/70 focus:border-ink';

interface ContactFormProps {
  /** When arriving from a property detail page's "Inquire" link, pins the inquiry to that listing. */
  property?: Property | null;
}

export function ContactForm({ property }: ContactFormProps) {
  const { mutate, isPending, isSuccess, isError, reset } = useSubmitInquiry();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    mutate({
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      phone: String(data.get('phone') ?? ''),
      interest: String(data.get('interest') ?? ''),
      message: String(data.get('message') ?? ''),
      propertyId: property?.id ?? null,
    });
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="border border-line bg-mist px-8 py-14 text-center"
      >
        <span className="font-mono text-[11px] uppercase tracking-widest2 text-moss">Received</span>
        <h3 className="mt-4 font-display text-2xl text-ink">We&rsquo;ll be in touch shortly.</h3>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-ink/65">
          A member of the team will reply within one business day to arrange a viewing or answer
          your question directly.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Eyebrow>Send an Inquiry</Eyebrow>

      {property && (
        <div className="border border-line bg-mist px-4 py-3 font-mono text-[11px] uppercase tracking-widest2 text-ink/70">
          Re: {property.refCode} — {property.name}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="font-mono text-[11px] uppercase tracking-widest2 text-stone">
            Full Name
          </label>
          <input id="name" name="name" type="text" required placeholder="Ayesha Khan" className={`${inputClasses} mt-2`} />
        </div>
        <div>
          <label htmlFor="phone" className="font-mono text-[11px] uppercase tracking-widest2 text-stone">
            Phone
          </label>
          <input id="phone" name="phone" type="tel" required placeholder="+92 300 0000000" className={`${inputClasses} mt-2`} />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="font-mono text-[11px] uppercase tracking-widest2 text-stone">
          Email
        </label>
        <input id="email" name="email" type="email" required placeholder="you@email.com" className={`${inputClasses} mt-2`} />
      </div>

      <div>
        <label htmlFor="interest" className="font-mono text-[11px] uppercase tracking-widest2 text-stone">
          I&rsquo;m Looking To
        </label>
        <select
          id="interest"
          name="interest"
          defaultValue={property ? 'viewing' : 'buy'}
          className={`${inputClasses} mt-2`}
        >
          <option value="buy">Buy a Residence</option>
          <option value="sell">Have My Property Represented</option>
          <option value="viewing">Book a Specific Viewing</option>
          <option value="general">General Inquiry</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="font-mono text-[11px] uppercase tracking-widest2 text-stone">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          defaultValue={property ? `I'd like to arrange a viewing of ${property.name} (${property.refCode}).` : undefined}
          placeholder="Tell us what you're looking for — city, budget range, timeline."
          className={`${inputClasses} mt-2 resize-none`}
        />
      </div>

      {isError && (
        <div className="flex items-start gap-3 border border-brass/40 bg-brass/10 px-4 py-3 text-sm text-ink/80">
          <AlertCircle size={16} className="mt-0.5 shrink-0 text-brass" />
          <p>
            Something went wrong sending that — please try again, or reach us directly at{' '}
            <a href="mailto:hello@lodhiestates.com" className="underline">
              hello@lodhiestates.com
            </a>
            .{' '}
            <button type="button" onClick={() => reset()} className="underline">
              Dismiss
            </button>
          </p>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div key={String(isPending)}>
          <Button type="submit" disabled={isPending} className="w-full justify-center md:w-fit">
            {isPending ? 'Sending…' : 'Send Inquiry'}
          </Button>
        </motion.div>
      </AnimatePresence>
    </form>
  );
}
