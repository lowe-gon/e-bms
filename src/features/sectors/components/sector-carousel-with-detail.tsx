'use client';

import Modal from '@/components/common/modal';
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
import SectorForm from '@/features/sectors/components/sector-form';
import { useSectorContext } from '@/features/sectors/context/sectors.context';
import useDeleteSectorMutation from '@/features/sectors/hooks/use-delete-sector-mutation copy';
import useSectorForm from '@/features/sectors/hooks/use-sector-form';
import { useUserMeContext } from '@/features/users/context/user-me.contex';
import { cn } from '@/lib/utils';
import { Award, Compass, Edit3, Trash2 } from 'lucide-react';
import React from 'react';

export default function SectorCarouselWithDetail() {
  const { user } = useUserMeContext();
  const { sectors, officials, isFetching, hasNextPage, onLoadMore } = useSectorContext();
  const { mutateAsync } = useDeleteSectorMutation();
  const [selectedSector, setSelectedSector] = React.useState('');
  const [isOpenEditModal, setIsOpenEditModal] = React.useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = React.useState(false);

  const isCaptainAndSecretary = user?.role === 'captain' || user?.role === 'secretary';

  const activeSector = sectors.find((sec) => sec.sectorId === selectedSector);
  const activeOfficial = officials.find(
    (o) => o.firstName.toLowerCase() === activeSector?.officialName.split(' ')[0]?.toLowerCase(),
  );

  const { form, onSubmitHandler } = useSectorForm({
    councilId: activeOfficial?.id || '',
    name: activeSector?.sectorName || '',
    purokCoverage: activeSector?.purokCoverage.join(', ') || '',
    sectorId: activeSector?.sectorId || '',
    mode: 'update',
    onCloseModal: () => setIsOpenEditModal(false),
  });

  React.useEffect(() => {
    (() => {
      let firstTime = false;
      if (firstTime) return;
      setSelectedSector(sectors[0]?.sectorId || '');
      firstTime = true;
    })();
  }, [sectors]);

  return (
    <>
      {isCaptainAndSecretary && (
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
                  Geographic Sectors & Zones
                </span>
              )}
              {isFetching ? (
                <Skeleton className="h-5 w-16 rounded-full" />
              ) : (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  {sectors.length} {sectors.length === 1 ? 'Zone' : 'Zones'}
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

          <CarouselContent className="-ml-3">
            {isFetching
              ? Array.from({ length: 4 }).map((_, index) => (
                  <CarouselItem
                    key={index.toString()}
                    className="basis-full pl-3 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                    <Skeleton className="h-30 w-full rounded-xl!" />
                  </CarouselItem>
                ))
              : sectors.map((sec) => {
                  const isSelected = selectedSector === sec.sectorId;

                  return (
                    <CarouselItem
                      key={sec.sectorId}
                      className="basis-full pl-3 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                      <div className="p-1">
                        <Card
                          aria-description="sector-button"
                          className={cn(
                            isSelected &&
                              'from-primary to-primary/80 ring-primary bg-linear-to-br ring-1',
                          )}
                          onClick={() => setSelectedSector(sec.sectorId)}>
                          <CardContent className="space-y-3">
                            <div className="flex w-full items-center justify-between">
                              <span
                                className={cn(
                                  'rounded-md px-2.5 py-1 text-xs font-bold',
                                  isSelected ? 'bg-white/20 text-white' : 'bg-accent',
                                )}>
                                {sec.code}
                              </span>
                              {sec.officialName && (
                                <p
                                  className={cn(
                                    'mt-1 flex items-center gap-1 truncate text-[10px] font-medium',
                                    isSelected && 'text-white',
                                  )}>
                                  <Award className="h-3 w-3 shrink-0" />
                                  {sec.officialName}
                                </p>
                              )}
                            </div>
                            <h3
                              className={cn(
                                'mt-2 text-sm leading-tight font-extrabold',
                                isSelected && 'text-white',
                              )}>
                              {sec.sectorName}
                            </h3>

                            <p
                              className={cn(
                                'mt-1 line-clamp-1 text-[10px]',
                                isSelected && 'text-white',
                              )}>
                              Coverage: {sec.purokCoverage.join(', ')}
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  );
                })}
          </CarouselContent>
        </Carousel>
      )}

      {isFetching ? (
        <Skeleton className="h-62 w-full rounded-xl!" />
      ) : (
        <Card>
          <CardContent className="flex flex-col gap-6">
            <div className="relative flex w-full flex-col justify-between gap-6 md:flex-row md:items-center">
              <div className="flex items-center gap-4">
                <div className="border-primary/30 bg-primary/20 shrink-0 rounded-2xl border p-3.5">
                  <Compass className="text-primary h-8 w-8" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="border-accent bg-accent text-foreground rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-extrabold">
                      {activeSector?.code}
                    </span>
                  </div>

                  <h2 className="text-foreground mt-1 text-2xl font-black">
                    {activeSector?.sectorName}
                  </h2>

                  <p className="text-muted-foreground mt-1 flex flex-wrap items-center gap-2 text-xs">
                    <span>Puroks Covered:</span>
                    <strong className="text-muted-foreground font-bold">
                      {activeSector?.purokCoverage.join(', ')}
                    </strong>
                  </p>
                </div>
              </div>

              {/* Quick Action Buttons on Active Sector */}
              <div className="flex items-center gap-2">
                <Button size="lg" variant="outline" onClick={() => setIsOpenEditModal(true)}>
                  <Edit3 className="size-3.5" />
                  Edit Sector
                </Button>
                <Button size="lg" variant="destructive" onClick={() => setIsOpenDeleteModal(true)}>
                  <Trash2 className="size-3.5" />
                  Delete
                </Button>
              </div>
            </div>

            {/* Assigned Council & Zone Officers Cards */}
            <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-3">
              <Card className="bg-accent">
                <CardContent>
                  <span className="text-primary text-[10px] font-bold tracking-wider uppercase dark:text-blue-400">
                    Assigned Council / Kagawad Overseer
                  </span>
                  <strong className="text-foreground block text-sm font-extrabold">
                    {activeSector?.officialName || 'Not Assigned'}
                  </strong>
                  <span className="text-muted-foreground block text-[10px]">
                    Sangguniang Barangay Officer-in-Charge
                  </span>
                </CardContent>
              </Card>

              <Card className="bg-accent">
                <CardContent>
                  <span className="text-primary text-[10px] font-bold tracking-wider uppercase dark:text-blue-400">
                    Total Sector Households
                  </span>
                  <strong className="text-foreground block text-sm font-extrabold">
                    250 Families
                  </strong>
                  <span className="text-muted-foreground block text-[10px]">
                    Mapped & Registered
                  </span>
                </CardContent>
              </Card>

              <Card className="bg-accent">
                <CardContent>
                  <span className="text-primary text-[10px] font-bold tracking-wider uppercase dark:text-blue-400">
                    Estimated Population
                  </span>
                  <strong className="text-foreground block text-sm font-extrabold">
                    1,100 Residents
                  </strong>
                  <span className="text-muted-foreground block text-[10px]">
                    Master List Records
                  </span>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Sector */}
      <Modal
        type="update"
        open={isOpenEditModal}
        onOpenChange={setIsOpenEditModal}
        headerTitle="Edit Geographic Sector Details"
        headerDescription="Update zone details or reassign councilor assignment."
        icon={Compass}
        formId="create-sector-form"
        isSubmitting={form.formState.isSubmitting}
        onResetForm={() => form.reset()}>
        <SectorForm
          id="create-sector-form"
          control={form.control}
          onSubmit={form.handleSubmit(onSubmitHandler)}
          options={officials.map((o) => ({
            label: [o.firstName, o.lastName].filter(Boolean).join(' '),
            value: o.id,
            imageUrl: o.avatarUrl,
          }))}
          {...(hasNextPage && { hasNextPage, onLoadMore })}
        />
      </Modal>

      {/* Delete Sector */}
      <Modal
        type="delete"
        open={isOpenDeleteModal}
        onOpenChange={setIsOpenDeleteModal}
        headerTitle="Delete Geographic Sector?"
        headerDescription={`This action cannot be undone. \nAre you sure you want to delete the geographic sector ${activeSector?.sectorName}?`}
        onSubmit={async () => {
          await mutateAsync(activeSector?.sectorId || '');
          setIsOpenDeleteModal(false);
        }}
      />
    </>
  );
}
