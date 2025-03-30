import ArtistPlaysChartThumbnail from "@/components/custom/vault/artist/artistPlays/artistPlaysChartThumnail";

const ArtistVault: React.FC = () => {
	const chartNames = ["artist-plays"];

	return (
		<div>
			<h1 className="text-3xl font-bold text-start mb-10">Artist Vault</h1>
			<div className="grid grid-cols-2 gap-3 mt-14">
				{chartNames.map((chartName) => (chartName === "artist-plays" ? <ArtistPlaysChartThumbnail key={chartName} chartName={chartName} /> : null))}
			</div>
		</div>
	);
};

export default ArtistVault;
