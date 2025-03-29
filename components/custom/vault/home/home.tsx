import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TopArtists } from "@/hooks/user/topArtists";
import { TopTracks, TopTrack } from "@/hooks/user/topTracks";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useMinutesListened } from "@/hooks/user/minutes-listened";
import { useListeningPercentile } from "@/hooks/user/listening-percentile";
import { useUndergroundScore } from "@/hooks/user/underground-score";
import CardLoader from "../../CardLoader";
import { SpotifyLink } from "../../SpotifyLink";
import { useUserData } from "@/hooks/user/useUserData";

export default function Home() {
	const { data: session } = useSession();
	const { topArtists, loading: artistsLoading, error: artistsError } = TopArtists("long_term", 5);
	const { topTracks, loading: tracksLoading, error: tracksError } = TopTracks("long_term", 5);
	const { minutesListened, loading: minutesLoading, error: minutesError } = useMinutesListened(10000);
	const { percentileData, error: percentileError } = useListeningPercentile(10000);
	const { undergroundScore, error: undergroundScoreError } = useUndergroundScore();
	const { user } = useUserData(session?.user?.name || "");
	const formattedJoinedAtDate = user?.createdAt
		? new Date(user.createdAt).toLocaleDateString(undefined, {
				year: "numeric",
				month: "long",
				day: "numeric",
		  })
		: "";
	if (artistsError || tracksError) {
		return (
			<Card className="w-full mx-auto p-6">
				<CardHeader>
					<CardTitle className="text-3xl">Error Loading Vault</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-xl">Unable to retrieve your Spotify data</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="w-full mx-auto shadow-2xl p-6 h-full">
			{artistsLoading || tracksLoading || minutesLoading ? (
				<CardContent className="flex items-center justify-center min-h-[30rem]">
					<CardLoader />
				</CardContent>
			) : (
				<>
					<CardHeader className="flex flex-row-reverse justify-between items-center pb-6">
						<Avatar className="w-50 h-50">
							<AvatarImage src={session?.user?.image || "/default-avatar.png"} alt={`${session?.user?.name}'s profile`} className="object-cover" />
							<AvatarFallback className="text-4xl">{session?.user?.name?.charAt(0) || "U"}</AvatarFallback>
						</Avatar>

						<div>
							<CardTitle className="text-3xl mb-4">
								<span>
									Welcome to the Vault,&nbsp;
									<span className="italic">{session?.user?.name}</span>
								</span>
							</CardTitle>
						</div>
					</CardHeader>

					<CardContent>
						<div className="flex">
							<div className="w-1/4 rounded-lg">
								<h3 className="text-xl font-bold mb-4">Total Listening</h3>
								{minutesError ? (
									<p className="text-muted-foreground">Error loading minutes listened</p>
								) : (
									<p className="text-2xl">{minutesListened?.toPrecision(5) ?? "No minutes listened"} minutes</p>
								)}

								<h3 className="text-xl font-bold mt-4 mb-4">Listening Rank</h3>
								{percentileError ? (
									<p className="text-muted-foreground">Error loading listening Percentile</p>
								) : (
									<p className="text-2xl">{percentileData?.rank}</p>
								)}

								<h3 className="text-xl font-bold mt-4 mb-4">Underground Score</h3>
								{undergroundScoreError ? (
									<p className="text-muted-foreground">Error loading Underground Score</p>
								) : (
									<p className="text-2xl">{undergroundScore?.toPrecision(2) ?? "No underground score"}</p>
								)}
							</div>

							<div className="w-1/3 rounded-lg">
								<h3 className="text-xl font-bold mb-4">Joined</h3>
								<p className="text-2xl">{formattedJoinedAtDate}</p>
							</div>

							<div className="flex w-1/2">
								<div className="w-1/2 rounded-lg">
									<h3 className="text-xl font-bold mb-4">Top Artists</h3>
									<div className="space-y-3">
										{topArtists.map((artist) => (
											<div key={artist.id} className="flex items-center space-x-3">
												<div className="w-16 h-16 relative rounded-lg overflow-hidden shadow-md">
													<SpotifyLink id={artist.id} externalUrl={artist.external_urls.spotify} type="artist">
														<Image
															src={artist.images?.[0]?.url || "/placeholder-artist.png"}
															alt={artist.name}
															layout="fill"
															objectFit="cover"
															className="transition-transform duration-300 hover:scale-110"
														/>
													</SpotifyLink>
												</div>
												<SpotifyLink id={artist.id} externalUrl={artist.external_urls.spotify} type="artist">
													{artist.name}
												</SpotifyLink>
											</div>
										))}
									</div>
								</div>
								<div className="w-1/2 pl-4">
									<h3 className="text-xl font-bold mb-4">Top Tracks</h3>
									<div className="space-y-3">
										{topTracks.map((track: TopTrack) => (
											<div key={track.id} className="flex items-center space-x-3">
												<div className="w-16 h-16 flex-shrink-0 relative rounded-lg overflow-hidden shadow-md">
													<Image
														src={track.album.images?.[0]?.url || "/placeholder-track.png"}
														alt={track.name}
														layout="fill"
														objectFit="cover"
														className="transition-transform duration-300 hover:scale-110"
													/>
												</div>
												<SpotifyLink id={track.id} externalUrl={track.external_urls.spotify} type="track">
													{track.name}
												</SpotifyLink>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</>
			)}
		</Card>
	);
}
