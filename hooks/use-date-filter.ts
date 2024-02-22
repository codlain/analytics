"use client";

import moment from "moment";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DateFilter, dateFormat } from "@/types/date-filter";
import { DateRangePickerValue } from "@/types/date-filter";

export default function useDateFilter() {
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const [dateRangePickerValue, setDateRangePickerValue] =
    useState<DateRangePickerValue>();

  const setDateFilter = useCallback(
    ({ from, to }: DateRangePickerValue) => {
      if (from && to) {
        params.set("date_from", moment(from).format(dateFormat));
        params.set("date_to", moment(to).format(dateFormat));
      } else {
        params.delete("date_from");
        params.delete("date_to");
      }
      replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const { from, to } = useMemo(() => {
    const today = moment().utc();
    const startDateParam = params.get("date_from") as string;
    const endDateParam = params.get("date_to") as string;

    const from =
      startDateParam ||
      moment(today).subtract(+DateFilter.Last7Days, "days").format(dateFormat);
    const to = endDateParam || moment(today).format(dateFormat);

    return { from, to };
  }, [params.get("date_from"), params.get("date_to")]);

  useEffect(() => {
    setDateRangePickerValue({
      from: moment(from).toDate(),
      to: moment(to).toDate(),
    });
  }, [from, to]);

  const onDateRangePickerValueChange = useCallback(
    ({ from, to, selectValue }: DateRangePickerValue) => {
      if (from && to) {
        setDateFilter({ from, to, selectValue });
      } else {
        setDateRangePickerValue({ from, to, selectValue });
      }
    },
    [setDateFilter]
  );

  return {
    from,
    to,
    dateRangePickerValue,
    onDateRangePickerValueChange,
  };
}
