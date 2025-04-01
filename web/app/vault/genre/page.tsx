import GenreDistributionPieChartThumbnail from "@/components/custom/vault/genre/genreDistribution/genreDistributionPieChartThumnail.tsx";

const GenereVault: React.FC = () => {
	const chartNames = ["genre-pie-chart"];

	return (
		<div>
			<h1 className="text-3xl font-bold text-start mb-10">Genre Vault</h1>
			<div className="grid grid-cols-2 gap-3 mt-14">
				{chartNames.map((chartName) =>
					chartName === "genre-pie-chart" ? <GenreDistributionPieChartThumbnail key={chartName} chartName={chartName} /> : null
				)}
			</div>
		</div>
	);
};

export default GenereVault;
