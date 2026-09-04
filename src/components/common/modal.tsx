import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { Trash2Icon } from 'lucide-react';
import type React from 'react';

type TModalType =
  | {
      type: 'delete';
      icon?: never;
      submitText?: never;
      formId?: never;
      onSubmit: () => Promise<void>;
      children?: never;
      onResetForm?: never;
    }
  | {
      type: 'update';
      icon: React.ElementType;
      submitText?: never;
      formId: string;
      onSubmit?: never;
      children: React.ReactNode;
      onResetForm: () => void;
    }
  | {
      type: 'create';
      icon: React.ElementType;
      submitText: string;
      formId: string;
      onSubmit?: never;
      children: React.ReactNode;
      onResetForm: () => void;
    };

type TModal = TModalType & {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  headerTitle: string;
  headerDescription: string;
  isSubmitting?: boolean;
};

export default function Modal({
  type,
  open,
  onOpenChange,
  headerTitle = '',
  headerDescription = '',
  icon: Icon,
  submitText,
  children,
  formId,
  isSubmitting,
  onSubmit,
  onResetForm,
}: TModal) {
  if (type === 'delete') {
    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent className={cn('max-w-md!')}>
          <AlertDialogHeader className="flex! flex-col! items-center!">
            <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
              <Trash2Icon />
            </AlertDialogMedia>
            <AlertDialogTitle>{headerTitle}</AlertDialogTitle>
            <AlertDialogDescription className="text-center! whitespace-pre-line">
              {headerDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="grid grid-cols-2!">
            <AlertDialogCancel disabled={isSubmitting} variant="outline" className="h-10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isSubmitting}
              variant="destructive"
              className="h-10"
              onClick={onSubmit}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  if (type === 'update') {
    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent
          className={cn('overflow-hidden p-0 sm:max-w-md! md:max-w-xl! lg:max-w-2xl!')}
          showCloseButton
          onClose={onResetForm}>
          <AlertDialogHeader className="flex items-center border-b px-3 pt-3 pb-2">
            <AlertDialogMedia className="bg-primary/10 text-primary dark:bg-primary/20">
              {Icon && <Icon />}
            </AlertDialogMedia>
            <div>
              <AlertDialogTitle>{headerTitle}</AlertDialogTitle>
              <AlertDialogDescription>{headerDescription}</AlertDialogDescription>
            </div>
          </AlertDialogHeader>
          <div
            className={cn('no-scrollbar h-max max-h-[70vh] overflow-x-hidden overflow-y-auto p-4')}>
            {children}
          </div>
          <AlertDialogFooter className="m-0! px-3! pb-3!">
            <AlertDialogCancel
              disabled={isSubmitting}
              variant="outline"
              className="h-10"
              onClick={onResetForm}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction disabled={isSubmitting} type="submit" form={formId} className="h-10">
              Save Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        className={cn('overflow-hidden p-0 sm:max-w-md! md:max-w-xl! lg:max-w-2xl!')}
        showCloseButton
        onClose={onResetForm}>
        <AlertDialogHeader className="flex items-center border-b px-3 pt-3 pb-2">
          <AlertDialogMedia className="bg-primary/10 text-primary dark:bg-primary/20">
            {Icon && <Icon />}
          </AlertDialogMedia>
          <div>
            <AlertDialogTitle>{headerTitle}</AlertDialogTitle>
            <AlertDialogDescription>{headerDescription}</AlertDialogDescription>
          </div>
        </AlertDialogHeader>
        <div
          className={cn('no-scrollbar h-max max-h-[70vh] overflow-x-hidden overflow-y-auto p-4')}>
          {children}
        </div>
        <AlertDialogFooter className="m-0! px-3! pb-3!">
          <AlertDialogCancel
            disabled={isSubmitting}
            variant="outline"
            className="h-10"
            onClick={onResetForm}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction disabled={isSubmitting} type="submit" form={formId} className="h-10">
            {submitText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
