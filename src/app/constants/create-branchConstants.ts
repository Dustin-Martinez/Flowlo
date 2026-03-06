// constants/branch.constants.ts
export const WORKFLOW_TYPES = [
  { value: 'development' as const, label: 'Development', description: 'Software development workflow', icon: '💻' },
  { value: 'design' as const, label: 'Design', description: 'UI/UX design process', icon: '🎨' },
  { value: 'marketing' as const, label: 'Marketing', description: 'Marketing campaign workflow', icon: '📢' },
  { value: 'qa' as const, label: 'QA Testing', description: 'Quality assurance testing', icon: '🧪' },
  { value: 'operations' as const, label: 'Operations', description: 'Operations and deployment', icon: '⚙️' },
  { value: 'custom' as const, label: 'Custom', description: 'Custom workflow', icon: '🔧' }
];

export const AVAILABLE_TEAM_MEMBERS = [
  { id: 'JD', name: 'John Doe', role: 'Developer' },
  { id: 'JS', name: 'Jane Smith', role: 'Designer' },
  { id: 'MJ', name: 'Mike Johnson', role: 'PM' },
  { id: 'SL', name: 'Sarah Lee', role: 'QA' },
  { id: 'RB', name: 'Robert Brown', role: 'Marketing' },
  { id: 'KW', name: 'Kelly Wilson', role: 'Ops' }
];