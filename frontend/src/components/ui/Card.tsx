import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

/* eslint-disable @typescript-eslint/no-empty-object-type */
interface CardProps extends HTMLAttributes<HTMLDivElement> {}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border-2 border-primary bg-background-light p-6 shadow-lg',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;