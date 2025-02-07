
import { MediaUploadCard } from "@/components/media/MediaUploadCard";
import { MediaTable } from "@/components/media/MediaTable";

export default function MediaPage() {
  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      <div>
        <h2 className="text-2xl font-bold mb-2">My Media</h2>
        <p className="text-muted-foreground">
          Upload and manage your media files here. They can be used in your
          modules and playlists.
        </p>
      </div>

      <MediaUploadCard />
      <MediaTable />
    </div>
  );
}
