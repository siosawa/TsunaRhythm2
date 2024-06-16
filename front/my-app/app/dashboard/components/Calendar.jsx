// カレンダー
"use client";
import { Calendar } from "@/components/ui/calendar";
export function CalendarWhite() {
  const [date, setDate] = (React.useState < Date) | (undefined > new Date());

  return <Calendar mode="single" selected={date} onSelect={setDate} />;
}
