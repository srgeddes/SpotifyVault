"use client";

import React, { useMemo, useState, useEffect } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useTrackPlays } from "@/hooks/user/track-plays";
import Loading from "@/components/custom/loading";
import { useArtistMetadata } from "@/hooks/artist/useArtistMetadata";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";

interface CustomTooltipProps {
	active?: boolean;
	payload?: { name: string; value: number }[];
	label?: string;
	aggregation: string;
	image?: string;
	artistName?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label, aggregation, image, artistName }) => {
	if (active && payload && payload.length) {
		return (
			<div className="flex flex-col justify-center items-center">
				<div className="bg-background/20 backdrop-blur-lg p-4 rounded-md shadow-lg border border-border ml-2">
					<div className="text-left">
						<p className="font-bold">
							{aggregation === "day"
								? new Date(label + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" })
								: aggregation === "month"
								? format(new Date(label + "-01T00:00:00"), "MMM yyyy")
								: aggregation === "year"
								? label
								: label}
						</p>
					</div>
					<div className="flex justify-start items-start my-2">
						{image && <Image src={image} alt="Artist Image" width={80} height={80} className="rounded-full" />}
					</div>
					<div className="">
						{artistName && <p className="text-sm font-medium">{artistName}</p>}
						<p className="font-medium text-sm">
							Track Plays: <span className="font-semibold">{payload[0].value}</span>
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

interface TrackPlay {
	artistIds?: string;
	playedAt: string;
	trackId?: string;
	trackName?: string;
}

export const ArtistPlaysChart: React.FC<{ chartName: string }> = ({ chartName }) => {
	const { trackPlays, isLoading, isError } = useTrackPlays();
	const { resolvedTheme } = useTheme();
	const [timePeriod, setTimePeriod] = useState("all");
	const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({
		from: null,
		to: null,
	});
	const [aggregation, setAggregation] = useState("day");
	const [lineColor, setLineColor] = useState(resolvedTheme === "dark" ? "#ffffff" : "#000000");

	useEffect(() => {
		setLineColor(resolvedTheme === "dark" ? "#ffffff" : "#000000");
	}, [resolvedTheme]);

	const topArtistId = useMemo(() => {
		if (!trackPlays) return null;
		const counts: Record<string, number> = {};

		trackPlays.forEach((play: TrackPlay) => {
			if (play.artistIds) {
				const ids = play.artistIds.split(",").map((id: string) => id.trim());
				ids.forEach((id: string) => {
					if (id) counts[id] = (counts[id] || 0) + 1;
				});
			}
		});

		const sorted = Object.entries(counts).sort(([, a], [, b]) => b - a);
		return sorted.length > 0 ? sorted[0][0] : null;
	}, [trackPlays]);

	const {
		metadata: artistMetadata,
		isLoading: isArtistMetadataLoading,
		isError: isArtistMetadataError,
	} = useArtistMetadata(topArtistId ? [topArtistId] : []);
	const artistName = artistMetadata && artistMetadata.length > 0 ? artistMetadata[0].name : "Unknown Artist";

	const filteredTrackPlays = useMemo(() => {
		if (!trackPlays || !topArtistId) return [];
		return trackPlays.filter((play: TrackPlay) => {
			if (!play.artistIds) return false;
			const ids = play.artistIds.split(",").map((id: string) => id.trim());
			return ids.includes(topArtistId);
		});
	}, [trackPlays, topArtistId]);

	const groupedData = useMemo(() => {
		if (!filteredTrackPlays) return {};
		return filteredTrackPlays.reduce((acc: Record<string, number>, play: TrackPlay) => {
			const dateObj = new Date(play.playedAt);
			if (timePeriod === "dates" && dateRange.from && dateRange.to) {
				const playDate = dateObj.toISOString().slice(0, 10);
				const fromDate = dateRange.from.toISOString().slice(0, 10);
				const toDate = dateRange.to.toISOString().slice(0, 10);
				if (playDate < fromDate || playDate > toDate) return acc;
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
	}, [filteredTrackPlays, timePeriod, dateRange, aggregation]);

	const chartData = useMemo(() => {
		return Object.entries(groupedData)
			.map(([date, plays]) => ({ date, plays }))
			.sort((a, b) => a.date.localeCompare(b.date));
	}, [groupedData]);

	if (isLoading || isArtistMetadataLoading) return <Loading />;
	if (isError || isArtistMetadataError) return <div>Error loading data</div>;
	if (!trackPlays || trackPlays.length === 0) return <div>No track plays data available</div>;
	if (!filteredTrackPlays || filteredTrackPlays.length === 0) return <div>No plays data available for the selected artist</div>;

	const tickInterval = chartData.length > 60 ? Math.floor(chartData.length / 30) : 0;
	const maxPlays = chartData.reduce((max, item) => Math.max(max, item.plays), 0);
	const yAxisUpperBound = Math.ceil(maxPlays / 10) * 12;
	const totalPlays = chartData.reduce((sum, item) => sum + item.plays, 0);
	const averagePlays = Math.round(totalPlays / chartData.length);

	const tickStep = 5;
	const ticks = [];
	for (let i = 0; i <= yAxisUpperBound; i += tickStep) {
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
				<CardTitle>{`${chartName} - ${artistName}`}</CardTitle>
				<CardDescription>Number of track plays for the selected artist</CardDescription>
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
								dataKey="plays"
								stroke={lineColor}
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								domain={[0, yAxisUpperBound]}
								ticks={ticks}
								label={{
									value: "Track Plays",
									angle: -90,
									position: "insideLeft",
									offset: -5,
									dy: 40,
									style: { fill: lineColor },
								}}
							/>
							<Tooltip
								content={<CustomTooltip aggregation={aggregation} image={artistMetadata[0]?.imageUrl} artistName={artistMetadata[0].name} />}
							/>
							<Legend wrapperStyle={{ paddingTop: 40, visibility: "hidden" }} />
							<Line
								type="monotone"
								dataKey="plays"
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
					Average of {averagePlays} plays per{" "}
					{aggregation === "day" ? "day" : aggregation === "week" ? "week" : aggregation === "month" ? "month" : "year"}
				</div>
			</CardFooter>
		</Card>
	);
};

export default ArtistPlaysChart;
