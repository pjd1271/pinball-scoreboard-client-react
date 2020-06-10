export default {
	MAX_ATTACHMENT_SIZE: 5000000,
	s3: {
		REGION: 'us-east-1',
		BUCKET: 'pinball-scoreboard-photoattachmentbucket',
	},
	apiGateway: {
		REGION: 'us-east-1',
		URL: 'https://nfamlte3cb.execute-api.us-east-1.amazonaws.com/prod',
	},
	cognito: {
		REGION: 'us-east-1',
		USER_POOL_ID: 'us-east-1_Ejn5utH7S',
		APP_CLIENT_ID: '3uiessni9v4m4hh47dabc12bm7',
		IDENTITY_POOL_ID: 'us-east-1:0aa05a2d-a1e3-4430-a1e4-78d32c84cf8c',
	},
};
