export interface Repository {
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
}

// event name: 'star'
export interface Star {
	action: string; // 'created', 'deleted'
	repository: Repository;
	sender: {
		login: string;
		avatar_url: string;
		html_url: string;
	}
}

// event name: 'push'
export interface Push {

	// refs/heads/main
	ref: string;

	// repository info
	repository: Repository;

	// compare string url
	compare: string;

	// who pushed
	sender: {
		login: string;
		avatar_url: string;
		html_url: string;
	};

	// pushed commits
	commits: [
		{
			id: string;
			author: {
				name: string;
				username: string;
			},
			url: string;
			message: string;
		}
	];

}