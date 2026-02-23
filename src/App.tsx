/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Sparkles, 
  Download, 
  Image as ImageIcon, 
  Layers, 
  Maximize2, 
  Loader2, 
  ChevronDown,
  Github,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type StyleOption = 'Realistic' | 'Anime' | '3D Render' | 'Cyberpunk' | 'Oil Painting';
type AspectRatio = '1:1' | '3:4' | '4:3' | '16:9' | '9:16';

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState<StyleOption>('Realistic');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateImage = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      // Enhance prompt with style
      const enhancedPrompt = `${prompt}, in ${style} style, high quality, detailed, 8k resolution`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: enhancedPrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio,
          },
        },
      });

      let imageUrl = null;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }

      if (imageUrl) {
        setGeneratedImage(imageUrl);
      } else {
        throw new Error("No image data received from the model.");
      }
    } catch (err: any) {
      console.error("Generation error:", err);
      setError(err.message || "Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `lumina-ai-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-button flex items-center justify-center">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-display font-bold tracking-tight text-white">Lumina<span className="gradient-text">AI</span></span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Showcase</a>
            <a href="#" className="hover:text-white transition-colors">Pricing</a>
            <a href="#" className="hover:text-white transition-colors">API</a>
          </nav>

          <div className="flex items-center gap-4">
            <button className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">Log in</button>
            <button className="px-5 py-2.5 rounded-xl gradient-button text-sm font-semibold text-white">Get Started</button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12 md:py-20">
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-6"
          >
            <Zap className="w-3 h-3" /> Powered by Gemini 2.5
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-bold tracking-tight text-white mb-6"
          >
            AI Image <span className="gradient-text">Generator</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-400 max-w-2xl mx-auto"
          >
            Turn your imagination into stunning visuals in seconds. Premium quality, lightning fast, and incredibly simple.
          </motion.p>
        </div>

        {/* Generator Interface */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-3xl p-6 md:p-8 mb-12"
        >
          <div className="flex flex-col gap-6">
            {/* Prompt Input */}
            <div className="relative group">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what you want to see..."
                className="w-full h-32 md:h-40 bg-black/20 border border-white/10 rounded-2xl p-5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all resize-none text-lg"
              />
              <div className="absolute bottom-4 right-4 text-xs text-slate-500 font-mono">
                {prompt.length} characters
              </div>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Style Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Layers className="w-3 h-3" /> Style
                </label>
                <div className="relative">
                  <select 
                    value={style}
                    onChange={(e) => setStyle(e.target.value as StyleOption)}
                    className="w-full appearance-none bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
                  >
                    <option value="Realistic">Realistic</option>
                    <option value="Anime">Anime</option>
                    <option value="3D Render">3D Render</option>
                    <option value="Cyberpunk">Cyberpunk</option>
                    <option value="Oil Painting">Oil Painting</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
              </div>

              {/* Aspect Ratio Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Maximize2 className="w-3 h-3" /> Aspect Ratio
                </label>
                <div className="flex gap-2">
                  {(['1:1', '4:3', '16:9', '9:16'] as AspectRatio[]).map((ratio) => (
                    <button
                      key={ratio}
                      onClick={() => setAspectRatio(ratio)}
                      className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${
                        aspectRatio === ratio
                          ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400'
                          : 'bg-black/20 border-white/10 text-slate-400 hover:border-white/20'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <div className="flex items-end">
                <button
                  onClick={generateImage}
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full h-[50px] rounded-xl gradient-button text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Image
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center mb-8"
            >
              {error}
            </motion.div>
          )}

          {isGenerating && !generatedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 gap-4"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-500 w-6 h-6 animate-pulse" />
              </div>
              <p className="text-slate-400 font-medium animate-pulse">Crafting your masterpiece...</p>
            </motion.div>
          )}

          {generatedImage && (
            <motion.div
              key={generatedImage}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="relative group rounded-3xl overflow-hidden glass border-white/10 shadow-3xl">
                <img 
                  src={generatedImage} 
                  alt="Generated AI Art" 
                  className="w-full h-auto object-contain max-h-[70vh] mx-auto"
                />
                
                {/* Image Overlay Controls */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button 
                    onClick={downloadImage}
                    className="p-4 rounded-full bg-white text-black hover:bg-slate-200 transition-colors shadow-xl"
                    title="Download Image"
                  >
                    <Download className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                    <ImageIcon className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Generated Artwork</p>
                    <p className="text-xs text-slate-500">{style} • {aspectRatio}</p>
                  </div>
                </div>
                <button 
                  onClick={downloadImage}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-colors"
                >
                  <Download className="w-4 h-4" /> Download
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="text-indigo-500 w-5 h-5" />
              <span className="text-lg font-display font-bold text-white">Lumina AI</span>
            </div>
            <p className="text-sm text-slate-500">© 2026 Lumina AI. All rights reserved.</p>
          </div>

          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-500 hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
            <a href="#" className="text-sm text-slate-500 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm text-slate-500 hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
