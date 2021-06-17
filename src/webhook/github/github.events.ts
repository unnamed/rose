
// event name: 'push'
export interface Push {

	// refs/heads/main
	ref: string;

	// repository info
	repository: {
		// single repo name 'bot'
		name: string;
		// full repo name 'unnamed/bot'
		full_name: string;
		// url to this repository
		url: string;
		// number of watchers
		watchers: number;
		// number of stargazers
		stargazers: number;
	};

	// compare string url
	compare: string;

	// who pushed
	pusher: {
		name: string
	};

	// pushed commits
	commits: [
		{
			id: string;
			author: {
				name: string;
				username: string;
			},
			message: string;
		}
	];

}