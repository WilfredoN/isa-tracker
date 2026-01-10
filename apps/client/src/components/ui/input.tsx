import React from 'react';

export const Input = ({
  className = '',
  style,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={`rounded-md border border-[var(--color-accent)] bg-[var(--color-background)] px-3 py-2 text-[var(--color-primary)] outline-none transition-colors placeholder:text-[color-mix(in_oklch,var(--color-primary)_60%,oklch(0.398_0.07_227.392)_40%)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] disabled:pointer-events-none disabled:opacity-50 ${className}`}
    style={style}
    {...props}
  />
);
