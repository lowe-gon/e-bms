'use client';

import Modal from '@/components/modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import CreateSectorForm from '@/features/sectors/components/create-sector-form';
import { useSector } from '@/features/sectors/context/sectors.context';
import { Compass, MapPin, Plus } from 'lucide-react';
import React from 'react';

export default function SectorBanner() {
  const [isOpenAddAccountModal, setIsOpenAddAccoutModal] = React.useState<boolean>(false);

  const { councils, sector, isLoading } = useSector();

  const officialOptions =
    councils.map(({ firstName, lastName, avatarUrl, id }) => ({
      label: `${firstName} ${lastName}`,
      value: id,
      image: avatarUrl ?? '',
    })) ?? [];

  return (
    <>
      {isLoading ? (
        <Skeleton className="h-32" />
      ) : (
        <Card>
          <CardContent className="relative flex flex-col justify-between gap-4 py-5 md:flex-row md:items-center">
            <div className="pointer-events-none absolute top-0 right-0 bottom-0 flex items-center pr-8 opacity-10">
              <Compass className="text-muted-foreground -z-50 size-44" />
            </div>
            <div className="z-50 max-w-2xl">
              <h1 className="flex items-center gap-2 text-xl font-black tracking-tight sm:text-2xl">
                Geographic Sectors & Zone Area Directory
                <span className="bg-primary/10 border-primary/30 text-primary rounded-full border px-3 py-0.5 text-xs font-black uppercase">
                  {sector.length} active zone
                </span>
              </h1>
              <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                Barangay Land Zoning, Geographic Sector Boundaries, Purok Coverage, & Assigned
                Council,
              </p>
            </div>

            <div className="z-50">
              <Button
                size="lg"
                className="w-full md:w-auto"
                onClick={() => setIsOpenAddAccoutModal(true)}>
                <Plus className="size-4" />
                <span>Add New Zone</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isOpenAddAccountModal && (
        <Modal
          isOpen={isOpenAddAccountModal}
          setIsOpen={() => setIsOpenAddAccoutModal(false)}
          hasHeader={true}
          headerTitle="Register New Geographic Sector / Zone"

          hasIcon={true}
          icon={MapPin}>
          <CreateSectorForm
            officialOptions={officialOptions}
            setIsOpenAddAccoutModal={setIsOpenAddAccoutModal}
          />
        </Modal>
      )}
    </>
  );
}
