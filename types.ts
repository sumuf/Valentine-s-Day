export interface GeminiResponse {
  text: string;
}

export enum AppState {
  PROPOSAL = 'PROPOSAL',
  SUCCESS = 'SUCCESS'
}

export interface LoveNoteRequest {
  partnerName: string;
  tone: 'funny' | 'romantic' | 'poetic';
}
