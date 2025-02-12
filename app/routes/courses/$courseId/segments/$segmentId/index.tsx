import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { z } from "zod";
import { SidebarProvider, useSidebar } from "~/components/ui/sidebar";
import { getCourseUseCase, isCourseAdminUseCase } from "~/use-cases/courses";
import { Button, buttonVariants } from "~/components/ui/button";
import { Edit, Menu } from "lucide-react";
import React from "react";
import { getSegmentUseCase } from "~/use-cases/segments";
import { getSegmentsByCourseId } from "~/data-access/segments";
import { Course, Segment } from "~/db/schema";
import { validateRequest } from "~/utils/auth";
import { MarkdownContent } from "../../-components/markdown-content";
import { Navigation } from "../../-components/navigation";
import { MobileNavigation } from "../../-components/mobile-navigation";
import { DesktopNavigation } from "../../-components/desktop-navigation";
import { VideoPlayer } from "../../-components/video-player";
import { getStorageUrl } from "~/utils/storage";

const getSegmentInfoFn = createServerFn()
  .validator(
    z.object({
      courseId: z.coerce.number(),
      segmentId: z.coerce.number(),
    })
  )
  .handler(async ({ data }) => {
    const { user } = await validateRequest();
    if (!user) {
      throw redirect({
        to: "/unauthenticated",
      });
    }

    const [course, segment, segments, isAdmin] = await Promise.all([
      getCourseUseCase(data.courseId),
      getSegmentUseCase(data.segmentId),
      getSegmentsByCourseId(data.courseId),
      isCourseAdminUseCase(user.id, data.courseId),
    ]);
    return { course, segment, segments, isAdmin };
  });

export const Route = createFileRoute("/courses/$courseId/segments/$segmentId/")(
  {
    component: RouteComponent,
    loader: async ({ params }) => {
      const { course, segment, segments, isAdmin } = await getSegmentInfoFn({
        data: {
          courseId: Number(params.courseId),
          segmentId: Number(params.segmentId),
        },
      });

      if (!segment) {
        throw redirect({
          to: "/", // TODO: redirect to a 404 page
        });
      }

      return { course, segment, segments, isAdmin };
    },
  }
);

function ViewSegment({
  course,
  segments,
  currentSegment,
  currentSegmentId,
  isAdmin,
}: {
  course: Course;
  segments: Segment[];
  currentSegment: Segment;
  currentSegmentId: number;
  isAdmin: boolean;
}) {
  const { isMobile, openMobile, setOpenMobile } = useSidebar();

  // Close mobile navigation when switching to desktop
  React.useEffect(() => {
    if (!isMobile && openMobile) {
      setOpenMobile(false);
    }
  }, [isMobile, openMobile, setOpenMobile]);

  const previousSegmentId =
    segments.findIndex((segment) => segment.id === currentSegmentId) - 1;
  const nextSegmentId =
    segments.findIndex((segment) => segment.id === currentSegmentId) + 1;

  const prevSegment =
    previousSegmentId >= 0 ? segments[previousSegmentId] : null;
  const nextSegment =
    nextSegmentId < segments.length ? segments[nextSegmentId] : null;

  return (
    <div className="flex w-full">
      {/* Desktop Navigation */}
      <div className="hidden md:block w-80 flex-shrink-0">
        <DesktopNavigation
          segments={segments}
          courseId={course.id}
          isAdmin={isAdmin}
          currentSegmentId={currentSegmentId}
        />
      </div>

      <div className="flex-1 w-full">
        {/* Mobile Navigation */}
        <MobileNavigation
          segments={segments}
          courseId={course.id}
          isAdmin={isAdmin}
          currentSegmentId={currentSegmentId}
          isOpen={openMobile}
          onClose={() => setOpenMobile(false)}
        />

        <main className="w-full p-6 pt-4">
          {/* Mobile Sidebar Toggle */}
          <div className="space-y-6">
            <Button
              size="icon"
              className="z-50 md:hidden hover:bg-accent"
              onClick={() => setOpenMobile(true)}
            >
              <Menu />
              <span className="sr-only">Toggle course navigation</span>
            </Button>

            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">{currentSegment.title}</h1>
              {isAdmin && (
                <Link
                  to="/courses/$courseId/segments/$segmentId/edit"
                  params={{
                    courseId: course.id.toString(),
                    segmentId: currentSegment.id.toString(),
                  }}
                  className={buttonVariants({ variant: "outline" })}
                >
                  <Edit /> Edit Segment
                </Link>
              )}
            </div>

            {currentSegment.videoKey && (
              <div className="w-full">
                <VideoPlayer url={getStorageUrl(currentSegment.videoKey)} />
              </div>
            )}

            <h2 className="text-xl font-bold">Segment Content</h2>
            <MarkdownContent content={currentSegment.content} />
            <Navigation prevSegment={prevSegment} nextSegment={nextSegment} />
          </div>
        </main>
      </div>
    </div>
  );
}

function RouteComponent() {
  const { course, segment, segments, isAdmin } = Route.useLoaderData();

  return (
    <SidebarProvider>
      <ViewSegment
        course={course}
        segments={segments}
        currentSegment={segment}
        currentSegmentId={segment.id}
        isAdmin={isAdmin}
      />
    </SidebarProvider>
  );
}
