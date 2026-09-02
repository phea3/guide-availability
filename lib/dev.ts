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
