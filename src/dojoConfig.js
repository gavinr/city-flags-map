var dojoConfig = {
  isDebug: true,
  async: true,
  useBlendWidget: true,
  deps: ['app/main'],
  packages: [{
    name: 'app',
    location: location.pathname.replace(new RegExp(/\/[^\/]+$/), '') + 'app'
  }]
};