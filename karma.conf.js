module.exports = function(config) {
  config.set({
    browsers: ['swd_chrome'],
    customLaunchers: {
      swd_chrome: {
        base: 'SeleniumWebdriver',
        browserName: 'Chrome',
        getDriver: function(){
          var webdriver = require('selenium-webdriver');
          return new webdriver.Builder()
              .forBrowser('chrome')
              .usingServer('http://localhost:4444/wd/hub')
              .build();
        }
      }
    },
    frameworks: ['jasmine'],
    reporters: ['dots']
  });
};
