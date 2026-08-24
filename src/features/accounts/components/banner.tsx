'use client';

import Modal from '@/components/modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import CreateAccountForm from '@/features/accounts/components/create-account-form';
import { KeyRound, ShieldCheck, UserPlus } from 'lucide-react';
import React from 'react';

export default function AccountBanner() {
  const [isOpenAddAccountModal, setIsOpenAddAccoutModal] = React.useState<boolean>(false);

  return (
    <>
      <Card>
        <CardContent className="relative flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="pointer-events-none absolute top-0 right-0 bottom-0 flex items-center pr-8 opacity-10">
            <KeyRound className="text-muted-foreground -z-50 size-64" />
          </div>
          <div className="z-50 max-w-2xl space-y-1.5">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/20 px-2.5 py-1 text-xs font-semibold text-blue-500">
              <ShieldCheck className="h-3.5 w-3.5" />
              Executive Administration
            </div>
            <h1 className="text-xl font-black tracking-tight sm:text-2xl">
              User Accounts & Roles Management
            </h1>
            <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
              Create official system accounts, assign Sangguniang Barangay committees, define
              executive roles, and audit access permissions for Barangay San Jose officials.
            </p>
          </div>

          <div className="z-50">
            <Button
              size="lg"
              className="w-full md:w-auto"
              onClick={() => setIsOpenAddAccoutModal(true)}>
              <UserPlus className="size-4" />
              <span>Add Account & Role</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {isOpenAddAccountModal && (
        <Modal
          isOpen={isOpenAddAccountModal}
          setIsOpen={() => setIsOpenAddAccoutModal(false)}
          hasHeader={true}
          headerTitle="Create New Official Account"
          headerDescription=" Assign role level, standing committee, and contact credentials"
          hasIcon={true}
          icon={UserPlus}>
          <CreateAccountForm />
        </Modal>
      )}
    </>
  );
}
