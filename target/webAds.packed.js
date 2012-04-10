(function() {
  "use strict";
  var Banner, Iframe, webAds;

  if (window.FINN == null) window.FINN = {};

  if (FINN.webAds == null) FINN.webAds = {};

  webAds = FINN.webAds;

  Iframe = (function() {

    function Iframe(name, options, id) {
      this.name = name;
      this.options = options != null ? options : {};
      this.id = id != null ? id : 'webad-' + this.name;
    }

    Iframe.prototype.remove = function() {
      return this.$wrapper.remove();
    };

    Iframe.prototype.refresh = function() {
      var currSrc, iframeUrl, url;
      iframeUrl = webAds.iframeUrl || "/finn/webads";
      currSrc = this.$iframe.attr('src');
      url = currSrc === ("" + iframeUrl + "?refresh#" + this.name) ? "" + iframeUrl + "#" + this.name : "" + iframeUrl + "?refresh#" + this.name;
      return this.$iframe.attr('src', url);
    };

    Iframe.prototype.makeIframe = function() {
      var div, iframe, iframeUrl, innerDiv;
      iframeUrl = webAds.iframeUrl || "/finn/webads";
      div = document.createElement('div');
      innerDiv = document.createElement('div');
      iframe = document.createElement('iframe');
      innerDiv.className = 'inner';
      div.id = this.id;
      div.className = "advertising webads " + this.id;
      iframe.src = "" + iframeUrl + "#" + this.name;
      iframe.scrolling = 'no';
      iframe.className = 'webad-iframe';
      iframe.marginWidth = 0;
      iframe.marginHeight = 0;
      iframe.frameBorder = '0';
      iframe.allowTransparency = 'true';
      iframe.width = this.options.width || 100;
      iframe.height = this.options.height || 100;
      iframe.style.border = '0px';
      iframe.style.width = (this.options.width || 100) + 'px';
      iframe.style.height = (this.options.height || 100) + 'px';
      innerDiv.appendChild(iframe);
      div.appendChild(innerDiv);
      this.$iframe = $(iframe);
      return this.$wrapper = $(div);
    };

    return Iframe;

  })();

  Banner = (function() {

    function Banner(params, exposeObj) {
      this.params = params;
      this.exposeObj = exposeObj != null ? exposeObj : {};
      this.name = this.params.name;
      this.url = this.params.url;
      this.container = this.params.container;
      this.width = this.params.width;
      this.height = this.params.height;
      this.iframe = new Iframe(this.name, this.params);
      this.active = false;
      this.retries = 5;
      this.timer = 50;
      this.resolved = false;
      this.failed = false;
      this.now = Date.now();
      this.log('new Banner()');
    }

    Banner.prototype.log = function(msg) {
      if (window.console && window.console.log) {
        return console.log(this.name + "->", Date.now() - this.now, msg);
      } else {
        return alert(msg);
      }
    };

    Banner.prototype.config = function(key, value) {
      return this[key] = value;
    };

    Banner.prototype.onload = function() {
      this.log('onload');
      this.processSize();
      return this;
    };

    Banner.prototype.processSize = function() {
      var $wrapper, height, invalidSize, width;
      this.log('processSize');
      $wrapper = this.iframe.$iframe.contents().find('#webAd');
      width = $wrapper.width();
      height = $wrapper.height();
      invalidSize = width === null || width <= 31 || height === null || height <= 31;
      if (invalidSize) return this.pollForNewSize();
      this.resize(width, height);
      this.resolve();
      return this;
    };

    Banner.prototype.resolve = function() {
      if (this.params.bodyClass) $("body").addClass(this.params.bodyClass);
      if (this.params.done && typeof this.params.done === 'function') {
        this.params.done(this);
      }
      if (!this.resolved) webAds.resolve(this.name);
      return this.resolved = true;
    };

    Banner.prototype.fail = function(reason) {
      this.log('Failed ' + reason);
      if (this.params.bodyFailClass) $("body").addClass(this.params.bodyFailClass);
      this.failed = true;
      this.iframe.$wrapper.addClass('webads-failed');
      return this.resolve();
    };

    Banner.prototype.pollForNewSize = function() {
      var banner, cb;
      this.log('pollForNewSize ' + this.timer + ' retries: ' + this.retries);
      this.timer += this.timer;
      this.retries -= 1;
      banner = this;
      if (this.retries > 0) {
        cb = function() {
          banner.log('pollForNewSize setTimeout');
          return banner.processSize();
        };
        setTimeout(cb, this.timer);
      } else {
        this.fail("timeout");
      }
      return this;
    };

    Banner.prototype.resize = function(width, height) {
      this.width = width;
      this.height = height;
      this.log('resize banner=> height:' + height + 'width' + width);
      this.iframe.$iframe.css({
        height: height,
        width: width
      }).attr('height', height).attr('width', width);
      return this;
    };

    Banner.prototype.expose = function() {
      return $.extend({}, this.exposeObj, {
        banner: this
      });
    };

    Banner.prototype.injectScript = function(idoc, iwin) {
      this.log('injectScript');
      idoc.write('<scr' + 'ipt type="text/javascript" src="' + this.url + '"></scr' + 'ipt>');
      return this;
    };

    Banner.prototype.refresh = function() {
      this.log('refresh');
      this.resolved = false;
      this.retries = 5;
      this.timer = 50;
      return this.iframe.refresh();
    };

    Banner.prototype.remove = function() {
      this.log('remove');
      this.active = false;
      this.resolved = false;
      this.iframe.remove();
      return this;
    };

    Banner.prototype.insert = function() {
      var $container;
      this.log('insert');
      this.active = true;
      $container = typeof this.container === 'string' ? jQuery("#" + this.container) : this.container;
      $container.addClass('webads-processed').append(this.iframe.makeIframe());
      return this;
    };

    return Banner;

  })();

  window.FINN.Banner = Banner;

}).call(this);
var FINN  = FINN || {};

(function(F, $){
  "use strict";
  
  FINN.data = FINN.data || {};

  function fixTopPosition(banner){
    console.log(banner.name, 'fixTopPosition');
  }
  function fixLeftBanner(banner){
    console.log(banner.name, 'fixLeftBanner');

  }
  function fixWallpaper(banner){
    console.log(banner.name, 'fixWallpaper');
  }


  FINN.data.defaultConfig = $.extend(FINN.data.defaultConfig, {
    "Top": {
        width: 992,
        height: 150,
        bodyFailClass:'has-no-top-placement',
        done: fixTopPosition
    },  
    "Left1": {
        width: 240,
        height: 500,
        bodyClass: 'has-dominant-campaign',
        done: fixLeftBanner
    },
    "Right1": {
        width: 240
    },
    "Right2": {
        width: 240,
        height: 500
    },
    "Right3": {
        width: 240
    },
    "Middle": {
        width: 580,
        height: 400,
        container: "banners-middle"
    },
    "Wallpaper": {
        width: 0,
        height: 0,
        onload: fixWallpaper
    },
    "Survey": {
        width: 0,
        height: 0,
        onload: $.noop
    },
    "Txt_1": {},
    "Txt_2": {},
    "Txt_3": {},
    "Txt_4": {},
    "Txt_5": {},
    "Txt_6": {},
    "Txt_7": {},
    "Txt_8": {},
    "Txt_9": {},
    "Txt_10": {},
    "Test01" : {width: 500, height: 120, container: 'banners'},
    "Test02" : {container: 'banner-tab'},
    "Test04" : {container: 'banner-tab'},
    "Test05" : {container: 'banner-tab'},
    "all"       : {container: 'banners'}
  });
  
  
})(FINN, jQuery);

var FINN = FINN||{};

(function(F, $){
  "use strict";
  FINN.webAds = FINN.webAds||{};
  var plugins = FINN.webAds.plugins = FINN.webAds.plugins||{};
  
  plugins.register = function(name, value){
    plugins[name] = value;
  };
  plugins.overlay = overlay;
  plugins.popup   = popup;
  plugins.dialog  = dialog;
  plugins.search  = search;
  plugins.context = context;
  plugins.getAdContent = getAdContent;
  
  function overlay(banner){
    console.log('PLUGIN -> Overlay ', banner.name);
    //alert("huzzlaas");
  }
  
  function popup(){
    
  }
  
  function dialog(){
    
  }
  
  /* Search FINN */
  function search(query, callback){
    
  }
  
  /* Get current context - finnobj? */
  function context(){
      
  }
  
  function getAdContent(areaid, callback){
    var url     = "/finn/realestate/homes/rotationdemo.json";    
    var res     = {};
    var params  = {"areaId":areaid};
    // SYNC
    $.ajax(url,{data:params, async:false, "success": function(data){
        res = data;
    }});
    
    return res;
  }
  
  
})(FINN, jQuery);var FINN = FINN||{};

(function(F, $){
  "use strict";
  var data          = F.data = F.data||{};
  var defaultConfig = data.defaultConfig = data.defaultConfig||{};
  
  // exports
  F.webAds = F.webAds||{};
  var w = F.webAds;
  w.renderContext  = renderContext;
  w.queue          = queue;
  w.render         = render;
  w.renderAll      = renderAll;
  w.renderLazy     = renderLazy;
  w.expose         = expose;
  w.refresh        = refresh;
  w.refreshAll     = refreshAll;
  w.resolve        = resolve;
  w.collectDataPositions = collectDataPositions;
  w.config         = config;
  w.getFromServer  = getFromServer;
  w.cleanUp        = cleanUp;
  w.plugins        = w.plugins||{};
  w.base           = "/";
  
  /*
    TODO:
    callback when all is done
    events:
      webAds.ready
      webAds.done
      webAds.done.all
      webAds.done.Top
  */
  
  var eventMap = {};
  
  w.on = on;
  function on(key, callback){
    
  } 
  
  var jsub = $.sub();
  var globalExpose = {
    jQuery    : jsub,
    $         : jsub,
    inDapIf   : true,
    inFIF     : undefined,
    webAds    : w,
    plugins   : w.plugins
  };
  
  var bannerMap = {};
  var callbacks = {};
  var configMap = {};
  
  function cleanUp(){
    bannerMap = {};
    callbacks = {};
    configMap = {};
  }
  
  
  function config(name, key, value){
    configMap[name]       = configMap[name]||{};
    configMap[name][key]  = value;
    
    if(bannerMap[name]){
      bannerMap[name].config(key, value);
    }
  }
  
  function getFromServer(callback, dontQueue){
    $.getJSON('/heliosAds', function(data){
      if(typeof dontQueue === 'undefined') {
        queue(data.webAds);
      }
      
      if (callback && typeof callback === 'function') callback(null, data.webAds);
    }, function(err){
      if (callback && typeof callback === 'function') callback(err, null);
    });
  }
      
  function addToMap(){
    var objWithDefaults = $.extend(
      {}, 
      defaultConfig.all, 
      defaultConfig[this.name], 
      configMap[this.name],
      this);
    var banner = new F.Banner(objWithDefaults, globalExpose);
    return (bannerMap[this.name] = banner);
  }
      
  function insertCallback(name, callback){
    if (typeof callback === 'function'){
      if (callbacks[name] && $.isArray(callbacks[name])){
        callbacks[name].push(callback);
      } else {
        callbacks[name] = [callback];
      }
    }
  }    
      
  function render(name, callback){
    var banner = bannerMap[name];
    if (!banner){
      //hæ
    } else if (banner.active){
      banner.log('banner is active');
      if (callback && typeof callback === 'function') {
        if (banner.resolved) {
          banner.log('is resolved, calling callback direct')
          callback(banner);          
        } else {
          banner.log('deferring callback')
          insertCallback(name, callback)          
        }
      }
      return banner;
    } else {
      banner.insert();
      insertCallback(name, callback)
      return banner;
    }
  }
  
  function collectDataPositions(selector){
    selector = selector||"body";
    $(selector).find("div.webads[data-banner-position]").each(function(){
      var $this = $(this);
      var position = $this.data('banner-position');
      config(position, 'container', $this);
    });
  }
  
  function resolve(name){
    if (callbacks[name] && callbacks[name].length > 0){
      $.each(callbacks[name], function(){
        if (typeof this === 'function') this(bannerMap[name]);
      });
      callbacks[name] = null;
      $(document).trigger('bannerReady.'+name, bannerMap[name]);
    }
  }

  function renderUnactive(){
    var banner;
    for(var key in bannerMap){
      banner = bannerMap[key];      
      if (banner.active === false){
        banner.insert();
      }
    }
  }
  
  function renderAll(commaList){ 
    commaList         = commaList || "Top,Right1";
    var priorityList  = commaList.split(',');
    var next          = priorityList.shift();
    
    function loop(){
      if (priorityList.length <= 0){
        renderUnactive();
      } else {
        render(priorityList.shift(), loop);
      }
    }
    
    render(next, loop);    
  }
  
  function renderLazy(parent){
    $(parent).find('.webads-lazy').removeClass('webads-lazy').addClass('webads');
    renderContext(parent);
  }
  
  function queue(obj){    
    if ($.isArray(obj)){
      $.each(obj, addToMap);
    } else {
      return addToMap.call(obj);      
    }
  }
  
  function refresh(name){
    return bannerMap[name] && bannerMap[name].refresh();    
  }
  
  function refreshAll(){
    var banner;
    for(var key in bannerMap){
      bannerMap[key].refresh();         
    }
  }
  
  function remove(name){
    return bannerMap[name] && bannerMap[name].remove();
  }
  
  function removeAll(){
    for(var key in bannerMap){
      bannerMap[name] && bannerMap[key].remove();         
    }
  }
  
  function renderContext(selector){
    console.log('renderContext', selector);
    collectDataPositions(selector);
    
    $(selector).find(".webads").filter(function(){
      return !$(this).hasClass('webads-processed');
    }).each(function(){
      var $this = $(this);
      $this.addClass('webads-processed');
      var position = $this.data('banner-position');
      var id       = $this.attr('id');
      if (position){
        render(position);
      } else if (id) {
        renderAdsWithContainer(id);
      }
    });
  }
  
  function renderAdsWithContainer(container){
    for(var key in bannerMap){
      if (container === bannerMap[key].container){
        bannerMap[key].insert();
      }
    }
  }
  
  function expose(name){return bannerMap[name].expose();}
  
})(FINN, jQuery);