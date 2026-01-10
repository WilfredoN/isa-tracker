import React from 'react';

export const Button = ({
  className = '',
  style,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={`bg-(--color-accent) text-(--color-accent-foreground) focus-visible:ring-(--color-primary) cursor-pointer rounded-md px-4 py-2 text-base font-medium transition-colors hover:bg-[color-mix(in_oklch,var(--color-accent)_90%,oklch(0.398_0.07_227.392)_10%)] focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 ${className}`}
    style={style}
    {...props}
  />
);
