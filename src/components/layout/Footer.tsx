import { Link } from 'react-router-dom';
import { Container } from './Container';
import { navLinks, officeLocations } from '@/data/content';

export function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <Container className="py-20">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="font-display text-2xl">
              Lodhi Estates
            </Link>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-paper/60">
              A small collection of private residences across Lahore, Islamabad, and Karachi —
              represented by referral, not listing.
            </p>
          </div>

          <div>
            <span className="font-mono text-[11px] uppercase tracking-widest2 text-paper/40">Site</span>
            <ul className="mt-5 space-y-3">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-paper/75 transition-colors hover:text-paper">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="font-mono text-[11px] uppercase tracking-widest2 text-paper/40">Offices</span>
            <ul className="mt-5 space-y-3">
              {officeLocations.map((office) => (
                <li key={office.city} className="text-sm text-paper/75">
                  {office.city}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="font-mono text-[11px] uppercase tracking-widest2 text-paper/40">Contact</span>
            <ul className="mt-5 space-y-3 text-sm text-paper/75">
              <li>hello@lodhiestates.com</li>
              <li>{officeLocations[0].phone}</li>
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-paper/15 pt-8 font-mono text-[11px] uppercase tracking-widest2 text-paper/40 md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} Lodhi Estates. All rights reserved.</span>
          <span>Lahore — Islamabad — Karachi</span>
        </div>
      </Container>
    </footer>
  );
}
