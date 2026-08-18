export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getRoleBadgeStyle(role: string): string {
  const lower = role.toLowerCase();
  if (lower.includes('customer success') || lower.includes('manager')) {
    return 'bg-primary/10 text-primary border-primary/20';
  }
  if (lower.includes('engineer') || lower.includes('software')) {
    return 'bg-secondary/10 text-secondary border-secondary/20';
  }
  if (lower.includes('designer') || lower.includes('product')) {
    return 'bg-accent-3/10 text-accent-3 border-accent-3/20';
  }
  return 'bg-surface-subtle text-light border-border';
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}
