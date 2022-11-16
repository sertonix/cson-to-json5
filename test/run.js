const JSON5 = require("json5");
const CSON = require("cson-parser");
const fs = require("fs");
const path = require("path");
const {csonToJson5} = require("..");
const cson = fs.readFileSync(path.join(__dirname,"test.cson"),{encoding:"utf8"});

const json = CSON.parse(cson);
console.log(json);

const json5String = csonToJson5(cson);
console.log(json5String);

const json5 = JSON5.parse(json5String);
console.log(json5);

console.log(JSON.stringify(json) === JSON.stringify(json5));