import type { DetailedHTMLProps, HTMLAttributes } from "react";

// Custom elements registered by Givebutter's widget script.

type GivebutterElement<Extra> = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> &
  Extra;

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "givebutter-button": GivebutterElement<{
        campaign: string;
        account?: string;
        type?: "modal" | "link";
        label?: string;
        "hide-button"?: "true";
      }>;
    }
  }
}
