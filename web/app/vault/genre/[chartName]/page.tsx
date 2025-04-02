"use client";

import { useParams } from "next/navigation";
import GenreDistributionPieChart from "@/components/custom/vault/genre/genreDistribution/genreDistributionPieChart";

export default function GenreChartDetailPage() {
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
				{chartName === "genre-pie-chart" ? <GenreDistributionPieChart chartName={displayChartName} /> : null}
			</div>
		</div>
	);
}
