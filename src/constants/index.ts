export const CLIENT_WORK_CATEGORIES = [
  'Client-facing meetings and comms',
  'Strategic meetings / QBRs',
  'Contract / commercial work',
  'Onboarding and training',
  'Analysis and insights',
  'Campaign support (beyond scope)',
  'Internal client work',
  'Partner meetings',
  'Travel & socials',
  'Troubleshooting (feeds)',
  'Troubleshooting (Smartly)',
] as const;

export const INTERNAL_WORK_CATEGORIES = [
  'Learning',
  'Team/company calls',
  'Other internal tasks',
] as const;

export const PTO_CATEGORIES = ['PTO'] as const;

export const ALL_CATEGORIES = [
  ...CLIENT_WORK_CATEGORIES,
  ...INTERNAL_WORK_CATEGORIES,
  ...PTO_CATEGORIES,
] as const;

export const CATEGORY_COLORS = [
  '#6F42C1',
  '#007BFF',
  '#17A2B8',
  '#00CCCC',
  '#10B981',
  '#F59E0B',
  '#F43F5E',
  '#6366F1',
  '#8B5CF6',
  '#EC4899',
  '#14B8A6',
  '#F97316',
  '#06B6D4',
  '#84CC16',
  '#64748B',
] as const;

export const CLIENT_COLORS = [
  '#007BFF',
  '#17A2B8',
  '#6366F1',
  '#10B981',
  '#F59E0B',
  '#EC4899',
  '#6F42C1',
  '#14B8A6',
  '#64748B',
] as const;

