export const getServerUri = () => {
  return process.env.EXPO_PUBLIC_SERVER_URL;
};

export const isYourProfile = ({
  userId,
  guideUserId,
}: {
  userId?: string | null | undefined;
  guideUserId?: string | null | undefined;
}) => {
  if (!userId || !guideUserId) return false;
  return userId === guideUserId;
};

export const timeToDateParse = (time: string): Date => {
  const match = time.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?/);

  const date = new Date(2000, 0, 1, 0, 0, 0, 0);

  if (!match) return date;

  date.setHours(Number(match[1]), Number(match[2]), Number(match[3] ?? 0), 0);

  return date;
};
