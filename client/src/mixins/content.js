var ContentMixin = {
  componentWillMount: function() {
    
  },
  setInterval: function() {
    
  },
  componentWillUnmount: function() {
    
  },
  i18n : function (key) {
      if(typeof key === "string") {
        key = this.props.dictionary[key];  
      }
      return key.value;
  }
};

module.exports = ContentMixin;
