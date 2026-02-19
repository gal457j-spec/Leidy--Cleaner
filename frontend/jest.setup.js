require('@testing-library/jest-dom');

// mock Next.js app router hooks for tests
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), pathname: '/' }),
  useSearchParams: () => ({ get: (key) => null }),
}));

// polyfill alert
window.alert = jest.fn();
