var ContentMixin = {
    i18n: function (key, noop) {

        if (noop) {
            return key;
        }

        if (typeof key === "string") {
            if (this.props.dictionary[key]) {
                return this.props.dictionary[key];
            }
        }

        return key.value || key;
    }
};

module.exports = ContentMixin;
