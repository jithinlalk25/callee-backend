export const hasFormExpired = (dateTimeStr: string): boolean => {
  const [datePart, timePart] = dateTimeStr.split('-');
  const [day, month, year] = datePart.split('/').map(Number);
  const [hours, minutes] = timePart.split(':').map(Number);
  const targetDate = new Date(year, month - 1, day, hours, minutes);
  const now = new Date();
  return now > targetDate;
};
