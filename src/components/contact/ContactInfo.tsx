import { Eyebrow } from '@/components/ui/Eyebrow';
import { officeLocations } from '@/data/content';

export function ContactInfo() {
  return (
    <div className="space-y-12">
      <div>
        <Eyebrow>Visit an Office</Eyebrow>
        <div className="mt-6 space-y-8">
          {officeLocations.map((office) => (
            <div key={office.city} className="border-l-2 border-line pl-5">
              <span className="font-display text-xl text-ink">{office.city}</span>
              <p className="mt-1 text-sm leading-relaxed text-ink/65">{office.address}</p>
              <p className="mt-1 font-mono text-xs text-stone">{office.phone}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-line bg-mist p-6">
        <span className="font-mono text-[11px] uppercase tracking-widest2 text-stone">Response Time</span>
        <p className="mt-3 text-sm leading-relaxed text-ink/70">
          Inquiries submitted before 6pm PKT typically hear back the same business day. Viewings are
          arranged directly with the represented owner or their family.
        </p>
      </div>
    </div>
  );
}
