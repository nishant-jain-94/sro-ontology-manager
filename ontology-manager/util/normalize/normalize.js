String.prototype.normalize = function() {
    return this.split(/\W+/g).join('_');
};