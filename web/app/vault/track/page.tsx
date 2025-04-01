import TopTracksChartThumbnail from "@/components/custom/vault/track/topTracks/topTracksChartThumbnail";
import { TrackDurationHistogramThumbnail } from "@/components/custom/vault/track/trackDurationHistogram/trackDurationHistogramChartThumnail";
import { TrackPlaysChartThumbnail } from "@/components/custom/vault/track/trackPlays/trackPlaysChartThumbnail";
import React from "react";

const TrackVault: React.FC = () => {
	const chartNames = ["track-plays", "top-tracks", "track-duration"];

	return (
		<div>
			<h1 className="text-3xl font-bold text-start mb-10">Track Vault</h1>
			<div className="grid grid-cols-2 gap-3 mt-14">
				{chartNames.map((chartName) =>
					chartName === "track-duration" ? (
						<TrackDurationHistogramThumbnail key={chartName} chartName={chartName} />
					) : chartName === "track-plays" ? (
						<TrackPlaysChartThumbnail key={chartName} chartName={chartName} />
					) : chartName === "top-tracks" ? (
						<TopTracksChartThumbnail key={chartName} chartName={chartName} />
					) : null
				)}
			</div>
		</div>
	);
};

export default TrackVault;
