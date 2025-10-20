import "@testing-library/jest-dom";

import "./__mocks__/importMeta";

// Setup DOM environment for testing
declare global {
  namespace NodeJS {
    interface Global {
      window: Window;
      document: Document;
      navigator: Navigator;
    }
  }
}

global.window = window;
global.document = document;
global.navigator = { userAgent: 'node.js' } as Navigator;

// Setup DOM environment for testing
declare global {
  // Ensure global.window and global.document are correctly typed for tests
  var window: Window;
  var document: Document;
}

global.window = window;
global.document = document;