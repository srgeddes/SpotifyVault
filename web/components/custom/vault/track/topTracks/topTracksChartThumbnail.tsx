"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { CartesianGrid, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useTrackPlays } from "@/hooks/user/track-plays";
import { useTheme } from "next-themes";
import Loading from "@/components/custom/loading";

interface TopTracksChartThumbnailProps {
	chartName: string;
}

export const TopTracksChartThumbnail: React.FC<TopTracksChartThumbnailProps> = ({ chartName }) => {
	const { trackPlays, isLoading, isError } = useTrackPlays();
	const { resolvedTheme } = useTheme();

	const [barColor, setBarColor] = useState(resolvedTheme === "dark" ? "#ffffff" : "#000000");
	const [axisColor, setAxisColor] = useState(resolvedTheme === "dark" ? "#ffffff" : "#000000");

	useEffect(() => {
		setBarColor(resolvedTheme === "dark" ? "#ffffff" : "#000000");
		setAxisColor(resolvedTheme === "dark" ? "#ffffff" : "#000000");
	}, [resolvedTheme]);

	const topTracksData = useMemo(() => {
		if (!trackPlays) return [];
		const counts: Record<string, { trackName: string; count: number }> = {};
		trackPlays.forEach((play: { trackName?: string; trackId: string }) => {
			const name: string = play.trackName ?? play.trackId;
			if (counts[name]) {
				counts[name].count += 1;
			} else {
				counts[name] = { trackName: name, count: 1 };
			}
		});
		return Object.values(counts)
			.sort((a, b) => b.count - a.count)
			.slice(0, 20)
			.sort((a, b) => b.count - a.count);
	}, [trackPlays]);

	if (isLoading) return <Loading />;
	if (isError) return <div>Error loading track plays</div>;
	if (!trackPlays || trackPlays.length === 0) return null;

	return (
		<Link href={`/vault/track/${chartName}`} className="cursor-pointer">
			<Card className="hover:shadow-lg transition-shadow cursor-pointer">
				<CardContent className="p-2">
					<div className="text-center text-lg font-semibold mb-1">Top Tracks</div>
					<ResponsiveContainer width="100%" height={200} className="pointer-events-none">
						<BarChart data={topTracksData} margin={{ top: 5, right: 10, left: 10, bottom: 50 }}>
							<CartesianGrid strokeDasharray="3 3" vertical={false} stroke={axisColor} opacity={0.1} />
							<XAxis
								dataKey="trackName"
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
							/>{" "}
							<YAxis
								dataKey="count"
								stroke={axisColor}
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								tick={false}
								domain={[0, (dataMax: number) => dataMax + 10]}
								label={{
									value: "Track Plays",
									angle: -90,
									position: "insideLeft",
									offset: 30,
									dy: 40,
									style: { fill: axisColor, fontSize: "14px" },
								}}
							/>
							<Bar
								className="cursor-pointer"
								dataKey="count"
								fill={barColor}
								onClick={(data) => {
									if (data && data.payload && data.payload.id) {
										window.location.href = `spotify:track:${data.payload.id}`;
									}
								}}
								radius={[6, 6, 0, 0]}
							/>{" "}
						</BarChart>
					</ResponsiveContainer>
				</CardContent>
			</Card>
		</Link>
	);
};

export default TopTracksChartThumbnail;
