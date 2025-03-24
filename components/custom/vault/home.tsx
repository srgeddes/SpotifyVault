import { TopArtist } from "@/app/hooks/user/topArtist";
import { useSession } from "next-auth/react";

export default function Home() {
	const { data: session } = useSession();
	const { topArtists, loading, error } = TopArtist("long_term", 20);

	if (!session) {
		return <div>Please sign in to view your top artists.</div>;
	}

	if (loading) {
		return <div>Loading your top artists...</div>;
	}

	if (error) {
		return <div>Error loading top artists: {error.message}</div>;
	}

	return (
		<div>
			<h2>Your Top Artists</h2>
			<ul>
				{topArtists.map((artist, index) => (
					<li key={index}>{artist}</li>
				))}
			</ul>
		</div>
	);
}
