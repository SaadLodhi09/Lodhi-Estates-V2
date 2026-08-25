import { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { uploadPropertyImage } from '@/lib/api/properties';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
}

export function ImageUploadField({ label, value, onChange }: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFile(file: File) {
    setUploading(true);
    setError('');
    try {
      const url = await uploadPropertyImage(file);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="font-mono text-[11px] uppercase tracking-widest2 text-stone">{label}</label>

      <div className="mt-2 flex items-center gap-4">
        <div className="h-24 w-24 shrink-0 overflow-hidden bg-mist">
          {value && <img src={value} alt="" className="h-full w-full object-cover" />}
        </div>

        <div className="flex-1">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
              e.target.value = '';
            }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 border border-line px-4 py-2 font-mono text-[11px] uppercase tracking-widest2 text-ink/70 transition-colors hover:border-ink hover:text-ink disabled:opacity-50"
          >
            <Upload size={13} />
            {uploading ? 'Uploading…' : value ? 'Replace Image' : 'Upload Image'}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="ml-3 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-widest2 text-stone hover:text-red-600"
            >
              <X size={13} /> Remove
            </button>
          )}
          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
