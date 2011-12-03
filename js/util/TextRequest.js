var TextRequest = Class.create(Ajax.Request, {
  _encoding: null,

  initialize: function($super, url, encoding, options) {
    this._encoding = encoding;
    $super(url, options);
  },

  request: function() {
    if(this._encoding){
      this.transport.overrideMimeType('text/plain; charset=' + this._encoding);
    }
    Ajax.Request.prototype.request.apply(this, arguments);
  },
});

