"use client";

import React, { useMemo, useState, useEffect } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format, addDays } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useTrackPlays } from "@/hooks/user/track-plays";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CustomTooltipProps {
	active?: boolean;
	payload?: any[];
	label?: string;
	aggregation: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label, aggregation }) => {
	if (active && payload && payload.length) {
		return (
			<div className="bg-background/95 backdrop-blur-sm p-4 rounded-md shadow-lg border border-border ml-2">
				<p className="font-bold">
					{(() => {
						if (aggregation === "day") {
							const d = new Date(label + "T00:00:00");
							return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
						} else if (aggregation === "month") {
							const d = new Date(label + "-01T00:00:00");
							return format(d, "MMM yyyy");
						} else if (aggregation === "year") {
							return label;
						} else {
							return label;
						}
					})()}
				</p>{" "}
				<div className="flex items-center gap-3 mt-2">
					<div>
						<p className="font-medium">Songs Played</p>
						<p className="text-sm">
							<span className="font-semibold">{payload[0].value}</span> songs
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
	const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

	const [aggregation, setAggregation] = useState("day");

	const [lineColor, setLineColor] = useState(resolvedTheme === "dark" ? "#ffffff" : "#000000");

	useEffect(() => {
		setLineColor(resolvedTheme === "dark" ? "#ffffff" : "#000000");
	}, [resolvedTheme]);

	const groupedData = useMemo(() => {
		if (!trackPlays) return {};
		return trackPlays.reduce((acc: Record<string, number>, play) => {
			const dateObj = new Date(play.playedAt);

			if (timePeriod === "dates" && dateRange.from && dateRange.to) {
				if (dateObj < dateRange.from || dateObj > dateRange.to) return acc;
			}

			let dateKey = "";
			if (aggregation === "day") {
				dateKey = dateObj.toISOString().slice(0, 10);
			} else if (aggregation === "week") {
				dateKey = `Week ${getWeekNumber(dateObj)} ${dateObj.getFullYear()}`;
			} else if (aggregation === "month") {
				dateKey = format(dateObj, "yyyy-MM");
			} else if (aggregation === "year") {
				dateKey = format(dateObj, "yyyy");
			}
			acc[dateKey] = (acc[dateKey] || 0) + 1;
			return acc;
		}, {});
	}, [trackPlays, timePeriod, dateRange, aggregation]);

	const chartData = useMemo(() => {
		return Object.entries(groupedData)
			.map(([date, songs]) => ({ date, songs }))
			.sort((a, b) => a.date.localeCompare(b.date));
	}, [groupedData]);

	if (isLoading) return <div>Loading...</div>;
	if (isError) return <div>Error loading track plays</div>;
	if (!trackPlays || trackPlays.length === 0) return <div>No track plays data available</div>;

	const totalSongs = chartData.reduce((sum, item) => sum + item.songs, 0);
	const averageSongsPerDay = Math.round(totalSongs / chartData.length);
	const tickInterval = chartData.length > 60 ? Math.floor(chartData.length / 30) : 0;

	return (
		<Card className="w-full relative">
			<div className="absolute top-2 right-2 z-10 flex items-center gap-2">
				<Select
					value={timePeriod}
					onValueChange={(value) => {
						setTimePeriod(value);
						if (value === "all") {
							setDateRange({});
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
							<Calendar initialFocus mode="range" defaultMonth={dateRange.from} selected={dateRange} onSelect={setDateRange} numberOfMonths={2} />
						</PopoverContent>
					</Popover>
				)}
			</div>

			<CardHeader>
				<CardTitle>Daily Song Plays</CardTitle>
				<CardDescription>Number of songs played each day</CardDescription>
			</CardHeader>

			<CardContent>
				<div className="h-150">
					<ResponsiveContainer width="100%" height="100%">
						<LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
										const d = new Date(value + "T00:00:00");
										return format(d, "MMM d");
									} else if (aggregation === "week") {
										return value;
									} else if (aggregation === "month") {
										const d = new Date(value + "-01T00:00:00");
										return format(d, "MMM yyyy");
									} else if (aggregation === "year") {
										return value;
									}
								}}
							/>
							<YAxis
								dataKey="songs"
								stroke={lineColor}
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								label={{
									value: "Songs Played",
									angle: -90,
									position: "insideLeft",
									offset: -5,
									dy: 40,
									style: { fill: lineColor },
								}}
							/>
							<Tooltip content={<CustomTooltip aggregation={aggregation} />} />
							<Legend
								wrapperStyle={{
									paddingTop: 40,
									visibility: "hidden",
								}}
							/>
							<Line
								type="monotone"
								dataKey="songs"
								stroke={lineColor}
								strokeWidth={3}
								dot={{ r: 4 }}
								activeDot={{ r: 8, stroke: lineColor, strokeWidth: 2 }}
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
			</CardContent>

			<CardFooter>
				<div className="text-sm">
					Average of {averageSongsPerDay} songs per{" "}
					{aggregation === "day" ? "day" : aggregation === "week" ? "week" : aggregation === "month" ? "month" : "year"}
				</div>{" "}
			</CardFooter>
		</Card>
	);
};

export default TrackPlaysChart;
