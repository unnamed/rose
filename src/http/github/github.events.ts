export interface Repository {
  // repository id
  id: number;
  // single repo name 'bot'
  name: string;
  private: boolean;
  // full repo name 'unnamed/bot'
  full_name: string;
  // url to this repository
  url: string;
  // number of watchers
  watchers: number;
  // number of stargazers
  stargazers: number;
  // number of forks
  forks_count: number;
}

export interface Commit {
  id: string;
  author: {
    name: string;
    username: string;
  },
  url: string;
  message: string;
}

export interface Organization {
  name: string;
}

export interface PullRequest {
  id: number;
  html_url: string;
  title: string;
  user: {
    login: string;
    html_user: string;
  };
  body: string;
}

/**
 * All the possible pull request event actions, see
 * docs.github.com/en/developers/webhooks-and-events/webhooks/webhook-events-and-payloads#pull_request
 */
type PullRequestEventAction = 'opened' | 'closed' | 'reopened'
  | 'assigned' | 'auto_merge_disabled' | 'auto_merge_enabled'
  | 'converted_to_draft' | 'edited' | 'labeled' | 'locked'
  | 'ready_for_review' | 'review_request_removed' | 'review_request'
  | 'synchronize' | 'unassigned' | 'unlabeled' | 'unlocked';

// event name: 'pull_request'
export interface PullRequestEvent {
  action: PullRequestEventAction;
  number: number;
  pull_request: PullRequest;
  repository: Repository;
  sender: {
    login: string;
  };
}

export interface Issue {
  id: number;
  title: string;
  html_url: string;
  user: {
    id: number;
    login: string;
    html_url: string;
  };
  labels: [
    {
      id: number;
      name: string;
      color: string;
    }
  ];
  // 'open', ...
  state: string;
}

// event name: 'issues'
export interface IssueEvent {
  action: 'opened' | 'edited' | 'deleted' | 'pinned' | 'unpinned'
    | 'closed' | 'reopened' | 'assigned' | 'unassigned'
    | 'labeled' | 'unlabeled' | 'locked' | 'unlocked'
    | 'transferred' | 'milestoned' | 'demilestoned';
  issue: Issue;
  // The changes to the issue if the action was 'edited'
  changes?: {
    title: {
      from: string;
    };
    body: {
      from: string;
    };
  };
  // user who was assigned or unassigned from the issue
  assignee?: Record<string, unknown>;
  // label that was added or removed from the issue
  label?: Record<string, unknown>;
  repository: Repository;
  sender: {
    login: string;
    avatar_url: string;
    html_url: string;
  }
}

// event name: 'star'
export interface Star {
  action: 'created' | 'deleted'; // 'created', 'deleted'
  // the time the star was created in ISO 8601 format, null for 'deleted' action.
  starred_at?: string;
  repository: {
    // repository id
    id: number;
    // single repo name 'bot'
    name: string;
    private: boolean;
    // full repo name 'unnamed/bot'
    full_name: string;
    // api url to this repository
    url: string;
    // url to this repository
    html_url: string;
    // number of watchers
    watchers: number;
    // number of stargazers
    stargazers: number;
    // number of forks
    forks_count: number;
  };
  organization?: Organization;
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
  commits: Commit[];

}

// event name: "check_run"
export interface CheckRun {

  // action, I've only seen 'created', I should check the documentation but I'm too lazy
  action: 'created' | string;

  check_run: {
    output: {
      title: string;
      summary: string;
    }
  };

  // the repository where the check ran, GitHub is A LITTLE BIT inconsistent
  // so I can't use the Repository interface here
  repository: {
    // repo name, i.e. "webpage"
    name: string;
    // full repo name, i.e. "unnamed/webpage"
    full_name: string;
    // url to the html page
    html_url: string;
  }

}