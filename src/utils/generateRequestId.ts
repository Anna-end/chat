export const generateRequestId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`; // substr → slice
};