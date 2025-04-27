import {
	ArtistMetadata,
	getArtistMetadata,
	getTrackMetadata,
	saveArtistFollow,
	saveArtistMetadata,
	savePlaylistPlay,
	saveSavedTrack,
	saveTrackMetadata,
	saveTrackPlay,
	TrackMetadata,
	updateArtistMetadata,
	updateTrackMetadata,
} from "@/services/dynamoService";

import { updateUserAccessToken } from "@/services/dynamoService";

export async function refreshAccessTokenForUser(user: any): Promise<string> {
	if (!user.refreshToken) {
		throw new Error(`No refresh token found for user ${user.id}`);
	}
	const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
	const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;

	const params = new URLSearchParams({
		grant_type: "refresh_token",
		refresh_token: user.refreshToken,
		client_id: SPOTIFY_CLIENT_ID,
		client_secret: SPOTIFY_CLIENT_SECRET,
	});

	const response = await fetch("https://accounts.spotify.com/api/token", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: params.toString(),
	});

	const data = await response.json();
	if (!response.ok) {
		throw new Error(`Failed to refresh token for user ${user.id}: ${data.error}`);
	}

	if (data.access_token && data.expires_in) {
		await updateUserAccessToken(user.id, data.access_token, data.expires_in);
	}

	return data.access_token;
}

export async function getValidAccessToken(user: any): Promise<string> {
	const currentTime = Date.now();
	if (user.accessToken && user.tokenExpiresAt && currentTime < user.tokenExpiresAt) {
		return user.accessToken;
	}
	const newAccessToken = await refreshAccessTokenForUser(user);
	return newAccessToken;
}

export async function updatePlayedTracks(user: any): Promise<void> {
	const accessToken = await getValidAccessToken(user);

	const spotifyUrl = "https://api.spotify.com/v1/me/player/recently-played?limit=50";
	const res = await fetch(spotifyUrl, {
		headers: { Authorization: `Bearer ${accessToken}` },
	});

	if (!res.ok) {
		throw new Error(`Spotify API error for user ${user.id}: ${res.status}`);
	}

	const data = await res.json();

	if (data.items) {
		for (const item of data.items) {
			const track = item.track;
			if (!track?.id) continue;
			const trackPlayRecord = {
				id: crypto.randomUUID(),
				userId: user.id,
				trackId: track.id,
				playedAt: item.played_at,
				durationMs: track.duration_ms,
				context: item.context ? JSON.stringify(item.context) : undefined,
				playlistId: item.context?.uri.split(":")[2] || null,
				artistIds: track.artists.map((artist: any) => artist.id).join(","),
			};

			try {
				await saveTrackPlay(trackPlayRecord);
				await getOrCacheTrackMetadata(track.id, accessToken);
				for (const artist of track.artists) {
					await getOrCacheArtistMetadata(artist, accessToken);
				}
			} catch (err: any) {
				if (err.name === "ConditionalCheckFailedException") {
				} else {
					throw err;
				}
			}
		}
	}
}

export async function updateSavedTracks(user: any): Promise<void> {
	const accessToken = await getValidAccessToken(user);
	const spotifyUrl = "https://api.spotify.com/v1/me/tracks?";

	const res = await fetch(spotifyUrl, {
		headers: { Authorization: `Bearer ${accessToken}` },
	});
	if (!res.ok) {
		throw new Error(`Spotify API error for user ${user.id}: ${res.status}`);
	}
	const data = await res.json();
	if (data.items) {
		for (const item of data.items) {
			const track = item.track;
			if (!track?.id) continue;
			const savedTrackRecord = {
				id: crypto.randomUUID(),
				userId: user.id,
				trackId: track.id,
				savedAt: item.addedAt,
			};
			try {
				await saveSavedTrack(savedTrackRecord);
				await getOrCacheTrackMetadata(track.id, accessToken);
				for (const artist of track.artists) {
					await getOrCacheArtistMetadata(artist, accessToken);
				}
			} catch (err: any) {
				if (err.name === "ConditionalCheckFailedException") {
				} else {
					throw err;
				}
			}
		}
	}
}

export async function updateArtistFollows(user: any): Promise<void> {
	const access_token = await refreshAccessTokenForUser(user);
	const spotifyUrl = "https://api.spotify.com/v1/me/following?type=artist&limit=50";

	const res = await fetch(spotifyUrl, {
		headers: { Authorization: `Bearer ${access_token}` },
	});

	if (!res.ok) {
		throw new Error(`Spotify API error for user ${user.id}: ${res.status}`);
	}

	const data = await res.json();
	console.log(data);

	if (data.artists?.items) {
		for (const artist of data.artists.items) {
			const artistFollowRecord = {
				id: crypto.randomUUID(),
				userId: user.id,
				artistId: artist.id,
				followedAt: new Date().toISOString(),
			};

			try {
				await saveArtistFollow(artistFollowRecord);
				await getOrCacheArtistMetadata(artist, access_token);
			} catch (err: any) {
				if (err.name === "ConditionalCheckFailedException") {
				} else {
					throw err;
				}
			}
		}
	}
}

export async function updatePlaylistPlays(user: any): Promise<void> {
	const accessToken = await getValidAccessToken(user);
	const spotifyUrl = "https://api.spotify.com/v1/me/player/recently-played?limit=50";

	const res = await fetch(spotifyUrl, {
		headers: { Authorization: `Bearer ${accessToken}` },
	});

	if (!res.ok) {
		throw new Error(`Spotify API error for user ${user.id}: ${res.status}`);
	}

	const data = await res.json();

	if (data.items) {
		for (const item of data.items) {
			if (item.context && item.context.type === "playlist") {
				const playlistUriParts = item.context.uri.split(":");
				const playlistId = playlistUriParts[2] || null;
				if (!playlistId) continue;

				const playlistPlayRecord = {
					id: crypto.randomUUID(),
					userId: user.id,
					playlistId: playlistId,
					playedAt: item.played_at,
					context: JSON.stringify(item.context),
					liked: false,
				};

				try {
					await savePlaylistPlay(playlistPlayRecord);
				} catch (err: any) {
					if (err.name === "ConditionalCheckFailedException") {
					} else {
						throw err;
					}
				}
			}
		}
	}
}

import { savePlaylist } from "@/services/dynamoService";

export async function updatePlaylists(user: any): Promise<void> {
	const accessToken = await getValidAccessToken(user);
	const spotifyUrl = "https://api.spotify.com/v1/me/playlists?limit=50";

	const res = await fetch(spotifyUrl, {
		headers: { Authorization: `Bearer ${accessToken}` },
	});

	if (!res.ok) {
		throw new Error(`Spotify API error for user ${user.id}: ${res.status}`);
	}

	const data = await res.json();

	if (data.items) {
		for (const playlist of data.items) {
			const playlistRecord = {
				id: crypto.randomUUID(),
				userId: user.id,
				playlistId: playlist.id,
				name: playlist.name,
				description: playlist.description,
				owner: playlist.owner?.id,
				snapshotId: playlist.snapshot_id,
				totalTracks: playlist.tracks?.total,
				createdAt: new Date().toISOString(),
			};

			try {
				await savePlaylist(playlistRecord);
			} catch (err: any) {
				if (err.name === "ConditionalCheckFailedException") {
				} else {
					throw err;
				}
			}
		}
	}
}

async function getOrCacheTrackMetadata(trackId: string, accessToken: string): Promise<TrackMetadata> {
	let metadata = await getTrackMetadata(trackId);

	const res = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
		headers: { Authorization: `Bearer ${accessToken}` },
	});
	if (!res.ok) {
		throw new Error(`Spotify API error fetching metadata for track ${trackId}: ${res.status}`);
	}
	const trackData = await res.json();
	const newMetadata: TrackMetadata = {
		trackId: trackData.id,
		name: trackData.name,
		artists: trackData.artists.map((a: any) => ({ id: a.id, name: a.name })),
		album: trackData.album.name,
		albumImageUrl: trackData.album.images?.[0]?.url,
		durationMs: trackData.duration_ms,
		popularity: trackData.popularity,
		releaseDate: trackData.album.release_date,
		updatedAt: new Date().toISOString(),
	};

	if (!metadata) {
		await saveTrackMetadata(newMetadata);
	} else {
		await updateTrackMetadata(newMetadata);
	}
	return newMetadata;
}

async function getOrCacheArtistMetadata(artist: any, accessToken: string): Promise<ArtistMetadata> {
	let metadata = await getArtistMetadata(artist.id);

	const res = await fetch(`https://api.spotify.com/v1/artists/${artist.id}`, {
		headers: { Authorization: `Bearer ${accessToken}` },
	});
	if (!res.ok) {
		throw new Error(`Spotify API error fetching metadata for artist ${artist.id}: ${res.status}`);
	}
	const artistData = await res.json();
	const newMetadata: ArtistMetadata = {
		artistId: artistData.id,
		name: artistData.name,
		genres: artistData.genres,
		popularity: artistData.popularity,
		followers: artistData.followers?.total,
		imageUrl: artistData.images?.[0]?.url || "",
		updatedAt: new Date().toISOString(),
	};

	if (!metadata) {
		await saveArtistMetadata(newMetadata);
	} else {
		await updateArtistMetadata(newMetadata);
	}
	return newMetadata;
}

export async function updateUserSpotifyData(user: any): Promise<void> {
	await updatePlayedTracks(user);
	// await updateSavedTracks(user);
	// await updateArtistFollows(user);
	await updatePlaylistPlays(user);
	await updatePlaylists(user);
}
