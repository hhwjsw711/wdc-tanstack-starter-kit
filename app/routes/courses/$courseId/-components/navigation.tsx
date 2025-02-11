import { Button } from "~/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface NavigationProps {
  prevSegment: { id: string; title: string; courseId: string } | null;
  nextSegment: { id: string; title: string; courseId: string } | null;
}

export function Navigation({ prevSegment, nextSegment }: NavigationProps) {
  return (
    <div className="flex flex-wrap gap-4 justify-between mt-6">
      {prevSegment ? (
        <Button variant="outline" asChild>
          <a
            href={`/courses/${prevSegment.courseId}/segments/${prevSegment.id}`}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous: {prevSegment.title}
          </a>
        </Button>
      ) : (
        <div></div>
      )}
      {nextSegment && (
        <Button asChild>
          <a
            href={`/courses/${nextSegment.courseId}/segments/${nextSegment.id}`}
          >
            Next: {nextSegment.title}
            <ChevronRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
      )}
    </div>
  );
}
