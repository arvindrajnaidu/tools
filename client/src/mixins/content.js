var ContentMixin = {
  i18n : function (key) {
      if(typeof key === "string") {
          return key;
      }
      return key.value;
  }
};

module.exports = ContentMixin;
