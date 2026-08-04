import DateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useState } from "react";
import { Button, Platform, View } from "react-native";

dayjs.extend(customParseFormat);

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
    if (Platform.OS === "android") setShow(false);
    if (event.type === "set" && selectedDate) {
      if (mode === "time") {
        // merge time into existing date
        const newDate = dayjs(date)
          .hour(dayjs(selectedDate).hour())
          .minute(dayjs(selectedDate).minute())
          .toDate();
        setDate(newDate);
      } else {
        setDate(selectedDate);
      }
    }
  };

  return (
    <View>
      {Platform.OS === "android" && (
        <Button title={label} onPress={() => setShow(true)} />
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
