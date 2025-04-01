"use client";
import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, ResponsiveContainer, Cell } from "recharts";
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

		// Sort by value (count) in descending order
		const sortedDistribution = Object.entries(distribution)
			.map(([genre, count]) => ({
				name: genre,
				value: count,
			}))
			.sort((a, b) => b.value - a.value);

		// Limit to max 20 genres
		if (sortedDistribution.length > 20) {
			const topGenres = sortedDistribution.slice(0, 19);
			const otherGenres = sortedDistribution.slice(19);
			const otherValue = otherGenres.reduce((sum, item) => sum + item.value, 0);

			return [...topGenres, { name: "Other", value: otherValue }];
		}

		return sortedDistribution;
	}, [trackPlays, artistPrimaryGenres]);

	if (isLoading || isArtistMetadataLoading) return <Loading />;
	if (isError || isArtistMetadataError) return <div>Error loading track plays</div>;
	if (!trackPlays || trackPlays.length === 0) return null;
	if (!artistMetadata || artistMetadata.length === 0) return null;

	const COLORS = [
		"#012A4A",
		"#01324F",
		"#013A63",
		"#01426F",
		"#01497C",
		"#014C81",
		"#014F86",
		"#1A5C8C",
		"#2A6F97",
		"#2B769C",
		"#2C7DA0",
		"#3986A7",
		"#468FAF",
		"#5399B8",
		"#61A5C2",
		"#75B3CE",
		"#89C2D9",
		"#99CCDF",
		"#A9D6E5",
		"#B9E0EC",
	];

	const hasMultiColumnLegend = genreDistribution.length > 8;
	const midPoint = Math.ceil(genreDistribution.length / 2);

	const firstColumnGenres = genreDistribution.slice(0, midPoint);
	const secondColumnGenres = genreDistribution.slice(midPoint);

	return (
		<Link href={`/vault/genre/${chartName}`} className="cursor-pointer">
			<Card className="hover:shadow-lg transition-shadow cursor-pointer">
				<CardContent className="p-2">
					<div className="text-center text-lg font-semibold mb-2">Genre Distribution</div>
					<div className="flex flex-row items-center">
						<div className="w-1/2 pointer-events-none">
							<ResponsiveContainer width="100%" height={180}>
								<PieChart>
									<Pie
										data={genreDistribution}
										dataKey="value"
										nameKey="name"
										cx="50%"
										cy="50%"
										outerRadius={90}
										innerRadius={20}
										fill={pieColor}
										label={false}>
										{genreDistribution.map((entry, index) => (
											<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
										))}
									</Pie>
								</PieChart>
							</ResponsiveContainer>
						</div>
						<div className="w-1/2 pl-2">
							{hasMultiColumnLegend ? (
								<div className="flex flex-row">
									<div className="flex flex-col flex-1 mr-1">
										{firstColumnGenres.map((entry, index) => (
											<div key={`legend-first-${index}`} className="flex items-center mb-1">
												<div className="w-3 h-3 mr-1 rounded-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
												<span className="text-xs truncate">{entry.name}</span>
											</div>
										))}
									</div>

									<div className="flex flex-col flex-1">
										{secondColumnGenres.map((entry, index) => (
											<div key={`legend-second-${index}`} className="flex items-center mb-1">
												<div className="w-3 h-3 mr-1 rounded-sm" style={{ backgroundColor: COLORS[(index + midPoint) % COLORS.length] }} />
												<span className="text-xs truncate">{entry.name}</span>
											</div>
										))}
									</div>
								</div>
							) : (
								<div className="flex flex-col">
									{genreDistribution.map((entry, index) => (
										<div key={`legend-${index}`} className="flex items-center mb-1">
											<div className="w-3 h-3 mr-1 rounded-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
											<span className="text-sm truncate">{entry.name}</span>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
};

export default GenreDistributionPieChartThumbnail;
