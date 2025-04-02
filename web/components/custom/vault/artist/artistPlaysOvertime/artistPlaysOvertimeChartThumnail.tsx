"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { CartesianGrid, LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useTrackPlays } from "@/hooks/user/track-plays";
import { useTheme } from "next-themes";
import Loading from "@/components/custom/loading";

export interface ArtistPlaysChartOvertimeThumbnailProps {
	chartName: string;
}

export const ArtistPlaysChartOvertimeThumbnail: React.FC<ArtistPlaysChartOvertimeThumbnailProps> = ({ chartName }) => {
	const { trackPlays, isLoading, isError } = useTrackPlays();
	const { resolvedTheme } = useTheme();

	const [lineColor, setLineColor] = useState(resolvedTheme === "dark" ? "#ffffff" : "#000000");
	const [axisColor, setAxisColor] = useState(resolvedTheme === "dark" ? "#ffffff" : "#000000");

	useEffect(() => {
		setLineColor(resolvedTheme === "dark" ? "#ffffff" : "#000000");
		setAxisColor(resolvedTheme === "dark" ? "#ffffff" : "#000000");
	}, [resolvedTheme]);

	const artistsWithPlayCounts = useMemo(() => {
		if (!trackPlays) return [];
		const counts: Record<string, number> = {};
		trackPlays.forEach((play: { artistIds?: string; artistName?: string; trackId: string; playedAt: string }) => {
			if (play.artistIds) {
				const ids = play.artistIds.split(",").map((id: string) => id.trim());
				ids.forEach((id: string) => {
					if (id) counts[id] = (counts[id] || 0) + 1;
				});
			} else {
				const name = play.artistName ?? play.trackId;
				counts[name] = (counts[name] || 0) + 1;
			}
		});
		return Object.entries(counts).map(([id, count]) => ({
			id,
			playCount: count,
		}));
	}, [trackPlays]);

	const topArtistId = useMemo(() => {
		if (artistsWithPlayCounts.length === 0) return null;
		return artistsWithPlayCounts.sort((a, b) => b.playCount - a.playCount)[0].id;
	}, [artistsWithPlayCounts]);

	const filteredTrackPlays = useMemo(() => {
		if (!trackPlays || !topArtistId) return [];
		return trackPlays.filter((play: { artistIds?: string; playedAt: string }) => {
			if (play.artistIds) {
				const ids = play.artistIds.split(",").map((id: string) => id.trim());
				return ids.includes(topArtistId);
			}
			return false;
		});
	}, [trackPlays, topArtistId]);

	const groupedData = useMemo(() => {
		if (!filteredTrackPlays) return {};
		return filteredTrackPlays.reduce((acc: Record<string, number>, play: { playedAt: string }) => {
			const dateObj = new Date(play.playedAt);
			const dateKey = dateObj.toISOString().slice(0, 10);
			acc[dateKey] = (acc[dateKey] || 0) + 1;
			return acc;
		}, {});
	}, [filteredTrackPlays]);

	const chartData = useMemo(() => {
		return Object.entries(groupedData)
			.map(([date, plays]) => ({ date, plays }))
			.sort((a, b) => a.date.localeCompare(b.date));
	}, [groupedData]);

	const maxPlays = chartData.reduce((max, item) => Math.max(max, item.plays), 0);
	const yAxisUpperBound = Math.ceil(maxPlays / 10) * 12;

	if (isLoading) return <Loading />;
	if (isError) return <div>Error loading track plays</div>;
	if (!trackPlays || trackPlays.length === 0) return null;

	return (
		<Link href={`/vault/artist/${chartName}`} className="cursor-pointer">
			<Card className="hover:shadow-lg transition-shadow cursor-pointer">
				<CardContent className="p-2">
					<div className="text-center text-lg font-semibold mb-1">Artist Plays</div>
					<ResponsiveContainer width="100%" height={200} className="pointer-events-none">
						<LineChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
							<CartesianGrid strokeDasharray="3 3" vertical={false} stroke={axisColor} opacity={0.1} />
							<XAxis
								dataKey="date"
								stroke={axisColor}
								tick={false}
								axisLine={false}
								tickMargin={8}
								label={{
									value: "Time",
									position: "insideBottom",
									dy: 10,
									dx: -40,
									style: { fill: axisColor, fontSize: "14px" },
								}}
							/>
							<YAxis
								dataKey="plays"
								stroke={axisColor}
								tick={false}
								axisLine={false}
								tickMargin={8}
								domain={[0, yAxisUpperBound]}
								label={{
									value: "Track Plays",
									angle: -90,
									position: "insideLeft",
									dx: 10,
									dy: 30,
									style: { fill: axisColor, fontSize: "14px" },
								}}
							/>
							<Line type="monotone" dataKey="plays" stroke={lineColor} strokeWidth={3} dot={false} />
						</LineChart>
					</ResponsiveContainer>
				</CardContent>
			</Card>
		</Link>
	);
};

export default ArtistPlaysChartOvertimeThumbnail;
