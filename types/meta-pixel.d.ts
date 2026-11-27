// The Meta Pixel's global function, defined by the inline script in MetaPixel.tsx.
// It is absent when the Pixel ID is unset, Global Privacy Control is on, or Meta is blocked.

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export {};
