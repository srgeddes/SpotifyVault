"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, ResponsiveContainer, Cell, Legend } from "recharts";
import { useTrackPlays } from "@/hooks/user/track-plays";
import { useTheme } from "next-themes";
import Loading from "@/components/custom/loading";
import { useArtistMetadata } from "@/hooks/artist/useArtistMetadata";

interface TrackPlay {
	artistIds?: string;
}

interface Artist {
	artistId: string;
	genres?: string[];
}

export interface GenreDistributionPieChartThumbnailProps {
	chartName: string;
}

export const GenreDistributionPieChartThumbnail: React.FC<GenreDistributionPieChartThumbnailProps> = ({ chartName }) => {
	const { trackPlays, isLoading, isError } = useTrackPlays();
	const { resolvedTheme } = useTheme();
	const [pieColor, setPieColor] = useState(resolvedTheme === "dark" ? "#ffffff" : "#000000");

	useEffect(() => {
		setPieColor(resolvedTheme === "dark" ? "#ffffff" : "#000000");
	}, [resolvedTheme]);

	const firstArtistIds = useMemo(() => {
		if (!trackPlays) return [];
		return trackPlays
			.filter((play: TrackPlay) => play.artistIds)
			.map((play: TrackPlay) => play.artistIds!.split(",")[0].trim())
			.filter((id: string) => id !== "");
	}, [trackPlays]);

	const uniqueArtistIds = useMemo(() => {
		return Array.from(new Set(firstArtistIds));
	}, [firstArtistIds]);

	const { metadata: artistMetadata, isLoading: isArtistMetadataLoading, isError: isArtistMetadataError } = useArtistMetadata(uniqueArtistIds);

	const artistPrimaryGenres = useMemo(() => {
		const mapping: Record<string, string> = {};
		if (!artistMetadata) return mapping;
		artistMetadata.forEach((artist: Artist) => {
			mapping[artist.artistId] = artist.genres && Array.isArray(artist.genres) && artist.genres.length > 0 ? artist.genres[0] : "";
		});
		return mapping;
	}, [artistMetadata]);

	const genreDistribution = useMemo(() => {
		const distribution: Record<string, number> = {};
		if (!trackPlays) return [];
		trackPlays.forEach((play: TrackPlay) => {
			if (!play.artistIds) return;
			const firstArtistId = play.artistIds.split(",")[0].trim();
			if (!firstArtistId) return;
			const primaryGenre = artistPrimaryGenres[firstArtistId];
			if (!primaryGenre || primaryGenre === "") return;
			distribution[primaryGenre] = (distribution[primaryGenre] || 0) + 1;
		});
		return Object.entries(distribution).map(([genre, count]) => ({
			name: genre,
			value: count,
		}));
	}, [trackPlays, artistPrimaryGenres]);

	if (isLoading || isArtistMetadataLoading) return <Loading />;
	if (isError || isArtistMetadataError) return <div>Error loading track plays</div>;
	if (!trackPlays || trackPlays.length === 0) return null;
	if (!artistMetadata || artistMetadata.length === 0) return null;

	const COLORS = ["#012A4A", "#013A63", "#01497C", "#014F86", "#2A6F97", "#2C7DA0", "#468FAF", "#61A5C2", "#89C2D9", "#A9D6E5"];

	return (
		<Link href={`/vault/genre/${chartName}`} className="cursor-pointer">
			<Card className="hover:shadow-lg transition-shadow cursor-pointer">
				<CardContent className="p-2">
					<div className="text-center text-lg font-semibold mb-1">Genre Distribution</div>
					<ResponsiveContainer width="100%" height={200} className="pointer-events-none">
						<PieChart>
							<Pie
								data={genreDistribution}
								dataKey="value"
								nameKey="name"
								cx="50%"
								cy="50%"
								outerRadius={80}
								innerRadius={20}
								fill={pieColor}
								label={false}>
								{genreDistribution.map((entry, index) => (
									<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
								))}
							</Pie>
							<Legend verticalAlign="bottom" layout="horizontal" iconSize={10} wrapperStyle={{ paddingTop: 10 }} />
						</PieChart>
					</ResponsiveContainer>
				</CardContent>
			</Card>
		</Link>
	);
};

export default GenreDistributionPieChartThumbnail;
