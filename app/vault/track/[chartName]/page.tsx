"use client";
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
			<div className="container mx-auto flex flex-col items-center justify-center p-4 min-h-full">
				{chartName === "track-plays" ? (
					<TrackPlaysChart chartName={displayChartName} />
				) : chartName === "track-duration" ? (
					<TrackDurationHistogramChart chartName={displayChartName} />
				) : (
					<div>Unknown chart type</div>
				)}
			</div>
		</div>
	);
};

export default TrackChartDetailPage;
