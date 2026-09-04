'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useUserMeContext } from '@/features/users/context/user-me.contex';
import { Layers2, UserPlus } from 'lucide-react';
import React from 'react';

export default function CommitteeBanner() {
  const [isOpenModal, setIsOpenModal] = React.useState(false);
  const { user } = useUserMeContext();

  const isCaptainOrSecretary = user?.role === 'captain' || user?.role === 'secretary' || 'captain';

  return (
    <>
      <Card>
        <CardContent className="relative p-5">
          <div className="pointer-events-none absolute top-0 right-0 bottom-0 flex items-center pr-8 opacity-10">
            <Layers2 className="text-muted-foreground -z-50 size-56" />
          </div>

          <div className="z-50 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="max-w-3xl">
              <h1 className="banner-title">
                Barangay Council Standing Committees & Multi-Person Rosters
              </h1>
              <p className="banner-description mt-2">
                Barangay Council Standing Committee Setup, Multi-Personnel Assignments, Budget &
                Demographic Portals
              </p>
            </div>

            {isCaptainOrSecretary && (
              <Button size="lg" onClick={() => setIsOpenModal(true)}>
                <UserPlus />
                <span>Create Committee</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* <Modal
        type="create"
        open={isOpenModal}
        onOpenChange={setIsOpenModal}
        headerTitle="Edit Geographic Sector Details"
        headerDescription="Create a zone and assign a councilor."
        icon={Compass}
        submitText="Create Geographic Sector"
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
      </Modal> */}
    </>
  );
}
