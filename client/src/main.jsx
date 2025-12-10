import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { TripProvider } from "./context/TripContext.jsx";

// --- REDUX IMPORTS ---
import { Provider } from "react-redux";
import { store } from "./redux/store"; // Ensure path is correct

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* Redux Provider sabse upar hona chahiye (ya Router ke andar, dono chalega) */}
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <TripProvider>
            <App />
          </TripProvider>
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
