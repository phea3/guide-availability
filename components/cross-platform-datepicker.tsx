import DateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useState } from "react";
import { Button, Platform, View } from "react-native";

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

export default function CrossPlatformDatePicker({
  label,
  date,
  setDate,
  mode = "date",
}: {
  label: string;
  date: Date;
  setDate: (date: Date) => void;
  mode?: "date" | "time";
}) {
  const [show, setShow] = useState(Platform.OS === "ios");

  const onChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShow(false);
    }

    if (event.type !== "set" || !selectedDate) return;

    if (mode === "time") {
      // Keep the existing date and only replace hours/minutes.
      const newDate = new Date(date);

      newDate.setHours(
        selectedDate.getHours(),
        selectedDate.getMinutes(),
        0,
        0,
      );

      setDate(newDate);
      return;
    }

    setDate(selectedDate);
  };

  return (
    <View>
      {Platform.OS === "android" && (
        <Button
          title={
            mode === "time"
              ? `${label}: ${date.toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })}`
              : label
          }
          onPress={() => setShow(true)}
        />
      )}

      {show && (
        <DateTimePicker
          value={date}
          mode={mode}
          display={
            Platform.OS === "ios"
              ? "default"
              : mode === "date"
                ? "calendar"
                : "clock"
          }
          onChange={onChange}
        />
      )}
    </View>
  );
}
