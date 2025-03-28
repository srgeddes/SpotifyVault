import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

export class SpotifyVaultDynamoDBStack extends cdk.Stack {
	public readonly activityTable: dynamodb.Table;
	public readonly trackMetadataTable: dynamodb.Table;
	public readonly artistMetadataTable: dynamodb.Table;

	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		this.activityTable = new dynamodb.Table(this, "SpotifyActivityTable", {
			tableName: "SpotifyActivity",
			partitionKey: { name: "PK", type: dynamodb.AttributeType.STRING },
			sortKey: { name: "SK", type: dynamodb.AttributeType.STRING },
			billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
		});

		this.trackMetadataTable = new dynamodb.Table(this, "SpotifyTrackMetadata", {
			tableName: "SpotifyTrackMetadata",
			partitionKey: { name: "trackId", type: dynamodb.AttributeType.STRING },
			billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
		});

		this.artistMetadataTable = new dynamodb.Table(this, "SpotifyArtistMetadata", {
			tableName: "SpotifyArtistMetadata",
			partitionKey: { name: "artistId", type: dynamodb.AttributeType.STRING },
			billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
		});
	}
}
