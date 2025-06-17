import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, PutCommand, ScanCommand, GetCommand, BatchGetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { getValidAccessToken } from "@/services/spotifyService";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const ddbDocClient = DynamoDBDocumentClient.from(client);
const SPOTIFY_ACTIVITY_TABLE = process.env.DYNAMODB_SPOTIFY_ACTIVITY_TABLE!;
const TRACK_METADATA_TABLE = process.env.DYNAMODB_TRACK_METADATA_TABLE!;
const ARTIST_METADATA_TABLE = process.env.DYNAMODB_ARTIST_METADATA_TABLE!;

export interface User {
	id: string;
	spotifyId: string;
	email?: string;
	displayName?: string;
	refreshToken?: string;
	accessToken?: string;
	tokenExpiresAt?: number;
	createdAt: string;
	updatedAt: string;
}

export async function upsertUser(user: User): Promise<void> {
	const params = {
		TableName: SPOTIFY_ACTIVITY_TABLE,
		Key: {
			PK: `USER#${user.id}`,
			SK: "METADATA",
		},
		UpdateExpression:
			"SET refreshToken = :rt, email = :email, displayName = :dn, spotifyId = :sid, updatedAt = :ua, createdAt = if_not_exists(createdAt, :ct)",
		ExpressionAttributeValues: {
			":rt": user.refreshToken,
			":email": user.email,
			":dn": user.displayName,
			":sid": user.spotifyId,
			":ua": user.updatedAt,
			":ct": user.createdAt,
		},
	};

	await ddbDocClient.send(new UpdateCommand(params));
}

export async function scanUsers(): Promise<User[]> {
	const params = {
		TableName: SPOTIFY_ACTIVITY_TABLE,
		FilterExpression: "#sk = :meta",
		ExpressionAttributeNames: { "#sk": "SK" },
		ExpressionAttributeValues: { ":meta": "METADATA" },
	};

	let users: User[] = [];
	let ExclusiveStartKey: any = undefined;

	do {
		const result = await ddbDocClient.send(new ScanCommand({ ...params, ExclusiveStartKey }));
		const items = result.Items || [];
		users = users.concat(
			items.map((item) => {
				const id = (item.PK as string).replace("USER#", "");
				return { ...item, id } as User;
			})
		);
		ExclusiveStartKey = result.LastEvaluatedKey;
	} while (ExclusiveStartKey);

	for (const user of users) {
		user.accessToken = (await getValidAccessToken(user)) ?? undefined;
	}

	return users;
}

export async function updateUserAccessToken(userId: string, accessToken: string, expiresIn: number): Promise<void> {
	const params = {
		TableName: process.env.DYNAMODB_SPOTIFY_ACTIVITY_TABLE!,
		Key: {
			PK: `USER#${userId}`,
			SK: "METADATA",
		},
		UpdateExpression: "SET accessToken = :at, tokenExpiresAt = :te, updatedAt = :ua",
		ExpressionAttributeValues: {
			":at": accessToken,
			":te": Date.now() + expiresIn * 1000,
			":ua": new Date().toISOString(),
		},
	};

	await ddbDocClient.send(new UpdateCommand(params));
}

export async function getUserById(userId: string): Promise<User | null> {
	const params = {
		TableName: SPOTIFY_ACTIVITY_TABLE,
		Key: {
			PK: `USER#${userId}`,
			SK: "METADATA",
		},
	};
	const result = await ddbDocClient.send(new GetCommand(params));
	return result.Item ? (result.Item as User) : null;
}

export interface TrackPlay {
	id: string;
	userId: string;
	trackId: string;
	playedAt: string;
	durationMs?: number;
	context?: string;
	playlistId?: string;
	artistIds?: string;
}

export async function saveTrackPlay(trackPlay: TrackPlay): Promise<void> {
	const sortKey = `TRACKPLAY#${trackPlay.trackId}#${trackPlay.playedAt}`;
	const item = {
		PK: `USER#${trackPlay.userId}`,
		SK: sortKey,
		trackId: trackPlay.trackId,
		playedAt: trackPlay.playedAt,
		durationMs: trackPlay.durationMs,
		context: trackPlay.context,
		playlistId: trackPlay.playlistId || "",
		artistIds: trackPlay.artistIds ? trackPlay.artistIds : undefined,
	};

	await ddbDocClient.send(
		new PutCommand({
			TableName: SPOTIFY_ACTIVITY_TABLE,
			Item: item,
			ConditionExpression: "attribute_not_exists(SK)",
		})
	);
}

export interface SavedTrack {
	id: string;
	userId: string;
	trackId: string;
	savedAt: string;
}

export async function saveSavedTrack(savedTrack: SavedTrack): Promise<void> {
	const sortKey = `SAVEDTRACK#${savedTrack.trackId}#${savedTrack.savedAt}`;
	const item = {
		PK: `USER#${savedTrack.userId}`,
		SK: sortKey,
		trackId: savedTrack.trackId,
		savedAt: savedTrack.savedAt,
	};

	await ddbDocClient.send(
		new PutCommand({
			TableName: SPOTIFY_ACTIVITY_TABLE,
			Item: item,
			ConditionExpression: "attribute_not_exists(SK)",
		})
	);
}

export interface ArtistFollow {
	id: string;
	userId: string;
	artistId: string;
	followedAt: string;
}

export async function saveArtistFollow(artistFollow: ArtistFollow): Promise<void> {
	const sortKey = `ARTISTFOLLOW#${artistFollow.artistId}#${artistFollow.followedAt}`;
	const item = {
		PK: `USER#${artistFollow.userId}`,
		SK: sortKey,
		artistId: artistFollow.artistId,
		followedAt: artistFollow.followedAt,
	};

	await ddbDocClient.send(
		new PutCommand({
			TableName: SPOTIFY_ACTIVITY_TABLE,
			Item: item,
			ConditionExpression: "attribute_not_exists(SK)",
		})
	);
}

export interface PlaylistPlay {
	id: string;
	userId: string;
	playlistId: string;
	playedAt: string;
}

export async function savePlaylistPlay(playlistPlay: PlaylistPlay): Promise<void> {
	const sortKey = `PLAYLISTPLAY#${playlistPlay.playlistId}#${playlistPlay.playedAt}`;
	const item = {
		PK: `USER#${playlistPlay.userId}`,
		SK: sortKey,
		playlistId: playlistPlay.playlistId,
		playedAt: playlistPlay.playedAt,
	};

	await ddbDocClient.send(
		new PutCommand({
			TableName: SPOTIFY_ACTIVITY_TABLE,
			Item: item,
			ConditionExpression: "attribute_not_exists(SK)",
		})
	);
}

export interface PlaylistTrack {
	id: string;
	userId: string;
	playlistId: string;
	trackId: string;
	addedAt: string;
}

export async function savePlaylistTrack(playlistTrack: PlaylistTrack): Promise<void> {
	const sortKey = `PLAYLISTTRACK#${playlistTrack.playlistId}#${playlistTrack.trackId}#${playlistTrack.addedAt}`;
	const item = {
		PK: `USER#${playlistTrack.userId}`,
		SK: sortKey,
		playlistId: playlistTrack.playlistId,
		trackId: playlistTrack.trackId,
		addedAt: playlistTrack.addedAt,
	};

	await ddbDocClient.send(
		new PutCommand({
			TableName: SPOTIFY_ACTIVITY_TABLE,
			Item: item,
			ConditionExpression: "attribute_not_exists(SK)",
		})
	);
}

export interface Playlist {
	id: string;
	userId: string;
	playlistId: string;
	name: string;
	description?: string;
	owner?: string;
	snapshotId?: string;
	totalTracks?: number;
	createdAt: string;
}

export async function savePlaylist(playlist: Playlist): Promise<void> {
	const sortKey = `PLAYLIST#${playlist.playlistId}`;
	const item = {
		PK: `USER#${playlist.userId}`,
		SK: sortKey,
		playlistId: playlist.playlistId,
		name: playlist.name,
		description: playlist.description,
		owner: playlist.owner,
		snapshotId: playlist.snapshotId,
		totalTracks: playlist.totalTracks,
		createdAt: playlist.createdAt,
	};

	await ddbDocClient.send(
		new PutCommand({
			TableName: SPOTIFY_ACTIVITY_TABLE,
			Item: item,
			ConditionExpression: "attribute_not_exists(SK)",
		})
	);
}

export async function getAllTrackPlays(user: any): Promise<TrackPlay[]> {
        const params = {
                TableName: SPOTIFY_ACTIVITY_TABLE,
                KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
                ExpressionAttributeValues: {
                        ":pk": `USER#${user.id}`,
                        ":skPrefix": "TRACKPLAY#",
                } as Record<string, any>,
                ScanIndexForward: false,
        };

        let trackPlays: TrackPlay[] = [];
        let ExclusiveStartKey: Record<string, any> | undefined;

        try {
                do {
                        const result = await ddbDocClient.send(
                                new QueryCommand({ ...params, ExclusiveStartKey })
                        );
                        trackPlays = trackPlays.concat((result.Items ?? []) as TrackPlay[]);
                        ExclusiveStartKey = result.LastEvaluatedKey;
                } while (ExclusiveStartKey);

                return trackPlays;
        } catch (error) {
                console.error("Error querying track plays:", error);
                throw error;
        }
}

export async function getTotalMinutesListened(
        user: { id: string },
        daysAgo: number
): Promise<number> {
        const threshold = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
        const thresholdISO = threshold.toISOString();

        const params = {
                TableName: SPOTIFY_ACTIVITY_TABLE,
                KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
                FilterExpression: "playedAt >= :threshold",
                ExpressionAttributeValues: {
                        ":pk": `USER#${user.id}`,
                        ":skPrefix": "TRACKPLAY#",
                        ":threshold": thresholdISO,
                },
        };

        let ExclusiveStartKey: Record<string, any> | undefined;
        let trackPlays: TrackPlay[] = [];

        do {
                const result = await ddbDocClient.send(
                        new QueryCommand({ ...params, ExclusiveStartKey })
                );
                trackPlays = trackPlays.concat((result.Items ?? []) as TrackPlay[]);
                ExclusiveStartKey = result.LastEvaluatedKey;
        } while (ExclusiveStartKey);

        const totalDurationMs = trackPlays.reduce(
                (sum, trackPlay) => sum + (trackPlay.durationMs || 0),
                0
        );
        const totalMinutes = totalDurationMs / 60000;

        return totalMinutes;
}

export async function getTopUsersByListeningMinutes(daysAgo: number, numUsers: number): Promise<Array<{ user: User; minutes: number }>> {
	const users = await scanUsers();

	const userMinutesArray = await Promise.all(
		users.map(async (user) => {
			const minutes = await getTotalMinutesListened(user, daysAgo);
			return { user, minutes };
		})
	);

	userMinutesArray.sort((a, b) => b.minutes - a.minutes);

	return userMinutesArray.slice(0, numUsers);
}

export async function getUserListeningMinutesPercentile(
	targetUser: User,
	daysAgo: number
): Promise<{ rank: number; totalUsers: number; percentile: number }> {
	const users = await scanUsers();

	const userMinutesArray = await Promise.all(
		users.map(async (user) => {
			const minutes = await getTotalMinutesListened(user, daysAgo);
			return { user, minutes };
		})
	);

	userMinutesArray.sort((a, b) => b.minutes - a.minutes);
	const totalUsers = userMinutesArray.length;

	const rank = userMinutesArray.findIndex((entry) => entry.user.id === targetUser.id) + 1;
	if (rank === 0) {
		return { rank: totalUsers, totalUsers, percentile: 100 };
	}

	const percentile = Math.round((rank / totalUsers) * 100);

	return { rank, totalUsers, percentile };
}

export async function getUndergroundScore(user: User): Promise<number> {
	const trackPlays = await getAllTrackPlays(user);
	if (!trackPlays.length) {
		return 0;
	}

	const trackDurationMap = new Map<string, number>();
	for (const play of trackPlays) {
		const trackId = play.trackId;
		if (!trackId) continue;

		const durationMs = play.durationMs ?? 0;
		trackDurationMap.set(trackId, (trackDurationMap.get(trackId) ?? 0) + durationMs);
	}

	const trackIds = Array.from(trackDurationMap.keys());
	const metadataList = await batchGetTrackMetadata(trackIds);

	let totalWeightedUnderground = 0;
	let totalMinutes = 0;

	for (const metadata of metadataList) {
		const trackId = metadata.trackId;
		const popularity = metadata.popularity ?? 50;
		const durationMs = trackDurationMap.get(trackId) ?? 0;
		const minutesListened = durationMs / 60_000;

		const undergroundness = popularity;

		totalWeightedUnderground += undergroundness * minutesListened;
		totalMinutes += minutesListened;
	}

	if (totalMinutes === 0) {
		return 0;
	}

	const undergroundScore = totalWeightedUnderground / totalMinutes;
	return undergroundScore;
}

export interface TrackMetadata {
	trackId: string;
	name: string;
	artists: { id: string; name: string }[];
	album: string;
	albumImageUrl?: string;
	durationMs: number;
	popularity?: number;
	releaseDate?: string;
	updatedAt: string;
}

export async function updateTrackMetadata(metadata: TrackMetadata): Promise<void> {
	const params = {
		TableName: TRACK_METADATA_TABLE,
		Key: { trackId: metadata.trackId },
		UpdateExpression:
			"SET #name = :name, artists = :artists, album = :album, albumImageUrl = :albumImageUrl, durationMs = :durationMs, popularity = :popularity, releaseDate = :releaseDate, updatedAt = :updatedAt",
		ExpressionAttributeNames: {
			"#name": "name",
		},
		ExpressionAttributeValues: {
			":name": metadata.name,
			":artists": metadata.artists,
			":album": metadata.album,
			":albumImageUrl": metadata.albumImageUrl,
			":durationMs": metadata.durationMs,
			":popularity": metadata.popularity,
			":releaseDate": metadata.releaseDate,
			":updatedAt": metadata.updatedAt,
		},
	};
	await ddbDocClient.send(new UpdateCommand(params));
}

export async function getTrackMetadata(trackId: string): Promise<TrackMetadata | null> {
	const params = { TableName: TRACK_METADATA_TABLE, Key: { trackId } };
	const result = await ddbDocClient.send(new GetCommand(params));
	return (result.Item as TrackMetadata) || null;
}

export async function saveTrackMetadata(metadata: TrackMetadata): Promise<void> {
	await ddbDocClient.send(
		new PutCommand({
			TableName: TRACK_METADATA_TABLE,
			Item: metadata,
			ConditionExpression: "attribute_not_exists(trackId)",
		})
	);
}

export async function batchGetTrackMetadata(trackIds: string[]): Promise<TrackMetadata[]> {
	const chunkSize = 100;
	const chunks: string[][] = [];

	for (let i = 0; i < trackIds.length; i += chunkSize) {
		chunks.push(trackIds.slice(i, i + chunkSize));
	}

	let allMetadata: TrackMetadata[] = [];

	for (const chunk of chunks) {
		const keys = chunk.map((id) => ({ trackId: id }));
		const params = {
			RequestItems: {
				[TRACK_METADATA_TABLE]: { Keys: keys },
			},
		};

		const result = await ddbDocClient.send(new BatchGetCommand(params));
		const metadata = (result.Responses?.[TRACK_METADATA_TABLE] || []) as TrackMetadata[];
		allMetadata = allMetadata.concat(metadata);
	}

	return allMetadata;
}

export interface ArtistMetadata {
	artistId: string;
	name: string;
	genres?: string[];
	popularity?: number;
	followers?: number;
	imageUrl?: string;
	updatedAt: string;
}

export async function updateArtistMetadata(metadata: ArtistMetadata): Promise<void> {
	const params = {
		TableName: ARTIST_METADATA_TABLE,
		Key: { artistId: metadata.artistId },
		UpdateExpression:
			"SET #name = :name, genres = :genres, popularity = :popularity, followers = :followers, imageUrl = :imageUrl, updatedAt = :updatedAt",
		ExpressionAttributeNames: {
			"#name": "name",
		},
		ExpressionAttributeValues: {
			":name": metadata.name,
			":genres": metadata.genres,
			":popularity": metadata.popularity,
			":followers": metadata.followers,
			":imageUrl": metadata.imageUrl,
			":updatedAt": metadata.updatedAt,
		},
	};
	await ddbDocClient.send(new UpdateCommand(params));
}

export async function getArtistMetadata(artistId: string): Promise<ArtistMetadata | null> {
	const params = { TableName: ARTIST_METADATA_TABLE, Key: { artistId } };
	const result = await ddbDocClient.send(new GetCommand(params));
	return (result.Item as ArtistMetadata) || null;
}

export async function saveArtistMetadata(metadata: ArtistMetadata): Promise<void> {
	await ddbDocClient.send(
		new PutCommand({
			TableName: ARTIST_METADATA_TABLE,
			Item: metadata,
			ConditionExpression: "attribute_not_exists(artistId)",
		})
	);
}

export async function batchGetArtistMetadata(artistIds: string[]): Promise<ArtistMetadata[]> {
	const chunkSize = 100;
	let allMetadata: ArtistMetadata[] = [];

	for (let i = 0; i < artistIds.length; i += chunkSize) {
		const chunk = artistIds.slice(i, i + chunkSize);
		const keys = chunk.map((id) => ({ artistId: id }));
		const params = {
			RequestItems: {
				[ARTIST_METADATA_TABLE]: { Keys: keys },
			},
		};
		const result = await ddbDocClient.send(new BatchGetCommand(params));
		const metadata = (result.Responses?.[ARTIST_METADATA_TABLE] || []) as ArtistMetadata[];
		allMetadata = allMetadata.concat(metadata);
	}

	return allMetadata;
}
