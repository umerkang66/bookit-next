import { useState, type FC, useEffect, useRef } from "react";
import DP from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export type Dates = {
  checkInDate: Date | null;
  checkOutDate: Date | null;
};

interface Props {
  onChange?: (dates: Dates) => void;
  excludedDates?: Date[];
}

const DatePicker: FC<Props> = ({ onChange, excludedDates }) => {
  onChange = useRef(onChange).current;
  const [dates, setDates] = useState<Dates>({
    checkInDate: null,
    checkOutDate: null,
  });

  useEffect(() => {
    onChange && onChange(dates);
    // eslint-disable-next-line
  }, [dates.checkOutDate, onChange]);

  useEffect(() => {
    // A HACK
    document
      .querySelector(".react-datepicker__month-container")
      ?.classList.add("w-full");
  }, []);

  return (
    <DP
      calendarClassName="w-full"
      minDate={new Date()}
      excludeDates={excludedDates}
      selected={dates.checkInDate}
      startDate={dates.checkInDate}
      endDate={dates.checkOutDate}
      inline
      selectsRange
      onChange={([checkInDate, checkOutDate]) => {
        setDates({ checkInDate, checkOutDate });
      }}
    />
  );
};

export { DatePicker };
