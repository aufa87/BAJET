import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import { ImageGenSettings } from '../types';

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [imageSize, setImageSize] = useState<"1K" | "2K" | "4K">("1K");
  const [generatedImg, setGeneratedImg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setGeneratedImg(null);
    
    try {
      const settings: ImageGenSettings = {
        aspectRatio: "1:1",
        size: imageSize
      };
      const result = await generateImage(prompt, settings);
      setGeneratedImg(result);
    } catch (error) {
      alert("Failed to generate image.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
      return (
        <button 
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors text-sm font-medium"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Visualize Goal
        </button>
      );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center text-white">
            <h3 className="font-bold text-lg">Visualize Your Saving Goal</h3>
            <button onClick={() => setIsOpen(false)} className="hover:text-indigo-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        
        <div className="p-6">
            <div className="mb-4">
                <label className="block text-sm font-medium text-black mb-1">What are you saving for?</label>
                <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-black"
                    placeholder="e.g., A modern white house with a garden..."
                    rows={3}
                />
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-black mb-2">Image Quality</label>
                <div className="flex gap-2">
                    {(["1K", "2K", "4K"] as const).map(size => (
                        <button
                            key={size}
                            onClick={() => setImageSize(size)}
                            className={`px-4 py-2 rounded-md text-sm font-medium border ${imageSize === size ? 'bg-indigo-50 border-indigo-600 text-indigo-700' : 'bg-white border-gray-200 text-black hover:bg-gray-50'}`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>

            {generatedImg && (
                <div className="mb-6 rounded-lg overflow-hidden border border-gray-200">
                    <img src={generatedImg} alt="Generated" className="w-full h-auto" />
                </div>
            )}

            <button
                onClick={handleGenerate}
                disabled={isLoading || !prompt}
                className={`w-full py-3 rounded-lg font-bold text-white shadow-sm transition-all ${isLoading || !prompt ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
                {isLoading ? 'Dreaming...' : 'Generate Image'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;