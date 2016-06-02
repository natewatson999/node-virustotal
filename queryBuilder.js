var dateToString = function(input){
  return (input.getFullYear() + "-" + leftPad(input.getMonth() + 1, 2, "0") + "-" + leftPad(input.getDate(), 2, "0") + "T" + leftPad(input.getHours(), 2, "0") + ":" + leftPad(input.getMinutes(), 2, "0") + ":" + leftPad(input.getSeconds(), 2, "0"));
};
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
features.traffic = function(basis) {
  return "traffic:\"" + encodeURIComponent(basis) + "\"";
};
features.suricataString = function(basis) {
  return "suricata:\"" + encodeURIComponent(basis) + "\"";
};
features.suricataID = function(basis){
  return "suricata:" + basis;
};
features.snortString = function(basis) {
  return "snort:\"" + encodeURIComponent(basis) + "\"";
};
features.snortID = function(basis){
  return "snort:" + basis;
};
features.behavior = function(basis) {
  return "behavior:\"" + encodeURIComponent(basis) + "\"";
};
features.resourceID = function(basis) {
  return "resource:\"" + encodeURIComponent(basis) + "\"";
};
features.resourceType = function(basis) {
  return "resource:\"" + encodeURIComponent(basis) + "\"";
};
features.exports = function(basis){
  return "exports:\"" + encodeURIComponent(basis) + "\"";
};
features.imports = function(basis){
  return "imports:\"" + encodeURIComponent(basis) + "\"";
};
features.segment = function(basis){
  return "segment:\"" + encodeURIComponent(basis) + "\"";
};
features.sectionHash = function(basis){
  return "section:" + basis;
};
features.sectionLabel = function(basis) {
  return "section:\"" + encodeURIComponent(basis) + "\"";
};
features.atMostSubspan = function(basis) {
  return "subspan:" + basis + "-";
};
features.atLeastSubspan = function(basis) {
  return "subspan:" + basis + "%2B";
};
features.compilationBefore = function(basis) {
  return "pets:" + dateToString(basis) + "-";
};
features.compilationAfter = function(basis) {
  return "pets:" + dateToString(basis) + "%2B";
};
features.sigcheck = function(basis) {
  return "signature:\"" + encodeURIComponent(basis) + "\"";
};
features.lang = function(basis) {
  return "lang:\"" + encodeURIComponent(basis) + "\"";
};
features.androguard = function(basis) {
  return "androguard:\"" + encodeURIComponent(basis) + "\"";
};
features.metadata = function(basis) {
  return "metadata:\"" + encodeURIComponent(basis) + "\"";
};
features.fromURL = function(basis) {
  return "itw:\"" + encodeURIComponent(basis) + "\"";
};
features.submitterRegion = function(basis){
  return "submitter:" + basis;
};
features.sourceCount = function(basis){
  return "sources:" + basis;
};
features.sourceAtLeast = function(basis){
  return "sources:" + basis + "%2B";
};
features.sourceAtMost = function(basis){
  return "sources:" + basis + "-";
};
features.submissionCount = function(basis){
  return "submissions:" + basis;
};
features.submissionAtLeast = function(basis){
  return "submissions:" + basis + "%2B";
};
features.submissionAtMost = function(basis){
  return "submissions:" + basis + "-";
};
module.exports = exports = features;
