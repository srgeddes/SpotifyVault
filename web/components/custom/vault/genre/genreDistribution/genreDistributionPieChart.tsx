"use client";

import React, { useMemo, useState, useEffect, JSX } from "react";
import { PieChart, Pie, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "next-themes";
import Image from "next/image";
import Loading from "@/components/custom/loading";
import { useTrackPlays } from "@/hooks/user/track-plays";
import { useArtistMetadata } from "@/hooks/artist/useArtistMetadata";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface TrackPlay {
	artistIds?: string;
	trackId?: string;
	trackName?: string;
	playedAt?: string;
}

interface ArtistMetadata {
	artistId: string;
	genres?: string[];
	imageUrl?: string;
}

interface TrackCount {
	trackId: string;
	trackName: string;
	artistId: string;
	count: number;
}

interface GenreDistributionItem {
	name: string;
	value: number;
}

interface CustomizedLabelProps {
	cx: number;
	cy: number;
	midAngle: number;
	innerRadius: number;
	outerRadius: number;
	percent: number;
	index: number;
}

interface PayloadItem {
	name: string;
	value: number;
}

const GenreDistributionPieChart: React.FC<{ chartName: string }> = ({ chartName }) => {
	const { trackPlays, isLoading, isError } = useTrackPlays() as {
		trackPlays: TrackPlay[];
		isLoading: boolean;
		isError: boolean;
	};
	const { resolvedTheme } = useTheme();
	const [textColor, setTextColor] = useState<string>(resolvedTheme === "dark" ? "#ffffff" : "#000000");

	const colorPalettes: Record<string, string[]> = {
		Default: [
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
		],
		Grayscale: [
			"#F8F9FA",
			"#F1F3F5",
			"#E9ECEF",
			"#E3E7EB",
			"#DEE2E6",
			"#D5DBE0",
			"#CED4DA",
			"#BDC5CC",
			"#ADB5BD",
			"#8D98A0",
			"#6C757D",
			"#5D656C",
			"#495057",
			"#40464C",
			"#343A40",
			"#2C3135",
			"#212529",
			"#1B1F22",
			"#16191C",
			"#101214",
		],
		Pastel: [
			"#FEC5BB",
			"#FEC9BF",
			"#FCD5CE",
			"#FCDAD5",
			"#FAE1DD",
			"#F9E5E1",
			"#F8EDEB",
			"#F0EBE7",
			"#E8E8E4",
			"#E0E5E0",
			"#D8E2DC",
			"#E0E3DE",
			"#ECE4DB",
			"#F3E6DF",
			"#FFE5D9",
			"#FFDFCC",
			"#FFD7BA",
			"#FFD0AF",
			"#FEC89A",
			"#FECDA5",
		],
		Green: [
			"#D9ED92",
			"#CEEB8F",
			"#B5E48C",
			"#A7E08C",
			"#99D98C",
			"#8ACE8F",
			"#76C893",
			"#64C096",
			"#52B69A",
			"#43AB9D",
			"#34A0A4",
			"#2795A1",
			"#168AAD",
			"#1882A6",
			"#1A759F",
			"#1C6C98",
			"#1E6091",
			"#1B5584",
			"#184E77",
			"#15476D",
		],
		Red: [
			"#03071E",
			"#1D0A1A",
			"#370617",
			"#502511",
			"#6A040F",
			"#82020C",
			"#9D0208",
			"#B70104",
			"#D00000",
			"#D61701",
			"#DC2F02",
			"#E34603",
			"#E85D04",
			"#EB7505",
			"#F48C06",
			"#F79907",
			"#FAA307",
			"#FCB107",
			"#FFBA08",
			"#FFC21A",
		],
	};

	const [currentPalette, setCurrentPalette] = useState<string>("Default");
	const [colors, setColors] = useState<string[]>(colorPalettes["Default"]);

	useEffect((): void => {
		setTextColor("#ffffff");
	}, [resolvedTheme]);

	const firstArtistIds: string[] = useMemo((): string[] => {
		if (!trackPlays) return [];
		return trackPlays
			.filter((play: TrackPlay): boolean => play.artistIds !== undefined)
			.map((play: TrackPlay): string => (play.artistIds ? play.artistIds.split(",")[0].trim() : ""))
			.filter((id: string): boolean => id !== "");
	}, [trackPlays]);

	const uniqueArtistIds: string[] = useMemo((): string[] => {
		return Array.from(new Set(firstArtistIds));
	}, [firstArtistIds]);

	const {
		metadata: artistMetadata,
		isLoading: isArtistMetadataLoading,
		isError: isArtistMetadataError,
	} = useArtistMetadata(uniqueArtistIds) as {
		metadata: ArtistMetadata[];
		isLoading: boolean;
		isError: boolean;
	};

	const artistPrimaryGenres: Record<string, string> = useMemo((): Record<string, string> => {
		const mapping: Record<string, string> = {};
		if (!artistMetadata) return mapping;
		artistMetadata.forEach((artist: ArtistMetadata): void => {
			mapping[artist.artistId] = artist.genres && Array.isArray(artist.genres) && artist.genres.length > 0 ? artist.genres[0] : "";
		});
		return mapping;
	}, [artistMetadata]);

	const mostPlayedTrackByGenre: Record<string, TrackCount> = useMemo((): Record<string, TrackCount> => {
		const genreTrackCounts: Record<string, TrackCount[]> = {};
		const otherGenreTracks: TrackCount[] = [];
		if (!trackPlays) return {};

		// First, get all genre track counts
		trackPlays.forEach((play: TrackPlay): void => {
			if (!play.artistIds) return;
			const firstArtistId: string = play.artistIds.split(",")[0].trim();
			if (!firstArtistId) return;
			const primaryGenre: string = artistPrimaryGenres[firstArtistId];
			if (!primaryGenre || primaryGenre === "") return;
			if (!genreTrackCounts[primaryGenre]) {
				genreTrackCounts[primaryGenre] = [];
			}
			const existingTrack: TrackCount | undefined = genreTrackCounts[primaryGenre].find((t: TrackCount): boolean => t.trackId === play.trackId);
			if (existingTrack) {
				existingTrack.count += 1;
			} else {
				genreTrackCounts[primaryGenre].push({
					trackId: play.trackId || "",
					trackName: play.trackName || "",
					artistId: firstArtistId,
					count: 1,
				});
			}
		});

		const topTrackByGenre: Record<string, TrackCount> = {};
		Object.entries(genreTrackCounts).forEach(([genre, tracks]: [string, TrackCount[]]): void => {
			if (tracks.length > 0) {
				tracks.sort((a: TrackCount, b: TrackCount): number => b.count - a.count);
				topTrackByGenre[genre] = tracks[0];
			}
		});

		// Add support for "Other" category
		if (Object.keys(genreTrackCounts).length > 19) {
			// Combine all tracks from less popular genres
			Object.values(otherGenreTracks).forEach((tracks: TrackCount): void => {
				const existingTrack: TrackCount | undefined = otherGenreTracks.find((t: TrackCount): boolean => t.trackId === tracks.trackId);
				if (existingTrack) {
					existingTrack.count += tracks.count;
				} else {
					otherGenreTracks.push({ ...tracks });
				}
			});

			// Find the most played track in the "Other" category
			if (otherGenreTracks.length > 0) {
				otherGenreTracks.sort((a: TrackCount, b: TrackCount): number => b.count - a.count);
				topTrackByGenre["Other"] = otherGenreTracks[0];
			}
		}

		return topTrackByGenre;
	}, [trackPlays, artistPrimaryGenres]);

	const artistImages: Record<string, string> = useMemo((): Record<string, string> => {
		const images: Record<string, string> = {};
		if (!artistMetadata) return images;
		artistMetadata.forEach((artist: ArtistMetadata): void => {
			if (artist.imageUrl) {
				images[artist.artistId] = artist.imageUrl;
			}
		});
		return images;
	}, [artistMetadata]);

	const genreDistribution: GenreDistributionItem[] = useMemo((): GenreDistributionItem[] => {
		const distribution: Record<string, number> = {};
		if (!trackPlays) return [];

		// Count plays by genre
		trackPlays.forEach((play: TrackPlay): void => {
			if (!play.artistIds) return;
			const firstArtistId: string = play.artistIds.split(",")[0].trim();
			if (!firstArtistId) return;
			const primaryGenre: string = artistPrimaryGenres[firstArtistId];
			if (!primaryGenre || primaryGenre === "") return;
			distribution[primaryGenre] = (distribution[primaryGenre] || 0) + 1;
		});

		// Convert to array and sort by value in descending order
		const sortedDistribution = Object.entries(distribution)
			.map(
				([genre, count]: [string, number]): GenreDistributionItem => ({
					name: genre,
					value: count,
				})
			)
			.sort((a: GenreDistributionItem, b: GenreDistributionItem): number => b.value - a.value);

		// Limit to top 19 genres and combine the rest as "Other"
		if (sortedDistribution.length > 19) {
			const topGenres = sortedDistribution.slice(0, 19);
			const otherGenres = sortedDistribution.slice(19);
			const otherValue = otherGenres.reduce((sum, item) => sum + item.value, 0);

			return [...topGenres, { name: "Other", value: otherValue }];
		}

		return sortedDistribution;
	}, [trackPlays, artistPrimaryGenres]);

	const totalPlays: number = useMemo((): number => {
		return genreDistribution.reduce((sum: number, item: GenreDistributionItem): number => sum + item.value, 0);
	}, [genreDistribution]);

	const handlePaletteChange = (palette: string): void => {
		setCurrentPalette(palette);
		setColors(colorPalettes[palette]);
		if (palette === "Default" || palette === "Red") {
			setTextColor("#ffffff");
		} else {
			setTextColor(resolvedTheme === "dark" ? "#ffffff" : "#000000");
		}
	};

	if (isLoading || isArtistMetadataLoading) return <Loading />;
	if (isError || isArtistMetadataError) return <div>Error loading data</div>;
	if (!trackPlays || trackPlays.length === 0) return <div>No track plays data available</div>;
	if (!artistMetadata || artistMetadata.length === 0) return <div>No artist metadata available</div>;

	const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: CustomizedLabelProps): JSX.Element | null => {
		const RADIAN: number = Math.PI / 180;
		const radius: number = innerRadius + (outerRadius - innerRadius) * 0.5;
		const x: number = cx + radius * Math.cos(-midAngle * RADIAN);
		const y: number = cy + radius * Math.sin(-midAngle * RADIAN);
		if (percent < 0.05) return null;
		return (
			<text x={x} y={y} fill={textColor} textAnchor="middle" dominantBaseline="central" fontWeight="bold" fontSize="14px">
				{(percent * 100).toFixed(1)}%
			</text>
		);
	};

	const CustomTooltip: React.FC<{ active?: boolean; payload?: PayloadItem[] }> = ({ active, payload }): JSX.Element | null => {
		if (active && payload && payload.length) {
			const genre: string = payload[0].name;
			const count: number = payload[0].value;
			const percentage: string = ((count / totalPlays) * 100).toFixed(1);
			const topTrack: TrackCount | undefined = mostPlayedTrackByGenre[genre];
			const artistId: string | undefined = topTrack?.artistId;
			const artistImageUrl: string | null = artistId ? artistImages[artistId] : null;
			return (
				<div className="bg-white/70 backdrop-blur p-3 rounded-lg shadow-md border">
					<p className="font-bold text-lg mb-1">{genre}</p>
					<p className="mb-2">
						{count} tracks ({percentage}%)
					</p>
					{topTrack && (
						<div>
							{artistImageUrl && (
								<div className="mt-2 flex justify-center">
									<div className="w-20 h-20 relative rounded-full overflow-hidden">
										<Image src={artistImageUrl} alt="Artist" layout="fill" objectFit="cover" />
									</div>{" "}
								</div>
							)}
						</div>
					)}
				</div>
			);
		}
		return null;
	};

	return (
		<Card className="w-full relative shadow-lg">
			<CardHeader className="pb-2 flex flex-row items-center justify-between">
				<div>
					<CardTitle className="text-2xl">{chartName}</CardTitle>
					<CardDescription>Percentage breakdown by genre</CardDescription>
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger className="flex items-center px-3 py-2 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50 cursor-pointer">
						{currentPalette} <ChevronDown className="ml-2 h-4 w-4" />
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						{Object.keys(colorPalettes).map(
							(palette: string): JSX.Element => (
								<DropdownMenuItem key={palette} className="cursor-pointer" onClick={() => handlePaletteChange(palette)}>
									<div className="flex items-center">
										<div className="flex mr-2">
											{colorPalettes[palette].slice(0, 3).map(
												(color: string, i: number): JSX.Element => (
													<div key={i} className="w-3 h-3 mr-px" style={{ backgroundColor: color }} />
												)
											)}
										</div>
										{palette}
									</div>
								</DropdownMenuItem>
							)
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			</CardHeader>
			<CardContent>
				<div className="h-[66vh]">
					<ResponsiveContainer width="100%" height="100%">
						<PieChart>
							<Pie
								data={genreDistribution}
								dataKey="value"
								nameKey="name"
								cx="50%"
								cy="50%"
								outerRadius={250}
								innerRadius={40}
								paddingAngle={2}
								label={renderCustomizedLabel}
								fill={textColor}>
								{genreDistribution.map(
									(entry: GenreDistributionItem, index: number): JSX.Element => (
										<Cell
											key={`cell-${index}`}
											fill={colors[index % colors.length]}
											stroke={resolvedTheme === "dark" ? "#222" : "#eee"}
											strokeWidth={1}
										/>
									)
								)}
							</Pie>
							<Tooltip content={<CustomTooltip />} />
							<Legend
								verticalAlign="bottom"
								height={60}
								layout="horizontal"
								iconSize={10}
								iconType="circle"
								margin={{ top: 20 }}
								formatter={(value: string): JSX.Element => (
									<span
										style={{
											color: resolvedTheme === "dark" ? "#ffffff" : "#000000",
											marginLeft: "4px",
										}}>
										{value}
									</span>
								)}
								wrapperStyle={{ paddingTop: "50px" }}
							/>
						</PieChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
			<CardFooter className="pt-6 flex justify-between text-sm text-gray-500 dark:text-gray-400">
				<div>Total tracks: {totalPlays}</div>
				<div>{genreDistribution.length >= 20 ? "Top 19 genres + Others shown" : `${genreDistribution.length} genres shown`}</div>
			</CardFooter>
		</Card>
	);
};

export default GenreDistributionPieChart;
