
import { Header } from "@/components/Header";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { GalleryHorizontal, Eye } from "lucide-react";

const ExplorePage = () => {
  const { data: modules, isLoading } = useQuery({
    queryKey: ['public-modules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('modules')
        .select('*')
        .eq('access_type', 'public')
        .eq('published', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background font-inter">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <GalleryHorizontal className="w-6 h-6" />
          <h1 className="text-3xl font-bold">Explore Modules</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <Skeleton className="h-40 w-full mb-4" />
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
              </div>
            ))
          ) : modules?.length ? (
            modules.map((module) => (
              <div 
                key={module.id} 
                className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white"
              >
                {module.thumbnail_url ? (
                  <img 
                    src={module.thumbnail_url} 
                    alt={module.title} 
                    className="w-full h-40 object-cover"
                  />
                ) : (
                  <div className="w-full h-40 bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
                    <GalleryHorizontal className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{module.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{module.description}</p>
                  <div className="flex justify-end">
                    <Link to={`/learn/${module.id}`}>
                      <Button>
                        <Eye className="w-4 h-4 mr-2" />
                        Start Learning
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No public modules available.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ExplorePage;
