module.exports = {
  staticFileGlobs: [
    'dist/**.css',
    'dist/**.html',
    'dist/**/*.js',
    'dist/assets/*',
    'dist/favicon.ico'
    
  ],
  stripPrefix: 'dist/',
  runtimeCaching: [
    {
      urlPattern: /assets\/schedule\.json/,
      handler: 'networkFirst'
    },
    {
      urlPattern: /service-worker\.json/,
      handler: 'networkFirst'
    }
  ]
};