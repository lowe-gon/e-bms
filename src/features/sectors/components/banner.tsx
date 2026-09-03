'use client';

import Modal from '@/components/common/modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AccountForm from '@/features/accounts/components/create-account-form';
import useAccountForm from '@/features/accounts/hooks/use-create-account-form';
import { Compass, Plus, UserPlus } from 'lucide-react';
import React from 'react';

export default function SectorBanner() {
  const [isOpenModal, setIsOpenModal] = React.useState(false);

  const { form, fullNameValue, onSubmitHandler, roleValue } = useAccountForm(setIsOpenModal);

  return (
    <>
      <Card>
        <CardContent className="relative p-5">
          <div className="pointer-events-none absolute top-0 right-0 bottom-0 flex items-center pr-8 opacity-10">
            <Compass className="text-muted-foreground -z-50 size-56" />
          </div>

          <div className="z-50 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="max-w-3xl">
              <h1 className="banner-title">Geographic Sectors & Zone Area Directory</h1>
              <p className="banner-description mt-2">
                Manage the official geographic sector and zone area directory, assign councilors,
                and maintain accurate territorial records for Barangay Calungboyan.
              </p>
            </div>

            <Button size="lg" onClick={() => setIsOpenModal(true)}>
              <Plus />
              <span>Add New Sector</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Modal
        type="create"
        open={isOpenModal}
        onOpenChange={setIsOpenModal}
        headerTitle="Create New Official Account"
        headerDescription="Assign role level, standing committee, and contact credentials"
        icon={UserPlus}
        submitText="Create Official Account"
        formId="create-account-form"
        isSubmitting={form.formState.isSubmitting}>
        <AccountForm
          formId="create-account-form"
          form={form}
          onSubmit={form.handleSubmit(onSubmitHandler)}
          roleValue={roleValue}
          fullNameValue={fullNameValue}
        />
      </Modal>
    </>
  );
}
