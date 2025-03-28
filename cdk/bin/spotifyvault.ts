import * as cdk from "aws-cdk-lib";
import { SpotifyVaultDynamoDBStack } from "../lib/spotify-dynamodb-stack";

const app = new cdk.App();
new SpotifyVaultDynamoDBStack(app, "SpotifyVaultDynamoDBStack", {
	env: {
		region: process.env.CDK_DEFAULT_REGION || "us-east-1",
		account: process.env.CDK_DEFAULT_ACCOUNT,
	},
});
