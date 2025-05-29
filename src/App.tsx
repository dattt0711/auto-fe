import { BrowserRouter } from "react-router-dom";
import { QueryProvider } from "./providers/query-provider";
import { ThemeProvider } from "./contexts/ThemeContext";
import Router from "./Router";

function App() {
  return (
    <ThemeProvider>
      <QueryProvider>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </QueryProvider>
    </ThemeProvider>
  );
}

export default App;
