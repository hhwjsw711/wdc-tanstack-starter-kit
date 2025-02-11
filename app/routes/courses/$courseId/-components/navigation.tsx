import { Button } from "~/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface NavigationProps {
  prevSegment: { id: string; title: string; courseId: string } | null;
  nextSegment: { id: string; title: string; courseId: string } | null;
}

export function Navigation({ prevSegment, nextSegment }: NavigationProps) {
  return (
    <div className="flex justify-between gap-4 mt-6">
      {prevSegment ? (
        <Button variant="outline" asChild className="flex-1 max-w-[300px]">
          <a
            href={`/courses/${prevSegment.courseId}/segments/${prevSegment.id}`}
            className="truncate"
          >
            <ChevronLeft className="mr-2 h-4 w-4 shrink-0" />
            <span className="truncate">Previous: {prevSegment.title}</span>
          </a>
        </Button>
      ) : (
        <div className="flex-1 max-w-[300px]"></div>
      )}
      {nextSegment && (
        <Button asChild className="flex-1 max-w-[300px]">
          <a
            href={`/courses/${nextSegment.courseId}/segments/${nextSegment.id}`}
            className="truncate"
          >
            <span className="truncate">Next: {nextSegment.title}</span>
            <ChevronRight className="ml-2 h-4 w-4 shrink-0" />
          </a>
        </Button>
      )}
    </div>
  );
}
