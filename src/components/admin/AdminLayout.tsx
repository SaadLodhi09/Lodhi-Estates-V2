import type { ReactNode } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Building2, Mail, LogOut, ExternalLink } from 'lucide-react';
import { signOut } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/properties', label: 'Properties', icon: Building2, end: false },
  { to: '/admin/inquiries', label: 'Inquiries', icon: Mail, end: false },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate('/admin/login', { replace: true });
  }

  return (
    <div className="flex min-h-screen bg-paper">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-mist md:flex">
        <div className="border-b border-line px-6 py-6">
          <Link to="/" className="font-display text-lg text-ink">
            Lodhi Estates
          </Link>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-widest2 text-stone">Admin</p>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-6">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 font-mono text-[11px] uppercase tracking-widest2 transition-colors',
                  isActive ? 'bg-ink text-paper' : 'text-ink/60 hover:bg-line/50 hover:text-ink'
                )
              }
            >
              <item.icon size={15} strokeWidth={1.75} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="space-y-1 border-t border-line px-3 py-4">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 font-mono text-[11px] uppercase tracking-widest2 text-ink/60 transition-colors hover:bg-line/50 hover:text-ink"
          >
            <ExternalLink size={15} strokeWidth={1.75} />
            View Site
          </a>
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 px-3 py-2.5 font-mono text-[11px] uppercase tracking-widest2 text-ink/60 transition-colors hover:bg-line/50 hover:text-ink"
          >
            <LogOut size={15} strokeWidth={1.75} />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-5xl px-6 py-10 md:px-12 md:py-14">{children}</div>
      </main>
    </div>
  );
}
