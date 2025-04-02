"use client";
import ArtistPlaysChart from "@/components/custom/vault/artist/artistPlaysOvertime/artistPlaysOvertimeChart";
import { useParams } from "next/navigation";

const ArtistChartDetailPage: React.FC = () => {
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
			<div className="mx-auto flex flex-col items-center justify-center p-4 min-h-full">
				{chartName === "artist-plays" ? <ArtistPlaysChart chartName={displayChartName} /> : null}
			</div>
		</div>
	);
};

export default ArtistChartDetailPage;
