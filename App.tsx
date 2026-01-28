import React, { useState } from 'react';
import { Header } from './components/Header';
import { ImageInput } from './components/ImageInput';
import { ResultViewer } from './components/ResultViewer';
import { AppState, FileData } from './types';
import { generateEditedImage } from './services/geminiService';

const App: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<FileData | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (data: FileData) => {
    setSelectedImage(data);
    setResultUrl(null);
    setAppState(AppState.IDLE);
    setError(null);
  };

  const handleGenerate = async () => {
    if (!selectedImage) return;

    setAppState(AppState.GENERATING);
    setError(null);

    try {
      const generatedImageBase64 = await generateEditedImage(
        selectedImage.base64,
        selectedImage.mimeType,
        prompt
      );
      
      setResultUrl(generatedImageBase64);
      setAppState(AppState.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong during generation.");
      setAppState(AppState.ERROR);
    }
  };

  const handleDownload = () => {
    if (resultUrl) {
      const link = document.createElement('a');
      link.href = resultUrl;
      link.download = `pixelmorph-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-primary-500/10 blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[100px]" />
      </div>

      <Header />

      <main className="relative z-10 container mx-auto px-4 py-8 lg:py-12">
        <div className="mb-10 text-center">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white lg:text-5xl">
            Transform Images with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-400">AI</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-400">
            Upload an image and use natural language to edit, enhance, or completely transform it using state-of-the-art Generative AI.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="h-full">
            <ImageInput
              onImageSelect={handleImageSelect}
              selectedImage={selectedImage}
              prompt={prompt}
              onPromptChange={setPrompt}
              onGenerate={handleGenerate}
              isGenerating={appState === AppState.GENERATING}
              disabled={!selectedImage}
            />
          </div>
          
          <div className="h-full min-h-[500px]">
            <ResultViewer
              resultUrl={resultUrl}
              state={appState}
              onDownload={handleDownload}
              error={error}
            />
          </div>
        </div>
      </main>

      <footer className="relative z-10 mt-12 border-t border-slate-800 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} PixelMorph AI. Powered by Gemini.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
