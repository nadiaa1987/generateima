export interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: number;
}

export enum AppState {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface FileData {
  file: File;
  preview: string;
  base64: string;
  mimeType: string;
}
