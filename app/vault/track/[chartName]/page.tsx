"use client";
import React from "react";
import { useParams } from "next/navigation";
import { TrackPlaysChart } from "@/components/custom/vault/track/trackPlays/trackPlaysChart";

const TrackChartDetailPage: React.FC = () => {
	const { chartName } = useParams() as { chartName?: string };

	if (!chartName) {
		return <div>No chart name provided.</div>;
	}

	const decodedChartName = decodeURIComponent(chartName);

	return (
		<div className="container mx-auto flex flex-col items-center justify-center p-4 min-h-full">
			<TrackPlaysChart chartName={decodedChartName} />
		</div>
	);
};

export default TrackChartDetailPage;
