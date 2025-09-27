import React, { useState } from 'react';
import { Clipboard, Check, RefreshCw, Download } from './Icons';
import { Loader } from './Loader';

interface ResultDisplayProps {
  transcript: string;
  caption: string;
  hashtags: string[];
  youtube_title: string;
  isRegenerating: boolean;
  onRegenerate: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ transcript, caption, hashtags, youtube_title, isRegenerating, onRegenerate }) => {
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedTranscript, setCopiedTranscript] = useState(false);
  const [copiedYoutubeTitle, setCopiedYoutubeTitle] = useState(false);
  
  const fullCaption = `${caption}\n\n${hashtags.join(' ')}`;

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(fullCaption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  const handleCopyTranscript = () => {
    navigator.clipboard.writeText(transcript);
    setCopiedTranscript(true);
    setTimeout(() => setCopiedTranscript(false), 2000);
  };

  const handleCopyYoutubeTitle = () => {
    navigator.clipboard.writeText(youtube_title);
    setCopiedYoutubeTitle(true);
    setTimeout(() => setCopiedYoutubeTitle(false), 2000);
  };

  const handleExportTranscript = () => {
    const blob = new Blob([transcript], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'transcript.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg animate-fade-in">
      <div>
        <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-200">Full Transcript</h3>
            <div className="flex items-center gap-2">
              <button
                  onClick={handleCopyTranscript}
                  className="flex items-center px-3 py-1.5 text-sm font-medium bg-gray-700 hover:bg-gray-600 rounded-md transition-colors text-gray-300"
              >
                  {copiedTranscript ? <Check className="w-4 h-4 mr-2 text-green-400" /> : <Clipboard className="w-4 h-4 mr-2" />}
                  {copiedTranscript ? 'Copied!' : 'Copy'}
              </button>
              <button
                  onClick={handleExportTranscript}
                  className="flex items-center px-3 py-1.5 text-sm font-medium bg-gray-700 hover:bg-gray-600 rounded-md transition-colors text-gray-300"
              >
                  <Download className="w-4 h-4 mr-2" />
                  Export
              </button>
            </div>
        </div>
        <div className="w-full h-40 bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-sm text-gray-300 overflow-y-auto">
          {transcript}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-200">YouTube Title</h3>
          <button
            onClick={handleCopyYoutubeTitle}
            className="flex items-center px-3 py-1.5 text-sm font-medium bg-gray-700 hover:bg-gray-600 rounded-md transition-colors text-gray-300"
          >
            {copiedYoutubeTitle ? <Check className="w-4 h-4 mr-2 text-green-400" /> : <Clipboard className="w-4 h-4 mr-2" />}
            {copiedYoutubeTitle ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-sm text-gray-300">
          <p>{youtube_title}</p>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2 gap-2">
            <h3 className="text-lg font-semibold text-gray-200">Social Media Caption & Hashtags</h3>
            <div className="flex items-center gap-2">
                <button
                    onClick={onRegenerate}
                    disabled={isRegenerating}
                    className="flex items-center px-3 py-1.5 text-sm font-medium bg-gray-700 hover:bg-gray-600 rounded-md transition-colors text-gray-300 disabled:bg-gray-600/50 disabled:cursor-not-allowed"
                >
                    {isRegenerating ? <Loader /> : <RefreshCw className="w-4 h-4 mr-2" />}
                    {isRegenerating ? 'Regenerating...' : 'Regenerate'}
                </button>
                <button
                    onClick={handleCopyCaption}
                    className="flex items-center px-3 py-1.5 text-sm font-medium bg-gray-700 hover:bg-gray-600 rounded-md transition-colors text-gray-300"
                >
                    {copiedCaption ? <Check className="w-4 h-4 mr-2 text-green-400" /> : <Clipboard className="w-4 h-4 mr-2" />}
                    {copiedCaption ? 'Copied!' : 'Copy'}
                </button>
            </div>
        </div>
        <div className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-sm text-gray-300">
          <p className="whitespace-pre-wrap">{caption}</p>
          <p className="mt-4 text-indigo-400 font-medium whitespace-pre-wrap">{hashtags.join(' ')}</p>
        </div>
      </div>
    </div>
  );
};

// Add this to your index.html's <style> tag or a global CSS file if you prefer
/*
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
}
*/
// Note: Since we can't add CSS files, I will use tailwind.config.js to extend animations, but for this context I'll just rely on the existing setup. A simple fade-in can be done with class transitions on mount, but this is simpler. Let's assume the user can add keyframes if needed. The component will work visually without it.