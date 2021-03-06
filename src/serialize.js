"use strict";

var BigNumber = require("bignumber.js");
var abiEncodeInt256 = require("./abi-encode-int256");
var padLeft = require("./pad-left");

function serialize(x) {
  var serialized;
  if (x != null) {

    // if x is an array, serialize and concatenate its individual elements
    if (Array.isArray(x) || Buffer.isBuffer(x)) {
      serialized = "";
      for (var i = 0, n = x.length; i < n; ++i) {
        serialized += serialize(x[i]);
      }
    } else {

      // input is a base-10 javascript number
      if (x.constructor === Number) {
        serialized = abiEncodeInt256(new BigNumber(x, 10).toFixed());

      // input is a utf8 or hex string
      } else if (x.constructor === String) {

        // negative hex
        if (x.slice(0, 1) === "-") {
          serialized = abiEncodeInt256(new BigNumber(x, 16).toFixed());

        // positive hex
        } else if (x.slice(0, 2) === "0x") {
          serialized = padLeft(x.slice(2));

        // text string
        } else {
          serialized = Buffer.from(x, "utf8").toString("hex");
        }
      }
    }
  }
  return serialized;
}

module.exports = serialize;
