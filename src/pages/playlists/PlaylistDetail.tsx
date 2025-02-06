
import { Header } from "@/components/Header";
import { useParams } from "react-router-dom";

export default function PlaylistDetail() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Playlist Details</h1>
        {/* Playlist details and module management will go here */}
      </main>
    </div>
  );
}
