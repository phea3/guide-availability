export type AvailableDayType = {
  id: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  remark?: string;
  status?: string;
  availableTimes?: AvailableTimeType[];
};

export type AvailableDraftDayType = {
  id: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  remark?: string;
  status?: string;
  availableTimes?: AvailableDraftTimeType[];
};

export type AvailableTimeType = {
  id: string;
  availableDayId: string;
  startTime: string;
  endTime: string;
  remark: string;
  status: string;
};

export type AvailableDraftTimeType = {
  index: string;
  id?: string | null;
  availableDayId: string;
  startTime: string;
  endTime: string;
  remark: string;
  status: string;
};
