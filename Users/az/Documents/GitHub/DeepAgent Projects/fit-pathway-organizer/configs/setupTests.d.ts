import "@testing-library/jest-dom";
import "./__mocks__/importMeta";
declare global {
    namespace NodeJS {
        interface Global {
            window: Window;
            document: Document;
            navigator: Navigator;
        }
    }
}
declare global {
    var window: Window;
    var document: Document;
}
