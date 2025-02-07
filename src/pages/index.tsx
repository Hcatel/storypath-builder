
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { GalleryHorizontal, Eye } from "lucide-react";
import { useEffect } from "react";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();

  const { data: modules, isLoading } = useQuery({
    queryKey: ['modules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('modules')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Scroll to gallery if hash is present
  useEffect(() => {
    if (location.hash === '#gallery') {
      const galleryElement = document.getElementById('module-gallery');
      if (galleryElement) {
        galleryElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location.hash]);

  const handleCreateModule = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("modules")
        .insert([
          {
            title: "Untitled Module",
            description: "",
            user_id: user.id,
            nodes: [],
            edges: [],
          },
        ])
        .select()
        .single();

      if (error) throw error;
      if (!data?.id) throw new Error("No module id returned");

      navigate(`/modules/${data.id}/summary`);
    } catch (error: any) {
      console.error("Error creating module:", error);
      toast({
        title: "Error",
        description: "Failed to create module",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background font-inter">
      <Header />
      <main>
        <Hero />
        <Features />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {user && (
            <div className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Your Modules</h2>
                <Button onClick={handleCreateModule}>Create New Module</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                  [...Array(3)].map((_, i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <Skeleton className="h-6 w-3/4 mb-4" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  ))
                ) : modules?.filter(m => m.user_id === user.id)?.length ? (
                  modules
                    .filter(m => m.user_id === user.id)
                    .map((module) => (
                      <div 
                        key={module.id} 
                        className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
                      >
                        <h3 className="text-lg font-semibold mb-2">{module.title}</h3>
                        <p className="text-sm text-gray-600 mb-4">{module.description}</p>
                        <div className="flex justify-end">
                          <Link to={`/modules/${module.id}/summary`}>
                            <Button variant="outline">View Module</Button>
                          </Link>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500">No modules found. Create your first one!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Public Modules Gallery */}
          <div id="module-gallery">
            <div className="flex items-center gap-2 mb-6">
              <GalleryHorizontal className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Module Gallery</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="border rounded-lg p-4">
                    <Skeleton className="h-40 w-full mb-4" />
                    <Skeleton className="h-6 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                  </div>
                ))
              ) : modules?.filter(m => m.access_type === 'public' && m.published)?.length ? (
                modules
                  .filter(m => m.access_type === 'public' && m.published)
                  .map((module) => (
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
