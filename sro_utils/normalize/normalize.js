String.prototype.normalize = function normalize() {
  return this.split(/\W+/g).join('_');
};
