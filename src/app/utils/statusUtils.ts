import { STATUS_CONFIG, GREETING_CONFIG } from "@/src/app/constants/projectConstants";
import { StatusInfo, ProjectStatus } from "@/src/app/types/dashboard";

export const getStatusInfo = (status?: ProjectStatus): Omit<StatusInfo, 'icon'> & { iconName: string } => {
  if (!status || !STATUS_CONFIG[status]) {
    return {
      dotColor: 'bg-gray-400 opacity-30',
      textColor: 'text-gray-700',
      bgColor: 'bg-gray-50',
      iconName: 'circle',
      text: 'No Status'
    };
  }

  const config = STATUS_CONFIG[status];
  return {
    dotColor: config.dotColor,
    textColor: config.textColor,
    bgColor: config.bgColor,
    iconName: config.iconName,
    text: config.text
  };
};

export const getGreetingInfo = (hour: number) => {
  let period: keyof typeof GREETING_CONFIG;
  
  if (hour < 12) {
    period = 'morning';
  } else if (hour < 18) {
    period = 'afternoon';
  } else {
    period = 'evening';
  }
  
  const config = GREETING_CONFIG[period];
  return {
    greeting: config.greeting,
    iconName: config.iconName
  };
};