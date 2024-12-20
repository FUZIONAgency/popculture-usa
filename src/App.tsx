import { BrowserRouter, Routes, Route, useRoutes } from "react-router-dom";
import { AppProviders } from "./providers/AppProviders";
import ScrollToTop from "./components/ScrollToTop";
import { routes } from "./routes";

const AppRoutes = () => {
  const element = useRoutes(routes);
  return element;
};

const App = () => (
  <AppProviders>
    <BrowserRouter>
      <ScrollToTop />
      <AppRoutes />
    </BrowserRouter>
  </AppProviders>
);

export default App;