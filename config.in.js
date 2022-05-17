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
          size: 5e+6, // 5MB by default
        }
      }
    }
  }
};
