import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';

const inputClasses =
  'w-full border-b border-line bg-transparent py-3 text-ink outline-none transition-colors placeholder:text-stone/70 focus:border-ink';

type Status = 'idle' | 'submitting' | 'sent';

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');

    // NOTE: frontend-only placeholder. Wire this up to your inquiry
    // endpoint / CRM (e.g. fetch('/api/inquiries', { method: 'POST', ... }))
    // once a backend is in place.
    await new Promise((resolve) => setTimeout(resolve, 900));
    setStatus('sent');
  }

  if (status === 'sent') {
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
        <select id="interest" name="interest" defaultValue="buy" className={`${inputClasses} mt-2`}>
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
          placeholder="Tell us what you're looking for — city, budget range, timeline."
          className={`${inputClasses} mt-2 resize-none`}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={status}>
          <Button type="submit" disabled={status === 'submitting'} className="w-full justify-center md:w-fit">
            {status === 'submitting' ? 'Sending…' : 'Send Inquiry'}
          </Button>
        </motion.div>
      </AnimatePresence>
    </form>
  );
}
