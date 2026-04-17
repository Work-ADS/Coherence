export type BadgeIntent = 'neutral' | 'info' | 'success' | 'warning' | 'error';
export type BadgeSize = 'sm' | 'md';

export const baseClasses =
  'inline-flex items-center font-medium rounded-full ' +
  'transition-all duration-fast ease-out whitespace-nowrap';

export const sizeClasses: Record<BadgeSize, string> = {
  sm: 'h-5 px-2 text-body-sm gap-1',
  md: 'h-6 px-2.5 text-body-sm gap-1.5',
};

export const intentClasses: Record<BadgeIntent, string> = {
  neutral:  'bg-neutral-200 text-neutral-800',
  info:     'bg-action-100 text-action-700',
  success:  'bg-system-success-bg text-system-success-fg',
  warning:  'bg-system-warning-bg text-system-warning-fg',
  error:    'bg-system-error-bg text-system-error-fg',
};

export const dotIntentClasses: Record<BadgeIntent, string> = {
  neutral:  'bg-neutral-500',
  info:     'bg-action-500',
  success:  'bg-system-success',
  warning:  'bg-system-warning',
  error:    'bg-system-error',
};
