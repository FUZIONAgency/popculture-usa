import { useState } from "react";
import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import { format } from "date-fns";
import { parse } from "date-fns";
import { startOfWeek } from "date-fns";
import { getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useNavigate } from "react-router-dom";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const conventionColors = [
  "#9b87f5", // Primary Purple
  "#7E69AB", // Secondary Purple
  "#6E59A5", // Tertiary Purple
  "#8B5CF6", // Vivid Purple
  "#D946EF", // Magenta Pink
  "#F97316", // Bright Orange
  "#0EA5E9", // Ocean Blue
];

interface Convention {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  description?: string;
  type?: 'tournament' | 'convention';  // Added type field to distinguish between tournaments and conventions
}

interface ConventionCalendarProps {
  conventions: Convention[];
  type?: 'tournament' | 'convention';  // Added type prop to determine navigation behavior
}

export const ConventionCalendar = ({ conventions, type = 'convention' }: ConventionCalendarProps) => {
  const navigate = useNavigate();
  const [view, setView] = useState<View>("month");

  const events = conventions?.map((conv, index) => ({
    id: conv.id,
    title: conv.name,
    start: new Date(conv.start_date),
    end: new Date(conv.end_date),
    desc: conv.description,
    color: conventionColors[index % conventionColors.length],
    type: conv.type || type,  // Use the item type if provided, otherwise fall back to prop type
  })) || [];

  const eventStyleGetter = (event: any) => {
    return {
      style: {
        backgroundColor: event.color,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: 'none',
        display: 'block'
      }
    };
  };

  const handleSelectEvent = (event: any) => {
    const eventType = event.type || type;
    const route = eventType === 'tournament' ? 'tournaments' : 'conventions';
    navigate(`/${route}/${event.id}`);
  };

  return (
    <div className="h-[600px] bg-white p-4 rounded-lg shadow-md">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
        views={["month", "week", "day"]}
        view={view}
        onView={(newView) => setView(newView)}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={handleSelectEvent}
        popup
        tooltipAccessor={(event) => event.desc}
      />
    </div>
  );
};