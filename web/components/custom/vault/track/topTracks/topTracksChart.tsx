"use client";

import React, { useMemo } from "react";
import { CartesianGrid, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useTrackPlays } from "@/hooks/user/track-plays";
import Loading from "@/components/custom/loading";
import { useTheme } from "next-themes";
import { useTrackMetadata } from "@/hooks/track/useTrackMetadata";
import Image from "next/image";

export const TopTracksChart: React.FC<{ chartName: string }> = ({ chartName }) => {
	const { trackPlays, isLoading, isError } = useTrackPlays();
	const { resolvedTheme } = useTheme();
	const color = resolvedTheme === "dark" ? "#ffffff" : "#000000";

	const groupedData = useMemo(() => {
		if (!trackPlays) return [];
		const counts: Record<string, { trackId: string; count: number }> = {};
		trackPlays.forEach((play) => {
			const id = play.trackId;
			if (counts[id]) {
				counts[id].count += 1;
			} else {
				counts[id] = { trackId: id, count: 1 };
			}
		});
		return Object.values(counts)
			.sort((a, b) => b.count - a.count)
			.slice(0, 20);
	}, [trackPlays]);

	const trackIds = useMemo(() => groupedData.map((t) => t.trackId), [groupedData]);
	const { metadata, isLoading: isMetaLoading, isError: isMetaError } = useTrackMetadata(trackIds);

	interface TopTrackData {
		id: string;
		trackName: string;
		count: number;
		externalUrl: string;
		image?: string;
	}

	const topTracksData: TopTrackData[] = useMemo(() => {
		if (!metadata) return [];
		const MAX_TRACK_NAME_LENGTH = 30;
		return groupedData
			.map((track) => {
				const trackMeta = metadata.find((meta) => meta.trackId === track.trackId);
				return {
					id: track.trackId,
					trackName: trackMeta?.name
						? trackMeta.name.length > MAX_TRACK_NAME_LENGTH
							? trackMeta.name.slice(0, MAX_TRACK_NAME_LENGTH - 3) + "..."
							: trackMeta.name
						: track.trackId,
					count: track.count,
					image: trackMeta?.albumImageUrl,
					externalUrl: `https://open.spotify.com/track/${track.trackId}`,
				};
			})
			.sort((a, b) => a.trackName.localeCompare(b.trackName));
	}, [groupedData, metadata]);

	if (isLoading || isMetaLoading) return <Loading />;
	if (isError || isMetaError) return <div>Error loading track plays</div>;
	if (!trackPlays || trackPlays.length === 0) return <div>No track plays data available</div>;

	const maxCount = topTracksData.reduce((max, track) => Math.max(max, track.count), 0);
	const yAxisUpperBound = maxCount + 5;

	const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: TopTrackData }> }) => {
		if (active && payload && payload.length) {
			const trackData = payload[0].payload;
			return (
				<div className="bg-white dark:bg-neutral-600 p-2 rounded-xl">
					{trackData.image && <Image src={trackData.image} alt={trackData.trackName} width={100} height={100} className="mb-2 rounded-xl" />}
					<p className="font-bold">{trackData.trackName}</p>
					<p>{trackData.count} plays</p>
				</div>
			);
		}
		return null;
	};

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle>{chartName}</CardTitle>
				<CardDescription>Top 20 tracks by play count</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="h-[66vh]">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart data={topTracksData} margin={{ top: 5, right: 30, left: 20, bottom: 80 }}>
							<Tooltip content={<CustomTooltip />} />
							<CartesianGrid strokeDasharray="3 3" stroke={color} opacity={0.1} />
							<XAxis dataKey="trackName" stroke={color} angle={-45} textAnchor="end" interval={0} />
							<YAxis
								domain={[0, yAxisUpperBound]}
								stroke={color}
								label={{
									value: "Track Plays",
									angle: -90,
									position: "insideLeft",
									offset: 10,
									dy: 40,
									style: { fill: color },
								}}
							/>
							<Legend
								wrapperStyle={{
									paddingTop: 60,
									visibility: "hidden",
								}}
							/>
							<Tooltip content={<CustomTooltip />} />
							<Bar
								className="cursor-pointer"
								dataKey="count"
								fill={color}
								onClick={(data) => {
									if (data && data.payload && data.payload.id) {
										window.location.href = `spotify:track:${data.payload.id}`;
									}
								}}
								radius={[6, 6, 0, 0]}
							/>
						</BarChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
			<CardFooter>
				<div className="text-sm">Top 20 tracks ordered alphabetically by track name.</div>
			</CardFooter>
		</Card>
	);
};

export default TopTracksChart;
