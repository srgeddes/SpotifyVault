export async function getAccessToken(): Promise<string> {
	const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
	const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;

	const response = await fetch("https://accounts.spotify.com/api/token", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			Authorization: "Basic " + Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64"),
		},
		body: "grant_type=client_credentials",
	});

	const data = await response.json();
	return data.access_token;
}
