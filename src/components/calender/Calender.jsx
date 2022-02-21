import React from "react";

import { ResponsiveCalendar } from "@nivo/calendar";

function Calender({ data }) {
  return (
    <ResponsiveCalendar
      data={data}
      from="2022-01-01"
      to="2022-12-12"
      emptyColor="#eeeeee"
      margin={{ top: 20, right: 20, bottom: 0, left: 0 }}
      colors={["#61cdbb", "#97e3d5", "#e8c1a0", "#f47560"]}
      monthBorderColor="#ffffff"
      dayBorderWidth={2}
      dayBorderColor="#ffffff"
      monthLegendPosition="before"
    />
  );
}

export default Calender;
