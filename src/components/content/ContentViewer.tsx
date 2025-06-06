import Image from 'next/image';
import type { ContentItem } from '@/types';
import { VideoPlayer } from '@/components/common/VideoPlayer';

interface ContentViewerProps {
  item: ContentItem;
}

export function ContentViewer({ item }: ContentViewerProps) {
  switch (item.type) {
    case 'text':
      return <p className="text-foreground/90 leading-relaxed my-4 whitespace-pre-wrap">{item.value}</p>;
    case 'image':
      return (
        <div className="my-6">
          <Image
            src={item.value}
            alt={item.altText || "Content image"}
            width={800}
            height={450}
            className="rounded-lg shadow-md object-contain mx-auto"
            data-ai-hint={item.dataAiHint}
          />
        </div>
      );
    case 'video':
      return (
        <div className="my-6">
          <VideoPlayer src={item.value} title="Module video" />
        </div>
      );
    default:
      return <p className="text-destructive">Unsupported content type</p>;
  }
}
