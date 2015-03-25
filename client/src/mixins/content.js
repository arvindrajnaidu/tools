var ContentMixin = {
  i18n : function (key) {
      if(typeof key === "string") {
        if(this.props.dictionary[key]) {
          key = this.props.dictionary[key];    
        }
      }
      return key.value || key;
  }
};

module.exports = ContentMixin;
