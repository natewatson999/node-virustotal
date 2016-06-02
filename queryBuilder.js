var features = {};
features.NOT = function(basis) {
  return "(NOT (" + basis + "))";
};
features.AND = function(basis1, basis2) {
  return "((" + basis1 + ") AND (" + basis2 + "))";
};
features.OR = function(basis1, basis2) {
  return "((" + basis1 + ") OR (" + basis2 + "))";
};
features.NAND = function(basis1, basis2) {
  return features.OR(features.NOT(basis1), features.NOT(basis2));
};
features.NOR = function(basis1, basis2) {
  return features.AND(features.NOT(basis1), features.NOT(basis2));
};
features.EQ = functionfunction(basis1, basis2) {
  return features.OR(
    features.AND(basis1, basis2),
    features.AND(features.NOT(basis2), features.NOT(basis1))
  );
};
features.XOR = function(basis1, basis2) {
  return features.NOT(features.EQ(basis1, basis2));
};
features.IMP = function(basis1, basis2) {
  return features.OR(
    features.NOT(basis1),
    features.AND(basis1, basis2)
  );
};
features.CIM = function(basis1, basis2) {
  return features.AND(features.NOT(basis1), basis2);
};
features.hexSig = function(basis){
  return "content:" + basis;
};
features.stringSig = function(basis) {
  return "content:\"" + encodeURIComponent(basis) + "\"";
};
features.imphash = function(basis){
  return "imphash:" + basis;
};
features.ssdeep = function(src, score){
  return "ssdeep:\"" + src + ":" + score + "\"";
};
features.similarTo = function(basis){
  return "similar-to:" + basis;
};
module.exports = exports = features;
