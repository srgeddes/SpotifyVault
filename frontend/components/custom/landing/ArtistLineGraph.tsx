"use client";

import React, { useMemo } from "react";
import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useArtistImages } from "@/app/hooks/artist/useArtistImages";

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

const artistColors: Record<string, string> = {
	Drake: "black",
	"Kendrick Lamar": "#6bb1c9",
	"Taylor Swift": "#FFB5C0",
};

interface CustomTooltipProps {
	active?: boolean;
	payload?: any[];
	label?: string;
	artistImages: Record<string, string | null>;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label, artistImages }) => {
	if (active && payload && payload.length) {
		const sortedPayload = [...payload].sort((a, b) => b.value - a.value);
		return (
			<div className="bg-white p-4 rounded-md shadow-lg border border-gray-200 ml-2">
				<p className="font-bold">{label}</p>
				{sortedPayload.map((entry, index) => {
					const artist = entry.dataKey;
					return (
						<div key={index} className="flex items-center gap-3 mt-2">
							{artistImages[artist] ? (
								<img src={artistImages[artist] as string} alt={artist} className="w-12 h-12 object-cover rounded-full" />
							) : (
								<div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">{artist.charAt(0)}</div>
							)}
							<div>
								<p className="font-medium">{artist}</p>
								<p className="text-sm">
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
	const artistNames = useMemo(() => Object.keys(artistColors), []);
	const artistImages = useArtistImages(artistNames);

	return (
		<Card className="w-7/8 bg-white">
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="h-80">
					<ResponsiveContainer width="100%" height="100%">
						<LineChart data={artistData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
							<CartesianGrid strokeDasharray="3 3" vertical={false} />
							<XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
							<YAxis
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								label={{
									value: "Plays",
									angle: -90,
									position: "insideLeft",
									offset: -5,
								}}
							/>
							<Tooltip content={<CustomTooltip artistImages={artistImages} />} />
							<Legend />
							{artistNames.map((artist) => (
								<Line
									key={artist}
									type="monotone"
									dataKey={artist}
									stroke={artistColors[artist]}
									strokeWidth={3}
									dot={{ r: 4 }}
									activeDot={{
										r: 8,
										stroke: artistColors[artist],
										strokeWidth: 2,
									}}
								/>
							))}
						</LineChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
			<CardFooter>
				<div className="flex w-full items-start gap-2 text-sm">
					<div className="grid gap-2">
						<div className="flex items-center gap-2 font-medium leading-none">
							Trending up by 15% overall <TrendingUp className="h-4 w-4" />
						</div>
						<div className="flex items-center gap-2 leading-none text-muted-foreground">Compare listening patterns across your favorite artists</div>
					</div>
				</div>
			</CardFooter>
		</Card>
	);
};

export default ArtistLineGraph;
