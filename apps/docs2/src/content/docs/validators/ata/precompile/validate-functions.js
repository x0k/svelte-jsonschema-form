"use strict";
var R = Object.freeze({ valid: true, errors: Object.freeze([]) });
module.exports = [
  (function (R) {
    var E = function (d) {
      var _all = true;
      const _e = [];
      const _cpLen = (s) => {
        let n = 0;
        for (const _ of s) n++;
        return n;
      };
      if (!Number.isInteger(d)) {
        _e.push({
          keyword: "type",
          instancePath: "",
          schemaPath: "#/type",
          params: { type: "integer" },
          message: "must be integer",
        });
        if (!_all) return { valid: false, errors: _e };
      }
      if (typeof d === "number" && d < 1) {
        _e.push({
          keyword: "minimum",
          instancePath: "",
          schemaPath: "#/minimum",
          params: { comparison: ">=", limit: 1 },
          message: "must be >= 1",
        });
        if (!_all) return { valid: false, errors: _e };
      }
      return { valid: _e.length === 0, errors: _e };
    };
    return function (d) {
      if (!Number.isInteger(d)) return E(d);
      if (d < 1) return E(d);
      return R;
    };
  })(R),
  (function (R) {
    var E = function (d) {
      var _all = true;
      const _e = [];
      const _cpLen = (s) => {
        let n = 0;
        for (const _ of s) n++;
        return n;
      };
      if (!(typeof d === "string")) {
        _e.push({
          keyword: "type",
          instancePath: "",
          schemaPath: "#/type",
          params: { type: "string" },
          message: "must be string",
        });
        if (!_all) return { valid: false, errors: _e };
      }
      if (typeof d === "string") {
        const _at = d.indexOf("@");
        if (_at <= 0 || _at >= d.length - 1 || d.indexOf(".", _at) <= _at + 1) {
          _e.push({
            keyword: "format",
            instancePath: "",
            schemaPath: "#/format",
            params: { format: "email" },
            message: 'must match format "email"',
          });
          if (!_all) return { valid: false, errors: _e };
        }
      }
      return { valid: _e.length === 0, errors: _e };
    };
    return function (d) {
      if (typeof d !== "string") return E(d);
      {
        const _at = d.indexOf("@");
        if (_at <= 0 || _at >= d.length - 1 || d.indexOf(".", _at) <= _at + 1)
          return E(d);
      }
      return R;
    };
  })(R),
  (function (R) {
    var E = function (d) {
      var _all = true;
      const _e = [];
      const _cpLen = (s) => {
        let n = 0;
        for (const _ of s) n++;
        return n;
      };
      if (!Number.isInteger(d)) {
        _e.push({
          keyword: "type",
          instancePath: "",
          schemaPath: "#/type",
          params: { type: "integer" },
          message: "must be integer",
        });
        if (!_all) return { valid: false, errors: _e };
      }
      if (typeof d === "number" && d < 21) {
        _e.push({
          keyword: "minimum",
          instancePath: "",
          schemaPath: "#/minimum",
          params: { comparison: ">=", limit: 21 },
          message: "must be >= 21",
        });
        if (!_all) return { valid: false, errors: _e };
      }
      if (typeof d === "number" && d > 100) {
        _e.push({
          keyword: "maximum",
          instancePath: "",
          schemaPath: "#/maximum",
          params: { comparison: "<=", limit: 100 },
          message: "must be <= 100",
        });
        if (!_all) return { valid: false, errors: _e };
      }
      return { valid: _e.length === 0, errors: _e };
    };
    return function (d) {
      if (!Number.isInteger(d)) return E(d);
      if (d < 21) return E(d);
      if (d > 100) return E(d);
      return R;
    };
  })(R),
  (function (R) {
    var E = function (d) {
      var _all = true;
      const _e = [];
      const _cpLen = (s) => {
        let n = 0;
        for (const _ of s) n++;
        return n;
      };
      if (!(typeof d === "string")) {
        _e.push({
          keyword: "type",
          instancePath: "",
          schemaPath: "#/type",
          params: { type: "string" },
          message: "must be string",
        });
        if (!_all) return { valid: false, errors: _e };
      }
      if (!(d === "admin" || d === "editor" || d === "viewer")) {
        _e.push({
          keyword: "enum",
          instancePath: "",
          schemaPath: "#/enum",
          params: { allowedValues: ["admin", "editor", "viewer"] },
          message: "must be equal to one of the allowed values",
        });
        if (!_all) return { valid: false, errors: _e };
      }
      return { valid: _e.length === 0, errors: _e };
    };
    return function (d) {
      if (typeof d !== "string") return E(d);
      if (!(d === "admin" || d === "editor" || d === "viewer")) return E(d);
      return R;
    };
  })(R),
  null,
  null,
];
