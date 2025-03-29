import { TrackDurationHistogramThumbnail } from "@/components/custom/vault/track/trackDurationHistogram/trackDurationHistogramChartThumnail";
import { TrackPlaysChartThumbnail } from "@/components/custom/vault/track/trackPlays/trackPlaysChartThumbnail";
import React from "react";

const TrackVault: React.FC = () => {
	const chartNames = ["track-plays", "track-duration"];

	return (
		<div>
			<div className="grid grid-cols-2 gap-3 mt-14">
				{chartNames.map((chartName) =>
					chartName === "track-duration" ? (
						<TrackDurationHistogramThumbnail key={chartName} chartName={chartName} />
					) : (
						<TrackPlaysChartThumbnail key={chartName} chartName={chartName} />
					)
				)}
			</div>
		</div>
	);
};

export default TrackVault;
