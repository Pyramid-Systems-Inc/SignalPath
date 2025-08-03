import 'fabric';

declare module 'fabric' {
  namespace fabric {
    interface Object {
      data?: {
        id: string;
        // Add any other custom data you might need here
      };
    }
  }
}