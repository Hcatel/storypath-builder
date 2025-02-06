
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import CreateModule from "./pages/CreateModule";
import ModuleCreator from "./pages/modules/ModuleCreator";
import MediaPage from "./pages/modules/MediaPage";
import SummaryPage from "./pages/modules/SummaryPage";
import SharePage from "./pages/modules/SharePage";
import ResultsPage from "./pages/modules/ResultsPage";
import BuildPage from "./pages/modules/BuildPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/modules/create" element={<CreateModule />} />
            <Route path="/modules/:id" element={<ModuleCreator />}>
              <Route path="summary" element={<SummaryPage />} />
              <Route path="build" element={<BuildPage />} />
              <Route path="media" element={<MediaPage />} />
              <Route path="share" element={<SharePage />} />
              <Route path="results" element={<ResultsPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
