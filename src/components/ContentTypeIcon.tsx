import { CONTENT_TYPES } from '@/lib/constants';

interface ContentTypeIconProps {
  type: keyof typeof CONTENT_TYPES;
  className?: string;
}

export function ContentTypeIcon({ type, className = "h-4 w-4" }: ContentTypeIconProps) {
  const Icon = CONTENT_TYPES[type].icon;
  return <Icon className={className} />;
}