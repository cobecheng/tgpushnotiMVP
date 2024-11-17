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
      sendData: (data: string) => void; // Add sendData to the WebApp interface
    };
  };
}
