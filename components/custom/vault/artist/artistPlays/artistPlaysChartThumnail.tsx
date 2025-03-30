"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { CartesianGrid, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useTrackPlays } from "@/hooks/user/track-plays";
import { useTheme } from "next-themes";
import Loading from "@/components/custom/loading";

export interface ArtistPlaysChartThumbnailProps {
	chartName: string;
}

export const ArtistPlaysChartThumbnail: React.FC<ArtistPlaysChartThumbnailProps> = ({ chartName }) => {
	const { trackPlays, isLoading, isError } = useTrackPlays();
	const { resolvedTheme } = useTheme();

	const [barColor, setBarColor] = useState(resolvedTheme === "dark" ? "#ffffff" : "#000000");
	const [axisColor, setAxisColor] = useState(resolvedTheme === "dark" ? "#ffffff" : "#000000");

	useEffect(() => {
		setBarColor(resolvedTheme === "dark" ? "#ffffff" : "#000000");
		setAxisColor(resolvedTheme === "dark" ? "#ffffff" : "#000000");
	}, [resolvedTheme]);

	// Group track plays by artistName (assuming each play has a property "artistName", or fallback to trackId)
	const topArtistData = useMemo(() => {
		if (!trackPlays) return [];
		const counts: Record<string, { artistName: string; count: number }> = {};
		trackPlays.forEach((play: { artistName?: string; trackId: string }) => {
			const name: string = play.artistName ?? play.trackId;
			if (counts[name]) {
				counts[name].count += 1;
			} else {
				counts[name] = { artistName: name, count: 1 };
			}
		});
		// Get the top artist by count
		const topArtist = Object.values(counts).sort((a, b) => b.count - a.count)[0];
		// For simplicity, we just return one data point for the thumbnail.
		return topArtist ? [{ artistName: topArtist.artistName, count: topArtist.count }] : [];
	}, [trackPlays]);

	if (isLoading) return <Loading />;
	if (isError) return <div>Error loading track plays</div>;
	if (!trackPlays || trackPlays.length === 0) return null;

	return (
		<Link href={`/vault/artist/${chartName}`} className="cursor-pointer">
			<Card className="hover:shadow-lg transition-shadow cursor-pointer">
				<CardContent className="p-2">
					<div className="text-center text-lg font-semibold mb-1">Artist Plays</div>
					<ResponsiveContainer width="100%" height={200} className="pointer-events-none">
						<BarChart data={topArtistData} margin={{ top: 5, right: 10, left: 10, bottom: 20 }}>
							<CartesianGrid strokeDasharray="3 3" vertical={false} stroke={axisColor} opacity={0.1} />
							<XAxis
								dataKey="artistName"
								stroke={axisColor}
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								tick={false}
								label={{
									value: "Artist",
									position: "insideBottom",
									offset: -5,
									style: { fill: axisColor, fontSize: "14px" },
								}}
							/>
							<YAxis
								dataKey="count"
								stroke={axisColor}
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								tick={false}
								domain={[0, (dataMax: number) => dataMax + 5]}
								label={{
									value: "Plays",
									angle: -90,
									position: "insideLeft",
									offset: 30,
									dy: 40,
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

export default ArtistPlaysChartThumbnail;
