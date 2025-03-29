"use client";

import React, { useMemo, useState, useEffect } from "react";
import { CartesianGrid, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "next-themes";
import { useTrackPlays } from "@/hooks/user/track-plays";

interface CustomTooltipProps {
	active?: boolean;
	payload?: { name: string; value: number }[];
	label?: string;
	aggregation: string;
	dataType: "plays" | "minutes";
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label, dataType }) => {
	if (active && payload && payload.length) {
		return (
			<div className="bg-background/95 backdrop-blur-sm p-4 rounded-md shadow-lg border border-border ml-2">
				<p className="font-bold">{`Duration: ${label}`}</p>{" "}
				<div className="flex items-center gap-3 mt-2">
					<div>
						<p className="font-medium">{dataType === "plays" ? "Tracks Played" : "Minutes Played"}</p>
						<p className="text-sm">
							<span className="font-semibold">{dataType === "minutes" ? Number(payload[0].value).toFixed(2) : payload[0].value}</span>
						</p>
					</div>
				</div>
			</div>
		);
	}
	return null;
};

function formatSeconds(sec: number): string {
	const minutes = Math.floor(sec / 60);
	const seconds = sec % 60;
	return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export const TrackDurationHistogramChart: React.FC<{ chartName: string }> = ({ chartName }) => {
	const { trackPlays, isLoading, isError } = useTrackPlays();
	const { resolvedTheme } = useTheme();
	const [barColor, setBarColor] = useState(resolvedTheme === "dark" ? "#ffffff" : "#000000");
	const [dataType] = useState<"plays" | "minutes">("plays");

	useEffect(() => {
		setBarColor(resolvedTheme === "dark" ? "#ffffff" : "#000000");
	}, [resolvedTheme]);

	const histogramData = useMemo(() => {
		if (!trackPlays) return [];
		const bins: Record<string, number> = {};
		const binSize = 0.5; // 0.5 minutes = 30-second bins. (Use 0.25 for 15-second bins.)
		trackPlays.forEach((play) => {
			const duration = play.durationMs ? play.durationMs / 60000 : 0; // duration in minutes
			const bin = Math.floor(duration / binSize) * binSize; // e.g. 2.75 becomes 2.5
			const startSeconds = Math.round(bin * 60);
			const endSeconds = Math.round((bin + binSize) * 60);
			const binLabel = `${formatSeconds(startSeconds)}-${formatSeconds(endSeconds)}`;
			bins[binLabel] = (bins[binLabel] || 0) + 1;
		});
		return Object.entries(bins)
			.map(([bin, count]) => {
				const [startStr] = bin.split("-");
				const [minStr, secStr] = startStr.split(":");
				const startVal = parseInt(minStr, 10) * 60 + parseInt(secStr, 10);
				return { bin, count, start: startVal };
			})
			.sort((a, b) => a.start - b.start)
			.map(({ bin, count }) => ({ bin, count }));
	}, [trackPlays]);

	if (isLoading) return <div>Loading...</div>;
	if (isError) return <div>Error loading track plays</div>;
	if (!trackPlays || trackPlays.length === 0) return <div>No track plays data available</div>;

	const maxCount = histogramData.reduce((max, item) => Math.max(max, item.count), 0);
	const yAxisUpperBound = maxCount + 1;

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle>{chartName}</CardTitle>
				<CardDescription>Distribution of song durations (in minutes)</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="h-120">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart data={histogramData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
							<CartesianGrid strokeDasharray="3 3" stroke={barColor} opacity={0.1} />
							<XAxis dataKey="bin" stroke={barColor} />
							<YAxis stroke={barColor} domain={[0, yAxisUpperBound]} />
							<Tooltip content={<CustomTooltip aggregation="duration" dataType={dataType} />} />
							<Legend />
							<Bar dataKey="count" fill={barColor} />
						</BarChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
			<CardFooter>
				<div className="text-sm">Histogram of song duration bins (in minutes)</div>
			</CardFooter>
		</Card>
	);
};

export default TrackDurationHistogramChart;
