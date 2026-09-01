'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { useSector } from '@/features/sectors/context/sectors.context';
import { useSectorDeleteByIdMutation } from '@/hooks/mutations/use-sector-mutations';
import { cn } from '@/lib/utils';
import { Award, Compass, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function SectorDetails() {
  const router = useRouter();
  const { sector, isLoading } = useSector();
  const [selectedGeoSector, setSelectedGeoSector] = React.useState('');
  const [isOpenEditModal, setIsOpenEditModal] = React.useState<boolean>(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = React.useState<boolean>(false);

  const { mutateAsync } = useSectorDeleteByIdMutation();

  React.useEffect(() => {
    (() => {
      if (sector.length > 0) {
        setSelectedGeoSector(sector[0]?.id ?? '');
      }
    })();
  }, [sector]);

  const activeSector = sector.find((s) => s.id === selectedGeoSector);

  return (
    <>
      {/* Geographic Sectors Carousel */}
      <Carousel
        opts={{
          align: 'start',
          dragFree: true,
        }}
        className="w-full space-y-2.5">
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black tracking-wider text-slate-700 uppercase dark:text-slate-300">
              {/* {isCouncilor ? 'My Assigned Geographic Sector & Zone' : 'Geographic Sectors & Zones'} */}
              Geographic Sectors & Zones
            </span>
            <span className="bg-primary/20 text-primary rounded-full px-2 py-0.5 text-[10px] font-bold">
              {sector.length} {sector.length === 1 ? 'Zone' : 'Zones'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <CarouselPrevious className="static translate-x-0 translate-y-0" />
            <CarouselNext className="static translate-x-0 translate-y-0" />
          </div>
        </div>
        <CarouselContent className="-ml-3">
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <CarouselItem
                  key={index.toString()}
                  className="basis-full pl-3 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <div className="p-1">
                    <Skeleton className="h-22 rounded-xl" />
                  </div>
                </CarouselItem>
              ))
            : sector.map(({ id, assignedCouncil, code, name, purokCoverage }) => {
                const isSelected = selectedGeoSector === id;
                return (
                  <CarouselItem
                    key={id}
                    className="basis-full pl-3 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                    <div className="p-1">
                      <Card
                        aria-label="CarouselButton"
                        onClick={() => setSelectedGeoSector(id)}
                        className={cn(
                          isSelected &&
                            'ring-primary/50 to-primary bg-linear-to-br from-blue-700 text-white! ring-2',
                        )}>
                        <CardContent className="pointer-events-none">
                          <span
                            className={cn(
                              'bg-muted rounded-sm px-2 py-0.5 text-[10px] font-extrabold uppercase',
                              isSelected && 'bg-accent/20',
                            )}>
                            {code}
                          </span>
                          <h3 className="mt-2 text-sm font-bold">{name}</h3>
                          <p className="mt-1 line-clamp-1 text-[10px]">
                            Coverage: {purokCoverage.join(', ')}
                          </p>
                          <p className="mt-1 flex items-center gap-1 truncate text-[10px] font-medium">
                            <Award className="h-3 w-3 shrink-0" />
                            Kagawad {assignedCouncil}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                );
              })}
        </CarouselContent>
      </Carousel>

      {/* Selected Geographic Sector Dashboard Details */}
      {isLoading ? (
        <Skeleton className="h-52 rounded-xl" />
      ) : sector.length ? (
        <Card>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-primary/20 border-primary rounded-2xl border p-3">
                  <Compass className="text-primary size-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-black">{activeSector?.name}</h2>
                  <p className="text-muted-foreground mt-1 flex flex-wrap items-center gap-2 text-xs">
                    <span>Puroks Covered:</span>
                    <strong className="text-foreground font-bold">
                      {activeSector?.purokCoverage.join(', ')}
                    </strong>
                  </p>
                </div>
              </div>

              {/* Quick Action Buttons on Active Sector */}
              <Button
                onClick={() => {
                  setIsOpenDeleteModal(true);
                  router.push(`/sectors?sectorId=${activeSector?.id}`);
                }}
                className="bg-destructive/10 text-destructive border-destructive hover:bg-destructive/20 h-auto border px-3 py-2">
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Card className="bg-accent">
                <CardContent>
                  <span className="text-forgroud flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase">
                    <Award className="h-3.5 w-3.5" />
                    Assigned Council / Kagawad Overseer
                  </span>
                  <strong className="text-foreground block text-lg font-extrabold">
                    {activeSector?.assignedCouncil}
                  </strong>
                  <span className="text-muted-foreground text-[10px] font-medium">
                    Sangguniang Barangay Officer-in-Charge
                  </span>
                </CardContent>
              </Card>

              <Card className="bg-accent">
                <CardContent>
                  <span className="text-foreground flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase">
                    Total Sector Households
                  </span>
                  <strong className="text-foreground block text-lg font-black">100 Families</strong>
                  <span className="text-muted-foreground text-[10px] font-medium">
                    Mapped & Registered
                  </span>
                </CardContent>
              </Card>

              <Card className="bg-accent">
                <CardContent>
                  <span className="text-foreground flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase">
                    Estimated Population
                  </span>
                  <strong className="text-foreground block text-lg font-black">
                    100 Residents
                  </strong>
                  <span className="text-muted-foreground text-[10px] font-medium">
                    Mapped & Registered
                  </span>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center space-y-3 py-12">
            <Compass className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">
              No Geographic Sectors Found
            </h3>
            <p className="mx-auto max-w-md text-center text-xs text-slate-500">
              Get started by registering your first Barangay Geographic Sector to map purok
              boundaries, zone leaders, and assigned council members.
            </p>
            <Button
              // onClick={handleOpenCreateModal}
              size="lg"
              className="px-6 font-bold">
              Register First Sector
            </Button>
          </CardContent>
        </Card>
      )}

      {isOpenDeleteModal && (
        <AlertDialog
          open={isOpenDeleteModal}
          onOpenChange={() => {
            setIsOpenDeleteModal(false);
            router.back();
          }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="font-bold">Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the geographic sector{' '}
                <span className="font-bold text-black dark:text-white">{activeSector?.name}</span>?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive hover:bg-destructive/90"
                onClick={async () => {
                  await mutateAsync(activeSector?.id ?? '');
                  setIsOpenDeleteModal(false);
                  router.back();
                }}>
                Yes, I&apos;m sure
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
