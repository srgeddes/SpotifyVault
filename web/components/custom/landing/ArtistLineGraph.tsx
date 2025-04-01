"use client";
import React, { useMemo, useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useArtistImages } from "@/hooks/artist/useArtistImages";
import { useTheme } from "next-themes";
import Image from "next/image";

const artistData = [
	{ month: "Jan", Drake: 250, "Kendrick Lamar": 80, "Taylor Swift": 160 },
	{ month: "Feb", Drake: 100, "Kendrick Lamar": 100, "Taylor Swift": 140 },
	{ month: "Mar", Drake: 140, "Kendrick Lamar": 150, "Taylor Swift": 190 },
	{ month: "Apr", Drake: 220, "Kendrick Lamar": 130, "Taylor Swift": 210 },
	{ month: "May", Drake: 170, "Kendrick Lamar": 200, "Taylor Swift": 180 },
	{ month: "Jun", Drake: 150, "Kendrick Lamar": 170, "Taylor Swift": 190 },
	{ month: "Jul", Drake: 170, "Kendrick Lamar": 220, "Taylor Swift": 240 },
	{ month: "Aug", Drake: 190, "Kendrick Lamar": 180, "Taylor Swift": 230 },
	{ month: "Sep", Drake: 230, "Kendrick Lamar": 210, "Taylor Swift": 200 },
	{ month: "Oct", Drake: 210, "Kendrick Lamar": 260, "Taylor Swift": 250 },
	{ month: "Nov", Drake: 130, "Kendrick Lamar": 190, "Taylor Swift": 270 },
	{ month: "Dec", Drake: 90, "Kendrick Lamar": 230, "Taylor Swift": 220 },
];

const mobileArtistData = [
	{ month: "Jan", Drake: 250, "Kendrick Lamar": 80, "Taylor Swift": 160 },
	{ month: "Mar", Drake: 140, "Kendrick Lamar": 150, "Taylor Swift": 190 },
	{ month: "Jul", Drake: 170, "Kendrick Lamar": 220, "Taylor Swift": 240 },
	{ month: "Sep", Drake: 230, "Kendrick Lamar": 210, "Taylor Swift": 200 },
	{ month: "Nov", Drake: 130, "Kendrick Lamar": 190, "Taylor Swift": 270 },
];

const baseArtistColors: Record<string, string> = {
	"Kendrick Lamar": "#6bb1c9",
	"Taylor Swift": "#FFB5C0",
	Drake: "",
};

interface CustomTooltipPayload {
	value: number;
	dataKey: string;
}

interface CustomTooltipProps {
	active?: boolean;
	payload?: CustomTooltipPayload[];
	label?: string;
	artistImages: Record<string, string | null>;
	isMobile: boolean;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label, artistImages, isMobile }) => {
	if (active && payload && payload.length) {
		const sortedPayload = [...payload].sort((a, b) => b.value - a.value);
		return (
			<div className="bg-background/95 backdrop-blur-sm p-2 sm:p-4 rounded-md shadow-lg border border-border ml-2">
				<p className="font-bold text-sm sm:text-base">{label}</p>
				{sortedPayload.map((entry, index) => {
					const artist = entry.dataKey;
					return (
						<div key={index} className="flex items-center gap-2 sm:gap-3 mt-1 sm:mt-2">
							{artistImages[artist] ? (
								<Image
									src={artistImages[artist] as string}
									alt={artist}
									width={isMobile ? 30 : 50}
									height={isMobile ? 30 : 50}
									className="object-cover rounded-full"
								/>
							) : (
								<div className={`w-8 h-8 sm:w-12 sm:h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center`}>
									{artist.charAt(0)}
								</div>
							)}
							<div>
								<p className="font-medium text-xs sm:text-sm">{artist}</p>
								<p className="text-xs sm:text-sm">
									<span className="font-semibold">{entry.value}</span> plays
								</p>
							</div>
						</div>
					);
				})}
			</div>
		);
	}
	return null;
};

const ArtistLineGraph: React.FC<{ title?: string; description?: string }> = ({
	title = "Artist Plays Trend",
	description = "Monthly plays count for your favorite artists",
}) => {
	const { resolvedTheme } = useTheme();
	const [drakeColor, setDrakeColor] = useState(resolvedTheme === "dark" ? "white" : "black");
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkIfMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkIfMobile();
		window.addEventListener("resize", checkIfMobile);

		return () => {
			window.removeEventListener("resize", checkIfMobile);
		};
	}, []);

	useEffect(() => {
		setDrakeColor(resolvedTheme === "dark" ? "white" : "black");
	}, [resolvedTheme]);

	const artistColors = useMemo(
		(): Record<string, string> => ({
			...baseArtistColors,
			Drake: drakeColor,
		}),
		[drakeColor]
	);

	const artistNames = useMemo(() => Object.keys(artistColors), [artistColors]);
	const artistImages = useArtistImages(artistNames);

	const data = isMobile ? mobileArtistData : artistData;

	return (
		<Card className="w-full mx-auto">
			<CardHeader className="px-3 sm:px-6">
				<CardTitle className="text-base sm:text-xl">{title}</CardTitle>
				<CardDescription className="text-xs sm:text-sm">{description}</CardDescription>
			</CardHeader>
			<CardContent className="px-2 sm:px-6">
				<div className="h-64 sm:h-80">
					<ResponsiveContainer width="100%" height="100%">
						<LineChart data={data} margin={{ top: 5, right: isMobile ? 10 : 30, left: isMobile ? 10 : 20, bottom: 5 }}>
							<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.1} />
							<XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} stroke="currentColor" tick={{ fontSize: isMobile ? 10 : 12 }} />
							<YAxis
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								stroke="currentColor"
								tick={{ fontSize: isMobile ? 10 : 12 }}
								label={
									isMobile
										? {}
										: {
												value: "Plays",
												angle: -90,
												position: "insideLeft",
												offset: -5,
												style: { fill: "currentColor" },
										  }
								}
							/>
							<Tooltip content={<CustomTooltip artistImages={artistImages} isMobile={isMobile} />} />
							<Legend
								wrapperStyle={{
									paddingTop: isMobile ? 10 : 20,
									fontSize: isMobile ? 10 : 12,
								}}
							/>
							{artistNames.map((artist) => (
								<Line
									key={artist}
									type="monotone"
									dataKey={artist}
									stroke={artistColors[artist]}
									strokeWidth={isMobile ? 2 : 3}
									dot={{ r: isMobile ? 3 : 4 }}
									activeDot={{
										r: isMobile ? 6 : 8,
										stroke: artistColors[artist],
										strokeWidth: isMobile ? 1 : 2,
									}}
								/>
							))}
						</LineChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
			<CardFooter className="px-3 sm:px-6">
				<div className="flex w-full items-start gap-1 sm:gap-2 text-xs sm:text-sm">
					<div className="grid gap-1 sm:gap-2">
						<div className="flex items-center gap-1 sm:gap-2 font-medium leading-none">
							Trending up by 15% overall <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
						</div>
						<div className="flex items-center gap-1 sm:gap-2 leading-none text-muted-foreground text-xs sm:text-sm">
							Compare listening patterns across your favorite artists
						</div>
					</div>
				</div>
			</CardFooter>
		</Card>
	);
};

export default ArtistLineGraph;
