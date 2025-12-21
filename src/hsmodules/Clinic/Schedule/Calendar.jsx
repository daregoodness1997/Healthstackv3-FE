// import React from "react";
// import { Calendar, momentLocalizer, Views } from "react-big-calendar";
// import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
// import moment from "moment";
// import { events } from "./data";
// import "react-big-calendar/lib/addons/dragAndDrop/styles.scss";
// import "react-big-calendar/lib/css/react-big-calendar.css";
// import { useState } from "react";
// import { Box } from "@mui/material";
// import { useMemo } from "react";

// const DragAndDropCalendar = withDragAndDrop(Calendar);
// moment.locale("en-GB");
// const localizer = momentLocalizer(moment);

// export default function ScheduleCalendar() {
//   const [myEvents, setMyEvents] = useState(events);

//   const defaultDate = useMemo(() => new Date(), []);
//   return (
//     <Box>
//       <DragAndDropCalendar
//         defaultDate={defaultDate}
//         defaultView={Views.MONTH}
//         events={myEvents}
//         localizer={localizer}
//         // onEventDrop={moveEvent}
//         // onEventResize={resizeEvent}
//         // onSelectEvent={openModal}
//         // onSelectSlot={openModal}
//         // onSelectEvent={handleSelectEvent}
//         // onSelectSlot={handleSelectSlot}
//         selectable
//         popup
//         resizable
//         style={{ height: 500, padding: "30px" }}
//       />
//     </Box>
//   );
// }
