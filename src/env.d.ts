/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_API_KEY: string
  readonly VITE_HUGGINGFACE_API_KEY: string
  readonly VITE_OLLAMA_HOST?: string
  readonly VITE_SENTIMENT_ENGINE: 'google' | 'huggingface' | 'ollama' | 'fallback'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 