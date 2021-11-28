/**
 * Configuration file for the
 * bot, contains style and names
 */
export default {
  color: 0xFFFFFF,
  developers: [
    // developer ids
    '000000000000000000'
  ],
  discord: {
    token: 'YOUR TOKEN HERE!'
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
          size: 200 * 1000, // 200KB should be enough
        }
      }
    }
  }
};
