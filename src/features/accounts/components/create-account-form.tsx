'use client';

import {
  FormFieldFloatingLabelInput,
  FormFieldPictureInput,
  FormFieldSelectOptionInput,
} from '@/components/common/form-fields';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FieldGroup } from '@/components/ui/field';
import { Separator } from '@/components/ui/separator';
import type { UserRole } from '@/constants/user-role';
import type { TAccountFormSchema } from '@/features/accounts/schemas/account-form.schema';
import { CheckCircle2 } from 'lucide-react';
import React from 'react';
import type { UseFormReturn } from 'react-hook-form';

interface ICreateAccountForm {
  formId: string;
  form: UseFormReturn<TAccountFormSchema>;
  roleValue: UserRole;
  fullNameValue: string;
  onSubmit: () => void;
}

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

export default function CreateAccountForm({
  formId,
  form,
  roleValue,
  fullNameValue,
  onSubmit,
}: ICreateAccountForm) {
  const permissionsList = getPermissionsList(roleValue as UserRole);

  return (
    <form
      id={formId}
      data-form-disabled={form.formState.isSubmitting}
      onSubmit={onSubmit}
      className="space-y-5">
      <FieldGroup className="grid gap-5 md:grid-cols-2">
        <FormFieldPictureInput
          control={form.control}
          name="image"
          containerClassName="md:col-span-2"
          fullNameValue={fullNameValue}
        />

        <FormFieldFloatingLabelInput
          control={form.control}
          name="firstName"
          label="First Name"
          isRequired
        />

        <FormFieldFloatingLabelInput
          control={form.control}
          name="lastName"
          label="Last Name"
          isRequired
        />

        <FormFieldFloatingLabelInput
          control={form.control}
          name="emailAddress"
          label="Email Address"
          isRequired
        />

        <FormFieldFloatingLabelInput
          control={form.control}
          name="phoneNumber"
          label="Contact Phone Number"
          isRequired
        />

        <FormFieldSelectOptionInput
          control={form.control}
          name="role"
          label="System Role Tier"
          isRequired
          options={[
            {
              label: 'Punong Barangay (Captain) - Full Executive',
              value: 'captain',
            },
            {
              label: 'Sangguniang Barangay Member (Councilor / Kagawad)',
              value: 'councilor',
            },
            {
              label: 'Barangay Secretary - Secretariat & Records',
              value: 'secretary',
            },
            {
              label: 'Barangay Treasurer - Budget & Disbursement',
              value: 'treasurer',
            },
            {
              label: 'Barangay Tanod - Peace, Order & Blotter Patrol',
              value: 'tanod',
            },
            {
              label: 'Barangay Administrative Staff / Intake Clerk',
              value: 'staff',
            },
          ]}
          containerClassName="md:col-span-2"
        />
      </FieldGroup>

      <React.Activity mode={roleValue?.trim() !== '' ? 'visible' : 'hidden'}>
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
      </React.Activity>

      <Separator />

      <h3 className="text-xs font-semibold uppercase">
        System Login Credentials <span className="text-destructive">*</span>
      </h3>

      <FieldGroup className="grid gap-5 md:grid-cols-2">
        <FormFieldFloatingLabelInput
          control={form.control}
          name="username"
          label="Username"
          isRequired
        />

        <FormFieldFloatingLabelInput
          control={form.control}
          name="password"
          type="password"
          label="Password"
          isRequired
        />
      </FieldGroup>
    </form>
  );
}
