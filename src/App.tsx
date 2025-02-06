import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/index";
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import CreateModule from "@/pages/CreateModule";
import ModuleCreator from "@/pages/modules/ModuleCreator";
import BuildPage from "@/pages/modules/BuildPage";
import MediaPage from "@/pages/modules/MediaPage";
import SharePage from "@/pages/modules/SharePage";
import ResultsPage from "@/pages/modules/ResultsPage";
import SummaryPage from "@/pages/modules/SummaryPage";
import CreatorDashboard from "@/pages/creator/Dashboard";
import CreatorContent from "@/pages/creator/Content";
import CreatorAnalytics from "@/pages/creator/Analytics";
import CreatorLearners from "@/pages/creator/Learners";
import CreatorSettings from "@/pages/creator/Settings";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/modules/create" element={<CreateModule />} />
        
        {/* Creator routes */}
        <Route path="/creator">
          <Route path="dashboard" element={<CreatorDashboard />} />
          <Route path="content" element={<CreatorContent />} />
          <Route path="analytics" element={<CreatorAnalytics />} />
          <Route path="learners" element={<CreatorLearners />} />
          <Route path="settings" element={<CreatorSettings />} />
        </Route>

        {/* Module creator routes */}
        <Route path="/modules/:id" element={<ModuleCreator />}>
          <Route path="build" element={<BuildPage />} />
          <Route path="media" element={<MediaPage />} />
          <Route path="share" element={<SharePage />} />
          <Route path="results" element={<ResultsPage />} />
          <Route path="summary" element={<SummaryPage />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;