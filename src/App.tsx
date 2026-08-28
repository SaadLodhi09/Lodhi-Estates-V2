import { Suspense, lazy } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { RequireUser } from '@/components/account/RequireUser';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import Home from '@/pages/Home';
import Listings from '@/pages/Listings';
import PropertyDetail from '@/pages/PropertyDetail';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import SignIn from '@/pages/account/SignIn';
import SignUp from '@/pages/account/SignUp';
import AccountDashboard from '@/pages/account/Dashboard';

// Admin routes are code-split into their own chunk — public site visitors
// never download dashboard code, and it isn't in the initial bundle.
const AdminLogin = lazy(() => import('@/pages/admin/Login'));
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'));
const AdminProperties = lazy(() => import('@/pages/admin/PropertiesList'));
const AdminPropertyEditor = lazy(() => import('@/pages/admin/PropertyEditor'));
const AdminSiteContent = lazy(() => import('@/pages/admin/SiteContentEditor'));
const AdminInquiries = lazy(() => import('@/pages/admin/Inquiries'));

function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function AdminFallback() {
  return (
    <div className="flex h-screen items-center justify-center bg-paper">
      <span className="font-mono text-[11px] uppercase tracking-widest2 text-stone">Loading…</span>
    </div>
  );
}

export default function App() {
  useScrollToTop();

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/listings/:id" element={<PropertyDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/account/sign-in" element={<SignIn />} />
        <Route path="/account/sign-up" element={<SignUp />} />
        <Route
          path="/account"
          element={
            <RequireUser>
              <AccountDashboard />
            </RequireUser>
          }
        />
      </Route>

      <Route
        path="/admin/login"
        element={
          <Suspense fallback={<AdminFallback />}>
            <AdminLogin />
          </Suspense>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Suspense fallback={<AdminFallback />}>
              <AdminDashboard />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/properties"
        element={
          <ProtectedRoute>
            <Suspense fallback={<AdminFallback />}>
              <AdminProperties />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/properties/new"
        element={
          <ProtectedRoute>
            <Suspense fallback={<AdminFallback />}>
              <AdminPropertyEditor mode="new" />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/properties/:id"
        element={
          <ProtectedRoute>
            <Suspense fallback={<AdminFallback />}>
              <AdminPropertyEditor mode="edit" />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/content"
        element={
          <ProtectedRoute>
            <Suspense fallback={<AdminFallback />}>
              <AdminSiteContent />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/inquiries"
        element={
          <ProtectedRoute>
            <Suspense fallback={<AdminFallback />}>
              <AdminInquiries />
            </Suspense>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
