
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { ViewToggle } from "@/components/ViewToggle";
import { useState } from "react";
import { ModuleSummaryDrawer } from "@/components/learn/ModuleSummaryDrawer";
import { CompletedModules } from "@/components/profile/CompletedModules";
import { SubscribedCreators } from "@/components/profile/SubscribedCreators";

const Profile = () => {
  const { user } = useAuth();
  const [selectedCompletion, setSelectedCompletion] = useState<any>(null);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background font-inter">
      <Header />
      <main className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your Profile</h1>
          <ViewToggle isCreatorView={false} />
        </div>

        <div className="grid gap-6">
          <CompletedModules onSelectCompletion={setSelectedCompletion} />
          <SubscribedCreators />
        </div>
      </main>

      <ModuleSummaryDrawer
        completion={selectedCompletion}
        open={!!selectedCompletion}
        onOpenChange={(open) => !open && setSelectedCompletion(null)}
      />
    </div>
  );
};

export default Profile;
