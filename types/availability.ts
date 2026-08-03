export type AvailableDayType = {
  id: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  remark?: string;
  status?: string;
  availableTimes?: AvailableTimeType[];
};

export type AvailableTimeType = {
  id: string;
  availableDayId: string;
  startTime: string;
  endTime: string;
  remark: string;
  status: string;
  createdAt: string;
};
