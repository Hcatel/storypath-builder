
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "@/pages/index";
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
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
import PlaylistDetail from "@/pages/playlists/PlaylistDetail";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* Creator routes */}
          <Route path="/creator">
            <Route path="dashboard" element={<CreatorDashboard />} />
            <Route path="content" element={<CreatorContent />} />
            <Route path="analytics" element={<CreatorAnalytics />} />
            <Route path="learners" element={<CreatorLearners />} />
            <Route path="settings" element={<CreatorSettings />} />
          </Route>

          {/* Module routes */}
          <Route path="/modules">
            {/* Create new module */}
            <Route 
              path="create/*" 
              element={
                <ModuleCreator>
                  <Routes>
                    <Route index element={<Navigate to="summary" replace />} />
                    <Route path="summary" element={<SummaryPage />} />
                    <Route path="build" element={<BuildPage />} />
                    <Route path="media" element={<MediaPage />} />
                    <Route path="share" element={<SharePage />} />
                    <Route path="results" element={<ResultsPage />} />
                  </Routes>
                </ModuleCreator>
              } 
            />
            
            {/* Edit existing module - use regex to match only valid UUIDs */}
            <Route 
              path=":id"
              element={<ModuleCreator />}
            >
              <Route index element={<Navigate to="summary" replace />} />
              <Route path="summary" element={<SummaryPage />} />
              <Route path="build" element={<BuildPage />} />
              <Route path="media" element={<MediaPage />} />
              <Route path="share" element={<SharePage />} />
              <Route path="results" element={<ResultsPage />} />
            </Route>
          </Route>

          {/* Playlist routes */}
          <Route path="/playlists/:id" element={<PlaylistDetail />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;
