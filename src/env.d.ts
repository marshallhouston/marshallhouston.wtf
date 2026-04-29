/// <reference types="astro/client" />

declare module '@pagefind/default-ui' {
  interface PagefindUIOptions {
    element: string;
    showSubResults?: boolean;
    showImages?: boolean;
    resetStyles?: boolean;
  }
  export class PagefindUI {
    constructor(options: PagefindUIOptions);
  }
}
