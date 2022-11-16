const {compile} = require("coffeescript");
const nodes = require("coffeescript/lib/coffeescript/nodes");

const allowedNodes = "Root Comment PropertyName Base Value Bool BooleanLiteral Null NullLiteral Literal NumberLiteral StringLiteral RegexLiteral Arr Obj Op Parens Assign PassthroughLiteral InfinityLiteral NaNLiteral".split(" ");

for (const nodeName in nodes) if (
  nodes[nodeName].prototype instanceof nodes.Base &&
  !allowedNodes.includes(nodeName) &&
  nodes[nodeName].prototype.compileToFragments
) nodes[nodeName].prototype.compileToFragments = () => {throw `Invalid fragment ${JSON.stringify(nodeName)}!`};

nodes.Block.prototype.compileNode = ( compileNode => function(...args) {
  if (args[0]?.level === 1) args[0].level = 2;
  return compileNode.apply(this,args);
})(nodes.Block.prototype.compileNode);

nodes.InfinityLiteral.prototype.compileNode = function() {
  return [this.makeCode("Infinity")]
}

nodes.NaNLiteral.prototype.compileNode = function() {
  return [this.makeCode("NaN")]
}

nodes.StringWithInterpolations.prototype.compileNode = function(o) {
  this.comments = false;
  return this.extractElements(o).map( element => this.makeCode(element.value.replace( /(?<!\\)(?=\n)/g, "\\n\\" )) );
}

function csonToJson5(csonString) {
  return compile(csonString,{bare:true});
}

module.exports = {csonToJson5};