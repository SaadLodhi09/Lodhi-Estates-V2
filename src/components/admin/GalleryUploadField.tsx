import { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { uploadPropertyImage } from '@/lib/api/properties';

interface GalleryUploadFieldProps {
  label: string;
  value: string[];
  onChange: (urls: string[]) => void;
}

export function GalleryUploadField({ label, value, onChange }: GalleryUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFiles(files: FileList) {
    setUploading(true);
    setError('');
    try {
      const uploads = await Promise.all(Array.from(files).map((file) => uploadPropertyImage(file)));
      onChange([...value, ...uploads]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
    }
  }

  function removeAt(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div>
      <label className="font-mono text-[11px] uppercase tracking-widest2 text-stone">{label}</label>

      <div className="mt-2 grid grid-cols-4 gap-3 sm:grid-cols-5">
        {value.map((url, i) => (
          <div key={url} className="group relative aspect-square overflow-hidden bg-mist">
            <img src={url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute right-1 top-1 bg-ink/70 p-1 text-paper opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X size={12} />
            </button>
          </div>
        ))}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) void handleFiles(e.target.files);
            e.target.value = '';
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex aspect-square flex-col items-center justify-center gap-1 border border-dashed border-line text-stone transition-colors hover:border-ink hover:text-ink disabled:opacity-50"
        >
          <Upload size={16} />
          <span className="font-mono text-[9px] uppercase tracking-widest2">
            {uploading ? '…' : 'Add'}
          </span>
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
