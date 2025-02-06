import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import Auth from "@/pages/Auth";
import Home from "@/pages/index";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import ModuleCreator from "@/pages/modules/ModuleCreator";
import CreatorDashboard from "@/pages/creator/Dashboard";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/creator/dashboard" element={<CreatorDashboard />} />
          <Route path="/modules/:moduleId/*" element={<ModuleCreator />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;