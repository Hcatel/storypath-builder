import { CreatorSidebar } from "@/components/creator/CreatorSidebar";
import { Header } from "@/components/Header";
import { ViewToggle } from "@/components/ViewToggle";
import { LatestModuleCard } from "@/components/creator/dashboard/LatestModuleCard";
import { NestAnalyticsCard } from "@/components/creator/dashboard/NestAnalyticsCard";
import { ClassesOverviewCard } from "@/components/creator/dashboard/ClassesOverviewCard";
import { LatestCommentsCard } from "@/components/creator/dashboard/LatestCommentsCard";

export default function CreatorDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <CreatorSidebar />
        <main className="flex-1 p-8">
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">Nest Dashboard</h1>
              <ViewToggle isCreatorView={true} />
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <LatestModuleCard />
              <NestAnalyticsCard />
              <ClassesOverviewCard />
              <LatestCommentsCard />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}