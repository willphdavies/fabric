import { AuthProvider } from "./AuthProvider";
import { AppRoutes } from "./App.routes";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <AppRoutes />
      </div>
    </AuthProvider>
  );
}

export default App;
