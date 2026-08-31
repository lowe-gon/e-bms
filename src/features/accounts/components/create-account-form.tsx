'use client';

import {
  FormButton,
  FormInputFile,
  FormInputSelectGroup,
  FormInputWithFloatingLabel,
} from '@/components/form-fields';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DialogClose } from '@/components/ui/dialog';
import { FieldGroup } from '@/components/ui/field';
import useCreateAccountForm from '@/features/accounts/hooks/use-create-account-form';
import type { UserRole } from '@/typings';
import { CheckCircle2 } from 'lucide-react';

// Permission chips preview helper
export const getPermissionsList = (role: UserRole) => {
  switch (role) {
    case 'captain':
      return [
        'Executive Approvals',
        'Check & Disbursement Sign-off',
        'Ordinance Veto / Enact',
        'All Portal Modules',
        'Account Management',
      ];
    case 'secretary':
      return [
        'Resident & Household Masterlist',
        'Clearances & Certifications',
        'Session Minutes & Resolutions',
        'Account Management',
        'Blotter Records',
      ];
    case 'treasurer':
      return [
        'AIP & Annual Budget',
        'Disbursement Vouchers',
        'Official Receipts (OR)',
        'Financial Statement Reports',
        'Cash Inflow / Outflow',
      ];
    case 'councilor':
      return [
        'Standing Committee Sponsorship',
        'Geographic Zone Mapping',
        'Ordinance Co-authoring',
        'Session Attendance',
        'Project Progress Tracking',
      ];
    case 'tanod':
      return [
        'Blotter Incident Encoding',
        'Peace & Order Patrol Logs',
        'Community Watch Updates',
        'Lupon Hearing Assistance',
      ];
    default:
      return ['Front Desk Clearances', 'Resident Verification', 'Announcement Posting'];
  }
};

export default function CreateAccountForm() {
  const { form, roleValue, fullNameValue, onSubmitHandler } = useCreateAccountForm();

  const permissionsList = getPermissionsList(roleValue as UserRole);

  return (
    <>
      <form
        id="new-user-account"
        onSubmit={form.handleSubmit(onSubmitHandler)}
        className="space-y-3">
        <FieldGroup className="grid gap-3 md:grid-cols-2">
          <div className="md:col-span-2">
            <FormInputFile
              control={form.control}
              name="image"
              label="Official Profile Photo / Image"
              watchName={fullNameValue}
            />
          </div>

          <FormInputWithFloatingLabel
            name="firstName"
            control={form.control}
            label="First Name"
            placeholder="Juan"
            disabled={form.formState.isSubmitting}
          />

          <FormInputWithFloatingLabel
            name="lastName"
            control={form.control}
            label="Last Name"
            placeholder="Dela Cruz"
            disabled={form.formState.isSubmitting}
          />

          <FormInputWithFloatingLabel
            type="email"
            name="emailAddress"
            control={form.control}
            label="Email"
            placeholder="juandelacruz@example.com"
            disabled={form.formState.isSubmitting}
          />
          <FormInputWithFloatingLabel
            type="tel"
            name="phoneNumber"
            control={form.control}
            label="Contact Number"
            placeholder="+63900-0000-000"
            disabled={form.formState.isSubmitting}
          />

          <FormInputSelectGroup
            control={form.control}
            name="role"
            options={[
              {
                label: 'Barangay Captain',
                value: 'captain',
              },
              {
                label: 'Barangay Kagawad',
                value: 'councilor',
              },
              {
                label: 'Barangay Secretary',
                value: 'secretary',
              },
              {
                label: 'Barangay Treasurer',
                value: 'treasurer',
              },
              {
                label: 'Barangay Tanod',
                value: 'tanod',
              },
              {
                label: 'Barangay Staff',
                value: 'staff',
              },
            ]}
            label="System Role Tier"
            isRequired
            disabled={form.formState.isSubmitting}
            containerClassName="col-span-2"
          />
        </FieldGroup>

        {roleValue.length ? (
          <Card className="bg-accent/20">
            <CardHeader>
              <CardTitle className="text-[10px] font-bold tracking-wider uppercase">
                Granted Privileges Preview for ({roleValue}):
              </CardTitle>
              <CardDescription className="sr-only">Description</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 gap-1 text-[11px] sm:grid-cols-2">
                {permissionsList.map((p) => (
                  <li key={p} className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-500" />
                    <span className="truncate">{p}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ) : null}

        <FieldGroup className="grid gap-3 md:grid-cols-2">
          <div className="flex w-full items-center justify-between md:col-span-2">
            <h2 className="font-bold">
              System Login Credentials <span className="text-destructive">*</span>
            </h2>
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
              Official Portal Auth
            </span>
          </div>

          <FormInputWithFloatingLabel
            name="username"
            control={form.control}
            label="Username"
            placeholder="juandelacruz"
            disabled={form.formState.isSubmitting}
          />

          <FormInputWithFloatingLabel
            type="password"
            name="password"
            control={form.control}
            label="Password"
            disabled={form.formState.isSubmitting}
          />
        </FieldGroup>

        <div className="grid gap-2 md:grid-cols-2">
          <div className="col-span-1"></div>
          <div className="col-span-1 flex items-center gap-3">
            <DialogClose disabled={form.formState.isSubmitting}>Cancel</DialogClose>
            <FormButton disabled={form.formState.isSubmitting}>Create Official Account</FormButton>
          </div>
        </div>
      </form>
    </>
  );
}
