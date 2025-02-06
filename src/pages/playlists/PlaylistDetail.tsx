
import { Header } from "@/components/Header";
import { useParams } from "react-router-dom";
import { PlaylistSidebar } from "@/components/playlist/PlaylistSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";

export default function PlaylistDetail() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SidebarProvider>
        <div className="flex w-full">
          <PlaylistSidebar playlistId={id} />
          <main className="flex-1 p-6">
            <div className="mb-6">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/creator/content?tab=playlists">Content</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Playlist Details</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <h1 className="text-3xl font-bold mb-6">Playlist Details</h1>
            {/* Playlist details and module management will go here */}
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
