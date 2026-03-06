export const formatDate = (dateString?: string): string | null => {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  } catch (error) {
    return null;
  }
};

export const getCurrentGreeting = (): { hour: number } => {
  const hour = new Date().getHours();
  return { hour };
};

