import React, { useRef, useState } from 'react';
import { FileData } from '../types';

interface ImageInputProps {
  onImageSelect: (data: FileData) => void;
  selectedImage: FileData | null;
  prompt: string;
  onPromptChange: (val: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  disabled: boolean;
}

export const ImageInput: React.FC<ImageInputProps> = ({
  onImageSelect,
  selectedImage,
  prompt,
  onPromptChange,
  onGenerate,
  isGenerating,
  disabled
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect({
          file,
          preview: URL.createObjectURL(file),
          base64: reader.result as string,
          mimeType: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="flex h-full flex-col gap-6 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-white">1. Input Image</h2>
        <p className="text-sm text-slate-400">Upload the reference image you want to modify.</p>
      </div>

      <div
        className={`relative flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-300 ${
          dragActive
            ? 'border-primary-500 bg-primary-500/10'
            : 'border-slate-700 hover:border-slate-600 hover:bg-slate-800/50'
        } ${selectedImage ? 'border-solid p-0' : 'p-8'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleChange}
          disabled={isGenerating}
        />

        {selectedImage ? (
          <div className="relative h-full w-full overflow-hidden rounded-xl group">
            <img
              src={selectedImage.preview}
              alt="Preview"
              className="h-full w-full object-contain"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
               <span className="text-white font-medium bg-slate-900/80 px-4 py-2 rounded-full backdrop-blur-sm">Click to change</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
            <p className="mb-2 text-sm font-semibold text-white">Click to upload or drag and drop</p>
            <p className="text-xs text-slate-500">SVG, PNG, JPG or WEBP (MAX. 5MB)</p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-white">2. Prompt</h2>
        <p className="text-sm text-slate-400">Describe how you want to change the image.</p>
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            disabled={isGenerating}
            placeholder="E.g., Change the background to a cyberpunk city, make it sunset..."
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm text-white placeholder-slate-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:opacity-50 min-h-[120px] resize-none"
          />
          <div className="absolute bottom-3 right-3 text-xs text-slate-600">
            {prompt.length} chars
          </div>
        </div>
      </div>

      <button
        onClick={onGenerate}
        disabled={disabled || isGenerating}
        className={`group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 px-6 py-4 text-sm font-bold text-white shadow-lg transition-all hover:shadow-primary-500/25 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-50 ${isGenerating ? 'cursor-wait' : ''}`}
      >
        {isGenerating ? (
          <>
            <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Processing...</span>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5 transition-transform group-hover:scale-110">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
            <span>Generate Variation</span>
          </>
        )}
      </button>
    </div>
  );
};
