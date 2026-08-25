import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { GalleryUploadField } from '@/components/admin/GalleryUploadField';
import { Button } from '@/components/ui/Button';
import { useProperty, useCreateProperty, useUpdateProperty } from '@/hooks/useProperties';
import type { PropertyFormInput } from '@/lib/api/properties';
import type { Property } from '@/types/property';

const emptyForm: PropertyFormInput = {
  refCode: '',
  name: '',
  location: '',
  coordinates: '',
  type: 'Residence',
  status: 'Available',
  price: 0,
  areaSqft: 0,
  bedrooms: 0,
  bathrooms: 0,
  yearBuilt: new Date().getFullYear(),
  architect: '',
  description: '',
  imageUrl: '',
  galleryUrls: [],
  featured: false,
};

function toFormInput(property: Property): PropertyFormInput {
  return {
    refCode: property.refCode,
    name: property.name,
    location: property.location,
    coordinates: property.coordinates,
    type: property.type,
    status: property.status,
    price: property.price,
    areaSqft: property.areaSqft,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    yearBuilt: property.yearBuilt,
    architect: property.architect,
    description: property.description,
    imageUrl: property.image,
    galleryUrls: property.gallery,
    featured: property.featured ?? false,
  };
}

const inputClasses =
  'w-full border-b border-line bg-transparent py-2.5 text-ink outline-none transition-colors focus:border-ink';
const labelClasses = 'font-mono text-[11px] uppercase tracking-widest2 text-stone';

export default function AdminPropertyEditor({ mode }: { mode: 'new' | 'edit' }) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: existing, isLoading } = useProperty(mode === 'edit' ? id : undefined);
  const createMutation = useCreateProperty();
  const updateMutation = useUpdateProperty();

  const [form, setForm] = useState<PropertyFormInput>(emptyForm);
  const [error, setError] = useState('');

  useEffect(() => {
    if (mode === 'edit' && existing) {
      setForm(toFormInput(existing));
    }
  }, [mode, existing]);

  function set<K extends keyof PropertyFormInput>(key: K, value: PropertyFormInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    try {
      if (mode === 'edit' && id) {
        await updateMutation.mutateAsync({ id, input: form });
      } else {
        await createMutation.mutateAsync(form);
      }
      navigate('/admin/properties');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong saving this listing.');
    }
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;

  if (mode === 'edit' && isLoading) {
    return (
      <AdminLayout>
        <p className="text-sm text-stone">Loading…</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Link
        to="/admin/properties"
        className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest2 text-stone hover:text-ink"
      >
        <ArrowLeft size={13} /> Properties
      </Link>

      <h1 className="mt-4 font-display text-3xl text-ink">
        {mode === 'edit' ? 'Edit Listing' : 'New Listing'}
      </h1>

      <form onSubmit={handleSubmit} className="mt-10 max-w-2xl space-y-10">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Field label="Reference Code">
            <input
              required
              value={form.refCode}
              onChange={(e) => set('refCode', e.target.value)}
              placeholder="LE-042"
              className={inputClasses}
            />
          </Field>
          <Field label="Name">
            <input
              required
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="The Khayaban House"
              className={inputClasses}
            />
          </Field>
          <Field label="Location">
            <input
              required
              value={form.location}
              onChange={(e) => set('location', e.target.value)}
              placeholder="DHA Phase 6, Lahore"
              className={inputClasses}
            />
          </Field>
          <Field label="Coordinates">
            <input
              value={form.coordinates}
              onChange={(e) => set('coordinates', e.target.value)}
              placeholder="31.4697° N, 74.4142° E"
              className={inputClasses}
            />
          </Field>

          <Field label="Type">
            <select
              value={form.type}
              onChange={(e) => set('type', e.target.value as PropertyFormInput['type'])}
              className={inputClasses}
            >
              <option value="Villa">Villa</option>
              <option value="Residence">Residence</option>
              <option value="Penthouse">Penthouse</option>
              <option value="Estate">Estate</option>
            </select>
          </Field>
          <Field label="Status">
            <select
              value={form.status}
              onChange={(e) => set('status', e.target.value as PropertyFormInput['status'])}
              className={inputClasses}
            >
              <option value="Available">Available</option>
              <option value="Under Offer">Under Offer</option>
              <option value="Reserved">Reserved</option>
            </select>
          </Field>

          <Field label="Price (PKR)">
            <input
              required
              type="number"
              min={0}
              value={form.price || ''}
              onChange={(e) => set('price', Number(e.target.value))}
              placeholder="285000000"
              className={inputClasses}
            />
          </Field>
          <Field label="Area (sqft)">
            <input
              required
              type="number"
              min={0}
              value={form.areaSqft || ''}
              onChange={(e) => set('areaSqft', Number(e.target.value))}
              className={inputClasses}
            />
          </Field>
          <Field label="Bedrooms">
            <input
              required
              type="number"
              min={0}
              value={form.bedrooms || ''}
              onChange={(e) => set('bedrooms', Number(e.target.value))}
              className={inputClasses}
            />
          </Field>
          <Field label="Bathrooms">
            <input
              required
              type="number"
              min={0}
              value={form.bathrooms || ''}
              onChange={(e) => set('bathrooms', Number(e.target.value))}
              className={inputClasses}
            />
          </Field>
          <Field label="Year Built">
            <input
              type="number"
              value={form.yearBuilt || ''}
              onChange={(e) => set('yearBuilt', Number(e.target.value))}
              className={inputClasses}
            />
          </Field>
          <Field label="Architect">
            <input
              value={form.architect}
              onChange={(e) => set('architect', e.target.value)}
              className={inputClasses}
            />
          </Field>
        </div>

        <Field label="Description">
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            className={`${inputClasses} resize-none`}
          />
        </Field>

        <ImageUploadField label="Primary Image" value={form.imageUrl} onChange={(url) => set('imageUrl', url)} />
        <GalleryUploadField
          label="Gallery"
          value={form.galleryUrls}
          onChange={(urls) => set('galleryUrls', urls)}
        />

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => set('featured', e.target.checked)}
            className="h-4 w-4 accent-moss"
          />
          <span className={labelClasses}>Feature on Homepage</span>
        </label>

        {error && (
          <div className="flex items-start gap-3 border border-brass/40 bg-brass/10 px-4 py-3 text-sm text-ink/80">
            <AlertCircle size={16} className="mt-0.5 shrink-0 text-brass" />
            <p>{error}</p>
          </div>
        )}

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={isSaving} icon={false}>
            {isSaving ? 'Saving…' : mode === 'edit' ? 'Save Changes' : 'Create Listing'}
          </Button>
        </div>
      </form>
    </AdminLayout>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className={labelClasses}>{label}</label>
      <div className="mt-2">{children}</div>
    </div>
  );
}
