
import { Header } from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GroupsTable } from "@/components/creator/groups/GroupsTable";
import { LearnersTable } from "@/components/creator/groups/LearnersTable";
import { CreatorSidebar } from "@/components/creator/CreatorSidebar";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function CreatorLearners() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <CreatorSidebar />
        <main className="flex-1">
          <div className="container py-6">
            <h1 className="text-3xl font-bold mb-6">Learners</h1>
            
            <Tabs defaultValue="groups" className="space-y-4">
              <TabsList>
                <TabsTrigger value="groups">Groups</TabsTrigger>
                <TabsTrigger value="learners">All Learners</TabsTrigger>
              </TabsList>
              
              <TabsContent value="groups" className="space-y-4">
                <div className="flex justify-end mb-4">
                  <Link to="/groups/create">
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create Group
                    </Button>
                  </Link>
                </div>
                <GroupsTable />
              </TabsContent>
              
              <TabsContent value="learners" className="space-y-4">
                <LearnersTable />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
