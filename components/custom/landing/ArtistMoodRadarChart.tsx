"use client";
import React, { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Legend, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts";
import { useArtistImages } from "@/hooks/artist/useArtistImages";
import Image from "next/image";
import { motion } from "framer-motion";

interface MoodData {
	timeOfDay: string;
	[artist: string]: number | string;
}

const moodData: MoodData[] = [
	{ timeOfDay: "Morning", "Billie Eilish": 35, Future: 60, fullMark: 100 },
	{ timeOfDay: "Afternoon", "Billie Eilish": 45, Future: 75, fullMark: 100 },
	{ timeOfDay: "Evening", "Billie Eilish": 65, Future: 45, fullMark: 100 },
	{ timeOfDay: "Late Night", "Billie Eilish": 80, Future: 25, fullMark: 100 },
];

const artistColors: { [key: string]: string } = {
	"Billie Eilish": "#baf720",
	Future: "purple",
};

export interface ArtistImages {
	[key: string]: string | null;
}

const getMoodDescription = (value: number): string => {
	if (value >= 80) return "Extremely upbeat";
	if (value >= 60) return "Positive";
	if (value >= 40) return "Neutral";
	if (value >= 20) return "Melancholic";
	return "Somber";
};

interface ChartPayload {
	color: string;
	name: string;
	value: number;
	payload: {
		timeOfDay: string;
		[artist: string]: number | string;
	};
}

interface CustomTooltipProps {
	active?: boolean;
	payload?: ChartPayload[];
	label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
	if (active && payload && payload.length) {
		return (
			<div className="dark:bg-background bg-gray-100 rounded-xl p-4">
				<p className="font-medium text-sm mb-2">{label}</p>
				{payload.map((entry, index) => (
					<div key={index} className="flex items-center gap-2 mb-1">
						<div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
						<span className="text-xs font-medium">{entry.name}:</span>
						<span className="text-xs">{entry.value}</span>
						<span className="text-xs text-gray-500">({getMoodDescription(entry.value)})</span>
					</div>
				))}
				<div className="text-xs text-gray-500 mt-1">
					{payload[0].payload.timeOfDay === "Morning" && "6am - 12pm"}
					{payload[0].payload.timeOfDay === "Afternoon" && "12pm - 6pm"}
					{payload[0].payload.timeOfDay === "Evening" && "6pm - 12am"}
					{payload[0].payload.timeOfDay === "Late Night" && "12am - 6am"}
				</div>
			</div>
		);
	}
	return null;
};

interface LegendPayload {
	color: string;
	value: string;
}

interface CustomLegendProps {
	payload?: LegendPayload[];
	artistImages: ArtistImages;
}

const CustomLegend: React.FC<CustomLegendProps> = ({ payload, artistImages }) => {
	if (!payload) return null;

	return (
		<div className="flex justify-center gap-6 mt-2">
			{payload.map((entry, index) => (
				<div key={index} className="flex items-center gap-2">
					<div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
					{artistImages[entry.value] ? (
						<Image src={artistImages[entry.value]!} alt={entry.value} width={35} height={35} className="rounded-full object-cover" />
					) : (
						<div className="w-8 h-8 rounded-full bg-gray-200" />
					)}
					<span className="text-sm font-medium">{entry.value}</span>
				</div>
			))}
		</div>
	);
};

const ArtistMoodRadarChart: React.FC = () => {
	const artistNames = useMemo(() => Object.keys(artistColors), []);
	const artistImages = useArtistImages(artistNames);

	return (
		<div className="relative">
			<motion.div
				className="absolute -top-30 right-0 z-0"
				style={{ width: "200px", height: "200px" }}
				initial={{ y: 30, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.8, delay: 0.2 }}
				whileHover={{ y: -15, scale: 1.05, transition: { duration: 0.4 } }}>
				<Image
					src="/images/landing/big_billie_eilish.png"
					alt="Billie Eilish"
					layout="fill"
					objectFit="contain"
					objectPosition="center top"
					className="motion-safe:transition-all"
				/>
			</motion.div>
			<motion.div
				className="absolute -top-42 left-0 z-0"
				style={{ width: "300px", height: "325px" }}
				initial={{ y: 30, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.8, delay: 0.2 }}
				whileHover={{ y: -15, scale: 1.05, transition: { duration: 0.4 } }}>
				<Image
					src="/images/landing/big_future.png"
					alt="Future"
					layout="fill"
					objectFit="contain"
					objectPosition="center top"
					className="motion-safe:transition-all"
				/>
			</motion.div>
			<Card className="w-full h-full relative">
				<CardHeader className="pb-0 mb-0 text-right">
					<CardTitle>Artist Mood Patterns</CardTitle>
					<CardDescription className="mb-0">How the vibe of your music changes throughout the day</CardDescription>
				</CardHeader>
				<CardContent className="pt-0">
					<div className="h-[24rem]">
						<ResponsiveContainer width="100%" height="100%">
							<RadarChart outerRadius="75%" data={moodData}>
								<PolarGrid strokeWidth={1.2} />
								<PolarAngleAxis dataKey="timeOfDay" tick={{ fontSize: 13 }} />
								<PolarRadiusAxis angle={30} domain={[0, 100]} />
								{artistNames.map((artist) => (
									<Radar
										key={artist}
										name={artist}
										dataKey={artist}
										stroke={artistColors[artist]}
										strokeWidth={2}
										fill={artistColors[artist]}
										fillOpacity={0.3}
									/>
								))}
								<Tooltip content={<CustomTooltip />} />
								<Legend
									align="center"
									verticalAlign="bottom"
									layout="horizontal"
									wrapperStyle={{
										paddingTop: "16px",
										display: "flex",
										justifyContent: "center",
									}}
									content={<CustomLegend artistImages={artistImages} />}
								/>
							</RadarChart>
						</ResponsiveContainer>
					</div>
					<div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">Values represent average mood positivity (0-100) of songs</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default ArtistMoodRadarChart;
