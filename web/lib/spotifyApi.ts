export async function getSpotifyUserProfile(accessToken: string) {
	try {
		const response = await fetch("https://api.spotify.com/v1/me", {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		console.log("REPONSE", response);

		if (response.ok) {
			const data = await response.json();
			return data;
		}

		return null;
	} catch (error) {
		console.error("Error fetching Spotify profile:", error);
		return null;
	}
}
