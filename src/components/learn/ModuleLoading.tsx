
import { Header } from "@/components/Header";
import { Skeleton } from "@/components/ui/skeleton";

export function ModuleLoading() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-4 w-full max-w-2xl mb-8" />
        <Skeleton className="h-[600px] w-full" />
      </main>
    </div>
  );
}
