import { useRef, useState } from 'react';
import { UploadCloud, File as FileIcon, X, AlertCircle } from 'lucide-react';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const ALLOWED_EXT = ['jpg', 'jpeg', 'png', 'pdf', 'docx'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FileUpload({ files, onChange }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');

  function validateAndAdd(fileList) {
    const incoming = Array.from(fileList);
    const accepted = [];
    let rejectionReason = '';

    incoming.forEach((file) => {
      const ext = file.name.split('.').pop()?.toLowerCase();
      const typeOk = ALLOWED_TYPES.includes(file.type) || ALLOWED_EXT.includes(ext);
      const sizeOk = file.size <= MAX_SIZE_BYTES;

      if (!typeOk) {
        rejectionReason = `${file.name}: unsupported file type. Use JPG, PNG, PDF or DOCX.`;
        return;
      }
      if (!sizeOk) {
        rejectionReason = `${file.name}: exceeds the 5 MB limit.`;
        return;
      }
      accepted.push(file);
    });

    setError(rejectionReason);
    if (accepted.length) {
      onChange([...files, ...accepted]);
    }
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files?.length) {
      validateAndAdd(event.dataTransfer.files);
    }
  }

  function removeFile(index) {
    const next = files.filter((_, i) => i !== index);
    onChange(next);
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors
          ${isDragging ? 'border-brand-500 bg-brand-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'}`}
      >
        <UploadCloud className="h-8 w-8 text-brand-500" />
        <p className="text-sm text-slate-600">
          <span className="font-semibold text-brand-600">Drag &amp; Drop files here</span> or{' '}
          <span className="font-semibold text-brand-600 underline">Browse</span>
        </p>
        <p className="text-xs text-slate-400">JPG, PNG, PDF, DOCX &middot; Max 5 MB per file</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          accept=".jpg,.jpeg,.png,.pdf,.docx"
          onChange={(e) => {
            if (e.target.files?.length) validateAndAdd(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      {error && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-red-600">
          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
          {error}
        </p>
      )}

      {files.length > 0 && (
        <ul className="mt-3 space-y-2">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2"
            >
              <div className="flex min-w-0 items-center gap-2">
                <FileIcon className="h-4 w-4 flex-shrink-0 text-slate-400" />
                <span className="truncate text-sm text-slate-700">{file.name}</span>
                <span className="flex-shrink-0 text-xs text-slate-400">
                  ({formatSize(file.size)})
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="ml-2 flex-shrink-0 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-red-500"
                aria-label={`Remove ${file.name}`}
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
