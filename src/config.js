/**
 * Configuration file for the
 * bot, contains style and names
 */
export default {
  color: 0xff8df5,
  developers: [
    '593188834112700418', // Yusshu
    '226997678117093376', // Cuarentona
    '345353550647263244', // Pixel
    '196182605287129090', // Fixsex
    '187695491163619328', // Flsex
    '278642935426449418', // Toamto
    '159425331143507968', // Neerixx
  ],
  http: {
    port: 2346,
    // enable if running behind a reverse proxy
    // https://expressjs.com/en/guide/behind-proxies.html
    trustProxy: false,
    modules: {
      githubWebhook: {
        enabled: true,
        route: '/github-webhook'
      },
      fileServer: {
        enabled: true,
        route: '/files',
        dataDir: 'build/data'
      },
      temporalFileServer: {
        enabled: true,
        route: '/tempfiles',
        lifetime: 5 * 60 * 1000, // file lifetime, 5 minutes should be enough
        limits: {
          size: 200 * 1000, // 200KB should be enough
        }
      }
    }
  }
};
