import React, { useState, useMemo, MouseEvent, useCallback } from "react";

interface DataPoint {
  date_created: string; // e.g. "2025-01-20T10:00:00Z"
  visitors: number;
  status?: string;      // e.g. "approved", "confirmed", etc.
}

interface TimeChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
}

// Some example statuses. Adjust to fit your data
const statusOptions = ["all", "approved", "confirmed", "finished", "declined", "waiting"];
// Time range options
const timeRangeOptions = ["all", "week", "month", "year"];

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const TimeChart: React.FC<TimeChartProps> = ({
                                               data,
                                               width = 600,
                                               height = 300,
                                             }) => {
  // ----------------------------
  // 1) FILTER STATE & HANDLERS
  // ----------------------------
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<string>("all");

  // Helper: returns the date that is X days in the past
  const getPastDate = (daysAgo: number) => {
    const now = Date.now();
    return new Date(now - daysAgo * MS_PER_DAY);
  };

  // Filter data before charting
  const filteredData = useMemo(() => {
    // For each item in `data`, we check the status and time range
    return data.filter((item) => {
      // Status filter
      if (statusFilter !== "all" && item.status && item.status !== statusFilter) {
        return false;
      }

      // Time range filter
      if (timeRange === "all") {
        return true;
      } else {
        const created = new Date(item.date_created);

        if (timeRange === "week") {
          // Past 7 days
          const boundary = getPastDate(7);
          return created >= boundary;
        } else if (timeRange === "month") {
          // Past 30 days (approx)
          const boundary = getPastDate(30);
          return created >= boundary;
        } else if (timeRange === "year") {
          // Past 365 days (approx)
          const boundary = getPastDate(365);
          return created >= boundary;
        }
      }
      return true;
    });
    // eslint-disable-next-line
  }, [data, statusFilter, timeRange]);

  // ----------------------------
  // 2) CHART LOGIC
  // ----------------------------

  // Convert date_created to a numeric timestamp for easier scaling
  const parsedData = useMemo(() => {
    return filteredData
      .map((d) => ({
        ...d,
        timestamp: new Date(d.date_created).getTime(),
      }))
      // Ensure data is sorted by date
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [filteredData]);

  // If we have no data, handle boundaries gracefully
  const minDate = parsedData.length
    ? Math.min(...parsedData.map((d) => d.timestamp))
    : 0;
  const maxDate = parsedData.length
    ? Math.max(...parsedData.map((d) => d.timestamp))
    : 0;
  const minValue = parsedData.length
    ? Math.min(...parsedData.map((d) => d.visitors))
    : 0;
  const maxValue = parsedData.length
    ? Math.max(...parsedData.map((d) => d.visitors))
    : 0;

  // Margins around the plot area
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Scales: data -> pixel coordinates
  const scaleX = useCallback(
    (timestamp: number) => {
      if (maxDate === minDate) return 0; // Avoid divide-by-zero
      return ((timestamp - minDate) / (maxDate - minDate)) * chartWidth;
    },
    [minDate, maxDate, chartWidth]
  );

  const scaleY = useCallback(
    (val: number) => {
      if (maxValue === minValue) return chartHeight;
      // Flip Y so larger values are near the top
      return chartHeight - ((val - minValue) / (maxValue - minValue)) * chartHeight;
    },
    [minValue, maxValue, chartHeight]
  );

  // Array of { x, y, originalData }
  const points = useMemo(() => {
    return parsedData.map((d) => ({
      x: scaleX(d.timestamp),
      y: scaleY(d.visitors),
      original: d,
    }));
  }, [parsedData, scaleX, scaleY]);

  // Smooth path using cubic Bézier segments
  const generateSmoothPath = (pts: { x: number; y: number }[]): string => {
    if (pts.length < 1) return "";
    let path = `M ${pts[0].x},${pts[0].y}`;

    for (let i = 0; i < pts.length - 1; i++) {
      const curr = pts[i];
      const next = pts[i + 1];
      const midX = (curr.x + next.x) / 2;
      path += ` C ${midX},${curr.y} ${midX},${next.y} ${next.x},${next.y}`;
    }

    return path;
  };

  // Build the line path and the filled area
  const linePath = generateSmoothPath(points);
  const areaPath = useMemo(() => {
    if (points.length < 2) return "";
    let path = linePath;
    const lastPoint = points[points.length - 1];
    const firstPoint = points[0];
    path += ` L ${lastPoint.x},${chartHeight}`;
    path += ` L ${firstPoint.x},${chartHeight} Z`;
    return path;
  }, [points, linePath, chartHeight]);

  // Basic axis ticks
  const numXTicks = 5;
  const xTicks = Array.from({ length: numXTicks }, (_, i) => {
    if (minDate === maxDate) {
      return { x: 0, label: "" };
    }
    const ratio = i / (numXTicks - 1);
    const ts = minDate + ratio * (maxDate - minDate);
    return {
      x: scaleX(ts),
      label: new Date(ts).toLocaleDateString([], {
        month: "short",
        day: "numeric",
      }),
    };
  });

  const numYTicks = 4;
  const yTicks = Array.from({ length: numYTicks }, (_, i) => {
    if (minValue === maxValue) {
      return { y: 0, label: "" };
    }
    const ratio = i / (numYTicks - 1);
    const val = minValue + ratio * (maxValue - minValue);
    return {
      y: scaleY(val),
      label: val.toFixed(0),
    };
  });

  // Tooltip state
  const [hovered, setHovered] = useState<{
    visible: boolean;
    x: number;
    y: number;
    data?: DataPoint;
  }>({ visible: false, x: 0, y: 0 });

  // Mouse event handlers
  const handleMouseMove = (e: MouseEvent<SVGRectElement>) => {
    if (points.length === 0) return;
    const rect = (e.currentTarget as SVGRectElement).getBoundingClientRect();
    const mouseX = e.clientX - rect.left;

    // Find closest data point by x distance
    let closest = points[0];
    let minDist = Infinity;
    for (const p of points) {
      const dist = Math.abs(p.x - mouseX);
      if (dist < minDist) {
        minDist = dist;
        closest = p;
      }
    }
    setHovered({
      visible: true,
      x: closest.x,
      y: closest.y,
      data: closest.original,
    });
  };

  const handleMouseLeave = () => {
    setHovered((prev) => ({ ...prev, visible: false }));
  };

  // Position tooltip to avoid right‐edge clipping
  const tooltipWidth = 140;
  const tooltipOffsetX =
    hovered.x + 10 + tooltipWidth > chartWidth ? -tooltipWidth - 10 : 10;

  // ----------------------------
  // RENDER
  // ----------------------------
  return (
    <div className="p-4">
      {/* FILTER CONTROLS */}
      <div className="mb-4 flex gap-4">
        {/* STATUS FILTER */}
        <div>
          <label className="mr-2 font-semibold">Status:</label>
          <select
            className="border px-2 py-1 rounded"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statusOptions.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* TIME RANGE FILTER */}
        <div>
          <label className="mr-2 font-semibold">Time Range:</label>
          <select
            className="border px-2 py-1 rounded"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            {timeRangeOptions.map((tr) => (
              <option key={tr} value={tr}>
                {tr}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* CHART */}
      <svg width={width} height={height} className="bg-white border">
        <defs>
          <linearGradient id="gradientColor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" stopOpacity={0.7} />
            <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
        </defs>

        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {/* Transparent rect for mouse events */}
          <rect
            width={chartWidth}
            height={chartHeight}
            fill="transparent"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          />

          {/* Filled area */}
          <path d={areaPath} fill="url(#gradientColor)" stroke="none" />

          {/* Smooth line */}
          <path d={linePath} fill="none" stroke="#ef4444" strokeWidth={2} />

          {/* Axes */}
          <line x1={0} y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#999" />
          <line x1={0} y1={0} x2={0} y2={chartHeight} stroke="#999" />

          {/* X-ticks */}
          {xTicks.map((tick, i) => (
            <g key={i} transform={`translate(${tick.x}, 0)`}>
              <line y1={chartHeight} y2={chartHeight + 5} stroke="#999" />
              <text
                x={0}
                y={chartHeight + 15}
                fill="#333"
                fontSize={12}
                textAnchor="middle"
              >
                {tick.label}
              </text>
            </g>
          ))}

          {/* Y-ticks */}
          {yTicks.map((tick, i) => (
            <g key={i} transform={`translate(0, ${tick.y})`}>
              <line x1={-5} x2={0} stroke="#999" />
              <text x={-10} y={3} fill="#333" fontSize={12} textAnchor="end">
                {tick.label}
              </text>
            </g>
          ))}

          {/* Crosshair line */}
          {hovered.visible && hovered.data && (
            <line
              x1={hovered.x}
              x2={hovered.x}
              y1={0}
              y2={chartHeight}
              stroke="#ef4444"
              strokeDasharray="3,3"
              opacity={0.6}
            />
          )}

          {/* Hover circle & tooltip */}
          {hovered.visible && hovered.data && (
            <g style={{ transition: "opacity 0.2s" }}>
              <circle
                cx={hovered.x}
                cy={hovered.y}
                r={5}
                fill="#ef4444"
                stroke="#fff"
                strokeWidth={2}
              />
              <rect
                x={hovered.x + tooltipOffsetX}
                y={hovered.y - 40}
                width={tooltipWidth}
                height={30}
                fill="#ffffffcc"
                rx={4}
                ry={4}
              />
              <text
                x={hovered.x + tooltipOffsetX + 6}
                y={hovered.y - 20}
                fill="#333"
                fontSize={12}
              >
                {new Date(hovered.data.date_created).toLocaleDateString()} –{" "}
                {hovered.data.visitors}
                {hovered.data.status ? ` (${hovered.data.status})` : " visitors"}
              </text>
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};

export default TimeChart;
