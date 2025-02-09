
import { Header } from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GroupsTable } from "@/components/creator/groups/GroupsTable";
import { LearnersTable } from "@/components/creator/groups/LearnersTable";

export default function CreatorLearners() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6">
        <h1 className="text-3xl font-bold mb-6">Learners</h1>
        
        <Tabs defaultValue="groups" className="space-y-4">
          <TabsList>
            <TabsTrigger value="groups">Groups</TabsTrigger>
            <TabsTrigger value="learners">All Learners</TabsTrigger>
          </TabsList>
          
          <TabsContent value="groups" className="space-y-4">
            <GroupsTable />
          </TabsContent>
          
          <TabsContent value="learners" className="space-y-4">
            <LearnersTable />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
