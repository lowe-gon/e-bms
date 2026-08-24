import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const skeletonVariants = cva('bg-muted animate-pulse rounded-md', {
  variants: {
    size: {
      default: 'h-4 w-full',
      avatar: 'size-14',
    },
    defaultVariants: {
      size: 'default',
    },
  },
});

function Skeleton({
  className,
  size,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof skeletonVariants>) {
  return (
    <div data-slot="skeleton" className={cn(skeletonVariants({ size, className }))} {...props} />
  );
}

export { Skeleton };
