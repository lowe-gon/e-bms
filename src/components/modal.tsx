import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import type React from 'react';

type HasIconProps = { hasIcon?: false; icon?: never } | { hasIcon: true; icon: React.ElementType };

type HasHeaderProps =
  | { hasHeader?: false; headerTitle?: never; headerDescription?: never }
  | {
      hasHeader?: true;
      headerTitle: string;
      headerDescription?: string;
    };

type ModalProps = React.PropsWithChildren &
  HasIconProps &
  HasHeaderProps & {
    isOpen: boolean;
    setIsOpen: () => void;
  };

export default function Modal({
  isOpen = false,
  setIsOpen,
  children,
  hasHeader,
  headerTitle,
  headerDescription,
  hasIcon,
  icon: Icon,
}: ModalProps) {
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="overflow-hidden p-0 sm:max-w-md md:max-w-xl lg:max-w-2xl">
          {hasHeader && (
            <DialogHeader className="flex flex-row items-center gap-2.5 border-b p-4">
              <div className="rounded-xl bg-blue-100 p-2 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400">
                {hasIcon && <Icon className="size-5" />}
              </div>
              <div className="flex flex-col">
                <DialogTitle className="font-bold">{headerTitle}</DialogTitle>
                <DialogDescription className="text-xs">{headerDescription}</DialogDescription>
              </div>
            </DialogHeader>
          )}
          <div
            className={cn(
              'no-scrollbar h-max max-h-[80vh] overflow-x-hidden overflow-y-auto px-4 pb-4',
              !hasHeader && 'pt-4',
            )}>
            {children}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
