
export interface Language {
  name: string;
  code: string;
}

export interface TranscriptResult {
  transcript: string;
  tiktok_caption: string;
  hashtags: string[];
  youtube_title: string;
}

export interface CaptionResult {
  tiktok_caption: string;
  hashtags: string[];
  youtube_title: string;
}
