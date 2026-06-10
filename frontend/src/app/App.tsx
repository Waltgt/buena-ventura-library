import { BrowserRouter } from "react-router-dom";
import { QueryProvider } from "./providers/QueryProvider";
import { AppRoutes } from "./routes/AppRoutes";
// import SessionGate from "@/modules/auth/ui/components/SessionGate";

function App() {
  return (
    <QueryProvider>
      <BrowserRouter basename={import.meta.env.VITE_BASE_PATH || "/"}>
        {/* Modal de renovacion de jwt de sesion */}
        {/* <SessionGate /> */}
        <AppRoutes />
      </BrowserRouter>
    </QueryProvider>
  );
}

export default App;