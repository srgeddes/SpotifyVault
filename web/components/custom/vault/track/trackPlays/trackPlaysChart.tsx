"use client";

import React, { useMemo, useState, useEffect } from "react";
import { CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useTrackPlays } from "@/hooks/user/track-plays";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Loading from "@/components/custom/loading";

interface CustomTooltipProps {
	active?: boolean;
	payload?: { name: string; value: number }[];
	label?: string;
	aggregation: string;
	dataType: "plays" | "minutes" | "hours";
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label, aggregation, dataType }) => {
	if (active && payload && payload.length) {
		return (
			<div className="bg-background/50 backdrop-blur-md p-4 rounded-md shadow-lg border border-border ml-2">
				<p className="font-bold">
					{(() => {
						if (!label) return "No Date";

						if (aggregation === "day") {
							const parts = label.split("-");
							const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
							return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
						} else if (aggregation === "month") {
							const parts = label.split("-");
							const d = new Date(Number(parts[0]), Number(parts[1]) - 1, 1);
							return format(d, "MMM yyyy");
						} else if (aggregation === "year") {
							return label;
						} else {
							return label;
						}
					})()}
				</p>
				<div className="flex items-center gap-3 mt-2">
					<div>
						<p className="font-medium"> {dataType === "plays" ? "Tracks Played" : dataType === "minutes" ? "Minutes Played" : "Hours Listened"}</p>
						<p className="text-sm">
							<span className="font-semibold">
								{dataType === "minutes" || dataType === "hours" ? Number(payload[0].value).toFixed(2) : payload[0].value}
							</span>
						</p>
					</div>
				</div>
			</div>
		);
	}
	return null;
};

function getWeekNumber(date: Date) {
	const d = new Date(date.getTime());
	d.setHours(0, 0, 0, 0);
	d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
	const week1 = new Date(d.getFullYear(), 0, 4);
	return 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
}

export const TrackPlaysChart: React.FC<{ chartName: string }> = ({ chartName }) => {
	const { trackPlays, isLoading, isError } = useTrackPlays();
	const { resolvedTheme } = useTheme();
	const [timePeriod, setTimePeriod] = useState("all");
	const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });
	const [aggregation, setAggregation] = useState("day");
	const [lineColor, setLineColor] = useState(resolvedTheme === "dark" ? "#ffffff" : "#000000");
	const [dataType, setDataType] = useState<"plays" | "minutes" | "hours">("plays");

	useEffect(() => {
		setLineColor(resolvedTheme === "dark" ? "#ffffff" : "#000000");
	}, [resolvedTheme]);

	const groupedData = useMemo(() => {
		if (!trackPlays) return {};
		return trackPlays.reduce((acc: Record<string, number>, play) => {
			const dateObj = new Date(play.playedAt);

			if (timePeriod === "dates" && dateRange.from && dateRange.to) {
				const playDate = dateObj.toLocaleDateString("en-CA");
				const fromDate = dateRange.from.toLocaleDateString("en-CA");
				const toDate = dateRange.to.toLocaleDateString("en-CA");
				if (playDate < fromDate || playDate > toDate) return acc;
			}

			let dateKey = "";
			if (aggregation === "day") {
				dateKey = dateObj.toLocaleDateString("en-CA");
			} else if (aggregation === "week") {
				dateKey = `Week ${getWeekNumber(dateObj)} ${dateObj.getFullYear()}`;
			} else if (aggregation === "month") {
				dateKey = dateObj.getFullYear() + "-" + String(dateObj.getMonth() + 1).padStart(2, "0");
			} else if (aggregation === "year") {
				dateKey = String(dateObj.getFullYear());
			}

			if (dataType === "plays") {
				acc[dateKey] = (acc[dateKey] || 0) + 1;
			} else if (dataType === "minutes") {
				const minutesPlayed = play.durationMs ? play.durationMs / 60000 : 0;
				acc[dateKey] = (acc[dateKey] || 0) + minutesPlayed;
			} else if (dataType === "hours") {
				const hoursPlayed = play.durationMs ? play.durationMs / 3600000 : 0;
				acc[dateKey] = (acc[dateKey] || 0) + hoursPlayed;
			}
			return acc;
		}, {});
	}, [trackPlays, timePeriod, dateRange, aggregation, dataType]);

	const chartData = useMemo(() => {
		return Object.entries(groupedData)
			.map(([date, tracks]) => ({ date, tracks }))
			.sort((a, b) => a.date.localeCompare(b.date));
	}, [groupedData]);

	if (isLoading) return <Loading />;
	if (isError) return <div>Error loading track plays</div>;
	if (!trackPlays || trackPlays.length === 0) return <div>No track plays data available</div>;

	const maxDayLabels = 15;
	const tickInterval = aggregation === "day" && chartData.length > maxDayLabels ? Math.ceil(chartData.length / maxDayLabels) - 1 : 0;
	const maxSongs = chartData.reduce((max, item) => Math.max(max, item.tracks), 0);
	const yAxisUpperBound = Math.ceil(maxSongs / 10) * 12;
	const totalValue = chartData.reduce((sum, item) => sum + item.tracks, 0);
	const averageValue = Math.round(totalValue / chartData.length);

	const tickStep = 5;
	const ticks = [];
	for (let i = 0; i < yAxisUpperBound; i += tickStep) {
		ticks.push(i);
	}

	return (
		<Card className="w-full relative">
			<div className="absolute top-2 right-2 z-10 flex items-center gap-2">
				<Select
					value={timePeriod}
					onValueChange={(value) => {
						setTimePeriod(value);
						if (value === "all") {
							setDateRange({ from: null, to: null });
						}
					}}>
					<SelectTrigger className="w-[140px] border rounded p-1 text-sm cursor-pointer text-center">
						<SelectValue placeholder="Time period" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all" className="cursor-pointer">
							All
						</SelectItem>
						<SelectItem value="dates" className="cursor-pointer">
							Choose Dates
						</SelectItem>
					</SelectContent>
				</Select>

				<Select value={aggregation} onValueChange={setAggregation}>
					<SelectTrigger className="w-[100px] border rounded p-1 text-sm cursor-pointer text-center">
						<SelectValue placeholder="Aggregation" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="day" className="cursor-pointer text-center">
							Day
						</SelectItem>
						<SelectItem value="week" className="cursor-pointer text-center">
							Week
						</SelectItem>
						<SelectItem value="month" className="cursor-pointer text-center">
							Month
						</SelectItem>
						<SelectItem value="year" className="cursor-pointer text-center">
							Year
						</SelectItem>
					</SelectContent>
				</Select>

				<Select value={dataType} onValueChange={(value) => setDataType(value as "plays" | "minutes" | "hours")}>
					<SelectTrigger className="w-[100px] border rounded p-1 text-sm cursor-pointer text-center">
						<SelectValue placeholder="Data Type" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="plays">Plays</SelectItem>
						<SelectItem value="minutes">Minutes</SelectItem>
						<SelectItem value="hours">Hours</SelectItem>
					</SelectContent>
				</Select>

				{timePeriod === "dates" && (
					<Popover>
						<PopoverTrigger asChild>
							<Button variant={"outline"} className="w-[240px] justify-start text-left font-normal">
								<CalendarIcon className="mr-2 h-4 w-4" />
								{dateRange.from ? (
									dateRange.to ? (
										<>
											{format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
										</>
									) : (
										format(dateRange.from, "LLL dd, y")
									)
								) : (
									<span>Pick a date range</span>
								)}
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0">
							<Calendar
								initialFocus
								mode="range"
								defaultMonth={dateRange.from || undefined}
								selected={
									dateRange.from
										? dateRange.to
											? { from: dateRange.from, to: dateRange.to }
											: { from: dateRange.from, to: dateRange.from }
										: undefined
								}
								onSelect={(range) => {
									if (!range?.from) return;

									if (!range.to) {
										const dayStart = new Date(range.from);
										dayStart.setHours(0, 0, 0, 0);
										const dayEnd = new Date(range.from);
										dayEnd.setHours(23, 59, 59, 999);
										setDateRange({ from: dayStart, to: dayEnd });
									} else {
										setDateRange({
											from: range.from ?? null,
											to: range.to ?? null,
										});
									}
								}}
								numberOfMonths={2}
							/>
						</PopoverContent>
					</Popover>
				)}
			</div>

			<CardHeader>
				<CardTitle>{chartName}</CardTitle>
				<CardDescription>Number of tracks played or minutes listened over time</CardDescription>
			</CardHeader>

			<CardContent>
				<div className="h-[66vh]">
					<ResponsiveContainer width="100%" height="100%">
						<AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
							<CartesianGrid strokeDasharray="3 3" vertical={false} stroke={lineColor} opacity={0.1} />
							<XAxis
								dataKey="date"
								stroke={lineColor}
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								angle={-45}
								textAnchor="end"
								interval={tickInterval}
								tickFormatter={(value) => {
									if (aggregation === "day") {
										const parts = value.split("-");
										const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
										return format(d, "MMM d");
									} else if (aggregation === "week") {
										return value;
									} else if (aggregation === "month") {
										const parts = value.split("-");
										const d = new Date(Number(parts[0]), Number(parts[1]) - 1, 1);
										return format(d, "MMM yyyy");
									} else if (aggregation === "year") {
										return value;
									}
								}}
							/>
							<YAxis
								dataKey="plays"
								stroke={lineColor}
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								domain={[0, yAxisUpperBound]}
								ticks={ticks}
								label={{
									value: dataType === "plays" ? "Tracks Played" : dataType === "minutes" ? "Minutes Listened" : "Hours Listened",
									angle: -90,
									position: "insideLeft",
									offset: -5,
									dy: 40,
									style: { fill: lineColor },
								}}
							/>
							<Tooltip content={<CustomTooltip aggregation={aggregation} dataType={dataType} />} />{" "}
							<Legend
								wrapperStyle={{
									paddingTop: 40,
									visibility: "hidden",
								}}
							/>
							<Area
								type="monotone"
								dataKey="tracks"
								stroke={lineColor}
								fill={lineColor}
								fillOpacity={0.2}
								strokeWidth={3}
								dot={{ r: 2 }}
								activeDot={{ r: 8, stroke: lineColor, strokeWidth: 2 }}
							/>
						</AreaChart>
					</ResponsiveContainer>
				</div>
			</CardContent>

			<CardFooter>
				<div className="text-sm">
					Average of {averageValue} {dataType === "plays" ? "tracks" : dataType === "minutes" ? "minutes" : "hours"} per{" "}
					{aggregation === "day" ? "day" : aggregation === "week" ? "week" : aggregation === "month" ? "month" : "year"}
				</div>
			</CardFooter>
		</Card>
	);
};

export default TrackPlaysChart;
