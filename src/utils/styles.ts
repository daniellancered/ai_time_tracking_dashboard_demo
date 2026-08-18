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

export function getCustomerTierBadgeStyle(tier: number): string {
  switch (tier) {
    case 1:
      return 'bg-primary/10 text-primary border-primary/20';
    case 2:
      return 'bg-secondary/10 text-secondary border-secondary/20';
    case 3:
      return 'bg-accent-3/10 text-accent-3 border-accent-3/20';
    default:
      return 'bg-surface-subtle text-light border-border';
  }
}

export function getCategoryBadgeStyle(category: string | null | undefined): string {
  if (!category || category === 'Uncategorized') {
    return 'bg-slate-100 text-light border-dashed border-slate-300';
  }

  switch (category) {
    case 'Client-facing meetings and comms':
    case 'Strategic meetings / QBRs':
      return 'bg-primary/10 text-primary border-primary/20';
    case 'Contract / commercial work':
    case 'Campaign support (beyond scope)':
      return 'bg-amber-500/10 text-amber-700 border-amber-500/20';
    case 'Onboarding and training':
    case 'Analysis and insights':
      return 'bg-secondary/10 text-secondary border-secondary/20';
    case 'Internal client work':
    case 'Partner meetings':
      return 'bg-accent-3/10 text-accent-3 border-accent-3/20';
    case 'Troubleshooting (feeds)':
    case 'Troubleshooting (Smartly)':
      return 'bg-rose-500/10 text-rose-700 border-rose-500/20';
    case 'Learning':
      return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20';
    case 'Team/company calls':
      return 'bg-indigo-500/10 text-indigo-700 border-indigo-500/20';
    case 'PTO':
      return 'bg-slate-200 text-slate-700 border-slate-300';
    default:
      return 'bg-surface-subtle text-light border-border';
  }
}
