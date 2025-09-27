
import React from 'react';
import { SUPPORTED_LANGUAGES } from '../constants';
import type { Language } from '../types';

interface LanguageSelectorProps {
  selectedLanguage: Language;
  onLanguageChange: (languageCode: string) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selectedLanguage, onLanguageChange }) => {
  return (
    <div>
      <label htmlFor="language" className="block text-sm font-medium text-gray-300 mb-2">
        Transcription Language
      </label>
      <select
        id="language"
        name="language"
        value={selectedLanguage.code}
        onChange={(e) => onLanguageChange(e.target.value)}
        className="block w-full bg-gray-700 border border-gray-600 rounded-lg shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};
