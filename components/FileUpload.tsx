import React, { useState, useCallback, useEffect } from 'react';
import { UploadCloud, FileAudio, XCircle, FileVideo } from './Icons';

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileChange }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    let objectUrl: string | null = null;
    if (file) {
      objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    } else {
      setPreviewUrl(null);
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [file]);

  const handleFile = useCallback((selectedFile: File | null) => {
    if (selectedFile && (selectedFile.type.startsWith('audio/') || selectedFile.type.startsWith('video/'))) {
      setFile(selectedFile);
      onFileChange(selectedFile);
    } else {
      setFile(null);
      onFileChange(null);
      if(selectedFile) alert("Please upload a valid audio or video file.");
    }
  }, [onFileChange]);

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    } else {
      handleFile(null);
    }
  };
  
  const handleClearFile = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setFile(null);
      onFileChange(null);
      const fileInput = document.getElementById('media-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">Upload Audio or Video File</label>
      {!file ? (
         <label
          htmlFor="media-upload"
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`relative block w-full border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-300 ${isDragging ? 'border-indigo-500 bg-gray-700/50' : 'border-gray-600 hover:border-gray-500'}`}
        >
          <UploadCloud className="mx-auto h-12 w-12 text-gray-500" />
          <span className="mt-2 block text-sm font-semibold text-gray-300">
            Drag & drop an audio or video file or click to upload
          </span>
          <span className="mt-1 block text-xs text-gray-500">MP3, WAV, MP4, MOV, etc.</span>
           <input
            id="media-upload"
            name="media-upload"
            type="file"
            className="sr-only"
            accept="audio/*,video/*"
            onChange={handleChange}
          />
        </label>
      ) : (
        <div className="relative group bg-gray-700 border border-gray-600 rounded-lg p-3 space-y-3">
          {previewUrl && file.type.startsWith('video/') ? (
            <video controls src={previewUrl} className="w-full rounded-md max-h-64 object-contain bg-black">
              Your browser does not support the video tag.
            </video>
          ) : previewUrl && file.type.startsWith('audio/') ? (
            <div className="p-2">
              <audio controls src={previewUrl} className="w-full">
                Your browser does not support the audio element.
              </audio>
            </div>
          ) : null}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              {file.type.startsWith('audio/') ? (
                  <FileAudio className="h-6 w-6 text-indigo-400 flex-shrink-0" />
              ) : (
                  <FileVideo className="h-6 w-6 text-indigo-400 flex-shrink-0" />
              )}
              <span className="text-sm font-medium text-gray-200 truncate" title={file.name}>{file.name}</span>
            </div>
          </div>

          <button 
            onClick={handleClearFile} 
            aria-label="Remove file"
            className="absolute -top-3 -right-3 p-1 text-gray-400 bg-gray-800 rounded-full hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-700 focus:ring-indigo-500 z-10 opacity-0 group-hover:opacity-100"
          >
            <XCircle className="h-6 w-6" />
          </button>
        </div>
      )}
    </div>
  );
};
