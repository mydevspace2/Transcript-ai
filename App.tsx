
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { LanguageSelector } from './components/LanguageSelector';
import { ResultDisplay } from './components/ResultDisplay';
import { Loader } from './components/Loader';
import { transcribeAndGenerate, generateCaptionFromTranscript } from './services/geminiService';
import { SUPPORTED_LANGUAGES } from './constants';
import type { Language, TranscriptResult } from './types';
import { AlertTriangle } from './components/Icons';

const App: React.FC = () => {
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(SUPPORTED_LANGUAGES[0]);
  const [result, setResult] = useState<TranscriptResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (file: File | null) => {
    setMediaFile(file);
    setResult(null);
    setError(null);
  };

  const handleLanguageChange = (languageCode: string) => {
    const lang = SUPPORTED_LANGUAGES.find(l => l.code === languageCode) || SUPPORTED_LANGUAGES[0];
    setSelectedLanguage(lang);
  };

  const handleSubmit = useCallback(async () => {
    if (!mediaFile) {
      setError("Please select an audio or video file first.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const generatedResult = await transcribeAndGenerate(mediaFile, selectedLanguage);
      setResult(generatedResult);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred during processing.");
    } finally {
      setIsLoading(false);
    }
  }, [mediaFile, selectedLanguage]);
  
  const handleRegenerateCaption = useCallback(async () => {
    if (!result?.transcript) {
      setError("Cannot regenerate content without a transcript.");
      return;
    }

    setIsRegenerating(true);
    setError(null);

    try {
      const newCaptionResult = await generateCaptionFromTranscript(result.transcript, selectedLanguage);
      setResult(prevResult => prevResult ? { ...prevResult, ...newCaptionResult } : null);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred while regenerating the content.");
    } finally {
      setIsRegenerating(false);
    }
  }, [result, selectedLanguage]);


  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-3xl mx-auto">
        <Header />
        <main className="mt-8 space-y-8">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg space-y-6">
            <FileUpload onFileChange={handleFileChange} />
            <LanguageSelector selectedLanguage={selectedLanguage} onLanguageChange={handleLanguageChange} />
            <div>
              <button
                onClick={handleSubmit}
                disabled={!mediaFile || isLoading}
                className="w-full flex justify-center items-center bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
              >
                {isLoading ? (
                  <>
                    <Loader />
                    {mediaFile?.type.startsWith('video/') ? 'Processing Video...' : 'Processing Audio...'}
                  </>
                ) : (
                  'Transcribe & Generate Content'
                )}
              </button>
              {isLoading && mediaFile?.type.startsWith('video/') && (
                <p className="text-center text-sm text-gray-400 mt-3">
                  Video processing can take a few minutes for larger files. Please be patient.
                </p>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative flex items-center" role="alert">
              <AlertTriangle className="w-5 h-5 mr-3" />
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {result && !isLoading && (
            <ResultDisplay 
              transcript={result.transcript} 
              caption={result.tiktok_caption} 
              hashtags={result.hashtags}
              youtube_title={result.youtube_title}
              isRegenerating={isRegenerating}
              onRegenerate={handleRegenerateCaption}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
