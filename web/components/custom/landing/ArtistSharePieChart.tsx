"use client";

import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useArtistImages } from "@/hooks/artist/useArtistImages";
import { motion } from "framer-motion";
import Image from "next/image";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const playData = [
	{ name: "Bruno Mars", value: 45, color: "#5398BE" },
	{ name: "Rihanna", value: 30, color: "#F2CD5D" },
	{ name: "Ariana Grande", value: 25, color: "#C2847A" },
];

interface PieTooltipPayloadItem {
	name: string;
	value: number;
}

interface CustomTooltipProps {
	active?: boolean;
	payload?: PieTooltipPayloadItem[];
	artistImages: Record<string, string | null>;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, artistImages }) => {
	if (active && payload && payload.length) {
		const data = payload[0];
		const artist = data.name;

		return (
			<div className="bg-card p-4 rounded-md shadow-lg border border-border">
				<div className="flex items-center gap-3">
					{artistImages[artist] ? (
						<Image src={artistImages[artist] as string} alt={artist} width={50} height={50} className="object-cover rounded-full" />
					) : (
						<div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">{artist.charAt(0)}</div>
					)}
					<div>
						<p className="font-medium">{artist}</p>
						<p className="text-sm">
							<span className="font-semibold">{data.value}%</span> of your listening time
						</p>
						<p className="text-xs text-muted-foreground">{Math.round(data.value * 0.6)} hours this month</p>
					</div>
				</div>
			</div>
		);
	}
	return null;
};

const ArtistSharePieChart: React.FC = () => {
	const isMobile = useMediaQuery("(max-width: 768px)");
	const artistNames = useMemo(() => playData.map((item) => item.name), []);
	const artistImages = useArtistImages(artistNames);

	return (
		<div className="relative h-full">
			<motion.div
				className="hidden md:block md:absolute -top-30 left-0 z-0"
				style={{ width: "200px", height: "200px" }}
				initial={{ y: 30, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.8, delay: 0.2 }}
				whileHover={{ y: -15, scale: 1.05, transition: { duration: 0.4 } }}>
				<Image
					src="/images/landing/big_rhiana.png"
					alt="Rhiana"
					layout="fill"
					objectFit="contain"
					objectPosition="center top"
					className="motion-safe:transition-all"
				/>
			</motion.div>
			<motion.div
				className="absolute -top-30 right-0 z-0"
				style={{ width: "275px", height: "275px" }}
				initial={{ y: 30, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.8, delay: 0.2 }}
				whileHover={{ y: -15, scale: 1.05, transition: { duration: 0.4 } }}>
				<Image
					src="/images/landing/big_bruno.png"
					alt="Rhiana"
					layout="fill"
					objectFit="contain"
					objectPosition="center top"
					className="motion-safe:transition-all"
				/>
			</motion.div>

			<Card className="w-full h-100 md:h-full z-10 relative">
				<CardHeader className="pb-0 mb-0">
					<CardTitle>Artist Share of Plays</CardTitle>
					<CardDescription>Top Artist Listening Distribution</CardDescription>
				</CardHeader>
				<CardContent className="pt-0 h-[calc(100%-4rem)] flex flex-col">
					<div className="flex-1 min-h-0">
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
									label={!isMobile ? ({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%` : false}
									labelLine={false}>
									{playData.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={entry.color} />
									))}
								</Pie>
								<Tooltip content={<CustomTooltip artistImages={artistImages} />} />
							</PieChart>
						</ResponsiveContainer>
					</div>
					<div className="text-xs text-muted-foreground text-center mt-2">Based on your listening activity from the past 30 days</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default ArtistSharePieChart;
