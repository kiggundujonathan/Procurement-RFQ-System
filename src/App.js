import AppRoutes from "./routes/AppRoutes";
import { RequestProvider } from "./context/RequestContext";

function App() {
  return (
    <RequestProvider>
      <AppRoutes />
    </RequestProvider>
  );
}

export default App;