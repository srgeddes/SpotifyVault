"use client";
import TopTracksChart from "@/components/custom/vault/track/topTracks/topTracksChart";
import { TrackDurationHistogramChart } from "@/components/custom/vault/track/trackDurationHistogram/trackDurationHistogramChart";
import TrackPlaysChart from "@/components/custom/vault/track/trackPlays/trackPlaysChart";
import { useParams } from "next/navigation";

const TrackChartDetailPage: React.FC = () => {
	const { chartName } = useParams() as { chartName?: string };

	if (!chartName) {
		return <div>No chart name provided.</div>;
	}

	const displayChartName = chartName
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");

	return (
		<div>
			<div className="w-full mx-auto flex flex-col items-center justify-center p-4 min-h-full">
				{chartName === "track-plays" ? (
					<TrackPlaysChart chartName={displayChartName} />
				) : chartName === "track-duration" ? (
					<TrackDurationHistogramChart chartName={displayChartName} />
				) : chartName === "top-tracks" ? (
					<TopTracksChart chartName={displayChartName} />
				) : (
					<div>Chart not found.</div>
				)}
			</div>
		</div>
	);
};

export default TrackChartDetailPage;
