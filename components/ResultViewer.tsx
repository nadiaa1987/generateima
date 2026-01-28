import React from 'react';
import { AppState } from '../types';

interface ResultViewerProps {
  resultUrl: string | null;
  state: AppState;
  onDownload: () => void;
  error?: string | null;
}

export const ResultViewer: React.FC<ResultViewerProps> = ({ resultUrl, state, onDownload, error }) => {
  if (state === AppState.ERROR && error) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-red-900/50 bg-red-950/10 p-12 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-900/20 text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008h-.008v-.008z" />
          </svg>
        </div>
        <h3 className="mb-2 text-xl font-bold text-red-500">Generation Failed</h3>
        <p className="max-w-md text-slate-400">{error}</p>
      </div>
    );
  }

  if (!resultUrl && state !== AppState.GENERATING) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/50 p-12 text-center">
        <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-slate-800/50 shadow-inner">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="h-12 w-12 text-slate-600">
             <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
           </svg>
        </div>
        <h3 className="mb-2 text-xl font-bold text-white">Ready to Generate</h3>
        <p className="max-w-xs text-slate-400">Upload an image and provide a prompt to see the magic happen.</p>
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col gap-6 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl">
      <div className="flex items-center justify-between">
         <h2 className="text-xl font-semibold text-white">Result</h2>
         {state === AppState.SUCCESS && (
            <span className="inline-flex items-center rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-500 ring-1 ring-inset ring-green-500/20">
              Completed
            </span>
         )}
      </div>

      <div className="relative flex-1 overflow-hidden rounded-xl bg-slate-950 flex items-center justify-center min-h-[400px]">
        {state === AppState.GENERATING ? (
          <div className="flex flex-col items-center gap-4">
             <div className="relative flex h-24 w-24 items-center justify-center">
                <div className="absolute h-full w-full animate-ping rounded-full bg-primary-500/20"></div>
                <div className="absolute h-16 w-16 animate-pulse rounded-full bg-primary-500/40"></div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="relative z-10 h-8 w-8 animate-spin text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
             </div>
             <p className="animate-pulse font-medium text-primary-400">Dreaming up your image...</p>
          </div>
        ) : (
          <div className="relative h-full w-full group">
            <img 
                src={resultUrl || ''} 
                alt="Generated Result" 
                className="h-full w-full object-contain"
            />
            {/* Overlay actions */}
            <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
               <button 
                  onClick={() => window.open(resultUrl || '', '_blank')}
                  className="rounded-lg bg-black/60 p-2 text-white backdrop-blur-md hover:bg-black/80"
                  title="Open full size"
               >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                  </svg>
               </button>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={onDownload}
        disabled={!resultUrl || state === AppState.GENERATING}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 py-4 text-sm font-semibold text-white transition-all hover:bg-slate-700 disabled:opacity-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        Download Image
      </button>
    </div>
  );
};
