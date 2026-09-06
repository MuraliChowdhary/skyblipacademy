// src/components/lesson/content-panel.tsx
import ReactMarkdown from "react-markdown";
import { Button } from "@/src/components/ui/button";
import { ExternalLink } from "lucide-react";

export function ContentPanel({
  contentBody,
  notionUrl,
}: {
  contentBody: string | null;
  notionUrl?: string | null;
}) {
  return (
    <div className="space-y-4">
      {notionUrl && (
        <Button variant="outline" size="lg">
          <a href={notionUrl} target="_blank" rel="noopener noreferrer">
            <div className="flex">
              <ExternalLink className="mr-1.5 h-6 w-4" />
             <p>Open full notes in Notion</p>
            </div>
          </a>
        </Button>
      )}
      {contentBody ? (
        <div className="prose prose-neutral prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown>{contentBody}</ReactMarkdown>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Notes for this lesson are coming soon.</p>
      )}
    </div>
  );
}