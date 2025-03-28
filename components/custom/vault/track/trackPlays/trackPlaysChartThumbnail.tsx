"use client";
import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { CartesianGrid, LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useTrackPlays } from "@/hooks/user/track-plays";
import { useTheme } from "next-themes";

interface TrackPlaysChartThumbnailProps {
	chartName: string;
}

export const TrackPlaysChartThumbnail: React.FC<TrackPlaysChartThumbnailProps> = ({ chartName }) => {
	const { trackPlays, isLoading, isError } = useTrackPlays();
	const { resolvedTheme } = useTheme();

	const [lineColor, setLineColor] = useState(resolvedTheme === "dark" ? "#ffffff" : "#000000");
	const [axisColor, setAxisColor] = useState(resolvedTheme === "dark" ? "#ffffff" : "#000000");

	useEffect(() => {
		setLineColor(resolvedTheme === "dark" ? "#ffffff" : "#000000");
		setAxisColor(resolvedTheme === "dark" ? "#ffffff" : "#000000");
	}, [resolvedTheme]);

	const groupedData = useMemo(() => {
		if (!trackPlays) return {};
		return trackPlays.reduce((acc: Record<string, number>, play) => {
			const dateObj = new Date(play.playedAt);
			if (isNaN(dateObj.getTime())) return acc;
			const dateKey = dateObj.toISOString().slice(0, 10);
			acc[dateKey] = (acc[dateKey] || 0) + 1;
			return acc;
		}, {});
	}, [trackPlays]);

	const chartData = useMemo(() => {
		return Object.entries(groupedData)
			.map(([date, songs]) => ({ date, songs }))
			.sort((a, b) => a.date.localeCompare(b.date));
	}, [groupedData]);

	if (isLoading) return <div>Loading...</div>;
	if (isError) return <div>Error loading track plays</div>;
	if (!trackPlays || trackPlays.length === 0) return null;

	return (
		<Link href={`/vault/track/${chartName}`} className="cursor-pointer">
			<Card className="hover:shadow-lg transition-shadow cursor-pointer">
				<CardContent className="p-2">
					<div className="text-center text-lg font-semibold mb-1">{chartName}</div>
					<ResponsiveContainer width="100%" height={200} className="pointer-events-none">
						<LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
							<CartesianGrid strokeDasharray="3 3" vertical={false} stroke={axisColor} opacity={0.1} />
							<XAxis
								dataKey="date"
								stroke={axisColor}
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								tick={false}
								label={{
									value: "Time",
									position: "insideCenter",
									offset: 20,
									dx: -20,
									dy: 10,
									style: { fill: axisColor, fontSize: "14px" },
								}}
							/>
							<YAxis
								dataKey="songs"
								stroke={axisColor}
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								tick={false}
								label={{
									value: "Song Plays",
									angle: -90,
									position: "insideLeft",
									offset: 30,
									dy: 40,
									style: { fill: axisColor, fontSize: "14px" },
								}}
							/>
							<Line type="monotone" dataKey="songs" stroke={lineColor} strokeWidth={3} dot={false} activeDot={false} />
						</LineChart>
					</ResponsiveContainer>
				</CardContent>
			</Card>
		</Link>
	);
};
