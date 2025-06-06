interface VideoPlayerProps {
  src: string;
  title?: string;
}

export function VideoPlayer({ src, title }: VideoPlayerProps) {
  // For a real app, consider using a more robust video player library
  // This is a placeholder for basic HTML5 video functionality
  if (src.endsWith('.mp4')) { // Basic check
    return (
      <div className="aspect-video w-full overflow-hidden rounded-lg shadow-md bg-black">
        <video controls className="w-full h-full" title={title}>
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }
  return (
    <div className="aspect-video w-full flex items-center justify-center bg-muted rounded-lg shadow-md">
      <p className="text-muted-foreground">Video content placeholder (URL: {src})</p>
    </div>
  );
}
