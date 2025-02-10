
import { Header } from "@/components/Header";
import { CreatorSidebar } from "@/components/creator/CreatorSidebar";

export default function CreatorLearners() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <CreatorSidebar />
        <main className="flex-1">
          <div className="container py-6">
            <h1 className="text-3xl font-bold mb-6">Learners</h1>
            <div className="text-muted-foreground">
              Learner management features coming soon...
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
