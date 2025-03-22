"use client";

import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useArtistImages } from "@/app/hooks/artist/useArtistImages";
import { motion } from "framer-motion";
import Image from "next/image";
const playData = [
	{ name: "Bruno Mars", value: 45, color: "#4ADE80" },
	{ name: "Rihanna", value: 30, color: "#F472B6" },
	{ name: "Ariana Grande", value: 25, color: "#A78BFA" },
];

interface CustomTooltipProps {
	active?: boolean;
	payload?: any[];
	artistImages: Record<string, string | null>;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, artistImages }) => {
	if (active && payload && payload.length) {
		const data = payload[0];
		const artist = data.name;

		return (
			<div className="bg-white p-4 rounded-md shadow-lg border border-gray-200">
				<div className="flex items-center gap-3">
					{artistImages[artist] ? (
						<img src={artistImages[artist] as string} alt={artist} className="w-12 h-12 object-cover rounded-full" />
					) : (
						<div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">{artist.charAt(0)}</div>
					)}
					<div>
						<p className="font-medium">{artist}</p>
						<p className="text-sm">
							<span className="font-semibold">{data.value}%</span> of your listening time
						</p>
						<p className="text-xs text-gray-500">{Math.round(data.value * 0.6)} hours this month</p>
					</div>
				</div>
			</div>
		);
	}
	return null;
};

interface CustomLegendProps {
	payload?: any[];
	artistImages: Record<string, string | null>;
}

const CustomLegend: React.FC<CustomLegendProps> = ({ payload, artistImages }) => {
	if (!payload) return null;

	return (
		<div className="flex flex-col gap-3 mt-4">
			{payload.map((entry, index) => (
				<div key={index} className="flex items-center gap-3">
					<div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
					{artistImages[entry.value] ? (
						<img src={artistImages[entry.value] as string} alt={entry.value} className="w-10 h-10 object-cover rounded-full" />
					) : (
						<div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">{entry.value.charAt(0)}</div>
					)}
					<div>
						<p className="text-sm font-medium">{entry.value}</p>
						<p className="text-xs text-gray-500">{playData.find((item) => item.name === entry.value)?.value}% of plays</p>
					</div>
				</div>
			))}
		</div>
	);
};

const ArtistSharePieChart: React.FC = () => {
	const artistNames = useMemo(() => playData.map((item) => item.name), []);
	const artistImages = useArtistImages(artistNames);

	return (
		<div className="relative">
			<motion.div
				className="absolute -top-30 left-0 z-[-1]"
				style={{ width: "190px", height: "190px" }}
				initial={{ y: 30, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.8, delay: 0.2 }}
				whileHover={{ y: -15, scale: 1.05, transition: { duration: 0.4 } }}>
				<Image
					src="/images/landing/big_rhiana.png"
					alt="Billie Eilish"
					layout="fill"
					objectFit="contain"
					objectPosition="center top"
					className="motion-safe:transition-all"
				/>
			</motion.div>
			<Card className="w-full h-full bg-white z-10">
				<CardHeader className="pb-0 mb-0">
					<CardTitle>Artist Share of Plays</CardTitle>
					<CardDescription>Top Artist Listening Distribution</CardDescription>
				</CardHeader>
				<CardContent className="pt-2">
					<div className="h-[24rem]">
						<ResponsiveContainer width="100%" height="100%">
							<PieChart>
								<Pie
									data={playData}
									cx="50%"
									cy="50%"
									innerRadius={60}
									outerRadius={90}
									paddingAngle={2}
									dataKey="value"
									label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
									labelLine={false}>
									{playData.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={entry.color} />
									))}
								</Pie>
								<Tooltip content={<CustomTooltip artistImages={artistImages} />} />
							</PieChart>
						</ResponsiveContainer>
					</div>
					<div className="text-xs text-gray-500 mt-4 text-center">Based on your listening activity from the past 30 days</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default ArtistSharePieChart;
