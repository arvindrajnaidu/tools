var ContentMixin = {
  i18n : function (key) {
      if(typeof key === "string") {
        key = this.props.dictionary[key];  
      }
      return key.value;
  }
};

module.exports = ContentMixin;
