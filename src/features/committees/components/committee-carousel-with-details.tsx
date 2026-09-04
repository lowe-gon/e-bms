import { Carousel, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';

export default function CommitteeCarouselWithDetails() {
  const isFetching = false;
  const committees = Array.from({ length: 2 });
  return (
    <>
      <Carousel
        opts={{
          align: 'start',
          dragFree: true,
        }}
        className="w-full space-y-2.5">
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-2">
            {isFetching ? (
              <Skeleton className="h-5 w-48" />
            ) : (
              <span className="text-xs font-black tracking-wider text-slate-700 uppercase dark:text-slate-300">
                Committees
              </span>
            )}
            {isFetching ? (
              <Skeleton className="h-5 w-16 rounded-full" />
            ) : (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                {committees.length} {committees.length === 1 ? 'Zone' : 'Zones'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {isFetching ? (
              <Skeleton className="size-7 rounded-full" />
            ) : (
              <CarouselPrevious className="static translate-x-0 translate-y-0" />
            )}
            {isFetching ? (
              <Skeleton className="size-7 rounded-full" />
            ) : (
              <CarouselNext className="static translate-x-0 translate-y-0" />
            )}
          </div>
        </div>
      </Carousel>
    </>
  );
}
