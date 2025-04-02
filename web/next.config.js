const path = require("path");

if (process.env.NODE_ENV !== "production") {
	require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
}

module.exports = {
	scope: "user-read-email user-top-read",
	images: {
		domains: ["i.scdn.co"],
	},
	env: {
		NEXTAUTH_DEBUG: process.env.NEXTAUTH_DEBUG,
		NEXTAUTH_URL: process.env.NEXTAUTH_URL,
		NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
		SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
		SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
		SPOTIFY_REDIRECT_URI: process.env.SPOTIFY_REDIRECT_URI,
		AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
		AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
		CDK_DEFAULT_REGION: process.env.CDK_DEFAULT_REGION,
		AWS_REGION: process.env.AWS_REGION,
		CDK_DEFAULT_ACCOUNT: process.env.CDK_DEFAULT_ACCOUNT,
		DYNAMODB_SPOTIFY_ACTIVITY_TABLE: process.env.DYNAMODB_SPOTIFY_ACTIVITY_TABLE,
		DYNAMODB_TRACK_METADATA_TABLE: process.env.DYNAMODB_TRACK_METADATA_TABLE,
		DYNAMODB_ARTIST_METADATA_TABLE: process.env.DYNAMODB_ARTIST_METADATA_TABLE,
	},
};
