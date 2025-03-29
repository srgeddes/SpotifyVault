"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { useTrackPlays } from "@/hooks/user/track-plays";
import { useTheme } from "next-themes";
import Loading from "@/components/custom/loading";

function formatSeconds(sec: number): string {
	const minutes = Math.floor(sec / 60);
	const seconds = sec % 60;
	return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

interface TrackDurationHistogramThumbnailProps {
	chartName: string;
}

export const TrackDurationHistogramThumbnail: React.FC<TrackDurationHistogramThumbnailProps> = ({ chartName }) => {
	const { trackPlays, isLoading, isError } = useTrackPlays();
	const { resolvedTheme } = useTheme();

	const [barColor, setBarColor] = useState(resolvedTheme === "dark" ? "#ffffff" : "#000000");
	const [axisColor, setAxisColor] = useState(resolvedTheme === "dark" ? "#ffffff" : "#000000");

	useEffect(() => {
		setBarColor(resolvedTheme === "dark" ? "#ffffff" : "#000000");
		setAxisColor(resolvedTheme === "dark" ? "#ffffff" : "#000000");
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

	if (isLoading) return <Loading />;
	if (isError) return <div>Error loading track plays</div>;
	if (!trackPlays || trackPlays.length === 0) return null;

	const maxCount = histogramData.reduce((max, item) => Math.max(max, item.count), 0);
	const yAxisUpperBound = maxCount + 1;

	return (
		<Link href={`/vault/track/${chartName}`} className="cursor-pointer">
			<Card className="hover:shadow-lg transition-shadow cursor-pointer">
				<CardContent className="p-2">
					<div className="text-center text-lg font-semibold mb-1">Song Duration Histogram</div>
					<ResponsiveContainer width="100%" height={200} className="pointer-events-none">
						<BarChart data={histogramData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
							<CartesianGrid strokeDasharray="3 3" vertical={false} stroke={axisColor} opacity={0.1} />
							<XAxis
								dataKey="bin"
								stroke={axisColor}
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								tick={false}
								label={{
									value: "Duration",
									position: "insideCenter",
									offset: 20,
									dx: -20,
									dy: 10,
									style: { fill: axisColor, fontSize: "14px" },
								}}
							/>
							<YAxis
								stroke={axisColor}
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								domain={[0, yAxisUpperBound]}
								tick={false}
								label={{
									value: "Count",
									angle: -90,
									position: "insideLeft",
									offset: 30,
									dy: 30,
									style: { fill: axisColor, fontSize: "14px" },
								}}
							/>
							<Bar dataKey="count" fill={barColor} />
						</BarChart>
					</ResponsiveContainer>
				</CardContent>
			</Card>
		</Link>
	);
};
