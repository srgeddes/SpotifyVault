import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, PutCommand, ScanCommand, GetCommand, BatchGetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const ddbDocClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.DYNAMODB_TABLE!;
const TRACK_METADATA_TABLE = process.env.DYNAMODB_TRACK_METADATA_TABLE!;
const ARTIST_METADATA_TABLE = process.env.DYNAMODB_ARTIST_METADATA_TABLE!;

export interface User {
	id: string;
	spotifyId: string;
	email?: string;
	displayName?: string;
	refreshToken?: string;
	createdAt: string;
	updatedAt: string;
}

export async function upsertUser(user: User): Promise<void> {
	const params = {
		TableName: TABLE_NAME,
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
		TableName: TABLE_NAME,
		FilterExpression: "#sk = :meta",
		ExpressionAttributeNames: { "#sk": "SK" },
		ExpressionAttributeValues: { ":meta": "METADATA" },
	};

	const result = await ddbDocClient.send(new ScanCommand(params));
	return result.Items as User[];
}

export interface TrackPlay {
	id: string;
	userId: string;
	trackId: string;
	playedAt: string;
	durationMs?: number;
	context?: string;
	playlistId?: string;
	liked?: boolean;
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
		liked: trackPlay.liked || false,
	};

	await ddbDocClient.send(
		new PutCommand({
			TableName: TABLE_NAME,
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
			TableName: TABLE_NAME,
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
			TableName: TABLE_NAME,
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
			TableName: TABLE_NAME,
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
			TableName: TABLE_NAME,
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
			TableName: TABLE_NAME,
			Item: item,
			ConditionExpression: "attribute_not_exists(SK)",
		})
	);
}

export async function getAllTrackPlays(user: any): Promise<TrackPlay[]> {
	const params = {
		TableName: TABLE_NAME,
		KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
		ExpressionAttributeValues: {
			":pk": `USER#${user.id}`,
			":skPrefix": "TRACKPLAY#",
		} as Record<string, any>,
		ScanIndexForward: false,
	};

	try {
		const result = await ddbDocClient.send(new QueryCommand(params));
		console.log("RESULT", result);
		return (result.Items ?? []) as TrackPlay[];
	} catch (error) {
		console.error("Error querying track plays:", error);
		throw error;
	}
}

export async function getTotalMinutesListened(user: { id: string }, daysAgo: number): Promise<number> {
	const threshold = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
	const thresholdISO = threshold.toISOString();

	const params = {
		TableName: TABLE_NAME,
		KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
		FilterExpression: "playedAt >= :threshold",
		ExpressionAttributeValues: {
			":pk": `USER#${user.id}`,
			":skPrefix": "TRACKPLAY#",
			":threshold": thresholdISO,
		},
	};

	const result = await ddbDocClient.send(new QueryCommand(params));
	const trackPlays = (result.Items ?? []) as TrackPlay[];

	const totalDurationMs = trackPlays.reduce((sum, trackPlay) => sum + (trackPlay.durationMs || 0), 0);
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

		const undergroundness = 100 - popularity;

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
	const keys = trackIds.map((id) => ({ trackId: id }));
	const params = {
		RequestItems: {
			[TRACK_METADATA_TABLE]: { Keys: keys },
		},
	};
	const result = await ddbDocClient.send(new BatchGetCommand(params));
	return (result.Responses?.[TRACK_METADATA_TABLE] || []) as TrackMetadata[];
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
	const keys = artistIds.map((id) => ({ artistId: id }));
	const params = {
		RequestItems: {
			[ARTIST_METADATA_TABLE]: { Keys: keys },
		},
	};
	const result = await ddbDocClient.send(new BatchGetCommand(params));
	return (result.Responses?.[ARTIST_METADATA_TABLE] || []) as ArtistMetadata[];
}
