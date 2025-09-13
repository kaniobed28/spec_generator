// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock react-router-dom for tests
jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    ...originalModule,
    useLocation: () => ({
      pathname: '/'
    }),
    useParams: () => ({}),
    Link: ({ children }) => <a>{children}</a>,
    BrowserRouter: ({ children }) => <div>{children}</div>
  };
});