/**
 * Configuration file for the
 * bot, contains style and names
 */
export default {
  color: 0xff8df8,
  developers: [
    // developer ids
    '000000000000000000'
  ],
  discord: {
    // The Discord bot token here
    token: null
  },
  http: {
    port: 2346,
    // enable if running behind a reverse proxy
    // https://expressjs.com/en/guide/behind-proxies.html
    trustProxy: false,
    modules: {
      githubWebhook: {
        enabled: false,
        route: '/github-webhook',
        secret: 'YOUR SECRET HERE!'
      },
      temporalFileServer: {
        enabled: false,
        route: '/tempfiles',
        lifetime: 5 * 60 * 1000, // file lifetime, 5 minutes should be enough
        limits: {
          // The file size limit for the temporal file server,
          // (5MB by default) Please note that some reverse proxies
          // like Nginx have their own limit (Default Nginx limit is 1MB)
          // and you must configure that manually (With the client_max_body_size
          // option)
          size: 5e+6,
        }
      }
    }
  }
};
