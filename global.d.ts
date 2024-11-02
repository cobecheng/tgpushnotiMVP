// File: global.d.ts
interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        initDataUnsafe: {
          user?: {
            id: number;
            [key: string]: any;
          };
        };
      };
    };
  }
  