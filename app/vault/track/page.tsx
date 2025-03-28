import { TrackPlaysChartThumbnail } from "@/components/custom/vault/track/trackPlays/trackPlaysChartThumbnail";
import React from "react";

const TrackVault: React.FC = () => {
	const chartNames = ["Track Plays", "Minutes Listened Over Time"];

	return (
		<div className="grid grid-cols-2 gap-3 mt-14">
			{chartNames.map((chartName) => (
				<TrackPlaysChartThumbnail key={chartName} chartName={chartName} />
			))}
		</div>
	);
};

export default TrackVault;
