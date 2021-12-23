import { createRequire } from 'module';const require = createRequire(import.meta.url);
      var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value2) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value: value2 }) : obj[key] = value2;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw new Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[Object.keys(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  __markAsModule(target);
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// node_modules/.pnpm/arg@5.0.1/node_modules/arg/index.js
var require_arg = __commonJS({
  "node_modules/.pnpm/arg@5.0.1/node_modules/arg/index.js"(exports2, module2) {
    var flagSymbol = Symbol("arg flag");
    var ArgError = class extends Error {
      constructor(msg, code) {
        super(msg);
        this.name = "ArgError";
        this.code = code;
        Object.setPrototypeOf(this, ArgError.prototype);
      }
    };
    function arg2(opts, {
      argv = process.argv.slice(2),
      permissive = false,
      stopAtPositional = false
    } = {}) {
      if (!opts) {
        throw new ArgError("argument specification object is required", "ARG_CONFIG_NO_SPEC");
      }
      const result = { _: [] };
      const aliases = {};
      const handlers = {};
      for (const key of Object.keys(opts)) {
        if (!key) {
          throw new ArgError("argument key cannot be an empty string", "ARG_CONFIG_EMPTY_KEY");
        }
        if (key[0] !== "-") {
          throw new ArgError(`argument key must start with '-' but found: '${key}'`, "ARG_CONFIG_NONOPT_KEY");
        }
        if (key.length === 1) {
          throw new ArgError(`argument key must have a name; singular '-' keys are not allowed: ${key}`, "ARG_CONFIG_NONAME_KEY");
        }
        if (typeof opts[key] === "string") {
          aliases[key] = opts[key];
          continue;
        }
        let type = opts[key];
        let isFlag = false;
        if (Array.isArray(type) && type.length === 1 && typeof type[0] === "function") {
          const [fn] = type;
          type = (value2, name2, prev = []) => {
            prev.push(fn(value2, name2, prev[prev.length - 1]));
            return prev;
          };
          isFlag = fn === Boolean || fn[flagSymbol] === true;
        } else if (typeof type === "function") {
          isFlag = type === Boolean || type[flagSymbol] === true;
        } else {
          throw new ArgError(`type missing or not a function or valid array type: ${key}`, "ARG_CONFIG_VAD_TYPE");
        }
        if (key[1] !== "-" && key.length > 2) {
          throw new ArgError(`short argument keys (with a single hyphen) must have only one character: ${key}`, "ARG_CONFIG_SHORTOPT_TOOLONG");
        }
        handlers[key] = [type, isFlag];
      }
      for (let i2 = 0, len = argv.length; i2 < len; i2++) {
        const wholeArg = argv[i2];
        if (stopAtPositional && result._.length > 0) {
          result._ = result._.concat(argv.slice(i2));
          break;
        }
        if (wholeArg === "--") {
          result._ = result._.concat(argv.slice(i2 + 1));
          break;
        }
        if (wholeArg.length > 1 && wholeArg[0] === "-") {
          const separatedArguments = wholeArg[1] === "-" || wholeArg.length === 2 ? [wholeArg] : wholeArg.slice(1).split("").map((a) => `-${a}`);
          for (let j = 0; j < separatedArguments.length; j++) {
            const arg3 = separatedArguments[j];
            const [originalArgName, argStr] = arg3[1] === "-" ? arg3.split(/=(.*)/, 2) : [arg3, void 0];
            let argName = originalArgName;
            while (argName in aliases) {
              argName = aliases[argName];
            }
            if (!(argName in handlers)) {
              if (permissive) {
                result._.push(arg3);
                continue;
              } else {
                throw new ArgError(`unknown or unexpected option: ${originalArgName}`, "ARG_UNKNOWN_OPTION");
              }
            }
            const [type, isFlag] = handlers[argName];
            if (!isFlag && j + 1 < separatedArguments.length) {
              throw new ArgError(`option requires argument (but was followed by another short argument): ${originalArgName}`, "ARG_MISSING_REQUIRED_SHORTARG");
            }
            if (isFlag) {
              result[argName] = type(true, argName, result[argName]);
            } else if (argStr === void 0) {
              if (argv.length < i2 + 2 || argv[i2 + 1].length > 1 && argv[i2 + 1][0] === "-" && !(argv[i2 + 1].match(/^-?\d*(\.(?=\d))?\d*$/) && (type === Number || typeof BigInt !== "undefined" && type === BigInt))) {
                const extended = originalArgName === argName ? "" : ` (alias for ${argName})`;
                throw new ArgError(`option requires argument: ${originalArgName}${extended}`, "ARG_MISSING_REQUIRED_LONGARG");
              }
              result[argName] = type(argv[i2 + 1], argName, result[argName]);
              ++i2;
            } else {
              result[argName] = type(argStr, argName, result[argName]);
            }
          }
        } else {
          result._.push(wholeArg);
        }
      }
      return result;
    }
    arg2.flag = (fn) => {
      fn[flagSymbol] = true;
      return fn;
    };
    arg2.COUNT = arg2.flag((v, name2, existingCount) => (existingCount || 0) + 1);
    arg2.ArgError = ArgError;
    module2.exports = arg2;
  }
});

// node_modules/.pnpm/lodash.padstart@4.6.1/node_modules/lodash.padstart/index.js
var require_lodash = __commonJS({
  "node_modules/.pnpm/lodash.padstart@4.6.1/node_modules/lodash.padstart/index.js"(exports2, module2) {
    var INFINITY = 1 / 0;
    var MAX_SAFE_INTEGER = 9007199254740991;
    var MAX_INTEGER = 17976931348623157e292;
    var NAN = 0 / 0;
    var symbolTag = "[object Symbol]";
    var reTrim = /^\s+|\s+$/g;
    var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
    var reIsBinary = /^0b[01]+$/i;
    var reIsOctal = /^0o[0-7]+$/i;
    var rsAstralRange = "\\ud800-\\udfff";
    var rsComboMarksRange = "\\u0300-\\u036f\\ufe20-\\ufe23";
    var rsComboSymbolsRange = "\\u20d0-\\u20f0";
    var rsVarRange = "\\ufe0e\\ufe0f";
    var rsAstral = "[" + rsAstralRange + "]";
    var rsCombo = "[" + rsComboMarksRange + rsComboSymbolsRange + "]";
    var rsFitz = "\\ud83c[\\udffb-\\udfff]";
    var rsModifier = "(?:" + rsCombo + "|" + rsFitz + ")";
    var rsNonAstral = "[^" + rsAstralRange + "]";
    var rsRegional = "(?:\\ud83c[\\udde6-\\uddff]){2}";
    var rsSurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]";
    var rsZWJ = "\\u200d";
    var reOptMod = rsModifier + "?";
    var rsOptVar = "[" + rsVarRange + "]?";
    var rsOptJoin = "(?:" + rsZWJ + "(?:" + [rsNonAstral, rsRegional, rsSurrPair].join("|") + ")" + rsOptVar + reOptMod + ")*";
    var rsSeq = rsOptVar + reOptMod + rsOptJoin;
    var rsSymbol = "(?:" + [rsNonAstral + rsCombo + "?", rsCombo, rsRegional, rsSurrPair, rsAstral].join("|") + ")";
    var reUnicode = RegExp(rsFitz + "(?=" + rsFitz + ")|" + rsSymbol + rsSeq, "g");
    var reHasUnicode = RegExp("[" + rsZWJ + rsAstralRange + rsComboMarksRange + rsComboSymbolsRange + rsVarRange + "]");
    var freeParseInt = parseInt;
    var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
    var freeSelf = typeof self == "object" && self && self.Object === Object && self;
    var root2 = freeGlobal || freeSelf || Function("return this")();
    var asciiSize = baseProperty("length");
    function asciiToArray(string) {
      return string.split("");
    }
    function baseProperty(key) {
      return function(object) {
        return object == null ? void 0 : object[key];
      };
    }
    function hasUnicode(string) {
      return reHasUnicode.test(string);
    }
    function stringSize(string) {
      return hasUnicode(string) ? unicodeSize(string) : asciiSize(string);
    }
    function stringToArray(string) {
      return hasUnicode(string) ? unicodeToArray(string) : asciiToArray(string);
    }
    function unicodeSize(string) {
      var result = reUnicode.lastIndex = 0;
      while (reUnicode.test(string)) {
        result++;
      }
      return result;
    }
    function unicodeToArray(string) {
      return string.match(reUnicode) || [];
    }
    var objectProto = Object.prototype;
    var objectToString = objectProto.toString;
    var Symbol2 = root2.Symbol;
    var nativeCeil = Math.ceil;
    var nativeFloor = Math.floor;
    var symbolProto = Symbol2 ? Symbol2.prototype : void 0;
    var symbolToString = symbolProto ? symbolProto.toString : void 0;
    function baseRepeat(string, n) {
      var result = "";
      if (!string || n < 1 || n > MAX_SAFE_INTEGER) {
        return result;
      }
      do {
        if (n % 2) {
          result += string;
        }
        n = nativeFloor(n / 2);
        if (n) {
          string += string;
        }
      } while (n);
      return result;
    }
    function baseSlice(array, start, end) {
      var index = -1, length = array.length;
      if (start < 0) {
        start = -start > length ? 0 : length + start;
      }
      end = end > length ? length : end;
      if (end < 0) {
        end += length;
      }
      length = start > end ? 0 : end - start >>> 0;
      start >>>= 0;
      var result = Array(length);
      while (++index < length) {
        result[index] = array[index + start];
      }
      return result;
    }
    function baseToString(value2) {
      if (typeof value2 == "string") {
        return value2;
      }
      if (isSymbol(value2)) {
        return symbolToString ? symbolToString.call(value2) : "";
      }
      var result = value2 + "";
      return result == "0" && 1 / value2 == -INFINITY ? "-0" : result;
    }
    function castSlice(array, start, end) {
      var length = array.length;
      end = end === void 0 ? length : end;
      return !start && end >= length ? array : baseSlice(array, start, end);
    }
    function createPadding(length, chars) {
      chars = chars === void 0 ? " " : baseToString(chars);
      var charsLength = chars.length;
      if (charsLength < 2) {
        return charsLength ? baseRepeat(chars, length) : chars;
      }
      var result = baseRepeat(chars, nativeCeil(length / stringSize(chars)));
      return hasUnicode(chars) ? castSlice(stringToArray(result), 0, length).join("") : result.slice(0, length);
    }
    function isObject(value2) {
      var type = typeof value2;
      return !!value2 && (type == "object" || type == "function");
    }
    function isObjectLike(value2) {
      return !!value2 && typeof value2 == "object";
    }
    function isSymbol(value2) {
      return typeof value2 == "symbol" || isObjectLike(value2) && objectToString.call(value2) == symbolTag;
    }
    function toFinite(value2) {
      if (!value2) {
        return value2 === 0 ? value2 : 0;
      }
      value2 = toNumber(value2);
      if (value2 === INFINITY || value2 === -INFINITY) {
        var sign = value2 < 0 ? -1 : 1;
        return sign * MAX_INTEGER;
      }
      return value2 === value2 ? value2 : 0;
    }
    function toInteger(value2) {
      var result = toFinite(value2), remainder = result % 1;
      return result === result ? remainder ? result - remainder : result : 0;
    }
    function toNumber(value2) {
      if (typeof value2 == "number") {
        return value2;
      }
      if (isSymbol(value2)) {
        return NAN;
      }
      if (isObject(value2)) {
        var other = typeof value2.valueOf == "function" ? value2.valueOf() : value2;
        value2 = isObject(other) ? other + "" : other;
      }
      if (typeof value2 != "string") {
        return value2 === 0 ? value2 : +value2;
      }
      value2 = value2.replace(reTrim, "");
      var isBinary = reIsBinary.test(value2);
      return isBinary || reIsOctal.test(value2) ? freeParseInt(value2.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value2) ? NAN : +value2;
    }
    function toString(value2) {
      return value2 == null ? "" : baseToString(value2);
    }
    function padStart(string, length, chars) {
      string = toString(string);
      length = toInteger(length);
      var strLength = length ? stringSize(string) : 0;
      return length && strLength < length ? createPadding(length - strLength, chars) + string : string;
    }
    module2.exports = padStart;
  }
});

// node_modules/.pnpm/lodash.padend@4.6.1/node_modules/lodash.padend/index.js
var require_lodash2 = __commonJS({
  "node_modules/.pnpm/lodash.padend@4.6.1/node_modules/lodash.padend/index.js"(exports2, module2) {
    var INFINITY = 1 / 0;
    var MAX_SAFE_INTEGER = 9007199254740991;
    var MAX_INTEGER = 17976931348623157e292;
    var NAN = 0 / 0;
    var symbolTag = "[object Symbol]";
    var reTrim = /^\s+|\s+$/g;
    var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
    var reIsBinary = /^0b[01]+$/i;
    var reIsOctal = /^0o[0-7]+$/i;
    var rsAstralRange = "\\ud800-\\udfff";
    var rsComboMarksRange = "\\u0300-\\u036f\\ufe20-\\ufe23";
    var rsComboSymbolsRange = "\\u20d0-\\u20f0";
    var rsVarRange = "\\ufe0e\\ufe0f";
    var rsAstral = "[" + rsAstralRange + "]";
    var rsCombo = "[" + rsComboMarksRange + rsComboSymbolsRange + "]";
    var rsFitz = "\\ud83c[\\udffb-\\udfff]";
    var rsModifier = "(?:" + rsCombo + "|" + rsFitz + ")";
    var rsNonAstral = "[^" + rsAstralRange + "]";
    var rsRegional = "(?:\\ud83c[\\udde6-\\uddff]){2}";
    var rsSurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]";
    var rsZWJ = "\\u200d";
    var reOptMod = rsModifier + "?";
    var rsOptVar = "[" + rsVarRange + "]?";
    var rsOptJoin = "(?:" + rsZWJ + "(?:" + [rsNonAstral, rsRegional, rsSurrPair].join("|") + ")" + rsOptVar + reOptMod + ")*";
    var rsSeq = rsOptVar + reOptMod + rsOptJoin;
    var rsSymbol = "(?:" + [rsNonAstral + rsCombo + "?", rsCombo, rsRegional, rsSurrPair, rsAstral].join("|") + ")";
    var reUnicode = RegExp(rsFitz + "(?=" + rsFitz + ")|" + rsSymbol + rsSeq, "g");
    var reHasUnicode = RegExp("[" + rsZWJ + rsAstralRange + rsComboMarksRange + rsComboSymbolsRange + rsVarRange + "]");
    var freeParseInt = parseInt;
    var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
    var freeSelf = typeof self == "object" && self && self.Object === Object && self;
    var root2 = freeGlobal || freeSelf || Function("return this")();
    var asciiSize = baseProperty("length");
    function asciiToArray(string) {
      return string.split("");
    }
    function baseProperty(key) {
      return function(object) {
        return object == null ? void 0 : object[key];
      };
    }
    function hasUnicode(string) {
      return reHasUnicode.test(string);
    }
    function stringSize(string) {
      return hasUnicode(string) ? unicodeSize(string) : asciiSize(string);
    }
    function stringToArray(string) {
      return hasUnicode(string) ? unicodeToArray(string) : asciiToArray(string);
    }
    function unicodeSize(string) {
      var result = reUnicode.lastIndex = 0;
      while (reUnicode.test(string)) {
        result++;
      }
      return result;
    }
    function unicodeToArray(string) {
      return string.match(reUnicode) || [];
    }
    var objectProto = Object.prototype;
    var objectToString = objectProto.toString;
    var Symbol2 = root2.Symbol;
    var nativeCeil = Math.ceil;
    var nativeFloor = Math.floor;
    var symbolProto = Symbol2 ? Symbol2.prototype : void 0;
    var symbolToString = symbolProto ? symbolProto.toString : void 0;
    function baseRepeat(string, n) {
      var result = "";
      if (!string || n < 1 || n > MAX_SAFE_INTEGER) {
        return result;
      }
      do {
        if (n % 2) {
          result += string;
        }
        n = nativeFloor(n / 2);
        if (n) {
          string += string;
        }
      } while (n);
      return result;
    }
    function baseSlice(array, start, end) {
      var index = -1, length = array.length;
      if (start < 0) {
        start = -start > length ? 0 : length + start;
      }
      end = end > length ? length : end;
      if (end < 0) {
        end += length;
      }
      length = start > end ? 0 : end - start >>> 0;
      start >>>= 0;
      var result = Array(length);
      while (++index < length) {
        result[index] = array[index + start];
      }
      return result;
    }
    function baseToString(value2) {
      if (typeof value2 == "string") {
        return value2;
      }
      if (isSymbol(value2)) {
        return symbolToString ? symbolToString.call(value2) : "";
      }
      var result = value2 + "";
      return result == "0" && 1 / value2 == -INFINITY ? "-0" : result;
    }
    function castSlice(array, start, end) {
      var length = array.length;
      end = end === void 0 ? length : end;
      return !start && end >= length ? array : baseSlice(array, start, end);
    }
    function createPadding(length, chars) {
      chars = chars === void 0 ? " " : baseToString(chars);
      var charsLength = chars.length;
      if (charsLength < 2) {
        return charsLength ? baseRepeat(chars, length) : chars;
      }
      var result = baseRepeat(chars, nativeCeil(length / stringSize(chars)));
      return hasUnicode(chars) ? castSlice(stringToArray(result), 0, length).join("") : result.slice(0, length);
    }
    function isObject(value2) {
      var type = typeof value2;
      return !!value2 && (type == "object" || type == "function");
    }
    function isObjectLike(value2) {
      return !!value2 && typeof value2 == "object";
    }
    function isSymbol(value2) {
      return typeof value2 == "symbol" || isObjectLike(value2) && objectToString.call(value2) == symbolTag;
    }
    function toFinite(value2) {
      if (!value2) {
        return value2 === 0 ? value2 : 0;
      }
      value2 = toNumber(value2);
      if (value2 === INFINITY || value2 === -INFINITY) {
        var sign = value2 < 0 ? -1 : 1;
        return sign * MAX_INTEGER;
      }
      return value2 === value2 ? value2 : 0;
    }
    function toInteger(value2) {
      var result = toFinite(value2), remainder = result % 1;
      return result === result ? remainder ? result - remainder : result : 0;
    }
    function toNumber(value2) {
      if (typeof value2 == "number") {
        return value2;
      }
      if (isSymbol(value2)) {
        return NAN;
      }
      if (isObject(value2)) {
        var other = typeof value2.valueOf == "function" ? value2.valueOf() : value2;
        value2 = isObject(other) ? other + "" : other;
      }
      if (typeof value2 != "string") {
        return value2 === 0 ? value2 : +value2;
      }
      value2 = value2.replace(reTrim, "");
      var isBinary = reIsBinary.test(value2);
      return isBinary || reIsOctal.test(value2) ? freeParseInt(value2.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value2) ? NAN : +value2;
    }
    function toString(value2) {
      return value2 == null ? "" : baseToString(value2);
    }
    function padEnd(string, length, chars) {
      string = toString(string);
      length = toInteger(length);
      var strLength = length ? stringSize(string) : 0;
      return length && strLength < length ? string + createPadding(length - strLength, chars) : string;
    }
    module2.exports = padEnd;
  }
});

// node_modules/.pnpm/lodash.pad@4.5.1/node_modules/lodash.pad/index.js
var require_lodash3 = __commonJS({
  "node_modules/.pnpm/lodash.pad@4.5.1/node_modules/lodash.pad/index.js"(exports2, module2) {
    var INFINITY = 1 / 0;
    var MAX_SAFE_INTEGER = 9007199254740991;
    var MAX_INTEGER = 17976931348623157e292;
    var NAN = 0 / 0;
    var symbolTag = "[object Symbol]";
    var reTrim = /^\s+|\s+$/g;
    var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
    var reIsBinary = /^0b[01]+$/i;
    var reIsOctal = /^0o[0-7]+$/i;
    var rsAstralRange = "\\ud800-\\udfff";
    var rsComboMarksRange = "\\u0300-\\u036f\\ufe20-\\ufe23";
    var rsComboSymbolsRange = "\\u20d0-\\u20f0";
    var rsVarRange = "\\ufe0e\\ufe0f";
    var rsAstral = "[" + rsAstralRange + "]";
    var rsCombo = "[" + rsComboMarksRange + rsComboSymbolsRange + "]";
    var rsFitz = "\\ud83c[\\udffb-\\udfff]";
    var rsModifier = "(?:" + rsCombo + "|" + rsFitz + ")";
    var rsNonAstral = "[^" + rsAstralRange + "]";
    var rsRegional = "(?:\\ud83c[\\udde6-\\uddff]){2}";
    var rsSurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]";
    var rsZWJ = "\\u200d";
    var reOptMod = rsModifier + "?";
    var rsOptVar = "[" + rsVarRange + "]?";
    var rsOptJoin = "(?:" + rsZWJ + "(?:" + [rsNonAstral, rsRegional, rsSurrPair].join("|") + ")" + rsOptVar + reOptMod + ")*";
    var rsSeq = rsOptVar + reOptMod + rsOptJoin;
    var rsSymbol = "(?:" + [rsNonAstral + rsCombo + "?", rsCombo, rsRegional, rsSurrPair, rsAstral].join("|") + ")";
    var reUnicode = RegExp(rsFitz + "(?=" + rsFitz + ")|" + rsSymbol + rsSeq, "g");
    var reHasUnicode = RegExp("[" + rsZWJ + rsAstralRange + rsComboMarksRange + rsComboSymbolsRange + rsVarRange + "]");
    var freeParseInt = parseInt;
    var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
    var freeSelf = typeof self == "object" && self && self.Object === Object && self;
    var root2 = freeGlobal || freeSelf || Function("return this")();
    var asciiSize = baseProperty("length");
    function asciiToArray(string) {
      return string.split("");
    }
    function baseProperty(key) {
      return function(object) {
        return object == null ? void 0 : object[key];
      };
    }
    function hasUnicode(string) {
      return reHasUnicode.test(string);
    }
    function stringSize(string) {
      return hasUnicode(string) ? unicodeSize(string) : asciiSize(string);
    }
    function stringToArray(string) {
      return hasUnicode(string) ? unicodeToArray(string) : asciiToArray(string);
    }
    function unicodeSize(string) {
      var result = reUnicode.lastIndex = 0;
      while (reUnicode.test(string)) {
        result++;
      }
      return result;
    }
    function unicodeToArray(string) {
      return string.match(reUnicode) || [];
    }
    var objectProto = Object.prototype;
    var objectToString = objectProto.toString;
    var Symbol2 = root2.Symbol;
    var nativeCeil = Math.ceil;
    var nativeFloor = Math.floor;
    var symbolProto = Symbol2 ? Symbol2.prototype : void 0;
    var symbolToString = symbolProto ? symbolProto.toString : void 0;
    function baseRepeat(string, n) {
      var result = "";
      if (!string || n < 1 || n > MAX_SAFE_INTEGER) {
        return result;
      }
      do {
        if (n % 2) {
          result += string;
        }
        n = nativeFloor(n / 2);
        if (n) {
          string += string;
        }
      } while (n);
      return result;
    }
    function baseSlice(array, start, end) {
      var index = -1, length = array.length;
      if (start < 0) {
        start = -start > length ? 0 : length + start;
      }
      end = end > length ? length : end;
      if (end < 0) {
        end += length;
      }
      length = start > end ? 0 : end - start >>> 0;
      start >>>= 0;
      var result = Array(length);
      while (++index < length) {
        result[index] = array[index + start];
      }
      return result;
    }
    function baseToString(value2) {
      if (typeof value2 == "string") {
        return value2;
      }
      if (isSymbol(value2)) {
        return symbolToString ? symbolToString.call(value2) : "";
      }
      var result = value2 + "";
      return result == "0" && 1 / value2 == -INFINITY ? "-0" : result;
    }
    function castSlice(array, start, end) {
      var length = array.length;
      end = end === void 0 ? length : end;
      return !start && end >= length ? array : baseSlice(array, start, end);
    }
    function createPadding(length, chars) {
      chars = chars === void 0 ? " " : baseToString(chars);
      var charsLength = chars.length;
      if (charsLength < 2) {
        return charsLength ? baseRepeat(chars, length) : chars;
      }
      var result = baseRepeat(chars, nativeCeil(length / stringSize(chars)));
      return hasUnicode(chars) ? castSlice(stringToArray(result), 0, length).join("") : result.slice(0, length);
    }
    function isObject(value2) {
      var type = typeof value2;
      return !!value2 && (type == "object" || type == "function");
    }
    function isObjectLike(value2) {
      return !!value2 && typeof value2 == "object";
    }
    function isSymbol(value2) {
      return typeof value2 == "symbol" || isObjectLike(value2) && objectToString.call(value2) == symbolTag;
    }
    function toFinite(value2) {
      if (!value2) {
        return value2 === 0 ? value2 : 0;
      }
      value2 = toNumber(value2);
      if (value2 === INFINITY || value2 === -INFINITY) {
        var sign = value2 < 0 ? -1 : 1;
        return sign * MAX_INTEGER;
      }
      return value2 === value2 ? value2 : 0;
    }
    function toInteger(value2) {
      var result = toFinite(value2), remainder = result % 1;
      return result === result ? remainder ? result - remainder : result : 0;
    }
    function toNumber(value2) {
      if (typeof value2 == "number") {
        return value2;
      }
      if (isSymbol(value2)) {
        return NAN;
      }
      if (isObject(value2)) {
        var other = typeof value2.valueOf == "function" ? value2.valueOf() : value2;
        value2 = isObject(other) ? other + "" : other;
      }
      if (typeof value2 != "string") {
        return value2 === 0 ? value2 : +value2;
      }
      value2 = value2.replace(reTrim, "");
      var isBinary = reIsBinary.test(value2);
      return isBinary || reIsOctal.test(value2) ? freeParseInt(value2.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value2) ? NAN : +value2;
    }
    function toString(value2) {
      return value2 == null ? "" : baseToString(value2);
    }
    function pad3(string, length, chars) {
      string = toString(string);
      length = toInteger(length);
      var strLength = length ? stringSize(string) : 0;
      if (!length || strLength >= length) {
        return string;
      }
      var mid = (length - strLength) / 2;
      return createPadding(nativeFloor(mid), chars) + string + createPadding(nativeCeil(mid), chars);
    }
    module2.exports = pad3;
  }
});

// node_modules/.pnpm/command-exists@1.2.9/node_modules/command-exists/lib/command-exists.js
var require_command_exists = __commonJS({
  "node_modules/.pnpm/command-exists@1.2.9/node_modules/command-exists/lib/command-exists.js"(exports2, module2) {
    "use strict";
    var exec = __require("child_process").exec;
    var execSync = __require("child_process").execSync;
    var fs3 = __require("fs");
    var path2 = __require("path");
    var access2 = fs3.access;
    var accessSync2 = fs3.accessSync;
    var constants2 = fs3.constants || fs3;
    var isUsingWindows = process.platform == "win32";
    var fileNotExists = function(commandName, callback) {
      access2(commandName, constants2.F_OK, function(err) {
        callback(!err);
      });
    };
    var fileNotExistsSync = function(commandName) {
      try {
        accessSync2(commandName, constants2.F_OK);
        return false;
      } catch (e) {
        return true;
      }
    };
    var localExecutable = function(commandName, callback) {
      access2(commandName, constants2.F_OK | constants2.X_OK, function(err) {
        callback(null, !err);
      });
    };
    var localExecutableSync = function(commandName) {
      try {
        accessSync2(commandName, constants2.F_OK | constants2.X_OK);
        return true;
      } catch (e) {
        return false;
      }
    };
    var commandExistsUnix = function(commandName, cleanedCommandName, callback) {
      fileNotExists(commandName, function(isFile) {
        if (!isFile) {
          var child = exec("command -v " + cleanedCommandName + " 2>/dev/null && { echo >&1 " + cleanedCommandName + "; exit 0; }", function(error, stdout, stderr) {
            callback(null, !!stdout);
          });
          return;
        }
        localExecutable(commandName, callback);
      });
    };
    var commandExistsWindows = function(commandName, cleanedCommandName, callback) {
      if (!/^(?!(?:.*\s|.*\.|\W+)$)(?:[a-zA-Z]:)?(?:(?:[^<>:"\|\?\*\n])+(?:\/\/|\/|\\\\|\\)?)+$/m.test(commandName)) {
        callback(null, false);
        return;
      }
      var child = exec("where " + cleanedCommandName, function(error) {
        if (error !== null) {
          callback(null, false);
        } else {
          callback(null, true);
        }
      });
    };
    var commandExistsUnixSync = function(commandName, cleanedCommandName) {
      if (fileNotExistsSync(commandName)) {
        try {
          var stdout = execSync("command -v " + cleanedCommandName + " 2>/dev/null && { echo >&1 " + cleanedCommandName + "; exit 0; }");
          return !!stdout;
        } catch (error) {
          return false;
        }
      }
      return localExecutableSync(commandName);
    };
    var commandExistsWindowsSync = function(commandName, cleanedCommandName, callback) {
      if (!/^(?!(?:.*\s|.*\.|\W+)$)(?:[a-zA-Z]:)?(?:(?:[^<>:"\|\?\*\n])+(?:\/\/|\/|\\\\|\\)?)+$/m.test(commandName)) {
        return false;
      }
      try {
        var stdout = execSync("where " + cleanedCommandName, { stdio: [] });
        return !!stdout;
      } catch (error) {
        return false;
      }
    };
    var cleanInput = function(s) {
      if (/[^A-Za-z0-9_\/:=-]/.test(s)) {
        s = "'" + s.replace(/'/g, "'\\''") + "'";
        s = s.replace(/^(?:'')+/g, "").replace(/\\'''/g, "\\'");
      }
      return s;
    };
    if (isUsingWindows) {
      cleanInput = function(s) {
        var isPathName = /[\\]/.test(s);
        if (isPathName) {
          var dirname = '"' + path2.dirname(s) + '"';
          var basename = '"' + path2.basename(s) + '"';
          return dirname + ":" + basename;
        }
        return '"' + s + '"';
      };
    }
    module2.exports = function commandExists(commandName, callback) {
      var cleanedCommandName = cleanInput(commandName);
      if (!callback && typeof Promise !== "undefined") {
        return new Promise(function(resolve, reject) {
          commandExists(commandName, function(error, output) {
            if (output) {
              resolve(commandName);
            } else {
              reject(error);
            }
          });
        });
      }
      if (isUsingWindows) {
        commandExistsWindows(commandName, cleanedCommandName, callback);
      } else {
        commandExistsUnix(commandName, cleanedCommandName, callback);
      }
    };
    module2.exports.sync = function(commandName) {
      var cleanedCommandName = cleanInput(commandName);
      if (isUsingWindows) {
        return commandExistsWindowsSync(commandName, cleanedCommandName);
      } else {
        return commandExistsUnixSync(commandName, cleanedCommandName);
      }
    };
  }
});

// node_modules/.pnpm/command-exists@1.2.9/node_modules/command-exists/index.js
var require_command_exists2 = __commonJS({
  "node_modules/.pnpm/command-exists@1.2.9/node_modules/command-exists/index.js"(exports2, module2) {
    module2.exports = require_command_exists();
  }
});

// node_modules/.pnpm/isexe@2.0.0/node_modules/isexe/windows.js
var require_windows = __commonJS({
  "node_modules/.pnpm/isexe@2.0.0/node_modules/isexe/windows.js"(exports2, module2) {
    module2.exports = isexe;
    isexe.sync = sync;
    var fs3 = __require("fs");
    function checkPathExt(path2, options) {
      var pathext = options.pathExt !== void 0 ? options.pathExt : process.env.PATHEXT;
      if (!pathext) {
        return true;
      }
      pathext = pathext.split(";");
      if (pathext.indexOf("") !== -1) {
        return true;
      }
      for (var i2 = 0; i2 < pathext.length; i2++) {
        var p = pathext[i2].toLowerCase();
        if (p && path2.substr(-p.length).toLowerCase() === p) {
          return true;
        }
      }
      return false;
    }
    function checkStat(stat2, path2, options) {
      if (!stat2.isSymbolicLink() && !stat2.isFile()) {
        return false;
      }
      return checkPathExt(path2, options);
    }
    function isexe(path2, options, cb) {
      fs3.stat(path2, function(er, stat2) {
        cb(er, er ? false : checkStat(stat2, path2, options));
      });
    }
    function sync(path2, options) {
      return checkStat(fs3.statSync(path2), path2, options);
    }
  }
});

// node_modules/.pnpm/isexe@2.0.0/node_modules/isexe/mode.js
var require_mode = __commonJS({
  "node_modules/.pnpm/isexe@2.0.0/node_modules/isexe/mode.js"(exports2, module2) {
    module2.exports = isexe;
    isexe.sync = sync;
    var fs3 = __require("fs");
    function isexe(path2, options, cb) {
      fs3.stat(path2, function(er, stat2) {
        cb(er, er ? false : checkStat(stat2, options));
      });
    }
    function sync(path2, options) {
      return checkStat(fs3.statSync(path2), options);
    }
    function checkStat(stat2, options) {
      return stat2.isFile() && checkMode(stat2, options);
    }
    function checkMode(stat2, options) {
      var mod = stat2.mode;
      var uid = stat2.uid;
      var gid = stat2.gid;
      var myUid = options.uid !== void 0 ? options.uid : process.getuid && process.getuid();
      var myGid = options.gid !== void 0 ? options.gid : process.getgid && process.getgid();
      var u = parseInt("100", 8);
      var g = parseInt("010", 8);
      var o = parseInt("001", 8);
      var ug = u | g;
      var ret = mod & o || mod & g && gid === myGid || mod & u && uid === myUid || mod & ug && myUid === 0;
      return ret;
    }
  }
});

// node_modules/.pnpm/isexe@2.0.0/node_modules/isexe/index.js
var require_isexe = __commonJS({
  "node_modules/.pnpm/isexe@2.0.0/node_modules/isexe/index.js"(exports2, module2) {
    var fs3 = __require("fs");
    var core;
    if (process.platform === "win32" || global.TESTING_WINDOWS) {
      core = require_windows();
    } else {
      core = require_mode();
    }
    module2.exports = isexe;
    isexe.sync = sync;
    function isexe(path2, options, cb) {
      if (typeof options === "function") {
        cb = options;
        options = {};
      }
      if (!cb) {
        if (typeof Promise !== "function") {
          throw new TypeError("callback not provided");
        }
        return new Promise(function(resolve, reject) {
          isexe(path2, options || {}, function(er, is) {
            if (er) {
              reject(er);
            } else {
              resolve(is);
            }
          });
        });
      }
      core(path2, options || {}, function(er, is) {
        if (er) {
          if (er.code === "EACCES" || options && options.ignoreErrors) {
            er = null;
            is = false;
          }
        }
        cb(er, is);
      });
    }
    function sync(path2, options) {
      try {
        return core.sync(path2, options || {});
      } catch (er) {
        if (options && options.ignoreErrors || er.code === "EACCES") {
          return false;
        } else {
          throw er;
        }
      }
    }
  }
});

// node_modules/.pnpm/which@2.0.2/node_modules/which/which.js
var require_which = __commonJS({
  "node_modules/.pnpm/which@2.0.2/node_modules/which/which.js"(exports2, module2) {
    var isWindows = process.platform === "win32" || process.env.OSTYPE === "cygwin" || process.env.OSTYPE === "msys";
    var path2 = __require("path");
    var COLON = isWindows ? ";" : ":";
    var isexe = require_isexe();
    var getNotFoundError = (cmd) => Object.assign(new Error(`not found: ${cmd}`), { code: "ENOENT" });
    var getPathInfo = (cmd, opt) => {
      const colon = opt.colon || COLON;
      const pathEnv = cmd.match(/\//) || isWindows && cmd.match(/\\/) ? [""] : [
        ...isWindows ? [process.cwd()] : [],
        ...(opt.path || process.env.PATH || "").split(colon)
      ];
      const pathExtExe = isWindows ? opt.pathExt || process.env.PATHEXT || ".EXE;.CMD;.BAT;.COM" : "";
      const pathExt = isWindows ? pathExtExe.split(colon) : [""];
      if (isWindows) {
        if (cmd.indexOf(".") !== -1 && pathExt[0] !== "")
          pathExt.unshift("");
      }
      return {
        pathEnv,
        pathExt,
        pathExtExe
      };
    };
    var which = (cmd, opt, cb) => {
      if (typeof opt === "function") {
        cb = opt;
        opt = {};
      }
      if (!opt)
        opt = {};
      const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt);
      const found = [];
      const step = (i2) => new Promise((resolve, reject) => {
        if (i2 === pathEnv.length)
          return opt.all && found.length ? resolve(found) : reject(getNotFoundError(cmd));
        const ppRaw = pathEnv[i2];
        const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw;
        const pCmd = path2.join(pathPart, cmd);
        const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd : pCmd;
        resolve(subStep(p, i2, 0));
      });
      const subStep = (p, i2, ii) => new Promise((resolve, reject) => {
        if (ii === pathExt.length)
          return resolve(step(i2 + 1));
        const ext = pathExt[ii];
        isexe(p + ext, { pathExt: pathExtExe }, (er, is) => {
          if (!er && is) {
            if (opt.all)
              found.push(p + ext);
            else
              return resolve(p + ext);
          }
          return resolve(subStep(p, i2, ii + 1));
        });
      });
      return cb ? step(0).then((res) => cb(null, res), cb) : step(0);
    };
    var whichSync = (cmd, opt) => {
      opt = opt || {};
      const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt);
      const found = [];
      for (let i2 = 0; i2 < pathEnv.length; i2++) {
        const ppRaw = pathEnv[i2];
        const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw;
        const pCmd = path2.join(pathPart, cmd);
        const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd : pCmd;
        for (let j = 0; j < pathExt.length; j++) {
          const cur = p + pathExt[j];
          try {
            const is = isexe.sync(cur, { pathExt: pathExtExe });
            if (is) {
              if (opt.all)
                found.push(cur);
              else
                return cur;
            }
          } catch (ex) {
          }
        }
      }
      if (opt.all && found.length)
        return found;
      if (opt.nothrow)
        return null;
      throw getNotFoundError(cmd);
    };
    module2.exports = which;
    which.sync = whichSync;
  }
});

// node_modules/.pnpm/path-key@3.1.1/node_modules/path-key/index.js
var require_path_key = __commonJS({
  "node_modules/.pnpm/path-key@3.1.1/node_modules/path-key/index.js"(exports2, module2) {
    "use strict";
    var pathKey = (options = {}) => {
      const environment = options.env || process.env;
      const platform = options.platform || process.platform;
      if (platform !== "win32") {
        return "PATH";
      }
      return Object.keys(environment).reverse().find((key) => key.toUpperCase() === "PATH") || "Path";
    };
    module2.exports = pathKey;
    module2.exports.default = pathKey;
  }
});

// node_modules/.pnpm/cross-spawn@7.0.3/node_modules/cross-spawn/lib/util/resolveCommand.js
var require_resolveCommand = __commonJS({
  "node_modules/.pnpm/cross-spawn@7.0.3/node_modules/cross-spawn/lib/util/resolveCommand.js"(exports2, module2) {
    "use strict";
    var path2 = __require("path");
    var which = require_which();
    var getPathKey = require_path_key();
    function resolveCommandAttempt(parsed, withoutPathExt) {
      const env = parsed.options.env || process.env;
      const cwd = process.cwd();
      const hasCustomCwd = parsed.options.cwd != null;
      const shouldSwitchCwd = hasCustomCwd && process.chdir !== void 0 && !process.chdir.disabled;
      if (shouldSwitchCwd) {
        try {
          process.chdir(parsed.options.cwd);
        } catch (err) {
        }
      }
      let resolved;
      try {
        resolved = which.sync(parsed.command, {
          path: env[getPathKey({ env })],
          pathExt: withoutPathExt ? path2.delimiter : void 0
        });
      } catch (e) {
      } finally {
        if (shouldSwitchCwd) {
          process.chdir(cwd);
        }
      }
      if (resolved) {
        resolved = path2.resolve(hasCustomCwd ? parsed.options.cwd : "", resolved);
      }
      return resolved;
    }
    function resolveCommand(parsed) {
      return resolveCommandAttempt(parsed) || resolveCommandAttempt(parsed, true);
    }
    module2.exports = resolveCommand;
  }
});

// node_modules/.pnpm/cross-spawn@7.0.3/node_modules/cross-spawn/lib/util/escape.js
var require_escape = __commonJS({
  "node_modules/.pnpm/cross-spawn@7.0.3/node_modules/cross-spawn/lib/util/escape.js"(exports2, module2) {
    "use strict";
    var metaCharsRegExp = /([()\][%!^"`<>&|;, *?])/g;
    function escapeCommand(arg2) {
      arg2 = arg2.replace(metaCharsRegExp, "^$1");
      return arg2;
    }
    function escapeArgument(arg2, doubleEscapeMetaChars) {
      arg2 = `${arg2}`;
      arg2 = arg2.replace(/(\\*)"/g, '$1$1\\"');
      arg2 = arg2.replace(/(\\*)$/, "$1$1");
      arg2 = `"${arg2}"`;
      arg2 = arg2.replace(metaCharsRegExp, "^$1");
      if (doubleEscapeMetaChars) {
        arg2 = arg2.replace(metaCharsRegExp, "^$1");
      }
      return arg2;
    }
    module2.exports.command = escapeCommand;
    module2.exports.argument = escapeArgument;
  }
});

// node_modules/.pnpm/shebang-regex@3.0.0/node_modules/shebang-regex/index.js
var require_shebang_regex = __commonJS({
  "node_modules/.pnpm/shebang-regex@3.0.0/node_modules/shebang-regex/index.js"(exports2, module2) {
    "use strict";
    module2.exports = /^#!(.*)/;
  }
});

// node_modules/.pnpm/shebang-command@2.0.0/node_modules/shebang-command/index.js
var require_shebang_command = __commonJS({
  "node_modules/.pnpm/shebang-command@2.0.0/node_modules/shebang-command/index.js"(exports2, module2) {
    "use strict";
    var shebangRegex = require_shebang_regex();
    module2.exports = (string = "") => {
      const match = string.match(shebangRegex);
      if (!match) {
        return null;
      }
      const [path2, argument] = match[0].replace(/#! ?/, "").split(" ");
      const binary = path2.split("/").pop();
      if (binary === "env") {
        return argument;
      }
      return argument ? `${binary} ${argument}` : binary;
    };
  }
});

// node_modules/.pnpm/cross-spawn@7.0.3/node_modules/cross-spawn/lib/util/readShebang.js
var require_readShebang = __commonJS({
  "node_modules/.pnpm/cross-spawn@7.0.3/node_modules/cross-spawn/lib/util/readShebang.js"(exports2, module2) {
    "use strict";
    var fs3 = __require("fs");
    var shebangCommand = require_shebang_command();
    function readShebang(command) {
      const size = 150;
      const buffer = Buffer.alloc(size);
      let fd;
      try {
        fd = fs3.openSync(command, "r");
        fs3.readSync(fd, buffer, 0, size, 0);
        fs3.closeSync(fd);
      } catch (e) {
      }
      return shebangCommand(buffer.toString());
    }
    module2.exports = readShebang;
  }
});

// node_modules/.pnpm/cross-spawn@7.0.3/node_modules/cross-spawn/lib/parse.js
var require_parse = __commonJS({
  "node_modules/.pnpm/cross-spawn@7.0.3/node_modules/cross-spawn/lib/parse.js"(exports2, module2) {
    "use strict";
    var path2 = __require("path");
    var resolveCommand = require_resolveCommand();
    var escape = require_escape();
    var readShebang = require_readShebang();
    var isWin = process.platform === "win32";
    var isExecutableRegExp = /\.(?:com|exe)$/i;
    var isCmdShimRegExp = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;
    function detectShebang(parsed) {
      parsed.file = resolveCommand(parsed);
      const shebang = parsed.file && readShebang(parsed.file);
      if (shebang) {
        parsed.args.unshift(parsed.file);
        parsed.command = shebang;
        return resolveCommand(parsed);
      }
      return parsed.file;
    }
    function parseNonShell(parsed) {
      if (!isWin) {
        return parsed;
      }
      const commandFile = detectShebang(parsed);
      const needsShell = !isExecutableRegExp.test(commandFile);
      if (parsed.options.forceShell || needsShell) {
        const needsDoubleEscapeMetaChars = isCmdShimRegExp.test(commandFile);
        parsed.command = path2.normalize(parsed.command);
        parsed.command = escape.command(parsed.command);
        parsed.args = parsed.args.map((arg2) => escape.argument(arg2, needsDoubleEscapeMetaChars));
        const shellCommand = [parsed.command].concat(parsed.args).join(" ");
        parsed.args = ["/d", "/s", "/c", `"${shellCommand}"`];
        parsed.command = process.env.comspec || "cmd.exe";
        parsed.options.windowsVerbatimArguments = true;
      }
      return parsed;
    }
    function parse(command, args, options) {
      if (args && !Array.isArray(args)) {
        options = args;
        args = null;
      }
      args = args ? args.slice(0) : [];
      options = Object.assign({}, options);
      const parsed = {
        command,
        args,
        options,
        file: void 0,
        original: {
          command,
          args
        }
      };
      return options.shell ? parsed : parseNonShell(parsed);
    }
    module2.exports = parse;
  }
});

// node_modules/.pnpm/cross-spawn@7.0.3/node_modules/cross-spawn/lib/enoent.js
var require_enoent = __commonJS({
  "node_modules/.pnpm/cross-spawn@7.0.3/node_modules/cross-spawn/lib/enoent.js"(exports2, module2) {
    "use strict";
    var isWin = process.platform === "win32";
    function notFoundError(original, syscall) {
      return Object.assign(new Error(`${syscall} ${original.command} ENOENT`), {
        code: "ENOENT",
        errno: "ENOENT",
        syscall: `${syscall} ${original.command}`,
        path: original.command,
        spawnargs: original.args
      });
    }
    function hookChildProcess(cp, parsed) {
      if (!isWin) {
        return;
      }
      const originalEmit = cp.emit;
      cp.emit = function(name2, arg1) {
        if (name2 === "exit") {
          const err = verifyENOENT(arg1, parsed, "spawn");
          if (err) {
            return originalEmit.call(cp, "error", err);
          }
        }
        return originalEmit.apply(cp, arguments);
      };
    }
    function verifyENOENT(status, parsed) {
      if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, "spawn");
      }
      return null;
    }
    function verifyENOENTSync(status, parsed) {
      if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, "spawnSync");
      }
      return null;
    }
    module2.exports = {
      hookChildProcess,
      verifyENOENT,
      verifyENOENTSync,
      notFoundError
    };
  }
});

// node_modules/.pnpm/cross-spawn@7.0.3/node_modules/cross-spawn/index.js
var require_cross_spawn = __commonJS({
  "node_modules/.pnpm/cross-spawn@7.0.3/node_modules/cross-spawn/index.js"(exports2, module2) {
    "use strict";
    var cp = __require("child_process");
    var parse = require_parse();
    var enoent = require_enoent();
    function spawn(command, args, options) {
      const parsed = parse(command, args, options);
      const spawned = cp.spawn(parsed.command, parsed.args, parsed.options);
      enoent.hookChildProcess(spawned, parsed);
      return spawned;
    }
    function spawnSync(command, args, options) {
      const parsed = parse(command, args, options);
      const result = cp.spawnSync(parsed.command, parsed.args, parsed.options);
      result.error = result.error || enoent.verifyENOENTSync(result.status, parsed);
      return result;
    }
    module2.exports = spawn;
    module2.exports.spawn = spawn;
    module2.exports.sync = spawnSync;
    module2.exports._parse = parse;
    module2.exports._enoent = enoent;
  }
});

// node_modules/.pnpm/strip-final-newline@2.0.0/node_modules/strip-final-newline/index.js
var require_strip_final_newline = __commonJS({
  "node_modules/.pnpm/strip-final-newline@2.0.0/node_modules/strip-final-newline/index.js"(exports2, module2) {
    "use strict";
    module2.exports = (input) => {
      const LF = typeof input === "string" ? "\n" : "\n".charCodeAt();
      const CR = typeof input === "string" ? "\r" : "\r".charCodeAt();
      if (input[input.length - 1] === LF) {
        input = input.slice(0, input.length - 1);
      }
      if (input[input.length - 1] === CR) {
        input = input.slice(0, input.length - 1);
      }
      return input;
    };
  }
});

// node_modules/.pnpm/npm-run-path@4.0.1/node_modules/npm-run-path/index.js
var require_npm_run_path = __commonJS({
  "node_modules/.pnpm/npm-run-path@4.0.1/node_modules/npm-run-path/index.js"(exports2, module2) {
    "use strict";
    var path2 = __require("path");
    var pathKey = require_path_key();
    var npmRunPath = (options) => {
      options = __spreadValues({
        cwd: process.cwd(),
        path: process.env[pathKey()],
        execPath: process.execPath
      }, options);
      let previous;
      let cwdPath = path2.resolve(options.cwd);
      const result = [];
      while (previous !== cwdPath) {
        result.push(path2.join(cwdPath, "node_modules/.bin"));
        previous = cwdPath;
        cwdPath = path2.resolve(cwdPath, "..");
      }
      const execPathDir = path2.resolve(options.cwd, options.execPath, "..");
      result.push(execPathDir);
      return result.concat(options.path).join(path2.delimiter);
    };
    module2.exports = npmRunPath;
    module2.exports.default = npmRunPath;
    module2.exports.env = (options) => {
      options = __spreadValues({
        env: process.env
      }, options);
      const env = __spreadValues({}, options.env);
      const path3 = pathKey({ env });
      options.path = env[path3];
      env[path3] = module2.exports(options);
      return env;
    };
  }
});

// node_modules/.pnpm/mimic-fn@2.1.0/node_modules/mimic-fn/index.js
var require_mimic_fn = __commonJS({
  "node_modules/.pnpm/mimic-fn@2.1.0/node_modules/mimic-fn/index.js"(exports2, module2) {
    "use strict";
    var mimicFn = (to, from) => {
      for (const prop of Reflect.ownKeys(from)) {
        Object.defineProperty(to, prop, Object.getOwnPropertyDescriptor(from, prop));
      }
      return to;
    };
    module2.exports = mimicFn;
    module2.exports.default = mimicFn;
  }
});

// node_modules/.pnpm/onetime@5.1.2/node_modules/onetime/index.js
var require_onetime = __commonJS({
  "node_modules/.pnpm/onetime@5.1.2/node_modules/onetime/index.js"(exports2, module2) {
    "use strict";
    var mimicFn = require_mimic_fn();
    var calledFunctions = new WeakMap();
    var onetime = (function_, options = {}) => {
      if (typeof function_ !== "function") {
        throw new TypeError("Expected a function");
      }
      let returnValue;
      let callCount = 0;
      const functionName = function_.displayName || function_.name || "<anonymous>";
      const onetime2 = function(...arguments_) {
        calledFunctions.set(onetime2, ++callCount);
        if (callCount === 1) {
          returnValue = function_.apply(this, arguments_);
          function_ = null;
        } else if (options.throw === true) {
          throw new Error(`Function \`${functionName}\` can only be called once`);
        }
        return returnValue;
      };
      mimicFn(onetime2, function_);
      calledFunctions.set(onetime2, callCount);
      return onetime2;
    };
    module2.exports = onetime;
    module2.exports.default = onetime;
    module2.exports.callCount = (function_) => {
      if (!calledFunctions.has(function_)) {
        throw new Error(`The given function \`${function_.name}\` is not wrapped by the \`onetime\` package`);
      }
      return calledFunctions.get(function_);
    };
  }
});

// node_modules/.pnpm/human-signals@2.1.0/node_modules/human-signals/build/src/core.js
var require_core = __commonJS({
  "node_modules/.pnpm/human-signals@2.1.0/node_modules/human-signals/build/src/core.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.SIGNALS = void 0;
    var SIGNALS = [
      {
        name: "SIGHUP",
        number: 1,
        action: "terminate",
        description: "Terminal closed",
        standard: "posix"
      },
      {
        name: "SIGINT",
        number: 2,
        action: "terminate",
        description: "User interruption with CTRL-C",
        standard: "ansi"
      },
      {
        name: "SIGQUIT",
        number: 3,
        action: "core",
        description: "User interruption with CTRL-\\",
        standard: "posix"
      },
      {
        name: "SIGILL",
        number: 4,
        action: "core",
        description: "Invalid machine instruction",
        standard: "ansi"
      },
      {
        name: "SIGTRAP",
        number: 5,
        action: "core",
        description: "Debugger breakpoint",
        standard: "posix"
      },
      {
        name: "SIGABRT",
        number: 6,
        action: "core",
        description: "Aborted",
        standard: "ansi"
      },
      {
        name: "SIGIOT",
        number: 6,
        action: "core",
        description: "Aborted",
        standard: "bsd"
      },
      {
        name: "SIGBUS",
        number: 7,
        action: "core",
        description: "Bus error due to misaligned, non-existing address or paging error",
        standard: "bsd"
      },
      {
        name: "SIGEMT",
        number: 7,
        action: "terminate",
        description: "Command should be emulated but is not implemented",
        standard: "other"
      },
      {
        name: "SIGFPE",
        number: 8,
        action: "core",
        description: "Floating point arithmetic error",
        standard: "ansi"
      },
      {
        name: "SIGKILL",
        number: 9,
        action: "terminate",
        description: "Forced termination",
        standard: "posix",
        forced: true
      },
      {
        name: "SIGUSR1",
        number: 10,
        action: "terminate",
        description: "Application-specific signal",
        standard: "posix"
      },
      {
        name: "SIGSEGV",
        number: 11,
        action: "core",
        description: "Segmentation fault",
        standard: "ansi"
      },
      {
        name: "SIGUSR2",
        number: 12,
        action: "terminate",
        description: "Application-specific signal",
        standard: "posix"
      },
      {
        name: "SIGPIPE",
        number: 13,
        action: "terminate",
        description: "Broken pipe or socket",
        standard: "posix"
      },
      {
        name: "SIGALRM",
        number: 14,
        action: "terminate",
        description: "Timeout or timer",
        standard: "posix"
      },
      {
        name: "SIGTERM",
        number: 15,
        action: "terminate",
        description: "Termination",
        standard: "ansi"
      },
      {
        name: "SIGSTKFLT",
        number: 16,
        action: "terminate",
        description: "Stack is empty or overflowed",
        standard: "other"
      },
      {
        name: "SIGCHLD",
        number: 17,
        action: "ignore",
        description: "Child process terminated, paused or unpaused",
        standard: "posix"
      },
      {
        name: "SIGCLD",
        number: 17,
        action: "ignore",
        description: "Child process terminated, paused or unpaused",
        standard: "other"
      },
      {
        name: "SIGCONT",
        number: 18,
        action: "unpause",
        description: "Unpaused",
        standard: "posix",
        forced: true
      },
      {
        name: "SIGSTOP",
        number: 19,
        action: "pause",
        description: "Paused",
        standard: "posix",
        forced: true
      },
      {
        name: "SIGTSTP",
        number: 20,
        action: "pause",
        description: 'Paused using CTRL-Z or "suspend"',
        standard: "posix"
      },
      {
        name: "SIGTTIN",
        number: 21,
        action: "pause",
        description: "Background process cannot read terminal input",
        standard: "posix"
      },
      {
        name: "SIGBREAK",
        number: 21,
        action: "terminate",
        description: "User interruption with CTRL-BREAK",
        standard: "other"
      },
      {
        name: "SIGTTOU",
        number: 22,
        action: "pause",
        description: "Background process cannot write to terminal output",
        standard: "posix"
      },
      {
        name: "SIGURG",
        number: 23,
        action: "ignore",
        description: "Socket received out-of-band data",
        standard: "bsd"
      },
      {
        name: "SIGXCPU",
        number: 24,
        action: "core",
        description: "Process timed out",
        standard: "bsd"
      },
      {
        name: "SIGXFSZ",
        number: 25,
        action: "core",
        description: "File too big",
        standard: "bsd"
      },
      {
        name: "SIGVTALRM",
        number: 26,
        action: "terminate",
        description: "Timeout or timer",
        standard: "bsd"
      },
      {
        name: "SIGPROF",
        number: 27,
        action: "terminate",
        description: "Timeout or timer",
        standard: "bsd"
      },
      {
        name: "SIGWINCH",
        number: 28,
        action: "ignore",
        description: "Terminal window size changed",
        standard: "bsd"
      },
      {
        name: "SIGIO",
        number: 29,
        action: "terminate",
        description: "I/O is available",
        standard: "other"
      },
      {
        name: "SIGPOLL",
        number: 29,
        action: "terminate",
        description: "Watched event",
        standard: "other"
      },
      {
        name: "SIGINFO",
        number: 29,
        action: "ignore",
        description: "Request for process information",
        standard: "other"
      },
      {
        name: "SIGPWR",
        number: 30,
        action: "terminate",
        description: "Device running out of power",
        standard: "systemv"
      },
      {
        name: "SIGSYS",
        number: 31,
        action: "core",
        description: "Invalid system call",
        standard: "other"
      },
      {
        name: "SIGUNUSED",
        number: 31,
        action: "terminate",
        description: "Invalid system call",
        standard: "other"
      }
    ];
    exports2.SIGNALS = SIGNALS;
  }
});

// node_modules/.pnpm/human-signals@2.1.0/node_modules/human-signals/build/src/realtime.js
var require_realtime = __commonJS({
  "node_modules/.pnpm/human-signals@2.1.0/node_modules/human-signals/build/src/realtime.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.SIGRTMAX = exports2.getRealtimeSignals = void 0;
    var getRealtimeSignals = function() {
      const length = SIGRTMAX - SIGRTMIN + 1;
      return Array.from({ length }, getRealtimeSignal);
    };
    exports2.getRealtimeSignals = getRealtimeSignals;
    var getRealtimeSignal = function(value2, index) {
      return {
        name: `SIGRT${index + 1}`,
        number: SIGRTMIN + index,
        action: "terminate",
        description: "Application-specific signal (realtime)",
        standard: "posix"
      };
    };
    var SIGRTMIN = 34;
    var SIGRTMAX = 64;
    exports2.SIGRTMAX = SIGRTMAX;
  }
});

// node_modules/.pnpm/human-signals@2.1.0/node_modules/human-signals/build/src/signals.js
var require_signals = __commonJS({
  "node_modules/.pnpm/human-signals@2.1.0/node_modules/human-signals/build/src/signals.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.getSignals = void 0;
    var _os = __require("os");
    var _core = require_core();
    var _realtime = require_realtime();
    var getSignals = function() {
      const realtimeSignals = (0, _realtime.getRealtimeSignals)();
      const signals = [..._core.SIGNALS, ...realtimeSignals].map(normalizeSignal);
      return signals;
    };
    exports2.getSignals = getSignals;
    var normalizeSignal = function({
      name: name2,
      number: defaultNumber,
      description,
      action,
      forced = false,
      standard
    }) {
      const {
        signals: { [name2]: constantSignal }
      } = _os.constants;
      const supported = constantSignal !== void 0;
      const number = supported ? constantSignal : defaultNumber;
      return { name: name2, number, description, supported, action, forced, standard };
    };
  }
});

// node_modules/.pnpm/human-signals@2.1.0/node_modules/human-signals/build/src/main.js
var require_main = __commonJS({
  "node_modules/.pnpm/human-signals@2.1.0/node_modules/human-signals/build/src/main.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.signalsByNumber = exports2.signalsByName = void 0;
    var _os = __require("os");
    var _signals = require_signals();
    var _realtime = require_realtime();
    var getSignalsByName = function() {
      const signals = (0, _signals.getSignals)();
      return signals.reduce(getSignalByName, {});
    };
    var getSignalByName = function(signalByNameMemo, { name: name2, number, description, supported, action, forced, standard }) {
      return __spreadProps(__spreadValues({}, signalByNameMemo), {
        [name2]: { name: name2, number, description, supported, action, forced, standard }
      });
    };
    var signalsByName = getSignalsByName();
    exports2.signalsByName = signalsByName;
    var getSignalsByNumber = function() {
      const signals = (0, _signals.getSignals)();
      const length = _realtime.SIGRTMAX + 1;
      const signalsA = Array.from({ length }, (value2, number) => getSignalByNumber(number, signals));
      return Object.assign({}, ...signalsA);
    };
    var getSignalByNumber = function(number, signals) {
      const signal = findSignalByNumber(number, signals);
      if (signal === void 0) {
        return {};
      }
      const { name: name2, description, supported, action, forced, standard } = signal;
      return {
        [number]: {
          name: name2,
          number,
          description,
          supported,
          action,
          forced,
          standard
        }
      };
    };
    var findSignalByNumber = function(number, signals) {
      const signal = signals.find(({ name: name2 }) => _os.constants.signals[name2] === number);
      if (signal !== void 0) {
        return signal;
      }
      return signals.find((signalA) => signalA.number === number);
    };
    var signalsByNumber = getSignalsByNumber();
    exports2.signalsByNumber = signalsByNumber;
  }
});

// node_modules/.pnpm/execa@5.1.1/node_modules/execa/lib/error.js
var require_error = __commonJS({
  "node_modules/.pnpm/execa@5.1.1/node_modules/execa/lib/error.js"(exports2, module2) {
    "use strict";
    var { signalsByName } = require_main();
    var getErrorPrefix = ({ timedOut, timeout, errorCode, signal, signalDescription, exitCode, isCanceled }) => {
      if (timedOut) {
        return `timed out after ${timeout} milliseconds`;
      }
      if (isCanceled) {
        return "was canceled";
      }
      if (errorCode !== void 0) {
        return `failed with ${errorCode}`;
      }
      if (signal !== void 0) {
        return `was killed with ${signal} (${signalDescription})`;
      }
      if (exitCode !== void 0) {
        return `failed with exit code ${exitCode}`;
      }
      return "failed";
    };
    var makeError = ({
      stdout,
      stderr,
      all,
      error,
      signal,
      exitCode,
      command,
      escapedCommand,
      timedOut,
      isCanceled,
      killed,
      parsed: { options: { timeout } }
    }) => {
      exitCode = exitCode === null ? void 0 : exitCode;
      signal = signal === null ? void 0 : signal;
      const signalDescription = signal === void 0 ? void 0 : signalsByName[signal].description;
      const errorCode = error && error.code;
      const prefix = getErrorPrefix({ timedOut, timeout, errorCode, signal, signalDescription, exitCode, isCanceled });
      const execaMessage = `Command ${prefix}: ${command}`;
      const isError = Object.prototype.toString.call(error) === "[object Error]";
      const shortMessage = isError ? `${execaMessage}
${error.message}` : execaMessage;
      const message = [shortMessage, stderr, stdout].filter(Boolean).join("\n");
      if (isError) {
        error.originalMessage = error.message;
        error.message = message;
      } else {
        error = new Error(message);
      }
      error.shortMessage = shortMessage;
      error.command = command;
      error.escapedCommand = escapedCommand;
      error.exitCode = exitCode;
      error.signal = signal;
      error.signalDescription = signalDescription;
      error.stdout = stdout;
      error.stderr = stderr;
      if (all !== void 0) {
        error.all = all;
      }
      if ("bufferedData" in error) {
        delete error.bufferedData;
      }
      error.failed = true;
      error.timedOut = Boolean(timedOut);
      error.isCanceled = isCanceled;
      error.killed = killed && !timedOut;
      return error;
    };
    module2.exports = makeError;
  }
});

// node_modules/.pnpm/execa@5.1.1/node_modules/execa/lib/stdio.js
var require_stdio = __commonJS({
  "node_modules/.pnpm/execa@5.1.1/node_modules/execa/lib/stdio.js"(exports2, module2) {
    "use strict";
    var aliases = ["stdin", "stdout", "stderr"];
    var hasAlias = (options) => aliases.some((alias) => options[alias] !== void 0);
    var normalizeStdio = (options) => {
      if (!options) {
        return;
      }
      const { stdio } = options;
      if (stdio === void 0) {
        return aliases.map((alias) => options[alias]);
      }
      if (hasAlias(options)) {
        throw new Error(`It's not possible to provide \`stdio\` in combination with one of ${aliases.map((alias) => `\`${alias}\``).join(", ")}`);
      }
      if (typeof stdio === "string") {
        return stdio;
      }
      if (!Array.isArray(stdio)) {
        throw new TypeError(`Expected \`stdio\` to be of type \`string\` or \`Array\`, got \`${typeof stdio}\``);
      }
      const length = Math.max(stdio.length, aliases.length);
      return Array.from({ length }, (value2, index) => stdio[index]);
    };
    module2.exports = normalizeStdio;
    module2.exports.node = (options) => {
      const stdio = normalizeStdio(options);
      if (stdio === "ipc") {
        return "ipc";
      }
      if (stdio === void 0 || typeof stdio === "string") {
        return [stdio, stdio, stdio, "ipc"];
      }
      if (stdio.includes("ipc")) {
        return stdio;
      }
      return [...stdio, "ipc"];
    };
  }
});

// node_modules/.pnpm/signal-exit@3.0.5/node_modules/signal-exit/signals.js
var require_signals2 = __commonJS({
  "node_modules/.pnpm/signal-exit@3.0.5/node_modules/signal-exit/signals.js"(exports2, module2) {
    module2.exports = [
      "SIGABRT",
      "SIGALRM",
      "SIGHUP",
      "SIGINT",
      "SIGTERM"
    ];
    if (process.platform !== "win32") {
      module2.exports.push("SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
    }
    if (process.platform === "linux") {
      module2.exports.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT", "SIGUNUSED");
    }
  }
});

// node_modules/.pnpm/signal-exit@3.0.5/node_modules/signal-exit/index.js
var require_signal_exit = __commonJS({
  "node_modules/.pnpm/signal-exit@3.0.5/node_modules/signal-exit/index.js"(exports2, module2) {
    var process2 = global.process;
    if (typeof process2 !== "object" || !process2) {
      module2.exports = function() {
      };
    } else {
      assert = __require("assert");
      signals = require_signals2();
      isWin = /^win/i.test(process2.platform);
      EE = __require("events");
      if (typeof EE !== "function") {
        EE = EE.EventEmitter;
      }
      if (process2.__signal_exit_emitter__) {
        emitter = process2.__signal_exit_emitter__;
      } else {
        emitter = process2.__signal_exit_emitter__ = new EE();
        emitter.count = 0;
        emitter.emitted = {};
      }
      if (!emitter.infinite) {
        emitter.setMaxListeners(Infinity);
        emitter.infinite = true;
      }
      module2.exports = function(cb, opts) {
        if (global.process !== process2) {
          return;
        }
        assert.equal(typeof cb, "function", "a callback must be provided for exit handler");
        if (loaded === false) {
          load();
        }
        var ev = "exit";
        if (opts && opts.alwaysLast) {
          ev = "afterexit";
        }
        var remove2 = function() {
          emitter.removeListener(ev, cb);
          if (emitter.listeners("exit").length === 0 && emitter.listeners("afterexit").length === 0) {
            unload();
          }
        };
        emitter.on(ev, cb);
        return remove2;
      };
      unload = function unload2() {
        if (!loaded || global.process !== process2) {
          return;
        }
        loaded = false;
        signals.forEach(function(sig) {
          try {
            process2.removeListener(sig, sigListeners[sig]);
          } catch (er) {
          }
        });
        process2.emit = originalProcessEmit;
        process2.reallyExit = originalProcessReallyExit;
        emitter.count -= 1;
      };
      module2.exports.unload = unload;
      emit = function emit2(event, code, signal) {
        if (emitter.emitted[event]) {
          return;
        }
        emitter.emitted[event] = true;
        emitter.emit(event, code, signal);
      };
      sigListeners = {};
      signals.forEach(function(sig) {
        sigListeners[sig] = function listener() {
          if (process2 !== global.process) {
            return;
          }
          var listeners = process2.listeners(sig);
          if (listeners.length === emitter.count) {
            unload();
            emit("exit", null, sig);
            emit("afterexit", null, sig);
            if (isWin && sig === "SIGHUP") {
              sig = "SIGINT";
            }
            process2.kill(process2.pid, sig);
          }
        };
      });
      module2.exports.signals = function() {
        return signals;
      };
      loaded = false;
      load = function load2() {
        if (loaded || process2 !== global.process) {
          return;
        }
        loaded = true;
        emitter.count += 1;
        signals = signals.filter(function(sig) {
          try {
            process2.on(sig, sigListeners[sig]);
            return true;
          } catch (er) {
            return false;
          }
        });
        process2.emit = processEmit;
        process2.reallyExit = processReallyExit;
      };
      module2.exports.load = load;
      originalProcessReallyExit = process2.reallyExit;
      processReallyExit = function processReallyExit2(code) {
        if (process2 !== global.process) {
          return;
        }
        process2.exitCode = code || 0;
        emit("exit", process2.exitCode, null);
        emit("afterexit", process2.exitCode, null);
        originalProcessReallyExit.call(process2, process2.exitCode);
      };
      originalProcessEmit = process2.emit;
      processEmit = function processEmit2(ev, arg2) {
        if (ev === "exit" && process2 === global.process) {
          if (arg2 !== void 0) {
            process2.exitCode = arg2;
          }
          var ret = originalProcessEmit.apply(this, arguments);
          emit("exit", process2.exitCode, null);
          emit("afterexit", process2.exitCode, null);
          return ret;
        } else {
          return originalProcessEmit.apply(this, arguments);
        }
      };
    }
    var assert;
    var signals;
    var isWin;
    var EE;
    var emitter;
    var unload;
    var emit;
    var sigListeners;
    var loaded;
    var load;
    var originalProcessReallyExit;
    var processReallyExit;
    var originalProcessEmit;
    var processEmit;
  }
});

// node_modules/.pnpm/execa@5.1.1/node_modules/execa/lib/kill.js
var require_kill = __commonJS({
  "node_modules/.pnpm/execa@5.1.1/node_modules/execa/lib/kill.js"(exports2, module2) {
    "use strict";
    var os = __require("os");
    var onExit = require_signal_exit();
    var DEFAULT_FORCE_KILL_TIMEOUT = 1e3 * 5;
    var spawnedKill = (kill, signal = "SIGTERM", options = {}) => {
      const killResult = kill(signal);
      setKillTimeout(kill, signal, options, killResult);
      return killResult;
    };
    var setKillTimeout = (kill, signal, options, killResult) => {
      if (!shouldForceKill(signal, options, killResult)) {
        return;
      }
      const timeout = getForceKillAfterTimeout(options);
      const t = setTimeout(() => {
        kill("SIGKILL");
      }, timeout);
      if (t.unref) {
        t.unref();
      }
    };
    var shouldForceKill = (signal, { forceKillAfterTimeout }, killResult) => {
      return isSigterm(signal) && forceKillAfterTimeout !== false && killResult;
    };
    var isSigterm = (signal) => {
      return signal === os.constants.signals.SIGTERM || typeof signal === "string" && signal.toUpperCase() === "SIGTERM";
    };
    var getForceKillAfterTimeout = ({ forceKillAfterTimeout = true }) => {
      if (forceKillAfterTimeout === true) {
        return DEFAULT_FORCE_KILL_TIMEOUT;
      }
      if (!Number.isFinite(forceKillAfterTimeout) || forceKillAfterTimeout < 0) {
        throw new TypeError(`Expected the \`forceKillAfterTimeout\` option to be a non-negative integer, got \`${forceKillAfterTimeout}\` (${typeof forceKillAfterTimeout})`);
      }
      return forceKillAfterTimeout;
    };
    var spawnedCancel = (spawned, context) => {
      const killResult = spawned.kill();
      if (killResult) {
        context.isCanceled = true;
      }
    };
    var timeoutKill = (spawned, signal, reject) => {
      spawned.kill(signal);
      reject(Object.assign(new Error("Timed out"), { timedOut: true, signal }));
    };
    var setupTimeout = (spawned, { timeout, killSignal = "SIGTERM" }, spawnedPromise) => {
      if (timeout === 0 || timeout === void 0) {
        return spawnedPromise;
      }
      let timeoutId;
      const timeoutPromise = new Promise((resolve, reject) => {
        timeoutId = setTimeout(() => {
          timeoutKill(spawned, killSignal, reject);
        }, timeout);
      });
      const safeSpawnedPromise = spawnedPromise.finally(() => {
        clearTimeout(timeoutId);
      });
      return Promise.race([timeoutPromise, safeSpawnedPromise]);
    };
    var validateTimeout = ({ timeout }) => {
      if (timeout !== void 0 && (!Number.isFinite(timeout) || timeout < 0)) {
        throw new TypeError(`Expected the \`timeout\` option to be a non-negative integer, got \`${timeout}\` (${typeof timeout})`);
      }
    };
    var setExitHandler = async (spawned, { cleanup, detached }, timedPromise) => {
      if (!cleanup || detached) {
        return timedPromise;
      }
      const removeExitHandler = onExit(() => {
        spawned.kill();
      });
      return timedPromise.finally(() => {
        removeExitHandler();
      });
    };
    module2.exports = {
      spawnedKill,
      spawnedCancel,
      setupTimeout,
      validateTimeout,
      setExitHandler
    };
  }
});

// node_modules/.pnpm/is-stream@2.0.1/node_modules/is-stream/index.js
var require_is_stream = __commonJS({
  "node_modules/.pnpm/is-stream@2.0.1/node_modules/is-stream/index.js"(exports2, module2) {
    "use strict";
    var isStream = (stream) => stream !== null && typeof stream === "object" && typeof stream.pipe === "function";
    isStream.writable = (stream) => isStream(stream) && stream.writable !== false && typeof stream._write === "function" && typeof stream._writableState === "object";
    isStream.readable = (stream) => isStream(stream) && stream.readable !== false && typeof stream._read === "function" && typeof stream._readableState === "object";
    isStream.duplex = (stream) => isStream.writable(stream) && isStream.readable(stream);
    isStream.transform = (stream) => isStream.duplex(stream) && typeof stream._transform === "function";
    module2.exports = isStream;
  }
});

// node_modules/.pnpm/get-stream@6.0.1/node_modules/get-stream/buffer-stream.js
var require_buffer_stream = __commonJS({
  "node_modules/.pnpm/get-stream@6.0.1/node_modules/get-stream/buffer-stream.js"(exports2, module2) {
    "use strict";
    var { PassThrough: PassThroughStream } = __require("stream");
    module2.exports = (options) => {
      options = __spreadValues({}, options);
      const { array } = options;
      let { encoding } = options;
      const isBuffer = encoding === "buffer";
      let objectMode = false;
      if (array) {
        objectMode = !(encoding || isBuffer);
      } else {
        encoding = encoding || "utf8";
      }
      if (isBuffer) {
        encoding = null;
      }
      const stream = new PassThroughStream({ objectMode });
      if (encoding) {
        stream.setEncoding(encoding);
      }
      let length = 0;
      const chunks = [];
      stream.on("data", (chunk) => {
        chunks.push(chunk);
        if (objectMode) {
          length = chunks.length;
        } else {
          length += chunk.length;
        }
      });
      stream.getBufferedValue = () => {
        if (array) {
          return chunks;
        }
        return isBuffer ? Buffer.concat(chunks, length) : chunks.join("");
      };
      stream.getBufferedLength = () => length;
      return stream;
    };
  }
});

// node_modules/.pnpm/get-stream@6.0.1/node_modules/get-stream/index.js
var require_get_stream = __commonJS({
  "node_modules/.pnpm/get-stream@6.0.1/node_modules/get-stream/index.js"(exports2, module2) {
    "use strict";
    var { constants: BufferConstants } = __require("buffer");
    var stream = __require("stream");
    var { promisify } = __require("util");
    var bufferStream = require_buffer_stream();
    var streamPipelinePromisified = promisify(stream.pipeline);
    var MaxBufferError = class extends Error {
      constructor() {
        super("maxBuffer exceeded");
        this.name = "MaxBufferError";
      }
    };
    async function getStream(inputStream, options) {
      if (!inputStream) {
        throw new Error("Expected a stream");
      }
      options = __spreadValues({
        maxBuffer: Infinity
      }, options);
      const { maxBuffer } = options;
      const stream2 = bufferStream(options);
      await new Promise((resolve, reject) => {
        const rejectPromise = (error) => {
          if (error && stream2.getBufferedLength() <= BufferConstants.MAX_LENGTH) {
            error.bufferedData = stream2.getBufferedValue();
          }
          reject(error);
        };
        (async () => {
          try {
            await streamPipelinePromisified(inputStream, stream2);
            resolve();
          } catch (error) {
            rejectPromise(error);
          }
        })();
        stream2.on("data", () => {
          if (stream2.getBufferedLength() > maxBuffer) {
            rejectPromise(new MaxBufferError());
          }
        });
      });
      return stream2.getBufferedValue();
    }
    module2.exports = getStream;
    module2.exports.buffer = (stream2, options) => getStream(stream2, __spreadProps(__spreadValues({}, options), { encoding: "buffer" }));
    module2.exports.array = (stream2, options) => getStream(stream2, __spreadProps(__spreadValues({}, options), { array: true }));
    module2.exports.MaxBufferError = MaxBufferError;
  }
});

// node_modules/.pnpm/merge-stream@2.0.0/node_modules/merge-stream/index.js
var require_merge_stream = __commonJS({
  "node_modules/.pnpm/merge-stream@2.0.0/node_modules/merge-stream/index.js"(exports2, module2) {
    "use strict";
    var { PassThrough } = __require("stream");
    module2.exports = function() {
      var sources = [];
      var output = new PassThrough({ objectMode: true });
      output.setMaxListeners(0);
      output.add = add;
      output.isEmpty = isEmpty;
      output.on("unpipe", remove2);
      Array.prototype.slice.call(arguments).forEach(add);
      return output;
      function add(source) {
        if (Array.isArray(source)) {
          source.forEach(add);
          return this;
        }
        sources.push(source);
        source.once("end", remove2.bind(null, source));
        source.once("error", output.emit.bind(output, "error"));
        source.pipe(output, { end: false });
        return this;
      }
      function isEmpty() {
        return sources.length == 0;
      }
      function remove2(source) {
        sources = sources.filter(function(it) {
          return it !== source;
        });
        if (!sources.length && output.readable) {
          output.end();
        }
      }
    };
  }
});

// node_modules/.pnpm/execa@5.1.1/node_modules/execa/lib/stream.js
var require_stream = __commonJS({
  "node_modules/.pnpm/execa@5.1.1/node_modules/execa/lib/stream.js"(exports2, module2) {
    "use strict";
    var isStream = require_is_stream();
    var getStream = require_get_stream();
    var mergeStream = require_merge_stream();
    var handleInput = (spawned, input) => {
      if (input === void 0 || spawned.stdin === void 0) {
        return;
      }
      if (isStream(input)) {
        input.pipe(spawned.stdin);
      } else {
        spawned.stdin.end(input);
      }
    };
    var makeAllStream = (spawned, { all }) => {
      if (!all || !spawned.stdout && !spawned.stderr) {
        return;
      }
      const mixed = mergeStream();
      if (spawned.stdout) {
        mixed.add(spawned.stdout);
      }
      if (spawned.stderr) {
        mixed.add(spawned.stderr);
      }
      return mixed;
    };
    var getBufferedData = async (stream, streamPromise) => {
      if (!stream) {
        return;
      }
      stream.destroy();
      try {
        return await streamPromise;
      } catch (error) {
        return error.bufferedData;
      }
    };
    var getStreamPromise = (stream, { encoding, buffer, maxBuffer }) => {
      if (!stream || !buffer) {
        return;
      }
      if (encoding) {
        return getStream(stream, { encoding, maxBuffer });
      }
      return getStream.buffer(stream, { maxBuffer });
    };
    var getSpawnedResult = async ({ stdout, stderr, all }, { encoding, buffer, maxBuffer }, processDone) => {
      const stdoutPromise = getStreamPromise(stdout, { encoding, buffer, maxBuffer });
      const stderrPromise = getStreamPromise(stderr, { encoding, buffer, maxBuffer });
      const allPromise = getStreamPromise(all, { encoding, buffer, maxBuffer: maxBuffer * 2 });
      try {
        return await Promise.all([processDone, stdoutPromise, stderrPromise, allPromise]);
      } catch (error) {
        return Promise.all([
          { error, signal: error.signal, timedOut: error.timedOut },
          getBufferedData(stdout, stdoutPromise),
          getBufferedData(stderr, stderrPromise),
          getBufferedData(all, allPromise)
        ]);
      }
    };
    var validateInputSync = ({ input }) => {
      if (isStream(input)) {
        throw new TypeError("The `input` option cannot be a stream in sync mode");
      }
    };
    module2.exports = {
      handleInput,
      makeAllStream,
      getSpawnedResult,
      validateInputSync
    };
  }
});

// node_modules/.pnpm/execa@5.1.1/node_modules/execa/lib/promise.js
var require_promise = __commonJS({
  "node_modules/.pnpm/execa@5.1.1/node_modules/execa/lib/promise.js"(exports2, module2) {
    "use strict";
    var nativePromisePrototype = (async () => {
    })().constructor.prototype;
    var descriptors = ["then", "catch", "finally"].map((property) => [
      property,
      Reflect.getOwnPropertyDescriptor(nativePromisePrototype, property)
    ]);
    var mergePromise = (spawned, promise) => {
      for (const [property, descriptor] of descriptors) {
        const value2 = typeof promise === "function" ? (...args) => Reflect.apply(descriptor.value, promise(), args) : descriptor.value.bind(promise);
        Reflect.defineProperty(spawned, property, __spreadProps(__spreadValues({}, descriptor), { value: value2 }));
      }
      return spawned;
    };
    var getSpawnedPromise = (spawned) => {
      return new Promise((resolve, reject) => {
        spawned.on("exit", (exitCode, signal) => {
          resolve({ exitCode, signal });
        });
        spawned.on("error", (error) => {
          reject(error);
        });
        if (spawned.stdin) {
          spawned.stdin.on("error", (error) => {
            reject(error);
          });
        }
      });
    };
    module2.exports = {
      mergePromise,
      getSpawnedPromise
    };
  }
});

// node_modules/.pnpm/execa@5.1.1/node_modules/execa/lib/command.js
var require_command = __commonJS({
  "node_modules/.pnpm/execa@5.1.1/node_modules/execa/lib/command.js"(exports2, module2) {
    "use strict";
    var normalizeArgs = (file, args = []) => {
      if (!Array.isArray(args)) {
        return [file];
      }
      return [file, ...args];
    };
    var NO_ESCAPE_REGEXP = /^[\w.-]+$/;
    var DOUBLE_QUOTES_REGEXP = /"/g;
    var escapeArg = (arg2) => {
      if (typeof arg2 !== "string" || NO_ESCAPE_REGEXP.test(arg2)) {
        return arg2;
      }
      return `"${arg2.replace(DOUBLE_QUOTES_REGEXP, '\\"')}"`;
    };
    var joinCommand = (file, args) => {
      return normalizeArgs(file, args).join(" ");
    };
    var getEscapedCommand = (file, args) => {
      return normalizeArgs(file, args).map((arg2) => escapeArg(arg2)).join(" ");
    };
    var SPACES_REGEXP = / +/g;
    var parseCommand = (command) => {
      const tokens = [];
      for (const token of command.trim().split(SPACES_REGEXP)) {
        const previousToken = tokens[tokens.length - 1];
        if (previousToken && previousToken.endsWith("\\")) {
          tokens[tokens.length - 1] = `${previousToken.slice(0, -1)} ${token}`;
        } else {
          tokens.push(token);
        }
      }
      return tokens;
    };
    module2.exports = {
      joinCommand,
      getEscapedCommand,
      parseCommand
    };
  }
});

// node_modules/.pnpm/execa@5.1.1/node_modules/execa/index.js
var require_execa = __commonJS({
  "node_modules/.pnpm/execa@5.1.1/node_modules/execa/index.js"(exports2, module2) {
    "use strict";
    var path2 = __require("path");
    var childProcess = __require("child_process");
    var crossSpawn = require_cross_spawn();
    var stripFinalNewline = require_strip_final_newline();
    var npmRunPath = require_npm_run_path();
    var onetime = require_onetime();
    var makeError = require_error();
    var normalizeStdio = require_stdio();
    var { spawnedKill, spawnedCancel, setupTimeout, validateTimeout, setExitHandler } = require_kill();
    var { handleInput, getSpawnedResult, makeAllStream, validateInputSync } = require_stream();
    var { mergePromise, getSpawnedPromise } = require_promise();
    var { joinCommand, parseCommand, getEscapedCommand } = require_command();
    var DEFAULT_MAX_BUFFER = 1e3 * 1e3 * 100;
    var getEnv = ({ env: envOption, extendEnv, preferLocal, localDir, execPath }) => {
      const env = extendEnv ? __spreadValues(__spreadValues({}, process.env), envOption) : envOption;
      if (preferLocal) {
        return npmRunPath.env({ env, cwd: localDir, execPath });
      }
      return env;
    };
    var handleArguments = (file, args, options = {}) => {
      const parsed = crossSpawn._parse(file, args, options);
      file = parsed.command;
      args = parsed.args;
      options = parsed.options;
      options = __spreadValues({
        maxBuffer: DEFAULT_MAX_BUFFER,
        buffer: true,
        stripFinalNewline: true,
        extendEnv: true,
        preferLocal: false,
        localDir: options.cwd || process.cwd(),
        execPath: process.execPath,
        encoding: "utf8",
        reject: true,
        cleanup: true,
        all: false,
        windowsHide: true
      }, options);
      options.env = getEnv(options);
      options.stdio = normalizeStdio(options);
      if (process.platform === "win32" && path2.basename(file, ".exe") === "cmd") {
        args.unshift("/q");
      }
      return { file, args, options, parsed };
    };
    var handleOutput = (options, value2, error) => {
      if (typeof value2 !== "string" && !Buffer.isBuffer(value2)) {
        return error === void 0 ? void 0 : "";
      }
      if (options.stripFinalNewline) {
        return stripFinalNewline(value2);
      }
      return value2;
    };
    var execa3 = (file, args, options) => {
      const parsed = handleArguments(file, args, options);
      const command = joinCommand(file, args);
      const escapedCommand = getEscapedCommand(file, args);
      validateTimeout(parsed.options);
      let spawned;
      try {
        spawned = childProcess.spawn(parsed.file, parsed.args, parsed.options);
      } catch (error) {
        const dummySpawned = new childProcess.ChildProcess();
        const errorPromise = Promise.reject(makeError({
          error,
          stdout: "",
          stderr: "",
          all: "",
          command,
          escapedCommand,
          parsed,
          timedOut: false,
          isCanceled: false,
          killed: false
        }));
        return mergePromise(dummySpawned, errorPromise);
      }
      const spawnedPromise = getSpawnedPromise(spawned);
      const timedPromise = setupTimeout(spawned, parsed.options, spawnedPromise);
      const processDone = setExitHandler(spawned, parsed.options, timedPromise);
      const context = { isCanceled: false };
      spawned.kill = spawnedKill.bind(null, spawned.kill.bind(spawned));
      spawned.cancel = spawnedCancel.bind(null, spawned, context);
      const handlePromise = async () => {
        const [{ error, exitCode, signal, timedOut }, stdoutResult, stderrResult, allResult] = await getSpawnedResult(spawned, parsed.options, processDone);
        const stdout = handleOutput(parsed.options, stdoutResult);
        const stderr = handleOutput(parsed.options, stderrResult);
        const all = handleOutput(parsed.options, allResult);
        if (error || exitCode !== 0 || signal !== null) {
          const returnedError = makeError({
            error,
            exitCode,
            signal,
            stdout,
            stderr,
            all,
            command,
            escapedCommand,
            parsed,
            timedOut,
            isCanceled: context.isCanceled,
            killed: spawned.killed
          });
          if (!parsed.options.reject) {
            return returnedError;
          }
          throw returnedError;
        }
        return {
          command,
          escapedCommand,
          exitCode: 0,
          stdout,
          stderr,
          all,
          failed: false,
          timedOut: false,
          isCanceled: false,
          killed: false
        };
      };
      const handlePromiseOnce = onetime(handlePromise);
      handleInput(spawned, parsed.options.input);
      spawned.all = makeAllStream(spawned, parsed.options);
      return mergePromise(spawned, handlePromiseOnce);
    };
    module2.exports = execa3;
    module2.exports.sync = (file, args, options) => {
      const parsed = handleArguments(file, args, options);
      const command = joinCommand(file, args);
      const escapedCommand = getEscapedCommand(file, args);
      validateInputSync(parsed.options);
      let result;
      try {
        result = childProcess.spawnSync(parsed.file, parsed.args, parsed.options);
      } catch (error) {
        throw makeError({
          error,
          stdout: "",
          stderr: "",
          all: "",
          command,
          escapedCommand,
          parsed,
          timedOut: false,
          isCanceled: false,
          killed: false
        });
      }
      const stdout = handleOutput(parsed.options, result.stdout, result.error);
      const stderr = handleOutput(parsed.options, result.stderr, result.error);
      if (result.error || result.status !== 0 || result.signal !== null) {
        const error = makeError({
          stdout,
          stderr,
          error: result.error,
          signal: result.signal,
          exitCode: result.status,
          command,
          escapedCommand,
          parsed,
          timedOut: result.error && result.error.code === "ETIMEDOUT",
          isCanceled: false,
          killed: result.signal !== null
        });
        if (!parsed.options.reject) {
          return error;
        }
        throw error;
      }
      return {
        command,
        escapedCommand,
        exitCode: 0,
        stdout,
        stderr,
        failed: false,
        timedOut: false,
        isCanceled: false,
        killed: false
      };
    };
    module2.exports.command = (command, options) => {
      const [file, ...args] = parseCommand(command);
      return execa3(file, args, options);
    };
    module2.exports.commandSync = (command, options) => {
      const [file, ...args] = parseCommand(command);
      return execa3.sync(file, args, options);
    };
    module2.exports.node = (scriptPath, args, options = {}) => {
      if (args && !Array.isArray(args) && typeof args === "object") {
        options = args;
        args = [];
      }
      const stdio = normalizeStdio.node(options);
      const defaultExecArgv = process.execArgv.filter((arg2) => !arg2.startsWith("--inspect"));
      const {
        nodePath = process.execPath,
        nodeOptions = defaultExecArgv
      } = options;
      return execa3(nodePath, [
        ...nodeOptions,
        scriptPath,
        ...Array.isArray(args) ? args : []
      ], __spreadProps(__spreadValues({}, options), {
        stdin: void 0,
        stdout: void 0,
        stderr: void 0,
        stdio,
        shell: false
      }));
    };
  }
});

// node_modules/.pnpm/async-lock@1.3.0/node_modules/async-lock/lib/index.js
var require_lib = __commonJS({
  "node_modules/.pnpm/async-lock@1.3.0/node_modules/async-lock/lib/index.js"(exports2, module2) {
    "use strict";
    var AsyncLock = function(opts) {
      opts = opts || {};
      this.Promise = opts.Promise || Promise;
      this.queues = Object.create(null);
      this.domainReentrant = opts.domainReentrant || false;
      if (this.domainReentrant) {
        if (typeof process === "undefined" || typeof process.domain === "undefined") {
          throw new Error("Domain-reentrant locks require `process.domain` to exist. Please flip `opts.domainReentrant = false`, use a NodeJS version that still implements Domain, or install a browser polyfill.");
        }
        this.domains = Object.create(null);
      }
      this.timeout = opts.timeout || AsyncLock.DEFAULT_TIMEOUT;
      this.maxOccupationTime = opts.maxOccupationTime || AsyncLock.DEFAULT_MAX_OCCUPATION_TIME;
      if (opts.maxPending === Infinity || Number.isInteger(opts.maxPending) && opts.maxPending >= 0) {
        this.maxPending = opts.maxPending;
      } else {
        this.maxPending = AsyncLock.DEFAULT_MAX_PENDING;
      }
    };
    AsyncLock.DEFAULT_TIMEOUT = 0;
    AsyncLock.DEFAULT_MAX_OCCUPATION_TIME = 0;
    AsyncLock.DEFAULT_MAX_PENDING = 1e3;
    AsyncLock.prototype.acquire = function(key, fn, cb, opts) {
      if (Array.isArray(key)) {
        return this._acquireBatch(key, fn, cb, opts);
      }
      if (typeof fn !== "function") {
        throw new Error("You must pass a function to execute");
      }
      var deferredResolve = null;
      var deferredReject = null;
      var deferred = null;
      if (typeof cb !== "function") {
        opts = cb;
        cb = null;
        deferred = new this.Promise(function(resolve, reject) {
          deferredResolve = resolve;
          deferredReject = reject;
        });
      }
      opts = opts || {};
      var resolved = false;
      var timer = null;
      var occupationTimer = null;
      var self2 = this;
      var done = function(locked, err, ret) {
        if (occupationTimer) {
          clearTimeout(occupationTimer);
          occupationTimer = null;
        }
        if (locked) {
          if (!!self2.queues[key] && self2.queues[key].length === 0) {
            delete self2.queues[key];
          }
          if (self2.domainReentrant) {
            delete self2.domains[key];
          }
        }
        if (!resolved) {
          if (!deferred) {
            if (typeof cb === "function") {
              cb(err, ret);
            }
          } else {
            if (err) {
              deferredReject(err);
            } else {
              deferredResolve(ret);
            }
          }
          resolved = true;
        }
        if (locked) {
          if (!!self2.queues[key] && self2.queues[key].length > 0) {
            self2.queues[key].shift()();
          }
        }
      };
      var exec = function(locked) {
        if (resolved) {
          return done(locked);
        }
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        if (self2.domainReentrant && locked) {
          self2.domains[key] = process.domain;
        }
        if (fn.length === 1) {
          var called = false;
          fn(function(err, ret) {
            if (!called) {
              called = true;
              done(locked, err, ret);
            }
          });
        } else {
          self2._promiseTry(function() {
            return fn();
          }).then(function(ret) {
            done(locked, void 0, ret);
          }, function(error) {
            done(locked, error);
          });
        }
      };
      if (self2.domainReentrant && !!process.domain) {
        exec = process.domain.bind(exec);
      }
      if (!self2.queues[key]) {
        self2.queues[key] = [];
        exec(true);
      } else if (self2.domainReentrant && !!process.domain && process.domain === self2.domains[key]) {
        exec(false);
      } else if (self2.queues[key].length >= self2.maxPending) {
        done(false, new Error("Too much pending tasks"));
      } else {
        var taskFn = function() {
          exec(true);
        };
        if (opts.skipQueue) {
          self2.queues[key].unshift(taskFn);
        } else {
          self2.queues[key].push(taskFn);
        }
        var timeout = opts.timeout || self2.timeout;
        if (timeout) {
          timer = setTimeout(function() {
            timer = null;
            done(false, new Error("async-lock timed out"));
          }, timeout);
        }
      }
      var maxOccupationTime = opts.maxOccupationTime || self2.maxOccupationTime;
      if (maxOccupationTime) {
        occupationTimer = setTimeout(function() {
          if (!!self2.queues[key]) {
            done(false, new Error("Maximum occupation time is exceeded"));
          }
        }, maxOccupationTime);
      }
      if (deferred) {
        return deferred;
      }
    };
    AsyncLock.prototype._acquireBatch = function(keys, fn, cb, opts) {
      if (typeof cb !== "function") {
        opts = cb;
        cb = null;
      }
      var self2 = this;
      var getFn = function(key, fn2) {
        return function(cb2) {
          self2.acquire(key, fn2, cb2, opts);
        };
      };
      var fnx = fn;
      keys.reverse().forEach(function(key) {
        fnx = getFn(key, fnx);
      });
      if (typeof cb === "function") {
        fnx(cb);
      } else {
        return new this.Promise(function(resolve, reject) {
          if (fnx.length === 1) {
            fnx(function(err, ret) {
              if (err) {
                reject(err);
              } else {
                resolve(ret);
              }
            });
          } else {
            resolve(fnx());
          }
        });
      }
    };
    AsyncLock.prototype.isBusy = function(key) {
      if (!key) {
        return Object.keys(this.queues).length > 0;
      } else {
        return !!this.queues[key];
      }
    };
    AsyncLock.prototype._promiseTry = function(fn) {
      try {
        return this.Promise.resolve(fn());
      } catch (e) {
        return this.Promise.reject(e);
      }
    };
    module2.exports = AsyncLock;
  }
});

// node_modules/.pnpm/async-lock@1.3.0/node_modules/async-lock/index.js
var require_async_lock = __commonJS({
  "node_modules/.pnpm/async-lock@1.3.0/node_modules/async-lock/index.js"(exports2, module2) {
    "use strict";
    module2.exports = require_lib();
  }
});

// node_modules/.pnpm/inherits@2.0.4/node_modules/inherits/inherits_browser.js
var require_inherits_browser = __commonJS({
  "node_modules/.pnpm/inherits@2.0.4/node_modules/inherits/inherits_browser.js"(exports2, module2) {
    if (typeof Object.create === "function") {
      module2.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
              value: ctor,
              enumerable: false,
              writable: true,
              configurable: true
            }
          });
        }
      };
    } else {
      module2.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          var TempCtor = function() {
          };
          TempCtor.prototype = superCtor.prototype;
          ctor.prototype = new TempCtor();
          ctor.prototype.constructor = ctor;
        }
      };
    }
  }
});

// node_modules/.pnpm/inherits@2.0.4/node_modules/inherits/inherits.js
var require_inherits = __commonJS({
  "node_modules/.pnpm/inherits@2.0.4/node_modules/inherits/inherits.js"(exports2, module2) {
    try {
      util = __require("util");
      if (typeof util.inherits !== "function")
        throw "";
      module2.exports = util.inherits;
    } catch (e) {
      module2.exports = require_inherits_browser();
    }
    var util;
  }
});

// node_modules/.pnpm/safe-buffer@5.2.1/node_modules/safe-buffer/index.js
var require_safe_buffer = __commonJS({
  "node_modules/.pnpm/safe-buffer@5.2.1/node_modules/safe-buffer/index.js"(exports2, module2) {
    var buffer = __require("buffer");
    var Buffer2 = buffer.Buffer;
    function copyProps(src, dst) {
      for (var key in src) {
        dst[key] = src[key];
      }
    }
    if (Buffer2.from && Buffer2.alloc && Buffer2.allocUnsafe && Buffer2.allocUnsafeSlow) {
      module2.exports = buffer;
    } else {
      copyProps(buffer, exports2);
      exports2.Buffer = SafeBuffer;
    }
    function SafeBuffer(arg2, encodingOrOffset, length) {
      return Buffer2(arg2, encodingOrOffset, length);
    }
    SafeBuffer.prototype = Object.create(Buffer2.prototype);
    copyProps(Buffer2, SafeBuffer);
    SafeBuffer.from = function(arg2, encodingOrOffset, length) {
      if (typeof arg2 === "number") {
        throw new TypeError("Argument must not be a number");
      }
      return Buffer2(arg2, encodingOrOffset, length);
    };
    SafeBuffer.alloc = function(size, fill, encoding) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      var buf = Buffer2(size);
      if (fill !== void 0) {
        if (typeof encoding === "string") {
          buf.fill(fill, encoding);
        } else {
          buf.fill(fill);
        }
      } else {
        buf.fill(0);
      }
      return buf;
    };
    SafeBuffer.allocUnsafe = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return Buffer2(size);
    };
    SafeBuffer.allocUnsafeSlow = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return buffer.SlowBuffer(size);
    };
  }
});

// node_modules/.pnpm/sha.js@2.4.11/node_modules/sha.js/hash.js
var require_hash = __commonJS({
  "node_modules/.pnpm/sha.js@2.4.11/node_modules/sha.js/hash.js"(exports2, module2) {
    var Buffer2 = require_safe_buffer().Buffer;
    function Hash(blockSize, finalSize) {
      this._block = Buffer2.alloc(blockSize);
      this._finalSize = finalSize;
      this._blockSize = blockSize;
      this._len = 0;
    }
    Hash.prototype.update = function(data, enc) {
      if (typeof data === "string") {
        enc = enc || "utf8";
        data = Buffer2.from(data, enc);
      }
      var block = this._block;
      var blockSize = this._blockSize;
      var length = data.length;
      var accum = this._len;
      for (var offset = 0; offset < length; ) {
        var assigned = accum % blockSize;
        var remainder = Math.min(length - offset, blockSize - assigned);
        for (var i2 = 0; i2 < remainder; i2++) {
          block[assigned + i2] = data[offset + i2];
        }
        accum += remainder;
        offset += remainder;
        if (accum % blockSize === 0) {
          this._update(block);
        }
      }
      this._len += length;
      return this;
    };
    Hash.prototype.digest = function(enc) {
      var rem = this._len % this._blockSize;
      this._block[rem] = 128;
      this._block.fill(0, rem + 1);
      if (rem >= this._finalSize) {
        this._update(this._block);
        this._block.fill(0);
      }
      var bits = this._len * 8;
      if (bits <= 4294967295) {
        this._block.writeUInt32BE(bits, this._blockSize - 4);
      } else {
        var lowBits = (bits & 4294967295) >>> 0;
        var highBits = (bits - lowBits) / 4294967296;
        this._block.writeUInt32BE(highBits, this._blockSize - 8);
        this._block.writeUInt32BE(lowBits, this._blockSize - 4);
      }
      this._update(this._block);
      var hash = this._hash();
      return enc ? hash.toString(enc) : hash;
    };
    Hash.prototype._update = function() {
      throw new Error("_update must be implemented by subclass");
    };
    module2.exports = Hash;
  }
});

// node_modules/.pnpm/sha.js@2.4.11/node_modules/sha.js/sha1.js
var require_sha1 = __commonJS({
  "node_modules/.pnpm/sha.js@2.4.11/node_modules/sha.js/sha1.js"(exports2, module2) {
    var inherits = require_inherits();
    var Hash = require_hash();
    var Buffer2 = require_safe_buffer().Buffer;
    var K = [
      1518500249,
      1859775393,
      2400959708 | 0,
      3395469782 | 0
    ];
    var W = new Array(80);
    function Sha1() {
      this.init();
      this._w = W;
      Hash.call(this, 64, 56);
    }
    inherits(Sha1, Hash);
    Sha1.prototype.init = function() {
      this._a = 1732584193;
      this._b = 4023233417;
      this._c = 2562383102;
      this._d = 271733878;
      this._e = 3285377520;
      return this;
    };
    function rotl1(num) {
      return num << 1 | num >>> 31;
    }
    function rotl5(num) {
      return num << 5 | num >>> 27;
    }
    function rotl30(num) {
      return num << 30 | num >>> 2;
    }
    function ft(s, b, c, d) {
      if (s === 0)
        return b & c | ~b & d;
      if (s === 2)
        return b & c | b & d | c & d;
      return b ^ c ^ d;
    }
    Sha1.prototype._update = function(M) {
      var W2 = this._w;
      var a = this._a | 0;
      var b = this._b | 0;
      var c = this._c | 0;
      var d = this._d | 0;
      var e = this._e | 0;
      for (var i2 = 0; i2 < 16; ++i2)
        W2[i2] = M.readInt32BE(i2 * 4);
      for (; i2 < 80; ++i2)
        W2[i2] = rotl1(W2[i2 - 3] ^ W2[i2 - 8] ^ W2[i2 - 14] ^ W2[i2 - 16]);
      for (var j = 0; j < 80; ++j) {
        var s = ~~(j / 20);
        var t = rotl5(a) + ft(s, b, c, d) + e + W2[j] + K[s] | 0;
        e = d;
        d = c;
        c = rotl30(b);
        b = a;
        a = t;
      }
      this._a = a + this._a | 0;
      this._b = b + this._b | 0;
      this._c = c + this._c | 0;
      this._d = d + this._d | 0;
      this._e = e + this._e | 0;
    };
    Sha1.prototype._hash = function() {
      var H = Buffer2.allocUnsafe(20);
      H.writeInt32BE(this._a | 0, 0);
      H.writeInt32BE(this._b | 0, 4);
      H.writeInt32BE(this._c | 0, 8);
      H.writeInt32BE(this._d | 0, 12);
      H.writeInt32BE(this._e | 0, 16);
      return H;
    };
    module2.exports = Sha1;
  }
});

// node_modules/.pnpm/crc-32@1.2.0/node_modules/crc-32/crc32.js
var require_crc32 = __commonJS({
  "node_modules/.pnpm/crc-32@1.2.0/node_modules/crc-32/crc32.js"(exports2) {
    var CRC32;
    (function(factory) {
      if (typeof DO_NOT_EXPORT_CRC === "undefined") {
        if (typeof exports2 === "object") {
          factory(exports2);
        } else if (typeof define === "function" && define.amd) {
          define(function() {
            var module3 = {};
            factory(module3);
            return module3;
          });
        } else {
          factory(CRC32 = {});
        }
      } else {
        factory(CRC32 = {});
      }
    })(function(CRC322) {
      CRC322.version = "1.2.0";
      function signed_crc_table() {
        var c = 0, table = new Array(256);
        for (var n = 0; n != 256; ++n) {
          c = n;
          c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
          c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
          c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
          c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
          c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
          c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
          c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
          c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
          table[n] = c;
        }
        return typeof Int32Array !== "undefined" ? new Int32Array(table) : table;
      }
      var T = signed_crc_table();
      function crc32_bstr(bstr, seed) {
        var C = seed ^ -1, L = bstr.length - 1;
        for (var i2 = 0; i2 < L; ) {
          C = C >>> 8 ^ T[(C ^ bstr.charCodeAt(i2++)) & 255];
          C = C >>> 8 ^ T[(C ^ bstr.charCodeAt(i2++)) & 255];
        }
        if (i2 === L)
          C = C >>> 8 ^ T[(C ^ bstr.charCodeAt(i2)) & 255];
        return C ^ -1;
      }
      function crc32_buf(buf, seed) {
        if (buf.length > 1e4)
          return crc32_buf_8(buf, seed);
        var C = seed ^ -1, L = buf.length - 3;
        for (var i2 = 0; i2 < L; ) {
          C = C >>> 8 ^ T[(C ^ buf[i2++]) & 255];
          C = C >>> 8 ^ T[(C ^ buf[i2++]) & 255];
          C = C >>> 8 ^ T[(C ^ buf[i2++]) & 255];
          C = C >>> 8 ^ T[(C ^ buf[i2++]) & 255];
        }
        while (i2 < L + 3)
          C = C >>> 8 ^ T[(C ^ buf[i2++]) & 255];
        return C ^ -1;
      }
      function crc32_buf_8(buf, seed) {
        var C = seed ^ -1, L = buf.length - 7;
        for (var i2 = 0; i2 < L; ) {
          C = C >>> 8 ^ T[(C ^ buf[i2++]) & 255];
          C = C >>> 8 ^ T[(C ^ buf[i2++]) & 255];
          C = C >>> 8 ^ T[(C ^ buf[i2++]) & 255];
          C = C >>> 8 ^ T[(C ^ buf[i2++]) & 255];
          C = C >>> 8 ^ T[(C ^ buf[i2++]) & 255];
          C = C >>> 8 ^ T[(C ^ buf[i2++]) & 255];
          C = C >>> 8 ^ T[(C ^ buf[i2++]) & 255];
          C = C >>> 8 ^ T[(C ^ buf[i2++]) & 255];
        }
        while (i2 < L + 7)
          C = C >>> 8 ^ T[(C ^ buf[i2++]) & 255];
        return C ^ -1;
      }
      function crc32_str(str, seed) {
        var C = seed ^ -1;
        for (var i2 = 0, L = str.length, c, d; i2 < L; ) {
          c = str.charCodeAt(i2++);
          if (c < 128) {
            C = C >>> 8 ^ T[(C ^ c) & 255];
          } else if (c < 2048) {
            C = C >>> 8 ^ T[(C ^ (192 | c >> 6 & 31)) & 255];
            C = C >>> 8 ^ T[(C ^ (128 | c & 63)) & 255];
          } else if (c >= 55296 && c < 57344) {
            c = (c & 1023) + 64;
            d = str.charCodeAt(i2++) & 1023;
            C = C >>> 8 ^ T[(C ^ (240 | c >> 8 & 7)) & 255];
            C = C >>> 8 ^ T[(C ^ (128 | c >> 2 & 63)) & 255];
            C = C >>> 8 ^ T[(C ^ (128 | d >> 6 & 15 | (c & 3) << 4)) & 255];
            C = C >>> 8 ^ T[(C ^ (128 | d & 63)) & 255];
          } else {
            C = C >>> 8 ^ T[(C ^ (224 | c >> 12 & 15)) & 255];
            C = C >>> 8 ^ T[(C ^ (128 | c >> 6 & 63)) & 255];
            C = C >>> 8 ^ T[(C ^ (128 | c & 63)) & 255];
          }
        }
        return C ^ -1;
      }
      CRC322.table = T;
      CRC322.bstr = crc32_bstr;
      CRC322.buf = crc32_buf;
      CRC322.str = crc32_str;
    });
  }
});

// node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/utils/common.js
var require_common = __commonJS({
  "node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/utils/common.js"(exports2) {
    "use strict";
    var TYPED_OK = typeof Uint8Array !== "undefined" && typeof Uint16Array !== "undefined" && typeof Int32Array !== "undefined";
    function _has(obj, key) {
      return Object.prototype.hasOwnProperty.call(obj, key);
    }
    exports2.assign = function(obj) {
      var sources = Array.prototype.slice.call(arguments, 1);
      while (sources.length) {
        var source = sources.shift();
        if (!source) {
          continue;
        }
        if (typeof source !== "object") {
          throw new TypeError(source + "must be non-object");
        }
        for (var p in source) {
          if (_has(source, p)) {
            obj[p] = source[p];
          }
        }
      }
      return obj;
    };
    exports2.shrinkBuf = function(buf, size) {
      if (buf.length === size) {
        return buf;
      }
      if (buf.subarray) {
        return buf.subarray(0, size);
      }
      buf.length = size;
      return buf;
    };
    var fnTyped = {
      arraySet: function(dest, src, src_offs, len, dest_offs) {
        if (src.subarray && dest.subarray) {
          dest.set(src.subarray(src_offs, src_offs + len), dest_offs);
          return;
        }
        for (var i2 = 0; i2 < len; i2++) {
          dest[dest_offs + i2] = src[src_offs + i2];
        }
      },
      flattenChunks: function(chunks) {
        var i2, l, len, pos, chunk, result;
        len = 0;
        for (i2 = 0, l = chunks.length; i2 < l; i2++) {
          len += chunks[i2].length;
        }
        result = new Uint8Array(len);
        pos = 0;
        for (i2 = 0, l = chunks.length; i2 < l; i2++) {
          chunk = chunks[i2];
          result.set(chunk, pos);
          pos += chunk.length;
        }
        return result;
      }
    };
    var fnUntyped = {
      arraySet: function(dest, src, src_offs, len, dest_offs) {
        for (var i2 = 0; i2 < len; i2++) {
          dest[dest_offs + i2] = src[src_offs + i2];
        }
      },
      flattenChunks: function(chunks) {
        return [].concat.apply([], chunks);
      }
    };
    exports2.setTyped = function(on) {
      if (on) {
        exports2.Buf8 = Uint8Array;
        exports2.Buf16 = Uint16Array;
        exports2.Buf32 = Int32Array;
        exports2.assign(exports2, fnTyped);
      } else {
        exports2.Buf8 = Array;
        exports2.Buf16 = Array;
        exports2.Buf32 = Array;
        exports2.assign(exports2, fnUntyped);
      }
    };
    exports2.setTyped(TYPED_OK);
  }
});

// node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/zlib/trees.js
var require_trees = __commonJS({
  "node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/zlib/trees.js"(exports2) {
    "use strict";
    var utils = require_common();
    var Z_FIXED = 4;
    var Z_BINARY = 0;
    var Z_TEXT = 1;
    var Z_UNKNOWN = 2;
    function zero(buf) {
      var len = buf.length;
      while (--len >= 0) {
        buf[len] = 0;
      }
    }
    var STORED_BLOCK = 0;
    var STATIC_TREES = 1;
    var DYN_TREES = 2;
    var MIN_MATCH = 3;
    var MAX_MATCH = 258;
    var LENGTH_CODES = 29;
    var LITERALS = 256;
    var L_CODES = LITERALS + 1 + LENGTH_CODES;
    var D_CODES = 30;
    var BL_CODES = 19;
    var HEAP_SIZE = 2 * L_CODES + 1;
    var MAX_BITS = 15;
    var Buf_size = 16;
    var MAX_BL_BITS = 7;
    var END_BLOCK = 256;
    var REP_3_6 = 16;
    var REPZ_3_10 = 17;
    var REPZ_11_138 = 18;
    var extra_lbits = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0];
    var extra_dbits = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13];
    var extra_blbits = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7];
    var bl_order = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
    var DIST_CODE_LEN = 512;
    var static_ltree = new Array((L_CODES + 2) * 2);
    zero(static_ltree);
    var static_dtree = new Array(D_CODES * 2);
    zero(static_dtree);
    var _dist_code = new Array(DIST_CODE_LEN);
    zero(_dist_code);
    var _length_code = new Array(MAX_MATCH - MIN_MATCH + 1);
    zero(_length_code);
    var base_length = new Array(LENGTH_CODES);
    zero(base_length);
    var base_dist = new Array(D_CODES);
    zero(base_dist);
    function StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {
      this.static_tree = static_tree;
      this.extra_bits = extra_bits;
      this.extra_base = extra_base;
      this.elems = elems;
      this.max_length = max_length;
      this.has_stree = static_tree && static_tree.length;
    }
    var static_l_desc;
    var static_d_desc;
    var static_bl_desc;
    function TreeDesc(dyn_tree, stat_desc) {
      this.dyn_tree = dyn_tree;
      this.max_code = 0;
      this.stat_desc = stat_desc;
    }
    function d_code(dist) {
      return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
    }
    function put_short(s, w) {
      s.pending_buf[s.pending++] = w & 255;
      s.pending_buf[s.pending++] = w >>> 8 & 255;
    }
    function send_bits(s, value2, length) {
      if (s.bi_valid > Buf_size - length) {
        s.bi_buf |= value2 << s.bi_valid & 65535;
        put_short(s, s.bi_buf);
        s.bi_buf = value2 >> Buf_size - s.bi_valid;
        s.bi_valid += length - Buf_size;
      } else {
        s.bi_buf |= value2 << s.bi_valid & 65535;
        s.bi_valid += length;
      }
    }
    function send_code(s, c, tree) {
      send_bits(s, tree[c * 2], tree[c * 2 + 1]);
    }
    function bi_reverse(code, len) {
      var res = 0;
      do {
        res |= code & 1;
        code >>>= 1;
        res <<= 1;
      } while (--len > 0);
      return res >>> 1;
    }
    function bi_flush(s) {
      if (s.bi_valid === 16) {
        put_short(s, s.bi_buf);
        s.bi_buf = 0;
        s.bi_valid = 0;
      } else if (s.bi_valid >= 8) {
        s.pending_buf[s.pending++] = s.bi_buf & 255;
        s.bi_buf >>= 8;
        s.bi_valid -= 8;
      }
    }
    function gen_bitlen(s, desc) {
      var tree = desc.dyn_tree;
      var max_code = desc.max_code;
      var stree = desc.stat_desc.static_tree;
      var has_stree = desc.stat_desc.has_stree;
      var extra = desc.stat_desc.extra_bits;
      var base2 = desc.stat_desc.extra_base;
      var max_length = desc.stat_desc.max_length;
      var h;
      var n, m;
      var bits;
      var xbits;
      var f;
      var overflow = 0;
      for (bits = 0; bits <= MAX_BITS; bits++) {
        s.bl_count[bits] = 0;
      }
      tree[s.heap[s.heap_max] * 2 + 1] = 0;
      for (h = s.heap_max + 1; h < HEAP_SIZE; h++) {
        n = s.heap[h];
        bits = tree[tree[n * 2 + 1] * 2 + 1] + 1;
        if (bits > max_length) {
          bits = max_length;
          overflow++;
        }
        tree[n * 2 + 1] = bits;
        if (n > max_code) {
          continue;
        }
        s.bl_count[bits]++;
        xbits = 0;
        if (n >= base2) {
          xbits = extra[n - base2];
        }
        f = tree[n * 2];
        s.opt_len += f * (bits + xbits);
        if (has_stree) {
          s.static_len += f * (stree[n * 2 + 1] + xbits);
        }
      }
      if (overflow === 0) {
        return;
      }
      do {
        bits = max_length - 1;
        while (s.bl_count[bits] === 0) {
          bits--;
        }
        s.bl_count[bits]--;
        s.bl_count[bits + 1] += 2;
        s.bl_count[max_length]--;
        overflow -= 2;
      } while (overflow > 0);
      for (bits = max_length; bits !== 0; bits--) {
        n = s.bl_count[bits];
        while (n !== 0) {
          m = s.heap[--h];
          if (m > max_code) {
            continue;
          }
          if (tree[m * 2 + 1] !== bits) {
            s.opt_len += (bits - tree[m * 2 + 1]) * tree[m * 2];
            tree[m * 2 + 1] = bits;
          }
          n--;
        }
      }
    }
    function gen_codes(tree, max_code, bl_count) {
      var next_code = new Array(MAX_BITS + 1);
      var code = 0;
      var bits;
      var n;
      for (bits = 1; bits <= MAX_BITS; bits++) {
        next_code[bits] = code = code + bl_count[bits - 1] << 1;
      }
      for (n = 0; n <= max_code; n++) {
        var len = tree[n * 2 + 1];
        if (len === 0) {
          continue;
        }
        tree[n * 2] = bi_reverse(next_code[len]++, len);
      }
    }
    function tr_static_init() {
      var n;
      var bits;
      var length;
      var code;
      var dist;
      var bl_count = new Array(MAX_BITS + 1);
      length = 0;
      for (code = 0; code < LENGTH_CODES - 1; code++) {
        base_length[code] = length;
        for (n = 0; n < 1 << extra_lbits[code]; n++) {
          _length_code[length++] = code;
        }
      }
      _length_code[length - 1] = code;
      dist = 0;
      for (code = 0; code < 16; code++) {
        base_dist[code] = dist;
        for (n = 0; n < 1 << extra_dbits[code]; n++) {
          _dist_code[dist++] = code;
        }
      }
      dist >>= 7;
      for (; code < D_CODES; code++) {
        base_dist[code] = dist << 7;
        for (n = 0; n < 1 << extra_dbits[code] - 7; n++) {
          _dist_code[256 + dist++] = code;
        }
      }
      for (bits = 0; bits <= MAX_BITS; bits++) {
        bl_count[bits] = 0;
      }
      n = 0;
      while (n <= 143) {
        static_ltree[n * 2 + 1] = 8;
        n++;
        bl_count[8]++;
      }
      while (n <= 255) {
        static_ltree[n * 2 + 1] = 9;
        n++;
        bl_count[9]++;
      }
      while (n <= 279) {
        static_ltree[n * 2 + 1] = 7;
        n++;
        bl_count[7]++;
      }
      while (n <= 287) {
        static_ltree[n * 2 + 1] = 8;
        n++;
        bl_count[8]++;
      }
      gen_codes(static_ltree, L_CODES + 1, bl_count);
      for (n = 0; n < D_CODES; n++) {
        static_dtree[n * 2 + 1] = 5;
        static_dtree[n * 2] = bi_reverse(n, 5);
      }
      static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, LITERALS + 1, L_CODES, MAX_BITS);
      static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0, D_CODES, MAX_BITS);
      static_bl_desc = new StaticTreeDesc(new Array(0), extra_blbits, 0, BL_CODES, MAX_BL_BITS);
    }
    function init_block(s) {
      var n;
      for (n = 0; n < L_CODES; n++) {
        s.dyn_ltree[n * 2] = 0;
      }
      for (n = 0; n < D_CODES; n++) {
        s.dyn_dtree[n * 2] = 0;
      }
      for (n = 0; n < BL_CODES; n++) {
        s.bl_tree[n * 2] = 0;
      }
      s.dyn_ltree[END_BLOCK * 2] = 1;
      s.opt_len = s.static_len = 0;
      s.last_lit = s.matches = 0;
    }
    function bi_windup(s) {
      if (s.bi_valid > 8) {
        put_short(s, s.bi_buf);
      } else if (s.bi_valid > 0) {
        s.pending_buf[s.pending++] = s.bi_buf;
      }
      s.bi_buf = 0;
      s.bi_valid = 0;
    }
    function copy_block(s, buf, len, header) {
      bi_windup(s);
      if (header) {
        put_short(s, len);
        put_short(s, ~len);
      }
      utils.arraySet(s.pending_buf, s.window, buf, len, s.pending);
      s.pending += len;
    }
    function smaller(tree, n, m, depth) {
      var _n2 = n * 2;
      var _m2 = m * 2;
      return tree[_n2] < tree[_m2] || tree[_n2] === tree[_m2] && depth[n] <= depth[m];
    }
    function pqdownheap(s, tree, k) {
      var v = s.heap[k];
      var j = k << 1;
      while (j <= s.heap_len) {
        if (j < s.heap_len && smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) {
          j++;
        }
        if (smaller(tree, v, s.heap[j], s.depth)) {
          break;
        }
        s.heap[k] = s.heap[j];
        k = j;
        j <<= 1;
      }
      s.heap[k] = v;
    }
    function compress_block(s, ltree, dtree) {
      var dist;
      var lc;
      var lx = 0;
      var code;
      var extra;
      if (s.last_lit !== 0) {
        do {
          dist = s.pending_buf[s.d_buf + lx * 2] << 8 | s.pending_buf[s.d_buf + lx * 2 + 1];
          lc = s.pending_buf[s.l_buf + lx];
          lx++;
          if (dist === 0) {
            send_code(s, lc, ltree);
          } else {
            code = _length_code[lc];
            send_code(s, code + LITERALS + 1, ltree);
            extra = extra_lbits[code];
            if (extra !== 0) {
              lc -= base_length[code];
              send_bits(s, lc, extra);
            }
            dist--;
            code = d_code(dist);
            send_code(s, code, dtree);
            extra = extra_dbits[code];
            if (extra !== 0) {
              dist -= base_dist[code];
              send_bits(s, dist, extra);
            }
          }
        } while (lx < s.last_lit);
      }
      send_code(s, END_BLOCK, ltree);
    }
    function build_tree(s, desc) {
      var tree = desc.dyn_tree;
      var stree = desc.stat_desc.static_tree;
      var has_stree = desc.stat_desc.has_stree;
      var elems = desc.stat_desc.elems;
      var n, m;
      var max_code = -1;
      var node;
      s.heap_len = 0;
      s.heap_max = HEAP_SIZE;
      for (n = 0; n < elems; n++) {
        if (tree[n * 2] !== 0) {
          s.heap[++s.heap_len] = max_code = n;
          s.depth[n] = 0;
        } else {
          tree[n * 2 + 1] = 0;
        }
      }
      while (s.heap_len < 2) {
        node = s.heap[++s.heap_len] = max_code < 2 ? ++max_code : 0;
        tree[node * 2] = 1;
        s.depth[node] = 0;
        s.opt_len--;
        if (has_stree) {
          s.static_len -= stree[node * 2 + 1];
        }
      }
      desc.max_code = max_code;
      for (n = s.heap_len >> 1; n >= 1; n--) {
        pqdownheap(s, tree, n);
      }
      node = elems;
      do {
        n = s.heap[1];
        s.heap[1] = s.heap[s.heap_len--];
        pqdownheap(s, tree, 1);
        m = s.heap[1];
        s.heap[--s.heap_max] = n;
        s.heap[--s.heap_max] = m;
        tree[node * 2] = tree[n * 2] + tree[m * 2];
        s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
        tree[n * 2 + 1] = tree[m * 2 + 1] = node;
        s.heap[1] = node++;
        pqdownheap(s, tree, 1);
      } while (s.heap_len >= 2);
      s.heap[--s.heap_max] = s.heap[1];
      gen_bitlen(s, desc);
      gen_codes(tree, max_code, s.bl_count);
    }
    function scan_tree(s, tree, max_code) {
      var n;
      var prevlen = -1;
      var curlen;
      var nextlen = tree[0 * 2 + 1];
      var count = 0;
      var max_count = 7;
      var min_count = 4;
      if (nextlen === 0) {
        max_count = 138;
        min_count = 3;
      }
      tree[(max_code + 1) * 2 + 1] = 65535;
      for (n = 0; n <= max_code; n++) {
        curlen = nextlen;
        nextlen = tree[(n + 1) * 2 + 1];
        if (++count < max_count && curlen === nextlen) {
          continue;
        } else if (count < min_count) {
          s.bl_tree[curlen * 2] += count;
        } else if (curlen !== 0) {
          if (curlen !== prevlen) {
            s.bl_tree[curlen * 2]++;
          }
          s.bl_tree[REP_3_6 * 2]++;
        } else if (count <= 10) {
          s.bl_tree[REPZ_3_10 * 2]++;
        } else {
          s.bl_tree[REPZ_11_138 * 2]++;
        }
        count = 0;
        prevlen = curlen;
        if (nextlen === 0) {
          max_count = 138;
          min_count = 3;
        } else if (curlen === nextlen) {
          max_count = 6;
          min_count = 3;
        } else {
          max_count = 7;
          min_count = 4;
        }
      }
    }
    function send_tree(s, tree, max_code) {
      var n;
      var prevlen = -1;
      var curlen;
      var nextlen = tree[0 * 2 + 1];
      var count = 0;
      var max_count = 7;
      var min_count = 4;
      if (nextlen === 0) {
        max_count = 138;
        min_count = 3;
      }
      for (n = 0; n <= max_code; n++) {
        curlen = nextlen;
        nextlen = tree[(n + 1) * 2 + 1];
        if (++count < max_count && curlen === nextlen) {
          continue;
        } else if (count < min_count) {
          do {
            send_code(s, curlen, s.bl_tree);
          } while (--count !== 0);
        } else if (curlen !== 0) {
          if (curlen !== prevlen) {
            send_code(s, curlen, s.bl_tree);
            count--;
          }
          send_code(s, REP_3_6, s.bl_tree);
          send_bits(s, count - 3, 2);
        } else if (count <= 10) {
          send_code(s, REPZ_3_10, s.bl_tree);
          send_bits(s, count - 3, 3);
        } else {
          send_code(s, REPZ_11_138, s.bl_tree);
          send_bits(s, count - 11, 7);
        }
        count = 0;
        prevlen = curlen;
        if (nextlen === 0) {
          max_count = 138;
          min_count = 3;
        } else if (curlen === nextlen) {
          max_count = 6;
          min_count = 3;
        } else {
          max_count = 7;
          min_count = 4;
        }
      }
    }
    function build_bl_tree(s) {
      var max_blindex;
      scan_tree(s, s.dyn_ltree, s.l_desc.max_code);
      scan_tree(s, s.dyn_dtree, s.d_desc.max_code);
      build_tree(s, s.bl_desc);
      for (max_blindex = BL_CODES - 1; max_blindex >= 3; max_blindex--) {
        if (s.bl_tree[bl_order[max_blindex] * 2 + 1] !== 0) {
          break;
        }
      }
      s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
      return max_blindex;
    }
    function send_all_trees(s, lcodes, dcodes, blcodes) {
      var rank;
      send_bits(s, lcodes - 257, 5);
      send_bits(s, dcodes - 1, 5);
      send_bits(s, blcodes - 4, 4);
      for (rank = 0; rank < blcodes; rank++) {
        send_bits(s, s.bl_tree[bl_order[rank] * 2 + 1], 3);
      }
      send_tree(s, s.dyn_ltree, lcodes - 1);
      send_tree(s, s.dyn_dtree, dcodes - 1);
    }
    function detect_data_type(s) {
      var black_mask = 4093624447;
      var n;
      for (n = 0; n <= 31; n++, black_mask >>>= 1) {
        if (black_mask & 1 && s.dyn_ltree[n * 2] !== 0) {
          return Z_BINARY;
        }
      }
      if (s.dyn_ltree[9 * 2] !== 0 || s.dyn_ltree[10 * 2] !== 0 || s.dyn_ltree[13 * 2] !== 0) {
        return Z_TEXT;
      }
      for (n = 32; n < LITERALS; n++) {
        if (s.dyn_ltree[n * 2] !== 0) {
          return Z_TEXT;
        }
      }
      return Z_BINARY;
    }
    var static_init_done = false;
    function _tr_init(s) {
      if (!static_init_done) {
        tr_static_init();
        static_init_done = true;
      }
      s.l_desc = new TreeDesc(s.dyn_ltree, static_l_desc);
      s.d_desc = new TreeDesc(s.dyn_dtree, static_d_desc);
      s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc);
      s.bi_buf = 0;
      s.bi_valid = 0;
      init_block(s);
    }
    function _tr_stored_block(s, buf, stored_len, last) {
      send_bits(s, (STORED_BLOCK << 1) + (last ? 1 : 0), 3);
      copy_block(s, buf, stored_len, true);
    }
    function _tr_align(s) {
      send_bits(s, STATIC_TREES << 1, 3);
      send_code(s, END_BLOCK, static_ltree);
      bi_flush(s);
    }
    function _tr_flush_block(s, buf, stored_len, last) {
      var opt_lenb, static_lenb;
      var max_blindex = 0;
      if (s.level > 0) {
        if (s.strm.data_type === Z_UNKNOWN) {
          s.strm.data_type = detect_data_type(s);
        }
        build_tree(s, s.l_desc);
        build_tree(s, s.d_desc);
        max_blindex = build_bl_tree(s);
        opt_lenb = s.opt_len + 3 + 7 >>> 3;
        static_lenb = s.static_len + 3 + 7 >>> 3;
        if (static_lenb <= opt_lenb) {
          opt_lenb = static_lenb;
        }
      } else {
        opt_lenb = static_lenb = stored_len + 5;
      }
      if (stored_len + 4 <= opt_lenb && buf !== -1) {
        _tr_stored_block(s, buf, stored_len, last);
      } else if (s.strategy === Z_FIXED || static_lenb === opt_lenb) {
        send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3);
        compress_block(s, static_ltree, static_dtree);
      } else {
        send_bits(s, (DYN_TREES << 1) + (last ? 1 : 0), 3);
        send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1);
        compress_block(s, s.dyn_ltree, s.dyn_dtree);
      }
      init_block(s);
      if (last) {
        bi_windup(s);
      }
    }
    function _tr_tally(s, dist, lc) {
      s.pending_buf[s.d_buf + s.last_lit * 2] = dist >>> 8 & 255;
      s.pending_buf[s.d_buf + s.last_lit * 2 + 1] = dist & 255;
      s.pending_buf[s.l_buf + s.last_lit] = lc & 255;
      s.last_lit++;
      if (dist === 0) {
        s.dyn_ltree[lc * 2]++;
      } else {
        s.matches++;
        dist--;
        s.dyn_ltree[(_length_code[lc] + LITERALS + 1) * 2]++;
        s.dyn_dtree[d_code(dist) * 2]++;
      }
      return s.last_lit === s.lit_bufsize - 1;
    }
    exports2._tr_init = _tr_init;
    exports2._tr_stored_block = _tr_stored_block;
    exports2._tr_flush_block = _tr_flush_block;
    exports2._tr_tally = _tr_tally;
    exports2._tr_align = _tr_align;
  }
});

// node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/zlib/adler32.js
var require_adler32 = __commonJS({
  "node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/zlib/adler32.js"(exports2, module2) {
    "use strict";
    function adler32(adler, buf, len, pos) {
      var s1 = adler & 65535 | 0, s2 = adler >>> 16 & 65535 | 0, n = 0;
      while (len !== 0) {
        n = len > 2e3 ? 2e3 : len;
        len -= n;
        do {
          s1 = s1 + buf[pos++] | 0;
          s2 = s2 + s1 | 0;
        } while (--n);
        s1 %= 65521;
        s2 %= 65521;
      }
      return s1 | s2 << 16 | 0;
    }
    module2.exports = adler32;
  }
});

// node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/zlib/crc32.js
var require_crc322 = __commonJS({
  "node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/zlib/crc32.js"(exports2, module2) {
    "use strict";
    function makeTable() {
      var c, table = [];
      for (var n = 0; n < 256; n++) {
        c = n;
        for (var k = 0; k < 8; k++) {
          c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
        }
        table[n] = c;
      }
      return table;
    }
    var crcTable = makeTable();
    function crc32(crc, buf, len, pos) {
      var t = crcTable, end = pos + len;
      crc ^= -1;
      for (var i2 = pos; i2 < end; i2++) {
        crc = crc >>> 8 ^ t[(crc ^ buf[i2]) & 255];
      }
      return crc ^ -1;
    }
    module2.exports = crc32;
  }
});

// node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/zlib/messages.js
var require_messages = __commonJS({
  "node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/zlib/messages.js"(exports2, module2) {
    "use strict";
    module2.exports = {
      2: "need dictionary",
      1: "stream end",
      0: "",
      "-1": "file error",
      "-2": "stream error",
      "-3": "data error",
      "-4": "insufficient memory",
      "-5": "buffer error",
      "-6": "incompatible version"
    };
  }
});

// node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/zlib/deflate.js
var require_deflate = __commonJS({
  "node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/zlib/deflate.js"(exports2) {
    "use strict";
    var utils = require_common();
    var trees = require_trees();
    var adler32 = require_adler32();
    var crc32 = require_crc322();
    var msg = require_messages();
    var Z_NO_FLUSH = 0;
    var Z_PARTIAL_FLUSH = 1;
    var Z_FULL_FLUSH = 3;
    var Z_FINISH = 4;
    var Z_BLOCK = 5;
    var Z_OK = 0;
    var Z_STREAM_END = 1;
    var Z_STREAM_ERROR = -2;
    var Z_DATA_ERROR = -3;
    var Z_BUF_ERROR = -5;
    var Z_DEFAULT_COMPRESSION = -1;
    var Z_FILTERED = 1;
    var Z_HUFFMAN_ONLY = 2;
    var Z_RLE = 3;
    var Z_FIXED = 4;
    var Z_DEFAULT_STRATEGY = 0;
    var Z_UNKNOWN = 2;
    var Z_DEFLATED = 8;
    var MAX_MEM_LEVEL = 9;
    var MAX_WBITS = 15;
    var DEF_MEM_LEVEL = 8;
    var LENGTH_CODES = 29;
    var LITERALS = 256;
    var L_CODES = LITERALS + 1 + LENGTH_CODES;
    var D_CODES = 30;
    var BL_CODES = 19;
    var HEAP_SIZE = 2 * L_CODES + 1;
    var MAX_BITS = 15;
    var MIN_MATCH = 3;
    var MAX_MATCH = 258;
    var MIN_LOOKAHEAD = MAX_MATCH + MIN_MATCH + 1;
    var PRESET_DICT = 32;
    var INIT_STATE = 42;
    var EXTRA_STATE = 69;
    var NAME_STATE = 73;
    var COMMENT_STATE = 91;
    var HCRC_STATE = 103;
    var BUSY_STATE = 113;
    var FINISH_STATE = 666;
    var BS_NEED_MORE = 1;
    var BS_BLOCK_DONE = 2;
    var BS_FINISH_STARTED = 3;
    var BS_FINISH_DONE = 4;
    var OS_CODE = 3;
    function err(strm, errorCode) {
      strm.msg = msg[errorCode];
      return errorCode;
    }
    function rank(f) {
      return (f << 1) - (f > 4 ? 9 : 0);
    }
    function zero(buf) {
      var len = buf.length;
      while (--len >= 0) {
        buf[len] = 0;
      }
    }
    function flush_pending(strm) {
      var s = strm.state;
      var len = s.pending;
      if (len > strm.avail_out) {
        len = strm.avail_out;
      }
      if (len === 0) {
        return;
      }
      utils.arraySet(strm.output, s.pending_buf, s.pending_out, len, strm.next_out);
      strm.next_out += len;
      s.pending_out += len;
      strm.total_out += len;
      strm.avail_out -= len;
      s.pending -= len;
      if (s.pending === 0) {
        s.pending_out = 0;
      }
    }
    function flush_block_only(s, last) {
      trees._tr_flush_block(s, s.block_start >= 0 ? s.block_start : -1, s.strstart - s.block_start, last);
      s.block_start = s.strstart;
      flush_pending(s.strm);
    }
    function put_byte(s, b) {
      s.pending_buf[s.pending++] = b;
    }
    function putShortMSB(s, b) {
      s.pending_buf[s.pending++] = b >>> 8 & 255;
      s.pending_buf[s.pending++] = b & 255;
    }
    function read_buf(strm, buf, start, size) {
      var len = strm.avail_in;
      if (len > size) {
        len = size;
      }
      if (len === 0) {
        return 0;
      }
      strm.avail_in -= len;
      utils.arraySet(buf, strm.input, strm.next_in, len, start);
      if (strm.state.wrap === 1) {
        strm.adler = adler32(strm.adler, buf, len, start);
      } else if (strm.state.wrap === 2) {
        strm.adler = crc32(strm.adler, buf, len, start);
      }
      strm.next_in += len;
      strm.total_in += len;
      return len;
    }
    function longest_match(s, cur_match) {
      var chain_length = s.max_chain_length;
      var scan = s.strstart;
      var match;
      var len;
      var best_len = s.prev_length;
      var nice_match = s.nice_match;
      var limit = s.strstart > s.w_size - MIN_LOOKAHEAD ? s.strstart - (s.w_size - MIN_LOOKAHEAD) : 0;
      var _win = s.window;
      var wmask = s.w_mask;
      var prev = s.prev;
      var strend = s.strstart + MAX_MATCH;
      var scan_end1 = _win[scan + best_len - 1];
      var scan_end = _win[scan + best_len];
      if (s.prev_length >= s.good_match) {
        chain_length >>= 2;
      }
      if (nice_match > s.lookahead) {
        nice_match = s.lookahead;
      }
      do {
        match = cur_match;
        if (_win[match + best_len] !== scan_end || _win[match + best_len - 1] !== scan_end1 || _win[match] !== _win[scan] || _win[++match] !== _win[scan + 1]) {
          continue;
        }
        scan += 2;
        match++;
        do {
        } while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && scan < strend);
        len = MAX_MATCH - (strend - scan);
        scan = strend - MAX_MATCH;
        if (len > best_len) {
          s.match_start = cur_match;
          best_len = len;
          if (len >= nice_match) {
            break;
          }
          scan_end1 = _win[scan + best_len - 1];
          scan_end = _win[scan + best_len];
        }
      } while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0);
      if (best_len <= s.lookahead) {
        return best_len;
      }
      return s.lookahead;
    }
    function fill_window(s) {
      var _w_size = s.w_size;
      var p, n, m, more, str;
      do {
        more = s.window_size - s.lookahead - s.strstart;
        if (s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {
          utils.arraySet(s.window, s.window, _w_size, _w_size, 0);
          s.match_start -= _w_size;
          s.strstart -= _w_size;
          s.block_start -= _w_size;
          n = s.hash_size;
          p = n;
          do {
            m = s.head[--p];
            s.head[p] = m >= _w_size ? m - _w_size : 0;
          } while (--n);
          n = _w_size;
          p = n;
          do {
            m = s.prev[--p];
            s.prev[p] = m >= _w_size ? m - _w_size : 0;
          } while (--n);
          more += _w_size;
        }
        if (s.strm.avail_in === 0) {
          break;
        }
        n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more);
        s.lookahead += n;
        if (s.lookahead + s.insert >= MIN_MATCH) {
          str = s.strstart - s.insert;
          s.ins_h = s.window[str];
          s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + 1]) & s.hash_mask;
          while (s.insert) {
            s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask;
            s.prev[str & s.w_mask] = s.head[s.ins_h];
            s.head[s.ins_h] = str;
            str++;
            s.insert--;
            if (s.lookahead + s.insert < MIN_MATCH) {
              break;
            }
          }
        }
      } while (s.lookahead < MIN_LOOKAHEAD && s.strm.avail_in !== 0);
    }
    function deflate_stored(s, flush) {
      var max_block_size = 65535;
      if (max_block_size > s.pending_buf_size - 5) {
        max_block_size = s.pending_buf_size - 5;
      }
      for (; ; ) {
        if (s.lookahead <= 1) {
          fill_window(s);
          if (s.lookahead === 0 && flush === Z_NO_FLUSH) {
            return BS_NEED_MORE;
          }
          if (s.lookahead === 0) {
            break;
          }
        }
        s.strstart += s.lookahead;
        s.lookahead = 0;
        var max_start = s.block_start + max_block_size;
        if (s.strstart === 0 || s.strstart >= max_start) {
          s.lookahead = s.strstart - max_start;
          s.strstart = max_start;
          flush_block_only(s, false);
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
        }
        if (s.strstart - s.block_start >= s.w_size - MIN_LOOKAHEAD) {
          flush_block_only(s, false);
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
        }
      }
      s.insert = 0;
      if (flush === Z_FINISH) {
        flush_block_only(s, true);
        if (s.strm.avail_out === 0) {
          return BS_FINISH_STARTED;
        }
        return BS_FINISH_DONE;
      }
      if (s.strstart > s.block_start) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
      return BS_NEED_MORE;
    }
    function deflate_fast(s, flush) {
      var hash_head;
      var bflush;
      for (; ; ) {
        if (s.lookahead < MIN_LOOKAHEAD) {
          fill_window(s);
          if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
            return BS_NEED_MORE;
          }
          if (s.lookahead === 0) {
            break;
          }
        }
        hash_head = 0;
        if (s.lookahead >= MIN_MATCH) {
          s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = s.strstart;
        }
        if (hash_head !== 0 && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) {
          s.match_length = longest_match(s, hash_head);
        }
        if (s.match_length >= MIN_MATCH) {
          bflush = trees._tr_tally(s, s.strstart - s.match_start, s.match_length - MIN_MATCH);
          s.lookahead -= s.match_length;
          if (s.match_length <= s.max_lazy_match && s.lookahead >= MIN_MATCH) {
            s.match_length--;
            do {
              s.strstart++;
              s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
              hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
              s.head[s.ins_h] = s.strstart;
            } while (--s.match_length !== 0);
            s.strstart++;
          } else {
            s.strstart += s.match_length;
            s.match_length = 0;
            s.ins_h = s.window[s.strstart];
            s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + 1]) & s.hash_mask;
          }
        } else {
          bflush = trees._tr_tally(s, 0, s.window[s.strstart]);
          s.lookahead--;
          s.strstart++;
        }
        if (bflush) {
          flush_block_only(s, false);
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
        }
      }
      s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
      if (flush === Z_FINISH) {
        flush_block_only(s, true);
        if (s.strm.avail_out === 0) {
          return BS_FINISH_STARTED;
        }
        return BS_FINISH_DONE;
      }
      if (s.last_lit) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
      return BS_BLOCK_DONE;
    }
    function deflate_slow(s, flush) {
      var hash_head;
      var bflush;
      var max_insert;
      for (; ; ) {
        if (s.lookahead < MIN_LOOKAHEAD) {
          fill_window(s);
          if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
            return BS_NEED_MORE;
          }
          if (s.lookahead === 0) {
            break;
          }
        }
        hash_head = 0;
        if (s.lookahead >= MIN_MATCH) {
          s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = s.strstart;
        }
        s.prev_length = s.match_length;
        s.prev_match = s.match_start;
        s.match_length = MIN_MATCH - 1;
        if (hash_head !== 0 && s.prev_length < s.max_lazy_match && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) {
          s.match_length = longest_match(s, hash_head);
          if (s.match_length <= 5 && (s.strategy === Z_FILTERED || s.match_length === MIN_MATCH && s.strstart - s.match_start > 4096)) {
            s.match_length = MIN_MATCH - 1;
          }
        }
        if (s.prev_length >= MIN_MATCH && s.match_length <= s.prev_length) {
          max_insert = s.strstart + s.lookahead - MIN_MATCH;
          bflush = trees._tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - MIN_MATCH);
          s.lookahead -= s.prev_length - 1;
          s.prev_length -= 2;
          do {
            if (++s.strstart <= max_insert) {
              s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
              hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
              s.head[s.ins_h] = s.strstart;
            }
          } while (--s.prev_length !== 0);
          s.match_available = 0;
          s.match_length = MIN_MATCH - 1;
          s.strstart++;
          if (bflush) {
            flush_block_only(s, false);
            if (s.strm.avail_out === 0) {
              return BS_NEED_MORE;
            }
          }
        } else if (s.match_available) {
          bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1]);
          if (bflush) {
            flush_block_only(s, false);
          }
          s.strstart++;
          s.lookahead--;
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
        } else {
          s.match_available = 1;
          s.strstart++;
          s.lookahead--;
        }
      }
      if (s.match_available) {
        bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1]);
        s.match_available = 0;
      }
      s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
      if (flush === Z_FINISH) {
        flush_block_only(s, true);
        if (s.strm.avail_out === 0) {
          return BS_FINISH_STARTED;
        }
        return BS_FINISH_DONE;
      }
      if (s.last_lit) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
      return BS_BLOCK_DONE;
    }
    function deflate_rle(s, flush) {
      var bflush;
      var prev;
      var scan, strend;
      var _win = s.window;
      for (; ; ) {
        if (s.lookahead <= MAX_MATCH) {
          fill_window(s);
          if (s.lookahead <= MAX_MATCH && flush === Z_NO_FLUSH) {
            return BS_NEED_MORE;
          }
          if (s.lookahead === 0) {
            break;
          }
        }
        s.match_length = 0;
        if (s.lookahead >= MIN_MATCH && s.strstart > 0) {
          scan = s.strstart - 1;
          prev = _win[scan];
          if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
            strend = s.strstart + MAX_MATCH;
            do {
            } while (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && scan < strend);
            s.match_length = MAX_MATCH - (strend - scan);
            if (s.match_length > s.lookahead) {
              s.match_length = s.lookahead;
            }
          }
        }
        if (s.match_length >= MIN_MATCH) {
          bflush = trees._tr_tally(s, 1, s.match_length - MIN_MATCH);
          s.lookahead -= s.match_length;
          s.strstart += s.match_length;
          s.match_length = 0;
        } else {
          bflush = trees._tr_tally(s, 0, s.window[s.strstart]);
          s.lookahead--;
          s.strstart++;
        }
        if (bflush) {
          flush_block_only(s, false);
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
        }
      }
      s.insert = 0;
      if (flush === Z_FINISH) {
        flush_block_only(s, true);
        if (s.strm.avail_out === 0) {
          return BS_FINISH_STARTED;
        }
        return BS_FINISH_DONE;
      }
      if (s.last_lit) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
      return BS_BLOCK_DONE;
    }
    function deflate_huff(s, flush) {
      var bflush;
      for (; ; ) {
        if (s.lookahead === 0) {
          fill_window(s);
          if (s.lookahead === 0) {
            if (flush === Z_NO_FLUSH) {
              return BS_NEED_MORE;
            }
            break;
          }
        }
        s.match_length = 0;
        bflush = trees._tr_tally(s, 0, s.window[s.strstart]);
        s.lookahead--;
        s.strstart++;
        if (bflush) {
          flush_block_only(s, false);
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
        }
      }
      s.insert = 0;
      if (flush === Z_FINISH) {
        flush_block_only(s, true);
        if (s.strm.avail_out === 0) {
          return BS_FINISH_STARTED;
        }
        return BS_FINISH_DONE;
      }
      if (s.last_lit) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
      return BS_BLOCK_DONE;
    }
    function Config(good_length, max_lazy, nice_length, max_chain, func) {
      this.good_length = good_length;
      this.max_lazy = max_lazy;
      this.nice_length = nice_length;
      this.max_chain = max_chain;
      this.func = func;
    }
    var configuration_table;
    configuration_table = [
      new Config(0, 0, 0, 0, deflate_stored),
      new Config(4, 4, 8, 4, deflate_fast),
      new Config(4, 5, 16, 8, deflate_fast),
      new Config(4, 6, 32, 32, deflate_fast),
      new Config(4, 4, 16, 16, deflate_slow),
      new Config(8, 16, 32, 32, deflate_slow),
      new Config(8, 16, 128, 128, deflate_slow),
      new Config(8, 32, 128, 256, deflate_slow),
      new Config(32, 128, 258, 1024, deflate_slow),
      new Config(32, 258, 258, 4096, deflate_slow)
    ];
    function lm_init(s) {
      s.window_size = 2 * s.w_size;
      zero(s.head);
      s.max_lazy_match = configuration_table[s.level].max_lazy;
      s.good_match = configuration_table[s.level].good_length;
      s.nice_match = configuration_table[s.level].nice_length;
      s.max_chain_length = configuration_table[s.level].max_chain;
      s.strstart = 0;
      s.block_start = 0;
      s.lookahead = 0;
      s.insert = 0;
      s.match_length = s.prev_length = MIN_MATCH - 1;
      s.match_available = 0;
      s.ins_h = 0;
    }
    function DeflateState() {
      this.strm = null;
      this.status = 0;
      this.pending_buf = null;
      this.pending_buf_size = 0;
      this.pending_out = 0;
      this.pending = 0;
      this.wrap = 0;
      this.gzhead = null;
      this.gzindex = 0;
      this.method = Z_DEFLATED;
      this.last_flush = -1;
      this.w_size = 0;
      this.w_bits = 0;
      this.w_mask = 0;
      this.window = null;
      this.window_size = 0;
      this.prev = null;
      this.head = null;
      this.ins_h = 0;
      this.hash_size = 0;
      this.hash_bits = 0;
      this.hash_mask = 0;
      this.hash_shift = 0;
      this.block_start = 0;
      this.match_length = 0;
      this.prev_match = 0;
      this.match_available = 0;
      this.strstart = 0;
      this.match_start = 0;
      this.lookahead = 0;
      this.prev_length = 0;
      this.max_chain_length = 0;
      this.max_lazy_match = 0;
      this.level = 0;
      this.strategy = 0;
      this.good_match = 0;
      this.nice_match = 0;
      this.dyn_ltree = new utils.Buf16(HEAP_SIZE * 2);
      this.dyn_dtree = new utils.Buf16((2 * D_CODES + 1) * 2);
      this.bl_tree = new utils.Buf16((2 * BL_CODES + 1) * 2);
      zero(this.dyn_ltree);
      zero(this.dyn_dtree);
      zero(this.bl_tree);
      this.l_desc = null;
      this.d_desc = null;
      this.bl_desc = null;
      this.bl_count = new utils.Buf16(MAX_BITS + 1);
      this.heap = new utils.Buf16(2 * L_CODES + 1);
      zero(this.heap);
      this.heap_len = 0;
      this.heap_max = 0;
      this.depth = new utils.Buf16(2 * L_CODES + 1);
      zero(this.depth);
      this.l_buf = 0;
      this.lit_bufsize = 0;
      this.last_lit = 0;
      this.d_buf = 0;
      this.opt_len = 0;
      this.static_len = 0;
      this.matches = 0;
      this.insert = 0;
      this.bi_buf = 0;
      this.bi_valid = 0;
    }
    function deflateResetKeep(strm) {
      var s;
      if (!strm || !strm.state) {
        return err(strm, Z_STREAM_ERROR);
      }
      strm.total_in = strm.total_out = 0;
      strm.data_type = Z_UNKNOWN;
      s = strm.state;
      s.pending = 0;
      s.pending_out = 0;
      if (s.wrap < 0) {
        s.wrap = -s.wrap;
      }
      s.status = s.wrap ? INIT_STATE : BUSY_STATE;
      strm.adler = s.wrap === 2 ? 0 : 1;
      s.last_flush = Z_NO_FLUSH;
      trees._tr_init(s);
      return Z_OK;
    }
    function deflateReset(strm) {
      var ret = deflateResetKeep(strm);
      if (ret === Z_OK) {
        lm_init(strm.state);
      }
      return ret;
    }
    function deflateSetHeader(strm, head) {
      if (!strm || !strm.state) {
        return Z_STREAM_ERROR;
      }
      if (strm.state.wrap !== 2) {
        return Z_STREAM_ERROR;
      }
      strm.state.gzhead = head;
      return Z_OK;
    }
    function deflateInit2(strm, level, method, windowBits, memLevel, strategy) {
      if (!strm) {
        return Z_STREAM_ERROR;
      }
      var wrap = 1;
      if (level === Z_DEFAULT_COMPRESSION) {
        level = 6;
      }
      if (windowBits < 0) {
        wrap = 0;
        windowBits = -windowBits;
      } else if (windowBits > 15) {
        wrap = 2;
        windowBits -= 16;
      }
      if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== Z_DEFLATED || windowBits < 8 || windowBits > 15 || level < 0 || level > 9 || strategy < 0 || strategy > Z_FIXED) {
        return err(strm, Z_STREAM_ERROR);
      }
      if (windowBits === 8) {
        windowBits = 9;
      }
      var s = new DeflateState();
      strm.state = s;
      s.strm = strm;
      s.wrap = wrap;
      s.gzhead = null;
      s.w_bits = windowBits;
      s.w_size = 1 << s.w_bits;
      s.w_mask = s.w_size - 1;
      s.hash_bits = memLevel + 7;
      s.hash_size = 1 << s.hash_bits;
      s.hash_mask = s.hash_size - 1;
      s.hash_shift = ~~((s.hash_bits + MIN_MATCH - 1) / MIN_MATCH);
      s.window = new utils.Buf8(s.w_size * 2);
      s.head = new utils.Buf16(s.hash_size);
      s.prev = new utils.Buf16(s.w_size);
      s.lit_bufsize = 1 << memLevel + 6;
      s.pending_buf_size = s.lit_bufsize * 4;
      s.pending_buf = new utils.Buf8(s.pending_buf_size);
      s.d_buf = 1 * s.lit_bufsize;
      s.l_buf = (1 + 2) * s.lit_bufsize;
      s.level = level;
      s.strategy = strategy;
      s.method = method;
      return deflateReset(strm);
    }
    function deflateInit(strm, level) {
      return deflateInit2(strm, level, Z_DEFLATED, MAX_WBITS, DEF_MEM_LEVEL, Z_DEFAULT_STRATEGY);
    }
    function deflate(strm, flush) {
      var old_flush, s;
      var beg, val;
      if (!strm || !strm.state || flush > Z_BLOCK || flush < 0) {
        return strm ? err(strm, Z_STREAM_ERROR) : Z_STREAM_ERROR;
      }
      s = strm.state;
      if (!strm.output || !strm.input && strm.avail_in !== 0 || s.status === FINISH_STATE && flush !== Z_FINISH) {
        return err(strm, strm.avail_out === 0 ? Z_BUF_ERROR : Z_STREAM_ERROR);
      }
      s.strm = strm;
      old_flush = s.last_flush;
      s.last_flush = flush;
      if (s.status === INIT_STATE) {
        if (s.wrap === 2) {
          strm.adler = 0;
          put_byte(s, 31);
          put_byte(s, 139);
          put_byte(s, 8);
          if (!s.gzhead) {
            put_byte(s, 0);
            put_byte(s, 0);
            put_byte(s, 0);
            put_byte(s, 0);
            put_byte(s, 0);
            put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
            put_byte(s, OS_CODE);
            s.status = BUSY_STATE;
          } else {
            put_byte(s, (s.gzhead.text ? 1 : 0) + (s.gzhead.hcrc ? 2 : 0) + (!s.gzhead.extra ? 0 : 4) + (!s.gzhead.name ? 0 : 8) + (!s.gzhead.comment ? 0 : 16));
            put_byte(s, s.gzhead.time & 255);
            put_byte(s, s.gzhead.time >> 8 & 255);
            put_byte(s, s.gzhead.time >> 16 & 255);
            put_byte(s, s.gzhead.time >> 24 & 255);
            put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
            put_byte(s, s.gzhead.os & 255);
            if (s.gzhead.extra && s.gzhead.extra.length) {
              put_byte(s, s.gzhead.extra.length & 255);
              put_byte(s, s.gzhead.extra.length >> 8 & 255);
            }
            if (s.gzhead.hcrc) {
              strm.adler = crc32(strm.adler, s.pending_buf, s.pending, 0);
            }
            s.gzindex = 0;
            s.status = EXTRA_STATE;
          }
        } else {
          var header = Z_DEFLATED + (s.w_bits - 8 << 4) << 8;
          var level_flags = -1;
          if (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2) {
            level_flags = 0;
          } else if (s.level < 6) {
            level_flags = 1;
          } else if (s.level === 6) {
            level_flags = 2;
          } else {
            level_flags = 3;
          }
          header |= level_flags << 6;
          if (s.strstart !== 0) {
            header |= PRESET_DICT;
          }
          header += 31 - header % 31;
          s.status = BUSY_STATE;
          putShortMSB(s, header);
          if (s.strstart !== 0) {
            putShortMSB(s, strm.adler >>> 16);
            putShortMSB(s, strm.adler & 65535);
          }
          strm.adler = 1;
        }
      }
      if (s.status === EXTRA_STATE) {
        if (s.gzhead.extra) {
          beg = s.pending;
          while (s.gzindex < (s.gzhead.extra.length & 65535)) {
            if (s.pending === s.pending_buf_size) {
              if (s.gzhead.hcrc && s.pending > beg) {
                strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
              }
              flush_pending(strm);
              beg = s.pending;
              if (s.pending === s.pending_buf_size) {
                break;
              }
            }
            put_byte(s, s.gzhead.extra[s.gzindex] & 255);
            s.gzindex++;
          }
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          if (s.gzindex === s.gzhead.extra.length) {
            s.gzindex = 0;
            s.status = NAME_STATE;
          }
        } else {
          s.status = NAME_STATE;
        }
      }
      if (s.status === NAME_STATE) {
        if (s.gzhead.name) {
          beg = s.pending;
          do {
            if (s.pending === s.pending_buf_size) {
              if (s.gzhead.hcrc && s.pending > beg) {
                strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
              }
              flush_pending(strm);
              beg = s.pending;
              if (s.pending === s.pending_buf_size) {
                val = 1;
                break;
              }
            }
            if (s.gzindex < s.gzhead.name.length) {
              val = s.gzhead.name.charCodeAt(s.gzindex++) & 255;
            } else {
              val = 0;
            }
            put_byte(s, val);
          } while (val !== 0);
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          if (val === 0) {
            s.gzindex = 0;
            s.status = COMMENT_STATE;
          }
        } else {
          s.status = COMMENT_STATE;
        }
      }
      if (s.status === COMMENT_STATE) {
        if (s.gzhead.comment) {
          beg = s.pending;
          do {
            if (s.pending === s.pending_buf_size) {
              if (s.gzhead.hcrc && s.pending > beg) {
                strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
              }
              flush_pending(strm);
              beg = s.pending;
              if (s.pending === s.pending_buf_size) {
                val = 1;
                break;
              }
            }
            if (s.gzindex < s.gzhead.comment.length) {
              val = s.gzhead.comment.charCodeAt(s.gzindex++) & 255;
            } else {
              val = 0;
            }
            put_byte(s, val);
          } while (val !== 0);
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          if (val === 0) {
            s.status = HCRC_STATE;
          }
        } else {
          s.status = HCRC_STATE;
        }
      }
      if (s.status === HCRC_STATE) {
        if (s.gzhead.hcrc) {
          if (s.pending + 2 > s.pending_buf_size) {
            flush_pending(strm);
          }
          if (s.pending + 2 <= s.pending_buf_size) {
            put_byte(s, strm.adler & 255);
            put_byte(s, strm.adler >> 8 & 255);
            strm.adler = 0;
            s.status = BUSY_STATE;
          }
        } else {
          s.status = BUSY_STATE;
        }
      }
      if (s.pending !== 0) {
        flush_pending(strm);
        if (strm.avail_out === 0) {
          s.last_flush = -1;
          return Z_OK;
        }
      } else if (strm.avail_in === 0 && rank(flush) <= rank(old_flush) && flush !== Z_FINISH) {
        return err(strm, Z_BUF_ERROR);
      }
      if (s.status === FINISH_STATE && strm.avail_in !== 0) {
        return err(strm, Z_BUF_ERROR);
      }
      if (strm.avail_in !== 0 || s.lookahead !== 0 || flush !== Z_NO_FLUSH && s.status !== FINISH_STATE) {
        var bstate = s.strategy === Z_HUFFMAN_ONLY ? deflate_huff(s, flush) : s.strategy === Z_RLE ? deflate_rle(s, flush) : configuration_table[s.level].func(s, flush);
        if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) {
          s.status = FINISH_STATE;
        }
        if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {
          if (strm.avail_out === 0) {
            s.last_flush = -1;
          }
          return Z_OK;
        }
        if (bstate === BS_BLOCK_DONE) {
          if (flush === Z_PARTIAL_FLUSH) {
            trees._tr_align(s);
          } else if (flush !== Z_BLOCK) {
            trees._tr_stored_block(s, 0, 0, false);
            if (flush === Z_FULL_FLUSH) {
              zero(s.head);
              if (s.lookahead === 0) {
                s.strstart = 0;
                s.block_start = 0;
                s.insert = 0;
              }
            }
          }
          flush_pending(strm);
          if (strm.avail_out === 0) {
            s.last_flush = -1;
            return Z_OK;
          }
        }
      }
      if (flush !== Z_FINISH) {
        return Z_OK;
      }
      if (s.wrap <= 0) {
        return Z_STREAM_END;
      }
      if (s.wrap === 2) {
        put_byte(s, strm.adler & 255);
        put_byte(s, strm.adler >> 8 & 255);
        put_byte(s, strm.adler >> 16 & 255);
        put_byte(s, strm.adler >> 24 & 255);
        put_byte(s, strm.total_in & 255);
        put_byte(s, strm.total_in >> 8 & 255);
        put_byte(s, strm.total_in >> 16 & 255);
        put_byte(s, strm.total_in >> 24 & 255);
      } else {
        putShortMSB(s, strm.adler >>> 16);
        putShortMSB(s, strm.adler & 65535);
      }
      flush_pending(strm);
      if (s.wrap > 0) {
        s.wrap = -s.wrap;
      }
      return s.pending !== 0 ? Z_OK : Z_STREAM_END;
    }
    function deflateEnd(strm) {
      var status;
      if (!strm || !strm.state) {
        return Z_STREAM_ERROR;
      }
      status = strm.state.status;
      if (status !== INIT_STATE && status !== EXTRA_STATE && status !== NAME_STATE && status !== COMMENT_STATE && status !== HCRC_STATE && status !== BUSY_STATE && status !== FINISH_STATE) {
        return err(strm, Z_STREAM_ERROR);
      }
      strm.state = null;
      return status === BUSY_STATE ? err(strm, Z_DATA_ERROR) : Z_OK;
    }
    function deflateSetDictionary(strm, dictionary) {
      var dictLength = dictionary.length;
      var s;
      var str, n;
      var wrap;
      var avail;
      var next;
      var input;
      var tmpDict;
      if (!strm || !strm.state) {
        return Z_STREAM_ERROR;
      }
      s = strm.state;
      wrap = s.wrap;
      if (wrap === 2 || wrap === 1 && s.status !== INIT_STATE || s.lookahead) {
        return Z_STREAM_ERROR;
      }
      if (wrap === 1) {
        strm.adler = adler32(strm.adler, dictionary, dictLength, 0);
      }
      s.wrap = 0;
      if (dictLength >= s.w_size) {
        if (wrap === 0) {
          zero(s.head);
          s.strstart = 0;
          s.block_start = 0;
          s.insert = 0;
        }
        tmpDict = new utils.Buf8(s.w_size);
        utils.arraySet(tmpDict, dictionary, dictLength - s.w_size, s.w_size, 0);
        dictionary = tmpDict;
        dictLength = s.w_size;
      }
      avail = strm.avail_in;
      next = strm.next_in;
      input = strm.input;
      strm.avail_in = dictLength;
      strm.next_in = 0;
      strm.input = dictionary;
      fill_window(s);
      while (s.lookahead >= MIN_MATCH) {
        str = s.strstart;
        n = s.lookahead - (MIN_MATCH - 1);
        do {
          s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask;
          s.prev[str & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = str;
          str++;
        } while (--n);
        s.strstart = str;
        s.lookahead = MIN_MATCH - 1;
        fill_window(s);
      }
      s.strstart += s.lookahead;
      s.block_start = s.strstart;
      s.insert = s.lookahead;
      s.lookahead = 0;
      s.match_length = s.prev_length = MIN_MATCH - 1;
      s.match_available = 0;
      strm.next_in = next;
      strm.input = input;
      strm.avail_in = avail;
      s.wrap = wrap;
      return Z_OK;
    }
    exports2.deflateInit = deflateInit;
    exports2.deflateInit2 = deflateInit2;
    exports2.deflateReset = deflateReset;
    exports2.deflateResetKeep = deflateResetKeep;
    exports2.deflateSetHeader = deflateSetHeader;
    exports2.deflate = deflate;
    exports2.deflateEnd = deflateEnd;
    exports2.deflateSetDictionary = deflateSetDictionary;
    exports2.deflateInfo = "pako deflate (from Nodeca project)";
  }
});

// node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/utils/strings.js
var require_strings = __commonJS({
  "node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/utils/strings.js"(exports2) {
    "use strict";
    var utils = require_common();
    var STR_APPLY_OK = true;
    var STR_APPLY_UIA_OK = true;
    try {
      String.fromCharCode.apply(null, [0]);
    } catch (__) {
      STR_APPLY_OK = false;
    }
    try {
      String.fromCharCode.apply(null, new Uint8Array(1));
    } catch (__) {
      STR_APPLY_UIA_OK = false;
    }
    var _utf8len = new utils.Buf8(256);
    for (q = 0; q < 256; q++) {
      _utf8len[q] = q >= 252 ? 6 : q >= 248 ? 5 : q >= 240 ? 4 : q >= 224 ? 3 : q >= 192 ? 2 : 1;
    }
    var q;
    _utf8len[254] = _utf8len[254] = 1;
    exports2.string2buf = function(str) {
      var buf, c, c2, m_pos, i2, str_len = str.length, buf_len = 0;
      for (m_pos = 0; m_pos < str_len; m_pos++) {
        c = str.charCodeAt(m_pos);
        if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
          c2 = str.charCodeAt(m_pos + 1);
          if ((c2 & 64512) === 56320) {
            c = 65536 + (c - 55296 << 10) + (c2 - 56320);
            m_pos++;
          }
        }
        buf_len += c < 128 ? 1 : c < 2048 ? 2 : c < 65536 ? 3 : 4;
      }
      buf = new utils.Buf8(buf_len);
      for (i2 = 0, m_pos = 0; i2 < buf_len; m_pos++) {
        c = str.charCodeAt(m_pos);
        if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
          c2 = str.charCodeAt(m_pos + 1);
          if ((c2 & 64512) === 56320) {
            c = 65536 + (c - 55296 << 10) + (c2 - 56320);
            m_pos++;
          }
        }
        if (c < 128) {
          buf[i2++] = c;
        } else if (c < 2048) {
          buf[i2++] = 192 | c >>> 6;
          buf[i2++] = 128 | c & 63;
        } else if (c < 65536) {
          buf[i2++] = 224 | c >>> 12;
          buf[i2++] = 128 | c >>> 6 & 63;
          buf[i2++] = 128 | c & 63;
        } else {
          buf[i2++] = 240 | c >>> 18;
          buf[i2++] = 128 | c >>> 12 & 63;
          buf[i2++] = 128 | c >>> 6 & 63;
          buf[i2++] = 128 | c & 63;
        }
      }
      return buf;
    };
    function buf2binstring(buf, len) {
      if (len < 65534) {
        if (buf.subarray && STR_APPLY_UIA_OK || !buf.subarray && STR_APPLY_OK) {
          return String.fromCharCode.apply(null, utils.shrinkBuf(buf, len));
        }
      }
      var result = "";
      for (var i2 = 0; i2 < len; i2++) {
        result += String.fromCharCode(buf[i2]);
      }
      return result;
    }
    exports2.buf2binstring = function(buf) {
      return buf2binstring(buf, buf.length);
    };
    exports2.binstring2buf = function(str) {
      var buf = new utils.Buf8(str.length);
      for (var i2 = 0, len = buf.length; i2 < len; i2++) {
        buf[i2] = str.charCodeAt(i2);
      }
      return buf;
    };
    exports2.buf2string = function(buf, max) {
      var i2, out, c, c_len;
      var len = max || buf.length;
      var utf16buf = new Array(len * 2);
      for (out = 0, i2 = 0; i2 < len; ) {
        c = buf[i2++];
        if (c < 128) {
          utf16buf[out++] = c;
          continue;
        }
        c_len = _utf8len[c];
        if (c_len > 4) {
          utf16buf[out++] = 65533;
          i2 += c_len - 1;
          continue;
        }
        c &= c_len === 2 ? 31 : c_len === 3 ? 15 : 7;
        while (c_len > 1 && i2 < len) {
          c = c << 6 | buf[i2++] & 63;
          c_len--;
        }
        if (c_len > 1) {
          utf16buf[out++] = 65533;
          continue;
        }
        if (c < 65536) {
          utf16buf[out++] = c;
        } else {
          c -= 65536;
          utf16buf[out++] = 55296 | c >> 10 & 1023;
          utf16buf[out++] = 56320 | c & 1023;
        }
      }
      return buf2binstring(utf16buf, out);
    };
    exports2.utf8border = function(buf, max) {
      var pos;
      max = max || buf.length;
      if (max > buf.length) {
        max = buf.length;
      }
      pos = max - 1;
      while (pos >= 0 && (buf[pos] & 192) === 128) {
        pos--;
      }
      if (pos < 0) {
        return max;
      }
      if (pos === 0) {
        return max;
      }
      return pos + _utf8len[buf[pos]] > max ? pos : max;
    };
  }
});

// node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/zlib/zstream.js
var require_zstream = __commonJS({
  "node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/zlib/zstream.js"(exports2, module2) {
    "use strict";
    function ZStream() {
      this.input = null;
      this.next_in = 0;
      this.avail_in = 0;
      this.total_in = 0;
      this.output = null;
      this.next_out = 0;
      this.avail_out = 0;
      this.total_out = 0;
      this.msg = "";
      this.state = null;
      this.data_type = 2;
      this.adler = 0;
    }
    module2.exports = ZStream;
  }
});

// node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/deflate.js
var require_deflate2 = __commonJS({
  "node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/deflate.js"(exports2) {
    "use strict";
    var zlib_deflate = require_deflate();
    var utils = require_common();
    var strings = require_strings();
    var msg = require_messages();
    var ZStream = require_zstream();
    var toString = Object.prototype.toString;
    var Z_NO_FLUSH = 0;
    var Z_FINISH = 4;
    var Z_OK = 0;
    var Z_STREAM_END = 1;
    var Z_SYNC_FLUSH = 2;
    var Z_DEFAULT_COMPRESSION = -1;
    var Z_DEFAULT_STRATEGY = 0;
    var Z_DEFLATED = 8;
    function Deflate(options) {
      if (!(this instanceof Deflate))
        return new Deflate(options);
      this.options = utils.assign({
        level: Z_DEFAULT_COMPRESSION,
        method: Z_DEFLATED,
        chunkSize: 16384,
        windowBits: 15,
        memLevel: 8,
        strategy: Z_DEFAULT_STRATEGY,
        to: ""
      }, options || {});
      var opt = this.options;
      if (opt.raw && opt.windowBits > 0) {
        opt.windowBits = -opt.windowBits;
      } else if (opt.gzip && opt.windowBits > 0 && opt.windowBits < 16) {
        opt.windowBits += 16;
      }
      this.err = 0;
      this.msg = "";
      this.ended = false;
      this.chunks = [];
      this.strm = new ZStream();
      this.strm.avail_out = 0;
      var status = zlib_deflate.deflateInit2(this.strm, opt.level, opt.method, opt.windowBits, opt.memLevel, opt.strategy);
      if (status !== Z_OK) {
        throw new Error(msg[status]);
      }
      if (opt.header) {
        zlib_deflate.deflateSetHeader(this.strm, opt.header);
      }
      if (opt.dictionary) {
        var dict;
        if (typeof opt.dictionary === "string") {
          dict = strings.string2buf(opt.dictionary);
        } else if (toString.call(opt.dictionary) === "[object ArrayBuffer]") {
          dict = new Uint8Array(opt.dictionary);
        } else {
          dict = opt.dictionary;
        }
        status = zlib_deflate.deflateSetDictionary(this.strm, dict);
        if (status !== Z_OK) {
          throw new Error(msg[status]);
        }
        this._dict_set = true;
      }
    }
    Deflate.prototype.push = function(data, mode) {
      var strm = this.strm;
      var chunkSize = this.options.chunkSize;
      var status, _mode;
      if (this.ended) {
        return false;
      }
      _mode = mode === ~~mode ? mode : mode === true ? Z_FINISH : Z_NO_FLUSH;
      if (typeof data === "string") {
        strm.input = strings.string2buf(data);
      } else if (toString.call(data) === "[object ArrayBuffer]") {
        strm.input = new Uint8Array(data);
      } else {
        strm.input = data;
      }
      strm.next_in = 0;
      strm.avail_in = strm.input.length;
      do {
        if (strm.avail_out === 0) {
          strm.output = new utils.Buf8(chunkSize);
          strm.next_out = 0;
          strm.avail_out = chunkSize;
        }
        status = zlib_deflate.deflate(strm, _mode);
        if (status !== Z_STREAM_END && status !== Z_OK) {
          this.onEnd(status);
          this.ended = true;
          return false;
        }
        if (strm.avail_out === 0 || strm.avail_in === 0 && (_mode === Z_FINISH || _mode === Z_SYNC_FLUSH)) {
          if (this.options.to === "string") {
            this.onData(strings.buf2binstring(utils.shrinkBuf(strm.output, strm.next_out)));
          } else {
            this.onData(utils.shrinkBuf(strm.output, strm.next_out));
          }
        }
      } while ((strm.avail_in > 0 || strm.avail_out === 0) && status !== Z_STREAM_END);
      if (_mode === Z_FINISH) {
        status = zlib_deflate.deflateEnd(this.strm);
        this.onEnd(status);
        this.ended = true;
        return status === Z_OK;
      }
      if (_mode === Z_SYNC_FLUSH) {
        this.onEnd(Z_OK);
        strm.avail_out = 0;
        return true;
      }
      return true;
    };
    Deflate.prototype.onData = function(chunk) {
      this.chunks.push(chunk);
    };
    Deflate.prototype.onEnd = function(status) {
      if (status === Z_OK) {
        if (this.options.to === "string") {
          this.result = this.chunks.join("");
        } else {
          this.result = utils.flattenChunks(this.chunks);
        }
      }
      this.chunks = [];
      this.err = status;
      this.msg = this.strm.msg;
    };
    function deflate(input, options) {
      var deflator = new Deflate(options);
      deflator.push(input, true);
      if (deflator.err) {
        throw deflator.msg || msg[deflator.err];
      }
      return deflator.result;
    }
    function deflateRaw(input, options) {
      options = options || {};
      options.raw = true;
      return deflate(input, options);
    }
    function gzip(input, options) {
      options = options || {};
      options.gzip = true;
      return deflate(input, options);
    }
    exports2.Deflate = Deflate;
    exports2.deflate = deflate;
    exports2.deflateRaw = deflateRaw;
    exports2.gzip = gzip;
  }
});

// node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/zlib/inffast.js
var require_inffast = __commonJS({
  "node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/zlib/inffast.js"(exports2, module2) {
    "use strict";
    var BAD = 30;
    var TYPE = 12;
    module2.exports = function inflate_fast(strm, start) {
      var state;
      var _in;
      var last;
      var _out;
      var beg;
      var end;
      var dmax;
      var wsize;
      var whave;
      var wnext;
      var s_window;
      var hold;
      var bits;
      var lcode;
      var dcode;
      var lmask;
      var dmask;
      var here;
      var op;
      var len;
      var dist;
      var from;
      var from_source;
      var input, output;
      state = strm.state;
      _in = strm.next_in;
      input = strm.input;
      last = _in + (strm.avail_in - 5);
      _out = strm.next_out;
      output = strm.output;
      beg = _out - (start - strm.avail_out);
      end = _out + (strm.avail_out - 257);
      dmax = state.dmax;
      wsize = state.wsize;
      whave = state.whave;
      wnext = state.wnext;
      s_window = state.window;
      hold = state.hold;
      bits = state.bits;
      lcode = state.lencode;
      dcode = state.distcode;
      lmask = (1 << state.lenbits) - 1;
      dmask = (1 << state.distbits) - 1;
      top:
        do {
          if (bits < 15) {
            hold += input[_in++] << bits;
            bits += 8;
            hold += input[_in++] << bits;
            bits += 8;
          }
          here = lcode[hold & lmask];
          dolen:
            for (; ; ) {
              op = here >>> 24;
              hold >>>= op;
              bits -= op;
              op = here >>> 16 & 255;
              if (op === 0) {
                output[_out++] = here & 65535;
              } else if (op & 16) {
                len = here & 65535;
                op &= 15;
                if (op) {
                  if (bits < op) {
                    hold += input[_in++] << bits;
                    bits += 8;
                  }
                  len += hold & (1 << op) - 1;
                  hold >>>= op;
                  bits -= op;
                }
                if (bits < 15) {
                  hold += input[_in++] << bits;
                  bits += 8;
                  hold += input[_in++] << bits;
                  bits += 8;
                }
                here = dcode[hold & dmask];
                dodist:
                  for (; ; ) {
                    op = here >>> 24;
                    hold >>>= op;
                    bits -= op;
                    op = here >>> 16 & 255;
                    if (op & 16) {
                      dist = here & 65535;
                      op &= 15;
                      if (bits < op) {
                        hold += input[_in++] << bits;
                        bits += 8;
                        if (bits < op) {
                          hold += input[_in++] << bits;
                          bits += 8;
                        }
                      }
                      dist += hold & (1 << op) - 1;
                      if (dist > dmax) {
                        strm.msg = "invalid distance too far back";
                        state.mode = BAD;
                        break top;
                      }
                      hold >>>= op;
                      bits -= op;
                      op = _out - beg;
                      if (dist > op) {
                        op = dist - op;
                        if (op > whave) {
                          if (state.sane) {
                            strm.msg = "invalid distance too far back";
                            state.mode = BAD;
                            break top;
                          }
                        }
                        from = 0;
                        from_source = s_window;
                        if (wnext === 0) {
                          from += wsize - op;
                          if (op < len) {
                            len -= op;
                            do {
                              output[_out++] = s_window[from++];
                            } while (--op);
                            from = _out - dist;
                            from_source = output;
                          }
                        } else if (wnext < op) {
                          from += wsize + wnext - op;
                          op -= wnext;
                          if (op < len) {
                            len -= op;
                            do {
                              output[_out++] = s_window[from++];
                            } while (--op);
                            from = 0;
                            if (wnext < len) {
                              op = wnext;
                              len -= op;
                              do {
                                output[_out++] = s_window[from++];
                              } while (--op);
                              from = _out - dist;
                              from_source = output;
                            }
                          }
                        } else {
                          from += wnext - op;
                          if (op < len) {
                            len -= op;
                            do {
                              output[_out++] = s_window[from++];
                            } while (--op);
                            from = _out - dist;
                            from_source = output;
                          }
                        }
                        while (len > 2) {
                          output[_out++] = from_source[from++];
                          output[_out++] = from_source[from++];
                          output[_out++] = from_source[from++];
                          len -= 3;
                        }
                        if (len) {
                          output[_out++] = from_source[from++];
                          if (len > 1) {
                            output[_out++] = from_source[from++];
                          }
                        }
                      } else {
                        from = _out - dist;
                        do {
                          output[_out++] = output[from++];
                          output[_out++] = output[from++];
                          output[_out++] = output[from++];
                          len -= 3;
                        } while (len > 2);
                        if (len) {
                          output[_out++] = output[from++];
                          if (len > 1) {
                            output[_out++] = output[from++];
                          }
                        }
                      }
                    } else if ((op & 64) === 0) {
                      here = dcode[(here & 65535) + (hold & (1 << op) - 1)];
                      continue dodist;
                    } else {
                      strm.msg = "invalid distance code";
                      state.mode = BAD;
                      break top;
                    }
                    break;
                  }
              } else if ((op & 64) === 0) {
                here = lcode[(here & 65535) + (hold & (1 << op) - 1)];
                continue dolen;
              } else if (op & 32) {
                state.mode = TYPE;
                break top;
              } else {
                strm.msg = "invalid literal/length code";
                state.mode = BAD;
                break top;
              }
              break;
            }
        } while (_in < last && _out < end);
      len = bits >> 3;
      _in -= len;
      bits -= len << 3;
      hold &= (1 << bits) - 1;
      strm.next_in = _in;
      strm.next_out = _out;
      strm.avail_in = _in < last ? 5 + (last - _in) : 5 - (_in - last);
      strm.avail_out = _out < end ? 257 + (end - _out) : 257 - (_out - end);
      state.hold = hold;
      state.bits = bits;
      return;
    };
  }
});

// node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/zlib/inftrees.js
var require_inftrees = __commonJS({
  "node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/zlib/inftrees.js"(exports2, module2) {
    "use strict";
    var utils = require_common();
    var MAXBITS = 15;
    var ENOUGH_LENS = 852;
    var ENOUGH_DISTS = 592;
    var CODES = 0;
    var LENS = 1;
    var DISTS = 2;
    var lbase = [
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      13,
      15,
      17,
      19,
      23,
      27,
      31,
      35,
      43,
      51,
      59,
      67,
      83,
      99,
      115,
      131,
      163,
      195,
      227,
      258,
      0,
      0
    ];
    var lext = [
      16,
      16,
      16,
      16,
      16,
      16,
      16,
      16,
      17,
      17,
      17,
      17,
      18,
      18,
      18,
      18,
      19,
      19,
      19,
      19,
      20,
      20,
      20,
      20,
      21,
      21,
      21,
      21,
      16,
      72,
      78
    ];
    var dbase = [
      1,
      2,
      3,
      4,
      5,
      7,
      9,
      13,
      17,
      25,
      33,
      49,
      65,
      97,
      129,
      193,
      257,
      385,
      513,
      769,
      1025,
      1537,
      2049,
      3073,
      4097,
      6145,
      8193,
      12289,
      16385,
      24577,
      0,
      0
    ];
    var dext = [
      16,
      16,
      16,
      16,
      17,
      17,
      18,
      18,
      19,
      19,
      20,
      20,
      21,
      21,
      22,
      22,
      23,
      23,
      24,
      24,
      25,
      25,
      26,
      26,
      27,
      27,
      28,
      28,
      29,
      29,
      64,
      64
    ];
    module2.exports = function inflate_table(type, lens, lens_index, codes, table, table_index, work, opts) {
      var bits = opts.bits;
      var len = 0;
      var sym = 0;
      var min = 0, max = 0;
      var root2 = 0;
      var curr = 0;
      var drop = 0;
      var left = 0;
      var used = 0;
      var huff = 0;
      var incr;
      var fill;
      var low;
      var mask;
      var next;
      var base2 = null;
      var base_index = 0;
      var end;
      var count = new utils.Buf16(MAXBITS + 1);
      var offs = new utils.Buf16(MAXBITS + 1);
      var extra = null;
      var extra_index = 0;
      var here_bits, here_op, here_val;
      for (len = 0; len <= MAXBITS; len++) {
        count[len] = 0;
      }
      for (sym = 0; sym < codes; sym++) {
        count[lens[lens_index + sym]]++;
      }
      root2 = bits;
      for (max = MAXBITS; max >= 1; max--) {
        if (count[max] !== 0) {
          break;
        }
      }
      if (root2 > max) {
        root2 = max;
      }
      if (max === 0) {
        table[table_index++] = 1 << 24 | 64 << 16 | 0;
        table[table_index++] = 1 << 24 | 64 << 16 | 0;
        opts.bits = 1;
        return 0;
      }
      for (min = 1; min < max; min++) {
        if (count[min] !== 0) {
          break;
        }
      }
      if (root2 < min) {
        root2 = min;
      }
      left = 1;
      for (len = 1; len <= MAXBITS; len++) {
        left <<= 1;
        left -= count[len];
        if (left < 0) {
          return -1;
        }
      }
      if (left > 0 && (type === CODES || max !== 1)) {
        return -1;
      }
      offs[1] = 0;
      for (len = 1; len < MAXBITS; len++) {
        offs[len + 1] = offs[len] + count[len];
      }
      for (sym = 0; sym < codes; sym++) {
        if (lens[lens_index + sym] !== 0) {
          work[offs[lens[lens_index + sym]]++] = sym;
        }
      }
      if (type === CODES) {
        base2 = extra = work;
        end = 19;
      } else if (type === LENS) {
        base2 = lbase;
        base_index -= 257;
        extra = lext;
        extra_index -= 257;
        end = 256;
      } else {
        base2 = dbase;
        extra = dext;
        end = -1;
      }
      huff = 0;
      sym = 0;
      len = min;
      next = table_index;
      curr = root2;
      drop = 0;
      low = -1;
      used = 1 << root2;
      mask = used - 1;
      if (type === LENS && used > ENOUGH_LENS || type === DISTS && used > ENOUGH_DISTS) {
        return 1;
      }
      for (; ; ) {
        here_bits = len - drop;
        if (work[sym] < end) {
          here_op = 0;
          here_val = work[sym];
        } else if (work[sym] > end) {
          here_op = extra[extra_index + work[sym]];
          here_val = base2[base_index + work[sym]];
        } else {
          here_op = 32 + 64;
          here_val = 0;
        }
        incr = 1 << len - drop;
        fill = 1 << curr;
        min = fill;
        do {
          fill -= incr;
          table[next + (huff >> drop) + fill] = here_bits << 24 | here_op << 16 | here_val | 0;
        } while (fill !== 0);
        incr = 1 << len - 1;
        while (huff & incr) {
          incr >>= 1;
        }
        if (incr !== 0) {
          huff &= incr - 1;
          huff += incr;
        } else {
          huff = 0;
        }
        sym++;
        if (--count[len] === 0) {
          if (len === max) {
            break;
          }
          len = lens[lens_index + work[sym]];
        }
        if (len > root2 && (huff & mask) !== low) {
          if (drop === 0) {
            drop = root2;
          }
          next += min;
          curr = len - drop;
          left = 1 << curr;
          while (curr + drop < max) {
            left -= count[curr + drop];
            if (left <= 0) {
              break;
            }
            curr++;
            left <<= 1;
          }
          used += 1 << curr;
          if (type === LENS && used > ENOUGH_LENS || type === DISTS && used > ENOUGH_DISTS) {
            return 1;
          }
          low = huff & mask;
          table[low] = root2 << 24 | curr << 16 | next - table_index | 0;
        }
      }
      if (huff !== 0) {
        table[next + huff] = len - drop << 24 | 64 << 16 | 0;
      }
      opts.bits = root2;
      return 0;
    };
  }
});

// node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/zlib/inflate.js
var require_inflate = __commonJS({
  "node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/zlib/inflate.js"(exports2) {
    "use strict";
    var utils = require_common();
    var adler32 = require_adler32();
    var crc32 = require_crc322();
    var inflate_fast = require_inffast();
    var inflate_table = require_inftrees();
    var CODES = 0;
    var LENS = 1;
    var DISTS = 2;
    var Z_FINISH = 4;
    var Z_BLOCK = 5;
    var Z_TREES = 6;
    var Z_OK = 0;
    var Z_STREAM_END = 1;
    var Z_NEED_DICT = 2;
    var Z_STREAM_ERROR = -2;
    var Z_DATA_ERROR = -3;
    var Z_MEM_ERROR = -4;
    var Z_BUF_ERROR = -5;
    var Z_DEFLATED = 8;
    var HEAD = 1;
    var FLAGS = 2;
    var TIME = 3;
    var OS = 4;
    var EXLEN = 5;
    var EXTRA = 6;
    var NAME = 7;
    var COMMENT = 8;
    var HCRC = 9;
    var DICTID = 10;
    var DICT = 11;
    var TYPE = 12;
    var TYPEDO = 13;
    var STORED = 14;
    var COPY_ = 15;
    var COPY = 16;
    var TABLE = 17;
    var LENLENS = 18;
    var CODELENS = 19;
    var LEN_ = 20;
    var LEN = 21;
    var LENEXT = 22;
    var DIST = 23;
    var DISTEXT = 24;
    var MATCH = 25;
    var LIT = 26;
    var CHECK = 27;
    var LENGTH = 28;
    var DONE = 29;
    var BAD = 30;
    var MEM = 31;
    var SYNC = 32;
    var ENOUGH_LENS = 852;
    var ENOUGH_DISTS = 592;
    var MAX_WBITS = 15;
    var DEF_WBITS = MAX_WBITS;
    function zswap32(q) {
      return (q >>> 24 & 255) + (q >>> 8 & 65280) + ((q & 65280) << 8) + ((q & 255) << 24);
    }
    function InflateState() {
      this.mode = 0;
      this.last = false;
      this.wrap = 0;
      this.havedict = false;
      this.flags = 0;
      this.dmax = 0;
      this.check = 0;
      this.total = 0;
      this.head = null;
      this.wbits = 0;
      this.wsize = 0;
      this.whave = 0;
      this.wnext = 0;
      this.window = null;
      this.hold = 0;
      this.bits = 0;
      this.length = 0;
      this.offset = 0;
      this.extra = 0;
      this.lencode = null;
      this.distcode = null;
      this.lenbits = 0;
      this.distbits = 0;
      this.ncode = 0;
      this.nlen = 0;
      this.ndist = 0;
      this.have = 0;
      this.next = null;
      this.lens = new utils.Buf16(320);
      this.work = new utils.Buf16(288);
      this.lendyn = null;
      this.distdyn = null;
      this.sane = 0;
      this.back = 0;
      this.was = 0;
    }
    function inflateResetKeep(strm) {
      var state;
      if (!strm || !strm.state) {
        return Z_STREAM_ERROR;
      }
      state = strm.state;
      strm.total_in = strm.total_out = state.total = 0;
      strm.msg = "";
      if (state.wrap) {
        strm.adler = state.wrap & 1;
      }
      state.mode = HEAD;
      state.last = 0;
      state.havedict = 0;
      state.dmax = 32768;
      state.head = null;
      state.hold = 0;
      state.bits = 0;
      state.lencode = state.lendyn = new utils.Buf32(ENOUGH_LENS);
      state.distcode = state.distdyn = new utils.Buf32(ENOUGH_DISTS);
      state.sane = 1;
      state.back = -1;
      return Z_OK;
    }
    function inflateReset(strm) {
      var state;
      if (!strm || !strm.state) {
        return Z_STREAM_ERROR;
      }
      state = strm.state;
      state.wsize = 0;
      state.whave = 0;
      state.wnext = 0;
      return inflateResetKeep(strm);
    }
    function inflateReset2(strm, windowBits) {
      var wrap;
      var state;
      if (!strm || !strm.state) {
        return Z_STREAM_ERROR;
      }
      state = strm.state;
      if (windowBits < 0) {
        wrap = 0;
        windowBits = -windowBits;
      } else {
        wrap = (windowBits >> 4) + 1;
        if (windowBits < 48) {
          windowBits &= 15;
        }
      }
      if (windowBits && (windowBits < 8 || windowBits > 15)) {
        return Z_STREAM_ERROR;
      }
      if (state.window !== null && state.wbits !== windowBits) {
        state.window = null;
      }
      state.wrap = wrap;
      state.wbits = windowBits;
      return inflateReset(strm);
    }
    function inflateInit2(strm, windowBits) {
      var ret;
      var state;
      if (!strm) {
        return Z_STREAM_ERROR;
      }
      state = new InflateState();
      strm.state = state;
      state.window = null;
      ret = inflateReset2(strm, windowBits);
      if (ret !== Z_OK) {
        strm.state = null;
      }
      return ret;
    }
    function inflateInit(strm) {
      return inflateInit2(strm, DEF_WBITS);
    }
    var virgin = true;
    var lenfix;
    var distfix;
    function fixedtables(state) {
      if (virgin) {
        var sym;
        lenfix = new utils.Buf32(512);
        distfix = new utils.Buf32(32);
        sym = 0;
        while (sym < 144) {
          state.lens[sym++] = 8;
        }
        while (sym < 256) {
          state.lens[sym++] = 9;
        }
        while (sym < 280) {
          state.lens[sym++] = 7;
        }
        while (sym < 288) {
          state.lens[sym++] = 8;
        }
        inflate_table(LENS, state.lens, 0, 288, lenfix, 0, state.work, { bits: 9 });
        sym = 0;
        while (sym < 32) {
          state.lens[sym++] = 5;
        }
        inflate_table(DISTS, state.lens, 0, 32, distfix, 0, state.work, { bits: 5 });
        virgin = false;
      }
      state.lencode = lenfix;
      state.lenbits = 9;
      state.distcode = distfix;
      state.distbits = 5;
    }
    function updatewindow(strm, src, end, copy2) {
      var dist;
      var state = strm.state;
      if (state.window === null) {
        state.wsize = 1 << state.wbits;
        state.wnext = 0;
        state.whave = 0;
        state.window = new utils.Buf8(state.wsize);
      }
      if (copy2 >= state.wsize) {
        utils.arraySet(state.window, src, end - state.wsize, state.wsize, 0);
        state.wnext = 0;
        state.whave = state.wsize;
      } else {
        dist = state.wsize - state.wnext;
        if (dist > copy2) {
          dist = copy2;
        }
        utils.arraySet(state.window, src, end - copy2, dist, state.wnext);
        copy2 -= dist;
        if (copy2) {
          utils.arraySet(state.window, src, end - copy2, copy2, 0);
          state.wnext = copy2;
          state.whave = state.wsize;
        } else {
          state.wnext += dist;
          if (state.wnext === state.wsize) {
            state.wnext = 0;
          }
          if (state.whave < state.wsize) {
            state.whave += dist;
          }
        }
      }
      return 0;
    }
    function inflate(strm, flush) {
      var state;
      var input, output;
      var next;
      var put;
      var have, left;
      var hold;
      var bits;
      var _in, _out;
      var copy2;
      var from;
      var from_source;
      var here = 0;
      var here_bits, here_op, here_val;
      var last_bits, last_op, last_val;
      var len;
      var ret;
      var hbuf = new utils.Buf8(4);
      var opts;
      var n;
      var order = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
      if (!strm || !strm.state || !strm.output || !strm.input && strm.avail_in !== 0) {
        return Z_STREAM_ERROR;
      }
      state = strm.state;
      if (state.mode === TYPE) {
        state.mode = TYPEDO;
      }
      put = strm.next_out;
      output = strm.output;
      left = strm.avail_out;
      next = strm.next_in;
      input = strm.input;
      have = strm.avail_in;
      hold = state.hold;
      bits = state.bits;
      _in = have;
      _out = left;
      ret = Z_OK;
      inf_leave:
        for (; ; ) {
          switch (state.mode) {
            case HEAD:
              if (state.wrap === 0) {
                state.mode = TYPEDO;
                break;
              }
              while (bits < 16) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if (state.wrap & 2 && hold === 35615) {
                state.check = 0;
                hbuf[0] = hold & 255;
                hbuf[1] = hold >>> 8 & 255;
                state.check = crc32(state.check, hbuf, 2, 0);
                hold = 0;
                bits = 0;
                state.mode = FLAGS;
                break;
              }
              state.flags = 0;
              if (state.head) {
                state.head.done = false;
              }
              if (!(state.wrap & 1) || (((hold & 255) << 8) + (hold >> 8)) % 31) {
                strm.msg = "incorrect header check";
                state.mode = BAD;
                break;
              }
              if ((hold & 15) !== Z_DEFLATED) {
                strm.msg = "unknown compression method";
                state.mode = BAD;
                break;
              }
              hold >>>= 4;
              bits -= 4;
              len = (hold & 15) + 8;
              if (state.wbits === 0) {
                state.wbits = len;
              } else if (len > state.wbits) {
                strm.msg = "invalid window size";
                state.mode = BAD;
                break;
              }
              state.dmax = 1 << len;
              strm.adler = state.check = 1;
              state.mode = hold & 512 ? DICTID : TYPE;
              hold = 0;
              bits = 0;
              break;
            case FLAGS:
              while (bits < 16) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              state.flags = hold;
              if ((state.flags & 255) !== Z_DEFLATED) {
                strm.msg = "unknown compression method";
                state.mode = BAD;
                break;
              }
              if (state.flags & 57344) {
                strm.msg = "unknown header flags set";
                state.mode = BAD;
                break;
              }
              if (state.head) {
                state.head.text = hold >> 8 & 1;
              }
              if (state.flags & 512) {
                hbuf[0] = hold & 255;
                hbuf[1] = hold >>> 8 & 255;
                state.check = crc32(state.check, hbuf, 2, 0);
              }
              hold = 0;
              bits = 0;
              state.mode = TIME;
            case TIME:
              while (bits < 32) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if (state.head) {
                state.head.time = hold;
              }
              if (state.flags & 512) {
                hbuf[0] = hold & 255;
                hbuf[1] = hold >>> 8 & 255;
                hbuf[2] = hold >>> 16 & 255;
                hbuf[3] = hold >>> 24 & 255;
                state.check = crc32(state.check, hbuf, 4, 0);
              }
              hold = 0;
              bits = 0;
              state.mode = OS;
            case OS:
              while (bits < 16) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if (state.head) {
                state.head.xflags = hold & 255;
                state.head.os = hold >> 8;
              }
              if (state.flags & 512) {
                hbuf[0] = hold & 255;
                hbuf[1] = hold >>> 8 & 255;
                state.check = crc32(state.check, hbuf, 2, 0);
              }
              hold = 0;
              bits = 0;
              state.mode = EXLEN;
            case EXLEN:
              if (state.flags & 1024) {
                while (bits < 16) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                state.length = hold;
                if (state.head) {
                  state.head.extra_len = hold;
                }
                if (state.flags & 512) {
                  hbuf[0] = hold & 255;
                  hbuf[1] = hold >>> 8 & 255;
                  state.check = crc32(state.check, hbuf, 2, 0);
                }
                hold = 0;
                bits = 0;
              } else if (state.head) {
                state.head.extra = null;
              }
              state.mode = EXTRA;
            case EXTRA:
              if (state.flags & 1024) {
                copy2 = state.length;
                if (copy2 > have) {
                  copy2 = have;
                }
                if (copy2) {
                  if (state.head) {
                    len = state.head.extra_len - state.length;
                    if (!state.head.extra) {
                      state.head.extra = new Array(state.head.extra_len);
                    }
                    utils.arraySet(state.head.extra, input, next, copy2, len);
                  }
                  if (state.flags & 512) {
                    state.check = crc32(state.check, input, copy2, next);
                  }
                  have -= copy2;
                  next += copy2;
                  state.length -= copy2;
                }
                if (state.length) {
                  break inf_leave;
                }
              }
              state.length = 0;
              state.mode = NAME;
            case NAME:
              if (state.flags & 2048) {
                if (have === 0) {
                  break inf_leave;
                }
                copy2 = 0;
                do {
                  len = input[next + copy2++];
                  if (state.head && len && state.length < 65536) {
                    state.head.name += String.fromCharCode(len);
                  }
                } while (len && copy2 < have);
                if (state.flags & 512) {
                  state.check = crc32(state.check, input, copy2, next);
                }
                have -= copy2;
                next += copy2;
                if (len) {
                  break inf_leave;
                }
              } else if (state.head) {
                state.head.name = null;
              }
              state.length = 0;
              state.mode = COMMENT;
            case COMMENT:
              if (state.flags & 4096) {
                if (have === 0) {
                  break inf_leave;
                }
                copy2 = 0;
                do {
                  len = input[next + copy2++];
                  if (state.head && len && state.length < 65536) {
                    state.head.comment += String.fromCharCode(len);
                  }
                } while (len && copy2 < have);
                if (state.flags & 512) {
                  state.check = crc32(state.check, input, copy2, next);
                }
                have -= copy2;
                next += copy2;
                if (len) {
                  break inf_leave;
                }
              } else if (state.head) {
                state.head.comment = null;
              }
              state.mode = HCRC;
            case HCRC:
              if (state.flags & 512) {
                while (bits < 16) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                if (hold !== (state.check & 65535)) {
                  strm.msg = "header crc mismatch";
                  state.mode = BAD;
                  break;
                }
                hold = 0;
                bits = 0;
              }
              if (state.head) {
                state.head.hcrc = state.flags >> 9 & 1;
                state.head.done = true;
              }
              strm.adler = state.check = 0;
              state.mode = TYPE;
              break;
            case DICTID:
              while (bits < 32) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              strm.adler = state.check = zswap32(hold);
              hold = 0;
              bits = 0;
              state.mode = DICT;
            case DICT:
              if (state.havedict === 0) {
                strm.next_out = put;
                strm.avail_out = left;
                strm.next_in = next;
                strm.avail_in = have;
                state.hold = hold;
                state.bits = bits;
                return Z_NEED_DICT;
              }
              strm.adler = state.check = 1;
              state.mode = TYPE;
            case TYPE:
              if (flush === Z_BLOCK || flush === Z_TREES) {
                break inf_leave;
              }
            case TYPEDO:
              if (state.last) {
                hold >>>= bits & 7;
                bits -= bits & 7;
                state.mode = CHECK;
                break;
              }
              while (bits < 3) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              state.last = hold & 1;
              hold >>>= 1;
              bits -= 1;
              switch (hold & 3) {
                case 0:
                  state.mode = STORED;
                  break;
                case 1:
                  fixedtables(state);
                  state.mode = LEN_;
                  if (flush === Z_TREES) {
                    hold >>>= 2;
                    bits -= 2;
                    break inf_leave;
                  }
                  break;
                case 2:
                  state.mode = TABLE;
                  break;
                case 3:
                  strm.msg = "invalid block type";
                  state.mode = BAD;
              }
              hold >>>= 2;
              bits -= 2;
              break;
            case STORED:
              hold >>>= bits & 7;
              bits -= bits & 7;
              while (bits < 32) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if ((hold & 65535) !== (hold >>> 16 ^ 65535)) {
                strm.msg = "invalid stored block lengths";
                state.mode = BAD;
                break;
              }
              state.length = hold & 65535;
              hold = 0;
              bits = 0;
              state.mode = COPY_;
              if (flush === Z_TREES) {
                break inf_leave;
              }
            case COPY_:
              state.mode = COPY;
            case COPY:
              copy2 = state.length;
              if (copy2) {
                if (copy2 > have) {
                  copy2 = have;
                }
                if (copy2 > left) {
                  copy2 = left;
                }
                if (copy2 === 0) {
                  break inf_leave;
                }
                utils.arraySet(output, input, next, copy2, put);
                have -= copy2;
                next += copy2;
                left -= copy2;
                put += copy2;
                state.length -= copy2;
                break;
              }
              state.mode = TYPE;
              break;
            case TABLE:
              while (bits < 14) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              state.nlen = (hold & 31) + 257;
              hold >>>= 5;
              bits -= 5;
              state.ndist = (hold & 31) + 1;
              hold >>>= 5;
              bits -= 5;
              state.ncode = (hold & 15) + 4;
              hold >>>= 4;
              bits -= 4;
              if (state.nlen > 286 || state.ndist > 30) {
                strm.msg = "too many length or distance symbols";
                state.mode = BAD;
                break;
              }
              state.have = 0;
              state.mode = LENLENS;
            case LENLENS:
              while (state.have < state.ncode) {
                while (bits < 3) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                state.lens[order[state.have++]] = hold & 7;
                hold >>>= 3;
                bits -= 3;
              }
              while (state.have < 19) {
                state.lens[order[state.have++]] = 0;
              }
              state.lencode = state.lendyn;
              state.lenbits = 7;
              opts = { bits: state.lenbits };
              ret = inflate_table(CODES, state.lens, 0, 19, state.lencode, 0, state.work, opts);
              state.lenbits = opts.bits;
              if (ret) {
                strm.msg = "invalid code lengths set";
                state.mode = BAD;
                break;
              }
              state.have = 0;
              state.mode = CODELENS;
            case CODELENS:
              while (state.have < state.nlen + state.ndist) {
                for (; ; ) {
                  here = state.lencode[hold & (1 << state.lenbits) - 1];
                  here_bits = here >>> 24;
                  here_op = here >>> 16 & 255;
                  here_val = here & 65535;
                  if (here_bits <= bits) {
                    break;
                  }
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                if (here_val < 16) {
                  hold >>>= here_bits;
                  bits -= here_bits;
                  state.lens[state.have++] = here_val;
                } else {
                  if (here_val === 16) {
                    n = here_bits + 2;
                    while (bits < n) {
                      if (have === 0) {
                        break inf_leave;
                      }
                      have--;
                      hold += input[next++] << bits;
                      bits += 8;
                    }
                    hold >>>= here_bits;
                    bits -= here_bits;
                    if (state.have === 0) {
                      strm.msg = "invalid bit length repeat";
                      state.mode = BAD;
                      break;
                    }
                    len = state.lens[state.have - 1];
                    copy2 = 3 + (hold & 3);
                    hold >>>= 2;
                    bits -= 2;
                  } else if (here_val === 17) {
                    n = here_bits + 3;
                    while (bits < n) {
                      if (have === 0) {
                        break inf_leave;
                      }
                      have--;
                      hold += input[next++] << bits;
                      bits += 8;
                    }
                    hold >>>= here_bits;
                    bits -= here_bits;
                    len = 0;
                    copy2 = 3 + (hold & 7);
                    hold >>>= 3;
                    bits -= 3;
                  } else {
                    n = here_bits + 7;
                    while (bits < n) {
                      if (have === 0) {
                        break inf_leave;
                      }
                      have--;
                      hold += input[next++] << bits;
                      bits += 8;
                    }
                    hold >>>= here_bits;
                    bits -= here_bits;
                    len = 0;
                    copy2 = 11 + (hold & 127);
                    hold >>>= 7;
                    bits -= 7;
                  }
                  if (state.have + copy2 > state.nlen + state.ndist) {
                    strm.msg = "invalid bit length repeat";
                    state.mode = BAD;
                    break;
                  }
                  while (copy2--) {
                    state.lens[state.have++] = len;
                  }
                }
              }
              if (state.mode === BAD) {
                break;
              }
              if (state.lens[256] === 0) {
                strm.msg = "invalid code -- missing end-of-block";
                state.mode = BAD;
                break;
              }
              state.lenbits = 9;
              opts = { bits: state.lenbits };
              ret = inflate_table(LENS, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts);
              state.lenbits = opts.bits;
              if (ret) {
                strm.msg = "invalid literal/lengths set";
                state.mode = BAD;
                break;
              }
              state.distbits = 6;
              state.distcode = state.distdyn;
              opts = { bits: state.distbits };
              ret = inflate_table(DISTS, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts);
              state.distbits = opts.bits;
              if (ret) {
                strm.msg = "invalid distances set";
                state.mode = BAD;
                break;
              }
              state.mode = LEN_;
              if (flush === Z_TREES) {
                break inf_leave;
              }
            case LEN_:
              state.mode = LEN;
            case LEN:
              if (have >= 6 && left >= 258) {
                strm.next_out = put;
                strm.avail_out = left;
                strm.next_in = next;
                strm.avail_in = have;
                state.hold = hold;
                state.bits = bits;
                inflate_fast(strm, _out);
                put = strm.next_out;
                output = strm.output;
                left = strm.avail_out;
                next = strm.next_in;
                input = strm.input;
                have = strm.avail_in;
                hold = state.hold;
                bits = state.bits;
                if (state.mode === TYPE) {
                  state.back = -1;
                }
                break;
              }
              state.back = 0;
              for (; ; ) {
                here = state.lencode[hold & (1 << state.lenbits) - 1];
                here_bits = here >>> 24;
                here_op = here >>> 16 & 255;
                here_val = here & 65535;
                if (here_bits <= bits) {
                  break;
                }
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if (here_op && (here_op & 240) === 0) {
                last_bits = here_bits;
                last_op = here_op;
                last_val = here_val;
                for (; ; ) {
                  here = state.lencode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
                  here_bits = here >>> 24;
                  here_op = here >>> 16 & 255;
                  here_val = here & 65535;
                  if (last_bits + here_bits <= bits) {
                    break;
                  }
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                hold >>>= last_bits;
                bits -= last_bits;
                state.back += last_bits;
              }
              hold >>>= here_bits;
              bits -= here_bits;
              state.back += here_bits;
              state.length = here_val;
              if (here_op === 0) {
                state.mode = LIT;
                break;
              }
              if (here_op & 32) {
                state.back = -1;
                state.mode = TYPE;
                break;
              }
              if (here_op & 64) {
                strm.msg = "invalid literal/length code";
                state.mode = BAD;
                break;
              }
              state.extra = here_op & 15;
              state.mode = LENEXT;
            case LENEXT:
              if (state.extra) {
                n = state.extra;
                while (bits < n) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                state.length += hold & (1 << state.extra) - 1;
                hold >>>= state.extra;
                bits -= state.extra;
                state.back += state.extra;
              }
              state.was = state.length;
              state.mode = DIST;
            case DIST:
              for (; ; ) {
                here = state.distcode[hold & (1 << state.distbits) - 1];
                here_bits = here >>> 24;
                here_op = here >>> 16 & 255;
                here_val = here & 65535;
                if (here_bits <= bits) {
                  break;
                }
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if ((here_op & 240) === 0) {
                last_bits = here_bits;
                last_op = here_op;
                last_val = here_val;
                for (; ; ) {
                  here = state.distcode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
                  here_bits = here >>> 24;
                  here_op = here >>> 16 & 255;
                  here_val = here & 65535;
                  if (last_bits + here_bits <= bits) {
                    break;
                  }
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                hold >>>= last_bits;
                bits -= last_bits;
                state.back += last_bits;
              }
              hold >>>= here_bits;
              bits -= here_bits;
              state.back += here_bits;
              if (here_op & 64) {
                strm.msg = "invalid distance code";
                state.mode = BAD;
                break;
              }
              state.offset = here_val;
              state.extra = here_op & 15;
              state.mode = DISTEXT;
            case DISTEXT:
              if (state.extra) {
                n = state.extra;
                while (bits < n) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                state.offset += hold & (1 << state.extra) - 1;
                hold >>>= state.extra;
                bits -= state.extra;
                state.back += state.extra;
              }
              if (state.offset > state.dmax) {
                strm.msg = "invalid distance too far back";
                state.mode = BAD;
                break;
              }
              state.mode = MATCH;
            case MATCH:
              if (left === 0) {
                break inf_leave;
              }
              copy2 = _out - left;
              if (state.offset > copy2) {
                copy2 = state.offset - copy2;
                if (copy2 > state.whave) {
                  if (state.sane) {
                    strm.msg = "invalid distance too far back";
                    state.mode = BAD;
                    break;
                  }
                }
                if (copy2 > state.wnext) {
                  copy2 -= state.wnext;
                  from = state.wsize - copy2;
                } else {
                  from = state.wnext - copy2;
                }
                if (copy2 > state.length) {
                  copy2 = state.length;
                }
                from_source = state.window;
              } else {
                from_source = output;
                from = put - state.offset;
                copy2 = state.length;
              }
              if (copy2 > left) {
                copy2 = left;
              }
              left -= copy2;
              state.length -= copy2;
              do {
                output[put++] = from_source[from++];
              } while (--copy2);
              if (state.length === 0) {
                state.mode = LEN;
              }
              break;
            case LIT:
              if (left === 0) {
                break inf_leave;
              }
              output[put++] = state.length;
              left--;
              state.mode = LEN;
              break;
            case CHECK:
              if (state.wrap) {
                while (bits < 32) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold |= input[next++] << bits;
                  bits += 8;
                }
                _out -= left;
                strm.total_out += _out;
                state.total += _out;
                if (_out) {
                  strm.adler = state.check = state.flags ? crc32(state.check, output, _out, put - _out) : adler32(state.check, output, _out, put - _out);
                }
                _out = left;
                if ((state.flags ? hold : zswap32(hold)) !== state.check) {
                  strm.msg = "incorrect data check";
                  state.mode = BAD;
                  break;
                }
                hold = 0;
                bits = 0;
              }
              state.mode = LENGTH;
            case LENGTH:
              if (state.wrap && state.flags) {
                while (bits < 32) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                if (hold !== (state.total & 4294967295)) {
                  strm.msg = "incorrect length check";
                  state.mode = BAD;
                  break;
                }
                hold = 0;
                bits = 0;
              }
              state.mode = DONE;
            case DONE:
              ret = Z_STREAM_END;
              break inf_leave;
            case BAD:
              ret = Z_DATA_ERROR;
              break inf_leave;
            case MEM:
              return Z_MEM_ERROR;
            case SYNC:
            default:
              return Z_STREAM_ERROR;
          }
        }
      strm.next_out = put;
      strm.avail_out = left;
      strm.next_in = next;
      strm.avail_in = have;
      state.hold = hold;
      state.bits = bits;
      if (state.wsize || _out !== strm.avail_out && state.mode < BAD && (state.mode < CHECK || flush !== Z_FINISH)) {
        if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out)) {
          state.mode = MEM;
          return Z_MEM_ERROR;
        }
      }
      _in -= strm.avail_in;
      _out -= strm.avail_out;
      strm.total_in += _in;
      strm.total_out += _out;
      state.total += _out;
      if (state.wrap && _out) {
        strm.adler = state.check = state.flags ? crc32(state.check, output, _out, strm.next_out - _out) : adler32(state.check, output, _out, strm.next_out - _out);
      }
      strm.data_type = state.bits + (state.last ? 64 : 0) + (state.mode === TYPE ? 128 : 0) + (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0);
      if ((_in === 0 && _out === 0 || flush === Z_FINISH) && ret === Z_OK) {
        ret = Z_BUF_ERROR;
      }
      return ret;
    }
    function inflateEnd(strm) {
      if (!strm || !strm.state) {
        return Z_STREAM_ERROR;
      }
      var state = strm.state;
      if (state.window) {
        state.window = null;
      }
      strm.state = null;
      return Z_OK;
    }
    function inflateGetHeader(strm, head) {
      var state;
      if (!strm || !strm.state) {
        return Z_STREAM_ERROR;
      }
      state = strm.state;
      if ((state.wrap & 2) === 0) {
        return Z_STREAM_ERROR;
      }
      state.head = head;
      head.done = false;
      return Z_OK;
    }
    function inflateSetDictionary(strm, dictionary) {
      var dictLength = dictionary.length;
      var state;
      var dictid;
      var ret;
      if (!strm || !strm.state) {
        return Z_STREAM_ERROR;
      }
      state = strm.state;
      if (state.wrap !== 0 && state.mode !== DICT) {
        return Z_STREAM_ERROR;
      }
      if (state.mode === DICT) {
        dictid = 1;
        dictid = adler32(dictid, dictionary, dictLength, 0);
        if (dictid !== state.check) {
          return Z_DATA_ERROR;
        }
      }
      ret = updatewindow(strm, dictionary, dictLength, dictLength);
      if (ret) {
        state.mode = MEM;
        return Z_MEM_ERROR;
      }
      state.havedict = 1;
      return Z_OK;
    }
    exports2.inflateReset = inflateReset;
    exports2.inflateReset2 = inflateReset2;
    exports2.inflateResetKeep = inflateResetKeep;
    exports2.inflateInit = inflateInit;
    exports2.inflateInit2 = inflateInit2;
    exports2.inflate = inflate;
    exports2.inflateEnd = inflateEnd;
    exports2.inflateGetHeader = inflateGetHeader;
    exports2.inflateSetDictionary = inflateSetDictionary;
    exports2.inflateInfo = "pako inflate (from Nodeca project)";
  }
});

// node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/zlib/constants.js
var require_constants = __commonJS({
  "node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/zlib/constants.js"(exports2, module2) {
    "use strict";
    module2.exports = {
      Z_NO_FLUSH: 0,
      Z_PARTIAL_FLUSH: 1,
      Z_SYNC_FLUSH: 2,
      Z_FULL_FLUSH: 3,
      Z_FINISH: 4,
      Z_BLOCK: 5,
      Z_TREES: 6,
      Z_OK: 0,
      Z_STREAM_END: 1,
      Z_NEED_DICT: 2,
      Z_ERRNO: -1,
      Z_STREAM_ERROR: -2,
      Z_DATA_ERROR: -3,
      Z_BUF_ERROR: -5,
      Z_NO_COMPRESSION: 0,
      Z_BEST_SPEED: 1,
      Z_BEST_COMPRESSION: 9,
      Z_DEFAULT_COMPRESSION: -1,
      Z_FILTERED: 1,
      Z_HUFFMAN_ONLY: 2,
      Z_RLE: 3,
      Z_FIXED: 4,
      Z_DEFAULT_STRATEGY: 0,
      Z_BINARY: 0,
      Z_TEXT: 1,
      Z_UNKNOWN: 2,
      Z_DEFLATED: 8
    };
  }
});

// node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/zlib/gzheader.js
var require_gzheader = __commonJS({
  "node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/zlib/gzheader.js"(exports2, module2) {
    "use strict";
    function GZheader() {
      this.text = 0;
      this.time = 0;
      this.xflags = 0;
      this.os = 0;
      this.extra = null;
      this.extra_len = 0;
      this.name = "";
      this.comment = "";
      this.hcrc = 0;
      this.done = false;
    }
    module2.exports = GZheader;
  }
});

// node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/inflate.js
var require_inflate2 = __commonJS({
  "node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/inflate.js"(exports2) {
    "use strict";
    var zlib_inflate = require_inflate();
    var utils = require_common();
    var strings = require_strings();
    var c = require_constants();
    var msg = require_messages();
    var ZStream = require_zstream();
    var GZheader = require_gzheader();
    var toString = Object.prototype.toString;
    function Inflate(options) {
      if (!(this instanceof Inflate))
        return new Inflate(options);
      this.options = utils.assign({
        chunkSize: 16384,
        windowBits: 0,
        to: ""
      }, options || {});
      var opt = this.options;
      if (opt.raw && opt.windowBits >= 0 && opt.windowBits < 16) {
        opt.windowBits = -opt.windowBits;
        if (opt.windowBits === 0) {
          opt.windowBits = -15;
        }
      }
      if (opt.windowBits >= 0 && opt.windowBits < 16 && !(options && options.windowBits)) {
        opt.windowBits += 32;
      }
      if (opt.windowBits > 15 && opt.windowBits < 48) {
        if ((opt.windowBits & 15) === 0) {
          opt.windowBits |= 15;
        }
      }
      this.err = 0;
      this.msg = "";
      this.ended = false;
      this.chunks = [];
      this.strm = new ZStream();
      this.strm.avail_out = 0;
      var status = zlib_inflate.inflateInit2(this.strm, opt.windowBits);
      if (status !== c.Z_OK) {
        throw new Error(msg[status]);
      }
      this.header = new GZheader();
      zlib_inflate.inflateGetHeader(this.strm, this.header);
      if (opt.dictionary) {
        if (typeof opt.dictionary === "string") {
          opt.dictionary = strings.string2buf(opt.dictionary);
        } else if (toString.call(opt.dictionary) === "[object ArrayBuffer]") {
          opt.dictionary = new Uint8Array(opt.dictionary);
        }
        if (opt.raw) {
          status = zlib_inflate.inflateSetDictionary(this.strm, opt.dictionary);
          if (status !== c.Z_OK) {
            throw new Error(msg[status]);
          }
        }
      }
    }
    Inflate.prototype.push = function(data, mode) {
      var strm = this.strm;
      var chunkSize = this.options.chunkSize;
      var dictionary = this.options.dictionary;
      var status, _mode;
      var next_out_utf8, tail, utf8str;
      var allowBufError = false;
      if (this.ended) {
        return false;
      }
      _mode = mode === ~~mode ? mode : mode === true ? c.Z_FINISH : c.Z_NO_FLUSH;
      if (typeof data === "string") {
        strm.input = strings.binstring2buf(data);
      } else if (toString.call(data) === "[object ArrayBuffer]") {
        strm.input = new Uint8Array(data);
      } else {
        strm.input = data;
      }
      strm.next_in = 0;
      strm.avail_in = strm.input.length;
      do {
        if (strm.avail_out === 0) {
          strm.output = new utils.Buf8(chunkSize);
          strm.next_out = 0;
          strm.avail_out = chunkSize;
        }
        status = zlib_inflate.inflate(strm, c.Z_NO_FLUSH);
        if (status === c.Z_NEED_DICT && dictionary) {
          status = zlib_inflate.inflateSetDictionary(this.strm, dictionary);
        }
        if (status === c.Z_BUF_ERROR && allowBufError === true) {
          status = c.Z_OK;
          allowBufError = false;
        }
        if (status !== c.Z_STREAM_END && status !== c.Z_OK) {
          this.onEnd(status);
          this.ended = true;
          return false;
        }
        if (strm.next_out) {
          if (strm.avail_out === 0 || status === c.Z_STREAM_END || strm.avail_in === 0 && (_mode === c.Z_FINISH || _mode === c.Z_SYNC_FLUSH)) {
            if (this.options.to === "string") {
              next_out_utf8 = strings.utf8border(strm.output, strm.next_out);
              tail = strm.next_out - next_out_utf8;
              utf8str = strings.buf2string(strm.output, next_out_utf8);
              strm.next_out = tail;
              strm.avail_out = chunkSize - tail;
              if (tail) {
                utils.arraySet(strm.output, strm.output, next_out_utf8, tail, 0);
              }
              this.onData(utf8str);
            } else {
              this.onData(utils.shrinkBuf(strm.output, strm.next_out));
            }
          }
        }
        if (strm.avail_in === 0 && strm.avail_out === 0) {
          allowBufError = true;
        }
      } while ((strm.avail_in > 0 || strm.avail_out === 0) && status !== c.Z_STREAM_END);
      if (status === c.Z_STREAM_END) {
        _mode = c.Z_FINISH;
      }
      if (_mode === c.Z_FINISH) {
        status = zlib_inflate.inflateEnd(this.strm);
        this.onEnd(status);
        this.ended = true;
        return status === c.Z_OK;
      }
      if (_mode === c.Z_SYNC_FLUSH) {
        this.onEnd(c.Z_OK);
        strm.avail_out = 0;
        return true;
      }
      return true;
    };
    Inflate.prototype.onData = function(chunk) {
      this.chunks.push(chunk);
    };
    Inflate.prototype.onEnd = function(status) {
      if (status === c.Z_OK) {
        if (this.options.to === "string") {
          this.result = this.chunks.join("");
        } else {
          this.result = utils.flattenChunks(this.chunks);
        }
      }
      this.chunks = [];
      this.err = status;
      this.msg = this.strm.msg;
    };
    function inflate(input, options) {
      var inflator = new Inflate(options);
      inflator.push(input, true);
      if (inflator.err) {
        throw inflator.msg || msg[inflator.err];
      }
      return inflator.result;
    }
    function inflateRaw(input, options) {
      options = options || {};
      options.raw = true;
      return inflate(input, options);
    }
    exports2.Inflate = Inflate;
    exports2.inflate = inflate;
    exports2.inflateRaw = inflateRaw;
    exports2.ungzip = inflate;
  }
});

// node_modules/.pnpm/pako@1.0.11/node_modules/pako/index.js
var require_pako = __commonJS({
  "node_modules/.pnpm/pako@1.0.11/node_modules/pako/index.js"(exports2, module2) {
    "use strict";
    var assign = require_common().assign;
    var deflate = require_deflate2();
    var inflate = require_inflate2();
    var constants2 = require_constants();
    var pako = {};
    assign(pako, deflate, inflate, constants2);
    module2.exports = pako;
  }
});

// node_modules/.pnpm/ignore@5.1.9/node_modules/ignore/index.js
var require_ignore = __commonJS({
  "node_modules/.pnpm/ignore@5.1.9/node_modules/ignore/index.js"(exports2, module2) {
    function makeArray(subject) {
      return Array.isArray(subject) ? subject : [subject];
    }
    var EMPTY = "";
    var SPACE = " ";
    var ESCAPE = "\\";
    var REGEX_TEST_BLANK_LINE = /^\s+$/;
    var REGEX_REPLACE_LEADING_EXCAPED_EXCLAMATION = /^\\!/;
    var REGEX_REPLACE_LEADING_EXCAPED_HASH = /^\\#/;
    var REGEX_SPLITALL_CRLF = /\r?\n/g;
    var REGEX_TEST_INVALID_PATH = /^\.*\/|^\.+$/;
    var SLASH = "/";
    var KEY_IGNORE = typeof Symbol !== "undefined" ? Symbol.for("node-ignore") : "node-ignore";
    var define2 = (object, key, value2) => Object.defineProperty(object, key, { value: value2 });
    var REGEX_REGEXP_RANGE = /([0-z])-([0-z])/g;
    var sanitizeRange = (range) => range.replace(REGEX_REGEXP_RANGE, (match, from, to) => from.charCodeAt(0) <= to.charCodeAt(0) ? match : EMPTY);
    var cleanRangeBackSlash = (slashes) => {
      const { length } = slashes;
      return slashes.slice(0, length - length % 2);
    };
    var REPLACERS = [
      [
        /\\?\s+$/,
        (match) => match.indexOf("\\") === 0 ? SPACE : EMPTY
      ],
      [
        /\\\s/g,
        () => SPACE
      ],
      [
        /[\\$.|*+(){^]/g,
        (match) => `\\${match}`
      ],
      [
        /(?!\\)\?/g,
        () => "[^/]"
      ],
      [
        /^\//,
        () => "^"
      ],
      [
        /\//g,
        () => "\\/"
      ],
      [
        /^\^*\\\*\\\*\\\//,
        () => "^(?:.*\\/)?"
      ],
      [
        /^(?=[^^])/,
        function startingReplacer() {
          return !/\/(?!$)/.test(this) ? "(?:^|\\/)" : "^";
        }
      ],
      [
        /\\\/\\\*\\\*(?=\\\/|$)/g,
        (_, index, str) => index + 6 < str.length ? "(?:\\/[^\\/]+)*" : "\\/.+"
      ],
      [
        /(^|[^\\]+)\\\*(?=.+)/g,
        (_, p1) => `${p1}[^\\/]*`
      ],
      [
        /\\\\\\(?=[$.|*+(){^])/g,
        () => ESCAPE
      ],
      [
        /\\\\/g,
        () => ESCAPE
      ],
      [
        /(\\)?\[([^\]/]*?)(\\*)($|\])/g,
        (match, leadEscape, range, endEscape, close2) => leadEscape === ESCAPE ? `\\[${range}${cleanRangeBackSlash(endEscape)}${close2}` : close2 === "]" ? endEscape.length % 2 === 0 ? `[${sanitizeRange(range)}${endEscape}]` : "[]" : "[]"
      ],
      [
        /(?:[^*])$/,
        (match) => /\/$/.test(match) ? `${match}$` : `${match}(?=$|\\/$)`
      ],
      [
        /(\^|\\\/)?\\\*$/,
        (_, p1) => {
          const prefix = p1 ? `${p1}[^/]+` : "[^/]*";
          return `${prefix}(?=$|\\/$)`;
        }
      ]
    ];
    var regexCache = Object.create(null);
    var makeRegex = (pattern, ignorecase) => {
      let source = regexCache[pattern];
      if (!source) {
        source = REPLACERS.reduce((prev, current) => prev.replace(current[0], current[1].bind(pattern)), pattern);
        regexCache[pattern] = source;
      }
      return ignorecase ? new RegExp(source, "i") : new RegExp(source);
    };
    var isString = (subject) => typeof subject === "string";
    var checkPattern = (pattern) => pattern && isString(pattern) && !REGEX_TEST_BLANK_LINE.test(pattern) && pattern.indexOf("#") !== 0;
    var splitPattern = (pattern) => pattern.split(REGEX_SPLITALL_CRLF);
    var IgnoreRule = class {
      constructor(origin, pattern, negative, regex) {
        this.origin = origin;
        this.pattern = pattern;
        this.negative = negative;
        this.regex = regex;
      }
    };
    var createRule = (pattern, ignorecase) => {
      const origin = pattern;
      let negative = false;
      if (pattern.indexOf("!") === 0) {
        negative = true;
        pattern = pattern.substr(1);
      }
      pattern = pattern.replace(REGEX_REPLACE_LEADING_EXCAPED_EXCLAMATION, "!").replace(REGEX_REPLACE_LEADING_EXCAPED_HASH, "#");
      const regex = makeRegex(pattern, ignorecase);
      return new IgnoreRule(origin, pattern, negative, regex);
    };
    var throwError = (message, Ctor) => {
      throw new Ctor(message);
    };
    var checkPath = (path2, originalPath, doThrow) => {
      if (!isString(path2)) {
        return doThrow(`path must be a string, but got \`${originalPath}\``, TypeError);
      }
      if (!path2) {
        return doThrow(`path must not be empty`, TypeError);
      }
      if (checkPath.isNotRelative(path2)) {
        const r = "`path.relative()`d";
        return doThrow(`path should be a ${r} string, but got "${originalPath}"`, RangeError);
      }
      return true;
    };
    var isNotRelative = (path2) => REGEX_TEST_INVALID_PATH.test(path2);
    checkPath.isNotRelative = isNotRelative;
    checkPath.convert = (p) => p;
    var Ignore = class {
      constructor({
        ignorecase = true
      } = {}) {
        define2(this, KEY_IGNORE, true);
        this._rules = [];
        this._ignorecase = ignorecase;
        this._initCache();
      }
      _initCache() {
        this._ignoreCache = Object.create(null);
        this._testCache = Object.create(null);
      }
      _addPattern(pattern) {
        if (pattern && pattern[KEY_IGNORE]) {
          this._rules = this._rules.concat(pattern._rules);
          this._added = true;
          return;
        }
        if (checkPattern(pattern)) {
          const rule = createRule(pattern, this._ignorecase);
          this._added = true;
          this._rules.push(rule);
        }
      }
      add(pattern) {
        this._added = false;
        makeArray(isString(pattern) ? splitPattern(pattern) : pattern).forEach(this._addPattern, this);
        if (this._added) {
          this._initCache();
        }
        return this;
      }
      addPattern(pattern) {
        return this.add(pattern);
      }
      _testOne(path2, checkUnignored) {
        let ignored = false;
        let unignored = false;
        this._rules.forEach((rule) => {
          const { negative } = rule;
          if (unignored === negative && ignored !== unignored || negative && !ignored && !unignored && !checkUnignored) {
            return;
          }
          const matched = rule.regex.test(path2);
          if (matched) {
            ignored = !negative;
            unignored = negative;
          }
        });
        return {
          ignored,
          unignored
        };
      }
      _test(originalPath, cache, checkUnignored, slices) {
        const path2 = originalPath && checkPath.convert(originalPath);
        checkPath(path2, originalPath, throwError);
        return this._t(path2, cache, checkUnignored, slices);
      }
      _t(path2, cache, checkUnignored, slices) {
        if (path2 in cache) {
          return cache[path2];
        }
        if (!slices) {
          slices = path2.split(SLASH);
        }
        slices.pop();
        if (!slices.length) {
          return cache[path2] = this._testOne(path2, checkUnignored);
        }
        const parent = this._t(slices.join(SLASH) + SLASH, cache, checkUnignored, slices);
        return cache[path2] = parent.ignored ? parent : this._testOne(path2, checkUnignored);
      }
      ignores(path2) {
        return this._test(path2, this._ignoreCache, false).ignored;
      }
      createFilter() {
        return (path2) => !this.ignores(path2);
      }
      filter(paths) {
        return makeArray(paths).filter(this.createFilter());
      }
      test(path2) {
        return this._test(path2, this._testCache, true);
      }
    };
    var factory = (options) => new Ignore(options);
    var returnFalse = () => false;
    var isPathValid = (path2) => checkPath(path2 && checkPath.convert(path2), path2, returnFalse);
    factory.isPathValid = isPathValid;
    factory.default = factory;
    module2.exports = factory;
    if (typeof process !== "undefined" && (process.env && process.env.IGNORE_TEST_WIN32 || process.platform === "win32")) {
      const makePosix = (str) => /^\\\\\?\\/.test(str) || /["<>|\u0000-\u001F]+/u.test(str) ? str : str.replace(/\\/g, "/");
      checkPath.convert = makePosix;
      const REGIX_IS_WINDOWS_PATH_ABSOLUTE = /^[a-z]:\//i;
      checkPath.isNotRelative = (path2) => REGIX_IS_WINDOWS_PATH_ABSOLUTE.test(path2) || isNotRelative(path2);
    }
  }
});

// node_modules/.pnpm/pify@4.0.1/node_modules/pify/index.js
var require_pify = __commonJS({
  "node_modules/.pnpm/pify@4.0.1/node_modules/pify/index.js"(exports2, module2) {
    "use strict";
    var processFn = (fn, options) => function(...args) {
      const P = options.promiseModule;
      return new P((resolve, reject) => {
        if (options.multiArgs) {
          args.push((...result) => {
            if (options.errorFirst) {
              if (result[0]) {
                reject(result);
              } else {
                result.shift();
                resolve(result);
              }
            } else {
              resolve(result);
            }
          });
        } else if (options.errorFirst) {
          args.push((error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
        } else {
          args.push(resolve);
        }
        fn.apply(this, args);
      });
    };
    module2.exports = (input, options) => {
      options = Object.assign({
        exclude: [/.+(Sync|Stream)$/],
        errorFirst: true,
        promiseModule: Promise
      }, options);
      const objType = typeof input;
      if (!(input !== null && (objType === "object" || objType === "function"))) {
        throw new TypeError(`Expected \`input\` to be a \`Function\` or \`Object\`, got \`${input === null ? "null" : objType}\``);
      }
      const filter = (key) => {
        const match = (pattern) => typeof pattern === "string" ? key === pattern : pattern.test(key);
        return options.include ? options.include.some(match) : !options.exclude.some(match);
      };
      let ret;
      if (objType === "function") {
        ret = function(...args) {
          return options.excludeMain ? input(...args) : processFn(input, options).apply(this, args);
        };
      } else {
        ret = Object.create(Object.getPrototypeOf(input));
      }
      for (const key in input) {
        const property = input[key];
        ret[key] = typeof property === "function" && filter(key) ? processFn(property, options) : property;
      }
      return ret;
    };
  }
});

// node_modules/.pnpm/clean-git-ref@2.0.1/node_modules/clean-git-ref/lib/index.js
var require_lib2 = __commonJS({
  "node_modules/.pnpm/clean-git-ref@2.0.1/node_modules/clean-git-ref/lib/index.js"(exports2, module2) {
    "use strict";
    function escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
    function replaceAll(str, search, replacement) {
      search = search instanceof RegExp ? search : new RegExp(escapeRegExp(search), "g");
      return str.replace(search, replacement);
    }
    var CleanGitRef = {
      clean: function clean(value2) {
        if (typeof value2 !== "string") {
          throw new Error("Expected a string, received: " + value2);
        }
        value2 = replaceAll(value2, "./", "/");
        value2 = replaceAll(value2, "..", ".");
        value2 = replaceAll(value2, " ", "-");
        value2 = replaceAll(value2, /^[~^:?*\\\-]/g, "");
        value2 = replaceAll(value2, /[~^:?*\\]/g, "-");
        value2 = replaceAll(value2, /[~^:?*\\\-]$/g, "");
        value2 = replaceAll(value2, "@{", "-");
        value2 = replaceAll(value2, /\.$/g, "");
        value2 = replaceAll(value2, /\/$/g, "");
        value2 = replaceAll(value2, /\.lock$/g, "");
        return value2;
      }
    };
    module2.exports = CleanGitRef;
  }
});

// node_modules/.pnpm/diff3@0.0.3/node_modules/diff3/onp.js
var require_onp = __commonJS({
  "node_modules/.pnpm/diff3@0.0.3/node_modules/diff3/onp.js"(exports2, module2) {
    module2.exports = function(a_, b_) {
      var a = a_, b = b_, m = a.length, n = b.length, reverse = false, ed = null, offset = m + 1, path2 = [], pathposi = [], ses = [], lcs = "", SES_DELETE = -1, SES_COMMON = 0, SES_ADD = 1;
      var tmp1, tmp2;
      var init = function() {
        if (m >= n) {
          tmp1 = a;
          tmp2 = m;
          a = b;
          b = tmp1;
          m = n;
          n = tmp2;
          reverse = true;
          offset = m + 1;
        }
      };
      var P = function(x, y, k) {
        return {
          "x": x,
          "y": y,
          "k": k
        };
      };
      var seselem = function(elem, t) {
        return {
          "elem": elem,
          "t": t
        };
      };
      var snake = function(k, p, pp) {
        var r, x, y;
        if (p > pp) {
          r = path2[k - 1 + offset];
        } else {
          r = path2[k + 1 + offset];
        }
        y = Math.max(p, pp);
        x = y - k;
        while (x < m && y < n && a[x] === b[y]) {
          ++x;
          ++y;
        }
        path2[k + offset] = pathposi.length;
        pathposi[pathposi.length] = new P(x, y, r);
        return y;
      };
      var recordseq = function(epc) {
        var x_idx, y_idx, px_idx, py_idx, i2;
        x_idx = y_idx = 1;
        px_idx = py_idx = 0;
        for (i2 = epc.length - 1; i2 >= 0; --i2) {
          while (px_idx < epc[i2].x || py_idx < epc[i2].y) {
            if (epc[i2].y - epc[i2].x > py_idx - px_idx) {
              if (reverse) {
                ses[ses.length] = new seselem(b[py_idx], SES_DELETE);
              } else {
                ses[ses.length] = new seselem(b[py_idx], SES_ADD);
              }
              ++y_idx;
              ++py_idx;
            } else if (epc[i2].y - epc[i2].x < py_idx - px_idx) {
              if (reverse) {
                ses[ses.length] = new seselem(a[px_idx], SES_ADD);
              } else {
                ses[ses.length] = new seselem(a[px_idx], SES_DELETE);
              }
              ++x_idx;
              ++px_idx;
            } else {
              ses[ses.length] = new seselem(a[px_idx], SES_COMMON);
              lcs += a[px_idx];
              ++x_idx;
              ++y_idx;
              ++px_idx;
              ++py_idx;
            }
          }
        }
      };
      init();
      return {
        SES_DELETE: -1,
        SES_COMMON: 0,
        SES_ADD: 1,
        editdistance: function() {
          return ed;
        },
        getlcs: function() {
          return lcs;
        },
        getses: function() {
          return ses;
        },
        compose: function() {
          var delta, size, fp, p, r, epc, i2, k;
          delta = n - m;
          size = m + n + 3;
          fp = {};
          for (i2 = 0; i2 < size; ++i2) {
            fp[i2] = -1;
            path2[i2] = -1;
          }
          p = -1;
          do {
            ++p;
            for (k = -p; k <= delta - 1; ++k) {
              fp[k + offset] = snake(k, fp[k - 1 + offset] + 1, fp[k + 1 + offset]);
            }
            for (k = delta + p; k >= delta + 1; --k) {
              fp[k + offset] = snake(k, fp[k - 1 + offset] + 1, fp[k + 1 + offset]);
            }
            fp[delta + offset] = snake(delta, fp[delta - 1 + offset] + 1, fp[delta + 1 + offset]);
          } while (fp[delta + offset] !== n);
          ed = delta + 2 * p;
          r = path2[delta + offset];
          epc = [];
          while (r !== -1) {
            epc[epc.length] = new P(pathposi[r].x, pathposi[r].y, null);
            r = pathposi[r].k;
          }
          recordseq(epc);
        }
      };
    };
  }
});

// node_modules/.pnpm/diff3@0.0.3/node_modules/diff3/diff3.js
var require_diff3 = __commonJS({
  "node_modules/.pnpm/diff3@0.0.3/node_modules/diff3/diff3.js"(exports2, module2) {
    var onp = require_onp();
    function longestCommonSubsequence(file1, file2) {
      var diff = new onp(file1, file2);
      diff.compose();
      var ses = diff.getses();
      var root2;
      var prev;
      var file1RevIdx = file1.length - 1, file2RevIdx = file2.length - 1;
      for (var i2 = ses.length - 1; i2 >= 0; --i2) {
        if (ses[i2].t === diff.SES_COMMON) {
          if (prev) {
            prev.chain = {
              file1index: file1RevIdx,
              file2index: file2RevIdx,
              chain: null
            };
            prev = prev.chain;
          } else {
            root2 = {
              file1index: file1RevIdx,
              file2index: file2RevIdx,
              chain: null
            };
            prev = root2;
          }
          file1RevIdx--;
          file2RevIdx--;
        } else if (ses[i2].t === diff.SES_DELETE) {
          file1RevIdx--;
        } else if (ses[i2].t === diff.SES_ADD) {
          file2RevIdx--;
        }
      }
      var tail = {
        file1index: -1,
        file2index: -1,
        chain: null
      };
      if (!prev) {
        return tail;
      }
      prev.chain = tail;
      return root2;
    }
    function diffIndices(file1, file2) {
      var result = [];
      var tail1 = file1.length;
      var tail2 = file2.length;
      for (var candidate = longestCommonSubsequence(file1, file2); candidate !== null; candidate = candidate.chain) {
        var mismatchLength1 = tail1 - candidate.file1index - 1;
        var mismatchLength2 = tail2 - candidate.file2index - 1;
        tail1 = candidate.file1index;
        tail2 = candidate.file2index;
        if (mismatchLength1 || mismatchLength2) {
          result.push({
            file1: [tail1 + 1, mismatchLength1],
            file2: [tail2 + 1, mismatchLength2]
          });
        }
      }
      result.reverse();
      return result;
    }
    function diff3MergeIndices(a, o, b) {
      var i2;
      var m1 = diffIndices(o, a);
      var m2 = diffIndices(o, b);
      var hunks = [];
      function addHunk(h, side2) {
        hunks.push([h.file1[0], side2, h.file1[1], h.file2[0], h.file2[1]]);
      }
      for (i2 = 0; i2 < m1.length; i2++) {
        addHunk(m1[i2], 0);
      }
      for (i2 = 0; i2 < m2.length; i2++) {
        addHunk(m2[i2], 2);
      }
      hunks.sort(function(x, y) {
        return x[0] - y[0];
      });
      var result = [];
      var commonOffset = 0;
      function copyCommon(targetOffset) {
        if (targetOffset > commonOffset) {
          result.push([1, commonOffset, targetOffset - commonOffset]);
          commonOffset = targetOffset;
        }
      }
      for (var hunkIndex = 0; hunkIndex < hunks.length; hunkIndex++) {
        var firstHunkIndex = hunkIndex;
        var hunk = hunks[hunkIndex];
        var regionLhs = hunk[0];
        var regionRhs = regionLhs + hunk[2];
        while (hunkIndex < hunks.length - 1) {
          var maybeOverlapping = hunks[hunkIndex + 1];
          var maybeLhs = maybeOverlapping[0];
          if (maybeLhs > regionRhs)
            break;
          regionRhs = Math.max(regionRhs, maybeLhs + maybeOverlapping[2]);
          hunkIndex++;
        }
        copyCommon(regionLhs);
        if (firstHunkIndex == hunkIndex) {
          if (hunk[4] > 0) {
            result.push([hunk[1], hunk[3], hunk[4]]);
          }
        } else {
          var regions = {
            0: [a.length, -1, o.length, -1],
            2: [b.length, -1, o.length, -1]
          };
          for (i2 = firstHunkIndex; i2 <= hunkIndex; i2++) {
            hunk = hunks[i2];
            var side = hunk[1];
            var r = regions[side];
            var oLhs = hunk[0];
            var oRhs = oLhs + hunk[2];
            var abLhs = hunk[3];
            var abRhs = abLhs + hunk[4];
            r[0] = Math.min(abLhs, r[0]);
            r[1] = Math.max(abRhs, r[1]);
            r[2] = Math.min(oLhs, r[2]);
            r[3] = Math.max(oRhs, r[3]);
          }
          var aLhs = regions[0][0] + (regionLhs - regions[0][2]);
          var aRhs = regions[0][1] + (regionRhs - regions[0][3]);
          var bLhs = regions[2][0] + (regionLhs - regions[2][2]);
          var bRhs = regions[2][1] + (regionRhs - regions[2][3]);
          result.push([
            -1,
            aLhs,
            aRhs - aLhs,
            regionLhs,
            regionRhs - regionLhs,
            bLhs,
            bRhs - bLhs
          ]);
        }
        commonOffset = regionRhs;
      }
      copyCommon(o.length);
      return result;
    }
    function diff3Merge(a, o, b) {
      var result = [];
      var files = [a, o, b];
      var indices = diff3MergeIndices(a, o, b);
      var okLines = [];
      function flushOk() {
        if (okLines.length) {
          result.push({
            ok: okLines
          });
        }
        okLines = [];
      }
      function pushOk(xs) {
        for (var j = 0; j < xs.length; j++) {
          okLines.push(xs[j]);
        }
      }
      function isTrueConflict(rec) {
        if (rec[2] != rec[6])
          return true;
        var aoff = rec[1];
        var boff = rec[5];
        for (var j = 0; j < rec[2]; j++) {
          if (a[j + aoff] != b[j + boff])
            return true;
        }
        return false;
      }
      for (var i2 = 0; i2 < indices.length; i2++) {
        var x = indices[i2];
        var side = x[0];
        if (side == -1) {
          if (!isTrueConflict(x)) {
            pushOk(files[0].slice(x[1], x[1] + x[2]));
          } else {
            flushOk();
            result.push({
              conflict: {
                a: a.slice(x[1], x[1] + x[2]),
                aIndex: x[1],
                o: o.slice(x[3], x[3] + x[4]),
                oIndex: x[3],
                b: b.slice(x[5], x[5] + x[6]),
                bIndex: x[5]
              }
            });
          }
        } else {
          pushOk(files[side].slice(x[1], x[1] + x[2]));
        }
      }
      flushOk();
      return result;
    }
    module2.exports = diff3Merge;
  }
});

// node_modules/.pnpm/isomorphic-git@1.10.3/node_modules/isomorphic-git/index.cjs
var require_isomorphic_git = __commonJS({
  "node_modules/.pnpm/isomorphic-git@1.10.3/node_modules/isomorphic-git/index.cjs"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    function _interopDefault(ex) {
      return ex && typeof ex === "object" && "default" in ex ? ex["default"] : ex;
    }
    var AsyncLock = _interopDefault(require_async_lock());
    var Hash = _interopDefault(require_sha1());
    var crc32 = _interopDefault(require_crc32());
    var pako = _interopDefault(require_pako());
    var ignore = _interopDefault(require_ignore());
    var pify = _interopDefault(require_pify());
    var cleanGitRef = _interopDefault(require_lib2());
    var diff3Merge = _interopDefault(require_diff3());
    var BaseError = class extends Error {
      constructor(message) {
        super(message);
        this.caller = "";
      }
      toJSON() {
        return {
          code: this.code,
          data: this.data,
          caller: this.caller,
          message: this.message,
          stack: this.stack
        };
      }
      fromJSON(json) {
        const e = new BaseError(json.message);
        e.code = json.code;
        e.data = json.data;
        e.caller = json.caller;
        e.stack = json.stack;
        return e;
      }
      get isIsomorphicGitError() {
        return true;
      }
    };
    var InternalError = class extends BaseError {
      constructor(message) {
        super(`An internal error caused this command to fail. Please file a bug report at https://github.com/isomorphic-git/isomorphic-git/issues with this error message: ${message}`);
        this.code = this.name = InternalError.code;
        this.data = { message };
      }
    };
    InternalError.code = "InternalError";
    var UnsafeFilepathError = class extends BaseError {
      constructor(filepath) {
        super(`The filepath "${filepath}" contains unsafe character sequences`);
        this.code = this.name = UnsafeFilepathError.code;
        this.data = { filepath };
      }
    };
    UnsafeFilepathError.code = "UnsafeFilepathError";
    var BufferCursor = class {
      constructor(buffer) {
        this.buffer = buffer;
        this._start = 0;
      }
      eof() {
        return this._start >= this.buffer.length;
      }
      tell() {
        return this._start;
      }
      seek(n) {
        this._start = n;
      }
      slice(n) {
        const r = this.buffer.slice(this._start, this._start + n);
        this._start += n;
        return r;
      }
      toString(enc, length) {
        const r = this.buffer.toString(enc, this._start, this._start + length);
        this._start += length;
        return r;
      }
      write(value2, length, enc) {
        const r = this.buffer.write(value2, this._start, length, enc);
        this._start += length;
        return r;
      }
      copy(source, start, end) {
        const r = source.copy(this.buffer, this._start, start, end);
        this._start += r;
        return r;
      }
      readUInt8() {
        const r = this.buffer.readUInt8(this._start);
        this._start += 1;
        return r;
      }
      writeUInt8(value2) {
        const r = this.buffer.writeUInt8(value2, this._start);
        this._start += 1;
        return r;
      }
      readUInt16BE() {
        const r = this.buffer.readUInt16BE(this._start);
        this._start += 2;
        return r;
      }
      writeUInt16BE(value2) {
        const r = this.buffer.writeUInt16BE(value2, this._start);
        this._start += 2;
        return r;
      }
      readUInt32BE() {
        const r = this.buffer.readUInt32BE(this._start);
        this._start += 4;
        return r;
      }
      writeUInt32BE(value2) {
        const r = this.buffer.writeUInt32BE(value2, this._start);
        this._start += 4;
        return r;
      }
    };
    function compareStrings(a, b) {
      return -(a < b) || +(a > b);
    }
    function comparePath(a, b) {
      return compareStrings(a.path, b.path);
    }
    function normalizeMode(mode) {
      let type = mode > 0 ? mode >> 12 : 0;
      if (type !== 4 && type !== 8 && type !== 10 && type !== 14) {
        type = 8;
      }
      let permissions = mode & 511;
      if (permissions & 73) {
        permissions = 493;
      } else {
        permissions = 420;
      }
      if (type !== 8)
        permissions = 0;
      return (type << 12) + permissions;
    }
    var MAX_UINT32 = 2 ** 32;
    function SecondsNanoseconds(givenSeconds, givenNanoseconds, milliseconds, date) {
      if (givenSeconds !== void 0 && givenNanoseconds !== void 0) {
        return [givenSeconds, givenNanoseconds];
      }
      if (milliseconds === void 0) {
        milliseconds = date.valueOf();
      }
      const seconds = Math.floor(milliseconds / 1e3);
      const nanoseconds = (milliseconds - seconds * 1e3) * 1e6;
      return [seconds, nanoseconds];
    }
    function normalizeStats(e) {
      const [ctimeSeconds, ctimeNanoseconds] = SecondsNanoseconds(e.ctimeSeconds, e.ctimeNanoseconds, e.ctimeMs, e.ctime);
      const [mtimeSeconds, mtimeNanoseconds] = SecondsNanoseconds(e.mtimeSeconds, e.mtimeNanoseconds, e.mtimeMs, e.mtime);
      return {
        ctimeSeconds: ctimeSeconds % MAX_UINT32,
        ctimeNanoseconds: ctimeNanoseconds % MAX_UINT32,
        mtimeSeconds: mtimeSeconds % MAX_UINT32,
        mtimeNanoseconds: mtimeNanoseconds % MAX_UINT32,
        dev: e.dev % MAX_UINT32,
        ino: e.ino % MAX_UINT32,
        mode: normalizeMode(e.mode % MAX_UINT32),
        uid: e.uid % MAX_UINT32,
        gid: e.gid % MAX_UINT32,
        size: e.size > -1 ? e.size % MAX_UINT32 : 0
      };
    }
    function toHex(buffer) {
      let hex = "";
      for (const byte of new Uint8Array(buffer)) {
        if (byte < 16)
          hex += "0";
        hex += byte.toString(16);
      }
      return hex;
    }
    var supportsSubtleSHA1 = null;
    async function shasum(buffer) {
      if (supportsSubtleSHA1 === null) {
        supportsSubtleSHA1 = await testSubtleSHA1();
      }
      return supportsSubtleSHA1 ? subtleSHA1(buffer) : shasumSync(buffer);
    }
    function shasumSync(buffer) {
      return new Hash().update(buffer).digest("hex");
    }
    async function subtleSHA1(buffer) {
      const hash = await crypto.subtle.digest("SHA-1", buffer);
      return toHex(hash);
    }
    async function testSubtleSHA1() {
      try {
        const hash = await subtleSHA1(new Uint8Array([]));
        if (hash === "da39a3ee5e6b4b0d3255bfef95601890afd80709")
          return true;
      } catch (_) {
      }
      return false;
    }
    function parseCacheEntryFlags(bits) {
      return {
        assumeValid: Boolean(bits & 32768),
        extended: Boolean(bits & 16384),
        stage: (bits & 12288) >> 12,
        nameLength: bits & 4095
      };
    }
    function renderCacheEntryFlags(entry) {
      const flags = entry.flags;
      flags.extended = false;
      flags.nameLength = Math.min(Buffer.from(entry.path).length, 4095);
      return (flags.assumeValid ? 32768 : 0) + (flags.extended ? 16384 : 0) + ((flags.stage & 3) << 12) + (flags.nameLength & 4095);
    }
    var GitIndex = class {
      constructor(entries) {
        this._dirty = false;
        this._entries = entries || /* @__PURE__ */ new Map();
      }
      static async from(buffer) {
        if (Buffer.isBuffer(buffer)) {
          return GitIndex.fromBuffer(buffer);
        } else if (buffer === null) {
          return new GitIndex(null);
        } else {
          throw new InternalError("invalid type passed to GitIndex.from");
        }
      }
      static async fromBuffer(buffer) {
        const shaComputed = await shasum(buffer.slice(0, -20));
        const shaClaimed = buffer.slice(-20).toString("hex");
        if (shaClaimed !== shaComputed) {
          throw new InternalError(`Invalid checksum in GitIndex buffer: expected ${shaClaimed} but saw ${shaComputed}`);
        }
        const reader = new BufferCursor(buffer);
        const _entries = /* @__PURE__ */ new Map();
        const magic = reader.toString("utf8", 4);
        if (magic !== "DIRC") {
          throw new InternalError(`Inavlid dircache magic file number: ${magic}`);
        }
        const version2 = reader.readUInt32BE();
        if (version2 !== 2) {
          throw new InternalError(`Unsupported dircache version: ${version2}`);
        }
        const numEntries = reader.readUInt32BE();
        let i2 = 0;
        while (!reader.eof() && i2 < numEntries) {
          const entry = {};
          entry.ctimeSeconds = reader.readUInt32BE();
          entry.ctimeNanoseconds = reader.readUInt32BE();
          entry.mtimeSeconds = reader.readUInt32BE();
          entry.mtimeNanoseconds = reader.readUInt32BE();
          entry.dev = reader.readUInt32BE();
          entry.ino = reader.readUInt32BE();
          entry.mode = reader.readUInt32BE();
          entry.uid = reader.readUInt32BE();
          entry.gid = reader.readUInt32BE();
          entry.size = reader.readUInt32BE();
          entry.oid = reader.slice(20).toString("hex");
          const flags = reader.readUInt16BE();
          entry.flags = parseCacheEntryFlags(flags);
          const pathlength = buffer.indexOf(0, reader.tell() + 1) - reader.tell();
          if (pathlength < 1) {
            throw new InternalError(`Got a path length of: ${pathlength}`);
          }
          entry.path = reader.toString("utf8", pathlength);
          if (entry.path.includes("..\\") || entry.path.includes("../")) {
            throw new UnsafeFilepathError(entry.path);
          }
          let padding = 8 - (reader.tell() - 12) % 8;
          if (padding === 0)
            padding = 8;
          while (padding--) {
            const tmp = reader.readUInt8();
            if (tmp !== 0) {
              throw new InternalError(`Expected 1-8 null characters but got '${tmp}' after ${entry.path}`);
            } else if (reader.eof()) {
              throw new InternalError("Unexpected end of file");
            }
          }
          _entries.set(entry.path, entry);
          i2++;
        }
        return new GitIndex(_entries);
      }
      get entries() {
        return [...this._entries.values()].sort(comparePath);
      }
      get entriesMap() {
        return this._entries;
      }
      *[Symbol.iterator]() {
        for (const entry of this.entries) {
          yield entry;
        }
      }
      insert({ filepath, stats, oid }) {
        stats = normalizeStats(stats);
        const bfilepath = Buffer.from(filepath);
        const entry = {
          ctimeSeconds: stats.ctimeSeconds,
          ctimeNanoseconds: stats.ctimeNanoseconds,
          mtimeSeconds: stats.mtimeSeconds,
          mtimeNanoseconds: stats.mtimeNanoseconds,
          dev: stats.dev,
          ino: stats.ino,
          mode: stats.mode || 33188,
          uid: stats.uid,
          gid: stats.gid,
          size: stats.size,
          path: filepath,
          oid,
          flags: {
            assumeValid: false,
            extended: false,
            stage: 0,
            nameLength: bfilepath.length < 4095 ? bfilepath.length : 4095
          }
        };
        this._entries.set(entry.path, entry);
        this._dirty = true;
      }
      delete({ filepath }) {
        if (this._entries.has(filepath)) {
          this._entries.delete(filepath);
        } else {
          for (const key of this._entries.keys()) {
            if (key.startsWith(filepath + "/")) {
              this._entries.delete(key);
            }
          }
        }
        this._dirty = true;
      }
      clear() {
        this._entries.clear();
        this._dirty = true;
      }
      render() {
        return this.entries.map((entry) => `${entry.mode.toString(8)} ${entry.oid}    ${entry.path}`).join("\n");
      }
      async toObject() {
        const header = Buffer.alloc(12);
        const writer = new BufferCursor(header);
        writer.write("DIRC", 4, "utf8");
        writer.writeUInt32BE(2);
        writer.writeUInt32BE(this.entries.length);
        const body = Buffer.concat(this.entries.map((entry) => {
          const bpath = Buffer.from(entry.path);
          const length = Math.ceil((62 + bpath.length + 1) / 8) * 8;
          const written = Buffer.alloc(length);
          const writer2 = new BufferCursor(written);
          const stat2 = normalizeStats(entry);
          writer2.writeUInt32BE(stat2.ctimeSeconds);
          writer2.writeUInt32BE(stat2.ctimeNanoseconds);
          writer2.writeUInt32BE(stat2.mtimeSeconds);
          writer2.writeUInt32BE(stat2.mtimeNanoseconds);
          writer2.writeUInt32BE(stat2.dev);
          writer2.writeUInt32BE(stat2.ino);
          writer2.writeUInt32BE(stat2.mode);
          writer2.writeUInt32BE(stat2.uid);
          writer2.writeUInt32BE(stat2.gid);
          writer2.writeUInt32BE(stat2.size);
          writer2.write(entry.oid, 20, "hex");
          writer2.writeUInt16BE(renderCacheEntryFlags(entry));
          writer2.write(entry.path, bpath.length, "utf8");
          return written;
        }));
        const main = Buffer.concat([header, body]);
        const sum = await shasum(main);
        return Buffer.concat([main, Buffer.from(sum, "hex")]);
      }
    };
    function compareStats(entry, stats) {
      const e = normalizeStats(entry);
      const s = normalizeStats(stats);
      const staleness = e.mode !== s.mode || e.mtimeSeconds !== s.mtimeSeconds || e.ctimeSeconds !== s.ctimeSeconds || e.uid !== s.uid || e.gid !== s.gid || e.ino !== s.ino || e.size !== s.size;
      return staleness;
    }
    var lock = null;
    var IndexCache = Symbol("IndexCache");
    function createCache() {
      return {
        map: /* @__PURE__ */ new Map(),
        stats: /* @__PURE__ */ new Map()
      };
    }
    async function updateCachedIndexFile(fs3, filepath, cache) {
      const stat2 = await fs3.lstat(filepath);
      const rawIndexFile = await fs3.read(filepath);
      const index2 = await GitIndex.from(rawIndexFile);
      cache.map.set(filepath, index2);
      cache.stats.set(filepath, stat2);
    }
    async function isIndexStale(fs3, filepath, cache) {
      const savedStats = cache.stats.get(filepath);
      if (savedStats === void 0)
        return true;
      const currStats = await fs3.lstat(filepath);
      if (savedStats === null)
        return false;
      if (currStats === null)
        return false;
      return compareStats(savedStats, currStats);
    }
    var GitIndexManager = class {
      static async acquire({ fs: fs3, gitdir, cache }, closure) {
        if (!cache[IndexCache])
          cache[IndexCache] = createCache();
        const filepath = `${gitdir}/index`;
        if (lock === null)
          lock = new AsyncLock({ maxPending: Infinity });
        let result;
        await lock.acquire(filepath, async function() {
          if (await isIndexStale(fs3, filepath, cache[IndexCache])) {
            await updateCachedIndexFile(fs3, filepath, cache[IndexCache]);
          }
          const index2 = cache[IndexCache].map.get(filepath);
          result = await closure(index2);
          if (index2._dirty) {
            const buffer = await index2.toObject();
            await fs3.write(filepath, buffer);
            cache[IndexCache].stats.set(filepath, await fs3.lstat(filepath));
            index2._dirty = false;
          }
        });
        return result;
      }
    };
    function basename(path2) {
      const last = Math.max(path2.lastIndexOf("/"), path2.lastIndexOf("\\"));
      if (last > -1) {
        path2 = path2.slice(last + 1);
      }
      return path2;
    }
    function dirname(path2) {
      const last = Math.max(path2.lastIndexOf("/"), path2.lastIndexOf("\\"));
      if (last === -1)
        return ".";
      if (last === 0)
        return "/";
      return path2.slice(0, last);
    }
    function flatFileListToDirectoryStructure(files) {
      const inodes = /* @__PURE__ */ new Map();
      const mkdir2 = function(name2) {
        if (!inodes.has(name2)) {
          const dir = {
            type: "tree",
            fullpath: name2,
            basename: basename(name2),
            metadata: {},
            children: []
          };
          inodes.set(name2, dir);
          dir.parent = mkdir2(dirname(name2));
          if (dir.parent && dir.parent !== dir)
            dir.parent.children.push(dir);
        }
        return inodes.get(name2);
      };
      const mkfile = function(name2, metadata) {
        if (!inodes.has(name2)) {
          const file = {
            type: "blob",
            fullpath: name2,
            basename: basename(name2),
            metadata,
            parent: mkdir2(dirname(name2)),
            children: []
          };
          if (file.parent)
            file.parent.children.push(file);
          inodes.set(name2, file);
        }
        return inodes.get(name2);
      };
      mkdir2(".");
      for (const file of files) {
        mkfile(file.path, file);
      }
      return inodes;
    }
    function mode2type(mode) {
      switch (mode) {
        case 16384:
          return "tree";
        case 33188:
          return "blob";
        case 33261:
          return "blob";
        case 40960:
          return "blob";
        case 57344:
          return "commit";
      }
      throw new InternalError(`Unexpected GitTree entry mode: ${mode.toString(8)}`);
    }
    var GitWalkerIndex = class {
      constructor({ fs: fs3, gitdir, cache }) {
        this.treePromise = GitIndexManager.acquire({ fs: fs3, gitdir, cache }, async function(index2) {
          return flatFileListToDirectoryStructure(index2.entries);
        });
        const walker = this;
        this.ConstructEntry = class StageEntry {
          constructor(fullpath) {
            this._fullpath = fullpath;
            this._type = false;
            this._mode = false;
            this._stat = false;
            this._oid = false;
          }
          async type() {
            return walker.type(this);
          }
          async mode() {
            return walker.mode(this);
          }
          async stat() {
            return walker.stat(this);
          }
          async content() {
            return walker.content(this);
          }
          async oid() {
            return walker.oid(this);
          }
        };
      }
      async readdir(entry) {
        const filepath = entry._fullpath;
        const tree = await this.treePromise;
        const inode = tree.get(filepath);
        if (!inode)
          return null;
        if (inode.type === "blob")
          return null;
        if (inode.type !== "tree") {
          throw new Error(`ENOTDIR: not a directory, scandir '${filepath}'`);
        }
        const names = inode.children.map((inode2) => inode2.fullpath);
        names.sort(compareStrings);
        return names;
      }
      async type(entry) {
        if (entry._type === false) {
          await entry.stat();
        }
        return entry._type;
      }
      async mode(entry) {
        if (entry._mode === false) {
          await entry.stat();
        }
        return entry._mode;
      }
      async stat(entry) {
        if (entry._stat === false) {
          const tree = await this.treePromise;
          const inode = tree.get(entry._fullpath);
          if (!inode) {
            throw new Error(`ENOENT: no such file or directory, lstat '${entry._fullpath}'`);
          }
          const stats = inode.type === "tree" ? {} : normalizeStats(inode.metadata);
          entry._type = inode.type === "tree" ? "tree" : mode2type(stats.mode);
          entry._mode = stats.mode;
          if (inode.type === "tree") {
            entry._stat = void 0;
          } else {
            entry._stat = stats;
          }
        }
        return entry._stat;
      }
      async content(_entry) {
      }
      async oid(entry) {
        if (entry._oid === false) {
          const tree = await this.treePromise;
          const inode = tree.get(entry._fullpath);
          entry._oid = inode.metadata.oid;
        }
        return entry._oid;
      }
    };
    var GitWalkSymbol = Symbol("GitWalkSymbol");
    function STAGE() {
      const o = Object.create(null);
      Object.defineProperty(o, GitWalkSymbol, {
        value: function({ fs: fs3, gitdir, cache }) {
          return new GitWalkerIndex({ fs: fs3, gitdir, cache });
        }
      });
      Object.freeze(o);
      return o;
    }
    var NotFoundError = class extends BaseError {
      constructor(what) {
        super(`Could not find ${what}.`);
        this.code = this.name = NotFoundError.code;
        this.data = { what };
      }
    };
    NotFoundError.code = "NotFoundError";
    var ObjectTypeError = class extends BaseError {
      constructor(oid, actual, expected, filepath) {
        super(`Object ${oid} ${filepath ? `at ${filepath}` : ""}was anticipated to be a ${expected} but it is a ${actual}.`);
        this.code = this.name = ObjectTypeError.code;
        this.data = { oid, actual, expected, filepath };
      }
    };
    ObjectTypeError.code = "ObjectTypeError";
    var InvalidOidError = class extends BaseError {
      constructor(value2) {
        super(`Expected a 40-char hex object id but saw "${value2}".`);
        this.code = this.name = InvalidOidError.code;
        this.data = { value: value2 };
      }
    };
    InvalidOidError.code = "InvalidOidError";
    var NoRefspecError = class extends BaseError {
      constructor(remote) {
        super(`Could not find a fetch refspec for remote "${remote}". Make sure the config file has an entry like the following:
[remote "${remote}"]
	fetch = +refs/heads/*:refs/remotes/origin/*
`);
        this.code = this.name = NoRefspecError.code;
        this.data = { remote };
      }
    };
    NoRefspecError.code = "NoRefspecError";
    var GitPackedRefs = class {
      constructor(text) {
        this.refs = /* @__PURE__ */ new Map();
        this.parsedConfig = [];
        if (text) {
          let key = null;
          this.parsedConfig = text.trim().split("\n").map((line) => {
            if (/^\s*#/.test(line)) {
              return { line, comment: true };
            }
            const i2 = line.indexOf(" ");
            if (line.startsWith("^")) {
              const value2 = line.slice(1);
              this.refs.set(key + "^{}", value2);
              return { line, ref: key, peeled: value2 };
            } else {
              const value2 = line.slice(0, i2);
              key = line.slice(i2 + 1);
              this.refs.set(key, value2);
              return { line, ref: key, oid: value2 };
            }
          });
        }
        return this;
      }
      static from(text) {
        return new GitPackedRefs(text);
      }
      delete(ref) {
        this.parsedConfig = this.parsedConfig.filter((entry) => entry.ref !== ref);
        this.refs.delete(ref);
      }
      toString() {
        return this.parsedConfig.map(({ line }) => line).join("\n") + "\n";
      }
    };
    var GitRefSpec = class {
      constructor({ remotePath, localPath, force, matchPrefix }) {
        Object.assign(this, {
          remotePath,
          localPath,
          force,
          matchPrefix
        });
      }
      static from(refspec) {
        const [
          forceMatch,
          remotePath,
          remoteGlobMatch,
          localPath,
          localGlobMatch
        ] = refspec.match(/^(\+?)(.*?)(\*?):(.*?)(\*?)$/).slice(1);
        const force = forceMatch === "+";
        const remoteIsGlob = remoteGlobMatch === "*";
        const localIsGlob = localGlobMatch === "*";
        if (remoteIsGlob !== localIsGlob) {
          throw new InternalError("Invalid refspec");
        }
        return new GitRefSpec({
          remotePath,
          localPath,
          force,
          matchPrefix: remoteIsGlob
        });
      }
      translate(remoteBranch) {
        if (this.matchPrefix) {
          if (remoteBranch.startsWith(this.remotePath)) {
            return this.localPath + remoteBranch.replace(this.remotePath, "");
          }
        } else {
          if (remoteBranch === this.remotePath)
            return this.localPath;
        }
        return null;
      }
      reverseTranslate(localBranch) {
        if (this.matchPrefix) {
          if (localBranch.startsWith(this.localPath)) {
            return this.remotePath + localBranch.replace(this.localPath, "");
          }
        } else {
          if (localBranch === this.localPath)
            return this.remotePath;
        }
        return null;
      }
    };
    var GitRefSpecSet = class {
      constructor(rules = []) {
        this.rules = rules;
      }
      static from(refspecs) {
        const rules = [];
        for (const refspec of refspecs) {
          rules.push(GitRefSpec.from(refspec));
        }
        return new GitRefSpecSet(rules);
      }
      add(refspec) {
        const rule = GitRefSpec.from(refspec);
        this.rules.push(rule);
      }
      translate(remoteRefs) {
        const result = [];
        for (const rule of this.rules) {
          for (const remoteRef of remoteRefs) {
            const localRef = rule.translate(remoteRef);
            if (localRef) {
              result.push([remoteRef, localRef]);
            }
          }
        }
        return result;
      }
      translateOne(remoteRef) {
        let result = null;
        for (const rule of this.rules) {
          const localRef = rule.translate(remoteRef);
          if (localRef) {
            result = localRef;
          }
        }
        return result;
      }
      localNamespaces() {
        return this.rules.filter((rule) => rule.matchPrefix).map((rule) => rule.localPath.replace(/\/$/, ""));
      }
    };
    function compareRefNames(a, b) {
      const _a = a.replace(/\^\{\}$/, "");
      const _b = b.replace(/\^\{\}$/, "");
      const tmp = -(_a < _b) || +(_a > _b);
      if (tmp === 0) {
        return a.endsWith("^{}") ? 1 : -1;
      }
      return tmp;
    }
    function normalizePath(path2) {
      return path2.replace(/\/\.\//g, "/").replace(/\/{2,}/g, "/").replace(/^\/\.$/, "/").replace(/^\.\/$/, ".").replace(/^\.\//, "").replace(/\/\.$/, "").replace(/(.+)\/$/, "$1").replace(/^$/, ".");
    }
    function join9(...parts) {
      return normalizePath(parts.map(normalizePath).join("/"));
    }
    var num = (val) => {
      val = val.toLowerCase();
      let n = parseInt(val);
      if (val.endsWith("k"))
        n *= 1024;
      if (val.endsWith("m"))
        n *= 1024 * 1024;
      if (val.endsWith("g"))
        n *= 1024 * 1024 * 1024;
      return n;
    };
    var bool = (val) => {
      val = val.trim().toLowerCase();
      if (val === "true" || val === "yes" || val === "on")
        return true;
      if (val === "false" || val === "no" || val === "off")
        return false;
      throw Error(`Expected 'true', 'false', 'yes', 'no', 'on', or 'off', but got ${val}`);
    };
    var schema = {
      core: {
        filemode: bool,
        bare: bool,
        logallrefupdates: bool,
        symlinks: bool,
        ignorecase: bool,
        bigFileThreshold: num
      }
    };
    var SECTION_LINE_REGEX = /^\[([A-Za-z0-9-.]+)(?: "(.*)")?\]$/;
    var SECTION_REGEX = /^[A-Za-z0-9-.]+$/;
    var VARIABLE_LINE_REGEX = /^([A-Za-z][A-Za-z-]*)(?: *= *(.*))?$/;
    var VARIABLE_NAME_REGEX = /^[A-Za-z][A-Za-z-]*$/;
    var VARIABLE_VALUE_COMMENT_REGEX = /^(.*?)( *[#;].*)$/;
    var extractSectionLine = (line) => {
      const matches = SECTION_LINE_REGEX.exec(line);
      if (matches != null) {
        const [section, subsection] = matches.slice(1);
        return [section, subsection];
      }
      return null;
    };
    var extractVariableLine = (line) => {
      const matches = VARIABLE_LINE_REGEX.exec(line);
      if (matches != null) {
        const [name2, rawValue = "true"] = matches.slice(1);
        const valueWithoutComments = removeComments(rawValue);
        const valueWithoutQuotes = removeQuotes(valueWithoutComments);
        return [name2, valueWithoutQuotes];
      }
      return null;
    };
    var removeComments = (rawValue) => {
      const commentMatches = VARIABLE_VALUE_COMMENT_REGEX.exec(rawValue);
      if (commentMatches == null) {
        return rawValue;
      }
      const [valueWithoutComment, comment] = commentMatches.slice(1);
      if (hasOddNumberOfQuotes(valueWithoutComment) && hasOddNumberOfQuotes(comment)) {
        return `${valueWithoutComment}${comment}`;
      }
      return valueWithoutComment;
    };
    var hasOddNumberOfQuotes = (text) => {
      const numberOfQuotes = (text.match(/(?:^|[^\\])"/g) || []).length;
      return numberOfQuotes % 2 !== 0;
    };
    var removeQuotes = (text) => {
      return text.split("").reduce((newText, c, idx, text2) => {
        const isQuote = c === '"' && text2[idx - 1] !== "\\";
        const isEscapeForQuote = c === "\\" && text2[idx + 1] === '"';
        if (isQuote || isEscapeForQuote) {
          return newText;
        }
        return newText + c;
      }, "");
    };
    var lower = (text) => {
      return text != null ? text.toLowerCase() : null;
    };
    var getPath = (section, subsection, name2) => {
      return [lower(section), subsection, lower(name2)].filter((a) => a != null).join(".");
    };
    var findLastIndex = (array, callback) => {
      return array.reduce((lastIndex, item2, index2) => {
        return callback(item2) ? index2 : lastIndex;
      }, -1);
    };
    var GitConfig = class {
      constructor(text) {
        let section = null;
        let subsection = null;
        this.parsedConfig = text.split("\n").map((line) => {
          let name2 = null;
          let value2 = null;
          const trimmedLine = line.trim();
          const extractedSection = extractSectionLine(trimmedLine);
          const isSection = extractedSection != null;
          if (isSection) {
            ;
            [section, subsection] = extractedSection;
          } else {
            const extractedVariable = extractVariableLine(trimmedLine);
            const isVariable = extractedVariable != null;
            if (isVariable) {
              ;
              [name2, value2] = extractedVariable;
            }
          }
          const path2 = getPath(section, subsection, name2);
          return { line, isSection, section, subsection, name: name2, value: value2, path: path2 };
        });
      }
      static from(text) {
        return new GitConfig(text);
      }
      async get(path2, getall = false) {
        const allValues = this.parsedConfig.filter((config) => config.path === path2.toLowerCase()).map(({ section, name: name2, value: value2 }) => {
          const fn = schema[section] && schema[section][name2];
          return fn ? fn(value2) : value2;
        });
        return getall ? allValues : allValues.pop();
      }
      async getall(path2) {
        return this.get(path2, true);
      }
      async getSubsections(section) {
        return this.parsedConfig.filter((config) => config.section === section && config.isSection).map((config) => config.subsection);
      }
      async deleteSection(section, subsection) {
        this.parsedConfig = this.parsedConfig.filter((config) => !(config.section === section && config.subsection === subsection));
      }
      async append(path2, value2) {
        return this.set(path2, value2, true);
      }
      async set(path2, value2, append = false) {
        const configIndex = findLastIndex(this.parsedConfig, (config) => config.path === path2.toLowerCase());
        if (value2 == null) {
          if (configIndex !== -1) {
            this.parsedConfig.splice(configIndex, 1);
          }
        } else {
          if (configIndex !== -1) {
            const config = this.parsedConfig[configIndex];
            const modifiedConfig = Object.assign({}, config, {
              value: value2,
              modified: true
            });
            if (append) {
              this.parsedConfig.splice(configIndex + 1, 0, modifiedConfig);
            } else {
              this.parsedConfig[configIndex] = modifiedConfig;
            }
          } else {
            const sectionPath = path2.split(".").slice(0, -1).join(".").toLowerCase();
            const sectionIndex = this.parsedConfig.findIndex((config) => config.path === sectionPath);
            const [section, subsection] = sectionPath.split(".");
            const name2 = path2.split(".").pop();
            const newConfig = {
              section,
              subsection,
              name: name2,
              value: value2,
              modified: true,
              path: getPath(section, subsection, name2)
            };
            if (SECTION_REGEX.test(section) && VARIABLE_NAME_REGEX.test(name2)) {
              if (sectionIndex >= 0) {
                this.parsedConfig.splice(sectionIndex + 1, 0, newConfig);
              } else {
                const newSection = {
                  section,
                  subsection,
                  modified: true,
                  path: getPath(section, subsection, null)
                };
                this.parsedConfig.push(newSection, newConfig);
              }
            }
          }
        }
      }
      toString() {
        return this.parsedConfig.map(({ line, section, subsection, name: name2, value: value2, modified: modified2 = false }) => {
          if (!modified2) {
            return line;
          }
          if (name2 != null && value2 != null) {
            return `	${name2} = ${value2}`;
          }
          if (subsection != null) {
            return `[${section} "${subsection}"]`;
          }
          return `[${section}]`;
        }).join("\n");
      }
    };
    var GitConfigManager = class {
      static async get({ fs: fs3, gitdir }) {
        const text = await fs3.read(`${gitdir}/config`, { encoding: "utf8" });
        return GitConfig.from(text);
      }
      static async save({ fs: fs3, gitdir, config }) {
        await fs3.write(`${gitdir}/config`, config.toString(), {
          encoding: "utf8"
        });
      }
    };
    var refpaths = (ref) => [
      `${ref}`,
      `refs/${ref}`,
      `refs/tags/${ref}`,
      `refs/heads/${ref}`,
      `refs/remotes/${ref}`,
      `refs/remotes/${ref}/HEAD`
    ];
    var GIT_FILES = ["config", "description", "index", "shallow", "commondir"];
    var GitRefManager = class {
      static async updateRemoteRefs({
        fs: fs3,
        gitdir,
        remote,
        refs,
        symrefs,
        tags,
        refspecs = void 0,
        prune = false,
        pruneTags = false
      }) {
        for (const value2 of refs.values()) {
          if (!value2.match(/[0-9a-f]{40}/)) {
            throw new InvalidOidError(value2);
          }
        }
        const config = await GitConfigManager.get({ fs: fs3, gitdir });
        if (!refspecs) {
          refspecs = await config.getall(`remote.${remote}.fetch`);
          if (refspecs.length === 0) {
            throw new NoRefspecError(remote);
          }
          refspecs.unshift(`+HEAD:refs/remotes/${remote}/HEAD`);
        }
        const refspec = GitRefSpecSet.from(refspecs);
        const actualRefsToWrite = /* @__PURE__ */ new Map();
        if (pruneTags) {
          const tags2 = await GitRefManager.listRefs({
            fs: fs3,
            gitdir,
            filepath: "refs/tags"
          });
          await GitRefManager.deleteRefs({
            fs: fs3,
            gitdir,
            refs: tags2.map((tag2) => `refs/tags/${tag2}`)
          });
        }
        if (tags) {
          for (const serverRef of refs.keys()) {
            if (serverRef.startsWith("refs/tags") && !serverRef.endsWith("^{}")) {
              if (!await GitRefManager.exists({ fs: fs3, gitdir, ref: serverRef })) {
                const oid = refs.get(serverRef);
                actualRefsToWrite.set(serverRef, oid);
              }
            }
          }
        }
        const refTranslations = refspec.translate([...refs.keys()]);
        for (const [serverRef, translatedRef] of refTranslations) {
          const value2 = refs.get(serverRef);
          actualRefsToWrite.set(translatedRef, value2);
        }
        const symrefTranslations = refspec.translate([...symrefs.keys()]);
        for (const [serverRef, translatedRef] of symrefTranslations) {
          const value2 = symrefs.get(serverRef);
          const symtarget = refspec.translateOne(value2);
          if (symtarget) {
            actualRefsToWrite.set(translatedRef, `ref: ${symtarget}`);
          }
        }
        const pruned = [];
        if (prune) {
          for (const filepath of refspec.localNamespaces()) {
            const refs2 = (await GitRefManager.listRefs({
              fs: fs3,
              gitdir,
              filepath
            })).map((file) => `${filepath}/${file}`);
            for (const ref of refs2) {
              if (!actualRefsToWrite.has(ref)) {
                pruned.push(ref);
              }
            }
          }
          if (pruned.length > 0) {
            await GitRefManager.deleteRefs({ fs: fs3, gitdir, refs: pruned });
          }
        }
        for (const [key, value2] of actualRefsToWrite) {
          await fs3.write(join9(gitdir, key), `${value2.trim()}
`, "utf8");
        }
        return { pruned };
      }
      static async writeRef({ fs: fs3, gitdir, ref, value: value2 }) {
        if (!value2.match(/[0-9a-f]{40}/)) {
          throw new InvalidOidError(value2);
        }
        await fs3.write(join9(gitdir, ref), `${value2.trim()}
`, "utf8");
      }
      static async writeSymbolicRef({ fs: fs3, gitdir, ref, value: value2 }) {
        await fs3.write(join9(gitdir, ref), `ref: ${value2.trim()}
`, "utf8");
      }
      static async deleteRef({ fs: fs3, gitdir, ref }) {
        return GitRefManager.deleteRefs({ fs: fs3, gitdir, refs: [ref] });
      }
      static async deleteRefs({ fs: fs3, gitdir, refs }) {
        await Promise.all(refs.map((ref) => fs3.rm(join9(gitdir, ref))));
        let text = await fs3.read(`${gitdir}/packed-refs`, { encoding: "utf8" });
        const packed = GitPackedRefs.from(text);
        const beforeSize = packed.refs.size;
        for (const ref of refs) {
          if (packed.refs.has(ref)) {
            packed.delete(ref);
          }
        }
        if (packed.refs.size < beforeSize) {
          text = packed.toString();
          await fs3.write(`${gitdir}/packed-refs`, text, { encoding: "utf8" });
        }
      }
      static async resolve({ fs: fs3, gitdir, ref, depth = void 0 }) {
        if (depth !== void 0) {
          depth--;
          if (depth === -1) {
            return ref;
          }
        }
        let sha;
        if (ref.startsWith("ref: ")) {
          ref = ref.slice("ref: ".length);
          return GitRefManager.resolve({ fs: fs3, gitdir, ref, depth });
        }
        if (ref.length === 40 && /[0-9a-f]{40}/.test(ref)) {
          return ref;
        }
        const packedMap = await GitRefManager.packedRefs({ fs: fs3, gitdir });
        const allpaths = refpaths(ref).filter((p) => !GIT_FILES.includes(p));
        for (const ref2 of allpaths) {
          sha = await fs3.read(`${gitdir}/${ref2}`, { encoding: "utf8" }) || packedMap.get(ref2);
          if (sha) {
            return GitRefManager.resolve({ fs: fs3, gitdir, ref: sha.trim(), depth });
          }
        }
        throw new NotFoundError(ref);
      }
      static async exists({ fs: fs3, gitdir, ref }) {
        try {
          await GitRefManager.expand({ fs: fs3, gitdir, ref });
          return true;
        } catch (err) {
          return false;
        }
      }
      static async expand({ fs: fs3, gitdir, ref }) {
        if (ref.length === 40 && /[0-9a-f]{40}/.test(ref)) {
          return ref;
        }
        const packedMap = await GitRefManager.packedRefs({ fs: fs3, gitdir });
        const allpaths = refpaths(ref);
        for (const ref2 of allpaths) {
          if (await fs3.exists(`${gitdir}/${ref2}`))
            return ref2;
          if (packedMap.has(ref2))
            return ref2;
        }
        throw new NotFoundError(ref);
      }
      static async expandAgainstMap({ ref, map }) {
        const allpaths = refpaths(ref);
        for (const ref2 of allpaths) {
          if (await map.has(ref2))
            return ref2;
        }
        throw new NotFoundError(ref);
      }
      static resolveAgainstMap({ ref, fullref = ref, depth = void 0, map }) {
        if (depth !== void 0) {
          depth--;
          if (depth === -1) {
            return { fullref, oid: ref };
          }
        }
        if (ref.startsWith("ref: ")) {
          ref = ref.slice("ref: ".length);
          return GitRefManager.resolveAgainstMap({ ref, fullref, depth, map });
        }
        if (ref.length === 40 && /[0-9a-f]{40}/.test(ref)) {
          return { fullref, oid: ref };
        }
        const allpaths = refpaths(ref);
        for (const ref2 of allpaths) {
          const sha = map.get(ref2);
          if (sha) {
            return GitRefManager.resolveAgainstMap({
              ref: sha.trim(),
              fullref: ref2,
              depth,
              map
            });
          }
        }
        throw new NotFoundError(ref);
      }
      static async packedRefs({ fs: fs3, gitdir }) {
        const text = await fs3.read(`${gitdir}/packed-refs`, { encoding: "utf8" });
        const packed = GitPackedRefs.from(text);
        return packed.refs;
      }
      static async listRefs({ fs: fs3, gitdir, filepath }) {
        const packedMap = GitRefManager.packedRefs({ fs: fs3, gitdir });
        let files = null;
        try {
          files = await fs3.readdirDeep(`${gitdir}/${filepath}`);
          files = files.map((x) => x.replace(`${gitdir}/${filepath}/`, ""));
        } catch (err) {
          files = [];
        }
        for (let key of (await packedMap).keys()) {
          if (key.startsWith(filepath)) {
            key = key.replace(filepath + "/", "");
            if (!files.includes(key)) {
              files.push(key);
            }
          }
        }
        files.sort(compareRefNames);
        return files;
      }
      static async listBranches({ fs: fs3, gitdir, remote }) {
        if (remote) {
          return GitRefManager.listRefs({
            fs: fs3,
            gitdir,
            filepath: `refs/remotes/${remote}`
          });
        } else {
          return GitRefManager.listRefs({ fs: fs3, gitdir, filepath: `refs/heads` });
        }
      }
      static async listTags({ fs: fs3, gitdir }) {
        const tags = await GitRefManager.listRefs({
          fs: fs3,
          gitdir,
          filepath: `refs/tags`
        });
        return tags.filter((x) => !x.endsWith("^{}"));
      }
    };
    function compareTreeEntryPath(a, b) {
      return compareStrings(appendSlashIfDir(a), appendSlashIfDir(b));
    }
    function appendSlashIfDir(entry) {
      return entry.mode === "040000" ? entry.path + "/" : entry.path;
    }
    function mode2type$1(mode) {
      switch (mode) {
        case "040000":
          return "tree";
        case "100644":
          return "blob";
        case "100755":
          return "blob";
        case "120000":
          return "blob";
        case "160000":
          return "commit";
      }
      throw new InternalError(`Unexpected GitTree entry mode: ${mode}`);
    }
    function parseBuffer(buffer) {
      const _entries = [];
      let cursor = 0;
      while (cursor < buffer.length) {
        const space = buffer.indexOf(32, cursor);
        if (space === -1) {
          throw new InternalError(`GitTree: Error parsing buffer at byte location ${cursor}: Could not find the next space character.`);
        }
        const nullchar = buffer.indexOf(0, cursor);
        if (nullchar === -1) {
          throw new InternalError(`GitTree: Error parsing buffer at byte location ${cursor}: Could not find the next null character.`);
        }
        let mode = buffer.slice(cursor, space).toString("utf8");
        if (mode === "40000")
          mode = "040000";
        const type = mode2type$1(mode);
        const path2 = buffer.slice(space + 1, nullchar).toString("utf8");
        if (path2.includes("\\") || path2.includes("/")) {
          throw new UnsafeFilepathError(path2);
        }
        const oid = buffer.slice(nullchar + 1, nullchar + 21).toString("hex");
        cursor = nullchar + 21;
        _entries.push({ mode, path: path2, oid, type });
      }
      return _entries;
    }
    function limitModeToAllowed(mode) {
      if (typeof mode === "number") {
        mode = mode.toString(8);
      }
      if (mode.match(/^0?4.*/))
        return "040000";
      if (mode.match(/^1006.*/))
        return "100644";
      if (mode.match(/^1007.*/))
        return "100755";
      if (mode.match(/^120.*/))
        return "120000";
      if (mode.match(/^160.*/))
        return "160000";
      throw new InternalError(`Could not understand file mode: ${mode}`);
    }
    function nudgeIntoShape(entry) {
      if (!entry.oid && entry.sha) {
        entry.oid = entry.sha;
      }
      entry.mode = limitModeToAllowed(entry.mode);
      if (!entry.type) {
        entry.type = mode2type$1(entry.mode);
      }
      return entry;
    }
    var GitTree = class {
      constructor(entries) {
        if (Buffer.isBuffer(entries)) {
          this._entries = parseBuffer(entries);
        } else if (Array.isArray(entries)) {
          this._entries = entries.map(nudgeIntoShape);
        } else {
          throw new InternalError("invalid type passed to GitTree constructor");
        }
        this._entries.sort(comparePath);
      }
      static from(tree) {
        return new GitTree(tree);
      }
      render() {
        return this._entries.map((entry) => `${entry.mode} ${entry.type} ${entry.oid}    ${entry.path}`).join("\n");
      }
      toObject() {
        const entries = [...this._entries];
        entries.sort(compareTreeEntryPath);
        return Buffer.concat(entries.map((entry) => {
          const mode = Buffer.from(entry.mode.replace(/^0/, ""));
          const space = Buffer.from(" ");
          const path2 = Buffer.from(entry.path, "utf8");
          const nullchar = Buffer.from([0]);
          const oid = Buffer.from(entry.oid, "hex");
          return Buffer.concat([mode, space, path2, nullchar, oid]);
        }));
      }
      entries() {
        return this._entries;
      }
      *[Symbol.iterator]() {
        for (const entry of this._entries) {
          yield entry;
        }
      }
    };
    var GitObject = class {
      static wrap({ type, object }) {
        return Buffer.concat([
          Buffer.from(`${type} ${object.byteLength.toString()}\0`),
          Buffer.from(object)
        ]);
      }
      static unwrap(buffer) {
        const s = buffer.indexOf(32);
        const i2 = buffer.indexOf(0);
        const type = buffer.slice(0, s).toString("utf8");
        const length = buffer.slice(s + 1, i2).toString("utf8");
        const actualLength = buffer.length - (i2 + 1);
        if (parseInt(length) !== actualLength) {
          throw new InternalError(`Length mismatch: expected ${length} bytes but got ${actualLength} instead.`);
        }
        return {
          type,
          object: Buffer.from(buffer.slice(i2 + 1))
        };
      }
    };
    async function readObjectLoose({ fs: fs3, gitdir, oid }) {
      const source = `objects/${oid.slice(0, 2)}/${oid.slice(2)}`;
      const file = await fs3.read(`${gitdir}/${source}`);
      if (!file) {
        return null;
      }
      return { object: file, format: "deflated", source };
    }
    function applyDelta(delta, source) {
      const reader = new BufferCursor(delta);
      const sourceSize = readVarIntLE(reader);
      if (sourceSize !== source.byteLength) {
        throw new InternalError(`applyDelta expected source buffer to be ${sourceSize} bytes but the provided buffer was ${source.length} bytes`);
      }
      const targetSize = readVarIntLE(reader);
      let target;
      const firstOp = readOp(reader, source);
      if (firstOp.byteLength === targetSize) {
        target = firstOp;
      } else {
        target = Buffer.alloc(targetSize);
        const writer = new BufferCursor(target);
        writer.copy(firstOp);
        while (!reader.eof()) {
          writer.copy(readOp(reader, source));
        }
        const tell = writer.tell();
        if (targetSize !== tell) {
          throw new InternalError(`applyDelta expected target buffer to be ${targetSize} bytes but the resulting buffer was ${tell} bytes`);
        }
      }
      return target;
    }
    function readVarIntLE(reader) {
      let result = 0;
      let shift = 0;
      let byte = null;
      do {
        byte = reader.readUInt8();
        result |= (byte & 127) << shift;
        shift += 7;
      } while (byte & 128);
      return result;
    }
    function readCompactLE(reader, flags, size) {
      let result = 0;
      let shift = 0;
      while (size--) {
        if (flags & 1) {
          result |= reader.readUInt8() << shift;
        }
        flags >>= 1;
        shift += 8;
      }
      return result;
    }
    function readOp(reader, source) {
      const byte = reader.readUInt8();
      const COPY = 128;
      const OFFS = 15;
      const SIZE = 112;
      if (byte & COPY) {
        const offset = readCompactLE(reader, byte & OFFS, 4);
        let size = readCompactLE(reader, (byte & SIZE) >> 4, 3);
        if (size === 0)
          size = 65536;
        return source.slice(offset, offset + size);
      } else {
        return reader.slice(byte);
      }
    }
    function fromValue(value2) {
      let queue = [value2];
      return {
        next() {
          return Promise.resolve({ done: queue.length === 0, value: queue.pop() });
        },
        return() {
          queue = [];
          return {};
        },
        [Symbol.asyncIterator]() {
          return this;
        }
      };
    }
    function getIterator(iterable) {
      if (iterable[Symbol.asyncIterator]) {
        return iterable[Symbol.asyncIterator]();
      }
      if (iterable[Symbol.iterator]) {
        return iterable[Symbol.iterator]();
      }
      if (iterable.next) {
        return iterable;
      }
      return fromValue(iterable);
    }
    var StreamReader = class {
      constructor(stream) {
        this.stream = getIterator(stream);
        this.buffer = null;
        this.cursor = 0;
        this.undoCursor = 0;
        this.started = false;
        this._ended = false;
        this._discardedBytes = 0;
      }
      eof() {
        return this._ended && this.cursor === this.buffer.length;
      }
      tell() {
        return this._discardedBytes + this.cursor;
      }
      async byte() {
        if (this.eof())
          return;
        if (!this.started)
          await this._init();
        if (this.cursor === this.buffer.length) {
          await this._loadnext();
          if (this._ended)
            return;
        }
        this._moveCursor(1);
        return this.buffer[this.undoCursor];
      }
      async chunk() {
        if (this.eof())
          return;
        if (!this.started)
          await this._init();
        if (this.cursor === this.buffer.length) {
          await this._loadnext();
          if (this._ended)
            return;
        }
        this._moveCursor(this.buffer.length);
        return this.buffer.slice(this.undoCursor, this.cursor);
      }
      async read(n) {
        if (this.eof())
          return;
        if (!this.started)
          await this._init();
        if (this.cursor + n > this.buffer.length) {
          this._trim();
          await this._accumulate(n);
        }
        this._moveCursor(n);
        return this.buffer.slice(this.undoCursor, this.cursor);
      }
      async skip(n) {
        if (this.eof())
          return;
        if (!this.started)
          await this._init();
        if (this.cursor + n > this.buffer.length) {
          this._trim();
          await this._accumulate(n);
        }
        this._moveCursor(n);
      }
      async undo() {
        this.cursor = this.undoCursor;
      }
      async _next() {
        this.started = true;
        let { done, value: value2 } = await this.stream.next();
        if (done) {
          this._ended = true;
        }
        if (value2) {
          value2 = Buffer.from(value2);
        }
        return value2;
      }
      _trim() {
        this.buffer = this.buffer.slice(this.undoCursor);
        this.cursor -= this.undoCursor;
        this._discardedBytes += this.undoCursor;
        this.undoCursor = 0;
      }
      _moveCursor(n) {
        this.undoCursor = this.cursor;
        this.cursor += n;
        if (this.cursor > this.buffer.length) {
          this.cursor = this.buffer.length;
        }
      }
      async _accumulate(n) {
        if (this._ended)
          return;
        const buffers = [this.buffer];
        while (this.cursor + n > lengthBuffers(buffers)) {
          const nextbuffer = await this._next();
          if (this._ended)
            break;
          buffers.push(nextbuffer);
        }
        this.buffer = Buffer.concat(buffers);
      }
      async _loadnext() {
        this._discardedBytes += this.buffer.length;
        this.undoCursor = 0;
        this.cursor = 0;
        this.buffer = await this._next();
      }
      async _init() {
        this.buffer = await this._next();
      }
    };
    function lengthBuffers(buffers) {
      return buffers.reduce((acc, buffer) => acc + buffer.length, 0);
    }
    async function listpack(stream, onData) {
      const reader = new StreamReader(stream);
      let PACK = await reader.read(4);
      PACK = PACK.toString("utf8");
      if (PACK !== "PACK") {
        throw new InternalError(`Invalid PACK header '${PACK}'`);
      }
      let version2 = await reader.read(4);
      version2 = version2.readUInt32BE(0);
      if (version2 !== 2) {
        throw new InternalError(`Invalid packfile version: ${version2}`);
      }
      let numObjects = await reader.read(4);
      numObjects = numObjects.readUInt32BE(0);
      if (numObjects < 1)
        return;
      while (!reader.eof() && numObjects--) {
        const offset = reader.tell();
        const { type, length, ofs, reference } = await parseHeader(reader);
        const inflator = new pako.Inflate();
        while (!inflator.result) {
          const chunk = await reader.chunk();
          if (!chunk)
            break;
          inflator.push(chunk, false);
          if (inflator.err) {
            throw new InternalError(`Pako error: ${inflator.msg}`);
          }
          if (inflator.result) {
            if (inflator.result.length !== length) {
              throw new InternalError(`Inflated object size is different from that stated in packfile.`);
            }
            await reader.undo();
            await reader.read(chunk.length - inflator.strm.avail_in);
            const end = reader.tell();
            await onData({
              data: inflator.result,
              type,
              num: numObjects,
              offset,
              end,
              reference,
              ofs
            });
          }
        }
      }
    }
    async function parseHeader(reader) {
      let byte = await reader.byte();
      const type = byte >> 4 & 7;
      let length = byte & 15;
      if (byte & 128) {
        let shift = 4;
        do {
          byte = await reader.byte();
          length |= (byte & 127) << shift;
          shift += 7;
        } while (byte & 128);
      }
      let ofs;
      let reference;
      if (type === 6) {
        let shift = 0;
        ofs = 0;
        const bytes = [];
        do {
          byte = await reader.byte();
          ofs |= (byte & 127) << shift;
          shift += 7;
          bytes.push(byte);
        } while (byte & 128);
        reference = Buffer.from(bytes);
      }
      if (type === 7) {
        const buf = await reader.read(20);
        reference = buf;
      }
      return { type, length, ofs, reference };
    }
    var supportsDecompressionStream = false;
    async function inflate(buffer) {
      if (supportsDecompressionStream === null) {
        supportsDecompressionStream = testDecompressionStream();
      }
      return supportsDecompressionStream ? browserInflate(buffer) : pako.inflate(buffer);
    }
    async function browserInflate(buffer) {
      const ds = new DecompressionStream("deflate");
      const d = new Blob([buffer]).stream().pipeThrough(ds);
      return new Uint8Array(await new Response(d).arrayBuffer());
    }
    function testDecompressionStream() {
      try {
        const ds = new DecompressionStream("deflate");
        if (ds)
          return true;
      } catch (_) {
      }
      return false;
    }
    function decodeVarInt(reader) {
      const bytes = [];
      let byte = 0;
      let multibyte = 0;
      do {
        byte = reader.readUInt8();
        const lastSeven = byte & 127;
        bytes.push(lastSeven);
        multibyte = byte & 128;
      } while (multibyte);
      return bytes.reduce((a, b) => a + 1 << 7 | b, -1);
    }
    function otherVarIntDecode(reader, startWith) {
      let result = startWith;
      let shift = 4;
      let byte = null;
      do {
        byte = reader.readUInt8();
        result |= (byte & 127) << shift;
        shift += 7;
      } while (byte & 128);
      return result;
    }
    var GitPackIndex = class {
      constructor(stuff) {
        Object.assign(this, stuff);
        this.offsetCache = {};
      }
      static async fromIdx({ idx, getExternalRefDelta }) {
        const reader = new BufferCursor(idx);
        const magic = reader.slice(4).toString("hex");
        if (magic !== "ff744f63") {
          return;
        }
        const version2 = reader.readUInt32BE();
        if (version2 !== 2) {
          throw new InternalError(`Unable to read version ${version2} packfile IDX. (Only version 2 supported)`);
        }
        if (idx.byteLength > 2048 * 1024 * 1024) {
          throw new InternalError(`To keep implementation simple, I haven't implemented the layer 5 feature needed to support packfiles > 2GB in size.`);
        }
        reader.seek(reader.tell() + 4 * 255);
        const size = reader.readUInt32BE();
        const hashes = [];
        for (let i2 = 0; i2 < size; i2++) {
          const hash = reader.slice(20).toString("hex");
          hashes[i2] = hash;
        }
        reader.seek(reader.tell() + 4 * size);
        const offsets = /* @__PURE__ */ new Map();
        for (let i2 = 0; i2 < size; i2++) {
          offsets.set(hashes[i2], reader.readUInt32BE());
        }
        const packfileSha = reader.slice(20).toString("hex");
        return new GitPackIndex({
          hashes,
          crcs: {},
          offsets,
          packfileSha,
          getExternalRefDelta
        });
      }
      static async fromPack({ pack, getExternalRefDelta, onProgress }) {
        const listpackTypes = {
          1: "commit",
          2: "tree",
          3: "blob",
          4: "tag",
          6: "ofs-delta",
          7: "ref-delta"
        };
        const offsetToObject = {};
        const packfileSha = pack.slice(-20).toString("hex");
        const hashes = [];
        const crcs = {};
        const offsets = /* @__PURE__ */ new Map();
        let totalObjectCount = null;
        let lastPercent = null;
        await listpack([pack], async ({ data, type, reference, offset, num: num2 }) => {
          if (totalObjectCount === null)
            totalObjectCount = num2;
          const percent = Math.floor((totalObjectCount - num2) * 100 / totalObjectCount);
          if (percent !== lastPercent) {
            if (onProgress) {
              await onProgress({
                phase: "Receiving objects",
                loaded: totalObjectCount - num2,
                total: totalObjectCount
              });
            }
          }
          lastPercent = percent;
          type = listpackTypes[type];
          if (["commit", "tree", "blob", "tag"].includes(type)) {
            offsetToObject[offset] = {
              type,
              offset
            };
          } else if (type === "ofs-delta") {
            offsetToObject[offset] = {
              type,
              offset
            };
          } else if (type === "ref-delta") {
            offsetToObject[offset] = {
              type,
              offset
            };
          }
        });
        const offsetArray = Object.keys(offsetToObject).map(Number);
        for (const [i2, start] of offsetArray.entries()) {
          const end = i2 + 1 === offsetArray.length ? pack.byteLength - 20 : offsetArray[i2 + 1];
          const o = offsetToObject[start];
          const crc = crc32.buf(pack.slice(start, end)) >>> 0;
          o.end = end;
          o.crc = crc;
        }
        const p = new GitPackIndex({
          pack: Promise.resolve(pack),
          packfileSha,
          crcs,
          hashes,
          offsets,
          getExternalRefDelta
        });
        lastPercent = null;
        let count = 0;
        const objectsByDepth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (let offset in offsetToObject) {
          offset = Number(offset);
          const percent = Math.floor(count++ * 100 / totalObjectCount);
          if (percent !== lastPercent) {
            if (onProgress) {
              await onProgress({
                phase: "Resolving deltas",
                loaded: count,
                total: totalObjectCount
              });
            }
          }
          lastPercent = percent;
          const o = offsetToObject[offset];
          if (o.oid)
            continue;
          try {
            p.readDepth = 0;
            p.externalReadDepth = 0;
            const { type, object } = await p.readSlice({ start: offset });
            objectsByDepth[p.readDepth] += 1;
            const oid = await shasum(GitObject.wrap({ type, object }));
            o.oid = oid;
            hashes.push(oid);
            offsets.set(oid, offset);
            crcs[oid] = o.crc;
          } catch (err) {
            continue;
          }
        }
        hashes.sort();
        return p;
      }
      async toBuffer() {
        const buffers = [];
        const write2 = (str, encoding) => {
          buffers.push(Buffer.from(str, encoding));
        };
        write2("ff744f63", "hex");
        write2("00000002", "hex");
        const fanoutBuffer = new BufferCursor(Buffer.alloc(256 * 4));
        for (let i2 = 0; i2 < 256; i2++) {
          let count = 0;
          for (const hash of this.hashes) {
            if (parseInt(hash.slice(0, 2), 16) <= i2)
              count++;
          }
          fanoutBuffer.writeUInt32BE(count);
        }
        buffers.push(fanoutBuffer.buffer);
        for (const hash of this.hashes) {
          write2(hash, "hex");
        }
        const crcsBuffer = new BufferCursor(Buffer.alloc(this.hashes.length * 4));
        for (const hash of this.hashes) {
          crcsBuffer.writeUInt32BE(this.crcs[hash]);
        }
        buffers.push(crcsBuffer.buffer);
        const offsetsBuffer = new BufferCursor(Buffer.alloc(this.hashes.length * 4));
        for (const hash of this.hashes) {
          offsetsBuffer.writeUInt32BE(this.offsets.get(hash));
        }
        buffers.push(offsetsBuffer.buffer);
        write2(this.packfileSha, "hex");
        const totalBuffer = Buffer.concat(buffers);
        const sha = await shasum(totalBuffer);
        const shaBuffer = Buffer.alloc(20);
        shaBuffer.write(sha, "hex");
        return Buffer.concat([totalBuffer, shaBuffer]);
      }
      async load({ pack }) {
        this.pack = pack;
      }
      async unload() {
        this.pack = null;
      }
      async read({ oid }) {
        if (!this.offsets.get(oid)) {
          if (this.getExternalRefDelta) {
            this.externalReadDepth++;
            return this.getExternalRefDelta(oid);
          } else {
            throw new InternalError(`Could not read object ${oid} from packfile`);
          }
        }
        const start = this.offsets.get(oid);
        return this.readSlice({ start });
      }
      async readSlice({ start }) {
        if (this.offsetCache[start]) {
          return Object.assign({}, this.offsetCache[start]);
        }
        this.readDepth++;
        const types2 = {
          16: "commit",
          32: "tree",
          48: "blob",
          64: "tag",
          96: "ofs_delta",
          112: "ref_delta"
        };
        if (!this.pack) {
          throw new InternalError("Tried to read from a GitPackIndex with no packfile loaded into memory");
        }
        const raw = (await this.pack).slice(start);
        const reader = new BufferCursor(raw);
        const byte = reader.readUInt8();
        const btype = byte & 112;
        let type = types2[btype];
        if (type === void 0) {
          throw new InternalError("Unrecognized type: 0b" + btype.toString(2));
        }
        const lastFour = byte & 15;
        let length = lastFour;
        const multibyte = byte & 128;
        if (multibyte) {
          length = otherVarIntDecode(reader, lastFour);
        }
        let base2 = null;
        let object = null;
        if (type === "ofs_delta") {
          const offset = decodeVarInt(reader);
          const baseOffset = start - offset;
          ({ object: base2, type } = await this.readSlice({ start: baseOffset }));
        }
        if (type === "ref_delta") {
          const oid = reader.slice(20).toString("hex");
          ({ object: base2, type } = await this.read({ oid }));
        }
        const buffer = raw.slice(reader.tell());
        object = Buffer.from(await inflate(buffer));
        if (object.byteLength !== length) {
          throw new InternalError(`Packfile told us object would have length ${length} but it had length ${object.byteLength}`);
        }
        if (base2) {
          object = Buffer.from(applyDelta(object, base2));
        }
        if (this.readDepth > 3) {
          this.offsetCache[start] = { type, object };
        }
        return { type, format: "content", object };
      }
    };
    var PackfileCache = Symbol("PackfileCache");
    async function loadPackIndex({
      fs: fs3,
      filename,
      getExternalRefDelta,
      emitter,
      emitterPrefix
    }) {
      const idx = await fs3.read(filename);
      return GitPackIndex.fromIdx({ idx, getExternalRefDelta });
    }
    function readPackIndex({
      fs: fs3,
      cache,
      filename,
      getExternalRefDelta,
      emitter,
      emitterPrefix
    }) {
      if (!cache[PackfileCache])
        cache[PackfileCache] = /* @__PURE__ */ new Map();
      let p = cache[PackfileCache].get(filename);
      if (!p) {
        p = loadPackIndex({
          fs: fs3,
          filename,
          getExternalRefDelta,
          emitter,
          emitterPrefix
        });
        cache[PackfileCache].set(filename, p);
      }
      return p;
    }
    async function readObjectPacked({
      fs: fs3,
      cache,
      gitdir,
      oid,
      format = "content",
      getExternalRefDelta
    }) {
      let list = await fs3.readdir(join9(gitdir, "objects/pack"));
      list = list.filter((x) => x.endsWith(".idx"));
      for (const filename of list) {
        const indexFile = `${gitdir}/objects/pack/${filename}`;
        const p = await readPackIndex({
          fs: fs3,
          cache,
          filename: indexFile,
          getExternalRefDelta
        });
        if (p.error)
          throw new InternalError(p.error);
        if (p.offsets.has(oid)) {
          if (!p.pack) {
            const packFile = indexFile.replace(/idx$/, "pack");
            p.pack = fs3.read(packFile);
          }
          const result = await p.read({ oid, getExternalRefDelta });
          result.format = "content";
          result.source = `objects/pack/${filename.replace(/idx$/, "pack")}`;
          return result;
        }
      }
      return null;
    }
    async function _readObject({
      fs: fs3,
      cache,
      gitdir,
      oid,
      format = "content"
    }) {
      const getExternalRefDelta = (oid2) => _readObject({ fs: fs3, cache, gitdir, oid: oid2 });
      let result;
      if (oid === "4b825dc642cb6eb9a060e54bf8d69288fbee4904") {
        result = { format: "wrapped", object: Buffer.from(`tree 0\0`) };
      }
      if (!result) {
        result = await readObjectLoose({ fs: fs3, gitdir, oid });
      }
      if (!result) {
        result = await readObjectPacked({
          fs: fs3,
          cache,
          gitdir,
          oid,
          getExternalRefDelta
        });
      }
      if (!result) {
        throw new NotFoundError(oid);
      }
      if (format === "deflated") {
        return result;
      }
      if (result.format === "deflated") {
        result.object = Buffer.from(await inflate(result.object));
        result.format = "wrapped";
      }
      if (result.format === "wrapped") {
        if (format === "wrapped" && result.format === "wrapped") {
          return result;
        }
        const sha = await shasum(result.object);
        if (sha !== oid) {
          throw new InternalError(`SHA check failed! Expected ${oid}, computed ${sha}`);
        }
        const { object, type } = GitObject.unwrap(result.object);
        result.type = type;
        result.object = object;
        result.format = "content";
      }
      if (result.format === "content") {
        if (format === "content")
          return result;
        return;
      }
      throw new InternalError(`invalid format "${result.format}"`);
    }
    var AlreadyExistsError = class extends BaseError {
      constructor(noun, where, canForce = true) {
        super(`Failed to create ${noun} at ${where} because it already exists.${canForce ? ` (Hint: use 'force: true' parameter to overwrite existing ${noun}.)` : ""}`);
        this.code = this.name = AlreadyExistsError.code;
        this.data = { noun, where, canForce };
      }
    };
    AlreadyExistsError.code = "AlreadyExistsError";
    var AmbiguousError = class extends BaseError {
      constructor(nouns, short, matches) {
        super(`Found multiple ${nouns} matching "${short}" (${matches.join(", ")}). Use a longer abbreviation length to disambiguate them.`);
        this.code = this.name = AmbiguousError.code;
        this.data = { nouns, short, matches };
      }
    };
    AmbiguousError.code = "AmbiguousError";
    var CheckoutConflictError = class extends BaseError {
      constructor(filepaths) {
        super(`Your local changes to the following files would be overwritten by checkout: ${filepaths.join(", ")}`);
        this.code = this.name = CheckoutConflictError.code;
        this.data = { filepaths };
      }
    };
    CheckoutConflictError.code = "CheckoutConflictError";
    var CommitNotFetchedError = class extends BaseError {
      constructor(ref, oid) {
        super(`Failed to checkout "${ref}" because commit ${oid} is not available locally. Do a git fetch to make the branch available locally.`);
        this.code = this.name = CommitNotFetchedError.code;
        this.data = { ref, oid };
      }
    };
    CommitNotFetchedError.code = "CommitNotFetchedError";
    var EmptyServerResponseError = class extends BaseError {
      constructor() {
        super(`Empty response from git server.`);
        this.code = this.name = EmptyServerResponseError.code;
        this.data = {};
      }
    };
    EmptyServerResponseError.code = "EmptyServerResponseError";
    var FastForwardError = class extends BaseError {
      constructor() {
        super(`A simple fast-forward merge was not possible.`);
        this.code = this.name = FastForwardError.code;
        this.data = {};
      }
    };
    FastForwardError.code = "FastForwardError";
    var GitPushError = class extends BaseError {
      constructor(prettyDetails, result) {
        super(`One or more branches were not updated: ${prettyDetails}`);
        this.code = this.name = GitPushError.code;
        this.data = { prettyDetails, result };
      }
    };
    GitPushError.code = "GitPushError";
    var HttpError = class extends BaseError {
      constructor(statusCode, statusMessage, response) {
        super(`HTTP Error: ${statusCode} ${statusMessage}`);
        this.code = this.name = HttpError.code;
        this.data = { statusCode, statusMessage, response };
      }
    };
    HttpError.code = "HttpError";
    var InvalidFilepathError = class extends BaseError {
      constructor(reason) {
        let message = "invalid filepath";
        if (reason === "leading-slash" || reason === "trailing-slash") {
          message = `"filepath" parameter should not include leading or trailing directory separators because these can cause problems on some platforms.`;
        }
        super(message);
        this.code = this.name = InvalidFilepathError.code;
        this.data = { reason };
      }
    };
    InvalidFilepathError.code = "InvalidFilepathError";
    var InvalidRefNameError = class extends BaseError {
      constructor(ref, suggestion) {
        super(`"${ref}" would be an invalid git reference. (Hint: a valid alternative would be "${suggestion}".)`);
        this.code = this.name = InvalidRefNameError.code;
        this.data = { ref, suggestion };
      }
    };
    InvalidRefNameError.code = "InvalidRefNameError";
    var MaxDepthError = class extends BaseError {
      constructor(depth) {
        super(`Maximum search depth of ${depth} exceeded.`);
        this.code = this.name = MaxDepthError.code;
        this.data = { depth };
      }
    };
    MaxDepthError.code = "MaxDepthError";
    var MergeNotSupportedError = class extends BaseError {
      constructor() {
        super(`Merges with conflicts are not supported yet.`);
        this.code = this.name = MergeNotSupportedError.code;
        this.data = {};
      }
    };
    MergeNotSupportedError.code = "MergeNotSupportedError";
    var MissingNameError = class extends BaseError {
      constructor(role) {
        super(`No name was provided for ${role} in the argument or in the .git/config file.`);
        this.code = this.name = MissingNameError.code;
        this.data = { role };
      }
    };
    MissingNameError.code = "MissingNameError";
    var MissingParameterError = class extends BaseError {
      constructor(parameter) {
        super(`The function requires a "${parameter}" parameter but none was provided.`);
        this.code = this.name = MissingParameterError.code;
        this.data = { parameter };
      }
    };
    MissingParameterError.code = "MissingParameterError";
    var ParseError = class extends BaseError {
      constructor(expected, actual) {
        super(`Expected "${expected}" but received "${actual}".`);
        this.code = this.name = ParseError.code;
        this.data = { expected, actual };
      }
    };
    ParseError.code = "ParseError";
    var PushRejectedError = class extends BaseError {
      constructor(reason) {
        let message = "";
        if (reason === "not-fast-forward") {
          message = " because it was not a simple fast-forward";
        } else if (reason === "tag-exists") {
          message = " because tag already exists";
        }
        super(`Push rejected${message}. Use "force: true" to override.`);
        this.code = this.name = PushRejectedError.code;
        this.data = { reason };
      }
    };
    PushRejectedError.code = "PushRejectedError";
    var RemoteCapabilityError = class extends BaseError {
      constructor(capability, parameter) {
        super(`Remote does not support the "${capability}" so the "${parameter}" parameter cannot be used.`);
        this.code = this.name = RemoteCapabilityError.code;
        this.data = { capability, parameter };
      }
    };
    RemoteCapabilityError.code = "RemoteCapabilityError";
    var SmartHttpError = class extends BaseError {
      constructor(preview, response) {
        super(`Remote did not reply using the "smart" HTTP protocol. Expected "001e# service=git-upload-pack" but received: ${preview}`);
        this.code = this.name = SmartHttpError.code;
        this.data = { preview, response };
      }
    };
    SmartHttpError.code = "SmartHttpError";
    var UnknownTransportError = class extends BaseError {
      constructor(url, transport, suggestion) {
        super(`Git remote "${url}" uses an unrecognized transport protocol: "${transport}"`);
        this.code = this.name = UnknownTransportError.code;
        this.data = { url, transport, suggestion };
      }
    };
    UnknownTransportError.code = "UnknownTransportError";
    var UrlParseError = class extends BaseError {
      constructor(url) {
        super(`Cannot parse remote URL: "${url}"`);
        this.code = this.name = UrlParseError.code;
        this.data = { url };
      }
    };
    UrlParseError.code = "UrlParseError";
    var UserCanceledError = class extends BaseError {
      constructor() {
        super(`The operation was canceled.`);
        this.code = this.name = UserCanceledError.code;
        this.data = {};
      }
    };
    UserCanceledError.code = "UserCanceledError";
    var Errors = /* @__PURE__ */ Object.freeze({
      __proto__: null,
      AlreadyExistsError,
      AmbiguousError,
      CheckoutConflictError,
      CommitNotFetchedError,
      EmptyServerResponseError,
      FastForwardError,
      GitPushError,
      HttpError,
      InternalError,
      InvalidFilepathError,
      InvalidOidError,
      InvalidRefNameError,
      MaxDepthError,
      MergeNotSupportedError,
      MissingNameError,
      MissingParameterError,
      NoRefspecError,
      NotFoundError,
      ObjectTypeError,
      ParseError,
      PushRejectedError,
      RemoteCapabilityError,
      SmartHttpError,
      UnknownTransportError,
      UnsafeFilepathError,
      UrlParseError,
      UserCanceledError
    });
    function formatAuthor({ name: name2, email, timestamp, timezoneOffset }) {
      timezoneOffset = formatTimezoneOffset(timezoneOffset);
      return `${name2} <${email}> ${timestamp} ${timezoneOffset}`;
    }
    function formatTimezoneOffset(minutes) {
      const sign = simpleSign(negateExceptForZero(minutes));
      minutes = Math.abs(minutes);
      const hours = Math.floor(minutes / 60);
      minutes -= hours * 60;
      let strHours = String(hours);
      let strMinutes = String(minutes);
      if (strHours.length < 2)
        strHours = "0" + strHours;
      if (strMinutes.length < 2)
        strMinutes = "0" + strMinutes;
      return (sign === -1 ? "-" : "+") + strHours + strMinutes;
    }
    function simpleSign(n) {
      return Math.sign(n) || (Object.is(n, -0) ? -1 : 1);
    }
    function negateExceptForZero(n) {
      return n === 0 ? n : -n;
    }
    function normalizeNewlines(str) {
      str = str.replace(/\r/g, "");
      str = str.replace(/^\n+/, "");
      str = str.replace(/\n+$/, "") + "\n";
      return str;
    }
    function parseAuthor(author) {
      const [, name2, email, timestamp, offset] = author.match(/^(.*) <(.*)> (.*) (.*)$/);
      return {
        name: name2,
        email,
        timestamp: Number(timestamp),
        timezoneOffset: parseTimezoneOffset(offset)
      };
    }
    function parseTimezoneOffset(offset) {
      let [, sign, hours, minutes] = offset.match(/(\+|-)(\d\d)(\d\d)/);
      minutes = (sign === "+" ? 1 : -1) * (Number(hours) * 60 + Number(minutes));
      return negateExceptForZero$1(minutes);
    }
    function negateExceptForZero$1(n) {
      return n === 0 ? n : -n;
    }
    var GitAnnotatedTag = class {
      constructor(tag2) {
        if (typeof tag2 === "string") {
          this._tag = tag2;
        } else if (Buffer.isBuffer(tag2)) {
          this._tag = tag2.toString("utf8");
        } else if (typeof tag2 === "object") {
          this._tag = GitAnnotatedTag.render(tag2);
        } else {
          throw new InternalError("invalid type passed to GitAnnotatedTag constructor");
        }
      }
      static from(tag2) {
        return new GitAnnotatedTag(tag2);
      }
      static render(obj) {
        return `object ${obj.object}
type ${obj.type}
tag ${obj.tag}
tagger ${formatAuthor(obj.tagger)}

${obj.message}
${obj.gpgsig ? obj.gpgsig : ""}`;
      }
      justHeaders() {
        return this._tag.slice(0, this._tag.indexOf("\n\n"));
      }
      message() {
        const tag2 = this.withoutSignature();
        return tag2.slice(tag2.indexOf("\n\n") + 2);
      }
      parse() {
        return Object.assign(this.headers(), {
          message: this.message(),
          gpgsig: this.gpgsig()
        });
      }
      render() {
        return this._tag;
      }
      headers() {
        const headers = this.justHeaders().split("\n");
        const hs = [];
        for (const h of headers) {
          if (h[0] === " ") {
            hs[hs.length - 1] += "\n" + h.slice(1);
          } else {
            hs.push(h);
          }
        }
        const obj = {};
        for (const h of hs) {
          const key = h.slice(0, h.indexOf(" "));
          const value2 = h.slice(h.indexOf(" ") + 1);
          if (Array.isArray(obj[key])) {
            obj[key].push(value2);
          } else {
            obj[key] = value2;
          }
        }
        if (obj.tagger) {
          obj.tagger = parseAuthor(obj.tagger);
        }
        if (obj.committer) {
          obj.committer = parseAuthor(obj.committer);
        }
        return obj;
      }
      withoutSignature() {
        const tag2 = normalizeNewlines(this._tag);
        if (tag2.indexOf("\n-----BEGIN PGP SIGNATURE-----") === -1)
          return tag2;
        return tag2.slice(0, tag2.lastIndexOf("\n-----BEGIN PGP SIGNATURE-----"));
      }
      gpgsig() {
        if (this._tag.indexOf("\n-----BEGIN PGP SIGNATURE-----") === -1)
          return;
        const signature = this._tag.slice(this._tag.indexOf("-----BEGIN PGP SIGNATURE-----"), this._tag.indexOf("-----END PGP SIGNATURE-----") + "-----END PGP SIGNATURE-----".length);
        return normalizeNewlines(signature);
      }
      payload() {
        return this.withoutSignature() + "\n";
      }
      toObject() {
        return Buffer.from(this._tag, "utf8");
      }
      static async sign(tag2, sign, secretKey) {
        const payload = tag2.payload();
        let { signature } = await sign({ payload, secretKey });
        signature = normalizeNewlines(signature);
        const signedTag = payload + signature;
        return GitAnnotatedTag.from(signedTag);
      }
    };
    function indent(str) {
      return str.trim().split("\n").map((x) => " " + x).join("\n") + "\n";
    }
    function outdent(str) {
      return str.split("\n").map((x) => x.replace(/^ /, "")).join("\n");
    }
    var GitCommit = class {
      constructor(commit2) {
        if (typeof commit2 === "string") {
          this._commit = commit2;
        } else if (Buffer.isBuffer(commit2)) {
          this._commit = commit2.toString("utf8");
        } else if (typeof commit2 === "object") {
          this._commit = GitCommit.render(commit2);
        } else {
          throw new InternalError("invalid type passed to GitCommit constructor");
        }
      }
      static fromPayloadSignature({ payload, signature }) {
        const headers = GitCommit.justHeaders(payload);
        const message = GitCommit.justMessage(payload);
        const commit2 = normalizeNewlines(headers + "\ngpgsig" + indent(signature) + "\n" + message);
        return new GitCommit(commit2);
      }
      static from(commit2) {
        return new GitCommit(commit2);
      }
      toObject() {
        return Buffer.from(this._commit, "utf8");
      }
      headers() {
        return this.parseHeaders();
      }
      message() {
        return GitCommit.justMessage(this._commit);
      }
      parse() {
        return Object.assign({ message: this.message() }, this.headers());
      }
      static justMessage(commit2) {
        return normalizeNewlines(commit2.slice(commit2.indexOf("\n\n") + 2));
      }
      static justHeaders(commit2) {
        return commit2.slice(0, commit2.indexOf("\n\n"));
      }
      parseHeaders() {
        const headers = GitCommit.justHeaders(this._commit).split("\n");
        const hs = [];
        for (const h of headers) {
          if (h[0] === " ") {
            hs[hs.length - 1] += "\n" + h.slice(1);
          } else {
            hs.push(h);
          }
        }
        const obj = {
          parent: []
        };
        for (const h of hs) {
          const key = h.slice(0, h.indexOf(" "));
          const value2 = h.slice(h.indexOf(" ") + 1);
          if (Array.isArray(obj[key])) {
            obj[key].push(value2);
          } else {
            obj[key] = value2;
          }
        }
        if (obj.author) {
          obj.author = parseAuthor(obj.author);
        }
        if (obj.committer) {
          obj.committer = parseAuthor(obj.committer);
        }
        return obj;
      }
      static renderHeaders(obj) {
        let headers = "";
        if (obj.tree) {
          headers += `tree ${obj.tree}
`;
        } else {
          headers += `tree 4b825dc642cb6eb9a060e54bf8d69288fbee4904
`;
        }
        if (obj.parent) {
          if (obj.parent.length === void 0) {
            throw new InternalError(`commit 'parent' property should be an array`);
          }
          for (const p of obj.parent) {
            headers += `parent ${p}
`;
          }
        }
        const author = obj.author;
        headers += `author ${formatAuthor(author)}
`;
        const committer = obj.committer || obj.author;
        headers += `committer ${formatAuthor(committer)}
`;
        if (obj.gpgsig) {
          headers += "gpgsig" + indent(obj.gpgsig);
        }
        return headers;
      }
      static render(obj) {
        return GitCommit.renderHeaders(obj) + "\n" + normalizeNewlines(obj.message);
      }
      render() {
        return this._commit;
      }
      withoutSignature() {
        const commit2 = normalizeNewlines(this._commit);
        if (commit2.indexOf("\ngpgsig") === -1)
          return commit2;
        const headers = commit2.slice(0, commit2.indexOf("\ngpgsig"));
        const message = commit2.slice(commit2.indexOf("-----END PGP SIGNATURE-----\n") + "-----END PGP SIGNATURE-----\n".length);
        return normalizeNewlines(headers + "\n" + message);
      }
      isolateSignature() {
        const signature = this._commit.slice(this._commit.indexOf("-----BEGIN PGP SIGNATURE-----"), this._commit.indexOf("-----END PGP SIGNATURE-----") + "-----END PGP SIGNATURE-----".length);
        return outdent(signature);
      }
      static async sign(commit2, sign, secretKey) {
        const payload = commit2.withoutSignature();
        const message = GitCommit.justMessage(commit2._commit);
        let { signature } = await sign({ payload, secretKey });
        signature = normalizeNewlines(signature);
        const headers = GitCommit.justHeaders(commit2._commit);
        const signedCommit = headers + "\ngpgsig" + indent(signature) + "\n" + message;
        return GitCommit.from(signedCommit);
      }
    };
    async function resolveTree({ fs: fs3, cache, gitdir, oid }) {
      if (oid === "4b825dc642cb6eb9a060e54bf8d69288fbee4904") {
        return { tree: GitTree.from([]), oid };
      }
      const { type, object } = await _readObject({ fs: fs3, cache, gitdir, oid });
      if (type === "tag") {
        oid = GitAnnotatedTag.from(object).parse().object;
        return resolveTree({ fs: fs3, cache, gitdir, oid });
      }
      if (type === "commit") {
        oid = GitCommit.from(object).parse().tree;
        return resolveTree({ fs: fs3, cache, gitdir, oid });
      }
      if (type !== "tree") {
        throw new ObjectTypeError(oid, type, "tree");
      }
      return { tree: GitTree.from(object), oid };
    }
    var GitWalkerRepo = class {
      constructor({ fs: fs3, gitdir, ref, cache }) {
        this.fs = fs3;
        this.cache = cache;
        this.gitdir = gitdir;
        this.mapPromise = (async () => {
          const map = /* @__PURE__ */ new Map();
          let oid;
          try {
            oid = await GitRefManager.resolve({ fs: fs3, gitdir, ref });
          } catch (e) {
            if (e instanceof NotFoundError) {
              oid = "4b825dc642cb6eb9a060e54bf8d69288fbee4904";
            }
          }
          const tree = await resolveTree({ fs: fs3, cache: this.cache, gitdir, oid });
          tree.type = "tree";
          tree.mode = "40000";
          map.set(".", tree);
          return map;
        })();
        const walker = this;
        this.ConstructEntry = class TreeEntry {
          constructor(fullpath) {
            this._fullpath = fullpath;
            this._type = false;
            this._mode = false;
            this._stat = false;
            this._content = false;
            this._oid = false;
          }
          async type() {
            return walker.type(this);
          }
          async mode() {
            return walker.mode(this);
          }
          async stat() {
            return walker.stat(this);
          }
          async content() {
            return walker.content(this);
          }
          async oid() {
            return walker.oid(this);
          }
        };
      }
      async readdir(entry) {
        const filepath = entry._fullpath;
        const { fs: fs3, cache, gitdir } = this;
        const map = await this.mapPromise;
        const obj = map.get(filepath);
        if (!obj)
          throw new Error(`No obj for ${filepath}`);
        const oid = obj.oid;
        if (!oid)
          throw new Error(`No oid for obj ${JSON.stringify(obj)}`);
        if (obj.type !== "tree") {
          return null;
        }
        const { type, object } = await _readObject({ fs: fs3, cache, gitdir, oid });
        if (type !== obj.type) {
          throw new ObjectTypeError(oid, type, obj.type);
        }
        const tree = GitTree.from(object);
        for (const entry2 of tree) {
          map.set(join9(filepath, entry2.path), entry2);
        }
        return tree.entries().map((entry2) => join9(filepath, entry2.path));
      }
      async type(entry) {
        if (entry._type === false) {
          const map = await this.mapPromise;
          const { type } = map.get(entry._fullpath);
          entry._type = type;
        }
        return entry._type;
      }
      async mode(entry) {
        if (entry._mode === false) {
          const map = await this.mapPromise;
          const { mode } = map.get(entry._fullpath);
          entry._mode = normalizeMode(parseInt(mode, 8));
        }
        return entry._mode;
      }
      async stat(_entry) {
      }
      async content(entry) {
        if (entry._content === false) {
          const map = await this.mapPromise;
          const { fs: fs3, cache, gitdir } = this;
          const obj = map.get(entry._fullpath);
          const oid = obj.oid;
          const { type, object } = await _readObject({ fs: fs3, cache, gitdir, oid });
          if (type !== "blob") {
            entry._content = void 0;
          } else {
            entry._content = new Uint8Array(object);
          }
        }
        return entry._content;
      }
      async oid(entry) {
        if (entry._oid === false) {
          const map = await this.mapPromise;
          const obj = map.get(entry._fullpath);
          entry._oid = obj.oid;
        }
        return entry._oid;
      }
    };
    function TREE({ ref = "HEAD" }) {
      const o = Object.create(null);
      Object.defineProperty(o, GitWalkSymbol, {
        value: function({ fs: fs3, gitdir, cache }) {
          return new GitWalkerRepo({ fs: fs3, gitdir, ref, cache });
        }
      });
      Object.freeze(o);
      return o;
    }
    var GitWalkerFs = class {
      constructor({ fs: fs3, dir, gitdir, cache }) {
        this.fs = fs3;
        this.cache = cache;
        this.dir = dir;
        this.gitdir = gitdir;
        const walker = this;
        this.ConstructEntry = class WorkdirEntry {
          constructor(fullpath) {
            this._fullpath = fullpath;
            this._type = false;
            this._mode = false;
            this._stat = false;
            this._content = false;
            this._oid = false;
          }
          async type() {
            return walker.type(this);
          }
          async mode() {
            return walker.mode(this);
          }
          async stat() {
            return walker.stat(this);
          }
          async content() {
            return walker.content(this);
          }
          async oid() {
            return walker.oid(this);
          }
        };
      }
      async readdir(entry) {
        const filepath = entry._fullpath;
        const { fs: fs3, dir } = this;
        const names = await fs3.readdir(join9(dir, filepath));
        if (names === null)
          return null;
        return names.map((name2) => join9(filepath, name2));
      }
      async type(entry) {
        if (entry._type === false) {
          await entry.stat();
        }
        return entry._type;
      }
      async mode(entry) {
        if (entry._mode === false) {
          await entry.stat();
        }
        return entry._mode;
      }
      async stat(entry) {
        if (entry._stat === false) {
          const { fs: fs3, dir } = this;
          let stat2 = await fs3.lstat(`${dir}/${entry._fullpath}`);
          if (!stat2) {
            throw new Error(`ENOENT: no such file or directory, lstat '${entry._fullpath}'`);
          }
          let type = stat2.isDirectory() ? "tree" : "blob";
          if (type === "blob" && !stat2.isFile() && !stat2.isSymbolicLink()) {
            type = "special";
          }
          entry._type = type;
          stat2 = normalizeStats(stat2);
          entry._mode = stat2.mode;
          if (stat2.size === -1 && entry._actualSize) {
            stat2.size = entry._actualSize;
          }
          entry._stat = stat2;
        }
        return entry._stat;
      }
      async content(entry) {
        if (entry._content === false) {
          const { fs: fs3, dir } = this;
          if (await entry.type() === "tree") {
            entry._content = void 0;
          } else {
            const content = await fs3.read(`${dir}/${entry._fullpath}`);
            entry._actualSize = content.length;
            if (entry._stat && entry._stat.size === -1) {
              entry._stat.size = entry._actualSize;
            }
            entry._content = new Uint8Array(content);
          }
        }
        return entry._content;
      }
      async oid(entry) {
        if (entry._oid === false) {
          const { fs: fs3, gitdir, cache } = this;
          let oid;
          await GitIndexManager.acquire({ fs: fs3, gitdir, cache }, async function(index2) {
            const stage = index2.entriesMap.get(entry._fullpath);
            const stats = await entry.stat();
            if (!stage || compareStats(stats, stage)) {
              const content = await entry.content();
              if (content === void 0) {
                oid = void 0;
              } else {
                oid = await shasum(GitObject.wrap({ type: "blob", object: await entry.content() }));
                if (stage && oid === stage.oid && stats.mode === stage.mode && compareStats(stats, stage)) {
                  index2.insert({
                    filepath: entry._fullpath,
                    stats,
                    oid
                  });
                }
              }
            } else {
              oid = stage.oid;
            }
          });
          entry._oid = oid;
        }
        return entry._oid;
      }
    };
    function WORKDIR() {
      const o = Object.create(null);
      Object.defineProperty(o, GitWalkSymbol, {
        value: function({ fs: fs3, dir, gitdir, cache }) {
          return new GitWalkerFs({ fs: fs3, dir, gitdir, cache });
        }
      });
      Object.freeze(o);
      return o;
    }
    var GitIgnoreManager = class {
      static async isIgnored({ fs: fs3, dir, gitdir = join9(dir, ".git"), filepath }) {
        if (basename(filepath) === ".git")
          return true;
        if (filepath === ".")
          return false;
        let excludes = "";
        const excludesFile = join9(gitdir, "info", "exclude");
        if (await fs3.exists(excludesFile)) {
          excludes = await fs3.read(excludesFile, "utf8");
        }
        const pairs = [
          {
            gitignore: join9(dir, ".gitignore"),
            filepath
          }
        ];
        const pieces = filepath.split("/");
        for (let i2 = 1; i2 < pieces.length; i2++) {
          const folder = pieces.slice(0, i2).join("/");
          const file = pieces.slice(i2).join("/");
          pairs.push({
            gitignore: join9(dir, folder, ".gitignore"),
            filepath: file
          });
        }
        let ignoredStatus = false;
        for (const p of pairs) {
          let file;
          try {
            file = await fs3.read(p.gitignore, "utf8");
          } catch (err) {
            if (err.code === "NOENT")
              continue;
          }
          const ign = ignore().add(excludes);
          ign.add(file);
          const parentdir = dirname(p.filepath);
          if (parentdir !== "." && ign.ignores(parentdir))
            return true;
          if (ignoredStatus) {
            ignoredStatus = !ign.test(p.filepath).unignored;
          } else {
            ignoredStatus = ign.test(p.filepath).ignored;
          }
        }
        return ignoredStatus;
      }
    };
    async function rmRecursive(fs3, filepath) {
      const entries = await fs3.readdir(filepath);
      if (entries == null) {
        await fs3.rm(filepath);
      } else if (entries.length) {
        await Promise.all(entries.map((entry) => {
          const subpath = join9(filepath, entry);
          return fs3.lstat(subpath).then((stat2) => {
            if (!stat2)
              return;
            return stat2.isDirectory() ? rmRecursive(fs3, subpath) : fs3.rm(subpath);
          });
        })).then(() => fs3.rmdir(filepath));
      } else {
        await fs3.rmdir(filepath);
      }
    }
    var FileSystem = class {
      constructor(fs3) {
        if (typeof fs3._original_unwrapped_fs !== "undefined")
          return fs3;
        const promises2 = Object.getOwnPropertyDescriptor(fs3, "promises");
        if (promises2 && promises2.enumerable) {
          this._readFile = fs3.promises.readFile.bind(fs3.promises);
          this._writeFile = fs3.promises.writeFile.bind(fs3.promises);
          this._mkdir = fs3.promises.mkdir.bind(fs3.promises);
          if (fs3.promises.rm) {
            this._rm = fs3.promises.rm.bind(fs3.promises);
          } else if (fs3.promises.rmdir.length > 1) {
            this._rm = fs3.promises.rmdir.bind(fs3.promises);
          } else {
            this._rm = rmRecursive.bind(null, this);
          }
          this._rmdir = fs3.promises.rmdir.bind(fs3.promises);
          this._unlink = fs3.promises.unlink.bind(fs3.promises);
          this._stat = fs3.promises.stat.bind(fs3.promises);
          this._lstat = fs3.promises.lstat.bind(fs3.promises);
          this._readdir = fs3.promises.readdir.bind(fs3.promises);
          this._readlink = fs3.promises.readlink.bind(fs3.promises);
          this._symlink = fs3.promises.symlink.bind(fs3.promises);
        } else {
          this._readFile = pify(fs3.readFile.bind(fs3));
          this._writeFile = pify(fs3.writeFile.bind(fs3));
          this._mkdir = pify(fs3.mkdir.bind(fs3));
          if (fs3.rm) {
            this._rm = pify(fs3.rm.bind(fs3));
          } else if (fs3.rmdir.length > 2) {
            this._rm = pify(fs3.rmdir.bind(fs3));
          } else {
            this._rm = rmRecursive.bind(null, this);
          }
          this._rmdir = pify(fs3.rmdir.bind(fs3));
          this._unlink = pify(fs3.unlink.bind(fs3));
          this._stat = pify(fs3.stat.bind(fs3));
          this._lstat = pify(fs3.lstat.bind(fs3));
          this._readdir = pify(fs3.readdir.bind(fs3));
          this._readlink = pify(fs3.readlink.bind(fs3));
          this._symlink = pify(fs3.symlink.bind(fs3));
        }
        this._original_unwrapped_fs = fs3;
      }
      async exists(filepath, options = {}) {
        try {
          await this._stat(filepath);
          return true;
        } catch (err) {
          if (err.code === "ENOENT" || err.code === "ENOTDIR") {
            return false;
          } else {
            console.log('Unhandled error in "FileSystem.exists()" function', err);
            throw err;
          }
        }
      }
      async read(filepath, options = {}) {
        try {
          let buffer = await this._readFile(filepath, options);
          if (typeof buffer !== "string") {
            buffer = Buffer.from(buffer);
          }
          return buffer;
        } catch (err) {
          return null;
        }
      }
      async write(filepath, contents, options = {}) {
        try {
          await this._writeFile(filepath, contents, options);
          return;
        } catch (err) {
          await this.mkdir(dirname(filepath));
          await this._writeFile(filepath, contents, options);
        }
      }
      async mkdir(filepath, _selfCall = false) {
        try {
          await this._mkdir(filepath);
          return;
        } catch (err) {
          if (err === null)
            return;
          if (err.code === "EEXIST")
            return;
          if (_selfCall)
            throw err;
          if (err.code === "ENOENT") {
            const parent = dirname(filepath);
            if (parent === "." || parent === "/" || parent === filepath)
              throw err;
            await this.mkdir(parent);
            await this.mkdir(filepath, true);
          }
        }
      }
      async rm(filepath) {
        try {
          await this._unlink(filepath);
        } catch (err) {
          if (err.code !== "ENOENT")
            throw err;
        }
      }
      async rmdir(filepath, opts) {
        try {
          if (opts && opts.recursive) {
            await this._rm(filepath, opts);
          } else {
            await this._rmdir(filepath);
          }
        } catch (err) {
          if (err.code !== "ENOENT")
            throw err;
        }
      }
      async readdir(filepath) {
        try {
          const names = await this._readdir(filepath);
          names.sort(compareStrings);
          return names;
        } catch (err) {
          if (err.code === "ENOTDIR")
            return null;
          return [];
        }
      }
      async readdirDeep(dir) {
        const subdirs = await this._readdir(dir);
        const files = await Promise.all(subdirs.map(async (subdir) => {
          const res = dir + "/" + subdir;
          return (await this._stat(res)).isDirectory() ? this.readdirDeep(res) : res;
        }));
        return files.reduce((a, f) => a.concat(f), []);
      }
      async lstat(filename) {
        try {
          const stats = await this._lstat(filename);
          return stats;
        } catch (err) {
          if (err.code === "ENOENT") {
            return null;
          }
          throw err;
        }
      }
      async readlink(filename, opts = { encoding: "buffer" }) {
        try {
          const link2 = await this._readlink(filename, opts);
          return Buffer.isBuffer(link2) ? link2 : Buffer.from(link2);
        } catch (err) {
          if (err.code === "ENOENT") {
            return null;
          }
          throw err;
        }
      }
      async writelink(filename, buffer) {
        return this._symlink(buffer.toString("utf8"), filename);
      }
    };
    async function writeObjectLoose({ fs: fs3, gitdir, object, format, oid }) {
      if (format !== "deflated") {
        throw new InternalError("GitObjectStoreLoose expects objects to write to be in deflated format");
      }
      const source = `objects/${oid.slice(0, 2)}/${oid.slice(2)}`;
      const filepath = `${gitdir}/${source}`;
      if (!await fs3.exists(filepath))
        await fs3.write(filepath, object);
    }
    var supportsCompressionStream = null;
    async function deflate(buffer) {
      if (supportsCompressionStream === null) {
        supportsCompressionStream = testCompressionStream();
      }
      return supportsCompressionStream ? browserDeflate(buffer) : pako.deflate(buffer);
    }
    async function browserDeflate(buffer) {
      const cs = new CompressionStream("deflate");
      const c = new Blob([buffer]).stream().pipeThrough(cs);
      return new Uint8Array(await new Response(c).arrayBuffer());
    }
    function testCompressionStream() {
      try {
        const cs = new CompressionStream("deflate");
        new Blob([]).stream();
        if (cs)
          return true;
      } catch (_) {
      }
      return false;
    }
    async function _writeObject({
      fs: fs3,
      gitdir,
      type,
      object,
      format = "content",
      oid = void 0,
      dryRun = false
    }) {
      if (format !== "deflated") {
        if (format !== "wrapped") {
          object = GitObject.wrap({ type, object });
        }
        oid = await shasum(object);
        object = Buffer.from(await deflate(object));
      }
      if (!dryRun) {
        await writeObjectLoose({ fs: fs3, gitdir, object, format: "deflated", oid });
      }
      return oid;
    }
    function assertParameter(name2, value2) {
      if (value2 === void 0) {
        throw new MissingParameterError(name2);
      }
    }
    function posixifyPathBuffer(buffer) {
      let idx;
      while (~(idx = buffer.indexOf(92)))
        buffer[idx] = 47;
      return buffer;
    }
    async function add({
      fs: _fs,
      dir,
      gitdir = join9(dir, ".git"),
      filepath,
      cache = {}
    }) {
      try {
        assertParameter("fs", _fs);
        assertParameter("dir", dir);
        assertParameter("gitdir", gitdir);
        assertParameter("filepath", filepath);
        const fs3 = new FileSystem(_fs);
        await GitIndexManager.acquire({ fs: fs3, gitdir, cache }, async function(index2) {
          await addToIndex({ dir, gitdir, fs: fs3, filepath, index: index2 });
        });
      } catch (err) {
        err.caller = "git.add";
        throw err;
      }
    }
    async function addToIndex({ dir, gitdir, fs: fs3, filepath, index: index2 }) {
      const ignored = await GitIgnoreManager.isIgnored({
        fs: fs3,
        dir,
        gitdir,
        filepath
      });
      if (ignored)
        return;
      const stats = await fs3.lstat(join9(dir, filepath));
      if (!stats)
        throw new NotFoundError(filepath);
      if (stats.isDirectory()) {
        const children = await fs3.readdir(join9(dir, filepath));
        const promises2 = children.map((child) => addToIndex({ dir, gitdir, fs: fs3, filepath: join9(filepath, child), index: index2 }));
        await Promise.all(promises2);
      } else {
        const object = stats.isSymbolicLink() ? await fs3.readlink(join9(dir, filepath)).then(posixifyPathBuffer) : await fs3.read(join9(dir, filepath));
        if (object === null)
          throw new NotFoundError(filepath);
        const oid = await _writeObject({ fs: fs3, gitdir, type: "blob", object });
        index2.insert({ filepath, stats, oid });
      }
    }
    async function _commit({
      fs: fs3,
      cache,
      onSign,
      gitdir,
      message,
      author,
      committer,
      signingKey,
      dryRun = false,
      noUpdateBranch = false,
      ref,
      parent,
      tree
    }) {
      if (!ref) {
        ref = await GitRefManager.resolve({
          fs: fs3,
          gitdir,
          ref: "HEAD",
          depth: 2
        });
      }
      return GitIndexManager.acquire({ fs: fs3, gitdir, cache }, async function(index2) {
        const inodes = flatFileListToDirectoryStructure(index2.entries);
        const inode = inodes.get(".");
        if (!tree) {
          tree = await constructTree({ fs: fs3, gitdir, inode, dryRun });
        }
        if (!parent) {
          try {
            parent = [
              await GitRefManager.resolve({
                fs: fs3,
                gitdir,
                ref
              })
            ];
          } catch (err) {
            parent = [];
          }
        }
        let comm = GitCommit.from({
          tree,
          parent,
          author,
          committer,
          message
        });
        if (signingKey) {
          comm = await GitCommit.sign(comm, onSign, signingKey);
        }
        const oid = await _writeObject({
          fs: fs3,
          gitdir,
          type: "commit",
          object: comm.toObject(),
          dryRun
        });
        if (!noUpdateBranch && !dryRun) {
          await GitRefManager.writeRef({
            fs: fs3,
            gitdir,
            ref,
            value: oid
          });
        }
        return oid;
      });
    }
    async function constructTree({ fs: fs3, gitdir, inode, dryRun }) {
      const children = inode.children;
      for (const inode2 of children) {
        if (inode2.type === "tree") {
          inode2.metadata.mode = "040000";
          inode2.metadata.oid = await constructTree({ fs: fs3, gitdir, inode: inode2, dryRun });
        }
      }
      const entries = children.map((inode2) => ({
        mode: inode2.metadata.mode,
        path: inode2.basename,
        oid: inode2.metadata.oid,
        type: inode2.type
      }));
      const tree = GitTree.from(entries);
      const oid = await _writeObject({
        fs: fs3,
        gitdir,
        type: "tree",
        object: tree.toObject(),
        dryRun
      });
      return oid;
    }
    async function resolveFilepath({ fs: fs3, cache, gitdir, oid, filepath }) {
      if (filepath.startsWith("/")) {
        throw new InvalidFilepathError("leading-slash");
      } else if (filepath.endsWith("/")) {
        throw new InvalidFilepathError("trailing-slash");
      }
      const _oid = oid;
      const result = await resolveTree({ fs: fs3, cache, gitdir, oid });
      const tree = result.tree;
      if (filepath === "") {
        oid = result.oid;
      } else {
        const pathArray = filepath.split("/");
        oid = await _resolveFilepath({
          fs: fs3,
          cache,
          gitdir,
          tree,
          pathArray,
          oid: _oid,
          filepath
        });
      }
      return oid;
    }
    async function _resolveFilepath({
      fs: fs3,
      cache,
      gitdir,
      tree,
      pathArray,
      oid,
      filepath
    }) {
      const name2 = pathArray.shift();
      for (const entry of tree) {
        if (entry.path === name2) {
          if (pathArray.length === 0) {
            return entry.oid;
          } else {
            const { type, object } = await _readObject({
              fs: fs3,
              cache,
              gitdir,
              oid: entry.oid
            });
            if (type !== "tree") {
              throw new ObjectTypeError(oid, type, "blob", filepath);
            }
            tree = GitTree.from(object);
            return _resolveFilepath({
              fs: fs3,
              cache,
              gitdir,
              tree,
              pathArray,
              oid,
              filepath
            });
          }
        }
      }
      throw new NotFoundError(`file or directory found at "${oid}:${filepath}"`);
    }
    async function _readTree({
      fs: fs3,
      cache,
      gitdir,
      oid,
      filepath = void 0
    }) {
      if (filepath !== void 0) {
        oid = await resolveFilepath({ fs: fs3, cache, gitdir, oid, filepath });
      }
      const { tree, oid: treeOid } = await resolveTree({ fs: fs3, cache, gitdir, oid });
      const result = {
        oid: treeOid,
        tree: tree.entries()
      };
      return result;
    }
    async function _writeTree({ fs: fs3, gitdir, tree }) {
      const object = GitTree.from(tree).toObject();
      const oid = await _writeObject({
        fs: fs3,
        gitdir,
        type: "tree",
        object,
        format: "content"
      });
      return oid;
    }
    async function _addNote({
      fs: fs3,
      cache,
      onSign,
      gitdir,
      ref,
      oid,
      note,
      force,
      author,
      committer,
      signingKey
    }) {
      let parent;
      try {
        parent = await GitRefManager.resolve({ gitdir, fs: fs3, ref });
      } catch (err) {
        if (!(err instanceof NotFoundError)) {
          throw err;
        }
      }
      const result = await _readTree({
        fs: fs3,
        cache,
        gitdir,
        oid: parent || "4b825dc642cb6eb9a060e54bf8d69288fbee4904"
      });
      let tree = result.tree;
      if (force) {
        tree = tree.filter((entry) => entry.path !== oid);
      } else {
        for (const entry of tree) {
          if (entry.path === oid) {
            throw new AlreadyExistsError("note", oid);
          }
        }
      }
      if (typeof note === "string") {
        note = Buffer.from(note, "utf8");
      }
      const noteOid = await _writeObject({
        fs: fs3,
        gitdir,
        type: "blob",
        object: note,
        format: "content"
      });
      tree.push({ mode: "100644", path: oid, oid: noteOid, type: "blob" });
      const treeOid = await _writeTree({
        fs: fs3,
        gitdir,
        tree
      });
      const commitOid = await _commit({
        fs: fs3,
        cache,
        onSign,
        gitdir,
        ref,
        tree: treeOid,
        parent: parent && [parent],
        message: `Note added by 'isomorphic-git addNote'
`,
        author,
        committer,
        signingKey
      });
      return commitOid;
    }
    async function _getConfig({ fs: fs3, gitdir, path: path2 }) {
      const config = await GitConfigManager.get({ fs: fs3, gitdir });
      return config.get(path2);
    }
    async function normalizeAuthorObject({ fs: fs3, gitdir, author = {} }) {
      let { name: name2, email, timestamp, timezoneOffset } = author;
      name2 = name2 || await _getConfig({ fs: fs3, gitdir, path: "user.name" });
      email = email || await _getConfig({ fs: fs3, gitdir, path: "user.email" }) || "";
      if (name2 === void 0) {
        return void 0;
      }
      timestamp = timestamp != null ? timestamp : Math.floor(Date.now() / 1e3);
      timezoneOffset = timezoneOffset != null ? timezoneOffset : new Date(timestamp * 1e3).getTimezoneOffset();
      return { name: name2, email, timestamp, timezoneOffset };
    }
    async function normalizeCommitterObject({
      fs: fs3,
      gitdir,
      author,
      committer
    }) {
      committer = Object.assign({}, committer || author);
      if (author) {
        committer.timestamp = committer.timestamp || author.timestamp;
        committer.timezoneOffset = committer.timezoneOffset || author.timezoneOffset;
      }
      committer = await normalizeAuthorObject({ fs: fs3, gitdir, author: committer });
      return committer;
    }
    async function addNote({
      fs: _fs,
      onSign,
      dir,
      gitdir = join9(dir, ".git"),
      ref = "refs/notes/commits",
      oid,
      note,
      force,
      author: _author,
      committer: _committer,
      signingKey,
      cache = {}
    }) {
      try {
        assertParameter("fs", _fs);
        assertParameter("gitdir", gitdir);
        assertParameter("oid", oid);
        assertParameter("note", note);
        if (signingKey) {
          assertParameter("onSign", onSign);
        }
        const fs3 = new FileSystem(_fs);
        const author = await normalizeAuthorObject({ fs: fs3, gitdir, author: _author });
        if (!author)
          throw new MissingNameError("author");
        const committer = await normalizeCommitterObject({
          fs: fs3,
          gitdir,
          author,
          committer: _committer
        });
        if (!committer)
          throw new MissingNameError("committer");
        return await _addNote({
          fs: new FileSystem(fs3),
          cache,
          onSign,
          gitdir,
          ref,
          oid,
          note,
          force,
          author,
          committer,
          signingKey
        });
      } catch (err) {
        err.caller = "git.addNote";
        throw err;
      }
    }
    async function _addRemote({ fs: fs3, gitdir, remote, url, force }) {
      if (remote !== cleanGitRef.clean(remote)) {
        throw new InvalidRefNameError(remote, cleanGitRef.clean(remote));
      }
      const config = await GitConfigManager.get({ fs: fs3, gitdir });
      if (!force) {
        const remoteNames = await config.getSubsections("remote");
        if (remoteNames.includes(remote)) {
          if (url !== await config.get(`remote.${remote}.url`)) {
            throw new AlreadyExistsError("remote", remote);
          }
        }
      }
      await config.set(`remote.${remote}.url`, url);
      await config.set(`remote.${remote}.fetch`, `+refs/heads/*:refs/remotes/${remote}/*`);
      await GitConfigManager.save({ fs: fs3, gitdir, config });
    }
    async function addRemote({
      fs: fs3,
      dir,
      gitdir = join9(dir, ".git"),
      remote,
      url,
      force = false
    }) {
      try {
        assertParameter("fs", fs3);
        assertParameter("gitdir", gitdir);
        assertParameter("remote", remote);
        assertParameter("url", url);
        return await _addRemote({
          fs: new FileSystem(fs3),
          gitdir,
          remote,
          url,
          force
        });
      } catch (err) {
        err.caller = "git.addRemote";
        throw err;
      }
    }
    async function _annotatedTag({
      fs: fs3,
      cache,
      onSign,
      gitdir,
      ref,
      tagger,
      message = ref,
      gpgsig,
      object,
      signingKey,
      force = false
    }) {
      ref = ref.startsWith("refs/tags/") ? ref : `refs/tags/${ref}`;
      if (!force && await GitRefManager.exists({ fs: fs3, gitdir, ref })) {
        throw new AlreadyExistsError("tag", ref);
      }
      const oid = await GitRefManager.resolve({
        fs: fs3,
        gitdir,
        ref: object || "HEAD"
      });
      const { type } = await _readObject({ fs: fs3, cache, gitdir, oid });
      let tagObject = GitAnnotatedTag.from({
        object: oid,
        type,
        tag: ref.replace("refs/tags/", ""),
        tagger,
        message,
        gpgsig
      });
      if (signingKey) {
        tagObject = await GitAnnotatedTag.sign(tagObject, onSign, signingKey);
      }
      const value2 = await _writeObject({
        fs: fs3,
        gitdir,
        type: "tag",
        object: tagObject.toObject()
      });
      await GitRefManager.writeRef({ fs: fs3, gitdir, ref, value: value2 });
    }
    async function annotatedTag({
      fs: _fs,
      onSign,
      dir,
      gitdir = join9(dir, ".git"),
      ref,
      tagger: _tagger,
      message = ref,
      gpgsig,
      object,
      signingKey,
      force = false,
      cache = {}
    }) {
      try {
        assertParameter("fs", _fs);
        assertParameter("gitdir", gitdir);
        assertParameter("ref", ref);
        if (signingKey) {
          assertParameter("onSign", onSign);
        }
        const fs3 = new FileSystem(_fs);
        const tagger = await normalizeAuthorObject({ fs: fs3, gitdir, author: _tagger });
        if (!tagger)
          throw new MissingNameError("tagger");
        return await _annotatedTag({
          fs: fs3,
          cache,
          onSign,
          gitdir,
          ref,
          tagger,
          message,
          gpgsig,
          object,
          signingKey,
          force
        });
      } catch (err) {
        err.caller = "git.annotatedTag";
        throw err;
      }
    }
    async function _branch({ fs: fs3, gitdir, ref, checkout: checkout2 = false }) {
      if (ref !== cleanGitRef.clean(ref)) {
        throw new InvalidRefNameError(ref, cleanGitRef.clean(ref));
      }
      const fullref = `refs/heads/${ref}`;
      const exist = await GitRefManager.exists({ fs: fs3, gitdir, ref: fullref });
      if (exist) {
        throw new AlreadyExistsError("branch", ref, false);
      }
      let oid;
      try {
        oid = await GitRefManager.resolve({ fs: fs3, gitdir, ref: "HEAD" });
      } catch (e) {
      }
      if (oid) {
        await GitRefManager.writeRef({ fs: fs3, gitdir, ref: fullref, value: oid });
      }
      if (checkout2) {
        await GitRefManager.writeSymbolicRef({
          fs: fs3,
          gitdir,
          ref: "HEAD",
          value: fullref
        });
      }
    }
    async function branch({
      fs: fs3,
      dir,
      gitdir = join9(dir, ".git"),
      ref,
      checkout: checkout2 = false
    }) {
      try {
        assertParameter("fs", fs3);
        assertParameter("gitdir", gitdir);
        assertParameter("ref", ref);
        return await _branch({
          fs: new FileSystem(fs3),
          gitdir,
          ref,
          checkout: checkout2
        });
      } catch (err) {
        err.caller = "git.branch";
        throw err;
      }
    }
    function arrayRange(start, end) {
      const length = end - start;
      return Array.from({ length }, (_, i2) => start + i2);
    }
    var flat = typeof Array.prototype.flat === "undefined" ? (entries) => entries.reduce((acc, x) => acc.concat(x), []) : (entries) => entries.flat();
    var RunningMinimum = class {
      constructor() {
        this.value = null;
      }
      consider(value2) {
        if (value2 === null || value2 === void 0)
          return;
        if (this.value === null) {
          this.value = value2;
        } else if (value2 < this.value) {
          this.value = value2;
        }
      }
      reset() {
        this.value = null;
      }
    };
    function* unionOfIterators(sets) {
      const min = new RunningMinimum();
      let minimum;
      const heads = [];
      const numsets = sets.length;
      for (let i2 = 0; i2 < numsets; i2++) {
        heads[i2] = sets[i2].next().value;
        if (heads[i2] !== void 0) {
          min.consider(heads[i2]);
        }
      }
      if (min.value === null)
        return;
      while (true) {
        const result = [];
        minimum = min.value;
        min.reset();
        for (let i2 = 0; i2 < numsets; i2++) {
          if (heads[i2] !== void 0 && heads[i2] === minimum) {
            result[i2] = heads[i2];
            heads[i2] = sets[i2].next().value;
          } else {
            result[i2] = null;
          }
          if (heads[i2] !== void 0) {
            min.consider(heads[i2]);
          }
        }
        yield result;
        if (min.value === null)
          return;
      }
    }
    async function _walk({
      fs: fs3,
      cache,
      dir,
      gitdir,
      trees,
      map = async (_, entry) => entry,
      reduce = async (parent, children) => {
        const flatten = flat(children);
        if (parent !== void 0)
          flatten.unshift(parent);
        return flatten;
      },
      iterate = (walk2, children) => Promise.all([...children].map(walk2))
    }) {
      const walkers = trees.map((proxy) => proxy[GitWalkSymbol]({ fs: fs3, dir, gitdir, cache }));
      const root2 = new Array(walkers.length).fill(".");
      const range = arrayRange(0, walkers.length);
      const unionWalkerFromReaddir = async (entries) => {
        range.map((i2) => {
          entries[i2] = entries[i2] && new walkers[i2].ConstructEntry(entries[i2]);
        });
        const subdirs = await Promise.all(range.map((i2) => entries[i2] ? walkers[i2].readdir(entries[i2]) : []));
        const iterators = subdirs.map((array) => array === null ? [] : array).map((array) => array[Symbol.iterator]());
        return {
          entries,
          children: unionOfIterators(iterators)
        };
      };
      const walk2 = async (root3) => {
        const { entries, children } = await unionWalkerFromReaddir(root3);
        const fullpath = entries.find((entry) => entry && entry._fullpath)._fullpath;
        const parent = await map(fullpath, entries);
        if (parent !== null) {
          let walkedChildren = await iterate(walk2, children);
          walkedChildren = walkedChildren.filter((x) => x !== void 0);
          return reduce(parent, walkedChildren);
        }
      };
      return walk2(root2);
    }
    var worthWalking = (filepath, root2) => {
      if (filepath === "." || root2 == null || root2.length === 0 || root2 === ".") {
        return true;
      }
      if (root2.length >= filepath.length) {
        return root2.startsWith(filepath);
      } else {
        return filepath.startsWith(root2);
      }
    };
    async function _checkout({
      fs: fs3,
      cache,
      onProgress,
      dir,
      gitdir,
      remote,
      ref,
      filepaths,
      noCheckout,
      noUpdateHead,
      dryRun,
      force
    }) {
      let oid;
      try {
        oid = await GitRefManager.resolve({ fs: fs3, gitdir, ref });
      } catch (err) {
        if (ref === "HEAD")
          throw err;
        const remoteRef = `${remote}/${ref}`;
        oid = await GitRefManager.resolve({
          fs: fs3,
          gitdir,
          ref: remoteRef
        });
        const config = await GitConfigManager.get({ fs: fs3, gitdir });
        await config.set(`branch.${ref}.remote`, remote);
        await config.set(`branch.${ref}.merge`, `refs/heads/${ref}`);
        await GitConfigManager.save({ fs: fs3, gitdir, config });
        await GitRefManager.writeRef({
          fs: fs3,
          gitdir,
          ref: `refs/heads/${ref}`,
          value: oid
        });
      }
      if (!noCheckout) {
        let ops;
        try {
          ops = await analyze({
            fs: fs3,
            cache,
            onProgress,
            dir,
            gitdir,
            ref,
            force,
            filepaths
          });
        } catch (err) {
          if (err instanceof NotFoundError && err.data.what === oid) {
            throw new CommitNotFetchedError(ref, oid);
          } else {
            throw err;
          }
        }
        const conflicts = ops.filter(([method]) => method === "conflict").map(([method, fullpath]) => fullpath);
        if (conflicts.length > 0) {
          throw new CheckoutConflictError(conflicts);
        }
        const errors = ops.filter(([method]) => method === "error").map(([method, fullpath]) => fullpath);
        if (errors.length > 0) {
          throw new InternalError(errors.join(", "));
        }
        if (dryRun) {
          return;
        }
        let count = 0;
        const total = ops.length;
        await GitIndexManager.acquire({ fs: fs3, gitdir, cache }, async function(index2) {
          await Promise.all(ops.filter(([method]) => method === "delete" || method === "delete-index").map(async function([method, fullpath]) {
            const filepath = `${dir}/${fullpath}`;
            if (method === "delete") {
              await fs3.rm(filepath);
            }
            index2.delete({ filepath: fullpath });
            if (onProgress) {
              await onProgress({
                phase: "Updating workdir",
                loaded: ++count,
                total
              });
            }
          }));
        });
        await GitIndexManager.acquire({ fs: fs3, gitdir, cache }, async function(index2) {
          for (const [method, fullpath] of ops) {
            if (method === "rmdir" || method === "rmdir-index") {
              const filepath = `${dir}/${fullpath}`;
              try {
                if (method === "rmdir-index") {
                  index2.delete({ filepath: fullpath });
                }
                await fs3.rmdir(filepath);
                if (onProgress) {
                  await onProgress({
                    phase: "Updating workdir",
                    loaded: ++count,
                    total
                  });
                }
              } catch (e) {
                if (e.code === "ENOTEMPTY") {
                  console.log(`Did not delete ${fullpath} because directory is not empty`);
                } else {
                  throw e;
                }
              }
            }
          }
        });
        await Promise.all(ops.filter(([method]) => method === "mkdir" || method === "mkdir-index").map(async function([_, fullpath]) {
          const filepath = `${dir}/${fullpath}`;
          await fs3.mkdir(filepath);
          if (onProgress) {
            await onProgress({
              phase: "Updating workdir",
              loaded: ++count,
              total
            });
          }
        }));
        await GitIndexManager.acquire({ fs: fs3, gitdir, cache }, async function(index2) {
          await Promise.all(ops.filter(([method]) => method === "create" || method === "create-index" || method === "update" || method === "mkdir-index").map(async function([method, fullpath, oid2, mode, chmod2]) {
            const filepath = `${dir}/${fullpath}`;
            try {
              if (method !== "create-index" && method !== "mkdir-index") {
                const { object } = await _readObject({ fs: fs3, cache, gitdir, oid: oid2 });
                if (chmod2) {
                  await fs3.rm(filepath);
                }
                if (mode === 33188) {
                  await fs3.write(filepath, object);
                } else if (mode === 33261) {
                  await fs3.write(filepath, object, { mode: 511 });
                } else if (mode === 40960) {
                  await fs3.writelink(filepath, object);
                } else {
                  throw new InternalError(`Invalid mode 0o${mode.toString(8)} detected in blob ${oid2}`);
                }
              }
              const stats = await fs3.lstat(filepath);
              if (mode === 33261) {
                stats.mode = 493;
              }
              if (method === "mkdir-index") {
                stats.mode = 57344;
              }
              index2.insert({
                filepath: fullpath,
                stats,
                oid: oid2
              });
              if (onProgress) {
                await onProgress({
                  phase: "Updating workdir",
                  loaded: ++count,
                  total
                });
              }
            } catch (e) {
              console.log(e);
            }
          }));
        });
      }
      if (!noUpdateHead) {
        const fullRef = await GitRefManager.expand({ fs: fs3, gitdir, ref });
        if (fullRef.startsWith("refs/heads")) {
          await GitRefManager.writeSymbolicRef({
            fs: fs3,
            gitdir,
            ref: "HEAD",
            value: fullRef
          });
        } else {
          await GitRefManager.writeRef({ fs: fs3, gitdir, ref: "HEAD", value: oid });
        }
      }
    }
    async function analyze({
      fs: fs3,
      cache,
      onProgress,
      dir,
      gitdir,
      ref,
      force,
      filepaths
    }) {
      let count = 0;
      return _walk({
        fs: fs3,
        cache,
        dir,
        gitdir,
        trees: [TREE({ ref }), WORKDIR(), STAGE()],
        map: async function(fullpath, [commit2, workdir, stage]) {
          if (fullpath === ".")
            return;
          if (filepaths && !filepaths.some((base2) => worthWalking(fullpath, base2))) {
            return null;
          }
          if (onProgress) {
            await onProgress({ phase: "Analyzing workdir", loaded: ++count });
          }
          const key = [!!stage, !!commit2, !!workdir].map(Number).join("");
          switch (key) {
            case "000":
              return;
            case "001":
              if (force && filepaths && filepaths.includes(fullpath)) {
                return ["delete", fullpath];
              }
              return;
            case "010": {
              switch (await commit2.type()) {
                case "tree": {
                  return ["mkdir", fullpath];
                }
                case "blob": {
                  return [
                    "create",
                    fullpath,
                    await commit2.oid(),
                    await commit2.mode()
                  ];
                }
                case "commit": {
                  return [
                    "mkdir-index",
                    fullpath,
                    await commit2.oid(),
                    await commit2.mode()
                  ];
                }
                default: {
                  return [
                    "error",
                    `new entry Unhandled type ${await commit2.type()}`
                  ];
                }
              }
            }
            case "011": {
              switch (`${await commit2.type()}-${await workdir.type()}`) {
                case "tree-tree": {
                  return;
                }
                case "tree-blob":
                case "blob-tree": {
                  return ["conflict", fullpath];
                }
                case "blob-blob": {
                  if (await commit2.oid() !== await workdir.oid()) {
                    if (force) {
                      return [
                        "update",
                        fullpath,
                        await commit2.oid(),
                        await commit2.mode(),
                        await commit2.mode() !== await workdir.mode()
                      ];
                    } else {
                      return ["conflict", fullpath];
                    }
                  } else {
                    if (await commit2.mode() !== await workdir.mode()) {
                      if (force) {
                        return [
                          "update",
                          fullpath,
                          await commit2.oid(),
                          await commit2.mode(),
                          true
                        ];
                      } else {
                        return ["conflict", fullpath];
                      }
                    } else {
                      return [
                        "create-index",
                        fullpath,
                        await commit2.oid(),
                        await commit2.mode()
                      ];
                    }
                  }
                }
                case "commit-tree": {
                  return;
                }
                case "commit-blob": {
                  return ["conflict", fullpath];
                }
                default: {
                  return ["error", `new entry Unhandled type ${commit2.type}`];
                }
              }
            }
            case "100": {
              return ["delete-index", fullpath];
            }
            case "101": {
              switch (await stage.type()) {
                case "tree": {
                  return ["rmdir", fullpath];
                }
                case "blob": {
                  if (await stage.oid() !== await workdir.oid()) {
                    if (force) {
                      return ["delete", fullpath];
                    } else {
                      return ["conflict", fullpath];
                    }
                  } else {
                    return ["delete", fullpath];
                  }
                }
                case "commit": {
                  return ["rmdir-index", fullpath];
                }
                default: {
                  return [
                    "error",
                    `delete entry Unhandled type ${await stage.type()}`
                  ];
                }
              }
            }
            case "110":
            case "111": {
              switch (`${await stage.type()}-${await commit2.type()}`) {
                case "tree-tree": {
                  return;
                }
                case "blob-blob": {
                  if (await stage.oid() === await commit2.oid() && await stage.mode() === await commit2.mode() && !force) {
                    return;
                  }
                  if (workdir) {
                    if (await workdir.oid() !== await stage.oid() && await workdir.oid() !== await commit2.oid()) {
                      if (force) {
                        return [
                          "update",
                          fullpath,
                          await commit2.oid(),
                          await commit2.mode(),
                          await commit2.mode() !== await workdir.mode()
                        ];
                      } else {
                        return ["conflict", fullpath];
                      }
                    }
                  } else if (force) {
                    return [
                      "update",
                      fullpath,
                      await commit2.oid(),
                      await commit2.mode(),
                      await commit2.mode() !== await stage.mode()
                    ];
                  }
                  if (await commit2.mode() !== await stage.mode()) {
                    return [
                      "update",
                      fullpath,
                      await commit2.oid(),
                      await commit2.mode(),
                      true
                    ];
                  }
                  if (await commit2.oid() !== await stage.oid()) {
                    return [
                      "update",
                      fullpath,
                      await commit2.oid(),
                      await commit2.mode(),
                      false
                    ];
                  } else {
                    return;
                  }
                }
                case "tree-blob": {
                  return ["update-dir-to-blob", fullpath, await commit2.oid()];
                }
                case "blob-tree": {
                  return ["update-blob-to-tree", fullpath];
                }
                case "commit-commit": {
                  return [
                    "mkdir-index",
                    fullpath,
                    await commit2.oid(),
                    await commit2.mode()
                  ];
                }
                default: {
                  return [
                    "error",
                    `update entry Unhandled type ${await stage.type()}-${await commit2.type()}`
                  ];
                }
              }
            }
          }
        },
        reduce: async function(parent, children) {
          children = flat(children);
          if (!parent) {
            return children;
          } else if (parent && parent[0] === "rmdir") {
            children.push(parent);
            return children;
          } else {
            children.unshift(parent);
            return children;
          }
        }
      });
    }
    async function checkout({
      fs: fs3,
      onProgress,
      dir,
      gitdir = join9(dir, ".git"),
      remote = "origin",
      ref: _ref,
      filepaths,
      noCheckout = false,
      noUpdateHead = _ref === void 0,
      dryRun = false,
      force = false,
      cache = {}
    }) {
      try {
        assertParameter("fs", fs3);
        assertParameter("dir", dir);
        assertParameter("gitdir", gitdir);
        const ref = _ref || "HEAD";
        return await _checkout({
          fs: new FileSystem(fs3),
          cache,
          onProgress,
          dir,
          gitdir,
          remote,
          ref,
          filepaths,
          noCheckout,
          noUpdateHead,
          dryRun,
          force
        });
      } catch (err) {
        err.caller = "git.checkout";
        throw err;
      }
    }
    var abbreviateRx = new RegExp("^refs/(heads/|tags/|remotes/)?(.*)");
    function abbreviateRef(ref) {
      const match = abbreviateRx.exec(ref);
      if (match) {
        if (match[1] === "remotes/" && ref.endsWith("/HEAD")) {
          return match[2].slice(0, -5);
        } else {
          return match[2];
        }
      }
      return ref;
    }
    async function _currentBranch({
      fs: fs3,
      gitdir,
      fullname = false,
      test = false
    }) {
      const ref = await GitRefManager.resolve({
        fs: fs3,
        gitdir,
        ref: "HEAD",
        depth: 2
      });
      if (test) {
        try {
          await GitRefManager.resolve({ fs: fs3, gitdir, ref });
        } catch (_) {
          return;
        }
      }
      if (!ref.startsWith("refs/"))
        return;
      return fullname ? ref : abbreviateRef(ref);
    }
    function translateSSHtoHTTP(url) {
      url = url.replace(/^git@([^:]+):/, "https://$1/");
      url = url.replace(/^ssh:\/\//, "https://");
      return url;
    }
    function calculateBasicAuthHeader({ username = "", password = "" }) {
      return `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
    }
    async function forAwait(iterable, cb) {
      const iter = getIterator(iterable);
      while (true) {
        const { value: value2, done } = await iter.next();
        if (value2)
          await cb(value2);
        if (done)
          break;
      }
      if (iter.return)
        iter.return();
    }
    async function collect(iterable) {
      let size = 0;
      const buffers = [];
      await forAwait(iterable, (value2) => {
        buffers.push(value2);
        size += value2.byteLength;
      });
      const result = new Uint8Array(size);
      let nextIndex = 0;
      for (const buffer of buffers) {
        result.set(buffer, nextIndex);
        nextIndex += buffer.byteLength;
      }
      return result;
    }
    function extractAuthFromUrl(url) {
      let userpass = url.match(/^https?:\/\/([^/]+)@/);
      if (userpass == null)
        return { url, auth: {} };
      userpass = userpass[1];
      const [username, password] = userpass.split(":");
      url = url.replace(`${userpass}@`, "");
      return { url, auth: { username, password } };
    }
    function padHex(b, n) {
      const s = n.toString(16);
      return "0".repeat(b - s.length) + s;
    }
    var GitPktLine = class {
      static flush() {
        return Buffer.from("0000", "utf8");
      }
      static delim() {
        return Buffer.from("0001", "utf8");
      }
      static encode(line) {
        if (typeof line === "string") {
          line = Buffer.from(line);
        }
        const length = line.length + 4;
        const hexlength = padHex(4, length);
        return Buffer.concat([Buffer.from(hexlength, "utf8"), line]);
      }
      static streamReader(stream) {
        const reader = new StreamReader(stream);
        return async function read2() {
          try {
            let length = await reader.read(4);
            if (length == null)
              return true;
            length = parseInt(length.toString("utf8"), 16);
            if (length === 0)
              return null;
            if (length === 1)
              return null;
            const buffer = await reader.read(length - 4);
            if (buffer == null)
              return true;
            return buffer;
          } catch (err) {
            console.log("error", err);
            return true;
          }
        };
      }
    };
    async function parseCapabilitiesV2(read2) {
      const capabilities2 = {};
      let line;
      while (true) {
        line = await read2();
        if (line === true)
          break;
        if (line === null)
          continue;
        line = line.toString("utf8").replace(/\n$/, "");
        const i2 = line.indexOf("=");
        if (i2 > -1) {
          const key = line.slice(0, i2);
          const value2 = line.slice(i2 + 1);
          capabilities2[key] = value2;
        } else {
          capabilities2[line] = true;
        }
      }
      return { protocolVersion: 2, capabilities2 };
    }
    async function parseRefsAdResponse(stream, { service }) {
      const capabilities = /* @__PURE__ */ new Set();
      const refs = /* @__PURE__ */ new Map();
      const symrefs = /* @__PURE__ */ new Map();
      const read2 = GitPktLine.streamReader(stream);
      let lineOne = await read2();
      while (lineOne === null)
        lineOne = await read2();
      if (lineOne === true)
        throw new EmptyServerResponseError();
      if (lineOne.includes("version 2")) {
        return parseCapabilitiesV2(read2);
      }
      if (lineOne.toString("utf8").replace(/\n$/, "") !== `# service=${service}`) {
        throw new ParseError(`# service=${service}\\n`, lineOne.toString("utf8"));
      }
      let lineTwo = await read2();
      while (lineTwo === null)
        lineTwo = await read2();
      if (lineTwo === true)
        return { capabilities, refs, symrefs };
      lineTwo = lineTwo.toString("utf8");
      if (lineTwo.includes("version 2")) {
        return parseCapabilitiesV2(read2);
      }
      const [firstRef, capabilitiesLine] = splitAndAssert(lineTwo, "\0", "\\x00");
      capabilitiesLine.split(" ").map((x) => capabilities.add(x));
      const [ref, name2] = splitAndAssert(firstRef, " ", " ");
      refs.set(name2, ref);
      while (true) {
        const line = await read2();
        if (line === true)
          break;
        if (line !== null) {
          const [ref2, name3] = splitAndAssert(line.toString("utf8"), " ", " ");
          refs.set(name3, ref2);
        }
      }
      for (const cap of capabilities) {
        if (cap.startsWith("symref=")) {
          const m = cap.match(/symref=([^:]+):(.*)/);
          if (m.length === 3) {
            symrefs.set(m[1], m[2]);
          }
        }
      }
      return { protocolVersion: 1, capabilities, refs, symrefs };
    }
    function splitAndAssert(line, sep, expected) {
      const split = line.trim().split(sep);
      if (split.length !== 2) {
        throw new ParseError(`Two strings separated by '${expected}'`, line.toString("utf8"));
      }
      return split;
    }
    var corsProxify = (corsProxy, url) => corsProxy.endsWith("?") ? `${corsProxy}${url}` : `${corsProxy}/${url.replace(/^https?:\/\//, "")}`;
    var updateHeaders = (headers, auth) => {
      if (auth.username || auth.password) {
        headers.Authorization = calculateBasicAuthHeader(auth);
      }
      if (auth.headers) {
        Object.assign(headers, auth.headers);
      }
    };
    var stringifyBody = async (res) => {
      try {
        const data = Buffer.from(await collect(res.body));
        const response = data.toString("utf8");
        const preview = response.length < 256 ? response : response.slice(0, 256) + "...";
        return { preview, response, data };
      } catch (e) {
        return {};
      }
    };
    var GitRemoteHTTP = class {
      static async capabilities() {
        return ["discover", "connect"];
      }
      static async discover({
        http: http2,
        onProgress,
        onAuth,
        onAuthSuccess,
        onAuthFailure,
        corsProxy,
        service,
        url: _origUrl,
        headers,
        protocolVersion
      }) {
        let { url, auth } = extractAuthFromUrl(_origUrl);
        const proxifiedURL = corsProxy ? corsProxify(corsProxy, url) : url;
        if (auth.username || auth.password) {
          headers.Authorization = calculateBasicAuthHeader(auth);
        }
        if (protocolVersion === 2) {
          headers["Git-Protocol"] = "version=2";
        }
        let res;
        let tryAgain;
        let providedAuthBefore = false;
        do {
          res = await http2.request({
            onProgress,
            method: "GET",
            url: `${proxifiedURL}/info/refs?service=${service}`,
            headers
          });
          tryAgain = false;
          if (res.statusCode === 401 || res.statusCode === 203) {
            const getAuth = providedAuthBefore ? onAuthFailure : onAuth;
            if (getAuth) {
              auth = await getAuth(url, __spreadProps(__spreadValues({}, auth), {
                headers: __spreadValues({}, headers)
              }));
              if (auth && auth.cancel) {
                throw new UserCanceledError();
              } else if (auth) {
                updateHeaders(headers, auth);
                providedAuthBefore = true;
                tryAgain = true;
              }
            }
          } else if (res.statusCode === 200 && providedAuthBefore && onAuthSuccess) {
            await onAuthSuccess(url, auth);
          }
        } while (tryAgain);
        if (res.statusCode !== 200) {
          const { response } = await stringifyBody(res);
          throw new HttpError(res.statusCode, res.statusMessage, response);
        }
        if (res.headers["content-type"] === `application/x-${service}-advertisement`) {
          const remoteHTTP = await parseRefsAdResponse(res.body, { service });
          remoteHTTP.auth = auth;
          return remoteHTTP;
        } else {
          const { preview, response, data } = await stringifyBody(res);
          try {
            const remoteHTTP = await parseRefsAdResponse([data], { service });
            remoteHTTP.auth = auth;
            return remoteHTTP;
          } catch (e) {
            throw new SmartHttpError(preview, response);
          }
        }
      }
      static async connect({
        http: http2,
        onProgress,
        corsProxy,
        service,
        url,
        auth,
        body,
        headers
      }) {
        const urlAuth = extractAuthFromUrl(url);
        if (urlAuth)
          url = urlAuth.url;
        if (corsProxy)
          url = corsProxify(corsProxy, url);
        headers["content-type"] = `application/x-${service}-request`;
        headers.accept = `application/x-${service}-result`;
        updateHeaders(headers, auth);
        const res = await http2.request({
          onProgress,
          method: "POST",
          url: `${url}/${service}`,
          body,
          headers
        });
        if (res.statusCode !== 200) {
          const { response } = stringifyBody(res);
          throw new HttpError(res.statusCode, res.statusMessage, response);
        }
        return res;
      }
    };
    function parseRemoteUrl({ url }) {
      if (url.startsWith("git@")) {
        return {
          transport: "ssh",
          address: url
        };
      }
      const matches = url.match(/(\w+)(:\/\/|::)(.*)/);
      if (matches === null)
        return;
      if (matches[2] === "://") {
        return {
          transport: matches[1],
          address: matches[0]
        };
      }
      if (matches[2] === "::") {
        return {
          transport: matches[1],
          address: matches[3]
        };
      }
    }
    var GitRemoteManager = class {
      static getRemoteHelperFor({ url }) {
        const remoteHelpers = /* @__PURE__ */ new Map();
        remoteHelpers.set("http", GitRemoteHTTP);
        remoteHelpers.set("https", GitRemoteHTTP);
        const parts = parseRemoteUrl({ url });
        if (!parts) {
          throw new UrlParseError(url);
        }
        if (remoteHelpers.has(parts.transport)) {
          return remoteHelpers.get(parts.transport);
        }
        throw new UnknownTransportError(url, parts.transport, parts.transport === "ssh" ? translateSSHtoHTTP(url) : void 0);
      }
    };
    var lock$1 = null;
    var GitShallowManager = class {
      static async read({ fs: fs3, gitdir }) {
        if (lock$1 === null)
          lock$1 = new AsyncLock();
        const filepath = join9(gitdir, "shallow");
        const oids = /* @__PURE__ */ new Set();
        await lock$1.acquire(filepath, async function() {
          const text = await fs3.read(filepath, { encoding: "utf8" });
          if (text === null)
            return oids;
          if (text.trim() === "")
            return oids;
          text.trim().split("\n").map((oid) => oids.add(oid));
        });
        return oids;
      }
      static async write({ fs: fs3, gitdir, oids }) {
        if (lock$1 === null)
          lock$1 = new AsyncLock();
        const filepath = join9(gitdir, "shallow");
        if (oids.size > 0) {
          const text = [...oids].join("\n") + "\n";
          await lock$1.acquire(filepath, async function() {
            await fs3.write(filepath, text, {
              encoding: "utf8"
            });
          });
        } else {
          await lock$1.acquire(filepath, async function() {
            await fs3.rm(filepath);
          });
        }
      }
    };
    async function hasObjectLoose({ fs: fs3, gitdir, oid }) {
      const source = `objects/${oid.slice(0, 2)}/${oid.slice(2)}`;
      return fs3.exists(`${gitdir}/${source}`);
    }
    async function hasObjectPacked({
      fs: fs3,
      cache,
      gitdir,
      oid,
      getExternalRefDelta
    }) {
      let list = await fs3.readdir(join9(gitdir, "objects/pack"));
      list = list.filter((x) => x.endsWith(".idx"));
      for (const filename of list) {
        const indexFile = `${gitdir}/objects/pack/${filename}`;
        const p = await readPackIndex({
          fs: fs3,
          cache,
          filename: indexFile,
          getExternalRefDelta
        });
        if (p.error)
          throw new InternalError(p.error);
        if (p.offsets.has(oid)) {
          return true;
        }
      }
      return false;
    }
    async function hasObject({
      fs: fs3,
      cache,
      gitdir,
      oid,
      format = "content"
    }) {
      const getExternalRefDelta = (oid2) => _readObject({ fs: fs3, cache, gitdir, oid: oid2 });
      let result = await hasObjectLoose({ fs: fs3, gitdir, oid });
      if (!result) {
        result = await hasObjectPacked({
          fs: fs3,
          cache,
          gitdir,
          oid,
          getExternalRefDelta
        });
      }
      return result;
    }
    function emptyPackfile(pack) {
      const pheader = "5041434b";
      const version2 = "00000002";
      const obCount = "00000000";
      const header = pheader + version2 + obCount;
      return pack.slice(0, 12).toString("hex") === header;
    }
    function filterCapabilities(server, client) {
      const serverNames = server.map((cap) => cap.split("=", 1)[0]);
      return client.filter((cap) => {
        const name2 = cap.split("=", 1)[0];
        return serverNames.includes(name2);
      });
    }
    var pkg = {
      name: "isomorphic-git",
      version: "1.10.3",
      agent: "git/isomorphic-git@1.10.3"
    };
    var FIFO = class {
      constructor() {
        this._queue = [];
      }
      write(chunk) {
        if (this._ended) {
          throw Error("You cannot write to a FIFO that has already been ended!");
        }
        if (this._waiting) {
          const resolve = this._waiting;
          this._waiting = null;
          resolve({ value: chunk });
        } else {
          this._queue.push(chunk);
        }
      }
      end() {
        this._ended = true;
        if (this._waiting) {
          const resolve = this._waiting;
          this._waiting = null;
          resolve({ done: true });
        }
      }
      destroy(err) {
        this._ended = true;
        this.error = err;
      }
      async next() {
        if (this._queue.length > 0) {
          return { value: this._queue.shift() };
        }
        if (this._ended) {
          return { done: true };
        }
        if (this._waiting) {
          throw Error("You cannot call read until the previous call to read has returned!");
        }
        return new Promise((resolve) => {
          this._waiting = resolve;
        });
      }
    };
    function findSplit(str) {
      const r = str.indexOf("\r");
      const n = str.indexOf("\n");
      if (r === -1 && n === -1)
        return -1;
      if (r === -1)
        return n + 1;
      if (n === -1)
        return r + 1;
      if (n === r + 1)
        return n + 1;
      return Math.min(r, n) + 1;
    }
    function splitLines(input) {
      const output = new FIFO();
      let tmp = "";
      (async () => {
        await forAwait(input, (chunk) => {
          chunk = chunk.toString("utf8");
          tmp += chunk;
          while (true) {
            const i2 = findSplit(tmp);
            if (i2 === -1)
              break;
            output.write(tmp.slice(0, i2));
            tmp = tmp.slice(i2);
          }
        });
        if (tmp.length > 0) {
          output.write(tmp);
        }
        output.end();
      })();
      return output;
    }
    var GitSideBand = class {
      static demux(input) {
        const read2 = GitPktLine.streamReader(input);
        const packetlines = new FIFO();
        const packfile = new FIFO();
        const progress = new FIFO();
        const nextBit = async function() {
          const line = await read2();
          if (line === null)
            return nextBit();
          if (line === true) {
            packetlines.end();
            progress.end();
            packfile.end();
            return;
          }
          switch (line[0]) {
            case 1: {
              packfile.write(line.slice(1));
              break;
            }
            case 2: {
              progress.write(line.slice(1));
              break;
            }
            case 3: {
              const error = line.slice(1);
              progress.write(error);
              packfile.destroy(new Error(error.toString("utf8")));
              return;
            }
            default: {
              packetlines.write(line.slice(0));
            }
          }
          nextBit();
        };
        nextBit();
        return {
          packetlines,
          packfile,
          progress
        };
      }
    };
    async function parseUploadPackResponse(stream) {
      const { packetlines, packfile, progress } = GitSideBand.demux(stream);
      const shallows = [];
      const unshallows = [];
      const acks = [];
      let nak = false;
      let done = false;
      return new Promise((resolve, reject) => {
        forAwait(packetlines, (data) => {
          const line = data.toString("utf8").trim();
          if (line.startsWith("shallow")) {
            const oid = line.slice(-41).trim();
            if (oid.length !== 40) {
              reject(new InvalidOidError(oid));
            }
            shallows.push(oid);
          } else if (line.startsWith("unshallow")) {
            const oid = line.slice(-41).trim();
            if (oid.length !== 40) {
              reject(new InvalidOidError(oid));
            }
            unshallows.push(oid);
          } else if (line.startsWith("ACK")) {
            const [, oid, status2] = line.split(" ");
            acks.push({ oid, status: status2 });
            if (!status2)
              done = true;
          } else if (line.startsWith("NAK")) {
            nak = true;
            done = true;
          }
          if (done) {
            resolve({ shallows, unshallows, acks, nak, packfile, progress });
          }
        });
      });
    }
    function writeUploadPackRequest({
      capabilities = [],
      wants = [],
      haves = [],
      shallows = [],
      depth = null,
      since = null,
      exclude = []
    }) {
      const packstream = [];
      wants = [...new Set(wants)];
      let firstLineCapabilities = ` ${capabilities.join(" ")}`;
      for (const oid of wants) {
        packstream.push(GitPktLine.encode(`want ${oid}${firstLineCapabilities}
`));
        firstLineCapabilities = "";
      }
      for (const oid of shallows) {
        packstream.push(GitPktLine.encode(`shallow ${oid}
`));
      }
      if (depth !== null) {
        packstream.push(GitPktLine.encode(`deepen ${depth}
`));
      }
      if (since !== null) {
        packstream.push(GitPktLine.encode(`deepen-since ${Math.floor(since.valueOf() / 1e3)}
`));
      }
      for (const oid of exclude) {
        packstream.push(GitPktLine.encode(`deepen-not ${oid}
`));
      }
      packstream.push(GitPktLine.flush());
      for (const oid of haves) {
        packstream.push(GitPktLine.encode(`have ${oid}
`));
      }
      packstream.push(GitPktLine.encode(`done
`));
      return packstream;
    }
    async function _fetch({
      fs: fs3,
      cache,
      http: http2,
      onProgress,
      onMessage,
      onAuth,
      onAuthSuccess,
      onAuthFailure,
      gitdir,
      ref: _ref,
      remoteRef: _remoteRef,
      remote: _remote,
      url: _url,
      corsProxy,
      depth = null,
      since = null,
      exclude = [],
      relative = false,
      tags = false,
      singleBranch = false,
      headers = {},
      prune = false,
      pruneTags = false
    }) {
      const ref = _ref || await _currentBranch({ fs: fs3, gitdir, test: true });
      const config = await GitConfigManager.get({ fs: fs3, gitdir });
      const remote = _remote || ref && await config.get(`branch.${ref}.remote`) || "origin";
      const url = _url || await config.get(`remote.${remote}.url`);
      if (typeof url === "undefined") {
        throw new MissingParameterError("remote OR url");
      }
      const remoteRef = _remoteRef || ref && await config.get(`branch.${ref}.merge`) || _ref || "HEAD";
      if (corsProxy === void 0) {
        corsProxy = await config.get("http.corsProxy");
      }
      const GitRemoteHTTP2 = GitRemoteManager.getRemoteHelperFor({ url });
      const remoteHTTP = await GitRemoteHTTP2.discover({
        http: http2,
        onAuth,
        onAuthSuccess,
        onAuthFailure,
        corsProxy,
        service: "git-upload-pack",
        url,
        headers,
        protocolVersion: 1
      });
      const auth = remoteHTTP.auth;
      const remoteRefs = remoteHTTP.refs;
      if (remoteRefs.size === 0) {
        return {
          defaultBranch: null,
          fetchHead: null,
          fetchHeadDescription: null
        };
      }
      if (depth !== null && !remoteHTTP.capabilities.has("shallow")) {
        throw new RemoteCapabilityError("shallow", "depth");
      }
      if (since !== null && !remoteHTTP.capabilities.has("deepen-since")) {
        throw new RemoteCapabilityError("deepen-since", "since");
      }
      if (exclude.length > 0 && !remoteHTTP.capabilities.has("deepen-not")) {
        throw new RemoteCapabilityError("deepen-not", "exclude");
      }
      if (relative === true && !remoteHTTP.capabilities.has("deepen-relative")) {
        throw new RemoteCapabilityError("deepen-relative", "relative");
      }
      const { oid, fullref } = GitRefManager.resolveAgainstMap({
        ref: remoteRef,
        map: remoteRefs
      });
      for (const remoteRef2 of remoteRefs.keys()) {
        if (remoteRef2 === fullref || remoteRef2 === "HEAD" || remoteRef2.startsWith("refs/heads/") || tags && remoteRef2.startsWith("refs/tags/")) {
          continue;
        }
        remoteRefs.delete(remoteRef2);
      }
      const capabilities = filterCapabilities([...remoteHTTP.capabilities], [
        "multi_ack_detailed",
        "no-done",
        "side-band-64k",
        "ofs-delta",
        `agent=${pkg.agent}`
      ]);
      if (relative)
        capabilities.push("deepen-relative");
      const wants = singleBranch ? [oid] : remoteRefs.values();
      const haveRefs = singleBranch ? [ref] : await GitRefManager.listRefs({
        fs: fs3,
        gitdir,
        filepath: `refs`
      });
      let haves = [];
      for (let ref2 of haveRefs) {
        try {
          ref2 = await GitRefManager.expand({ fs: fs3, gitdir, ref: ref2 });
          const oid2 = await GitRefManager.resolve({ fs: fs3, gitdir, ref: ref2 });
          if (await hasObject({ fs: fs3, cache, gitdir, oid: oid2 })) {
            haves.push(oid2);
          }
        } catch (err) {
        }
      }
      haves = [...new Set(haves)];
      const oids = await GitShallowManager.read({ fs: fs3, gitdir });
      const shallows = remoteHTTP.capabilities.has("shallow") ? [...oids] : [];
      const packstream = writeUploadPackRequest({
        capabilities,
        wants,
        haves,
        shallows,
        depth,
        since,
        exclude
      });
      const packbuffer = Buffer.from(await collect(packstream));
      const raw = await GitRemoteHTTP2.connect({
        http: http2,
        onProgress,
        corsProxy,
        service: "git-upload-pack",
        url,
        auth,
        body: [packbuffer],
        headers
      });
      const response = await parseUploadPackResponse(raw.body);
      if (raw.headers) {
        response.headers = raw.headers;
      }
      for (const oid2 of response.shallows) {
        if (!oids.has(oid2)) {
          try {
            const { object } = await _readObject({ fs: fs3, cache, gitdir, oid: oid2 });
            const commit2 = new GitCommit(object);
            const hasParents = await Promise.all(commit2.headers().parent.map((oid3) => hasObject({ fs: fs3, cache, gitdir, oid: oid3 })));
            const haveAllParents = hasParents.length === 0 || hasParents.every((has) => has);
            if (!haveAllParents) {
              oids.add(oid2);
            }
          } catch (err) {
            oids.add(oid2);
          }
        }
      }
      for (const oid2 of response.unshallows) {
        oids.delete(oid2);
      }
      await GitShallowManager.write({ fs: fs3, gitdir, oids });
      if (singleBranch) {
        const refs = /* @__PURE__ */ new Map([[fullref, oid]]);
        const symrefs = /* @__PURE__ */ new Map();
        let bail = 10;
        let key = fullref;
        while (bail--) {
          const value2 = remoteHTTP.symrefs.get(key);
          if (value2 === void 0)
            break;
          symrefs.set(key, value2);
          key = value2;
        }
        const realRef = remoteRefs.get(key);
        if (realRef) {
          refs.set(key, realRef);
        }
        const { pruned } = await GitRefManager.updateRemoteRefs({
          fs: fs3,
          gitdir,
          remote,
          refs,
          symrefs,
          tags,
          prune
        });
        if (prune) {
          response.pruned = pruned;
        }
      } else {
        const { pruned } = await GitRefManager.updateRemoteRefs({
          fs: fs3,
          gitdir,
          remote,
          refs: remoteRefs,
          symrefs: remoteHTTP.symrefs,
          tags,
          prune,
          pruneTags
        });
        if (prune) {
          response.pruned = pruned;
        }
      }
      response.HEAD = remoteHTTP.symrefs.get("HEAD");
      if (response.HEAD === void 0) {
        const { oid: oid2 } = GitRefManager.resolveAgainstMap({
          ref: "HEAD",
          map: remoteRefs
        });
        for (const [key, value2] of remoteRefs.entries()) {
          if (key !== "HEAD" && value2 === oid2) {
            response.HEAD = key;
            break;
          }
        }
      }
      const noun = fullref.startsWith("refs/tags") ? "tag" : "branch";
      response.FETCH_HEAD = {
        oid,
        description: `${noun} '${abbreviateRef(fullref)}' of ${url}`
      };
      if (onProgress || onMessage) {
        const lines = splitLines(response.progress);
        forAwait(lines, async (line) => {
          if (onMessage)
            await onMessage(line);
          if (onProgress) {
            const matches = line.match(/([^:]*).*\((\d+?)\/(\d+?)\)/);
            if (matches) {
              await onProgress({
                phase: matches[1].trim(),
                loaded: parseInt(matches[2], 10),
                total: parseInt(matches[3], 10)
              });
            }
          }
        });
      }
      const packfile = Buffer.from(await collect(response.packfile));
      const packfileSha = packfile.slice(-20).toString("hex");
      const res = {
        defaultBranch: response.HEAD,
        fetchHead: response.FETCH_HEAD.oid,
        fetchHeadDescription: response.FETCH_HEAD.description
      };
      if (response.headers) {
        res.headers = response.headers;
      }
      if (prune) {
        res.pruned = response.pruned;
      }
      if (packfileSha !== "" && !emptyPackfile(packfile)) {
        res.packfile = `objects/pack/pack-${packfileSha}.pack`;
        const fullpath = join9(gitdir, res.packfile);
        await fs3.write(fullpath, packfile);
        const getExternalRefDelta = (oid2) => _readObject({ fs: fs3, cache, gitdir, oid: oid2 });
        const idx = await GitPackIndex.fromPack({
          pack: packfile,
          getExternalRefDelta,
          onProgress
        });
        await fs3.write(fullpath.replace(/\.pack$/, ".idx"), await idx.toBuffer());
      }
      return res;
    }
    async function _init({
      fs: fs3,
      bare = false,
      dir,
      gitdir = bare ? dir : join9(dir, ".git"),
      defaultBranch = "master"
    }) {
      if (await fs3.exists(gitdir + "/config"))
        return;
      let folders = [
        "hooks",
        "info",
        "objects/info",
        "objects/pack",
        "refs/heads",
        "refs/tags"
      ];
      folders = folders.map((dir2) => gitdir + "/" + dir2);
      for (const folder of folders) {
        await fs3.mkdir(folder);
      }
      await fs3.write(gitdir + "/config", `[core]
	repositoryformatversion = 0
	filemode = false
	bare = ${bare}
` + (bare ? "" : "	logallrefupdates = true\n") + "	symlinks = false\n	ignorecase = true\n");
      await fs3.write(gitdir + "/HEAD", `ref: refs/heads/${defaultBranch}
`);
    }
    async function _clone({
      fs: fs3,
      cache,
      http: http2,
      onProgress,
      onMessage,
      onAuth,
      onAuthSuccess,
      onAuthFailure,
      dir,
      gitdir,
      url,
      corsProxy,
      ref,
      remote,
      depth,
      since,
      exclude,
      relative,
      singleBranch,
      noCheckout,
      noTags,
      headers
    }) {
      try {
        await _init({ fs: fs3, gitdir });
        await _addRemote({ fs: fs3, gitdir, remote, url, force: false });
        if (corsProxy) {
          const config = await GitConfigManager.get({ fs: fs3, gitdir });
          await config.set(`http.corsProxy`, corsProxy);
          await GitConfigManager.save({ fs: fs3, gitdir, config });
        }
        const { defaultBranch, fetchHead } = await _fetch({
          fs: fs3,
          cache,
          http: http2,
          onProgress,
          onMessage,
          onAuth,
          onAuthSuccess,
          onAuthFailure,
          gitdir,
          ref,
          remote,
          corsProxy,
          depth,
          since,
          exclude,
          relative,
          singleBranch,
          headers,
          tags: !noTags
        });
        if (fetchHead === null)
          return;
        ref = ref || defaultBranch;
        ref = ref.replace("refs/heads/", "");
        await _checkout({
          fs: fs3,
          cache,
          onProgress,
          dir,
          gitdir,
          ref,
          remote,
          noCheckout
        });
      } catch (err) {
        await fs3.rmdir(gitdir, { recursive: true, maxRetries: 10 }).catch(() => void 0);
        throw err;
      }
    }
    async function clone({
      fs: fs3,
      http: http2,
      onProgress,
      onMessage,
      onAuth,
      onAuthSuccess,
      onAuthFailure,
      dir,
      gitdir = join9(dir, ".git"),
      url,
      corsProxy = void 0,
      ref = void 0,
      remote = "origin",
      depth = void 0,
      since = void 0,
      exclude = [],
      relative = false,
      singleBranch = false,
      noCheckout = false,
      noTags = false,
      headers = {},
      cache = {}
    }) {
      try {
        assertParameter("fs", fs3);
        assertParameter("http", http2);
        assertParameter("gitdir", gitdir);
        if (!noCheckout) {
          assertParameter("dir", dir);
        }
        assertParameter("url", url);
        return await _clone({
          fs: new FileSystem(fs3),
          cache,
          http: http2,
          onProgress,
          onMessage,
          onAuth,
          onAuthSuccess,
          onAuthFailure,
          dir,
          gitdir,
          url,
          corsProxy,
          ref,
          remote,
          depth,
          since,
          exclude,
          relative,
          singleBranch,
          noCheckout,
          noTags,
          headers
        });
      } catch (err) {
        err.caller = "git.clone";
        throw err;
      }
    }
    async function commit({
      fs: _fs,
      onSign,
      dir,
      gitdir = join9(dir, ".git"),
      message,
      author: _author,
      committer: _committer,
      signingKey,
      dryRun = false,
      noUpdateBranch = false,
      ref,
      parent,
      tree,
      cache = {}
    }) {
      try {
        assertParameter("fs", _fs);
        assertParameter("message", message);
        if (signingKey) {
          assertParameter("onSign", onSign);
        }
        const fs3 = new FileSystem(_fs);
        const author = await normalizeAuthorObject({ fs: fs3, gitdir, author: _author });
        if (!author)
          throw new MissingNameError("author");
        const committer = await normalizeCommitterObject({
          fs: fs3,
          gitdir,
          author,
          committer: _committer
        });
        if (!committer)
          throw new MissingNameError("committer");
        return await _commit({
          fs: fs3,
          cache,
          onSign,
          gitdir,
          message,
          author,
          committer,
          signingKey,
          dryRun,
          noUpdateBranch,
          ref,
          parent,
          tree
        });
      } catch (err) {
        err.caller = "git.commit";
        throw err;
      }
    }
    async function currentBranch({
      fs: fs3,
      dir,
      gitdir = join9(dir, ".git"),
      fullname = false,
      test = false
    }) {
      try {
        assertParameter("fs", fs3);
        assertParameter("gitdir", gitdir);
        return await _currentBranch({
          fs: new FileSystem(fs3),
          gitdir,
          fullname,
          test
        });
      } catch (err) {
        err.caller = "git.currentBranch";
        throw err;
      }
    }
    async function _deleteBranch({ fs: fs3, gitdir, ref }) {
      const exist = await GitRefManager.exists({ fs: fs3, gitdir, ref });
      if (!exist) {
        throw new NotFoundError(ref);
      }
      const fullRef = await GitRefManager.expand({ fs: fs3, gitdir, ref });
      const currentRef = await _currentBranch({ fs: fs3, gitdir, fullname: true });
      if (fullRef === currentRef) {
        const value2 = await GitRefManager.resolve({ fs: fs3, gitdir, ref: fullRef });
        await GitRefManager.writeRef({ fs: fs3, gitdir, ref: "HEAD", value: value2 });
      }
      await GitRefManager.deleteRef({ fs: fs3, gitdir, ref: fullRef });
    }
    async function deleteBranch({
      fs: fs3,
      dir,
      gitdir = join9(dir, ".git"),
      ref
    }) {
      try {
        assertParameter("fs", fs3);
        assertParameter("ref", ref);
        return await _deleteBranch({
          fs: new FileSystem(fs3),
          gitdir,
          ref
        });
      } catch (err) {
        err.caller = "git.deleteBranch";
        throw err;
      }
    }
    async function deleteRef({ fs: fs3, dir, gitdir = join9(dir, ".git"), ref }) {
      try {
        assertParameter("fs", fs3);
        assertParameter("ref", ref);
        await GitRefManager.deleteRef({ fs: new FileSystem(fs3), gitdir, ref });
      } catch (err) {
        err.caller = "git.deleteRef";
        throw err;
      }
    }
    async function _deleteRemote({ fs: fs3, gitdir, remote }) {
      const config = await GitConfigManager.get({ fs: fs3, gitdir });
      await config.deleteSection("remote", remote);
      await GitConfigManager.save({ fs: fs3, gitdir, config });
    }
    async function deleteRemote({
      fs: fs3,
      dir,
      gitdir = join9(dir, ".git"),
      remote
    }) {
      try {
        assertParameter("fs", fs3);
        assertParameter("remote", remote);
        return await _deleteRemote({
          fs: new FileSystem(fs3),
          gitdir,
          remote
        });
      } catch (err) {
        err.caller = "git.deleteRemote";
        throw err;
      }
    }
    async function _deleteTag({ fs: fs3, gitdir, ref }) {
      ref = ref.startsWith("refs/tags/") ? ref : `refs/tags/${ref}`;
      await GitRefManager.deleteRef({ fs: fs3, gitdir, ref });
    }
    async function deleteTag({ fs: fs3, dir, gitdir = join9(dir, ".git"), ref }) {
      try {
        assertParameter("fs", fs3);
        assertParameter("ref", ref);
        return await _deleteTag({
          fs: new FileSystem(fs3),
          gitdir,
          ref
        });
      } catch (err) {
        err.caller = "git.deleteTag";
        throw err;
      }
    }
    async function expandOidLoose({ fs: fs3, gitdir, oid: short }) {
      const prefix = short.slice(0, 2);
      const objectsSuffixes = await fs3.readdir(`${gitdir}/objects/${prefix}`);
      return objectsSuffixes.map((suffix) => `${prefix}${suffix}`).filter((_oid) => _oid.startsWith(short));
    }
    async function expandOidPacked({
      fs: fs3,
      cache,
      gitdir,
      oid: short,
      getExternalRefDelta
    }) {
      const results = [];
      let list = await fs3.readdir(join9(gitdir, "objects/pack"));
      list = list.filter((x) => x.endsWith(".idx"));
      for (const filename of list) {
        const indexFile = `${gitdir}/objects/pack/${filename}`;
        const p = await readPackIndex({
          fs: fs3,
          cache,
          filename: indexFile,
          getExternalRefDelta
        });
        if (p.error)
          throw new InternalError(p.error);
        for (const oid of p.offsets.keys()) {
          if (oid.startsWith(short))
            results.push(oid);
        }
      }
      return results;
    }
    async function _expandOid({ fs: fs3, cache, gitdir, oid: short }) {
      const getExternalRefDelta = (oid) => _readObject({ fs: fs3, cache, gitdir, oid });
      const results1 = await expandOidLoose({ fs: fs3, gitdir, oid: short });
      const results2 = await expandOidPacked({
        fs: fs3,
        cache,
        gitdir,
        oid: short,
        getExternalRefDelta
      });
      const results = results1.concat(results2);
      if (results.length === 1) {
        return results[0];
      }
      if (results.length > 1) {
        throw new AmbiguousError("oids", short, results);
      }
      throw new NotFoundError(`an object matching "${short}"`);
    }
    async function expandOid({
      fs: fs3,
      dir,
      gitdir = join9(dir, ".git"),
      oid,
      cache = {}
    }) {
      try {
        assertParameter("fs", fs3);
        assertParameter("gitdir", gitdir);
        assertParameter("oid", oid);
        return await _expandOid({
          fs: new FileSystem(fs3),
          cache,
          gitdir,
          oid
        });
      } catch (err) {
        err.caller = "git.expandOid";
        throw err;
      }
    }
    async function expandRef({ fs: fs3, dir, gitdir = join9(dir, ".git"), ref }) {
      try {
        assertParameter("fs", fs3);
        assertParameter("gitdir", gitdir);
        assertParameter("ref", ref);
        return await GitRefManager.expand({
          fs: new FileSystem(fs3),
          gitdir,
          ref
        });
      } catch (err) {
        err.caller = "git.expandRef";
        throw err;
      }
    }
    async function _findMergeBase({ fs: fs3, cache, gitdir, oids }) {
      const visits = {};
      const passes = oids.length;
      let heads = oids.map((oid, index2) => ({ index: index2, oid }));
      while (heads.length) {
        const result = /* @__PURE__ */ new Set();
        for (const { oid, index: index2 } of heads) {
          if (!visits[oid])
            visits[oid] = /* @__PURE__ */ new Set();
          visits[oid].add(index2);
          if (visits[oid].size === passes) {
            result.add(oid);
          }
        }
        if (result.size > 0) {
          return [...result];
        }
        const newheads = /* @__PURE__ */ new Map();
        for (const { oid, index: index2 } of heads) {
          try {
            const { object } = await _readObject({ fs: fs3, cache, gitdir, oid });
            const commit2 = GitCommit.from(object);
            const { parent } = commit2.parseHeaders();
            for (const oid2 of parent) {
              if (!visits[oid2] || !visits[oid2].has(index2)) {
                newheads.set(oid2 + ":" + index2, { oid: oid2, index: index2 });
              }
            }
          } catch (err) {
          }
        }
        heads = Array.from(newheads.values());
      }
      return [];
    }
    var LINEBREAKS = /^.*(\r?\n|$)/gm;
    function mergeFile({
      ourContent,
      baseContent,
      theirContent,
      ourName = "ours",
      baseName = "base",
      theirName = "theirs",
      format = "diff",
      markerSize = 7
    }) {
      const ours = ourContent.match(LINEBREAKS);
      const base2 = baseContent.match(LINEBREAKS);
      const theirs = theirContent.match(LINEBREAKS);
      const result = diff3Merge(ours, base2, theirs);
      let mergedText = "";
      let cleanMerge = true;
      for (const item2 of result) {
        if (item2.ok) {
          mergedText += item2.ok.join("");
        }
        if (item2.conflict) {
          cleanMerge = false;
          mergedText += `${"<".repeat(markerSize)} ${ourName}
`;
          mergedText += item2.conflict.a.join("");
          if (format === "diff3") {
            mergedText += `${"|".repeat(markerSize)} ${baseName}
`;
            mergedText += item2.conflict.o.join("");
          }
          mergedText += `${"=".repeat(markerSize)}
`;
          mergedText += item2.conflict.b.join("");
          mergedText += `${">".repeat(markerSize)} ${theirName}
`;
        }
      }
      return { cleanMerge, mergedText };
    }
    async function mergeTree({
      fs: fs3,
      cache,
      dir,
      gitdir = join9(dir, ".git"),
      ourOid,
      baseOid,
      theirOid,
      ourName = "ours",
      baseName = "base",
      theirName = "theirs",
      dryRun = false
    }) {
      const ourTree = TREE({ ref: ourOid });
      const baseTree = TREE({ ref: baseOid });
      const theirTree = TREE({ ref: theirOid });
      const results = await _walk({
        fs: fs3,
        cache,
        dir,
        gitdir,
        trees: [ourTree, baseTree, theirTree],
        map: async function(filepath, [ours, base2, theirs]) {
          const path2 = basename(filepath);
          const ourChange = await modified(ours, base2);
          const theirChange = await modified(theirs, base2);
          switch (`${ourChange}-${theirChange}`) {
            case "false-false": {
              return {
                mode: await base2.mode(),
                path: path2,
                oid: await base2.oid(),
                type: await base2.type()
              };
            }
            case "false-true": {
              return theirs ? {
                mode: await theirs.mode(),
                path: path2,
                oid: await theirs.oid(),
                type: await theirs.type()
              } : void 0;
            }
            case "true-false": {
              return ours ? {
                mode: await ours.mode(),
                path: path2,
                oid: await ours.oid(),
                type: await ours.type()
              } : void 0;
            }
            case "true-true": {
              if (ours && base2 && theirs && await ours.type() === "blob" && await base2.type() === "blob" && await theirs.type() === "blob") {
                return mergeBlobs({
                  fs: fs3,
                  gitdir,
                  path: path2,
                  ours,
                  base: base2,
                  theirs,
                  ourName,
                  baseName,
                  theirName
                });
              }
              throw new MergeNotSupportedError();
            }
          }
        },
        reduce: async (parent, children) => {
          const entries = children.filter(Boolean);
          if (!parent)
            return;
          if (parent && parent.type === "tree" && entries.length === 0)
            return;
          if (entries.length > 0) {
            const tree = new GitTree(entries);
            const object = tree.toObject();
            const oid = await _writeObject({
              fs: fs3,
              gitdir,
              type: "tree",
              object,
              dryRun
            });
            parent.oid = oid;
          }
          return parent;
        }
      });
      return results.oid;
    }
    async function modified(entry, base2) {
      if (!entry && !base2)
        return false;
      if (entry && !base2)
        return true;
      if (!entry && base2)
        return true;
      if (await entry.type() === "tree" && await base2.type() === "tree") {
        return false;
      }
      if (await entry.type() === await base2.type() && await entry.mode() === await base2.mode() && await entry.oid() === await base2.oid()) {
        return false;
      }
      return true;
    }
    async function mergeBlobs({
      fs: fs3,
      gitdir,
      path: path2,
      ours,
      base: base2,
      theirs,
      ourName,
      theirName,
      baseName,
      format,
      markerSize,
      dryRun
    }) {
      const type = "blob";
      const mode = await base2.mode() === await ours.mode() ? await theirs.mode() : await ours.mode();
      if (await ours.oid() === await theirs.oid()) {
        return { mode, path: path2, oid: await ours.oid(), type };
      }
      if (await ours.oid() === await base2.oid()) {
        return { mode, path: path2, oid: await theirs.oid(), type };
      }
      if (await theirs.oid() === await base2.oid()) {
        return { mode, path: path2, oid: await ours.oid(), type };
      }
      const { mergedText, cleanMerge } = mergeFile({
        ourContent: Buffer.from(await ours.content()).toString("utf8"),
        baseContent: Buffer.from(await base2.content()).toString("utf8"),
        theirContent: Buffer.from(await theirs.content()).toString("utf8"),
        ourName,
        theirName,
        baseName,
        format,
        markerSize
      });
      if (!cleanMerge) {
        throw new MergeNotSupportedError();
      }
      const oid = await _writeObject({
        fs: fs3,
        gitdir,
        type: "blob",
        object: Buffer.from(mergedText, "utf8"),
        dryRun
      });
      return { mode, path: path2, oid, type };
    }
    async function _merge({
      fs: fs3,
      cache,
      gitdir,
      ours,
      theirs,
      fastForwardOnly = false,
      dryRun = false,
      noUpdateBranch = false,
      message,
      author,
      committer,
      signingKey,
      onSign
    }) {
      if (ours === void 0) {
        ours = await _currentBranch({ fs: fs3, gitdir, fullname: true });
      }
      ours = await GitRefManager.expand({
        fs: fs3,
        gitdir,
        ref: ours
      });
      theirs = await GitRefManager.expand({
        fs: fs3,
        gitdir,
        ref: theirs
      });
      const ourOid = await GitRefManager.resolve({
        fs: fs3,
        gitdir,
        ref: ours
      });
      const theirOid = await GitRefManager.resolve({
        fs: fs3,
        gitdir,
        ref: theirs
      });
      const baseOids = await _findMergeBase({
        fs: fs3,
        cache,
        gitdir,
        oids: [ourOid, theirOid]
      });
      if (baseOids.length !== 1) {
        throw new MergeNotSupportedError();
      }
      const baseOid = baseOids[0];
      if (baseOid === theirOid) {
        return {
          oid: ourOid,
          alreadyMerged: true
        };
      }
      if (baseOid === ourOid) {
        if (!dryRun && !noUpdateBranch) {
          await GitRefManager.writeRef({ fs: fs3, gitdir, ref: ours, value: theirOid });
        }
        return {
          oid: theirOid,
          fastForward: true
        };
      } else {
        if (fastForwardOnly) {
          throw new FastForwardError();
        }
        const tree = await mergeTree({
          fs: fs3,
          cache,
          gitdir,
          ourOid,
          theirOid,
          baseOid,
          ourName: ours,
          baseName: "base",
          theirName: theirs,
          dryRun
        });
        if (!message) {
          message = `Merge branch '${abbreviateRef(theirs)}' into ${abbreviateRef(ours)}`;
        }
        const oid = await _commit({
          fs: fs3,
          cache,
          gitdir,
          message,
          ref: ours,
          tree,
          parent: [ourOid, theirOid],
          author,
          committer,
          signingKey,
          onSign,
          dryRun,
          noUpdateBranch
        });
        return {
          oid,
          tree,
          mergeCommit: true
        };
      }
    }
    async function _pull({
      fs: fs3,
      cache,
      http: http2,
      onProgress,
      onMessage,
      onAuth,
      onAuthSuccess,
      onAuthFailure,
      dir,
      gitdir,
      ref,
      url,
      remote,
      remoteRef,
      fastForwardOnly,
      corsProxy,
      singleBranch,
      headers,
      author,
      committer,
      signingKey
    }) {
      try {
        if (!ref) {
          const head = await _currentBranch({ fs: fs3, gitdir });
          if (!head) {
            throw new MissingParameterError("ref");
          }
          ref = head;
        }
        const { fetchHead, fetchHeadDescription } = await _fetch({
          fs: fs3,
          cache,
          http: http2,
          onProgress,
          onMessage,
          onAuth,
          onAuthSuccess,
          onAuthFailure,
          gitdir,
          corsProxy,
          ref,
          url,
          remote,
          remoteRef,
          singleBranch,
          headers
        });
        await _merge({
          fs: fs3,
          cache,
          gitdir,
          ours: ref,
          theirs: fetchHead,
          fastForwardOnly,
          message: `Merge ${fetchHeadDescription}`,
          author,
          committer,
          signingKey,
          dryRun: false,
          noUpdateBranch: false
        });
        await _checkout({
          fs: fs3,
          cache,
          onProgress,
          dir,
          gitdir,
          ref,
          remote,
          noCheckout: false
        });
      } catch (err) {
        err.caller = "git.pull";
        throw err;
      }
    }
    async function fastForward({
      fs: fs3,
      http: http2,
      onProgress,
      onMessage,
      onAuth,
      onAuthSuccess,
      onAuthFailure,
      dir,
      gitdir = join9(dir, ".git"),
      ref,
      url,
      remote,
      remoteRef,
      corsProxy,
      singleBranch,
      headers = {},
      cache = {}
    }) {
      try {
        assertParameter("fs", fs3);
        assertParameter("http", http2);
        assertParameter("gitdir", gitdir);
        const thisWillNotBeUsed = {
          name: "",
          email: "",
          timestamp: Date.now(),
          timezoneOffset: 0
        };
        return await _pull({
          fs: new FileSystem(fs3),
          cache,
          http: http2,
          onProgress,
          onMessage,
          onAuth,
          onAuthSuccess,
          onAuthFailure,
          dir,
          gitdir,
          ref,
          url,
          remote,
          remoteRef,
          fastForwardOnly: true,
          corsProxy,
          singleBranch,
          headers,
          author: thisWillNotBeUsed,
          committer: thisWillNotBeUsed
        });
      } catch (err) {
        err.caller = "git.fastForward";
        throw err;
      }
    }
    async function fetch({
      fs: fs3,
      http: http2,
      onProgress,
      onMessage,
      onAuth,
      onAuthSuccess,
      onAuthFailure,
      dir,
      gitdir = join9(dir, ".git"),
      ref,
      remote,
      remoteRef,
      url,
      corsProxy,
      depth = null,
      since = null,
      exclude = [],
      relative = false,
      tags = false,
      singleBranch = false,
      headers = {},
      prune = false,
      pruneTags = false,
      cache = {}
    }) {
      try {
        assertParameter("fs", fs3);
        assertParameter("http", http2);
        assertParameter("gitdir", gitdir);
        return await _fetch({
          fs: new FileSystem(fs3),
          cache,
          http: http2,
          onProgress,
          onMessage,
          onAuth,
          onAuthSuccess,
          onAuthFailure,
          gitdir,
          ref,
          remote,
          remoteRef,
          url,
          corsProxy,
          depth,
          since,
          exclude,
          relative,
          tags,
          singleBranch,
          headers,
          prune,
          pruneTags
        });
      } catch (err) {
        err.caller = "git.fetch";
        throw err;
      }
    }
    async function findMergeBase({
      fs: fs3,
      dir,
      gitdir = join9(dir, ".git"),
      oids,
      cache = {}
    }) {
      try {
        assertParameter("fs", fs3);
        assertParameter("gitdir", gitdir);
        assertParameter("oids", oids);
        return await _findMergeBase({
          fs: new FileSystem(fs3),
          cache,
          gitdir,
          oids
        });
      } catch (err) {
        err.caller = "git.findMergeBase";
        throw err;
      }
    }
    async function _findRoot({ fs: fs3, filepath }) {
      if (await fs3.exists(join9(filepath, ".git"))) {
        return filepath;
      } else {
        const parent = dirname(filepath);
        if (parent === filepath) {
          throw new NotFoundError(`git root for ${filepath}`);
        }
        return _findRoot({ fs: fs3, filepath: parent });
      }
    }
    async function findRoot({ fs: fs3, filepath }) {
      try {
        assertParameter("fs", fs3);
        assertParameter("filepath", filepath);
        return await _findRoot({ fs: new FileSystem(fs3), filepath });
      } catch (err) {
        err.caller = "git.findRoot";
        throw err;
      }
    }
    async function getConfig({ fs: fs3, dir, gitdir = join9(dir, ".git"), path: path2 }) {
      try {
        assertParameter("fs", fs3);
        assertParameter("gitdir", gitdir);
        assertParameter("path", path2);
        return await _getConfig({
          fs: new FileSystem(fs3),
          gitdir,
          path: path2
        });
      } catch (err) {
        err.caller = "git.getConfig";
        throw err;
      }
    }
    async function _getConfigAll({ fs: fs3, gitdir, path: path2 }) {
      const config = await GitConfigManager.get({ fs: fs3, gitdir });
      return config.getall(path2);
    }
    async function getConfigAll({
      fs: fs3,
      dir,
      gitdir = join9(dir, ".git"),
      path: path2
    }) {
      try {
        assertParameter("fs", fs3);
        assertParameter("gitdir", gitdir);
        assertParameter("path", path2);
        return await _getConfigAll({
          fs: new FileSystem(fs3),
          gitdir,
          path: path2
        });
      } catch (err) {
        err.caller = "git.getConfigAll";
        throw err;
      }
    }
    async function getRemoteInfo({
      http: http2,
      onAuth,
      onAuthSuccess,
      onAuthFailure,
      corsProxy,
      url,
      headers = {},
      forPush = false
    }) {
      try {
        assertParameter("http", http2);
        assertParameter("url", url);
        const GitRemoteHTTP2 = GitRemoteManager.getRemoteHelperFor({ url });
        const remote = await GitRemoteHTTP2.discover({
          http: http2,
          onAuth,
          onAuthSuccess,
          onAuthFailure,
          corsProxy,
          service: forPush ? "git-receive-pack" : "git-upload-pack",
          url,
          headers,
          protocolVersion: 1
        });
        const result = {
          capabilities: [...remote.capabilities]
        };
        for (const [ref, oid] of remote.refs) {
          const parts = ref.split("/");
          const last = parts.pop();
          let o = result;
          for (const part of parts) {
            o[part] = o[part] || {};
            o = o[part];
          }
          o[last] = oid;
        }
        for (const [symref, ref] of remote.symrefs) {
          const parts = symref.split("/");
          const last = parts.pop();
          let o = result;
          for (const part of parts) {
            o[part] = o[part] || {};
            o = o[part];
          }
          o[last] = ref;
        }
        return result;
      } catch (err) {
        err.caller = "git.getRemoteInfo";
        throw err;
      }
    }
    function formatInfoRefs(remote, prefix, symrefs, peelTags) {
      const refs = [];
      for (const [key, value2] of remote.refs) {
        if (prefix && !key.startsWith(prefix))
          continue;
        if (key.endsWith("^{}")) {
          if (peelTags) {
            const _key = key.replace("^{}", "");
            const last = refs[refs.length - 1];
            const r = last.ref === _key ? last : refs.find((x) => x.ref === _key);
            if (r === void 0) {
              throw new Error("I did not expect this to happen");
            }
            r.peeled = value2;
          }
          continue;
        }
        const ref = { ref: key, oid: value2 };
        if (symrefs) {
          if (remote.symrefs.has(key)) {
            ref.target = remote.symrefs.get(key);
          }
        }
        refs.push(ref);
      }
      return refs;
    }
    async function getRemoteInfo2({
      http: http2,
      onAuth,
      onAuthSuccess,
      onAuthFailure,
      corsProxy,
      url,
      headers = {},
      forPush = false,
      protocolVersion = 2
    }) {
      try {
        assertParameter("http", http2);
        assertParameter("url", url);
        const GitRemoteHTTP2 = GitRemoteManager.getRemoteHelperFor({ url });
        const remote = await GitRemoteHTTP2.discover({
          http: http2,
          onAuth,
          onAuthSuccess,
          onAuthFailure,
          corsProxy,
          service: forPush ? "git-receive-pack" : "git-upload-pack",
          url,
          headers,
          protocolVersion
        });
        if (remote.protocolVersion === 2) {
          return {
            protocolVersion: remote.protocolVersion,
            capabilities: remote.capabilities2
          };
        }
        const capabilities = {};
        for (const cap of remote.capabilities) {
          const [key, value2] = cap.split("=");
          if (value2) {
            capabilities[key] = value2;
          } else {
            capabilities[key] = true;
          }
        }
        return {
          protocolVersion: 1,
          capabilities,
          refs: formatInfoRefs(remote, void 0, true, true)
        };
      } catch (err) {
        err.caller = "git.getRemoteInfo2";
        throw err;
      }
    }
    async function hashObject({
      type,
      object,
      format = "content",
      oid = void 0
    }) {
      if (format !== "deflated") {
        if (format !== "wrapped") {
          object = GitObject.wrap({ type, object });
        }
        oid = await shasum(object);
      }
      return { oid, object };
    }
    async function hashBlob({ object }) {
      try {
        assertParameter("object", object);
        if (typeof object === "string") {
          object = Buffer.from(object, "utf8");
        } else {
          object = Buffer.from(object);
        }
        const type = "blob";
        const { oid, object: _object } = await hashObject({
          type: "blob",
          format: "content",
          object
        });
        return { oid, type, object: new Uint8Array(_object), format: "wrapped" };
      } catch (err) {
        err.caller = "git.hashBlob";
        throw err;
      }
    }
    async function _indexPack({
      fs: fs3,
      cache,
      onProgress,
      dir,
      gitdir,
      filepath
    }) {
      try {
        filepath = join9(dir, filepath);
        const pack = await fs3.read(filepath);
        const getExternalRefDelta = (oid) => _readObject({ fs: fs3, cache, gitdir, oid });
        const idx = await GitPackIndex.fromPack({
          pack,
          getExternalRefDelta,
          onProgress
        });
        await fs3.write(filepath.replace(/\.pack$/, ".idx"), await idx.toBuffer());
        return {
          oids: [...idx.hashes]
        };
      } catch (err) {
        err.caller = "git.indexPack";
        throw err;
      }
    }
    async function indexPack({
      fs: fs3,
      onProgress,
      dir,
      gitdir = join9(dir, ".git"),
      filepath,
      cache = {}
    }) {
      try {
        assertParameter("fs", fs3);
        assertParameter("dir", dir);
        assertParameter("gitdir", dir);
        assertParameter("filepath", filepath);
        return await _indexPack({
          fs: new FileSystem(fs3),
          cache,
          onProgress,
          dir,
          gitdir,
          filepath
        });
      } catch (err) {
        err.caller = "git.indexPack";
        throw err;
      }
    }
    async function init({
      fs: fs3,
      bare = false,
      dir,
      gitdir = bare ? dir : join9(dir, ".git"),
      defaultBranch = "master"
    }) {
      try {
        assertParameter("fs", fs3);
        assertParameter("gitdir", gitdir);
        if (!bare) {
          assertParameter("dir", dir);
        }
        return await _init({
          fs: new FileSystem(fs3),
          bare,
          dir,
          gitdir,
          defaultBranch
        });
      } catch (err) {
        err.caller = "git.init";
        throw err;
      }
    }
    async function _isDescendent({
      fs: fs3,
      cache,
      gitdir,
      oid,
      ancestor,
      depth
    }) {
      const shallows = await GitShallowManager.read({ fs: fs3, gitdir });
      if (!oid) {
        throw new MissingParameterError("oid");
      }
      if (!ancestor) {
        throw new MissingParameterError("ancestor");
      }
      if (oid === ancestor)
        return false;
      const queue = [oid];
      const visited = /* @__PURE__ */ new Set();
      let searchdepth = 0;
      while (queue.length) {
        if (searchdepth++ === depth) {
          throw new MaxDepthError(depth);
        }
        const oid2 = queue.shift();
        const { type, object } = await _readObject({
          fs: fs3,
          cache,
          gitdir,
          oid: oid2
        });
        if (type !== "commit") {
          throw new ObjectTypeError(oid2, type, "commit");
        }
        const commit2 = GitCommit.from(object).parse();
        for (const parent of commit2.parent) {
          if (parent === ancestor)
            return true;
        }
        if (!shallows.has(oid2)) {
          for (const parent of commit2.parent) {
            if (!visited.has(parent)) {
              queue.push(parent);
              visited.add(parent);
            }
          }
        }
      }
      return false;
    }
    async function isDescendent({
      fs: fs3,
      dir,
      gitdir = join9(dir, ".git"),
      oid,
      ancestor,
      depth = -1,
      cache = {}
    }) {
      try {
        assertParameter("fs", fs3);
        assertParameter("gitdir", gitdir);
        assertParameter("oid", oid);
        assertParameter("ancestor", ancestor);
        return await _isDescendent({
          fs: new FileSystem(fs3),
          cache,
          gitdir,
          oid,
          ancestor,
          depth
        });
      } catch (err) {
        err.caller = "git.isDescendent";
        throw err;
      }
    }
    async function isIgnored({
      fs: fs3,
      dir,
      gitdir = join9(dir, ".git"),
      filepath
    }) {
      try {
        assertParameter("fs", fs3);
        assertParameter("dir", dir);
        assertParameter("gitdir", gitdir);
        assertParameter("filepath", filepath);
        return GitIgnoreManager.isIgnored({
          fs: new FileSystem(fs3),
          dir,
          gitdir,
          filepath
        });
      } catch (err) {
        err.caller = "git.isIgnored";
        throw err;
      }
    }
    async function listBranches({
      fs: fs3,
      dir,
      gitdir = join9(dir, ".git"),
      remote
    }) {
      try {
        assertParameter("fs", fs3);
        assertParameter("gitdir", gitdir);
        return GitRefManager.listBranches({
          fs: new FileSystem(fs3),
          gitdir,
          remote
        });
      } catch (err) {
        err.caller = "git.listBranches";
        throw err;
      }
    }
    async function _listFiles({ fs: fs3, gitdir, ref, cache }) {
      if (ref) {
        const oid = await GitRefManager.resolve({ gitdir, fs: fs3, ref });
        const filenames = [];
        await accumulateFilesFromOid({
          fs: fs3,
          cache,
          gitdir,
          oid,
          filenames,
          prefix: ""
        });
        return filenames;
      } else {
        return GitIndexManager.acquire({ fs: fs3, gitdir, cache }, async function(index2) {
          return index2.entries.map((x) => x.path);
        });
      }
    }
    async function accumulateFilesFromOid({
      fs: fs3,
      cache,
      gitdir,
      oid,
      filenames,
      prefix
    }) {
      const { tree } = await _readTree({ fs: fs3, cache, gitdir, oid });
      for (const entry of tree) {
        if (entry.type === "tree") {
          await accumulateFilesFromOid({
            fs: fs3,
            cache,
            gitdir,
            oid: entry.oid,
            filenames,
            prefix: join9(prefix, entry.path)
          });
        } else {
          filenames.push(join9(prefix, entry.path));
        }
      }
    }
    async function listFiles({
      fs: fs3,
      dir,
      gitdir = join9(dir, ".git"),
      ref,
      cache = {}
    }) {
      try {
        assertParameter("fs", fs3);
        assertParameter("gitdir", gitdir);
        return await _listFiles({
          fs: new FileSystem(fs3),
          cache,
          gitdir,
          ref
        });
      } catch (err) {
        err.caller = "git.listFiles";
        throw err;
      }
    }
    async function _listNotes({ fs: fs3, cache, gitdir, ref }) {
      let parent;
      try {
        parent = await GitRefManager.resolve({ gitdir, fs: fs3, ref });
      } catch (err) {
        if (err instanceof NotFoundError) {
          return [];
        }
      }
      const result = await _readTree({
        fs: fs3,
        cache,
        gitdir,
        oid: parent
      });
      const notes = result.tree.map((entry) => ({
        target: entry.path,
        note: entry.oid
      }));
      return notes;
    }
    async function listNotes({
      fs: fs3,
      dir,
      gitdir = join9(dir, ".git"),
      ref = "refs/notes/commits",
      cache = {}
    }) {
      try {
        assertParameter("fs", fs3);
        assertParameter("gitdir", gitdir);
        assertParameter("ref", ref);
        return await _listNotes({
          fs: new FileSystem(fs3),
          cache,
          gitdir,
          ref
        });
      } catch (err) {
        err.caller = "git.listNotes";
        throw err;
      }
    }
    async function _listRemotes({ fs: fs3, gitdir }) {
      const config = await GitConfigManager.get({ fs: fs3, gitdir });
      const remoteNames = await config.getSubsections("remote");
      const remotes = Promise.all(remoteNames.map(async (remote) => {
        const url = await config.get(`remote.${remote}.url`);
        return { remote, url };
      }));
      return remotes;
    }
    async function listRemotes({ fs: fs3, dir, gitdir = join9(dir, ".git") }) {
      try {
        assertParameter("fs", fs3);
        assertParameter("gitdir", gitdir);
        return await _listRemotes({
          fs: new FileSystem(fs3),
          gitdir
        });
      } catch (err) {
        err.caller = "git.listRemotes";
        throw err;
      }
    }
    async function parseListRefsResponse(stream) {
      const read2 = GitPktLine.streamReader(stream);
      const refs = [];
      let line;
      while (true) {
        line = await read2();
        if (line === true)
          break;
        if (line === null)
          continue;
        line = line.toString("utf8").replace(/\n$/, "");
        const [oid, ref, ...attrs] = line.split(" ");
        const r = { ref, oid };
        for (const attr of attrs) {
          const [name2, value2] = attr.split(":");
          if (name2 === "symref-target") {
            r.target = value2;
          } else if (name2 === "peeled") {
            r.peeled = value2;
          }
        }
        refs.push(r);
      }
      return refs;
    }
    async function writeListRefsRequest({ prefix, symrefs, peelTags }) {
      const packstream = [];
      packstream.push(GitPktLine.encode("command=ls-refs\n"));
      packstream.push(GitPktLine.encode(`agent=${pkg.agent}
`));
      if (peelTags || symrefs || prefix) {
        packstream.push(GitPktLine.delim());
      }
      if (peelTags)
        packstream.push(GitPktLine.encode("peel"));
      if (symrefs)
        packstream.push(GitPktLine.encode("symrefs"));
      if (prefix)
        packstream.push(GitPktLine.encode(`ref-prefix ${prefix}`));
      packstream.push(GitPktLine.flush());
      return packstream;
    }
    async function listServerRefs({
      http: http2,
      onAuth,
      onAuthSuccess,
      onAuthFailure,
      corsProxy,
      url,
      headers = {},
      forPush = false,
      protocolVersion = 2,
      prefix,
      symrefs,
      peelTags
    }) {
      try {
        assertParameter("http", http2);
        assertParameter("url", url);
        const remote = await GitRemoteHTTP.discover({
          http: http2,
          onAuth,
          onAuthSuccess,
          onAuthFailure,
          corsProxy,
          service: forPush ? "git-receive-pack" : "git-upload-pack",
          url,
          headers,
          protocolVersion
        });
        if (remote.protocolVersion === 1) {
          return formatInfoRefs(remote, prefix, symrefs, peelTags);
        }
        const body = await writeListRefsRequest({ prefix, symrefs, peelTags });
        const res = await GitRemoteHTTP.connect({
          http: http2,
          auth: remote.auth,
          headers,
          corsProxy,
          service: forPush ? "git-receive-pack" : "git-upload-pack",
          url,
          body
        });
        return parseListRefsResponse(res.body);
      } catch (err) {
        err.caller = "git.listServerRefs";
        throw err;
      }
    }
    async function listTags({ fs: fs3, dir, gitdir = join9(dir, ".git") }) {
      try {
        assertParameter("fs", fs3);
        assertParameter("gitdir", gitdir);
        return GitRefManager.listTags({ fs: new FileSystem(fs3), gitdir });
      } catch (err) {
        err.caller = "git.listTags";
        throw err;
      }
    }
    async function resolveCommit({ fs: fs3, cache, gitdir, oid }) {
      const { type, object } = await _readObject({ fs: fs3, cache, gitdir, oid });
      if (type === "tag") {
        oid = GitAnnotatedTag.from(object).parse().object;
        return resolveCommit({ fs: fs3, cache, gitdir, oid });
      }
      if (type !== "commit") {
        throw new ObjectTypeError(oid, type, "commit");
      }
      return { commit: GitCommit.from(object), oid };
    }
    async function _readCommit({ fs: fs3, cache, gitdir, oid }) {
      const { commit: commit2, oid: commitOid } = await resolveCommit({
        fs: fs3,
        cache,
        gitdir,
        oid
      });
      const result = {
        oid: commitOid,
        commit: commit2.parse(),
        payload: commit2.withoutSignature()
      };
      return result;
    }
    function compareAge(a, b) {
      return a.committer.timestamp - b.committer.timestamp;
    }
    var EMPTY_OID = "e69de29bb2d1d6434b8b29ae775ad8c2e48c5391";
    async function resolveFileIdInTree({ fs: fs3, cache, gitdir, oid, fileId }) {
      if (fileId === EMPTY_OID)
        return;
      const _oid = oid;
      let filepath;
      const result = await resolveTree({ fs: fs3, cache, gitdir, oid });
      const tree = result.tree;
      if (fileId === result.oid) {
        filepath = result.path;
      } else {
        filepath = await _resolveFileId({
          fs: fs3,
          cache,
          gitdir,
          tree,
          fileId,
          oid: _oid
        });
        if (Array.isArray(filepath)) {
          if (filepath.length === 0)
            filepath = void 0;
          else if (filepath.length === 1)
            filepath = filepath[0];
        }
      }
      return filepath;
    }
    async function _resolveFileId({
      fs: fs3,
      cache,
      gitdir,
      tree,
      fileId,
      oid,
      filepaths = [],
      parentPath = ""
    }) {
      const walks = tree.entries().map(function(entry) {
        let result;
        if (entry.oid === fileId) {
          result = join9(parentPath, entry.path);
          filepaths.push(result);
        } else if (entry.type === "tree") {
          result = _readObject({
            fs: fs3,
            cache,
            gitdir,
            oid: entry.oid
          }).then(function({ object }) {
            return _resolveFileId({
              fs: fs3,
              cache,
              gitdir,
              tree: GitTree.from(object),
              fileId,
              oid,
              filepaths,
              parentPath: join9(parentPath, entry.path)
            });
          });
        }
        return result;
      });
      await Promise.all(walks);
      return filepaths;
    }
    async function _log({
      fs: fs3,
      cache,
      gitdir,
      filepath,
      ref,
      depth,
      since,
      force,
      follow
    }) {
      const sinceTimestamp = typeof since === "undefined" ? void 0 : Math.floor(since.valueOf() / 1e3);
      const commits = [];
      const shallowCommits = await GitShallowManager.read({ fs: fs3, gitdir });
      const oid = await GitRefManager.resolve({ fs: fs3, gitdir, ref });
      const tips = [await _readCommit({ fs: fs3, cache, gitdir, oid })];
      let lastFileOid;
      let lastCommit;
      let isOk;
      function endCommit(commit2) {
        if (isOk && filepath)
          commits.push(commit2);
      }
      while (tips.length > 0) {
        const commit2 = tips.pop();
        if (sinceTimestamp !== void 0 && commit2.commit.committer.timestamp <= sinceTimestamp) {
          break;
        }
        if (filepath) {
          let vFileOid;
          try {
            vFileOid = await resolveFilepath({
              fs: fs3,
              cache,
              gitdir,
              oid: commit2.commit.tree,
              filepath
            });
            if (lastCommit && lastFileOid !== vFileOid) {
              commits.push(lastCommit);
            }
            lastFileOid = vFileOid;
            lastCommit = commit2;
            isOk = true;
          } catch (e) {
            if (e instanceof NotFoundError) {
              let found = follow && lastFileOid;
              if (found) {
                found = await resolveFileIdInTree({
                  fs: fs3,
                  cache,
                  gitdir,
                  oid: commit2.commit.tree,
                  fileId: lastFileOid
                });
                if (found) {
                  if (Array.isArray(found)) {
                    if (lastCommit) {
                      const lastFound = await resolveFileIdInTree({
                        fs: fs3,
                        cache,
                        gitdir,
                        oid: lastCommit.commit.tree,
                        fileId: lastFileOid
                      });
                      if (Array.isArray(lastFound)) {
                        found = found.filter((p) => lastFound.indexOf(p) === -1);
                        if (found.length === 1) {
                          found = found[0];
                          filepath = found;
                          if (lastCommit)
                            commits.push(lastCommit);
                        } else {
                          found = false;
                          if (lastCommit)
                            commits.push(lastCommit);
                          break;
                        }
                      }
                    }
                  } else {
                    filepath = found;
                    if (lastCommit)
                      commits.push(lastCommit);
                  }
                }
              }
              if (!found) {
                if (!force && !follow)
                  throw e;
                if (isOk && lastFileOid) {
                  commits.push(lastCommit);
                }
              }
              lastCommit = commit2;
              isOk = false;
            } else
              throw e;
          }
        } else {
          commits.push(commit2);
        }
        if (depth !== void 0 && commits.length === depth) {
          endCommit(commit2);
          break;
        }
        if (!shallowCommits.has(commit2.oid)) {
          for (const oid2 of commit2.commit.parent) {
            const commit3 = await _readCommit({ fs: fs3, cache, gitdir, oid: oid2 });
            if (!tips.map((commit4) => commit4.oid).includes(commit3.oid)) {
              tips.push(commit3);
            }
          }
        }
        if (tips.length === 0) {
          endCommit(commit2);
        }
        tips.sort((a, b) => compareAge(a.commit, b.commit));
      }
      return commits;
    }
    async function log3({
      fs: fs3,
      dir,
      gitdir = join9(dir, ".git"),
      filepath,
      ref = "HEAD",
      depth,
      since,
      force,
      follow,
      cache = {}
    }) {
      try {
        assertParameter("fs", fs3);
        assertParameter("gitdir", gitdir);
        assertParameter("ref", ref);
        return await _log({
          fs: new FileSystem(fs3),
          cache,
          gitdir,
          filepath,
          ref,
          depth,
          since,
          force,
          follow
        });
      } catch (err) {
        err.caller = "git.log";
        throw err;
      }
    }
    async function merge({
      fs: _fs,
      onSign,
      dir,
      gitdir = join9(dir, ".git"),
      ours,
      theirs,
      fastForwardOnly = false,
      dryRun = false,
      noUpdateBranch = false,
      message,
      author: _author,
      committer: _committer,
      signingKey,
      cache = {}
    }) {
      try {
        assertParameter("fs", _fs);
        if (signingKey) {
          assertParameter("onSign", onSign);
        }
        const fs3 = new FileSystem(_fs);
        const author = await normalizeAuthorObject({ fs: fs3, gitdir, author: _author });
        if (!author && !fastForwardOnly)
          throw new MissingNameError("author");
        const committer = await normalizeCommitterObject({
          fs: fs3,
          gitdir,
          author,
          committer: _committer
        });
        if (!committer && !fastForwardOnly) {
          throw new MissingNameError("committer");
        }
        return await _merge({
          fs: fs3,
          cache,
          gitdir,
          ours,
          theirs,
          fastForwardOnly,
          dryRun,
          noUpdateBranch,
          message,
          author,
          committer,
          signingKey,
          onSign
        });
      } catch (err) {
        err.caller = "git.merge";
        throw err;
      }
    }
    var types = {
      commit: 16,
      tree: 32,
      blob: 48,
      tag: 64,
      ofs_delta: 96,
      ref_delta: 112
    };
    async function _pack({
      fs: fs3,
      cache,
      dir,
      gitdir = join9(dir, ".git"),
      oids
    }) {
      const hash = new Hash();
      const outputStream = [];
      function write2(chunk, enc) {
        const buff = Buffer.from(chunk, enc);
        outputStream.push(buff);
        hash.update(buff);
      }
      async function writeObject2({ stype, object }) {
        const type = types[stype];
        let length = object.length;
        let multibyte = length > 15 ? 128 : 0;
        const lastFour = length & 15;
        length = length >>> 4;
        let byte = (multibyte | type | lastFour).toString(16);
        write2(byte, "hex");
        while (multibyte) {
          multibyte = length > 127 ? 128 : 0;
          byte = multibyte | length & 127;
          write2(padHex(2, byte), "hex");
          length = length >>> 7;
        }
        write2(Buffer.from(await deflate(object)));
      }
      write2("PACK");
      write2("00000002", "hex");
      write2(padHex(8, oids.length), "hex");
      for (const oid of oids) {
        const { type, object } = await _readObject({ fs: fs3, cache, gitdir, oid });
        await writeObject2({ write: write2, object, stype: type });
      }
      const digest = hash.digest();
      outputStream.push(digest);
      return outputStream;
    }
    async function _packObjects({ fs: fs3, cache, gitdir, oids, write: write2 }) {
      const buffers = await _pack({ fs: fs3, cache, gitdir, oids });
      const packfile = Buffer.from(await collect(buffers));
      const packfileSha = packfile.slice(-20).toString("hex");
      const filename = `pack-${packfileSha}.pack`;
      if (write2) {
        await fs3.write(join9(gitdir, `objects/pack/${filename}`), packfile);
        return { filename };
      }
      return {
        filename,
        packfile: new Uint8Array(packfile)
      };
    }
    async function packObjects({
      fs: fs3,
      dir,
      gitdir = join9(dir, ".git"),
      oids,
      write: write2 = false,
      cache = {}
    }) {
      try {
        assertParameter("fs", fs3);
        assertParameter("gitdir", gitdir);
        assertParameter("oids", oids);
        return await _packObjects({
          fs: new FileSystem(fs3),
          cache,
          gitdir,
          oids,
          write: write2
        });
      } catch (err) {
        err.caller = "git.packObjects";
        throw err;
      }
    }
    async function pull({
      fs: _fs,
      http: http2,
      onProgress,
      onMessage,
      onAuth,
      onAuthSuccess,
      onAuthFailure,
      dir,
      gitdir = join9(dir, ".git"),
      ref,
      url,
      remote,
      remoteRef,
      fastForwardOnly = false,
      corsProxy,
      singleBranch,
      headers = {},
      author: _author,
      committer: _committer,
      signingKey,
      cache = {}
    }) {
      try {
        assertParameter("fs", _fs);
        assertParameter("gitdir", gitdir);
        const fs3 = new FileSystem(_fs);
        const author = await normalizeAuthorObject({ fs: fs3, gitdir, author: _author });
        if (!author)
          throw new MissingNameError("author");
        const committer = await normalizeCommitterObject({
          fs: fs3,
          gitdir,
          author,
          committer: _committer
        });
        if (!committer)
          throw new MissingNameError("committer");
        return await _pull({
          fs: fs3,
          cache,
          http: http2,
          onProgress,
          onMessage,
          onAuth,
          onAuthSuccess,
          onAuthFailure,
          dir,
          gitdir,
          ref,
          url,
          remote,
          remoteRef,
          fastForwardOnly,
          corsProxy,
          singleBranch,
          headers,
          author,
          committer,
          signingKey
        });
      } catch (err) {
        err.caller = "git.pull";
        throw err;
      }
    }
    async function listCommitsAndTags({
      fs: fs3,
      cache,
      dir,
      gitdir = join9(dir, ".git"),
      start,
      finish
    }) {
      const shallows = await GitShallowManager.read({ fs: fs3, gitdir });
      const startingSet = /* @__PURE__ */ new Set();
      const finishingSet = /* @__PURE__ */ new Set();
      for (const ref of start) {
        startingSet.add(await GitRefManager.resolve({ fs: fs3, gitdir, ref }));
      }
      for (const ref of finish) {
        try {
          const oid = await GitRefManager.resolve({ fs: fs3, gitdir, ref });
          finishingSet.add(oid);
        } catch (err) {
        }
      }
      const visited = /* @__PURE__ */ new Set();
      async function walk2(oid) {
        visited.add(oid);
        const { type, object } = await _readObject({ fs: fs3, cache, gitdir, oid });
        if (type === "tag") {
          const tag2 = GitAnnotatedTag.from(object);
          const commit2 = tag2.headers().object;
          return walk2(commit2);
        }
        if (type !== "commit") {
          throw new ObjectTypeError(oid, type, "commit");
        }
        if (!shallows.has(oid)) {
          const commit2 = GitCommit.from(object);
          const parents = commit2.headers().parent;
          for (oid of parents) {
            if (!finishingSet.has(oid) && !visited.has(oid)) {
              await walk2(oid);
            }
          }
        }
      }
      for (const oid of startingSet) {
        await walk2(oid);
      }
      return visited;
    }
    async function listObjects({
      fs: fs3,
      cache,
      dir,
      gitdir = join9(dir, ".git"),
      oids
    }) {
      const visited = /* @__PURE__ */ new Set();
      async function walk2(oid) {
        if (visited.has(oid))
          return;
        visited.add(oid);
        const { type, object } = await _readObject({ fs: fs3, cache, gitdir, oid });
        if (type === "tag") {
          const tag2 = GitAnnotatedTag.from(object);
          const obj = tag2.headers().object;
          await walk2(obj);
        } else if (type === "commit") {
          const commit2 = GitCommit.from(object);
          const tree = commit2.headers().tree;
          await walk2(tree);
        } else if (type === "tree") {
          const tree = GitTree.from(object);
          for (const entry of tree) {
            if (entry.type === "blob") {
              visited.add(entry.oid);
            }
            if (entry.type === "tree") {
              await walk2(entry.oid);
            }
          }
        }
      }
      for (const oid of oids) {
        await walk2(oid);
      }
      return visited;
    }
    async function parseReceivePackResponse(packfile) {
      const result = {};
      let response = "";
      const read2 = GitPktLine.streamReader(packfile);
      let line = await read2();
      while (line !== true) {
        if (line !== null)
          response += line.toString("utf8") + "\n";
        line = await read2();
      }
      const lines = response.toString("utf8").split("\n");
      line = lines.shift();
      if (!line.startsWith("unpack ")) {
        throw new ParseError('unpack ok" or "unpack [error message]', line);
      }
      result.ok = line === "unpack ok";
      if (!result.ok) {
        result.error = line.slice("unpack ".length);
      }
      result.refs = {};
      for (const line2 of lines) {
        if (line2.trim() === "")
          continue;
        const status2 = line2.slice(0, 2);
        const refAndMessage = line2.slice(3);
        let space = refAndMessage.indexOf(" ");
        if (space === -1)
          space = refAndMessage.length;
        const ref = refAndMessage.slice(0, space);
        const error = refAndMessage.slice(space + 1);
        result.refs[ref] = {
          ok: status2 === "ok",
          error
        };
      }
      return result;
    }
    async function writeReceivePackRequest({
      capabilities = [],
      triplets = []
    }) {
      const packstream = [];
      let capsFirstLine = `\0 ${capabilities.join(" ")}`;
      for (const trip of triplets) {
        packstream.push(GitPktLine.encode(`${trip.oldoid} ${trip.oid} ${trip.fullRef}${capsFirstLine}
`));
        capsFirstLine = "";
      }
      packstream.push(GitPktLine.flush());
      return packstream;
    }
    async function _push({
      fs: fs3,
      cache,
      http: http2,
      onProgress,
      onMessage,
      onAuth,
      onAuthSuccess,
      onAuthFailure,
      gitdir,
      ref: _ref,
      remoteRef: _remoteRef,
      remote,
      url: _url,
      force = false,
      delete: _delete = false,
      corsProxy,
      headers = {}
    }) {
      const ref = _ref || await _currentBranch({ fs: fs3, gitdir });
      if (typeof ref === "undefined") {
        throw new MissingParameterError("ref");
      }
      const config = await GitConfigManager.get({ fs: fs3, gitdir });
      remote = remote || await config.get(`branch.${ref}.pushRemote`) || await config.get("remote.pushDefault") || await config.get(`branch.${ref}.remote`) || "origin";
      const url = _url || await config.get(`remote.${remote}.pushurl`) || await config.get(`remote.${remote}.url`);
      if (typeof url === "undefined") {
        throw new MissingParameterError("remote OR url");
      }
      const remoteRef = _remoteRef || await config.get(`branch.${ref}.merge`);
      if (typeof url === "undefined") {
        throw new MissingParameterError("remoteRef");
      }
      if (corsProxy === void 0) {
        corsProxy = await config.get("http.corsProxy");
      }
      const fullRef = await GitRefManager.expand({ fs: fs3, gitdir, ref });
      const oid = _delete ? "0000000000000000000000000000000000000000" : await GitRefManager.resolve({ fs: fs3, gitdir, ref: fullRef });
      const GitRemoteHTTP2 = GitRemoteManager.getRemoteHelperFor({ url });
      const httpRemote = await GitRemoteHTTP2.discover({
        http: http2,
        onAuth,
        onAuthSuccess,
        onAuthFailure,
        corsProxy,
        service: "git-receive-pack",
        url,
        headers,
        protocolVersion: 1
      });
      const auth = httpRemote.auth;
      let fullRemoteRef;
      if (!remoteRef) {
        fullRemoteRef = fullRef;
      } else {
        try {
          fullRemoteRef = await GitRefManager.expandAgainstMap({
            ref: remoteRef,
            map: httpRemote.refs
          });
        } catch (err) {
          if (err instanceof NotFoundError) {
            fullRemoteRef = remoteRef.startsWith("refs/") ? remoteRef : `refs/heads/${remoteRef}`;
          } else {
            throw err;
          }
        }
      }
      const oldoid = httpRemote.refs.get(fullRemoteRef) || "0000000000000000000000000000000000000000";
      const thinPack = !httpRemote.capabilities.has("no-thin");
      let objects = /* @__PURE__ */ new Set();
      if (!_delete) {
        const finish = [...httpRemote.refs.values()];
        let skipObjects = /* @__PURE__ */ new Set();
        if (oldoid !== "0000000000000000000000000000000000000000") {
          const mergebase = await _findMergeBase({
            fs: fs3,
            cache,
            gitdir,
            oids: [oid, oldoid]
          });
          for (const oid2 of mergebase)
            finish.push(oid2);
          if (thinPack) {
            skipObjects = await listObjects({ fs: fs3, cache, gitdir, oids: mergebase });
          }
        }
        if (!finish.includes(oid)) {
          const commits = await listCommitsAndTags({
            fs: fs3,
            cache,
            gitdir,
            start: [oid],
            finish
          });
          objects = await listObjects({ fs: fs3, cache, gitdir, oids: commits });
        }
        if (thinPack) {
          try {
            const ref2 = await GitRefManager.resolve({
              fs: fs3,
              gitdir,
              ref: `refs/remotes/${remote}/HEAD`,
              depth: 2
            });
            const { oid: oid2 } = await GitRefManager.resolveAgainstMap({
              ref: ref2.replace(`refs/remotes/${remote}/`, ""),
              fullref: ref2,
              map: httpRemote.refs
            });
            const oids = [oid2];
            for (const oid3 of await listObjects({ fs: fs3, cache, gitdir, oids })) {
              skipObjects.add(oid3);
            }
          } catch (e) {
          }
          for (const oid2 of skipObjects) {
            objects.delete(oid2);
          }
        }
        if (!force) {
          if (fullRef.startsWith("refs/tags") && oldoid !== "0000000000000000000000000000000000000000") {
            throw new PushRejectedError("tag-exists");
          }
          if (oid !== "0000000000000000000000000000000000000000" && oldoid !== "0000000000000000000000000000000000000000" && !await _isDescendent({
            fs: fs3,
            cache,
            gitdir,
            oid,
            ancestor: oldoid,
            depth: -1
          })) {
            throw new PushRejectedError("not-fast-forward");
          }
        }
      }
      const capabilities = filterCapabilities([...httpRemote.capabilities], ["report-status", "side-band-64k", `agent=${pkg.agent}`]);
      const packstream1 = await writeReceivePackRequest({
        capabilities,
        triplets: [{ oldoid, oid, fullRef: fullRemoteRef }]
      });
      const packstream2 = _delete ? [] : await _pack({
        fs: fs3,
        cache,
        gitdir,
        oids: [...objects]
      });
      const res = await GitRemoteHTTP2.connect({
        http: http2,
        onProgress,
        corsProxy,
        service: "git-receive-pack",
        url,
        auth,
        headers,
        body: [...packstream1, ...packstream2]
      });
      const { packfile, progress } = await GitSideBand.demux(res.body);
      if (onMessage) {
        const lines = splitLines(progress);
        forAwait(lines, async (line) => {
          await onMessage(line);
        });
      }
      const result = await parseReceivePackResponse(packfile);
      if (res.headers) {
        result.headers = res.headers;
      }
      if (remote && result.ok && result.refs[fullRemoteRef].ok) {
        const ref2 = `refs/remotes/${remote}/${fullRemoteRef.replace("refs/heads", "")}`;
        if (_delete) {
          await GitRefManager.deleteRef({ fs: fs3, gitdir, ref: ref2 });
        } else {
          await GitRefManager.writeRef({ fs: fs3, gitdir, ref: ref2, value: oid });
        }
      }
      if (result.ok && Object.values(result.refs).every((result2) => result2.ok)) {
        return result;
      } else {
        const prettyDetails = Object.entries(result.refs).filter(([k, v]) => !v.ok).map(([k, v]) => `
  - ${k}: ${v.error}`).join("");
        throw new GitPushError(prettyDetails, result);
      }
    }
    async function push({
      fs: fs3,
      http: http2,
      onProgress,
      onMessage,
      onAuth,
      onAuthSuccess,
      onAuthFailure,
      dir,
      gitdir = join9(dir, ".git"),
      ref,
      remoteRef,
      remote = "origin",
      url,
      force = false,
      delete: _delete = false,
      corsProxy,
      headers = {},
      cache = {}
    }) {
      try {
        assertParameter("fs", fs3);
        assertParameter("http", http2);
        assertParameter("gitdir", gitdir);
        return await _push({
          fs: new FileSystem(fs3),
          cache,
          http: http2,
          onProgress,
          onMessage,
          onAuth,
          onAuthSuccess,
          onAuthFailure,
          gitdir,
          ref,
          remoteRef,
          remote,
          url,
          force,
          delete: _delete,
          corsProxy,
          headers
        });
      } catch (err) {
        err.caller = "git.push";
        throw err;
      }
    }
    async function resolveBlob({ fs: fs3, cache, gitdir, oid }) {
      const { type, object } = await _readObject({ fs: fs3, cache, gitdir, oid });
      if (type === "tag") {
        oid = GitAnnotatedTag.from(object).parse().object;
        return resolveBlob({ fs: fs3, cache, gitdir, oid });
      }
      if (type !== "blob") {
        throw new ObjectTypeError(oid, type, "blob");
      }
      return { oid, blob: new Uint8Array(object) };
    }
    async function _readBlob({
      fs: fs3,
      cache,
      gitdir,
      oid,
      filepath = void 0
    }) {
      if (filepath !== void 0) {
        oid = await resolveFilepath({ fs: fs3, cache, gitdir, oid, filepath });
      }
      const blob = await resolveBlob({
        fs: fs3,
        cache,
        gitdir,
        oid
      });
      return blob;
    }
    async function readBlob({
      fs: fs3,
      dir,
      gitdir = join9(dir, ".git"),
      oid,
      filepath,
      cache = {}
    }) {
      try {
        assertParameter("fs", fs3);
        assertParameter("gitdir", gitdir);
        assertParameter("oid", oid);
        return await _readBlob({
          fs: new FileSystem(fs3),
          cache,
          gitdir,
          oid,
          filepath
        });
      } catch (err) {
        err.caller = "git.readBlob";
        throw err;
      }
    }
    async function readCommit({
      fs: fs3,
      dir,
      gitdir = join9(dir, ".git"),
      oid,
      cache = {}
    }) {
      try {
        assertParameter("fs", fs3);
        assertParameter("gitdir", gitdir);
        assertParameter("oid", oid);
        return await _readCommit({
          fs: new FileSystem(fs3),
          cache,
          gitdir,
          oid
        });
      } catch (err) {
        err.caller = "git.readCommit";
        throw err;
      }
    }
    async function _readNote({
      fs: fs3,
      cache,
      gitdir,
      ref = "refs/notes/commits",
      oid
    }) {
      const parent = await GitRefManager.resolve({ gitdir, fs: fs3, ref });
      const { blob } = await _readBlob({
        fs: fs3,
        cache,
        gitdir,
        oid: parent,
        filepath: oid
      });
      return blob;
    }
    async function readNote({
      fs: fs3,
      dir,
      gitdir = join9(dir, ".git"),
      ref = "refs/notes/commits",
      oid,
      cache = {}
    }) {
      try {
        assertParameter("fs", fs3);
        assertParameter("gitdir", gitdir);
        assertParameter("ref", ref);
        assertParameter("oid", oid);
        return await _readNote({
          fs: new FileSystem(fs3),
          cache,
          gitdir,
          ref,
          oid
        });
      } catch (err) {
        err.caller = "git.readNote";
        throw err;
      }
    }
    async function readObject({
      fs: _fs,
      dir,
      gitdir = join9(dir, ".git"),
      oid,
      format = "parsed",
      filepath = void 0,
      encoding = void 0,
      cache = {}
    }) {
      try {
        assertParameter("fs", _fs);
        assertParameter("gitdir", gitdir);
        assertParameter("oid", oid);
        const fs3 = new FileSystem(_fs);
        if (filepath !== void 0) {
          oid = await resolveFilepath({
            fs: fs3,
            cache,
            gitdir,
            oid,
            filepath
          });
        }
        const _format = format === "parsed" ? "content" : format;
        const result = await _readObject({
          fs: fs3,
          cache,
          gitdir,
          oid,
          format: _format
        });
        result.oid = oid;
        if (format === "parsed") {
          result.format = "parsed";
          switch (result.type) {
            case "commit":
              result.object = GitCommit.from(result.object).parse();
              break;
            case "tree":
              result.object = GitTree.from(result.object).entries();
              break;
            case "blob":
              if (encoding) {
                result.object = result.object.toString(encoding);
              } else {
                result.object = new Uint8Array(result.object);
                result.format = "content";
              }
              break;
            case "tag":
              result.object = GitAnnotatedTag.from(result.object).parse();
              break;
            default:
              throw new ObjectTypeError(result.oid, result.type, "blob|commit|tag|tree");
          }
        } else if (result.format === "deflated" || result.format === "wrapped") {
          result.type = result.format;
        }
        return result;
      } catch (err) {
        err.caller = "git.readObject";
        throw err;
      }
    }
    async function _readTag({ fs: fs3, cache, gitdir, oid }) {
      const { type, object } = await _readObject({
        fs: fs3,
        cache,
        gitdir,
        oid,
        format: "content"
      });
      if (type !== "tag") {
        throw new ObjectTypeError(oid, type, "tag");
      }
      const tag2 = GitAnnotatedTag.from(object);
      const result = {
        oid,
        tag: tag2.parse(),
        payload: tag2.payload()
      };
      return result;
    }
    async function readTag({
      fs: fs3,
      dir,
      gitdir = join9(dir, ".git"),
      oid,
      cache = {}
    }) {
      try {
        assertParameter("fs", fs3);
        assertParameter("gitdir", gitdir);
        assertParameter("oid", oid);
        return await _readTag({
          fs: new FileSystem(fs3),
          cache,
          gitdir,
          oid
        });
      } catch (err) {
        err.caller = "git.readTag";
        throw err;
      }
    }
    async function readTree({
      fs: fs3,
      dir,
      gitdir = join9(dir, ".git"),
      oid,
      filepath = void 0,
      cache = {}
    }) {
      try {
        assertParameter("fs", fs3);
        assertParameter("gitdir", gitdir);
        assertParameter("oid", oid);
        return await _readTree({
          fs: new FileSystem(fs3),
          cache,
          gitdir,
          oid,
          filepath
        });
      } catch (err) {
        err.caller = "git.readTree";
        throw err;
      }
    }
    async function remove2({
      fs: _fs,
      dir,
      gitdir = join9(dir, ".git"),
      filepath,
      cache = {}
    }) {
      try {
        assertParameter("fs", _fs);
        assertParameter("gitdir", gitdir);
        assertParameter("filepath", filepath);
        await GitIndexManager.acquire({ fs: new FileSystem(_fs), gitdir, cache }, async function(index2) {
          index2.delete({ filepath });
        });
      } catch (err) {
        err.caller = "git.remove";
        throw err;
      }
    }
    async function _removeNote({
      fs: fs3,
      cache,
      onSign,
      gitdir,
      ref = "refs/notes/commits",
      oid,
      author,
      committer,
      signingKey
    }) {
      let parent;
      try {
        parent = await GitRefManager.resolve({ gitdir, fs: fs3, ref });
      } catch (err) {
        if (!(err instanceof NotFoundError)) {
          throw err;
        }
      }
      const result = await _readTree({
        fs: fs3,
        gitdir,
        oid: parent || "4b825dc642cb6eb9a060e54bf8d69288fbee4904"
      });
      let tree = result.tree;
      tree = tree.filter((entry) => entry.path !== oid);
      const treeOid = await _writeTree({
        fs: fs3,
        gitdir,
        tree
      });
      const commitOid = await _commit({
        fs: fs3,
        cache,
        onSign,
        gitdir,
        ref,
        tree: treeOid,
        parent: parent && [parent],
        message: `Note removed by 'isomorphic-git removeNote'
`,
        author,
        committer,
        signingKey
      });
      return commitOid;
    }
    async function removeNote({
      fs: _fs,
      onSign,
      dir,
      gitdir = join9(dir, ".git"),
      ref = "refs/notes/commits",
      oid,
      author: _author,
      committer: _committer,
      signingKey,
      cache = {}
    }) {
      try {
        assertParameter("fs", _fs);
        assertParameter("gitdir", gitdir);
        assertParameter("oid", oid);
        const fs3 = new FileSystem(_fs);
        const author = await normalizeAuthorObject({ fs: fs3, gitdir, author: _author });
        if (!author)
          throw new MissingNameError("author");
        const committer = await normalizeCommitterObject({
          fs: fs3,
          gitdir,
          author,
          committer: _committer
        });
        if (!committer)
          throw new MissingNameError("committer");
        return await _removeNote({
          fs: fs3,
          cache,
          onSign,
          gitdir,
          ref,
          oid,
          author,
          committer,
          signingKey
        });
      } catch (err) {
        err.caller = "git.removeNote";
        throw err;
      }
    }
    async function _renameBranch({
      fs: fs3,
      gitdir,
      oldref,
      ref,
      checkout: checkout2 = false
    }) {
      if (ref !== cleanGitRef.clean(ref)) {
        throw new InvalidRefNameError(ref, cleanGitRef.clean(ref));
      }
      if (oldref !== cleanGitRef.clean(oldref)) {
        throw new InvalidRefNameError(oldref, cleanGitRef.clean(oldref));
      }
      const fulloldref = `refs/heads/${oldref}`;
      const fullnewref = `refs/heads/${ref}`;
      const newexist = await GitRefManager.exists({ fs: fs3, gitdir, ref: fullnewref });
      if (newexist) {
        throw new AlreadyExistsError("branch", ref, false);
      }
      const value2 = await GitRefManager.resolve({
        fs: fs3,
        gitdir,
        ref: fulloldref,
        depth: 1
      });
      await GitRefManager.writeRef({ fs: fs3, gitdir, ref: fullnewref, value: value2 });
      await GitRefManager.deleteRef({ fs: fs3, gitdir, ref: fulloldref });
      if (checkout2) {
        await GitRefManager.writeSymbolicRef({
          fs: fs3,
          gitdir,
          ref: "HEAD",
          value: fullnewref
        });
      }
    }
    async function renameBranch({
      fs: fs3,
      dir,
      gitdir = join9(dir, ".git"),
      ref,
      oldref,
      checkout: checkout2 = false
    }) {
      try {
        assertParameter("fs", fs3);
        assertParameter("gitdir", gitdir);
        assertParameter("ref", ref);
        assertParameter("oldref", oldref);
        return await _renameBranch({
          fs: new FileSystem(fs3),
          gitdir,
          ref,
          oldref,
          checkout: checkout2
        });
      } catch (err) {
        err.caller = "git.renameBranch";
        throw err;
      }
    }
    async function hashObject$1({ gitdir, type, object }) {
      return shasum(GitObject.wrap({ type, object }));
    }
    async function resetIndex({
      fs: _fs,
      dir,
      gitdir = join9(dir, ".git"),
      filepath,
      ref = "HEAD",
      cache = {}
    }) {
      try {
        assertParameter("fs", _fs);
        assertParameter("gitdir", gitdir);
        assertParameter("filepath", filepath);
        assertParameter("ref", ref);
        const fs3 = new FileSystem(_fs);
        let oid = await GitRefManager.resolve({ fs: fs3, gitdir, ref });
        let workdirOid;
        try {
          oid = await resolveFilepath({
            fs: fs3,
            cache,
            gitdir,
            oid,
            filepath
          });
        } catch (e) {
          oid = null;
        }
        let stats = {
          ctime: new Date(0),
          mtime: new Date(0),
          dev: 0,
          ino: 0,
          mode: 0,
          uid: 0,
          gid: 0,
          size: 0
        };
        const object = dir && await fs3.read(join9(dir, filepath));
        if (object) {
          workdirOid = await hashObject$1({
            gitdir,
            type: "blob",
            object
          });
          if (oid === workdirOid) {
            stats = await fs3.lstat(join9(dir, filepath));
          }
        }
        await GitIndexManager.acquire({ fs: fs3, gitdir, cache }, async function(index2) {
          index2.delete({ filepath });
          if (oid) {
            index2.insert({ filepath, stats, oid });
          }
        });
      } catch (err) {
        err.caller = "git.reset";
        throw err;
      }
    }
    async function resolveRef({
      fs: fs3,
      dir,
      gitdir = join9(dir, ".git"),
      ref,
      depth
    }) {
      try {
        assertParameter("fs", fs3);
        assertParameter("gitdir", gitdir);
        assertParameter("ref", ref);
        const oid = await GitRefManager.resolve({
          fs: new FileSystem(fs3),
          gitdir,
          ref,
          depth
        });
        return oid;
      } catch (err) {
        err.caller = "git.resolveRef";
        throw err;
      }
    }
    async function setConfig({
      fs: _fs,
      dir,
      gitdir = join9(dir, ".git"),
      path: path2,
      value: value2,
      append = false
    }) {
      try {
        assertParameter("fs", _fs);
        assertParameter("gitdir", gitdir);
        assertParameter("path", path2);
        const fs3 = new FileSystem(_fs);
        const config = await GitConfigManager.get({ fs: fs3, gitdir });
        if (append) {
          await config.append(path2, value2);
        } else {
          await config.set(path2, value2);
        }
        await GitConfigManager.save({ fs: fs3, gitdir, config });
      } catch (err) {
        err.caller = "git.setConfig";
        throw err;
      }
    }
    async function status({
      fs: _fs,
      dir,
      gitdir = join9(dir, ".git"),
      filepath,
      cache = {}
    }) {
      try {
        assertParameter("fs", _fs);
        assertParameter("gitdir", gitdir);
        assertParameter("filepath", filepath);
        const fs3 = new FileSystem(_fs);
        const ignored = await GitIgnoreManager.isIgnored({
          fs: fs3,
          gitdir,
          dir,
          filepath
        });
        if (ignored) {
          return "ignored";
        }
        const headTree = await getHeadTree({ fs: fs3, cache, gitdir });
        const treeOid = await getOidAtPath({
          fs: fs3,
          cache,
          gitdir,
          tree: headTree,
          path: filepath
        });
        const indexEntry = await GitIndexManager.acquire({ fs: fs3, gitdir, cache }, async function(index2) {
          for (const entry of index2) {
            if (entry.path === filepath)
              return entry;
          }
          return null;
        });
        const stats = await fs3.lstat(join9(dir, filepath));
        const H = treeOid !== null;
        const I = indexEntry !== null;
        const W = stats !== null;
        const getWorkdirOid = async () => {
          if (I && !compareStats(indexEntry, stats)) {
            return indexEntry.oid;
          } else {
            const object = await fs3.read(join9(dir, filepath));
            const workdirOid = await hashObject$1({
              gitdir,
              type: "blob",
              object
            });
            if (I && indexEntry.oid === workdirOid) {
              if (stats.size !== -1) {
                GitIndexManager.acquire({ fs: fs3, gitdir, cache }, async function(index2) {
                  index2.insert({ filepath, stats, oid: workdirOid });
                });
              }
            }
            return workdirOid;
          }
        };
        if (!H && !W && !I)
          return "absent";
        if (!H && !W && I)
          return "*absent";
        if (!H && W && !I)
          return "*added";
        if (!H && W && I) {
          const workdirOid = await getWorkdirOid();
          return workdirOid === indexEntry.oid ? "added" : "*added";
        }
        if (H && !W && !I)
          return "deleted";
        if (H && !W && I) {
          return treeOid === indexEntry.oid ? "*deleted" : "*deleted";
        }
        if (H && W && !I) {
          const workdirOid = await getWorkdirOid();
          return workdirOid === treeOid ? "*undeleted" : "*undeletemodified";
        }
        if (H && W && I) {
          const workdirOid = await getWorkdirOid();
          if (workdirOid === treeOid) {
            return workdirOid === indexEntry.oid ? "unmodified" : "*unmodified";
          } else {
            return workdirOid === indexEntry.oid ? "modified" : "*modified";
          }
        }
      } catch (err) {
        err.caller = "git.status";
        throw err;
      }
    }
    async function getOidAtPath({ fs: fs3, cache, gitdir, tree, path: path2 }) {
      if (typeof path2 === "string")
        path2 = path2.split("/");
      const dirname2 = path2.shift();
      for (const entry of tree) {
        if (entry.path === dirname2) {
          if (path2.length === 0) {
            return entry.oid;
          }
          const { type, object } = await _readObject({
            fs: fs3,
            cache,
            gitdir,
            oid: entry.oid
          });
          if (type === "tree") {
            const tree2 = GitTree.from(object);
            return getOidAtPath({ fs: fs3, cache, gitdir, tree: tree2, path: path2 });
          }
          if (type === "blob") {
            throw new ObjectTypeError(entry.oid, type, "blob", path2.join("/"));
          }
        }
      }
      return null;
    }
    async function getHeadTree({ fs: fs3, cache, gitdir }) {
      let oid;
      try {
        oid = await GitRefManager.resolve({ fs: fs3, gitdir, ref: "HEAD" });
      } catch (e) {
        if (e instanceof NotFoundError) {
          return [];
        }
      }
      const { tree } = await _readTree({ fs: fs3, cache, gitdir, oid });
      return tree;
    }
    async function statusMatrix({
      fs: _fs,
      dir,
      gitdir = join9(dir, ".git"),
      ref = "HEAD",
      filepaths = ["."],
      filter,
      cache = {}
    }) {
      try {
        assertParameter("fs", _fs);
        assertParameter("gitdir", gitdir);
        assertParameter("ref", ref);
        const fs3 = new FileSystem(_fs);
        return await _walk({
          fs: fs3,
          cache,
          dir,
          gitdir,
          trees: [TREE({ ref }), WORKDIR(), STAGE()],
          map: async function(filepath, [head, workdir, stage]) {
            if (!head && !stage && workdir) {
              if (await GitIgnoreManager.isIgnored({
                fs: fs3,
                dir,
                filepath
              })) {
                return null;
              }
            }
            if (!filepaths.some((base2) => worthWalking(filepath, base2))) {
              return null;
            }
            if (filter) {
              if (!filter(filepath))
                return;
            }
            const headType = head && await head.type();
            if (headType === "tree" || headType === "special")
              return;
            if (headType === "commit")
              return null;
            const workdirType = workdir && await workdir.type();
            if (workdirType === "tree" || workdirType === "special")
              return;
            const stageType = stage && await stage.type();
            if (stageType === "commit")
              return null;
            if (stageType === "tree" || stageType === "special")
              return;
            const headOid = head ? await head.oid() : void 0;
            const stageOid = stage ? await stage.oid() : void 0;
            let workdirOid;
            if (!head && workdir && !stage) {
              workdirOid = "42";
            } else if (workdir) {
              workdirOid = await workdir.oid();
            }
            const entry = [void 0, headOid, workdirOid, stageOid];
            const result = entry.map((value2) => entry.indexOf(value2));
            result.shift();
            return [filepath, ...result];
          }
        });
      } catch (err) {
        err.caller = "git.statusMatrix";
        throw err;
      }
    }
    async function tag({
      fs: _fs,
      dir,
      gitdir = join9(dir, ".git"),
      ref,
      object,
      force = false
    }) {
      try {
        assertParameter("fs", _fs);
        assertParameter("gitdir", gitdir);
        assertParameter("ref", ref);
        const fs3 = new FileSystem(_fs);
        if (ref === void 0) {
          throw new MissingParameterError("ref");
        }
        ref = ref.startsWith("refs/tags/") ? ref : `refs/tags/${ref}`;
        const value2 = await GitRefManager.resolve({
          fs: fs3,
          gitdir,
          ref: object || "HEAD"
        });
        if (!force && await GitRefManager.exists({ fs: fs3, gitdir, ref })) {
          throw new AlreadyExistsError("tag", ref);
        }
        await GitRefManager.writeRef({ fs: fs3, gitdir, ref, value: value2 });
      } catch (err) {
        err.caller = "git.tag";
        throw err;
      }
    }
    function version() {
      try {
        return pkg.version;
      } catch (err) {
        err.caller = "git.version";
        throw err;
      }
    }
    async function walk({
      fs: fs3,
      dir,
      gitdir = join9(dir, ".git"),
      trees,
      map,
      reduce,
      iterate,
      cache = {}
    }) {
      try {
        assertParameter("fs", fs3);
        assertParameter("gitdir", gitdir);
        assertParameter("trees", trees);
        return await _walk({
          fs: new FileSystem(fs3),
          cache,
          dir,
          gitdir,
          trees,
          map,
          reduce,
          iterate
        });
      } catch (err) {
        err.caller = "git.walk";
        throw err;
      }
    }
    async function writeBlob({ fs: fs3, dir, gitdir = join9(dir, ".git"), blob }) {
      try {
        assertParameter("fs", fs3);
        assertParameter("gitdir", gitdir);
        assertParameter("blob", blob);
        return await _writeObject({
          fs: new FileSystem(fs3),
          gitdir,
          type: "blob",
          object: blob,
          format: "content"
        });
      } catch (err) {
        err.caller = "git.writeBlob";
        throw err;
      }
    }
    async function _writeCommit({ fs: fs3, gitdir, commit: commit2 }) {
      const object = GitCommit.from(commit2).toObject();
      const oid = await _writeObject({
        fs: fs3,
        gitdir,
        type: "commit",
        object,
        format: "content"
      });
      return oid;
    }
    async function writeCommit({
      fs: fs3,
      dir,
      gitdir = join9(dir, ".git"),
      commit: commit2
    }) {
      try {
        assertParameter("fs", fs3);
        assertParameter("gitdir", gitdir);
        assertParameter("commit", commit2);
        return await _writeCommit({
          fs: new FileSystem(fs3),
          gitdir,
          commit: commit2
        });
      } catch (err) {
        err.caller = "git.writeCommit";
        throw err;
      }
    }
    async function writeObject({
      fs: _fs,
      dir,
      gitdir = join9(dir, ".git"),
      type,
      object,
      format = "parsed",
      oid,
      encoding = void 0
    }) {
      try {
        const fs3 = new FileSystem(_fs);
        if (format === "parsed") {
          switch (type) {
            case "commit":
              object = GitCommit.from(object).toObject();
              break;
            case "tree":
              object = GitTree.from(object).toObject();
              break;
            case "blob":
              object = Buffer.from(object, encoding);
              break;
            case "tag":
              object = GitAnnotatedTag.from(object).toObject();
              break;
            default:
              throw new ObjectTypeError(oid || "", type, "blob|commit|tag|tree");
          }
          format = "content";
        }
        oid = await _writeObject({
          fs: fs3,
          gitdir,
          type,
          object,
          oid,
          format
        });
        return oid;
      } catch (err) {
        err.caller = "git.writeObject";
        throw err;
      }
    }
    async function writeRef({
      fs: _fs,
      dir,
      gitdir = join9(dir, ".git"),
      ref,
      value: value2,
      force = false,
      symbolic = false
    }) {
      try {
        assertParameter("fs", _fs);
        assertParameter("gitdir", gitdir);
        assertParameter("ref", ref);
        assertParameter("value", value2);
        const fs3 = new FileSystem(_fs);
        if (ref !== cleanGitRef.clean(ref)) {
          throw new InvalidRefNameError(ref, cleanGitRef.clean(ref));
        }
        if (!force && await GitRefManager.exists({ fs: fs3, gitdir, ref })) {
          throw new AlreadyExistsError("ref", ref);
        }
        if (symbolic) {
          await GitRefManager.writeSymbolicRef({
            fs: fs3,
            gitdir,
            ref,
            value: value2
          });
        } else {
          value2 = await GitRefManager.resolve({
            fs: fs3,
            gitdir,
            ref: value2
          });
          await GitRefManager.writeRef({
            fs: fs3,
            gitdir,
            ref,
            value: value2
          });
        }
      } catch (err) {
        err.caller = "git.writeRef";
        throw err;
      }
    }
    async function _writeTag({ fs: fs3, gitdir, tag: tag2 }) {
      const object = GitAnnotatedTag.from(tag2).toObject();
      const oid = await _writeObject({
        fs: fs3,
        gitdir,
        type: "tag",
        object,
        format: "content"
      });
      return oid;
    }
    async function writeTag({ fs: fs3, dir, gitdir = join9(dir, ".git"), tag: tag2 }) {
      try {
        assertParameter("fs", fs3);
        assertParameter("gitdir", gitdir);
        assertParameter("tag", tag2);
        return await _writeTag({
          fs: new FileSystem(fs3),
          gitdir,
          tag: tag2
        });
      } catch (err) {
        err.caller = "git.writeTag";
        throw err;
      }
    }
    async function writeTree({ fs: fs3, dir, gitdir = join9(dir, ".git"), tree }) {
      try {
        assertParameter("fs", fs3);
        assertParameter("gitdir", gitdir);
        assertParameter("tree", tree);
        return await _writeTree({
          fs: new FileSystem(fs3),
          gitdir,
          tree
        });
      } catch (err) {
        err.caller = "git.writeTree";
        throw err;
      }
    }
    var index = {
      Errors,
      STAGE,
      TREE,
      WORKDIR,
      add,
      addNote,
      addRemote,
      annotatedTag,
      branch,
      checkout,
      clone,
      commit,
      getConfig,
      getConfigAll,
      setConfig,
      currentBranch,
      deleteBranch,
      deleteRef,
      deleteRemote,
      deleteTag,
      expandOid,
      expandRef,
      fastForward,
      fetch,
      findMergeBase,
      findRoot,
      getRemoteInfo,
      getRemoteInfo2,
      hashBlob,
      indexPack,
      init,
      isDescendent,
      isIgnored,
      listBranches,
      listFiles,
      listNotes,
      listRemotes,
      listServerRefs,
      listTags,
      log: log3,
      merge,
      packObjects,
      pull,
      push,
      readBlob,
      readCommit,
      readNote,
      readObject,
      readTag,
      readTree,
      remove: remove2,
      removeNote,
      renameBranch,
      resetIndex,
      resolveRef,
      status,
      statusMatrix,
      tag,
      version,
      walk,
      writeBlob,
      writeCommit,
      writeObject,
      writeRef,
      writeTag,
      writeTree
    };
    exports2.Errors = Errors;
    exports2.STAGE = STAGE;
    exports2.TREE = TREE;
    exports2.WORKDIR = WORKDIR;
    exports2.add = add;
    exports2.addNote = addNote;
    exports2.addRemote = addRemote;
    exports2.annotatedTag = annotatedTag;
    exports2.branch = branch;
    exports2.checkout = checkout;
    exports2.clone = clone;
    exports2.commit = commit;
    exports2.currentBranch = currentBranch;
    exports2.default = index;
    exports2.deleteBranch = deleteBranch;
    exports2.deleteRef = deleteRef;
    exports2.deleteRemote = deleteRemote;
    exports2.deleteTag = deleteTag;
    exports2.expandOid = expandOid;
    exports2.expandRef = expandRef;
    exports2.fastForward = fastForward;
    exports2.fetch = fetch;
    exports2.findMergeBase = findMergeBase;
    exports2.findRoot = findRoot;
    exports2.getConfig = getConfig;
    exports2.getConfigAll = getConfigAll;
    exports2.getRemoteInfo = getRemoteInfo;
    exports2.getRemoteInfo2 = getRemoteInfo2;
    exports2.hashBlob = hashBlob;
    exports2.indexPack = indexPack;
    exports2.init = init;
    exports2.isDescendent = isDescendent;
    exports2.isIgnored = isIgnored;
    exports2.listBranches = listBranches;
    exports2.listFiles = listFiles;
    exports2.listNotes = listNotes;
    exports2.listRemotes = listRemotes;
    exports2.listServerRefs = listServerRefs;
    exports2.listTags = listTags;
    exports2.log = log3;
    exports2.merge = merge;
    exports2.packObjects = packObjects;
    exports2.pull = pull;
    exports2.push = push;
    exports2.readBlob = readBlob;
    exports2.readCommit = readCommit;
    exports2.readNote = readNote;
    exports2.readObject = readObject;
    exports2.readTag = readTag;
    exports2.readTree = readTree;
    exports2.remove = remove2;
    exports2.removeNote = removeNote;
    exports2.renameBranch = renameBranch;
    exports2.resetIndex = resetIndex;
    exports2.resolveRef = resolveRef;
    exports2.setConfig = setConfig;
    exports2.status = status;
    exports2.statusMatrix = statusMatrix;
    exports2.tag = tag;
    exports2.version = version;
    exports2.walk = walk;
    exports2.writeBlob = writeBlob;
    exports2.writeCommit = writeCommit;
    exports2.writeObject = writeObject;
    exports2.writeRef = writeRef;
    exports2.writeTag = writeTag;
    exports2.writeTree = writeTree;
  }
});

// node_modules/.pnpm/simple-concat@1.0.1/node_modules/simple-concat/index.js
var require_simple_concat = __commonJS({
  "node_modules/.pnpm/simple-concat@1.0.1/node_modules/simple-concat/index.js"(exports2, module2) {
    module2.exports = function(stream, cb) {
      var chunks = [];
      stream.on("data", function(chunk) {
        chunks.push(chunk);
      });
      stream.once("end", function() {
        if (cb)
          cb(null, Buffer.concat(chunks));
        cb = null;
      });
      stream.once("error", function(err) {
        if (cb)
          cb(err);
        cb = null;
      });
    };
  }
});

// node_modules/.pnpm/mimic-response@2.1.0/node_modules/mimic-response/index.js
var require_mimic_response = __commonJS({
  "node_modules/.pnpm/mimic-response@2.1.0/node_modules/mimic-response/index.js"(exports2, module2) {
    "use strict";
    var knownProperties = [
      "aborted",
      "complete",
      "destroy",
      "headers",
      "httpVersion",
      "httpVersionMinor",
      "httpVersionMajor",
      "method",
      "rawHeaders",
      "rawTrailers",
      "setTimeout",
      "socket",
      "statusCode",
      "statusMessage",
      "trailers",
      "url"
    ];
    module2.exports = (fromStream, toStream) => {
      const fromProperties = new Set(Object.keys(fromStream).concat(knownProperties));
      for (const property of fromProperties) {
        if (property in toStream) {
          continue;
        }
        toStream[property] = typeof fromStream[property] === "function" ? fromStream[property].bind(fromStream) : fromStream[property];
      }
      return toStream;
    };
  }
});

// node_modules/.pnpm/decompress-response@4.2.1/node_modules/decompress-response/index.js
var require_decompress_response = __commonJS({
  "node_modules/.pnpm/decompress-response@4.2.1/node_modules/decompress-response/index.js"(exports2, module2) {
    "use strict";
    var { PassThrough: PassThroughStream } = __require("stream");
    var zlib = __require("zlib");
    var mimicResponse = require_mimic_response();
    var decompressResponse = (response) => {
      const contentEncoding = (response.headers["content-encoding"] || "").toLowerCase();
      if (!["gzip", "deflate", "br"].includes(contentEncoding)) {
        return response;
      }
      const isBrotli = contentEncoding === "br";
      if (isBrotli && typeof zlib.createBrotliDecompress !== "function") {
        return response;
      }
      const decompress = isBrotli ? zlib.createBrotliDecompress() : zlib.createUnzip();
      const stream = new PassThroughStream();
      mimicResponse(response, stream);
      decompress.on("error", (error) => {
        if (error.code === "Z_BUF_ERROR") {
          stream.end();
          return;
        }
        stream.emit("error", error);
      });
      response.pipe(decompress).pipe(stream);
      return stream;
    };
    module2.exports = decompressResponse;
    module2.exports.default = decompressResponse;
  }
});

// node_modules/.pnpm/wrappy@1.0.2/node_modules/wrappy/wrappy.js
var require_wrappy = __commonJS({
  "node_modules/.pnpm/wrappy@1.0.2/node_modules/wrappy/wrappy.js"(exports2, module2) {
    module2.exports = wrappy;
    function wrappy(fn, cb) {
      if (fn && cb)
        return wrappy(fn)(cb);
      if (typeof fn !== "function")
        throw new TypeError("need wrapper function");
      Object.keys(fn).forEach(function(k) {
        wrapper[k] = fn[k];
      });
      return wrapper;
      function wrapper() {
        var args = new Array(arguments.length);
        for (var i2 = 0; i2 < args.length; i2++) {
          args[i2] = arguments[i2];
        }
        var ret = fn.apply(this, args);
        var cb2 = args[args.length - 1];
        if (typeof ret === "function" && ret !== cb2) {
          Object.keys(cb2).forEach(function(k) {
            ret[k] = cb2[k];
          });
        }
        return ret;
      }
    }
  }
});

// node_modules/.pnpm/once@1.4.0/node_modules/once/once.js
var require_once = __commonJS({
  "node_modules/.pnpm/once@1.4.0/node_modules/once/once.js"(exports2, module2) {
    var wrappy = require_wrappy();
    module2.exports = wrappy(once);
    module2.exports.strict = wrappy(onceStrict);
    once.proto = once(function() {
      Object.defineProperty(Function.prototype, "once", {
        value: function() {
          return once(this);
        },
        configurable: true
      });
      Object.defineProperty(Function.prototype, "onceStrict", {
        value: function() {
          return onceStrict(this);
        },
        configurable: true
      });
    });
    function once(fn) {
      var f = function() {
        if (f.called)
          return f.value;
        f.called = true;
        return f.value = fn.apply(this, arguments);
      };
      f.called = false;
      return f;
    }
    function onceStrict(fn) {
      var f = function() {
        if (f.called)
          throw new Error(f.onceError);
        f.called = true;
        return f.value = fn.apply(this, arguments);
      };
      var name2 = fn.name || "Function wrapped with `once`";
      f.onceError = name2 + " shouldn't be called more than once";
      f.called = false;
      return f;
    }
  }
});

// node_modules/.pnpm/simple-get@3.1.0/node_modules/simple-get/index.js
var require_simple_get = __commonJS({
  "node_modules/.pnpm/simple-get@3.1.0/node_modules/simple-get/index.js"(exports2, module2) {
    module2.exports = simpleGet;
    var concat = require_simple_concat();
    var decompressResponse = require_decompress_response();
    var http2 = __require("http");
    var https = __require("https");
    var once = require_once();
    var querystring = __require("querystring");
    var url = __require("url");
    var isStream = (o) => o !== null && typeof o === "object" && typeof o.pipe === "function";
    function simpleGet(opts, cb) {
      opts = Object.assign({ maxRedirects: 10 }, typeof opts === "string" ? { url: opts } : opts);
      cb = once(cb);
      if (opts.url) {
        const { hostname, port, protocol: protocol2, auth, path: path2 } = url.parse(opts.url);
        delete opts.url;
        if (!hostname && !port && !protocol2 && !auth)
          opts.path = path2;
        else
          Object.assign(opts, { hostname, port, protocol: protocol2, auth, path: path2 });
      }
      const headers = { "accept-encoding": "gzip, deflate" };
      if (opts.headers)
        Object.keys(opts.headers).forEach((k) => headers[k.toLowerCase()] = opts.headers[k]);
      opts.headers = headers;
      let body;
      if (opts.body) {
        body = opts.json && !isStream(opts.body) ? JSON.stringify(opts.body) : opts.body;
      } else if (opts.form) {
        body = typeof opts.form === "string" ? opts.form : querystring.stringify(opts.form);
        opts.headers["content-type"] = "application/x-www-form-urlencoded";
      }
      if (body) {
        if (!opts.method)
          opts.method = "POST";
        if (!isStream(body))
          opts.headers["content-length"] = Buffer.byteLength(body);
        if (opts.json && !opts.form)
          opts.headers["content-type"] = "application/json";
      }
      delete opts.body;
      delete opts.form;
      if (opts.json)
        opts.headers.accept = "application/json";
      if (opts.method)
        opts.method = opts.method.toUpperCase();
      const protocol = opts.protocol === "https:" ? https : http2;
      const req = protocol.request(opts, (res) => {
        if (opts.followRedirects !== false && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          opts.url = res.headers.location;
          delete opts.headers.host;
          res.resume();
          if (opts.method === "POST" && [301, 302].includes(res.statusCode)) {
            opts.method = "GET";
            delete opts.headers["content-length"];
            delete opts.headers["content-type"];
          }
          if (opts.maxRedirects-- === 0)
            return cb(new Error("too many redirects"));
          else
            return simpleGet(opts, cb);
        }
        const tryUnzip = typeof decompressResponse === "function" && opts.method !== "HEAD";
        cb(null, tryUnzip ? decompressResponse(res) : res);
      });
      req.on("timeout", () => {
        req.abort();
        cb(new Error("Request timed out"));
      });
      req.on("error", cb);
      if (isStream(body))
        body.on("error", cb).pipe(req);
      else
        req.end(body);
      return req;
    }
    simpleGet.concat = (opts, cb) => {
      return simpleGet(opts, (err, res) => {
        if (err)
          return cb(err);
        concat(res, (err2, data) => {
          if (err2)
            return cb(err2);
          if (opts.json) {
            try {
              data = JSON.parse(data.toString());
            } catch (err3) {
              return cb(err3, res, data);
            }
          }
          cb(null, res, data);
        });
      });
    };
    ["get", "post", "put", "patch", "head", "delete"].forEach((method) => {
      simpleGet[method] = (opts, cb) => {
        if (typeof opts === "string")
          opts = { url: opts };
        return simpleGet(Object.assign({ method: method.toUpperCase() }, opts), cb);
      };
    });
  }
});

// node_modules/.pnpm/readable-stream@3.6.0/node_modules/readable-stream/lib/internal/streams/stream.js
var require_stream2 = __commonJS({
  "node_modules/.pnpm/readable-stream@3.6.0/node_modules/readable-stream/lib/internal/streams/stream.js"(exports2, module2) {
    module2.exports = __require("stream");
  }
});

// node_modules/.pnpm/readable-stream@3.6.0/node_modules/readable-stream/lib/internal/streams/buffer_list.js
var require_buffer_list = __commonJS({
  "node_modules/.pnpm/readable-stream@3.6.0/node_modules/readable-stream/lib/internal/streams/buffer_list.js"(exports2, module2) {
    "use strict";
    function ownKeys(object, enumerableOnly) {
      var keys = Object.keys(object);
      if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly)
          symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
          });
        keys.push.apply(keys, symbols);
      }
      return keys;
    }
    function _objectSpread(target) {
      for (var i2 = 1; i2 < arguments.length; i2++) {
        var source = arguments[i2] != null ? arguments[i2] : {};
        if (i2 % 2) {
          ownKeys(Object(source), true).forEach(function(key) {
            _defineProperty(target, key, source[key]);
          });
        } else if (Object.getOwnPropertyDescriptors) {
          Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
        } else {
          ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
          });
        }
      }
      return target;
    }
    function _defineProperty(obj, key, value2) {
      if (key in obj) {
        Object.defineProperty(obj, key, { value: value2, enumerable: true, configurable: true, writable: true });
      } else {
        obj[key] = value2;
      }
      return obj;
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i2 = 0; i2 < props.length; i2++) {
        var descriptor = props[i2];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      return Constructor;
    }
    var _require = __require("buffer");
    var Buffer2 = _require.Buffer;
    var _require2 = __require("util");
    var inspect = _require2.inspect;
    var custom = inspect && inspect.custom || "inspect";
    function copyBuffer(src, target, offset) {
      Buffer2.prototype.copy.call(src, target, offset);
    }
    module2.exports = /* @__PURE__ */ function() {
      function BufferList() {
        _classCallCheck(this, BufferList);
        this.head = null;
        this.tail = null;
        this.length = 0;
      }
      _createClass(BufferList, [{
        key: "push",
        value: function push(v) {
          var entry = {
            data: v,
            next: null
          };
          if (this.length > 0)
            this.tail.next = entry;
          else
            this.head = entry;
          this.tail = entry;
          ++this.length;
        }
      }, {
        key: "unshift",
        value: function unshift(v) {
          var entry = {
            data: v,
            next: this.head
          };
          if (this.length === 0)
            this.tail = entry;
          this.head = entry;
          ++this.length;
        }
      }, {
        key: "shift",
        value: function shift() {
          if (this.length === 0)
            return;
          var ret = this.head.data;
          if (this.length === 1)
            this.head = this.tail = null;
          else
            this.head = this.head.next;
          --this.length;
          return ret;
        }
      }, {
        key: "clear",
        value: function clear() {
          this.head = this.tail = null;
          this.length = 0;
        }
      }, {
        key: "join",
        value: function join9(s) {
          if (this.length === 0)
            return "";
          var p = this.head;
          var ret = "" + p.data;
          while (p = p.next) {
            ret += s + p.data;
          }
          return ret;
        }
      }, {
        key: "concat",
        value: function concat(n) {
          if (this.length === 0)
            return Buffer2.alloc(0);
          var ret = Buffer2.allocUnsafe(n >>> 0);
          var p = this.head;
          var i2 = 0;
          while (p) {
            copyBuffer(p.data, ret, i2);
            i2 += p.data.length;
            p = p.next;
          }
          return ret;
        }
      }, {
        key: "consume",
        value: function consume(n, hasStrings) {
          var ret;
          if (n < this.head.data.length) {
            ret = this.head.data.slice(0, n);
            this.head.data = this.head.data.slice(n);
          } else if (n === this.head.data.length) {
            ret = this.shift();
          } else {
            ret = hasStrings ? this._getString(n) : this._getBuffer(n);
          }
          return ret;
        }
      }, {
        key: "first",
        value: function first() {
          return this.head.data;
        }
      }, {
        key: "_getString",
        value: function _getString(n) {
          var p = this.head;
          var c = 1;
          var ret = p.data;
          n -= ret.length;
          while (p = p.next) {
            var str = p.data;
            var nb = n > str.length ? str.length : n;
            if (nb === str.length)
              ret += str;
            else
              ret += str.slice(0, n);
            n -= nb;
            if (n === 0) {
              if (nb === str.length) {
                ++c;
                if (p.next)
                  this.head = p.next;
                else
                  this.head = this.tail = null;
              } else {
                this.head = p;
                p.data = str.slice(nb);
              }
              break;
            }
            ++c;
          }
          this.length -= c;
          return ret;
        }
      }, {
        key: "_getBuffer",
        value: function _getBuffer(n) {
          var ret = Buffer2.allocUnsafe(n);
          var p = this.head;
          var c = 1;
          p.data.copy(ret);
          n -= p.data.length;
          while (p = p.next) {
            var buf = p.data;
            var nb = n > buf.length ? buf.length : n;
            buf.copy(ret, ret.length - n, 0, nb);
            n -= nb;
            if (n === 0) {
              if (nb === buf.length) {
                ++c;
                if (p.next)
                  this.head = p.next;
                else
                  this.head = this.tail = null;
              } else {
                this.head = p;
                p.data = buf.slice(nb);
              }
              break;
            }
            ++c;
          }
          this.length -= c;
          return ret;
        }
      }, {
        key: custom,
        value: function value2(_, options) {
          return inspect(this, _objectSpread({}, options, {
            depth: 0,
            customInspect: false
          }));
        }
      }]);
      return BufferList;
    }();
  }
});

// node_modules/.pnpm/readable-stream@3.6.0/node_modules/readable-stream/lib/internal/streams/destroy.js
var require_destroy = __commonJS({
  "node_modules/.pnpm/readable-stream@3.6.0/node_modules/readable-stream/lib/internal/streams/destroy.js"(exports2, module2) {
    "use strict";
    function destroy(err, cb) {
      var _this = this;
      var readableDestroyed = this._readableState && this._readableState.destroyed;
      var writableDestroyed = this._writableState && this._writableState.destroyed;
      if (readableDestroyed || writableDestroyed) {
        if (cb) {
          cb(err);
        } else if (err) {
          if (!this._writableState) {
            process.nextTick(emitErrorNT, this, err);
          } else if (!this._writableState.errorEmitted) {
            this._writableState.errorEmitted = true;
            process.nextTick(emitErrorNT, this, err);
          }
        }
        return this;
      }
      if (this._readableState) {
        this._readableState.destroyed = true;
      }
      if (this._writableState) {
        this._writableState.destroyed = true;
      }
      this._destroy(err || null, function(err2) {
        if (!cb && err2) {
          if (!_this._writableState) {
            process.nextTick(emitErrorAndCloseNT, _this, err2);
          } else if (!_this._writableState.errorEmitted) {
            _this._writableState.errorEmitted = true;
            process.nextTick(emitErrorAndCloseNT, _this, err2);
          } else {
            process.nextTick(emitCloseNT, _this);
          }
        } else if (cb) {
          process.nextTick(emitCloseNT, _this);
          cb(err2);
        } else {
          process.nextTick(emitCloseNT, _this);
        }
      });
      return this;
    }
    function emitErrorAndCloseNT(self2, err) {
      emitErrorNT(self2, err);
      emitCloseNT(self2);
    }
    function emitCloseNT(self2) {
      if (self2._writableState && !self2._writableState.emitClose)
        return;
      if (self2._readableState && !self2._readableState.emitClose)
        return;
      self2.emit("close");
    }
    function undestroy() {
      if (this._readableState) {
        this._readableState.destroyed = false;
        this._readableState.reading = false;
        this._readableState.ended = false;
        this._readableState.endEmitted = false;
      }
      if (this._writableState) {
        this._writableState.destroyed = false;
        this._writableState.ended = false;
        this._writableState.ending = false;
        this._writableState.finalCalled = false;
        this._writableState.prefinished = false;
        this._writableState.finished = false;
        this._writableState.errorEmitted = false;
      }
    }
    function emitErrorNT(self2, err) {
      self2.emit("error", err);
    }
    function errorOrDestroy(stream, err) {
      var rState = stream._readableState;
      var wState = stream._writableState;
      if (rState && rState.autoDestroy || wState && wState.autoDestroy)
        stream.destroy(err);
      else
        stream.emit("error", err);
    }
    module2.exports = {
      destroy,
      undestroy,
      errorOrDestroy
    };
  }
});

// node_modules/.pnpm/readable-stream@3.6.0/node_modules/readable-stream/errors.js
var require_errors = __commonJS({
  "node_modules/.pnpm/readable-stream@3.6.0/node_modules/readable-stream/errors.js"(exports2, module2) {
    "use strict";
    var codes = {};
    function createErrorType(code, message, Base) {
      if (!Base) {
        Base = Error;
      }
      function getMessage(arg1, arg2, arg3) {
        if (typeof message === "string") {
          return message;
        } else {
          return message(arg1, arg2, arg3);
        }
      }
      class NodeError extends Base {
        constructor(arg1, arg2, arg3) {
          super(getMessage(arg1, arg2, arg3));
        }
      }
      NodeError.prototype.name = Base.name;
      NodeError.prototype.code = code;
      codes[code] = NodeError;
    }
    function oneOf(expected, thing) {
      if (Array.isArray(expected)) {
        const len = expected.length;
        expected = expected.map((i2) => String(i2));
        if (len > 2) {
          return `one of ${thing} ${expected.slice(0, len - 1).join(", ")}, or ` + expected[len - 1];
        } else if (len === 2) {
          return `one of ${thing} ${expected[0]} or ${expected[1]}`;
        } else {
          return `of ${thing} ${expected[0]}`;
        }
      } else {
        return `of ${thing} ${String(expected)}`;
      }
    }
    function startsWith(str, search, pos) {
      return str.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
    }
    function endsWith(str, search, this_len) {
      if (this_len === void 0 || this_len > str.length) {
        this_len = str.length;
      }
      return str.substring(this_len - search.length, this_len) === search;
    }
    function includes(str, search, start) {
      if (typeof start !== "number") {
        start = 0;
      }
      if (start + search.length > str.length) {
        return false;
      } else {
        return str.indexOf(search, start) !== -1;
      }
    }
    createErrorType("ERR_INVALID_OPT_VALUE", function(name2, value2) {
      return 'The value "' + value2 + '" is invalid for option "' + name2 + '"';
    }, TypeError);
    createErrorType("ERR_INVALID_ARG_TYPE", function(name2, expected, actual) {
      let determiner;
      if (typeof expected === "string" && startsWith(expected, "not ")) {
        determiner = "must not be";
        expected = expected.replace(/^not /, "");
      } else {
        determiner = "must be";
      }
      let msg;
      if (endsWith(name2, " argument")) {
        msg = `The ${name2} ${determiner} ${oneOf(expected, "type")}`;
      } else {
        const type = includes(name2, ".") ? "property" : "argument";
        msg = `The "${name2}" ${type} ${determiner} ${oneOf(expected, "type")}`;
      }
      msg += `. Received type ${typeof actual}`;
      return msg;
    }, TypeError);
    createErrorType("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF");
    createErrorType("ERR_METHOD_NOT_IMPLEMENTED", function(name2) {
      return "The " + name2 + " method is not implemented";
    });
    createErrorType("ERR_STREAM_PREMATURE_CLOSE", "Premature close");
    createErrorType("ERR_STREAM_DESTROYED", function(name2) {
      return "Cannot call " + name2 + " after a stream was destroyed";
    });
    createErrorType("ERR_MULTIPLE_CALLBACK", "Callback called multiple times");
    createErrorType("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable");
    createErrorType("ERR_STREAM_WRITE_AFTER_END", "write after end");
    createErrorType("ERR_STREAM_NULL_VALUES", "May not write null values to stream", TypeError);
    createErrorType("ERR_UNKNOWN_ENCODING", function(arg2) {
      return "Unknown encoding: " + arg2;
    }, TypeError);
    createErrorType("ERR_STREAM_UNSHIFT_AFTER_END_EVENT", "stream.unshift() after end event");
    module2.exports.codes = codes;
  }
});

// node_modules/.pnpm/readable-stream@3.6.0/node_modules/readable-stream/lib/internal/streams/state.js
var require_state = __commonJS({
  "node_modules/.pnpm/readable-stream@3.6.0/node_modules/readable-stream/lib/internal/streams/state.js"(exports2, module2) {
    "use strict";
    var ERR_INVALID_OPT_VALUE = require_errors().codes.ERR_INVALID_OPT_VALUE;
    function highWaterMarkFrom(options, isDuplex, duplexKey) {
      return options.highWaterMark != null ? options.highWaterMark : isDuplex ? options[duplexKey] : null;
    }
    function getHighWaterMark(state, options, duplexKey, isDuplex) {
      var hwm = highWaterMarkFrom(options, isDuplex, duplexKey);
      if (hwm != null) {
        if (!(isFinite(hwm) && Math.floor(hwm) === hwm) || hwm < 0) {
          var name2 = isDuplex ? duplexKey : "highWaterMark";
          throw new ERR_INVALID_OPT_VALUE(name2, hwm);
        }
        return Math.floor(hwm);
      }
      return state.objectMode ? 16 : 16 * 1024;
    }
    module2.exports = {
      getHighWaterMark
    };
  }
});

// node_modules/.pnpm/util-deprecate@1.0.2/node_modules/util-deprecate/node.js
var require_node = __commonJS({
  "node_modules/.pnpm/util-deprecate@1.0.2/node_modules/util-deprecate/node.js"(exports2, module2) {
    module2.exports = __require("util").deprecate;
  }
});

// node_modules/.pnpm/readable-stream@3.6.0/node_modules/readable-stream/lib/_stream_writable.js
var require_stream_writable = __commonJS({
  "node_modules/.pnpm/readable-stream@3.6.0/node_modules/readable-stream/lib/_stream_writable.js"(exports2, module2) {
    "use strict";
    module2.exports = Writable;
    function CorkedRequest(state) {
      var _this = this;
      this.next = null;
      this.entry = null;
      this.finish = function() {
        onCorkedFinish(_this, state);
      };
    }
    var Duplex;
    Writable.WritableState = WritableState;
    var internalUtil = {
      deprecate: require_node()
    };
    var Stream = require_stream2();
    var Buffer2 = __require("buffer").Buffer;
    var OurUint8Array = global.Uint8Array || function() {
    };
    function _uint8ArrayToBuffer(chunk) {
      return Buffer2.from(chunk);
    }
    function _isUint8Array(obj) {
      return Buffer2.isBuffer(obj) || obj instanceof OurUint8Array;
    }
    var destroyImpl = require_destroy();
    var _require = require_state();
    var getHighWaterMark = _require.getHighWaterMark;
    var _require$codes = require_errors().codes;
    var ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE;
    var ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED;
    var ERR_MULTIPLE_CALLBACK = _require$codes.ERR_MULTIPLE_CALLBACK;
    var ERR_STREAM_CANNOT_PIPE = _require$codes.ERR_STREAM_CANNOT_PIPE;
    var ERR_STREAM_DESTROYED = _require$codes.ERR_STREAM_DESTROYED;
    var ERR_STREAM_NULL_VALUES = _require$codes.ERR_STREAM_NULL_VALUES;
    var ERR_STREAM_WRITE_AFTER_END = _require$codes.ERR_STREAM_WRITE_AFTER_END;
    var ERR_UNKNOWN_ENCODING = _require$codes.ERR_UNKNOWN_ENCODING;
    var errorOrDestroy = destroyImpl.errorOrDestroy;
    require_inherits()(Writable, Stream);
    function nop() {
    }
    function WritableState(options, stream, isDuplex) {
      Duplex = Duplex || require_stream_duplex();
      options = options || {};
      if (typeof isDuplex !== "boolean")
        isDuplex = stream instanceof Duplex;
      this.objectMode = !!options.objectMode;
      if (isDuplex)
        this.objectMode = this.objectMode || !!options.writableObjectMode;
      this.highWaterMark = getHighWaterMark(this, options, "writableHighWaterMark", isDuplex);
      this.finalCalled = false;
      this.needDrain = false;
      this.ending = false;
      this.ended = false;
      this.finished = false;
      this.destroyed = false;
      var noDecode = options.decodeStrings === false;
      this.decodeStrings = !noDecode;
      this.defaultEncoding = options.defaultEncoding || "utf8";
      this.length = 0;
      this.writing = false;
      this.corked = 0;
      this.sync = true;
      this.bufferProcessing = false;
      this.onwrite = function(er) {
        onwrite(stream, er);
      };
      this.writecb = null;
      this.writelen = 0;
      this.bufferedRequest = null;
      this.lastBufferedRequest = null;
      this.pendingcb = 0;
      this.prefinished = false;
      this.errorEmitted = false;
      this.emitClose = options.emitClose !== false;
      this.autoDestroy = !!options.autoDestroy;
      this.bufferedRequestCount = 0;
      this.corkedRequestsFree = new CorkedRequest(this);
    }
    WritableState.prototype.getBuffer = function getBuffer() {
      var current = this.bufferedRequest;
      var out = [];
      while (current) {
        out.push(current);
        current = current.next;
      }
      return out;
    };
    (function() {
      try {
        Object.defineProperty(WritableState.prototype, "buffer", {
          get: internalUtil.deprecate(function writableStateBufferGetter() {
            return this.getBuffer();
          }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
        });
      } catch (_) {
      }
    })();
    var realHasInstance;
    if (typeof Symbol === "function" && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === "function") {
      realHasInstance = Function.prototype[Symbol.hasInstance];
      Object.defineProperty(Writable, Symbol.hasInstance, {
        value: function value2(object) {
          if (realHasInstance.call(this, object))
            return true;
          if (this !== Writable)
            return false;
          return object && object._writableState instanceof WritableState;
        }
      });
    } else {
      realHasInstance = function realHasInstance2(object) {
        return object instanceof this;
      };
    }
    function Writable(options) {
      Duplex = Duplex || require_stream_duplex();
      var isDuplex = this instanceof Duplex;
      if (!isDuplex && !realHasInstance.call(Writable, this))
        return new Writable(options);
      this._writableState = new WritableState(options, this, isDuplex);
      this.writable = true;
      if (options) {
        if (typeof options.write === "function")
          this._write = options.write;
        if (typeof options.writev === "function")
          this._writev = options.writev;
        if (typeof options.destroy === "function")
          this._destroy = options.destroy;
        if (typeof options.final === "function")
          this._final = options.final;
      }
      Stream.call(this);
    }
    Writable.prototype.pipe = function() {
      errorOrDestroy(this, new ERR_STREAM_CANNOT_PIPE());
    };
    function writeAfterEnd(stream, cb) {
      var er = new ERR_STREAM_WRITE_AFTER_END();
      errorOrDestroy(stream, er);
      process.nextTick(cb, er);
    }
    function validChunk(stream, state, chunk, cb) {
      var er;
      if (chunk === null) {
        er = new ERR_STREAM_NULL_VALUES();
      } else if (typeof chunk !== "string" && !state.objectMode) {
        er = new ERR_INVALID_ARG_TYPE("chunk", ["string", "Buffer"], chunk);
      }
      if (er) {
        errorOrDestroy(stream, er);
        process.nextTick(cb, er);
        return false;
      }
      return true;
    }
    Writable.prototype.write = function(chunk, encoding, cb) {
      var state = this._writableState;
      var ret = false;
      var isBuf = !state.objectMode && _isUint8Array(chunk);
      if (isBuf && !Buffer2.isBuffer(chunk)) {
        chunk = _uint8ArrayToBuffer(chunk);
      }
      if (typeof encoding === "function") {
        cb = encoding;
        encoding = null;
      }
      if (isBuf)
        encoding = "buffer";
      else if (!encoding)
        encoding = state.defaultEncoding;
      if (typeof cb !== "function")
        cb = nop;
      if (state.ending)
        writeAfterEnd(this, cb);
      else if (isBuf || validChunk(this, state, chunk, cb)) {
        state.pendingcb++;
        ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
      }
      return ret;
    };
    Writable.prototype.cork = function() {
      this._writableState.corked++;
    };
    Writable.prototype.uncork = function() {
      var state = this._writableState;
      if (state.corked) {
        state.corked--;
        if (!state.writing && !state.corked && !state.bufferProcessing && state.bufferedRequest)
          clearBuffer(this, state);
      }
    };
    Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
      if (typeof encoding === "string")
        encoding = encoding.toLowerCase();
      if (!(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((encoding + "").toLowerCase()) > -1))
        throw new ERR_UNKNOWN_ENCODING(encoding);
      this._writableState.defaultEncoding = encoding;
      return this;
    };
    Object.defineProperty(Writable.prototype, "writableBuffer", {
      enumerable: false,
      get: function get() {
        return this._writableState && this._writableState.getBuffer();
      }
    });
    function decodeChunk(state, chunk, encoding) {
      if (!state.objectMode && state.decodeStrings !== false && typeof chunk === "string") {
        chunk = Buffer2.from(chunk, encoding);
      }
      return chunk;
    }
    Object.defineProperty(Writable.prototype, "writableHighWaterMark", {
      enumerable: false,
      get: function get() {
        return this._writableState.highWaterMark;
      }
    });
    function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
      if (!isBuf) {
        var newChunk = decodeChunk(state, chunk, encoding);
        if (chunk !== newChunk) {
          isBuf = true;
          encoding = "buffer";
          chunk = newChunk;
        }
      }
      var len = state.objectMode ? 1 : chunk.length;
      state.length += len;
      var ret = state.length < state.highWaterMark;
      if (!ret)
        state.needDrain = true;
      if (state.writing || state.corked) {
        var last = state.lastBufferedRequest;
        state.lastBufferedRequest = {
          chunk,
          encoding,
          isBuf,
          callback: cb,
          next: null
        };
        if (last) {
          last.next = state.lastBufferedRequest;
        } else {
          state.bufferedRequest = state.lastBufferedRequest;
        }
        state.bufferedRequestCount += 1;
      } else {
        doWrite(stream, state, false, len, chunk, encoding, cb);
      }
      return ret;
    }
    function doWrite(stream, state, writev2, len, chunk, encoding, cb) {
      state.writelen = len;
      state.writecb = cb;
      state.writing = true;
      state.sync = true;
      if (state.destroyed)
        state.onwrite(new ERR_STREAM_DESTROYED("write"));
      else if (writev2)
        stream._writev(chunk, state.onwrite);
      else
        stream._write(chunk, encoding, state.onwrite);
      state.sync = false;
    }
    function onwriteError(stream, state, sync, er, cb) {
      --state.pendingcb;
      if (sync) {
        process.nextTick(cb, er);
        process.nextTick(finishMaybe, stream, state);
        stream._writableState.errorEmitted = true;
        errorOrDestroy(stream, er);
      } else {
        cb(er);
        stream._writableState.errorEmitted = true;
        errorOrDestroy(stream, er);
        finishMaybe(stream, state);
      }
    }
    function onwriteStateUpdate(state) {
      state.writing = false;
      state.writecb = null;
      state.length -= state.writelen;
      state.writelen = 0;
    }
    function onwrite(stream, er) {
      var state = stream._writableState;
      var sync = state.sync;
      var cb = state.writecb;
      if (typeof cb !== "function")
        throw new ERR_MULTIPLE_CALLBACK();
      onwriteStateUpdate(state);
      if (er)
        onwriteError(stream, state, sync, er, cb);
      else {
        var finished = needFinish(state) || stream.destroyed;
        if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
          clearBuffer(stream, state);
        }
        if (sync) {
          process.nextTick(afterWrite, stream, state, finished, cb);
        } else {
          afterWrite(stream, state, finished, cb);
        }
      }
    }
    function afterWrite(stream, state, finished, cb) {
      if (!finished)
        onwriteDrain(stream, state);
      state.pendingcb--;
      cb();
      finishMaybe(stream, state);
    }
    function onwriteDrain(stream, state) {
      if (state.length === 0 && state.needDrain) {
        state.needDrain = false;
        stream.emit("drain");
      }
    }
    function clearBuffer(stream, state) {
      state.bufferProcessing = true;
      var entry = state.bufferedRequest;
      if (stream._writev && entry && entry.next) {
        var l = state.bufferedRequestCount;
        var buffer = new Array(l);
        var holder = state.corkedRequestsFree;
        holder.entry = entry;
        var count = 0;
        var allBuffers = true;
        while (entry) {
          buffer[count] = entry;
          if (!entry.isBuf)
            allBuffers = false;
          entry = entry.next;
          count += 1;
        }
        buffer.allBuffers = allBuffers;
        doWrite(stream, state, true, state.length, buffer, "", holder.finish);
        state.pendingcb++;
        state.lastBufferedRequest = null;
        if (holder.next) {
          state.corkedRequestsFree = holder.next;
          holder.next = null;
        } else {
          state.corkedRequestsFree = new CorkedRequest(state);
        }
        state.bufferedRequestCount = 0;
      } else {
        while (entry) {
          var chunk = entry.chunk;
          var encoding = entry.encoding;
          var cb = entry.callback;
          var len = state.objectMode ? 1 : chunk.length;
          doWrite(stream, state, false, len, chunk, encoding, cb);
          entry = entry.next;
          state.bufferedRequestCount--;
          if (state.writing) {
            break;
          }
        }
        if (entry === null)
          state.lastBufferedRequest = null;
      }
      state.bufferedRequest = entry;
      state.bufferProcessing = false;
    }
    Writable.prototype._write = function(chunk, encoding, cb) {
      cb(new ERR_METHOD_NOT_IMPLEMENTED("_write()"));
    };
    Writable.prototype._writev = null;
    Writable.prototype.end = function(chunk, encoding, cb) {
      var state = this._writableState;
      if (typeof chunk === "function") {
        cb = chunk;
        chunk = null;
        encoding = null;
      } else if (typeof encoding === "function") {
        cb = encoding;
        encoding = null;
      }
      if (chunk !== null && chunk !== void 0)
        this.write(chunk, encoding);
      if (state.corked) {
        state.corked = 1;
        this.uncork();
      }
      if (!state.ending)
        endWritable(this, state, cb);
      return this;
    };
    Object.defineProperty(Writable.prototype, "writableLength", {
      enumerable: false,
      get: function get() {
        return this._writableState.length;
      }
    });
    function needFinish(state) {
      return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
    }
    function callFinal(stream, state) {
      stream._final(function(err) {
        state.pendingcb--;
        if (err) {
          errorOrDestroy(stream, err);
        }
        state.prefinished = true;
        stream.emit("prefinish");
        finishMaybe(stream, state);
      });
    }
    function prefinish(stream, state) {
      if (!state.prefinished && !state.finalCalled) {
        if (typeof stream._final === "function" && !state.destroyed) {
          state.pendingcb++;
          state.finalCalled = true;
          process.nextTick(callFinal, stream, state);
        } else {
          state.prefinished = true;
          stream.emit("prefinish");
        }
      }
    }
    function finishMaybe(stream, state) {
      var need = needFinish(state);
      if (need) {
        prefinish(stream, state);
        if (state.pendingcb === 0) {
          state.finished = true;
          stream.emit("finish");
          if (state.autoDestroy) {
            var rState = stream._readableState;
            if (!rState || rState.autoDestroy && rState.endEmitted) {
              stream.destroy();
            }
          }
        }
      }
      return need;
    }
    function endWritable(stream, state, cb) {
      state.ending = true;
      finishMaybe(stream, state);
      if (cb) {
        if (state.finished)
          process.nextTick(cb);
        else
          stream.once("finish", cb);
      }
      state.ended = true;
      stream.writable = false;
    }
    function onCorkedFinish(corkReq, state, err) {
      var entry = corkReq.entry;
      corkReq.entry = null;
      while (entry) {
        var cb = entry.callback;
        state.pendingcb--;
        cb(err);
        entry = entry.next;
      }
      state.corkedRequestsFree.next = corkReq;
    }
    Object.defineProperty(Writable.prototype, "destroyed", {
      enumerable: false,
      get: function get() {
        if (this._writableState === void 0) {
          return false;
        }
        return this._writableState.destroyed;
      },
      set: function set(value2) {
        if (!this._writableState) {
          return;
        }
        this._writableState.destroyed = value2;
      }
    });
    Writable.prototype.destroy = destroyImpl.destroy;
    Writable.prototype._undestroy = destroyImpl.undestroy;
    Writable.prototype._destroy = function(err, cb) {
      cb(err);
    };
  }
});

// node_modules/.pnpm/readable-stream@3.6.0/node_modules/readable-stream/lib/_stream_duplex.js
var require_stream_duplex = __commonJS({
  "node_modules/.pnpm/readable-stream@3.6.0/node_modules/readable-stream/lib/_stream_duplex.js"(exports2, module2) {
    "use strict";
    var objectKeys = Object.keys || function(obj) {
      var keys2 = [];
      for (var key in obj) {
        keys2.push(key);
      }
      return keys2;
    };
    module2.exports = Duplex;
    var Readable = require_stream_readable();
    var Writable = require_stream_writable();
    require_inherits()(Duplex, Readable);
    {
      keys = objectKeys(Writable.prototype);
      for (v = 0; v < keys.length; v++) {
        method = keys[v];
        if (!Duplex.prototype[method])
          Duplex.prototype[method] = Writable.prototype[method];
      }
    }
    var keys;
    var method;
    var v;
    function Duplex(options) {
      if (!(this instanceof Duplex))
        return new Duplex(options);
      Readable.call(this, options);
      Writable.call(this, options);
      this.allowHalfOpen = true;
      if (options) {
        if (options.readable === false)
          this.readable = false;
        if (options.writable === false)
          this.writable = false;
        if (options.allowHalfOpen === false) {
          this.allowHalfOpen = false;
          this.once("end", onend);
        }
      }
    }
    Object.defineProperty(Duplex.prototype, "writableHighWaterMark", {
      enumerable: false,
      get: function get() {
        return this._writableState.highWaterMark;
      }
    });
    Object.defineProperty(Duplex.prototype, "writableBuffer", {
      enumerable: false,
      get: function get() {
        return this._writableState && this._writableState.getBuffer();
      }
    });
    Object.defineProperty(Duplex.prototype, "writableLength", {
      enumerable: false,
      get: function get() {
        return this._writableState.length;
      }
    });
    function onend() {
      if (this._writableState.ended)
        return;
      process.nextTick(onEndNT, this);
    }
    function onEndNT(self2) {
      self2.end();
    }
    Object.defineProperty(Duplex.prototype, "destroyed", {
      enumerable: false,
      get: function get() {
        if (this._readableState === void 0 || this._writableState === void 0) {
          return false;
        }
        return this._readableState.destroyed && this._writableState.destroyed;
      },
      set: function set(value2) {
        if (this._readableState === void 0 || this._writableState === void 0) {
          return;
        }
        this._readableState.destroyed = value2;
        this._writableState.destroyed = value2;
      }
    });
  }
});

// node_modules/.pnpm/string_decoder@1.3.0/node_modules/string_decoder/lib/string_decoder.js
var require_string_decoder = __commonJS({
  "node_modules/.pnpm/string_decoder@1.3.0/node_modules/string_decoder/lib/string_decoder.js"(exports2) {
    "use strict";
    var Buffer2 = require_safe_buffer().Buffer;
    var isEncoding = Buffer2.isEncoding || function(encoding) {
      encoding = "" + encoding;
      switch (encoding && encoding.toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
        case "raw":
          return true;
        default:
          return false;
      }
    };
    function _normalizeEncoding(enc) {
      if (!enc)
        return "utf8";
      var retried;
      while (true) {
        switch (enc) {
          case "utf8":
          case "utf-8":
            return "utf8";
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return "utf16le";
          case "latin1":
          case "binary":
            return "latin1";
          case "base64":
          case "ascii":
          case "hex":
            return enc;
          default:
            if (retried)
              return;
            enc = ("" + enc).toLowerCase();
            retried = true;
        }
      }
    }
    function normalizeEncoding(enc) {
      var nenc = _normalizeEncoding(enc);
      if (typeof nenc !== "string" && (Buffer2.isEncoding === isEncoding || !isEncoding(enc)))
        throw new Error("Unknown encoding: " + enc);
      return nenc || enc;
    }
    exports2.StringDecoder = StringDecoder;
    function StringDecoder(encoding) {
      this.encoding = normalizeEncoding(encoding);
      var nb;
      switch (this.encoding) {
        case "utf16le":
          this.text = utf16Text;
          this.end = utf16End;
          nb = 4;
          break;
        case "utf8":
          this.fillLast = utf8FillLast;
          nb = 4;
          break;
        case "base64":
          this.text = base64Text;
          this.end = base64End;
          nb = 3;
          break;
        default:
          this.write = simpleWrite;
          this.end = simpleEnd;
          return;
      }
      this.lastNeed = 0;
      this.lastTotal = 0;
      this.lastChar = Buffer2.allocUnsafe(nb);
    }
    StringDecoder.prototype.write = function(buf) {
      if (buf.length === 0)
        return "";
      var r;
      var i2;
      if (this.lastNeed) {
        r = this.fillLast(buf);
        if (r === void 0)
          return "";
        i2 = this.lastNeed;
        this.lastNeed = 0;
      } else {
        i2 = 0;
      }
      if (i2 < buf.length)
        return r ? r + this.text(buf, i2) : this.text(buf, i2);
      return r || "";
    };
    StringDecoder.prototype.end = utf8End;
    StringDecoder.prototype.text = utf8Text;
    StringDecoder.prototype.fillLast = function(buf) {
      if (this.lastNeed <= buf.length) {
        buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
        return this.lastChar.toString(this.encoding, 0, this.lastTotal);
      }
      buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
      this.lastNeed -= buf.length;
    };
    function utf8CheckByte(byte) {
      if (byte <= 127)
        return 0;
      else if (byte >> 5 === 6)
        return 2;
      else if (byte >> 4 === 14)
        return 3;
      else if (byte >> 3 === 30)
        return 4;
      return byte >> 6 === 2 ? -1 : -2;
    }
    function utf8CheckIncomplete(self2, buf, i2) {
      var j = buf.length - 1;
      if (j < i2)
        return 0;
      var nb = utf8CheckByte(buf[j]);
      if (nb >= 0) {
        if (nb > 0)
          self2.lastNeed = nb - 1;
        return nb;
      }
      if (--j < i2 || nb === -2)
        return 0;
      nb = utf8CheckByte(buf[j]);
      if (nb >= 0) {
        if (nb > 0)
          self2.lastNeed = nb - 2;
        return nb;
      }
      if (--j < i2 || nb === -2)
        return 0;
      nb = utf8CheckByte(buf[j]);
      if (nb >= 0) {
        if (nb > 0) {
          if (nb === 2)
            nb = 0;
          else
            self2.lastNeed = nb - 3;
        }
        return nb;
      }
      return 0;
    }
    function utf8CheckExtraBytes(self2, buf, p) {
      if ((buf[0] & 192) !== 128) {
        self2.lastNeed = 0;
        return "\uFFFD";
      }
      if (self2.lastNeed > 1 && buf.length > 1) {
        if ((buf[1] & 192) !== 128) {
          self2.lastNeed = 1;
          return "\uFFFD";
        }
        if (self2.lastNeed > 2 && buf.length > 2) {
          if ((buf[2] & 192) !== 128) {
            self2.lastNeed = 2;
            return "\uFFFD";
          }
        }
      }
    }
    function utf8FillLast(buf) {
      var p = this.lastTotal - this.lastNeed;
      var r = utf8CheckExtraBytes(this, buf, p);
      if (r !== void 0)
        return r;
      if (this.lastNeed <= buf.length) {
        buf.copy(this.lastChar, p, 0, this.lastNeed);
        return this.lastChar.toString(this.encoding, 0, this.lastTotal);
      }
      buf.copy(this.lastChar, p, 0, buf.length);
      this.lastNeed -= buf.length;
    }
    function utf8Text(buf, i2) {
      var total = utf8CheckIncomplete(this, buf, i2);
      if (!this.lastNeed)
        return buf.toString("utf8", i2);
      this.lastTotal = total;
      var end = buf.length - (total - this.lastNeed);
      buf.copy(this.lastChar, 0, end);
      return buf.toString("utf8", i2, end);
    }
    function utf8End(buf) {
      var r = buf && buf.length ? this.write(buf) : "";
      if (this.lastNeed)
        return r + "\uFFFD";
      return r;
    }
    function utf16Text(buf, i2) {
      if ((buf.length - i2) % 2 === 0) {
        var r = buf.toString("utf16le", i2);
        if (r) {
          var c = r.charCodeAt(r.length - 1);
          if (c >= 55296 && c <= 56319) {
            this.lastNeed = 2;
            this.lastTotal = 4;
            this.lastChar[0] = buf[buf.length - 2];
            this.lastChar[1] = buf[buf.length - 1];
            return r.slice(0, -1);
          }
        }
        return r;
      }
      this.lastNeed = 1;
      this.lastTotal = 2;
      this.lastChar[0] = buf[buf.length - 1];
      return buf.toString("utf16le", i2, buf.length - 1);
    }
    function utf16End(buf) {
      var r = buf && buf.length ? this.write(buf) : "";
      if (this.lastNeed) {
        var end = this.lastTotal - this.lastNeed;
        return r + this.lastChar.toString("utf16le", 0, end);
      }
      return r;
    }
    function base64Text(buf, i2) {
      var n = (buf.length - i2) % 3;
      if (n === 0)
        return buf.toString("base64", i2);
      this.lastNeed = 3 - n;
      this.lastTotal = 3;
      if (n === 1) {
        this.lastChar[0] = buf[buf.length - 1];
      } else {
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
      }
      return buf.toString("base64", i2, buf.length - n);
    }
    function base64End(buf) {
      var r = buf && buf.length ? this.write(buf) : "";
      if (this.lastNeed)
        return r + this.lastChar.toString("base64", 0, 3 - this.lastNeed);
      return r;
    }
    function simpleWrite(buf) {
      return buf.toString(this.encoding);
    }
    function simpleEnd(buf) {
      return buf && buf.length ? this.write(buf) : "";
    }
  }
});

// node_modules/.pnpm/readable-stream@3.6.0/node_modules/readable-stream/lib/internal/streams/end-of-stream.js
var require_end_of_stream = __commonJS({
  "node_modules/.pnpm/readable-stream@3.6.0/node_modules/readable-stream/lib/internal/streams/end-of-stream.js"(exports2, module2) {
    "use strict";
    var ERR_STREAM_PREMATURE_CLOSE = require_errors().codes.ERR_STREAM_PREMATURE_CLOSE;
    function once(callback) {
      var called = false;
      return function() {
        if (called)
          return;
        called = true;
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        callback.apply(this, args);
      };
    }
    function noop() {
    }
    function isRequest(stream) {
      return stream.setHeader && typeof stream.abort === "function";
    }
    function eos(stream, opts, callback) {
      if (typeof opts === "function")
        return eos(stream, null, opts);
      if (!opts)
        opts = {};
      callback = once(callback || noop);
      var readable = opts.readable || opts.readable !== false && stream.readable;
      var writable = opts.writable || opts.writable !== false && stream.writable;
      var onlegacyfinish = function onlegacyfinish2() {
        if (!stream.writable)
          onfinish();
      };
      var writableEnded = stream._writableState && stream._writableState.finished;
      var onfinish = function onfinish2() {
        writable = false;
        writableEnded = true;
        if (!readable)
          callback.call(stream);
      };
      var readableEnded = stream._readableState && stream._readableState.endEmitted;
      var onend = function onend2() {
        readable = false;
        readableEnded = true;
        if (!writable)
          callback.call(stream);
      };
      var onerror = function onerror2(err) {
        callback.call(stream, err);
      };
      var onclose = function onclose2() {
        var err;
        if (readable && !readableEnded) {
          if (!stream._readableState || !stream._readableState.ended)
            err = new ERR_STREAM_PREMATURE_CLOSE();
          return callback.call(stream, err);
        }
        if (writable && !writableEnded) {
          if (!stream._writableState || !stream._writableState.ended)
            err = new ERR_STREAM_PREMATURE_CLOSE();
          return callback.call(stream, err);
        }
      };
      var onrequest = function onrequest2() {
        stream.req.on("finish", onfinish);
      };
      if (isRequest(stream)) {
        stream.on("complete", onfinish);
        stream.on("abort", onclose);
        if (stream.req)
          onrequest();
        else
          stream.on("request", onrequest);
      } else if (writable && !stream._writableState) {
        stream.on("end", onlegacyfinish);
        stream.on("close", onlegacyfinish);
      }
      stream.on("end", onend);
      stream.on("finish", onfinish);
      if (opts.error !== false)
        stream.on("error", onerror);
      stream.on("close", onclose);
      return function() {
        stream.removeListener("complete", onfinish);
        stream.removeListener("abort", onclose);
        stream.removeListener("request", onrequest);
        if (stream.req)
          stream.req.removeListener("finish", onfinish);
        stream.removeListener("end", onlegacyfinish);
        stream.removeListener("close", onlegacyfinish);
        stream.removeListener("finish", onfinish);
        stream.removeListener("end", onend);
        stream.removeListener("error", onerror);
        stream.removeListener("close", onclose);
      };
    }
    module2.exports = eos;
  }
});

// node_modules/.pnpm/readable-stream@3.6.0/node_modules/readable-stream/lib/internal/streams/async_iterator.js
var require_async_iterator = __commonJS({
  "node_modules/.pnpm/readable-stream@3.6.0/node_modules/readable-stream/lib/internal/streams/async_iterator.js"(exports2, module2) {
    "use strict";
    var _Object$setPrototypeO;
    function _defineProperty(obj, key, value2) {
      if (key in obj) {
        Object.defineProperty(obj, key, { value: value2, enumerable: true, configurable: true, writable: true });
      } else {
        obj[key] = value2;
      }
      return obj;
    }
    var finished = require_end_of_stream();
    var kLastResolve = Symbol("lastResolve");
    var kLastReject = Symbol("lastReject");
    var kError = Symbol("error");
    var kEnded = Symbol("ended");
    var kLastPromise = Symbol("lastPromise");
    var kHandlePromise = Symbol("handlePromise");
    var kStream = Symbol("stream");
    function createIterResult(value2, done) {
      return {
        value: value2,
        done
      };
    }
    function readAndResolve(iter) {
      var resolve = iter[kLastResolve];
      if (resolve !== null) {
        var data = iter[kStream].read();
        if (data !== null) {
          iter[kLastPromise] = null;
          iter[kLastResolve] = null;
          iter[kLastReject] = null;
          resolve(createIterResult(data, false));
        }
      }
    }
    function onReadable(iter) {
      process.nextTick(readAndResolve, iter);
    }
    function wrapForNext(lastPromise, iter) {
      return function(resolve, reject) {
        lastPromise.then(function() {
          if (iter[kEnded]) {
            resolve(createIterResult(void 0, true));
            return;
          }
          iter[kHandlePromise](resolve, reject);
        }, reject);
      };
    }
    var AsyncIteratorPrototype = Object.getPrototypeOf(function() {
    });
    var ReadableStreamAsyncIteratorPrototype = Object.setPrototypeOf((_Object$setPrototypeO = {
      get stream() {
        return this[kStream];
      },
      next: function next() {
        var _this = this;
        var error = this[kError];
        if (error !== null) {
          return Promise.reject(error);
        }
        if (this[kEnded]) {
          return Promise.resolve(createIterResult(void 0, true));
        }
        if (this[kStream].destroyed) {
          return new Promise(function(resolve, reject) {
            process.nextTick(function() {
              if (_this[kError]) {
                reject(_this[kError]);
              } else {
                resolve(createIterResult(void 0, true));
              }
            });
          });
        }
        var lastPromise = this[kLastPromise];
        var promise;
        if (lastPromise) {
          promise = new Promise(wrapForNext(lastPromise, this));
        } else {
          var data = this[kStream].read();
          if (data !== null) {
            return Promise.resolve(createIterResult(data, false));
          }
          promise = new Promise(this[kHandlePromise]);
        }
        this[kLastPromise] = promise;
        return promise;
      }
    }, _defineProperty(_Object$setPrototypeO, Symbol.asyncIterator, function() {
      return this;
    }), _defineProperty(_Object$setPrototypeO, "return", function _return() {
      var _this2 = this;
      return new Promise(function(resolve, reject) {
        _this2[kStream].destroy(null, function(err) {
          if (err) {
            reject(err);
            return;
          }
          resolve(createIterResult(void 0, true));
        });
      });
    }), _Object$setPrototypeO), AsyncIteratorPrototype);
    var createReadableStreamAsyncIterator = function createReadableStreamAsyncIterator2(stream) {
      var _Object$create;
      var iterator = Object.create(ReadableStreamAsyncIteratorPrototype, (_Object$create = {}, _defineProperty(_Object$create, kStream, {
        value: stream,
        writable: true
      }), _defineProperty(_Object$create, kLastResolve, {
        value: null,
        writable: true
      }), _defineProperty(_Object$create, kLastReject, {
        value: null,
        writable: true
      }), _defineProperty(_Object$create, kError, {
        value: null,
        writable: true
      }), _defineProperty(_Object$create, kEnded, {
        value: stream._readableState.endEmitted,
        writable: true
      }), _defineProperty(_Object$create, kHandlePromise, {
        value: function value2(resolve, reject) {
          var data = iterator[kStream].read();
          if (data) {
            iterator[kLastPromise] = null;
            iterator[kLastResolve] = null;
            iterator[kLastReject] = null;
            resolve(createIterResult(data, false));
          } else {
            iterator[kLastResolve] = resolve;
            iterator[kLastReject] = reject;
          }
        },
        writable: true
      }), _Object$create));
      iterator[kLastPromise] = null;
      finished(stream, function(err) {
        if (err && err.code !== "ERR_STREAM_PREMATURE_CLOSE") {
          var reject = iterator[kLastReject];
          if (reject !== null) {
            iterator[kLastPromise] = null;
            iterator[kLastResolve] = null;
            iterator[kLastReject] = null;
            reject(err);
          }
          iterator[kError] = err;
          return;
        }
        var resolve = iterator[kLastResolve];
        if (resolve !== null) {
          iterator[kLastPromise] = null;
          iterator[kLastResolve] = null;
          iterator[kLastReject] = null;
          resolve(createIterResult(void 0, true));
        }
        iterator[kEnded] = true;
      });
      stream.on("readable", onReadable.bind(null, iterator));
      return iterator;
    };
    module2.exports = createReadableStreamAsyncIterator;
  }
});

// node_modules/.pnpm/readable-stream@3.6.0/node_modules/readable-stream/lib/internal/streams/from.js
var require_from = __commonJS({
  "node_modules/.pnpm/readable-stream@3.6.0/node_modules/readable-stream/lib/internal/streams/from.js"(exports2, module2) {
    "use strict";
    function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg2) {
      try {
        var info = gen[key](arg2);
        var value2 = info.value;
      } catch (error) {
        reject(error);
        return;
      }
      if (info.done) {
        resolve(value2);
      } else {
        Promise.resolve(value2).then(_next, _throw);
      }
    }
    function _asyncToGenerator(fn) {
      return function() {
        var self2 = this, args = arguments;
        return new Promise(function(resolve, reject) {
          var gen = fn.apply(self2, args);
          function _next(value2) {
            asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value2);
          }
          function _throw(err) {
            asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
          }
          _next(void 0);
        });
      };
    }
    function ownKeys(object, enumerableOnly) {
      var keys = Object.keys(object);
      if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly)
          symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
          });
        keys.push.apply(keys, symbols);
      }
      return keys;
    }
    function _objectSpread(target) {
      for (var i2 = 1; i2 < arguments.length; i2++) {
        var source = arguments[i2] != null ? arguments[i2] : {};
        if (i2 % 2) {
          ownKeys(Object(source), true).forEach(function(key) {
            _defineProperty(target, key, source[key]);
          });
        } else if (Object.getOwnPropertyDescriptors) {
          Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
        } else {
          ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
          });
        }
      }
      return target;
    }
    function _defineProperty(obj, key, value2) {
      if (key in obj) {
        Object.defineProperty(obj, key, { value: value2, enumerable: true, configurable: true, writable: true });
      } else {
        obj[key] = value2;
      }
      return obj;
    }
    var ERR_INVALID_ARG_TYPE = require_errors().codes.ERR_INVALID_ARG_TYPE;
    function from(Readable, iterable, opts) {
      var iterator;
      if (iterable && typeof iterable.next === "function") {
        iterator = iterable;
      } else if (iterable && iterable[Symbol.asyncIterator])
        iterator = iterable[Symbol.asyncIterator]();
      else if (iterable && iterable[Symbol.iterator])
        iterator = iterable[Symbol.iterator]();
      else
        throw new ERR_INVALID_ARG_TYPE("iterable", ["Iterable"], iterable);
      var readable = new Readable(_objectSpread({
        objectMode: true
      }, opts));
      var reading = false;
      readable._read = function() {
        if (!reading) {
          reading = true;
          next();
        }
      };
      function next() {
        return _next2.apply(this, arguments);
      }
      function _next2() {
        _next2 = _asyncToGenerator(function* () {
          try {
            var _ref = yield iterator.next(), value2 = _ref.value, done = _ref.done;
            if (done) {
              readable.push(null);
            } else if (readable.push(yield value2)) {
              next();
            } else {
              reading = false;
            }
          } catch (err) {
            readable.destroy(err);
          }
        });
        return _next2.apply(this, arguments);
      }
      return readable;
    }
    module2.exports = from;
  }
});

// node_modules/.pnpm/readable-stream@3.6.0/node_modules/readable-stream/lib/_stream_readable.js
var require_stream_readable = __commonJS({
  "node_modules/.pnpm/readable-stream@3.6.0/node_modules/readable-stream/lib/_stream_readable.js"(exports2, module2) {
    "use strict";
    module2.exports = Readable;
    var Duplex;
    Readable.ReadableState = ReadableState;
    var EE = __require("events").EventEmitter;
    var EElistenerCount = function EElistenerCount2(emitter, type) {
      return emitter.listeners(type).length;
    };
    var Stream = require_stream2();
    var Buffer2 = __require("buffer").Buffer;
    var OurUint8Array = global.Uint8Array || function() {
    };
    function _uint8ArrayToBuffer(chunk) {
      return Buffer2.from(chunk);
    }
    function _isUint8Array(obj) {
      return Buffer2.isBuffer(obj) || obj instanceof OurUint8Array;
    }
    var debugUtil = __require("util");
    var debug;
    if (debugUtil && debugUtil.debuglog) {
      debug = debugUtil.debuglog("stream");
    } else {
      debug = function debug2() {
      };
    }
    var BufferList = require_buffer_list();
    var destroyImpl = require_destroy();
    var _require = require_state();
    var getHighWaterMark = _require.getHighWaterMark;
    var _require$codes = require_errors().codes;
    var ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE;
    var ERR_STREAM_PUSH_AFTER_EOF = _require$codes.ERR_STREAM_PUSH_AFTER_EOF;
    var ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED;
    var ERR_STREAM_UNSHIFT_AFTER_END_EVENT = _require$codes.ERR_STREAM_UNSHIFT_AFTER_END_EVENT;
    var StringDecoder;
    var createReadableStreamAsyncIterator;
    var from;
    require_inherits()(Readable, Stream);
    var errorOrDestroy = destroyImpl.errorOrDestroy;
    var kProxyEvents = ["error", "close", "destroy", "pause", "resume"];
    function prependListener(emitter, event, fn) {
      if (typeof emitter.prependListener === "function")
        return emitter.prependListener(event, fn);
      if (!emitter._events || !emitter._events[event])
        emitter.on(event, fn);
      else if (Array.isArray(emitter._events[event]))
        emitter._events[event].unshift(fn);
      else
        emitter._events[event] = [fn, emitter._events[event]];
    }
    function ReadableState(options, stream, isDuplex) {
      Duplex = Duplex || require_stream_duplex();
      options = options || {};
      if (typeof isDuplex !== "boolean")
        isDuplex = stream instanceof Duplex;
      this.objectMode = !!options.objectMode;
      if (isDuplex)
        this.objectMode = this.objectMode || !!options.readableObjectMode;
      this.highWaterMark = getHighWaterMark(this, options, "readableHighWaterMark", isDuplex);
      this.buffer = new BufferList();
      this.length = 0;
      this.pipes = null;
      this.pipesCount = 0;
      this.flowing = null;
      this.ended = false;
      this.endEmitted = false;
      this.reading = false;
      this.sync = true;
      this.needReadable = false;
      this.emittedReadable = false;
      this.readableListening = false;
      this.resumeScheduled = false;
      this.paused = true;
      this.emitClose = options.emitClose !== false;
      this.autoDestroy = !!options.autoDestroy;
      this.destroyed = false;
      this.defaultEncoding = options.defaultEncoding || "utf8";
      this.awaitDrain = 0;
      this.readingMore = false;
      this.decoder = null;
      this.encoding = null;
      if (options.encoding) {
        if (!StringDecoder)
          StringDecoder = require_string_decoder().StringDecoder;
        this.decoder = new StringDecoder(options.encoding);
        this.encoding = options.encoding;
      }
    }
    function Readable(options) {
      Duplex = Duplex || require_stream_duplex();
      if (!(this instanceof Readable))
        return new Readable(options);
      var isDuplex = this instanceof Duplex;
      this._readableState = new ReadableState(options, this, isDuplex);
      this.readable = true;
      if (options) {
        if (typeof options.read === "function")
          this._read = options.read;
        if (typeof options.destroy === "function")
          this._destroy = options.destroy;
      }
      Stream.call(this);
    }
    Object.defineProperty(Readable.prototype, "destroyed", {
      enumerable: false,
      get: function get() {
        if (this._readableState === void 0) {
          return false;
        }
        return this._readableState.destroyed;
      },
      set: function set(value2) {
        if (!this._readableState) {
          return;
        }
        this._readableState.destroyed = value2;
      }
    });
    Readable.prototype.destroy = destroyImpl.destroy;
    Readable.prototype._undestroy = destroyImpl.undestroy;
    Readable.prototype._destroy = function(err, cb) {
      cb(err);
    };
    Readable.prototype.push = function(chunk, encoding) {
      var state = this._readableState;
      var skipChunkCheck;
      if (!state.objectMode) {
        if (typeof chunk === "string") {
          encoding = encoding || state.defaultEncoding;
          if (encoding !== state.encoding) {
            chunk = Buffer2.from(chunk, encoding);
            encoding = "";
          }
          skipChunkCheck = true;
        }
      } else {
        skipChunkCheck = true;
      }
      return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
    };
    Readable.prototype.unshift = function(chunk) {
      return readableAddChunk(this, chunk, null, true, false);
    };
    function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
      debug("readableAddChunk", chunk);
      var state = stream._readableState;
      if (chunk === null) {
        state.reading = false;
        onEofChunk(stream, state);
      } else {
        var er;
        if (!skipChunkCheck)
          er = chunkInvalid(state, chunk);
        if (er) {
          errorOrDestroy(stream, er);
        } else if (state.objectMode || chunk && chunk.length > 0) {
          if (typeof chunk !== "string" && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer2.prototype) {
            chunk = _uint8ArrayToBuffer(chunk);
          }
          if (addToFront) {
            if (state.endEmitted)
              errorOrDestroy(stream, new ERR_STREAM_UNSHIFT_AFTER_END_EVENT());
            else
              addChunk(stream, state, chunk, true);
          } else if (state.ended) {
            errorOrDestroy(stream, new ERR_STREAM_PUSH_AFTER_EOF());
          } else if (state.destroyed) {
            return false;
          } else {
            state.reading = false;
            if (state.decoder && !encoding) {
              chunk = state.decoder.write(chunk);
              if (state.objectMode || chunk.length !== 0)
                addChunk(stream, state, chunk, false);
              else
                maybeReadMore(stream, state);
            } else {
              addChunk(stream, state, chunk, false);
            }
          }
        } else if (!addToFront) {
          state.reading = false;
          maybeReadMore(stream, state);
        }
      }
      return !state.ended && (state.length < state.highWaterMark || state.length === 0);
    }
    function addChunk(stream, state, chunk, addToFront) {
      if (state.flowing && state.length === 0 && !state.sync) {
        state.awaitDrain = 0;
        stream.emit("data", chunk);
      } else {
        state.length += state.objectMode ? 1 : chunk.length;
        if (addToFront)
          state.buffer.unshift(chunk);
        else
          state.buffer.push(chunk);
        if (state.needReadable)
          emitReadable(stream);
      }
      maybeReadMore(stream, state);
    }
    function chunkInvalid(state, chunk) {
      var er;
      if (!_isUint8Array(chunk) && typeof chunk !== "string" && chunk !== void 0 && !state.objectMode) {
        er = new ERR_INVALID_ARG_TYPE("chunk", ["string", "Buffer", "Uint8Array"], chunk);
      }
      return er;
    }
    Readable.prototype.isPaused = function() {
      return this._readableState.flowing === false;
    };
    Readable.prototype.setEncoding = function(enc) {
      if (!StringDecoder)
        StringDecoder = require_string_decoder().StringDecoder;
      var decoder = new StringDecoder(enc);
      this._readableState.decoder = decoder;
      this._readableState.encoding = this._readableState.decoder.encoding;
      var p = this._readableState.buffer.head;
      var content = "";
      while (p !== null) {
        content += decoder.write(p.data);
        p = p.next;
      }
      this._readableState.buffer.clear();
      if (content !== "")
        this._readableState.buffer.push(content);
      this._readableState.length = content.length;
      return this;
    };
    var MAX_HWM = 1073741824;
    function computeNewHighWaterMark(n) {
      if (n >= MAX_HWM) {
        n = MAX_HWM;
      } else {
        n--;
        n |= n >>> 1;
        n |= n >>> 2;
        n |= n >>> 4;
        n |= n >>> 8;
        n |= n >>> 16;
        n++;
      }
      return n;
    }
    function howMuchToRead(n, state) {
      if (n <= 0 || state.length === 0 && state.ended)
        return 0;
      if (state.objectMode)
        return 1;
      if (n !== n) {
        if (state.flowing && state.length)
          return state.buffer.head.data.length;
        else
          return state.length;
      }
      if (n > state.highWaterMark)
        state.highWaterMark = computeNewHighWaterMark(n);
      if (n <= state.length)
        return n;
      if (!state.ended) {
        state.needReadable = true;
        return 0;
      }
      return state.length;
    }
    Readable.prototype.read = function(n) {
      debug("read", n);
      n = parseInt(n, 10);
      var state = this._readableState;
      var nOrig = n;
      if (n !== 0)
        state.emittedReadable = false;
      if (n === 0 && state.needReadable && ((state.highWaterMark !== 0 ? state.length >= state.highWaterMark : state.length > 0) || state.ended)) {
        debug("read: emitReadable", state.length, state.ended);
        if (state.length === 0 && state.ended)
          endReadable(this);
        else
          emitReadable(this);
        return null;
      }
      n = howMuchToRead(n, state);
      if (n === 0 && state.ended) {
        if (state.length === 0)
          endReadable(this);
        return null;
      }
      var doRead = state.needReadable;
      debug("need readable", doRead);
      if (state.length === 0 || state.length - n < state.highWaterMark) {
        doRead = true;
        debug("length less than watermark", doRead);
      }
      if (state.ended || state.reading) {
        doRead = false;
        debug("reading or ended", doRead);
      } else if (doRead) {
        debug("do read");
        state.reading = true;
        state.sync = true;
        if (state.length === 0)
          state.needReadable = true;
        this._read(state.highWaterMark);
        state.sync = false;
        if (!state.reading)
          n = howMuchToRead(nOrig, state);
      }
      var ret;
      if (n > 0)
        ret = fromList(n, state);
      else
        ret = null;
      if (ret === null) {
        state.needReadable = state.length <= state.highWaterMark;
        n = 0;
      } else {
        state.length -= n;
        state.awaitDrain = 0;
      }
      if (state.length === 0) {
        if (!state.ended)
          state.needReadable = true;
        if (nOrig !== n && state.ended)
          endReadable(this);
      }
      if (ret !== null)
        this.emit("data", ret);
      return ret;
    };
    function onEofChunk(stream, state) {
      debug("onEofChunk");
      if (state.ended)
        return;
      if (state.decoder) {
        var chunk = state.decoder.end();
        if (chunk && chunk.length) {
          state.buffer.push(chunk);
          state.length += state.objectMode ? 1 : chunk.length;
        }
      }
      state.ended = true;
      if (state.sync) {
        emitReadable(stream);
      } else {
        state.needReadable = false;
        if (!state.emittedReadable) {
          state.emittedReadable = true;
          emitReadable_(stream);
        }
      }
    }
    function emitReadable(stream) {
      var state = stream._readableState;
      debug("emitReadable", state.needReadable, state.emittedReadable);
      state.needReadable = false;
      if (!state.emittedReadable) {
        debug("emitReadable", state.flowing);
        state.emittedReadable = true;
        process.nextTick(emitReadable_, stream);
      }
    }
    function emitReadable_(stream) {
      var state = stream._readableState;
      debug("emitReadable_", state.destroyed, state.length, state.ended);
      if (!state.destroyed && (state.length || state.ended)) {
        stream.emit("readable");
        state.emittedReadable = false;
      }
      state.needReadable = !state.flowing && !state.ended && state.length <= state.highWaterMark;
      flow(stream);
    }
    function maybeReadMore(stream, state) {
      if (!state.readingMore) {
        state.readingMore = true;
        process.nextTick(maybeReadMore_, stream, state);
      }
    }
    function maybeReadMore_(stream, state) {
      while (!state.reading && !state.ended && (state.length < state.highWaterMark || state.flowing && state.length === 0)) {
        var len = state.length;
        debug("maybeReadMore read 0");
        stream.read(0);
        if (len === state.length)
          break;
      }
      state.readingMore = false;
    }
    Readable.prototype._read = function(n) {
      errorOrDestroy(this, new ERR_METHOD_NOT_IMPLEMENTED("_read()"));
    };
    Readable.prototype.pipe = function(dest, pipeOpts) {
      var src = this;
      var state = this._readableState;
      switch (state.pipesCount) {
        case 0:
          state.pipes = dest;
          break;
        case 1:
          state.pipes = [state.pipes, dest];
          break;
        default:
          state.pipes.push(dest);
          break;
      }
      state.pipesCount += 1;
      debug("pipe count=%d opts=%j", state.pipesCount, pipeOpts);
      var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;
      var endFn = doEnd ? onend : unpipe;
      if (state.endEmitted)
        process.nextTick(endFn);
      else
        src.once("end", endFn);
      dest.on("unpipe", onunpipe);
      function onunpipe(readable, unpipeInfo) {
        debug("onunpipe");
        if (readable === src) {
          if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
            unpipeInfo.hasUnpiped = true;
            cleanup();
          }
        }
      }
      function onend() {
        debug("onend");
        dest.end();
      }
      var ondrain = pipeOnDrain(src);
      dest.on("drain", ondrain);
      var cleanedUp = false;
      function cleanup() {
        debug("cleanup");
        dest.removeListener("close", onclose);
        dest.removeListener("finish", onfinish);
        dest.removeListener("drain", ondrain);
        dest.removeListener("error", onerror);
        dest.removeListener("unpipe", onunpipe);
        src.removeListener("end", onend);
        src.removeListener("end", unpipe);
        src.removeListener("data", ondata);
        cleanedUp = true;
        if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain))
          ondrain();
      }
      src.on("data", ondata);
      function ondata(chunk) {
        debug("ondata");
        var ret = dest.write(chunk);
        debug("dest.write", ret);
        if (ret === false) {
          if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
            debug("false write response, pause", state.awaitDrain);
            state.awaitDrain++;
          }
          src.pause();
        }
      }
      function onerror(er) {
        debug("onerror", er);
        unpipe();
        dest.removeListener("error", onerror);
        if (EElistenerCount(dest, "error") === 0)
          errorOrDestroy(dest, er);
      }
      prependListener(dest, "error", onerror);
      function onclose() {
        dest.removeListener("finish", onfinish);
        unpipe();
      }
      dest.once("close", onclose);
      function onfinish() {
        debug("onfinish");
        dest.removeListener("close", onclose);
        unpipe();
      }
      dest.once("finish", onfinish);
      function unpipe() {
        debug("unpipe");
        src.unpipe(dest);
      }
      dest.emit("pipe", src);
      if (!state.flowing) {
        debug("pipe resume");
        src.resume();
      }
      return dest;
    };
    function pipeOnDrain(src) {
      return function pipeOnDrainFunctionResult() {
        var state = src._readableState;
        debug("pipeOnDrain", state.awaitDrain);
        if (state.awaitDrain)
          state.awaitDrain--;
        if (state.awaitDrain === 0 && EElistenerCount(src, "data")) {
          state.flowing = true;
          flow(src);
        }
      };
    }
    Readable.prototype.unpipe = function(dest) {
      var state = this._readableState;
      var unpipeInfo = {
        hasUnpiped: false
      };
      if (state.pipesCount === 0)
        return this;
      if (state.pipesCount === 1) {
        if (dest && dest !== state.pipes)
          return this;
        if (!dest)
          dest = state.pipes;
        state.pipes = null;
        state.pipesCount = 0;
        state.flowing = false;
        if (dest)
          dest.emit("unpipe", this, unpipeInfo);
        return this;
      }
      if (!dest) {
        var dests = state.pipes;
        var len = state.pipesCount;
        state.pipes = null;
        state.pipesCount = 0;
        state.flowing = false;
        for (var i2 = 0; i2 < len; i2++) {
          dests[i2].emit("unpipe", this, {
            hasUnpiped: false
          });
        }
        return this;
      }
      var index = indexOf(state.pipes, dest);
      if (index === -1)
        return this;
      state.pipes.splice(index, 1);
      state.pipesCount -= 1;
      if (state.pipesCount === 1)
        state.pipes = state.pipes[0];
      dest.emit("unpipe", this, unpipeInfo);
      return this;
    };
    Readable.prototype.on = function(ev, fn) {
      var res = Stream.prototype.on.call(this, ev, fn);
      var state = this._readableState;
      if (ev === "data") {
        state.readableListening = this.listenerCount("readable") > 0;
        if (state.flowing !== false)
          this.resume();
      } else if (ev === "readable") {
        if (!state.endEmitted && !state.readableListening) {
          state.readableListening = state.needReadable = true;
          state.flowing = false;
          state.emittedReadable = false;
          debug("on readable", state.length, state.reading);
          if (state.length) {
            emitReadable(this);
          } else if (!state.reading) {
            process.nextTick(nReadingNextTick, this);
          }
        }
      }
      return res;
    };
    Readable.prototype.addListener = Readable.prototype.on;
    Readable.prototype.removeListener = function(ev, fn) {
      var res = Stream.prototype.removeListener.call(this, ev, fn);
      if (ev === "readable") {
        process.nextTick(updateReadableListening, this);
      }
      return res;
    };
    Readable.prototype.removeAllListeners = function(ev) {
      var res = Stream.prototype.removeAllListeners.apply(this, arguments);
      if (ev === "readable" || ev === void 0) {
        process.nextTick(updateReadableListening, this);
      }
      return res;
    };
    function updateReadableListening(self2) {
      var state = self2._readableState;
      state.readableListening = self2.listenerCount("readable") > 0;
      if (state.resumeScheduled && !state.paused) {
        state.flowing = true;
      } else if (self2.listenerCount("data") > 0) {
        self2.resume();
      }
    }
    function nReadingNextTick(self2) {
      debug("readable nexttick read 0");
      self2.read(0);
    }
    Readable.prototype.resume = function() {
      var state = this._readableState;
      if (!state.flowing) {
        debug("resume");
        state.flowing = !state.readableListening;
        resume(this, state);
      }
      state.paused = false;
      return this;
    };
    function resume(stream, state) {
      if (!state.resumeScheduled) {
        state.resumeScheduled = true;
        process.nextTick(resume_, stream, state);
      }
    }
    function resume_(stream, state) {
      debug("resume", state.reading);
      if (!state.reading) {
        stream.read(0);
      }
      state.resumeScheduled = false;
      stream.emit("resume");
      flow(stream);
      if (state.flowing && !state.reading)
        stream.read(0);
    }
    Readable.prototype.pause = function() {
      debug("call pause flowing=%j", this._readableState.flowing);
      if (this._readableState.flowing !== false) {
        debug("pause");
        this._readableState.flowing = false;
        this.emit("pause");
      }
      this._readableState.paused = true;
      return this;
    };
    function flow(stream) {
      var state = stream._readableState;
      debug("flow", state.flowing);
      while (state.flowing && stream.read() !== null) {
        ;
      }
    }
    Readable.prototype.wrap = function(stream) {
      var _this = this;
      var state = this._readableState;
      var paused = false;
      stream.on("end", function() {
        debug("wrapped end");
        if (state.decoder && !state.ended) {
          var chunk = state.decoder.end();
          if (chunk && chunk.length)
            _this.push(chunk);
        }
        _this.push(null);
      });
      stream.on("data", function(chunk) {
        debug("wrapped data");
        if (state.decoder)
          chunk = state.decoder.write(chunk);
        if (state.objectMode && (chunk === null || chunk === void 0))
          return;
        else if (!state.objectMode && (!chunk || !chunk.length))
          return;
        var ret = _this.push(chunk);
        if (!ret) {
          paused = true;
          stream.pause();
        }
      });
      for (var i2 in stream) {
        if (this[i2] === void 0 && typeof stream[i2] === "function") {
          this[i2] = function methodWrap(method) {
            return function methodWrapReturnFunction() {
              return stream[method].apply(stream, arguments);
            };
          }(i2);
        }
      }
      for (var n = 0; n < kProxyEvents.length; n++) {
        stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
      }
      this._read = function(n2) {
        debug("wrapped _read", n2);
        if (paused) {
          paused = false;
          stream.resume();
        }
      };
      return this;
    };
    if (typeof Symbol === "function") {
      Readable.prototype[Symbol.asyncIterator] = function() {
        if (createReadableStreamAsyncIterator === void 0) {
          createReadableStreamAsyncIterator = require_async_iterator();
        }
        return createReadableStreamAsyncIterator(this);
      };
    }
    Object.defineProperty(Readable.prototype, "readableHighWaterMark", {
      enumerable: false,
      get: function get() {
        return this._readableState.highWaterMark;
      }
    });
    Object.defineProperty(Readable.prototype, "readableBuffer", {
      enumerable: false,
      get: function get() {
        return this._readableState && this._readableState.buffer;
      }
    });
    Object.defineProperty(Readable.prototype, "readableFlowing", {
      enumerable: false,
      get: function get() {
        return this._readableState.flowing;
      },
      set: function set(state) {
        if (this._readableState) {
          this._readableState.flowing = state;
        }
      }
    });
    Readable._fromList = fromList;
    Object.defineProperty(Readable.prototype, "readableLength", {
      enumerable: false,
      get: function get() {
        return this._readableState.length;
      }
    });
    function fromList(n, state) {
      if (state.length === 0)
        return null;
      var ret;
      if (state.objectMode)
        ret = state.buffer.shift();
      else if (!n || n >= state.length) {
        if (state.decoder)
          ret = state.buffer.join("");
        else if (state.buffer.length === 1)
          ret = state.buffer.first();
        else
          ret = state.buffer.concat(state.length);
        state.buffer.clear();
      } else {
        ret = state.buffer.consume(n, state.decoder);
      }
      return ret;
    }
    function endReadable(stream) {
      var state = stream._readableState;
      debug("endReadable", state.endEmitted);
      if (!state.endEmitted) {
        state.ended = true;
        process.nextTick(endReadableNT, state, stream);
      }
    }
    function endReadableNT(state, stream) {
      debug("endReadableNT", state.endEmitted, state.length);
      if (!state.endEmitted && state.length === 0) {
        state.endEmitted = true;
        stream.readable = false;
        stream.emit("end");
        if (state.autoDestroy) {
          var wState = stream._writableState;
          if (!wState || wState.autoDestroy && wState.finished) {
            stream.destroy();
          }
        }
      }
    }
    if (typeof Symbol === "function") {
      Readable.from = function(iterable, opts) {
        if (from === void 0) {
          from = require_from();
        }
        return from(Readable, iterable, opts);
      };
    }
    function indexOf(xs, x) {
      for (var i2 = 0, l = xs.length; i2 < l; i2++) {
        if (xs[i2] === x)
          return i2;
      }
      return -1;
    }
  }
});

// node_modules/.pnpm/readable-stream@3.6.0/node_modules/readable-stream/lib/_stream_transform.js
var require_stream_transform = __commonJS({
  "node_modules/.pnpm/readable-stream@3.6.0/node_modules/readable-stream/lib/_stream_transform.js"(exports2, module2) {
    "use strict";
    module2.exports = Transform;
    var _require$codes = require_errors().codes;
    var ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED;
    var ERR_MULTIPLE_CALLBACK = _require$codes.ERR_MULTIPLE_CALLBACK;
    var ERR_TRANSFORM_ALREADY_TRANSFORMING = _require$codes.ERR_TRANSFORM_ALREADY_TRANSFORMING;
    var ERR_TRANSFORM_WITH_LENGTH_0 = _require$codes.ERR_TRANSFORM_WITH_LENGTH_0;
    var Duplex = require_stream_duplex();
    require_inherits()(Transform, Duplex);
    function afterTransform(er, data) {
      var ts = this._transformState;
      ts.transforming = false;
      var cb = ts.writecb;
      if (cb === null) {
        return this.emit("error", new ERR_MULTIPLE_CALLBACK());
      }
      ts.writechunk = null;
      ts.writecb = null;
      if (data != null)
        this.push(data);
      cb(er);
      var rs = this._readableState;
      rs.reading = false;
      if (rs.needReadable || rs.length < rs.highWaterMark) {
        this._read(rs.highWaterMark);
      }
    }
    function Transform(options) {
      if (!(this instanceof Transform))
        return new Transform(options);
      Duplex.call(this, options);
      this._transformState = {
        afterTransform: afterTransform.bind(this),
        needTransform: false,
        transforming: false,
        writecb: null,
        writechunk: null,
        writeencoding: null
      };
      this._readableState.needReadable = true;
      this._readableState.sync = false;
      if (options) {
        if (typeof options.transform === "function")
          this._transform = options.transform;
        if (typeof options.flush === "function")
          this._flush = options.flush;
      }
      this.on("prefinish", prefinish);
    }
    function prefinish() {
      var _this = this;
      if (typeof this._flush === "function" && !this._readableState.destroyed) {
        this._flush(function(er, data) {
          done(_this, er, data);
        });
      } else {
        done(this, null, null);
      }
    }
    Transform.prototype.push = function(chunk, encoding) {
      this._transformState.needTransform = false;
      return Duplex.prototype.push.call(this, chunk, encoding);
    };
    Transform.prototype._transform = function(chunk, encoding, cb) {
      cb(new ERR_METHOD_NOT_IMPLEMENTED("_transform()"));
    };
    Transform.prototype._write = function(chunk, encoding, cb) {
      var ts = this._transformState;
      ts.writecb = cb;
      ts.writechunk = chunk;
      ts.writeencoding = encoding;
      if (!ts.transforming) {
        var rs = this._readableState;
        if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark)
          this._read(rs.highWaterMark);
      }
    };
    Transform.prototype._read = function(n) {
      var ts = this._transformState;
      if (ts.writechunk !== null && !ts.transforming) {
        ts.transforming = true;
        this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
      } else {
        ts.needTransform = true;
      }
    };
    Transform.prototype._destroy = function(err, cb) {
      Duplex.prototype._destroy.call(this, err, function(err2) {
        cb(err2);
      });
    };
    function done(stream, er, data) {
      if (er)
        return stream.emit("error", er);
      if (data != null)
        stream.push(data);
      if (stream._writableState.length)
        throw new ERR_TRANSFORM_WITH_LENGTH_0();
      if (stream._transformState.transforming)
        throw new ERR_TRANSFORM_ALREADY_TRANSFORMING();
      return stream.push(null);
    }
  }
});

// node_modules/.pnpm/readable-stream@3.6.0/node_modules/readable-stream/lib/_stream_passthrough.js
var require_stream_passthrough = __commonJS({
  "node_modules/.pnpm/readable-stream@3.6.0/node_modules/readable-stream/lib/_stream_passthrough.js"(exports2, module2) {
    "use strict";
    module2.exports = PassThrough;
    var Transform = require_stream_transform();
    require_inherits()(PassThrough, Transform);
    function PassThrough(options) {
      if (!(this instanceof PassThrough))
        return new PassThrough(options);
      Transform.call(this, options);
    }
    PassThrough.prototype._transform = function(chunk, encoding, cb) {
      cb(null, chunk);
    };
  }
});

// node_modules/.pnpm/readable-stream@3.6.0/node_modules/readable-stream/lib/internal/streams/pipeline.js
var require_pipeline = __commonJS({
  "node_modules/.pnpm/readable-stream@3.6.0/node_modules/readable-stream/lib/internal/streams/pipeline.js"(exports2, module2) {
    "use strict";
    var eos;
    function once(callback) {
      var called = false;
      return function() {
        if (called)
          return;
        called = true;
        callback.apply(void 0, arguments);
      };
    }
    var _require$codes = require_errors().codes;
    var ERR_MISSING_ARGS = _require$codes.ERR_MISSING_ARGS;
    var ERR_STREAM_DESTROYED = _require$codes.ERR_STREAM_DESTROYED;
    function noop(err) {
      if (err)
        throw err;
    }
    function isRequest(stream) {
      return stream.setHeader && typeof stream.abort === "function";
    }
    function destroyer(stream, reading, writing, callback) {
      callback = once(callback);
      var closed = false;
      stream.on("close", function() {
        closed = true;
      });
      if (eos === void 0)
        eos = require_end_of_stream();
      eos(stream, {
        readable: reading,
        writable: writing
      }, function(err) {
        if (err)
          return callback(err);
        closed = true;
        callback();
      });
      var destroyed = false;
      return function(err) {
        if (closed)
          return;
        if (destroyed)
          return;
        destroyed = true;
        if (isRequest(stream))
          return stream.abort();
        if (typeof stream.destroy === "function")
          return stream.destroy();
        callback(err || new ERR_STREAM_DESTROYED("pipe"));
      };
    }
    function call(fn) {
      fn();
    }
    function pipe(from, to) {
      return from.pipe(to);
    }
    function popCallback(streams) {
      if (!streams.length)
        return noop;
      if (typeof streams[streams.length - 1] !== "function")
        return noop;
      return streams.pop();
    }
    function pipeline() {
      for (var _len = arguments.length, streams = new Array(_len), _key = 0; _key < _len; _key++) {
        streams[_key] = arguments[_key];
      }
      var callback = popCallback(streams);
      if (Array.isArray(streams[0]))
        streams = streams[0];
      if (streams.length < 2) {
        throw new ERR_MISSING_ARGS("streams");
      }
      var error;
      var destroys = streams.map(function(stream, i2) {
        var reading = i2 < streams.length - 1;
        var writing = i2 > 0;
        return destroyer(stream, reading, writing, function(err) {
          if (!error)
            error = err;
          if (err)
            destroys.forEach(call);
          if (reading)
            return;
          destroys.forEach(call);
          callback(error);
        });
      });
      return streams.reduce(pipe);
    }
    module2.exports = pipeline;
  }
});

// node_modules/.pnpm/readable-stream@3.6.0/node_modules/readable-stream/readable.js
var require_readable = __commonJS({
  "node_modules/.pnpm/readable-stream@3.6.0/node_modules/readable-stream/readable.js"(exports2, module2) {
    var Stream = __require("stream");
    if (process.env.READABLE_STREAM === "disable" && Stream) {
      module2.exports = Stream.Readable;
      Object.assign(module2.exports, Stream);
      module2.exports.Stream = Stream;
    } else {
      exports2 = module2.exports = require_stream_readable();
      exports2.Stream = Stream || exports2;
      exports2.Readable = exports2;
      exports2.Writable = require_stream_writable();
      exports2.Duplex = require_stream_duplex();
      exports2.Transform = require_stream_transform();
      exports2.PassThrough = require_stream_passthrough();
      exports2.finished = require_end_of_stream();
      exports2.pipeline = require_pipeline();
    }
  }
});

// node_modules/.pnpm/isomorphic-git@1.10.3/node_modules/isomorphic-git/http/node/index.cjs
var require_node2 = __commonJS({
  "node_modules/.pnpm/isomorphic-git@1.10.3/node_modules/isomorphic-git/http/node/index.cjs"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    function _interopDefault(ex) {
      return ex && typeof ex === "object" && "default" in ex ? ex["default"] : ex;
    }
    var get = _interopDefault(require_simple_get());
    function fromValue(value2) {
      let queue = [value2];
      return {
        next() {
          return Promise.resolve({ done: queue.length === 0, value: queue.pop() });
        },
        return() {
          queue = [];
          return {};
        },
        [Symbol.asyncIterator]() {
          return this;
        }
      };
    }
    function getIterator(iterable) {
      if (iterable[Symbol.asyncIterator]) {
        return iterable[Symbol.asyncIterator]();
      }
      if (iterable[Symbol.iterator]) {
        return iterable[Symbol.iterator]();
      }
      if (iterable.next) {
        return iterable;
      }
      return fromValue(iterable);
    }
    async function forAwait(iterable, cb) {
      const iter = getIterator(iterable);
      while (true) {
        const { value: value2, done } = await iter.next();
        if (value2)
          await cb(value2);
        if (done)
          break;
      }
      if (iter.return)
        iter.return();
    }
    function asyncIteratorToStream(iter) {
      const { PassThrough } = require_readable();
      const stream = new PassThrough();
      setTimeout(async () => {
        await forAwait(iter, (chunk) => stream.write(chunk));
        stream.end();
      }, 1);
      return stream;
    }
    async function collect(iterable) {
      let size = 0;
      const buffers = [];
      await forAwait(iterable, (value2) => {
        buffers.push(value2);
        size += value2.byteLength;
      });
      const result = new Uint8Array(size);
      let nextIndex = 0;
      for (const buffer of buffers) {
        result.set(buffer, nextIndex);
        nextIndex += buffer.byteLength;
      }
      return result;
    }
    function fromNodeStream(stream) {
      const asyncIterator = Object.getOwnPropertyDescriptor(stream, Symbol.asyncIterator);
      if (asyncIterator && asyncIterator.enumerable) {
        return stream;
      }
      let ended = false;
      const queue = [];
      let defer = {};
      stream.on("data", (chunk) => {
        queue.push(chunk);
        if (defer.resolve) {
          defer.resolve({ value: queue.shift(), done: false });
          defer = {};
        }
      });
      stream.on("error", (err) => {
        if (defer.reject) {
          defer.reject(err);
          defer = {};
        }
      });
      stream.on("end", () => {
        ended = true;
        if (defer.resolve) {
          defer.resolve({ done: true });
          defer = {};
        }
      });
      return {
        next() {
          return new Promise((resolve, reject) => {
            if (queue.length === 0 && ended) {
              return resolve({ done: true });
            } else if (queue.length > 0) {
              return resolve({ value: queue.shift(), done: false });
            } else if (queue.length === 0 && !ended) {
              defer = { resolve, reject };
            }
          });
        },
        return() {
          stream.removeAllListeners();
          if (stream.destroy)
            stream.destroy();
        },
        [Symbol.asyncIterator]() {
          return this;
        }
      };
    }
    async function request({
      onProgress,
      url,
      method = "GET",
      headers = {},
      body
    }) {
      if (body && Array.isArray(body)) {
        body = Buffer.from(await collect(body));
      } else if (body) {
        body = asyncIteratorToStream(body);
      }
      return new Promise((resolve, reject) => {
        get({
          url,
          method,
          headers,
          body
        }, (err, res) => {
          if (err)
            return reject(err);
          const iter = fromNodeStream(res);
          resolve({
            url: res.url,
            method: res.method,
            statusCode: res.statusCode,
            statusMessage: res.statusMessage,
            body: iter,
            headers: res.headers
          });
        });
      });
    }
    var index = { request };
    exports2.default = index;
    exports2.request = request;
  }
});

// node_modules/.pnpm/universalify@2.0.0/node_modules/universalify/index.js
var require_universalify = __commonJS({
  "node_modules/.pnpm/universalify@2.0.0/node_modules/universalify/index.js"(exports2) {
    "use strict";
    exports2.fromCallback = function(fn) {
      return Object.defineProperty(function(...args) {
        if (typeof args[args.length - 1] === "function")
          fn.apply(this, args);
        else {
          return new Promise((resolve, reject) => {
            fn.call(this, ...args, (err, res) => err != null ? reject(err) : resolve(res));
          });
        }
      }, "name", { value: fn.name });
    };
    exports2.fromPromise = function(fn) {
      return Object.defineProperty(function(...args) {
        const cb = args[args.length - 1];
        if (typeof cb !== "function")
          return fn.apply(this, args);
        else
          fn.apply(this, args.slice(0, -1)).then((r) => cb(null, r), cb);
      }, "name", { value: fn.name });
    };
  }
});

// node_modules/.pnpm/graceful-fs@4.2.8/node_modules/graceful-fs/polyfills.js
var require_polyfills = __commonJS({
  "node_modules/.pnpm/graceful-fs@4.2.8/node_modules/graceful-fs/polyfills.js"(exports2, module2) {
    var constants2 = __require("constants");
    var origCwd = process.cwd;
    var cwd = null;
    var platform = process.env.GRACEFUL_FS_PLATFORM || process.platform;
    process.cwd = function() {
      if (!cwd)
        cwd = origCwd.call(process);
      return cwd;
    };
    try {
      process.cwd();
    } catch (er) {
    }
    if (typeof process.chdir === "function") {
      chdir = process.chdir;
      process.chdir = function(d) {
        cwd = null;
        chdir.call(process, d);
      };
      if (Object.setPrototypeOf)
        Object.setPrototypeOf(process.chdir, chdir);
    }
    var chdir;
    module2.exports = patch;
    function patch(fs3) {
      if (constants2.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)) {
        patchLchmod(fs3);
      }
      if (!fs3.lutimes) {
        patchLutimes(fs3);
      }
      fs3.chown = chownFix(fs3.chown);
      fs3.fchown = chownFix(fs3.fchown);
      fs3.lchown = chownFix(fs3.lchown);
      fs3.chmod = chmodFix(fs3.chmod);
      fs3.fchmod = chmodFix(fs3.fchmod);
      fs3.lchmod = chmodFix(fs3.lchmod);
      fs3.chownSync = chownFixSync(fs3.chownSync);
      fs3.fchownSync = chownFixSync(fs3.fchownSync);
      fs3.lchownSync = chownFixSync(fs3.lchownSync);
      fs3.chmodSync = chmodFixSync(fs3.chmodSync);
      fs3.fchmodSync = chmodFixSync(fs3.fchmodSync);
      fs3.lchmodSync = chmodFixSync(fs3.lchmodSync);
      fs3.stat = statFix(fs3.stat);
      fs3.fstat = statFix(fs3.fstat);
      fs3.lstat = statFix(fs3.lstat);
      fs3.statSync = statFixSync(fs3.statSync);
      fs3.fstatSync = statFixSync(fs3.fstatSync);
      fs3.lstatSync = statFixSync(fs3.lstatSync);
      if (!fs3.lchmod) {
        fs3.lchmod = function(path2, mode, cb) {
          if (cb)
            process.nextTick(cb);
        };
        fs3.lchmodSync = function() {
        };
      }
      if (!fs3.lchown) {
        fs3.lchown = function(path2, uid, gid, cb) {
          if (cb)
            process.nextTick(cb);
        };
        fs3.lchownSync = function() {
        };
      }
      if (platform === "win32") {
        fs3.rename = function(fs$rename) {
          return function(from, to, cb) {
            var start = Date.now();
            var backoff = 0;
            fs$rename(from, to, function CB(er) {
              if (er && (er.code === "EACCES" || er.code === "EPERM") && Date.now() - start < 6e4) {
                setTimeout(function() {
                  fs3.stat(to, function(stater, st) {
                    if (stater && stater.code === "ENOENT")
                      fs$rename(from, to, CB);
                    else
                      cb(er);
                  });
                }, backoff);
                if (backoff < 100)
                  backoff += 10;
                return;
              }
              if (cb)
                cb(er);
            });
          };
        }(fs3.rename);
      }
      fs3.read = function(fs$read) {
        function read2(fd, buffer, offset, length, position, callback_) {
          var callback;
          if (callback_ && typeof callback_ === "function") {
            var eagCounter = 0;
            callback = function(er, _, __) {
              if (er && er.code === "EAGAIN" && eagCounter < 10) {
                eagCounter++;
                return fs$read.call(fs3, fd, buffer, offset, length, position, callback);
              }
              callback_.apply(this, arguments);
            };
          }
          return fs$read.call(fs3, fd, buffer, offset, length, position, callback);
        }
        if (Object.setPrototypeOf)
          Object.setPrototypeOf(read2, fs$read);
        return read2;
      }(fs3.read);
      fs3.readSync = function(fs$readSync) {
        return function(fd, buffer, offset, length, position) {
          var eagCounter = 0;
          while (true) {
            try {
              return fs$readSync.call(fs3, fd, buffer, offset, length, position);
            } catch (er) {
              if (er.code === "EAGAIN" && eagCounter < 10) {
                eagCounter++;
                continue;
              }
              throw er;
            }
          }
        };
      }(fs3.readSync);
      function patchLchmod(fs4) {
        fs4.lchmod = function(path2, mode, callback) {
          fs4.open(path2, constants2.O_WRONLY | constants2.O_SYMLINK, mode, function(err, fd) {
            if (err) {
              if (callback)
                callback(err);
              return;
            }
            fs4.fchmod(fd, mode, function(err2) {
              fs4.close(fd, function(err22) {
                if (callback)
                  callback(err2 || err22);
              });
            });
          });
        };
        fs4.lchmodSync = function(path2, mode) {
          var fd = fs4.openSync(path2, constants2.O_WRONLY | constants2.O_SYMLINK, mode);
          var threw = true;
          var ret;
          try {
            ret = fs4.fchmodSync(fd, mode);
            threw = false;
          } finally {
            if (threw) {
              try {
                fs4.closeSync(fd);
              } catch (er) {
              }
            } else {
              fs4.closeSync(fd);
            }
          }
          return ret;
        };
      }
      function patchLutimes(fs4) {
        if (constants2.hasOwnProperty("O_SYMLINK")) {
          fs4.lutimes = function(path2, at, mt, cb) {
            fs4.open(path2, constants2.O_SYMLINK, function(er, fd) {
              if (er) {
                if (cb)
                  cb(er);
                return;
              }
              fs4.futimes(fd, at, mt, function(er2) {
                fs4.close(fd, function(er22) {
                  if (cb)
                    cb(er2 || er22);
                });
              });
            });
          };
          fs4.lutimesSync = function(path2, at, mt) {
            var fd = fs4.openSync(path2, constants2.O_SYMLINK);
            var ret;
            var threw = true;
            try {
              ret = fs4.futimesSync(fd, at, mt);
              threw = false;
            } finally {
              if (threw) {
                try {
                  fs4.closeSync(fd);
                } catch (er) {
                }
              } else {
                fs4.closeSync(fd);
              }
            }
            return ret;
          };
        } else {
          fs4.lutimes = function(_a, _b, _c, cb) {
            if (cb)
              process.nextTick(cb);
          };
          fs4.lutimesSync = function() {
          };
        }
      }
      function chmodFix(orig) {
        if (!orig)
          return orig;
        return function(target, mode, cb) {
          return orig.call(fs3, target, mode, function(er) {
            if (chownErOk(er))
              er = null;
            if (cb)
              cb.apply(this, arguments);
          });
        };
      }
      function chmodFixSync(orig) {
        if (!orig)
          return orig;
        return function(target, mode) {
          try {
            return orig.call(fs3, target, mode);
          } catch (er) {
            if (!chownErOk(er))
              throw er;
          }
        };
      }
      function chownFix(orig) {
        if (!orig)
          return orig;
        return function(target, uid, gid, cb) {
          return orig.call(fs3, target, uid, gid, function(er) {
            if (chownErOk(er))
              er = null;
            if (cb)
              cb.apply(this, arguments);
          });
        };
      }
      function chownFixSync(orig) {
        if (!orig)
          return orig;
        return function(target, uid, gid) {
          try {
            return orig.call(fs3, target, uid, gid);
          } catch (er) {
            if (!chownErOk(er))
              throw er;
          }
        };
      }
      function statFix(orig) {
        if (!orig)
          return orig;
        return function(target, options, cb) {
          if (typeof options === "function") {
            cb = options;
            options = null;
          }
          function callback(er, stats) {
            if (stats) {
              if (stats.uid < 0)
                stats.uid += 4294967296;
              if (stats.gid < 0)
                stats.gid += 4294967296;
            }
            if (cb)
              cb.apply(this, arguments);
          }
          return options ? orig.call(fs3, target, options, callback) : orig.call(fs3, target, callback);
        };
      }
      function statFixSync(orig) {
        if (!orig)
          return orig;
        return function(target, options) {
          var stats = options ? orig.call(fs3, target, options) : orig.call(fs3, target);
          if (stats.uid < 0)
            stats.uid += 4294967296;
          if (stats.gid < 0)
            stats.gid += 4294967296;
          return stats;
        };
      }
      function chownErOk(er) {
        if (!er)
          return true;
        if (er.code === "ENOSYS")
          return true;
        var nonroot = !process.getuid || process.getuid() !== 0;
        if (nonroot) {
          if (er.code === "EINVAL" || er.code === "EPERM")
            return true;
        }
        return false;
      }
    }
  }
});

// node_modules/.pnpm/graceful-fs@4.2.8/node_modules/graceful-fs/legacy-streams.js
var require_legacy_streams = __commonJS({
  "node_modules/.pnpm/graceful-fs@4.2.8/node_modules/graceful-fs/legacy-streams.js"(exports2, module2) {
    var Stream = __require("stream").Stream;
    module2.exports = legacy;
    function legacy(fs3) {
      return {
        ReadStream: ReadStream2,
        WriteStream: WriteStream2
      };
      function ReadStream2(path2, options) {
        if (!(this instanceof ReadStream2))
          return new ReadStream2(path2, options);
        Stream.call(this);
        var self2 = this;
        this.path = path2;
        this.fd = null;
        this.readable = true;
        this.paused = false;
        this.flags = "r";
        this.mode = 438;
        this.bufferSize = 64 * 1024;
        options = options || {};
        var keys = Object.keys(options);
        for (var index = 0, length = keys.length; index < length; index++) {
          var key = keys[index];
          this[key] = options[key];
        }
        if (this.encoding)
          this.setEncoding(this.encoding);
        if (this.start !== void 0) {
          if (typeof this.start !== "number") {
            throw TypeError("start must be a Number");
          }
          if (this.end === void 0) {
            this.end = Infinity;
          } else if (typeof this.end !== "number") {
            throw TypeError("end must be a Number");
          }
          if (this.start > this.end) {
            throw new Error("start must be <= end");
          }
          this.pos = this.start;
        }
        if (this.fd !== null) {
          process.nextTick(function() {
            self2._read();
          });
          return;
        }
        fs3.open(this.path, this.flags, this.mode, function(err, fd) {
          if (err) {
            self2.emit("error", err);
            self2.readable = false;
            return;
          }
          self2.fd = fd;
          self2.emit("open", fd);
          self2._read();
        });
      }
      function WriteStream2(path2, options) {
        if (!(this instanceof WriteStream2))
          return new WriteStream2(path2, options);
        Stream.call(this);
        this.path = path2;
        this.fd = null;
        this.writable = true;
        this.flags = "w";
        this.encoding = "binary";
        this.mode = 438;
        this.bytesWritten = 0;
        options = options || {};
        var keys = Object.keys(options);
        for (var index = 0, length = keys.length; index < length; index++) {
          var key = keys[index];
          this[key] = options[key];
        }
        if (this.start !== void 0) {
          if (typeof this.start !== "number") {
            throw TypeError("start must be a Number");
          }
          if (this.start < 0) {
            throw new Error("start must be >= zero");
          }
          this.pos = this.start;
        }
        this.busy = false;
        this._queue = [];
        if (this.fd === null) {
          this._open = fs3.open;
          this._queue.push([this._open, this.path, this.flags, this.mode, void 0]);
          this.flush();
        }
      }
    }
  }
});

// node_modules/.pnpm/graceful-fs@4.2.8/node_modules/graceful-fs/clone.js
var require_clone = __commonJS({
  "node_modules/.pnpm/graceful-fs@4.2.8/node_modules/graceful-fs/clone.js"(exports2, module2) {
    "use strict";
    module2.exports = clone;
    var getPrototypeOf = Object.getPrototypeOf || function(obj) {
      return obj.__proto__;
    };
    function clone(obj) {
      if (obj === null || typeof obj !== "object")
        return obj;
      if (obj instanceof Object)
        var copy2 = { __proto__: getPrototypeOf(obj) };
      else
        var copy2 = Object.create(null);
      Object.getOwnPropertyNames(obj).forEach(function(key) {
        Object.defineProperty(copy2, key, Object.getOwnPropertyDescriptor(obj, key));
      });
      return copy2;
    }
  }
});

// node_modules/.pnpm/graceful-fs@4.2.8/node_modules/graceful-fs/graceful-fs.js
var require_graceful_fs = __commonJS({
  "node_modules/.pnpm/graceful-fs@4.2.8/node_modules/graceful-fs/graceful-fs.js"(exports2, module2) {
    var fs3 = __require("fs");
    var polyfills = require_polyfills();
    var legacy = require_legacy_streams();
    var clone = require_clone();
    var util = __require("util");
    var gracefulQueue;
    var previousSymbol;
    if (typeof Symbol === "function" && typeof Symbol.for === "function") {
      gracefulQueue = Symbol.for("graceful-fs.queue");
      previousSymbol = Symbol.for("graceful-fs.previous");
    } else {
      gracefulQueue = "___graceful-fs.queue";
      previousSymbol = "___graceful-fs.previous";
    }
    function noop() {
    }
    function publishQueue(context, queue2) {
      Object.defineProperty(context, gracefulQueue, {
        get: function() {
          return queue2;
        }
      });
    }
    var debug = noop;
    if (util.debuglog)
      debug = util.debuglog("gfs4");
    else if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || ""))
      debug = function() {
        var m = util.format.apply(util, arguments);
        m = "GFS4: " + m.split(/\n/).join("\nGFS4: ");
        console.error(m);
      };
    if (!fs3[gracefulQueue]) {
      queue = global[gracefulQueue] || [];
      publishQueue(fs3, queue);
      fs3.close = function(fs$close) {
        function close2(fd, cb) {
          return fs$close.call(fs3, fd, function(err) {
            if (!err) {
              resetQueue();
            }
            if (typeof cb === "function")
              cb.apply(this, arguments);
          });
        }
        Object.defineProperty(close2, previousSymbol, {
          value: fs$close
        });
        return close2;
      }(fs3.close);
      fs3.closeSync = function(fs$closeSync) {
        function closeSync2(fd) {
          fs$closeSync.apply(fs3, arguments);
          resetQueue();
        }
        Object.defineProperty(closeSync2, previousSymbol, {
          value: fs$closeSync
        });
        return closeSync2;
      }(fs3.closeSync);
      if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || "")) {
        process.on("exit", function() {
          debug(fs3[gracefulQueue]);
          __require("assert").equal(fs3[gracefulQueue].length, 0);
        });
      }
    }
    var queue;
    if (!global[gracefulQueue]) {
      publishQueue(global, fs3[gracefulQueue]);
    }
    module2.exports = patch(clone(fs3));
    if (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !fs3.__patched) {
      module2.exports = patch(fs3);
      fs3.__patched = true;
    }
    function patch(fs4) {
      polyfills(fs4);
      fs4.gracefulify = patch;
      fs4.createReadStream = createReadStream2;
      fs4.createWriteStream = createWriteStream2;
      var fs$readFile = fs4.readFile;
      fs4.readFile = readFile2;
      function readFile2(path2, options, cb) {
        if (typeof options === "function")
          cb = options, options = null;
        return go$readFile(path2, options, cb);
        function go$readFile(path3, options2, cb2, startTime) {
          return fs$readFile(path3, options2, function(err) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$readFile, [path3, options2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      var fs$writeFile = fs4.writeFile;
      fs4.writeFile = writeFile2;
      function writeFile2(path2, data, options, cb) {
        if (typeof options === "function")
          cb = options, options = null;
        return go$writeFile(path2, data, options, cb);
        function go$writeFile(path3, data2, options2, cb2, startTime) {
          return fs$writeFile(path3, data2, options2, function(err) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$writeFile, [path3, data2, options2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      var fs$appendFile = fs4.appendFile;
      if (fs$appendFile)
        fs4.appendFile = appendFile2;
      function appendFile2(path2, data, options, cb) {
        if (typeof options === "function")
          cb = options, options = null;
        return go$appendFile(path2, data, options, cb);
        function go$appendFile(path3, data2, options2, cb2, startTime) {
          return fs$appendFile(path3, data2, options2, function(err) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$appendFile, [path3, data2, options2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      var fs$copyFile = fs4.copyFile;
      if (fs$copyFile)
        fs4.copyFile = copyFile2;
      function copyFile2(src, dest, flags, cb) {
        if (typeof flags === "function") {
          cb = flags;
          flags = 0;
        }
        return go$copyFile(src, dest, flags, cb);
        function go$copyFile(src2, dest2, flags2, cb2, startTime) {
          return fs$copyFile(src2, dest2, flags2, function(err) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$copyFile, [src2, dest2, flags2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      var fs$readdir = fs4.readdir;
      fs4.readdir = readdir2;
      function readdir2(path2, options, cb) {
        if (typeof options === "function")
          cb = options, options = null;
        return go$readdir(path2, options, cb);
        function go$readdir(path3, options2, cb2, startTime) {
          return fs$readdir(path3, options2, function(err, files) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$readdir, [path3, options2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (files && files.sort)
                files.sort();
              if (typeof cb2 === "function")
                cb2.call(this, err, files);
            }
          });
        }
      }
      if (process.version.substr(0, 4) === "v0.8") {
        var legStreams = legacy(fs4);
        ReadStream2 = legStreams.ReadStream;
        WriteStream2 = legStreams.WriteStream;
      }
      var fs$ReadStream = fs4.ReadStream;
      if (fs$ReadStream) {
        ReadStream2.prototype = Object.create(fs$ReadStream.prototype);
        ReadStream2.prototype.open = ReadStream$open;
      }
      var fs$WriteStream = fs4.WriteStream;
      if (fs$WriteStream) {
        WriteStream2.prototype = Object.create(fs$WriteStream.prototype);
        WriteStream2.prototype.open = WriteStream$open;
      }
      Object.defineProperty(fs4, "ReadStream", {
        get: function() {
          return ReadStream2;
        },
        set: function(val) {
          ReadStream2 = val;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(fs4, "WriteStream", {
        get: function() {
          return WriteStream2;
        },
        set: function(val) {
          WriteStream2 = val;
        },
        enumerable: true,
        configurable: true
      });
      var FileReadStream = ReadStream2;
      Object.defineProperty(fs4, "FileReadStream", {
        get: function() {
          return FileReadStream;
        },
        set: function(val) {
          FileReadStream = val;
        },
        enumerable: true,
        configurable: true
      });
      var FileWriteStream = WriteStream2;
      Object.defineProperty(fs4, "FileWriteStream", {
        get: function() {
          return FileWriteStream;
        },
        set: function(val) {
          FileWriteStream = val;
        },
        enumerable: true,
        configurable: true
      });
      function ReadStream2(path2, options) {
        if (this instanceof ReadStream2)
          return fs$ReadStream.apply(this, arguments), this;
        else
          return ReadStream2.apply(Object.create(ReadStream2.prototype), arguments);
      }
      function ReadStream$open() {
        var that = this;
        open2(that.path, that.flags, that.mode, function(err, fd) {
          if (err) {
            if (that.autoClose)
              that.destroy();
            that.emit("error", err);
          } else {
            that.fd = fd;
            that.emit("open", fd);
            that.read();
          }
        });
      }
      function WriteStream2(path2, options) {
        if (this instanceof WriteStream2)
          return fs$WriteStream.apply(this, arguments), this;
        else
          return WriteStream2.apply(Object.create(WriteStream2.prototype), arguments);
      }
      function WriteStream$open() {
        var that = this;
        open2(that.path, that.flags, that.mode, function(err, fd) {
          if (err) {
            that.destroy();
            that.emit("error", err);
          } else {
            that.fd = fd;
            that.emit("open", fd);
          }
        });
      }
      function createReadStream2(path2, options) {
        return new fs4.ReadStream(path2, options);
      }
      function createWriteStream2(path2, options) {
        return new fs4.WriteStream(path2, options);
      }
      var fs$open = fs4.open;
      fs4.open = open2;
      function open2(path2, flags, mode, cb) {
        if (typeof mode === "function")
          cb = mode, mode = null;
        return go$open(path2, flags, mode, cb);
        function go$open(path3, flags2, mode2, cb2, startTime) {
          return fs$open(path3, flags2, mode2, function(err, fd) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$open, [path3, flags2, mode2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      return fs4;
    }
    function enqueue(elem) {
      debug("ENQUEUE", elem[0].name, elem[1]);
      fs3[gracefulQueue].push(elem);
      retry();
    }
    var retryTimer;
    function resetQueue() {
      var now = Date.now();
      for (var i2 = 0; i2 < fs3[gracefulQueue].length; ++i2) {
        if (fs3[gracefulQueue][i2].length > 2) {
          fs3[gracefulQueue][i2][3] = now;
          fs3[gracefulQueue][i2][4] = now;
        }
      }
      retry();
    }
    function retry() {
      clearTimeout(retryTimer);
      retryTimer = void 0;
      if (fs3[gracefulQueue].length === 0)
        return;
      var elem = fs3[gracefulQueue].shift();
      var fn = elem[0];
      var args = elem[1];
      var err = elem[2];
      var startTime = elem[3];
      var lastTime = elem[4];
      if (startTime === void 0) {
        debug("RETRY", fn.name, args);
        fn.apply(null, args);
      } else if (Date.now() - startTime >= 6e4) {
        debug("TIMEOUT", fn.name, args);
        var cb = args.pop();
        if (typeof cb === "function")
          cb.call(null, err);
      } else {
        var sinceAttempt = Date.now() - lastTime;
        var sinceStart = Math.max(lastTime - startTime, 1);
        var desiredDelay = Math.min(sinceStart * 1.2, 100);
        if (sinceAttempt >= desiredDelay) {
          debug("RETRY", fn.name, args);
          fn.apply(null, args.concat([startTime]));
        } else {
          fs3[gracefulQueue].push(elem);
        }
      }
      if (retryTimer === void 0) {
        retryTimer = setTimeout(retry, 0);
      }
    }
  }
});

// node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/fs/index.js
var require_fs = __commonJS({
  "node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/fs/index.js"(exports2) {
    "use strict";
    var u = require_universalify().fromCallback;
    var fs3 = require_graceful_fs();
    var api = [
      "access",
      "appendFile",
      "chmod",
      "chown",
      "close",
      "copyFile",
      "fchmod",
      "fchown",
      "fdatasync",
      "fstat",
      "fsync",
      "ftruncate",
      "futimes",
      "lchmod",
      "lchown",
      "link",
      "lstat",
      "mkdir",
      "mkdtemp",
      "open",
      "opendir",
      "readdir",
      "readFile",
      "readlink",
      "realpath",
      "rename",
      "rm",
      "rmdir",
      "stat",
      "symlink",
      "truncate",
      "unlink",
      "utimes",
      "writeFile"
    ].filter((key) => {
      return typeof fs3[key] === "function";
    });
    Object.assign(exports2, fs3);
    api.forEach((method) => {
      exports2[method] = u(fs3[method]);
    });
    exports2.realpath.native = u(fs3.realpath.native);
    exports2.exists = function(filename, callback) {
      if (typeof callback === "function") {
        return fs3.exists(filename, callback);
      }
      return new Promise((resolve) => {
        return fs3.exists(filename, resolve);
      });
    };
    exports2.read = function(fd, buffer, offset, length, position, callback) {
      if (typeof callback === "function") {
        return fs3.read(fd, buffer, offset, length, position, callback);
      }
      return new Promise((resolve, reject) => {
        fs3.read(fd, buffer, offset, length, position, (err, bytesRead, buffer2) => {
          if (err)
            return reject(err);
          resolve({ bytesRead, buffer: buffer2 });
        });
      });
    };
    exports2.write = function(fd, buffer, ...args) {
      if (typeof args[args.length - 1] === "function") {
        return fs3.write(fd, buffer, ...args);
      }
      return new Promise((resolve, reject) => {
        fs3.write(fd, buffer, ...args, (err, bytesWritten, buffer2) => {
          if (err)
            return reject(err);
          resolve({ bytesWritten, buffer: buffer2 });
        });
      });
    };
    if (typeof fs3.writev === "function") {
      exports2.writev = function(fd, buffers, ...args) {
        if (typeof args[args.length - 1] === "function") {
          return fs3.writev(fd, buffers, ...args);
        }
        return new Promise((resolve, reject) => {
          fs3.writev(fd, buffers, ...args, (err, bytesWritten, buffers2) => {
            if (err)
              return reject(err);
            resolve({ bytesWritten, buffers: buffers2 });
          });
        });
      };
    }
  }
});

// node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/mkdirs/utils.js
var require_utils = __commonJS({
  "node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/mkdirs/utils.js"(exports2, module2) {
    "use strict";
    var path2 = __require("path");
    module2.exports.checkPath = function checkPath(pth) {
      if (process.platform === "win32") {
        const pathHasInvalidWinCharacters = /[<>:"|?*]/.test(pth.replace(path2.parse(pth).root, ""));
        if (pathHasInvalidWinCharacters) {
          const error = new Error(`Path contains invalid characters: ${pth}`);
          error.code = "EINVAL";
          throw error;
        }
      }
    };
  }
});

// node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/mkdirs/make-dir.js
var require_make_dir = __commonJS({
  "node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/mkdirs/make-dir.js"(exports2, module2) {
    "use strict";
    var fs3 = require_fs();
    var { checkPath } = require_utils();
    var getMode = (options) => {
      const defaults = { mode: 511 };
      if (typeof options === "number")
        return options;
      return __spreadValues(__spreadValues({}, defaults), options).mode;
    };
    module2.exports.makeDir = async (dir, options) => {
      checkPath(dir);
      return fs3.mkdir(dir, {
        mode: getMode(options),
        recursive: true
      });
    };
    module2.exports.makeDirSync = (dir, options) => {
      checkPath(dir);
      return fs3.mkdirSync(dir, {
        mode: getMode(options),
        recursive: true
      });
    };
  }
});

// node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/mkdirs/index.js
var require_mkdirs = __commonJS({
  "node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/mkdirs/index.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromPromise;
    var { makeDir: _makeDir, makeDirSync } = require_make_dir();
    var makeDir = u(_makeDir);
    module2.exports = {
      mkdirs: makeDir,
      mkdirsSync: makeDirSync,
      mkdirp: makeDir,
      mkdirpSync: makeDirSync,
      ensureDir: makeDir,
      ensureDirSync: makeDirSync
    };
  }
});

// node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/util/utimes.js
var require_utimes = __commonJS({
  "node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/util/utimes.js"(exports2, module2) {
    "use strict";
    var fs3 = require_graceful_fs();
    function utimesMillis(path2, atime, mtime, callback) {
      fs3.open(path2, "r+", (err, fd) => {
        if (err)
          return callback(err);
        fs3.futimes(fd, atime, mtime, (futimesErr) => {
          fs3.close(fd, (closeErr) => {
            if (callback)
              callback(futimesErr || closeErr);
          });
        });
      });
    }
    function utimesMillisSync(path2, atime, mtime) {
      const fd = fs3.openSync(path2, "r+");
      fs3.futimesSync(fd, atime, mtime);
      return fs3.closeSync(fd);
    }
    module2.exports = {
      utimesMillis,
      utimesMillisSync
    };
  }
});

// node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/util/stat.js
var require_stat = __commonJS({
  "node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/util/stat.js"(exports2, module2) {
    "use strict";
    var fs3 = require_fs();
    var path2 = __require("path");
    var util = __require("util");
    function getStats(src, dest, opts) {
      const statFunc = opts.dereference ? (file) => fs3.stat(file, { bigint: true }) : (file) => fs3.lstat(file, { bigint: true });
      return Promise.all([
        statFunc(src),
        statFunc(dest).catch((err) => {
          if (err.code === "ENOENT")
            return null;
          throw err;
        })
      ]).then(([srcStat, destStat]) => ({ srcStat, destStat }));
    }
    function getStatsSync(src, dest, opts) {
      let destStat;
      const statFunc = opts.dereference ? (file) => fs3.statSync(file, { bigint: true }) : (file) => fs3.lstatSync(file, { bigint: true });
      const srcStat = statFunc(src);
      try {
        destStat = statFunc(dest);
      } catch (err) {
        if (err.code === "ENOENT")
          return { srcStat, destStat: null };
        throw err;
      }
      return { srcStat, destStat };
    }
    function checkPaths(src, dest, funcName, opts, cb) {
      util.callbackify(getStats)(src, dest, opts, (err, stats) => {
        if (err)
          return cb(err);
        const { srcStat, destStat } = stats;
        if (destStat) {
          if (areIdentical(srcStat, destStat)) {
            const srcBaseName = path2.basename(src);
            const destBaseName = path2.basename(dest);
            if (funcName === "move" && srcBaseName !== destBaseName && srcBaseName.toLowerCase() === destBaseName.toLowerCase()) {
              return cb(null, { srcStat, destStat, isChangingCase: true });
            }
            return cb(new Error("Source and destination must not be the same."));
          }
          if (srcStat.isDirectory() && !destStat.isDirectory()) {
            return cb(new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`));
          }
          if (!srcStat.isDirectory() && destStat.isDirectory()) {
            return cb(new Error(`Cannot overwrite directory '${dest}' with non-directory '${src}'.`));
          }
        }
        if (srcStat.isDirectory() && isSrcSubdir(src, dest)) {
          return cb(new Error(errMsg(src, dest, funcName)));
        }
        return cb(null, { srcStat, destStat });
      });
    }
    function checkPathsSync(src, dest, funcName, opts) {
      const { srcStat, destStat } = getStatsSync(src, dest, opts);
      if (destStat) {
        if (areIdentical(srcStat, destStat)) {
          const srcBaseName = path2.basename(src);
          const destBaseName = path2.basename(dest);
          if (funcName === "move" && srcBaseName !== destBaseName && srcBaseName.toLowerCase() === destBaseName.toLowerCase()) {
            return { srcStat, destStat, isChangingCase: true };
          }
          throw new Error("Source and destination must not be the same.");
        }
        if (srcStat.isDirectory() && !destStat.isDirectory()) {
          throw new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`);
        }
        if (!srcStat.isDirectory() && destStat.isDirectory()) {
          throw new Error(`Cannot overwrite directory '${dest}' with non-directory '${src}'.`);
        }
      }
      if (srcStat.isDirectory() && isSrcSubdir(src, dest)) {
        throw new Error(errMsg(src, dest, funcName));
      }
      return { srcStat, destStat };
    }
    function checkParentPaths(src, srcStat, dest, funcName, cb) {
      const srcParent = path2.resolve(path2.dirname(src));
      const destParent = path2.resolve(path2.dirname(dest));
      if (destParent === srcParent || destParent === path2.parse(destParent).root)
        return cb();
      fs3.stat(destParent, { bigint: true }, (err, destStat) => {
        if (err) {
          if (err.code === "ENOENT")
            return cb();
          return cb(err);
        }
        if (areIdentical(srcStat, destStat)) {
          return cb(new Error(errMsg(src, dest, funcName)));
        }
        return checkParentPaths(src, srcStat, destParent, funcName, cb);
      });
    }
    function checkParentPathsSync(src, srcStat, dest, funcName) {
      const srcParent = path2.resolve(path2.dirname(src));
      const destParent = path2.resolve(path2.dirname(dest));
      if (destParent === srcParent || destParent === path2.parse(destParent).root)
        return;
      let destStat;
      try {
        destStat = fs3.statSync(destParent, { bigint: true });
      } catch (err) {
        if (err.code === "ENOENT")
          return;
        throw err;
      }
      if (areIdentical(srcStat, destStat)) {
        throw new Error(errMsg(src, dest, funcName));
      }
      return checkParentPathsSync(src, srcStat, destParent, funcName);
    }
    function areIdentical(srcStat, destStat) {
      return destStat.ino && destStat.dev && destStat.ino === srcStat.ino && destStat.dev === srcStat.dev;
    }
    function isSrcSubdir(src, dest) {
      const srcArr = path2.resolve(src).split(path2.sep).filter((i2) => i2);
      const destArr = path2.resolve(dest).split(path2.sep).filter((i2) => i2);
      return srcArr.reduce((acc, cur, i2) => acc && destArr[i2] === cur, true);
    }
    function errMsg(src, dest, funcName) {
      return `Cannot ${funcName} '${src}' to a subdirectory of itself, '${dest}'.`;
    }
    module2.exports = {
      checkPaths,
      checkPathsSync,
      checkParentPaths,
      checkParentPathsSync,
      isSrcSubdir,
      areIdentical
    };
  }
});

// node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/copy-sync/copy-sync.js
var require_copy_sync = __commonJS({
  "node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/copy-sync/copy-sync.js"(exports2, module2) {
    "use strict";
    var fs3 = require_graceful_fs();
    var path2 = __require("path");
    var mkdirsSync2 = require_mkdirs().mkdirsSync;
    var utimesMillisSync = require_utimes().utimesMillisSync;
    var stat2 = require_stat();
    function copySync2(src, dest, opts) {
      if (typeof opts === "function") {
        opts = { filter: opts };
      }
      opts = opts || {};
      opts.clobber = "clobber" in opts ? !!opts.clobber : true;
      opts.overwrite = "overwrite" in opts ? !!opts.overwrite : opts.clobber;
      if (opts.preserveTimestamps && process.arch === "ia32") {
        console.warn(`fs-extra: Using the preserveTimestamps option in 32-bit node is not recommended;

    see https://github.com/jprichardson/node-fs-extra/issues/269`);
      }
      const { srcStat, destStat } = stat2.checkPathsSync(src, dest, "copy", opts);
      stat2.checkParentPathsSync(src, srcStat, dest, "copy");
      return handleFilterAndCopy(destStat, src, dest, opts);
    }
    function handleFilterAndCopy(destStat, src, dest, opts) {
      if (opts.filter && !opts.filter(src, dest))
        return;
      const destParent = path2.dirname(dest);
      if (!fs3.existsSync(destParent))
        mkdirsSync2(destParent);
      return getStats(destStat, src, dest, opts);
    }
    function startCopy(destStat, src, dest, opts) {
      if (opts.filter && !opts.filter(src, dest))
        return;
      return getStats(destStat, src, dest, opts);
    }
    function getStats(destStat, src, dest, opts) {
      const statSync2 = opts.dereference ? fs3.statSync : fs3.lstatSync;
      const srcStat = statSync2(src);
      if (srcStat.isDirectory())
        return onDir(srcStat, destStat, src, dest, opts);
      else if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice())
        return onFile(srcStat, destStat, src, dest, opts);
      else if (srcStat.isSymbolicLink())
        return onLink(destStat, src, dest, opts);
      else if (srcStat.isSocket())
        throw new Error(`Cannot copy a socket file: ${src}`);
      else if (srcStat.isFIFO())
        throw new Error(`Cannot copy a FIFO pipe: ${src}`);
      throw new Error(`Unknown file: ${src}`);
    }
    function onFile(srcStat, destStat, src, dest, opts) {
      if (!destStat)
        return copyFile2(srcStat, src, dest, opts);
      return mayCopyFile(srcStat, src, dest, opts);
    }
    function mayCopyFile(srcStat, src, dest, opts) {
      if (opts.overwrite) {
        fs3.unlinkSync(dest);
        return copyFile2(srcStat, src, dest, opts);
      } else if (opts.errorOnExist) {
        throw new Error(`'${dest}' already exists`);
      }
    }
    function copyFile2(srcStat, src, dest, opts) {
      fs3.copyFileSync(src, dest);
      if (opts.preserveTimestamps)
        handleTimestamps(srcStat.mode, src, dest);
      return setDestMode(dest, srcStat.mode);
    }
    function handleTimestamps(srcMode, src, dest) {
      if (fileIsNotWritable(srcMode))
        makeFileWritable(dest, srcMode);
      return setDestTimestamps(src, dest);
    }
    function fileIsNotWritable(srcMode) {
      return (srcMode & 128) === 0;
    }
    function makeFileWritable(dest, srcMode) {
      return setDestMode(dest, srcMode | 128);
    }
    function setDestMode(dest, srcMode) {
      return fs3.chmodSync(dest, srcMode);
    }
    function setDestTimestamps(src, dest) {
      const updatedSrcStat = fs3.statSync(src);
      return utimesMillisSync(dest, updatedSrcStat.atime, updatedSrcStat.mtime);
    }
    function onDir(srcStat, destStat, src, dest, opts) {
      if (!destStat)
        return mkDirAndCopy(srcStat.mode, src, dest, opts);
      return copyDir(src, dest, opts);
    }
    function mkDirAndCopy(srcMode, src, dest, opts) {
      fs3.mkdirSync(dest);
      copyDir(src, dest, opts);
      return setDestMode(dest, srcMode);
    }
    function copyDir(src, dest, opts) {
      fs3.readdirSync(src).forEach((item2) => copyDirItem(item2, src, dest, opts));
    }
    function copyDirItem(item2, src, dest, opts) {
      const srcItem = path2.join(src, item2);
      const destItem = path2.join(dest, item2);
      const { destStat } = stat2.checkPathsSync(srcItem, destItem, "copy", opts);
      return startCopy(destStat, srcItem, destItem, opts);
    }
    function onLink(destStat, src, dest, opts) {
      let resolvedSrc = fs3.readlinkSync(src);
      if (opts.dereference) {
        resolvedSrc = path2.resolve(process.cwd(), resolvedSrc);
      }
      if (!destStat) {
        return fs3.symlinkSync(resolvedSrc, dest);
      } else {
        let resolvedDest;
        try {
          resolvedDest = fs3.readlinkSync(dest);
        } catch (err) {
          if (err.code === "EINVAL" || err.code === "UNKNOWN")
            return fs3.symlinkSync(resolvedSrc, dest);
          throw err;
        }
        if (opts.dereference) {
          resolvedDest = path2.resolve(process.cwd(), resolvedDest);
        }
        if (stat2.isSrcSubdir(resolvedSrc, resolvedDest)) {
          throw new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`);
        }
        if (fs3.statSync(dest).isDirectory() && stat2.isSrcSubdir(resolvedDest, resolvedSrc)) {
          throw new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`);
        }
        return copyLink(resolvedSrc, dest);
      }
    }
    function copyLink(resolvedSrc, dest) {
      fs3.unlinkSync(dest);
      return fs3.symlinkSync(resolvedSrc, dest);
    }
    module2.exports = copySync2;
  }
});

// node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/copy-sync/index.js
var require_copy_sync2 = __commonJS({
  "node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/copy-sync/index.js"(exports2, module2) {
    "use strict";
    module2.exports = {
      copySync: require_copy_sync()
    };
  }
});

// node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/path-exists/index.js
var require_path_exists = __commonJS({
  "node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/path-exists/index.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromPromise;
    var fs3 = require_fs();
    function pathExists2(path2) {
      return fs3.access(path2).then(() => true).catch(() => false);
    }
    module2.exports = {
      pathExists: u(pathExists2),
      pathExistsSync: fs3.existsSync
    };
  }
});

// node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/copy/copy.js
var require_copy = __commonJS({
  "node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/copy/copy.js"(exports2, module2) {
    "use strict";
    var fs3 = require_graceful_fs();
    var path2 = __require("path");
    var mkdirs2 = require_mkdirs().mkdirs;
    var pathExists2 = require_path_exists().pathExists;
    var utimesMillis = require_utimes().utimesMillis;
    var stat2 = require_stat();
    function copy2(src, dest, opts, cb) {
      if (typeof opts === "function" && !cb) {
        cb = opts;
        opts = {};
      } else if (typeof opts === "function") {
        opts = { filter: opts };
      }
      cb = cb || function() {
      };
      opts = opts || {};
      opts.clobber = "clobber" in opts ? !!opts.clobber : true;
      opts.overwrite = "overwrite" in opts ? !!opts.overwrite : opts.clobber;
      if (opts.preserveTimestamps && process.arch === "ia32") {
        console.warn(`fs-extra: Using the preserveTimestamps option in 32-bit node is not recommended;

    see https://github.com/jprichardson/node-fs-extra/issues/269`);
      }
      stat2.checkPaths(src, dest, "copy", opts, (err, stats) => {
        if (err)
          return cb(err);
        const { srcStat, destStat } = stats;
        stat2.checkParentPaths(src, srcStat, dest, "copy", (err2) => {
          if (err2)
            return cb(err2);
          if (opts.filter)
            return handleFilter(checkParentDir, destStat, src, dest, opts, cb);
          return checkParentDir(destStat, src, dest, opts, cb);
        });
      });
    }
    function checkParentDir(destStat, src, dest, opts, cb) {
      const destParent = path2.dirname(dest);
      pathExists2(destParent, (err, dirExists) => {
        if (err)
          return cb(err);
        if (dirExists)
          return getStats(destStat, src, dest, opts, cb);
        mkdirs2(destParent, (err2) => {
          if (err2)
            return cb(err2);
          return getStats(destStat, src, dest, opts, cb);
        });
      });
    }
    function handleFilter(onInclude, destStat, src, dest, opts, cb) {
      Promise.resolve(opts.filter(src, dest)).then((include) => {
        if (include)
          return onInclude(destStat, src, dest, opts, cb);
        return cb();
      }, (error) => cb(error));
    }
    function startCopy(destStat, src, dest, opts, cb) {
      if (opts.filter)
        return handleFilter(getStats, destStat, src, dest, opts, cb);
      return getStats(destStat, src, dest, opts, cb);
    }
    function getStats(destStat, src, dest, opts, cb) {
      const stat3 = opts.dereference ? fs3.stat : fs3.lstat;
      stat3(src, (err, srcStat) => {
        if (err)
          return cb(err);
        if (srcStat.isDirectory())
          return onDir(srcStat, destStat, src, dest, opts, cb);
        else if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice())
          return onFile(srcStat, destStat, src, dest, opts, cb);
        else if (srcStat.isSymbolicLink())
          return onLink(destStat, src, dest, opts, cb);
        else if (srcStat.isSocket())
          return cb(new Error(`Cannot copy a socket file: ${src}`));
        else if (srcStat.isFIFO())
          return cb(new Error(`Cannot copy a FIFO pipe: ${src}`));
        return cb(new Error(`Unknown file: ${src}`));
      });
    }
    function onFile(srcStat, destStat, src, dest, opts, cb) {
      if (!destStat)
        return copyFile2(srcStat, src, dest, opts, cb);
      return mayCopyFile(srcStat, src, dest, opts, cb);
    }
    function mayCopyFile(srcStat, src, dest, opts, cb) {
      if (opts.overwrite) {
        fs3.unlink(dest, (err) => {
          if (err)
            return cb(err);
          return copyFile2(srcStat, src, dest, opts, cb);
        });
      } else if (opts.errorOnExist) {
        return cb(new Error(`'${dest}' already exists`));
      } else
        return cb();
    }
    function copyFile2(srcStat, src, dest, opts, cb) {
      fs3.copyFile(src, dest, (err) => {
        if (err)
          return cb(err);
        if (opts.preserveTimestamps)
          return handleTimestampsAndMode(srcStat.mode, src, dest, cb);
        return setDestMode(dest, srcStat.mode, cb);
      });
    }
    function handleTimestampsAndMode(srcMode, src, dest, cb) {
      if (fileIsNotWritable(srcMode)) {
        return makeFileWritable(dest, srcMode, (err) => {
          if (err)
            return cb(err);
          return setDestTimestampsAndMode(srcMode, src, dest, cb);
        });
      }
      return setDestTimestampsAndMode(srcMode, src, dest, cb);
    }
    function fileIsNotWritable(srcMode) {
      return (srcMode & 128) === 0;
    }
    function makeFileWritable(dest, srcMode, cb) {
      return setDestMode(dest, srcMode | 128, cb);
    }
    function setDestTimestampsAndMode(srcMode, src, dest, cb) {
      setDestTimestamps(src, dest, (err) => {
        if (err)
          return cb(err);
        return setDestMode(dest, srcMode, cb);
      });
    }
    function setDestMode(dest, srcMode, cb) {
      return fs3.chmod(dest, srcMode, cb);
    }
    function setDestTimestamps(src, dest, cb) {
      fs3.stat(src, (err, updatedSrcStat) => {
        if (err)
          return cb(err);
        return utimesMillis(dest, updatedSrcStat.atime, updatedSrcStat.mtime, cb);
      });
    }
    function onDir(srcStat, destStat, src, dest, opts, cb) {
      if (!destStat)
        return mkDirAndCopy(srcStat.mode, src, dest, opts, cb);
      return copyDir(src, dest, opts, cb);
    }
    function mkDirAndCopy(srcMode, src, dest, opts, cb) {
      fs3.mkdir(dest, (err) => {
        if (err)
          return cb(err);
        copyDir(src, dest, opts, (err2) => {
          if (err2)
            return cb(err2);
          return setDestMode(dest, srcMode, cb);
        });
      });
    }
    function copyDir(src, dest, opts, cb) {
      fs3.readdir(src, (err, items) => {
        if (err)
          return cb(err);
        return copyDirItems(items, src, dest, opts, cb);
      });
    }
    function copyDirItems(items, src, dest, opts, cb) {
      const item2 = items.pop();
      if (!item2)
        return cb();
      return copyDirItem(items, item2, src, dest, opts, cb);
    }
    function copyDirItem(items, item2, src, dest, opts, cb) {
      const srcItem = path2.join(src, item2);
      const destItem = path2.join(dest, item2);
      stat2.checkPaths(srcItem, destItem, "copy", opts, (err, stats) => {
        if (err)
          return cb(err);
        const { destStat } = stats;
        startCopy(destStat, srcItem, destItem, opts, (err2) => {
          if (err2)
            return cb(err2);
          return copyDirItems(items, src, dest, opts, cb);
        });
      });
    }
    function onLink(destStat, src, dest, opts, cb) {
      fs3.readlink(src, (err, resolvedSrc) => {
        if (err)
          return cb(err);
        if (opts.dereference) {
          resolvedSrc = path2.resolve(process.cwd(), resolvedSrc);
        }
        if (!destStat) {
          return fs3.symlink(resolvedSrc, dest, cb);
        } else {
          fs3.readlink(dest, (err2, resolvedDest) => {
            if (err2) {
              if (err2.code === "EINVAL" || err2.code === "UNKNOWN")
                return fs3.symlink(resolvedSrc, dest, cb);
              return cb(err2);
            }
            if (opts.dereference) {
              resolvedDest = path2.resolve(process.cwd(), resolvedDest);
            }
            if (stat2.isSrcSubdir(resolvedSrc, resolvedDest)) {
              return cb(new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`));
            }
            if (destStat.isDirectory() && stat2.isSrcSubdir(resolvedDest, resolvedSrc)) {
              return cb(new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`));
            }
            return copyLink(resolvedSrc, dest, cb);
          });
        }
      });
    }
    function copyLink(resolvedSrc, dest, cb) {
      fs3.unlink(dest, (err) => {
        if (err)
          return cb(err);
        return fs3.symlink(resolvedSrc, dest, cb);
      });
    }
    module2.exports = copy2;
  }
});

// node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/copy/index.js
var require_copy2 = __commonJS({
  "node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/copy/index.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromCallback;
    module2.exports = {
      copy: u(require_copy())
    };
  }
});

// node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/remove/rimraf.js
var require_rimraf = __commonJS({
  "node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/remove/rimraf.js"(exports2, module2) {
    "use strict";
    var fs3 = require_graceful_fs();
    var path2 = __require("path");
    var assert = __require("assert");
    var isWindows = process.platform === "win32";
    function defaults(options) {
      const methods = [
        "unlink",
        "chmod",
        "stat",
        "lstat",
        "rmdir",
        "readdir"
      ];
      methods.forEach((m) => {
        options[m] = options[m] || fs3[m];
        m = m + "Sync";
        options[m] = options[m] || fs3[m];
      });
      options.maxBusyTries = options.maxBusyTries || 3;
    }
    function rimraf(p, options, cb) {
      let busyTries = 0;
      if (typeof options === "function") {
        cb = options;
        options = {};
      }
      assert(p, "rimraf: missing path");
      assert.strictEqual(typeof p, "string", "rimraf: path should be a string");
      assert.strictEqual(typeof cb, "function", "rimraf: callback function required");
      assert(options, "rimraf: invalid options argument provided");
      assert.strictEqual(typeof options, "object", "rimraf: options should be object");
      defaults(options);
      rimraf_(p, options, function CB(er) {
        if (er) {
          if ((er.code === "EBUSY" || er.code === "ENOTEMPTY" || er.code === "EPERM") && busyTries < options.maxBusyTries) {
            busyTries++;
            const time = busyTries * 100;
            return setTimeout(() => rimraf_(p, options, CB), time);
          }
          if (er.code === "ENOENT")
            er = null;
        }
        cb(er);
      });
    }
    function rimraf_(p, options, cb) {
      assert(p);
      assert(options);
      assert(typeof cb === "function");
      options.lstat(p, (er, st) => {
        if (er && er.code === "ENOENT") {
          return cb(null);
        }
        if (er && er.code === "EPERM" && isWindows) {
          return fixWinEPERM(p, options, er, cb);
        }
        if (st && st.isDirectory()) {
          return rmdir2(p, options, er, cb);
        }
        options.unlink(p, (er2) => {
          if (er2) {
            if (er2.code === "ENOENT") {
              return cb(null);
            }
            if (er2.code === "EPERM") {
              return isWindows ? fixWinEPERM(p, options, er2, cb) : rmdir2(p, options, er2, cb);
            }
            if (er2.code === "EISDIR") {
              return rmdir2(p, options, er2, cb);
            }
          }
          return cb(er2);
        });
      });
    }
    function fixWinEPERM(p, options, er, cb) {
      assert(p);
      assert(options);
      assert(typeof cb === "function");
      options.chmod(p, 438, (er2) => {
        if (er2) {
          cb(er2.code === "ENOENT" ? null : er);
        } else {
          options.stat(p, (er3, stats) => {
            if (er3) {
              cb(er3.code === "ENOENT" ? null : er);
            } else if (stats.isDirectory()) {
              rmdir2(p, options, er, cb);
            } else {
              options.unlink(p, cb);
            }
          });
        }
      });
    }
    function fixWinEPERMSync(p, options, er) {
      let stats;
      assert(p);
      assert(options);
      try {
        options.chmodSync(p, 438);
      } catch (er2) {
        if (er2.code === "ENOENT") {
          return;
        } else {
          throw er;
        }
      }
      try {
        stats = options.statSync(p);
      } catch (er3) {
        if (er3.code === "ENOENT") {
          return;
        } else {
          throw er;
        }
      }
      if (stats.isDirectory()) {
        rmdirSync2(p, options, er);
      } else {
        options.unlinkSync(p);
      }
    }
    function rmdir2(p, options, originalEr, cb) {
      assert(p);
      assert(options);
      assert(typeof cb === "function");
      options.rmdir(p, (er) => {
        if (er && (er.code === "ENOTEMPTY" || er.code === "EEXIST" || er.code === "EPERM")) {
          rmkids(p, options, cb);
        } else if (er && er.code === "ENOTDIR") {
          cb(originalEr);
        } else {
          cb(er);
        }
      });
    }
    function rmkids(p, options, cb) {
      assert(p);
      assert(options);
      assert(typeof cb === "function");
      options.readdir(p, (er, files) => {
        if (er)
          return cb(er);
        let n = files.length;
        let errState;
        if (n === 0)
          return options.rmdir(p, cb);
        files.forEach((f) => {
          rimraf(path2.join(p, f), options, (er2) => {
            if (errState) {
              return;
            }
            if (er2)
              return cb(errState = er2);
            if (--n === 0) {
              options.rmdir(p, cb);
            }
          });
        });
      });
    }
    function rimrafSync(p, options) {
      let st;
      options = options || {};
      defaults(options);
      assert(p, "rimraf: missing path");
      assert.strictEqual(typeof p, "string", "rimraf: path should be a string");
      assert(options, "rimraf: missing options");
      assert.strictEqual(typeof options, "object", "rimraf: options should be object");
      try {
        st = options.lstatSync(p);
      } catch (er) {
        if (er.code === "ENOENT") {
          return;
        }
        if (er.code === "EPERM" && isWindows) {
          fixWinEPERMSync(p, options, er);
        }
      }
      try {
        if (st && st.isDirectory()) {
          rmdirSync2(p, options, null);
        } else {
          options.unlinkSync(p);
        }
      } catch (er) {
        if (er.code === "ENOENT") {
          return;
        } else if (er.code === "EPERM") {
          return isWindows ? fixWinEPERMSync(p, options, er) : rmdirSync2(p, options, er);
        } else if (er.code !== "EISDIR") {
          throw er;
        }
        rmdirSync2(p, options, er);
      }
    }
    function rmdirSync2(p, options, originalEr) {
      assert(p);
      assert(options);
      try {
        options.rmdirSync(p);
      } catch (er) {
        if (er.code === "ENOTDIR") {
          throw originalEr;
        } else if (er.code === "ENOTEMPTY" || er.code === "EEXIST" || er.code === "EPERM") {
          rmkidsSync(p, options);
        } else if (er.code !== "ENOENT") {
          throw er;
        }
      }
    }
    function rmkidsSync(p, options) {
      assert(p);
      assert(options);
      options.readdirSync(p).forEach((f) => rimrafSync(path2.join(p, f), options));
      if (isWindows) {
        const startTime = Date.now();
        do {
          try {
            const ret = options.rmdirSync(p, options);
            return ret;
          } catch {
          }
        } while (Date.now() - startTime < 500);
      } else {
        const ret = options.rmdirSync(p, options);
        return ret;
      }
    }
    module2.exports = rimraf;
    rimraf.sync = rimrafSync;
  }
});

// node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/remove/index.js
var require_remove = __commonJS({
  "node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/remove/index.js"(exports2, module2) {
    "use strict";
    var fs3 = require_graceful_fs();
    var u = require_universalify().fromCallback;
    var rimraf = require_rimraf();
    function remove2(path2, callback) {
      if (fs3.rm)
        return fs3.rm(path2, { recursive: true, force: true }, callback);
      rimraf(path2, callback);
    }
    function removeSync2(path2) {
      if (fs3.rmSync)
        return fs3.rmSync(path2, { recursive: true, force: true });
      rimraf.sync(path2);
    }
    module2.exports = {
      remove: u(remove2),
      removeSync: removeSync2
    };
  }
});

// node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/empty/index.js
var require_empty = __commonJS({
  "node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/empty/index.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromPromise;
    var fs3 = require_fs();
    var path2 = __require("path");
    var mkdir2 = require_mkdirs();
    var remove2 = require_remove();
    var emptyDir2 = u(async function emptyDir3(dir) {
      let items;
      try {
        items = await fs3.readdir(dir);
      } catch {
        return mkdir2.mkdirs(dir);
      }
      return Promise.all(items.map((item2) => remove2.remove(path2.join(dir, item2))));
    });
    function emptyDirSync2(dir) {
      let items;
      try {
        items = fs3.readdirSync(dir);
      } catch {
        return mkdir2.mkdirsSync(dir);
      }
      items.forEach((item2) => {
        item2 = path2.join(dir, item2);
        remove2.removeSync(item2);
      });
    }
    module2.exports = {
      emptyDirSync: emptyDirSync2,
      emptydirSync: emptyDirSync2,
      emptyDir: emptyDir2,
      emptydir: emptyDir2
    };
  }
});

// node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/ensure/file.js
var require_file = __commonJS({
  "node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/ensure/file.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromCallback;
    var path2 = __require("path");
    var fs3 = require_graceful_fs();
    var mkdir2 = require_mkdirs();
    function createFile2(file, callback) {
      function makeFile() {
        fs3.writeFile(file, "", (err) => {
          if (err)
            return callback(err);
          callback();
        });
      }
      fs3.stat(file, (err, stats) => {
        if (!err && stats.isFile())
          return callback();
        const dir = path2.dirname(file);
        fs3.stat(dir, (err2, stats2) => {
          if (err2) {
            if (err2.code === "ENOENT") {
              return mkdir2.mkdirs(dir, (err3) => {
                if (err3)
                  return callback(err3);
                makeFile();
              });
            }
            return callback(err2);
          }
          if (stats2.isDirectory())
            makeFile();
          else {
            fs3.readdir(dir, (err3) => {
              if (err3)
                return callback(err3);
            });
          }
        });
      });
    }
    function createFileSync2(file) {
      let stats;
      try {
        stats = fs3.statSync(file);
      } catch {
      }
      if (stats && stats.isFile())
        return;
      const dir = path2.dirname(file);
      try {
        if (!fs3.statSync(dir).isDirectory()) {
          fs3.readdirSync(dir);
        }
      } catch (err) {
        if (err && err.code === "ENOENT")
          mkdir2.mkdirsSync(dir);
        else
          throw err;
      }
      fs3.writeFileSync(file, "");
    }
    module2.exports = {
      createFile: u(createFile2),
      createFileSync: createFileSync2
    };
  }
});

// node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/ensure/link.js
var require_link = __commonJS({
  "node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/ensure/link.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromCallback;
    var path2 = __require("path");
    var fs3 = require_graceful_fs();
    var mkdir2 = require_mkdirs();
    var pathExists2 = require_path_exists().pathExists;
    var { areIdentical } = require_stat();
    function createLink2(srcpath, dstpath, callback) {
      function makeLink(srcpath2, dstpath2) {
        fs3.link(srcpath2, dstpath2, (err) => {
          if (err)
            return callback(err);
          callback(null);
        });
      }
      fs3.lstat(dstpath, (_, dstStat) => {
        fs3.lstat(srcpath, (err, srcStat) => {
          if (err) {
            err.message = err.message.replace("lstat", "ensureLink");
            return callback(err);
          }
          if (dstStat && areIdentical(srcStat, dstStat))
            return callback(null);
          const dir = path2.dirname(dstpath);
          pathExists2(dir, (err2, dirExists) => {
            if (err2)
              return callback(err2);
            if (dirExists)
              return makeLink(srcpath, dstpath);
            mkdir2.mkdirs(dir, (err3) => {
              if (err3)
                return callback(err3);
              makeLink(srcpath, dstpath);
            });
          });
        });
      });
    }
    function createLinkSync2(srcpath, dstpath) {
      let dstStat;
      try {
        dstStat = fs3.lstatSync(dstpath);
      } catch {
      }
      try {
        const srcStat = fs3.lstatSync(srcpath);
        if (dstStat && areIdentical(srcStat, dstStat))
          return;
      } catch (err) {
        err.message = err.message.replace("lstat", "ensureLink");
        throw err;
      }
      const dir = path2.dirname(dstpath);
      const dirExists = fs3.existsSync(dir);
      if (dirExists)
        return fs3.linkSync(srcpath, dstpath);
      mkdir2.mkdirsSync(dir);
      return fs3.linkSync(srcpath, dstpath);
    }
    module2.exports = {
      createLink: u(createLink2),
      createLinkSync: createLinkSync2
    };
  }
});

// node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/ensure/symlink-paths.js
var require_symlink_paths = __commonJS({
  "node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/ensure/symlink-paths.js"(exports2, module2) {
    "use strict";
    var path2 = __require("path");
    var fs3 = require_graceful_fs();
    var pathExists2 = require_path_exists().pathExists;
    function symlinkPaths(srcpath, dstpath, callback) {
      if (path2.isAbsolute(srcpath)) {
        return fs3.lstat(srcpath, (err) => {
          if (err) {
            err.message = err.message.replace("lstat", "ensureSymlink");
            return callback(err);
          }
          return callback(null, {
            toCwd: srcpath,
            toDst: srcpath
          });
        });
      } else {
        const dstdir = path2.dirname(dstpath);
        const relativeToDst = path2.join(dstdir, srcpath);
        return pathExists2(relativeToDst, (err, exists2) => {
          if (err)
            return callback(err);
          if (exists2) {
            return callback(null, {
              toCwd: relativeToDst,
              toDst: srcpath
            });
          } else {
            return fs3.lstat(srcpath, (err2) => {
              if (err2) {
                err2.message = err2.message.replace("lstat", "ensureSymlink");
                return callback(err2);
              }
              return callback(null, {
                toCwd: srcpath,
                toDst: path2.relative(dstdir, srcpath)
              });
            });
          }
        });
      }
    }
    function symlinkPathsSync(srcpath, dstpath) {
      let exists2;
      if (path2.isAbsolute(srcpath)) {
        exists2 = fs3.existsSync(srcpath);
        if (!exists2)
          throw new Error("absolute srcpath does not exist");
        return {
          toCwd: srcpath,
          toDst: srcpath
        };
      } else {
        const dstdir = path2.dirname(dstpath);
        const relativeToDst = path2.join(dstdir, srcpath);
        exists2 = fs3.existsSync(relativeToDst);
        if (exists2) {
          return {
            toCwd: relativeToDst,
            toDst: srcpath
          };
        } else {
          exists2 = fs3.existsSync(srcpath);
          if (!exists2)
            throw new Error("relative srcpath does not exist");
          return {
            toCwd: srcpath,
            toDst: path2.relative(dstdir, srcpath)
          };
        }
      }
    }
    module2.exports = {
      symlinkPaths,
      symlinkPathsSync
    };
  }
});

// node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/ensure/symlink-type.js
var require_symlink_type = __commonJS({
  "node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/ensure/symlink-type.js"(exports2, module2) {
    "use strict";
    var fs3 = require_graceful_fs();
    function symlinkType(srcpath, type, callback) {
      callback = typeof type === "function" ? type : callback;
      type = typeof type === "function" ? false : type;
      if (type)
        return callback(null, type);
      fs3.lstat(srcpath, (err, stats) => {
        if (err)
          return callback(null, "file");
        type = stats && stats.isDirectory() ? "dir" : "file";
        callback(null, type);
      });
    }
    function symlinkTypeSync(srcpath, type) {
      let stats;
      if (type)
        return type;
      try {
        stats = fs3.lstatSync(srcpath);
      } catch {
        return "file";
      }
      return stats && stats.isDirectory() ? "dir" : "file";
    }
    module2.exports = {
      symlinkType,
      symlinkTypeSync
    };
  }
});

// node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/ensure/symlink.js
var require_symlink = __commonJS({
  "node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/ensure/symlink.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromCallback;
    var path2 = __require("path");
    var fs3 = require_fs();
    var _mkdirs = require_mkdirs();
    var mkdirs2 = _mkdirs.mkdirs;
    var mkdirsSync2 = _mkdirs.mkdirsSync;
    var _symlinkPaths = require_symlink_paths();
    var symlinkPaths = _symlinkPaths.symlinkPaths;
    var symlinkPathsSync = _symlinkPaths.symlinkPathsSync;
    var _symlinkType = require_symlink_type();
    var symlinkType = _symlinkType.symlinkType;
    var symlinkTypeSync = _symlinkType.symlinkTypeSync;
    var pathExists2 = require_path_exists().pathExists;
    var { areIdentical } = require_stat();
    function createSymlink2(srcpath, dstpath, type, callback) {
      callback = typeof type === "function" ? type : callback;
      type = typeof type === "function" ? false : type;
      fs3.lstat(dstpath, (err, stats) => {
        if (!err && stats.isSymbolicLink()) {
          Promise.all([
            fs3.stat(srcpath),
            fs3.stat(dstpath)
          ]).then(([srcStat, dstStat]) => {
            if (areIdentical(srcStat, dstStat))
              return callback(null);
            _createSymlink(srcpath, dstpath, type, callback);
          });
        } else
          _createSymlink(srcpath, dstpath, type, callback);
      });
    }
    function _createSymlink(srcpath, dstpath, type, callback) {
      symlinkPaths(srcpath, dstpath, (err, relative) => {
        if (err)
          return callback(err);
        srcpath = relative.toDst;
        symlinkType(relative.toCwd, type, (err2, type2) => {
          if (err2)
            return callback(err2);
          const dir = path2.dirname(dstpath);
          pathExists2(dir, (err3, dirExists) => {
            if (err3)
              return callback(err3);
            if (dirExists)
              return fs3.symlink(srcpath, dstpath, type2, callback);
            mkdirs2(dir, (err4) => {
              if (err4)
                return callback(err4);
              fs3.symlink(srcpath, dstpath, type2, callback);
            });
          });
        });
      });
    }
    function createSymlinkSync2(srcpath, dstpath, type) {
      let stats;
      try {
        stats = fs3.lstatSync(dstpath);
      } catch {
      }
      if (stats && stats.isSymbolicLink()) {
        const srcStat = fs3.statSync(srcpath);
        const dstStat = fs3.statSync(dstpath);
        if (areIdentical(srcStat, dstStat))
          return;
      }
      const relative = symlinkPathsSync(srcpath, dstpath);
      srcpath = relative.toDst;
      type = symlinkTypeSync(relative.toCwd, type);
      const dir = path2.dirname(dstpath);
      const exists2 = fs3.existsSync(dir);
      if (exists2)
        return fs3.symlinkSync(srcpath, dstpath, type);
      mkdirsSync2(dir);
      return fs3.symlinkSync(srcpath, dstpath, type);
    }
    module2.exports = {
      createSymlink: u(createSymlink2),
      createSymlinkSync: createSymlinkSync2
    };
  }
});

// node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/ensure/index.js
var require_ensure = __commonJS({
  "node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/ensure/index.js"(exports2, module2) {
    "use strict";
    var file = require_file();
    var link2 = require_link();
    var symlink2 = require_symlink();
    module2.exports = {
      createFile: file.createFile,
      createFileSync: file.createFileSync,
      ensureFile: file.createFile,
      ensureFileSync: file.createFileSync,
      createLink: link2.createLink,
      createLinkSync: link2.createLinkSync,
      ensureLink: link2.createLink,
      ensureLinkSync: link2.createLinkSync,
      createSymlink: symlink2.createSymlink,
      createSymlinkSync: symlink2.createSymlinkSync,
      ensureSymlink: symlink2.createSymlink,
      ensureSymlinkSync: symlink2.createSymlinkSync
    };
  }
});

// node_modules/.pnpm/jsonfile@6.1.0/node_modules/jsonfile/utils.js
var require_utils2 = __commonJS({
  "node_modules/.pnpm/jsonfile@6.1.0/node_modules/jsonfile/utils.js"(exports2, module2) {
    function stringify(obj, { EOL = "\n", finalEOL = true, replacer = null, spaces } = {}) {
      const EOF = finalEOL ? EOL : "";
      const str = JSON.stringify(obj, replacer, spaces);
      return str.replace(/\n/g, EOL) + EOF;
    }
    function stripBom(content) {
      if (Buffer.isBuffer(content))
        content = content.toString("utf8");
      return content.replace(/^\uFEFF/, "");
    }
    module2.exports = { stringify, stripBom };
  }
});

// node_modules/.pnpm/jsonfile@6.1.0/node_modules/jsonfile/index.js
var require_jsonfile = __commonJS({
  "node_modules/.pnpm/jsonfile@6.1.0/node_modules/jsonfile/index.js"(exports2, module2) {
    var _fs;
    try {
      _fs = require_graceful_fs();
    } catch (_) {
      _fs = __require("fs");
    }
    var universalify = require_universalify();
    var { stringify, stripBom } = require_utils2();
    async function _readFile(file, options = {}) {
      if (typeof options === "string") {
        options = { encoding: options };
      }
      const fs3 = options.fs || _fs;
      const shouldThrow = "throws" in options ? options.throws : true;
      let data = await universalify.fromCallback(fs3.readFile)(file, options);
      data = stripBom(data);
      let obj;
      try {
        obj = JSON.parse(data, options ? options.reviver : null);
      } catch (err) {
        if (shouldThrow) {
          err.message = `${file}: ${err.message}`;
          throw err;
        } else {
          return null;
        }
      }
      return obj;
    }
    var readFile2 = universalify.fromPromise(_readFile);
    function readFileSync2(file, options = {}) {
      if (typeof options === "string") {
        options = { encoding: options };
      }
      const fs3 = options.fs || _fs;
      const shouldThrow = "throws" in options ? options.throws : true;
      try {
        let content = fs3.readFileSync(file, options);
        content = stripBom(content);
        return JSON.parse(content, options.reviver);
      } catch (err) {
        if (shouldThrow) {
          err.message = `${file}: ${err.message}`;
          throw err;
        } else {
          return null;
        }
      }
    }
    async function _writeFile(file, obj, options = {}) {
      const fs3 = options.fs || _fs;
      const str = stringify(obj, options);
      await universalify.fromCallback(fs3.writeFile)(file, str, options);
    }
    var writeFile2 = universalify.fromPromise(_writeFile);
    function writeFileSync2(file, obj, options = {}) {
      const fs3 = options.fs || _fs;
      const str = stringify(obj, options);
      return fs3.writeFileSync(file, str, options);
    }
    var jsonfile = {
      readFile: readFile2,
      readFileSync: readFileSync2,
      writeFile: writeFile2,
      writeFileSync: writeFileSync2
    };
    module2.exports = jsonfile;
  }
});

// node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/json/jsonfile.js
var require_jsonfile2 = __commonJS({
  "node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/json/jsonfile.js"(exports2, module2) {
    "use strict";
    var jsonFile = require_jsonfile();
    module2.exports = {
      readJson: jsonFile.readFile,
      readJsonSync: jsonFile.readFileSync,
      writeJson: jsonFile.writeFile,
      writeJsonSync: jsonFile.writeFileSync
    };
  }
});

// node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/output/index.js
var require_output = __commonJS({
  "node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/output/index.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromCallback;
    var fs3 = require_graceful_fs();
    var path2 = __require("path");
    var mkdir2 = require_mkdirs();
    var pathExists2 = require_path_exists().pathExists;
    function outputFile2(file, data, encoding, callback) {
      if (typeof encoding === "function") {
        callback = encoding;
        encoding = "utf8";
      }
      const dir = path2.dirname(file);
      pathExists2(dir, (err, itDoes) => {
        if (err)
          return callback(err);
        if (itDoes)
          return fs3.writeFile(file, data, encoding, callback);
        mkdir2.mkdirs(dir, (err2) => {
          if (err2)
            return callback(err2);
          fs3.writeFile(file, data, encoding, callback);
        });
      });
    }
    function outputFileSync2(file, ...args) {
      const dir = path2.dirname(file);
      if (fs3.existsSync(dir)) {
        return fs3.writeFileSync(file, ...args);
      }
      mkdir2.mkdirsSync(dir);
      fs3.writeFileSync(file, ...args);
    }
    module2.exports = {
      outputFile: u(outputFile2),
      outputFileSync: outputFileSync2
    };
  }
});

// node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/json/output-json.js
var require_output_json = __commonJS({
  "node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/json/output-json.js"(exports2, module2) {
    "use strict";
    var { stringify } = require_utils2();
    var { outputFile: outputFile2 } = require_output();
    async function outputJson2(file, data, options = {}) {
      const str = stringify(data, options);
      await outputFile2(file, str, options);
    }
    module2.exports = outputJson2;
  }
});

// node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/json/output-json-sync.js
var require_output_json_sync = __commonJS({
  "node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/json/output-json-sync.js"(exports2, module2) {
    "use strict";
    var { stringify } = require_utils2();
    var { outputFileSync: outputFileSync2 } = require_output();
    function outputJsonSync2(file, data, options) {
      const str = stringify(data, options);
      outputFileSync2(file, str, options);
    }
    module2.exports = outputJsonSync2;
  }
});

// node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/json/index.js
var require_json = __commonJS({
  "node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/json/index.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromPromise;
    var jsonFile = require_jsonfile2();
    jsonFile.outputJson = u(require_output_json());
    jsonFile.outputJsonSync = require_output_json_sync();
    jsonFile.outputJSON = jsonFile.outputJson;
    jsonFile.outputJSONSync = jsonFile.outputJsonSync;
    jsonFile.writeJSON = jsonFile.writeJson;
    jsonFile.writeJSONSync = jsonFile.writeJsonSync;
    jsonFile.readJSON = jsonFile.readJson;
    jsonFile.readJSONSync = jsonFile.readJsonSync;
    module2.exports = jsonFile;
  }
});

// node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/move-sync/move-sync.js
var require_move_sync = __commonJS({
  "node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/move-sync/move-sync.js"(exports2, module2) {
    "use strict";
    var fs3 = require_graceful_fs();
    var path2 = __require("path");
    var copySync2 = require_copy_sync2().copySync;
    var removeSync2 = require_remove().removeSync;
    var mkdirpSync2 = require_mkdirs().mkdirpSync;
    var stat2 = require_stat();
    function moveSync2(src, dest, opts) {
      opts = opts || {};
      const overwrite = opts.overwrite || opts.clobber || false;
      const { srcStat, isChangingCase = false } = stat2.checkPathsSync(src, dest, "move", opts);
      stat2.checkParentPathsSync(src, srcStat, dest, "move");
      if (!isParentRoot(dest))
        mkdirpSync2(path2.dirname(dest));
      return doRename(src, dest, overwrite, isChangingCase);
    }
    function isParentRoot(dest) {
      const parent = path2.dirname(dest);
      const parsedPath = path2.parse(parent);
      return parsedPath.root === parent;
    }
    function doRename(src, dest, overwrite, isChangingCase) {
      if (isChangingCase)
        return rename2(src, dest, overwrite);
      if (overwrite) {
        removeSync2(dest);
        return rename2(src, dest, overwrite);
      }
      if (fs3.existsSync(dest))
        throw new Error("dest already exists.");
      return rename2(src, dest, overwrite);
    }
    function rename2(src, dest, overwrite) {
      try {
        fs3.renameSync(src, dest);
      } catch (err) {
        if (err.code !== "EXDEV")
          throw err;
        return moveAcrossDevice(src, dest, overwrite);
      }
    }
    function moveAcrossDevice(src, dest, overwrite) {
      const opts = {
        overwrite,
        errorOnExist: true
      };
      copySync2(src, dest, opts);
      return removeSync2(src);
    }
    module2.exports = moveSync2;
  }
});

// node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/move-sync/index.js
var require_move_sync2 = __commonJS({
  "node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/move-sync/index.js"(exports2, module2) {
    "use strict";
    module2.exports = {
      moveSync: require_move_sync()
    };
  }
});

// node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/move/move.js
var require_move = __commonJS({
  "node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/move/move.js"(exports2, module2) {
    "use strict";
    var fs3 = require_graceful_fs();
    var path2 = __require("path");
    var copy2 = require_copy2().copy;
    var remove2 = require_remove().remove;
    var mkdirp2 = require_mkdirs().mkdirp;
    var pathExists2 = require_path_exists().pathExists;
    var stat2 = require_stat();
    function move2(src, dest, opts, cb) {
      if (typeof opts === "function") {
        cb = opts;
        opts = {};
      }
      const overwrite = opts.overwrite || opts.clobber || false;
      stat2.checkPaths(src, dest, "move", opts, (err, stats) => {
        if (err)
          return cb(err);
        const { srcStat, isChangingCase = false } = stats;
        stat2.checkParentPaths(src, srcStat, dest, "move", (err2) => {
          if (err2)
            return cb(err2);
          if (isParentRoot(dest))
            return doRename(src, dest, overwrite, isChangingCase, cb);
          mkdirp2(path2.dirname(dest), (err3) => {
            if (err3)
              return cb(err3);
            return doRename(src, dest, overwrite, isChangingCase, cb);
          });
        });
      });
    }
    function isParentRoot(dest) {
      const parent = path2.dirname(dest);
      const parsedPath = path2.parse(parent);
      return parsedPath.root === parent;
    }
    function doRename(src, dest, overwrite, isChangingCase, cb) {
      if (isChangingCase)
        return rename2(src, dest, overwrite, cb);
      if (overwrite) {
        return remove2(dest, (err) => {
          if (err)
            return cb(err);
          return rename2(src, dest, overwrite, cb);
        });
      }
      pathExists2(dest, (err, destExists) => {
        if (err)
          return cb(err);
        if (destExists)
          return cb(new Error("dest already exists."));
        return rename2(src, dest, overwrite, cb);
      });
    }
    function rename2(src, dest, overwrite, cb) {
      fs3.rename(src, dest, (err) => {
        if (!err)
          return cb();
        if (err.code !== "EXDEV")
          return cb(err);
        return moveAcrossDevice(src, dest, overwrite, cb);
      });
    }
    function moveAcrossDevice(src, dest, overwrite, cb) {
      const opts = {
        overwrite,
        errorOnExist: true
      };
      copy2(src, dest, opts, (err) => {
        if (err)
          return cb(err);
        return remove2(src, cb);
      });
    }
    module2.exports = move2;
  }
});

// node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/move/index.js
var require_move2 = __commonJS({
  "node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/move/index.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromCallback;
    module2.exports = {
      move: u(require_move())
    };
  }
});

// node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/index.js
var require_lib3 = __commonJS({
  "node_modules/.pnpm/fs-extra@10.0.0/node_modules/fs-extra/lib/index.js"(exports2, module2) {
    "use strict";
    module2.exports = __spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues({}, require_fs()), require_copy_sync2()), require_copy2()), require_empty()), require_ensure()), require_json()), require_mkdirs()), require_move_sync2()), require_move2()), require_output()), require_path_exists()), require_remove());
  }
});

// pkgs/libs/fs.ts
var fs_exports = {};
__export(fs_exports, {
  Dir: () => Dir,
  Dirent: () => Dirent,
  ReadStream: () => ReadStream,
  Stats: () => Stats,
  WriteStream: () => WriteStream,
  access: () => access,
  accessSync: () => accessSync,
  appendFile: () => appendFile,
  appendFileSync: () => appendFileSync,
  chmod: () => chmod,
  chmodSync: () => chmodSync,
  chown: () => chown,
  chownSync: () => chownSync,
  close: () => close,
  closeSync: () => closeSync,
  constants: () => constants,
  copy: () => copy,
  copyFile: () => copyFile,
  copyFileSync: () => copyFileSync,
  copySync: () => copySync,
  createFile: () => createFile,
  createFileSync: () => createFileSync,
  createLink: () => createLink,
  createLinkSync: () => createLinkSync,
  createReadStream: () => createReadStream,
  createSymlink: () => createSymlink,
  createSymlinkSync: () => createSymlinkSync,
  createWriteStream: () => createWriteStream,
  emptyDir: () => emptyDir,
  emptyDirSync: () => emptyDirSync,
  emptydir: () => emptydir,
  emptydirSync: () => emptydirSync,
  ensureDir: () => ensureDir,
  ensureDirSync: () => ensureDirSync,
  ensureFile: () => ensureFile,
  ensureFileSync: () => ensureFileSync,
  ensureLink: () => ensureLink,
  ensureLinkSync: () => ensureLinkSync,
  ensureSymlink: () => ensureSymlink,
  ensureSymlinkSync: () => ensureSymlinkSync,
  exists: () => exists,
  existsSync: () => existsSync,
  fchmod: () => fchmod,
  fchmodSync: () => fchmodSync,
  fchown: () => fchown,
  fchownSync: () => fchownSync,
  fdatasync: () => fdatasync,
  fdatasyncSync: () => fdatasyncSync,
  fstat: () => fstat,
  fstatSync: () => fstatSync,
  fsync: () => fsync,
  fsyncSync: () => fsyncSync,
  ftruncate: () => ftruncate,
  ftruncateSync: () => ftruncateSync,
  futimes: () => futimes,
  futimesSync: () => futimesSync,
  lchmod: () => lchmod,
  lchmodSync: () => lchmodSync,
  lchown: () => lchown,
  lchownSync: () => lchownSync,
  link: () => link,
  linkSync: () => linkSync,
  lstat: () => lstat,
  lstatSync: () => lstatSync,
  lutimes: () => lutimes,
  lutimesSync: () => lutimesSync,
  mkdir: () => mkdir,
  mkdirSync: () => mkdirSync,
  mkdirp: () => mkdirp,
  mkdirpSync: () => mkdirpSync,
  mkdirs: () => mkdirs,
  mkdirsSync: () => mkdirsSync,
  mkdtemp: () => mkdtemp,
  mkdtempSync: () => mkdtempSync,
  move: () => move,
  moveSync: () => moveSync,
  open: () => open,
  openSync: () => openSync,
  opendir: () => opendir,
  opendirSync: () => opendirSync,
  outputFile: () => outputFile,
  outputFileSync: () => outputFileSync,
  outputJSON: () => outputJSON,
  outputJSONSync: () => outputJSONSync,
  outputJson: () => outputJson,
  outputJsonSync: () => outputJsonSync,
  pathExists: () => pathExists,
  pathExistsSync: () => pathExistsSync,
  promises: () => promises,
  read: () => read,
  readFile: () => readFile,
  readFileSync: () => readFileSync,
  readJSON: () => readJSON,
  readJSONSync: () => readJSONSync,
  readJson: () => readJson,
  readJsonSync: () => readJsonSync,
  readSync: () => readSync,
  readdir: () => readdir,
  readdirSync: () => readdirSync,
  readlink: () => readlink,
  readlinkSync: () => readlinkSync,
  readv: () => readv,
  readvSync: () => readvSync,
  realpath: () => realpath,
  realpathSync: () => realpathSync,
  remove: () => remove,
  removeSync: () => removeSync,
  rename: () => rename,
  renameSync: () => renameSync,
  rm: () => rm,
  rmSync: () => rmSync,
  rmdir: () => rmdir,
  rmdirSync: () => rmdirSync,
  stat: () => stat,
  statSync: () => statSync,
  symlink: () => symlink,
  symlinkSync: () => symlinkSync,
  truncate: () => truncate,
  truncateSync: () => truncateSync,
  unlink: () => unlink,
  unlinkSync: () => unlinkSync,
  unwatchFile: () => unwatchFile,
  utimes: () => utimes,
  utimesSync: () => utimesSync,
  watch: () => watch,
  watchFile: () => watchFile,
  write: () => write,
  writeFile: () => writeFile,
  writeFileSync: () => writeFileSync,
  writeJSON: () => writeJSON,
  writeJSONSync: () => writeJSONSync,
  writeJson: () => writeJson,
  writeJsonSync: () => writeJsonSync,
  writeSync: () => writeSync,
  writev: () => writev,
  writevSync: () => writevSync
});
var import_fs_extra, appendFile, appendFileSync, access, accessSync, chown, chownSync, chmod, chmodSync, close, closeSync, copyFile, copyFileSync, createReadStream, createWriteStream, exists, existsSync, fchown, fchownSync, fchmod, fchmodSync, fdatasync, fdatasyncSync, fstat, fstatSync, fsync, fsyncSync, ftruncate, ftruncateSync, futimes, futimesSync, lchown, lchownSync, lchmod, lchmodSync, link, linkSync, lstat, lstatSync, lutimes, lutimesSync, mkdir, mkdirSync, mkdtemp, mkdtempSync, open, openSync, opendir, opendirSync, readdir, readdirSync, read, readSync, readv, readvSync, readFile, readFileSync, readlink, readlinkSync, realpath, realpathSync, rename, renameSync, rm, rmSync, rmdir, rmdirSync, stat, statSync, symlink, symlinkSync, truncate, truncateSync, unwatchFile, unlink, unlinkSync, utimes, utimesSync, watch, watchFile, writeFile, writeFileSync, write, writeSync, writev, writevSync, Dir, Dirent, Stats, ReadStream, WriteStream, constants, promises, copySync, copy, emptyDirSync, emptydirSync, emptyDir, emptydir, createFile, createFileSync, ensureFile, ensureFileSync, createLink, createLinkSync, ensureLink, ensureLinkSync, createSymlink, createSymlinkSync, ensureSymlink, ensureSymlinkSync, readJson, readJsonSync, writeJson, writeJsonSync, outputJson, outputJsonSync, outputJSON, outputJSONSync, writeJSON, writeJSONSync, readJSON, readJSONSync, mkdirs, mkdirsSync, mkdirp, mkdirpSync, ensureDir, ensureDirSync, moveSync, move, outputFile, outputFileSync, pathExists, pathExistsSync, remove, removeSync;
var init_fs = __esm({
  "pkgs/libs/fs.ts"() {
    import_fs_extra = __toModule(require_lib3());
    appendFile = import_fs_extra.default.appendFile;
    appendFileSync = import_fs_extra.default.appendFileSync;
    access = import_fs_extra.default.access;
    accessSync = import_fs_extra.default.accessSync;
    chown = import_fs_extra.default.chown;
    chownSync = import_fs_extra.default.chownSync;
    chmod = import_fs_extra.default.chmod;
    chmodSync = import_fs_extra.default.chmodSync;
    close = import_fs_extra.default.close;
    closeSync = import_fs_extra.default.closeSync;
    copyFile = import_fs_extra.default.copyFile;
    copyFileSync = import_fs_extra.default.copyFileSync;
    createReadStream = import_fs_extra.default.createReadStream;
    createWriteStream = import_fs_extra.default.createWriteStream;
    exists = import_fs_extra.default.exists;
    existsSync = import_fs_extra.default.existsSync;
    fchown = import_fs_extra.default.fchown;
    fchownSync = import_fs_extra.default.fchownSync;
    fchmod = import_fs_extra.default.fchmod;
    fchmodSync = import_fs_extra.default.fchmodSync;
    fdatasync = import_fs_extra.default.fdatasync;
    fdatasyncSync = import_fs_extra.default.fdatasyncSync;
    fstat = import_fs_extra.default.fstat;
    fstatSync = import_fs_extra.default.fstatSync;
    fsync = import_fs_extra.default.fsync;
    fsyncSync = import_fs_extra.default.fsyncSync;
    ftruncate = import_fs_extra.default.ftruncate;
    ftruncateSync = import_fs_extra.default.ftruncateSync;
    futimes = import_fs_extra.default.futimes;
    futimesSync = import_fs_extra.default.futimesSync;
    lchown = import_fs_extra.default.lchown;
    lchownSync = import_fs_extra.default.lchownSync;
    lchmod = import_fs_extra.default.lchmod;
    lchmodSync = import_fs_extra.default.lchmodSync;
    link = import_fs_extra.default.link;
    linkSync = import_fs_extra.default.linkSync;
    lstat = import_fs_extra.default.lstat;
    lstatSync = import_fs_extra.default.lstatSync;
    lutimes = import_fs_extra.default.lutimes;
    lutimesSync = import_fs_extra.default.lutimesSync;
    mkdir = import_fs_extra.default.mkdir;
    mkdirSync = import_fs_extra.default.mkdirSync;
    mkdtemp = import_fs_extra.default.mkdtemp;
    mkdtempSync = import_fs_extra.default.mkdtempSync;
    open = import_fs_extra.default.open;
    openSync = import_fs_extra.default.openSync;
    opendir = import_fs_extra.default.opendir;
    opendirSync = import_fs_extra.default.opendirSync;
    readdir = import_fs_extra.default.readdir;
    readdirSync = import_fs_extra.default.readdirSync;
    read = import_fs_extra.default.read;
    readSync = import_fs_extra.default.readSync;
    readv = import_fs_extra.default.readv;
    readvSync = import_fs_extra.default.readvSync;
    readFile = import_fs_extra.default.readFile;
    readFileSync = import_fs_extra.default.readFileSync;
    readlink = import_fs_extra.default.readlink;
    readlinkSync = import_fs_extra.default.readlinkSync;
    realpath = import_fs_extra.default.realpath;
    realpathSync = import_fs_extra.default.realpathSync;
    rename = import_fs_extra.default.rename;
    renameSync = import_fs_extra.default.renameSync;
    rm = import_fs_extra.default.rm;
    rmSync = import_fs_extra.default.rmSync;
    rmdir = import_fs_extra.default.rmdir;
    rmdirSync = import_fs_extra.default.rmdirSync;
    stat = import_fs_extra.default.stat;
    statSync = import_fs_extra.default.statSync;
    symlink = import_fs_extra.default.symlink;
    symlinkSync = import_fs_extra.default.symlinkSync;
    truncate = import_fs_extra.default.truncate;
    truncateSync = import_fs_extra.default.truncateSync;
    unwatchFile = import_fs_extra.default.unwatchFile;
    unlink = import_fs_extra.default.unlink;
    unlinkSync = import_fs_extra.default.unlinkSync;
    utimes = import_fs_extra.default.utimes;
    utimesSync = import_fs_extra.default.utimesSync;
    watch = import_fs_extra.default.watch;
    watchFile = import_fs_extra.default.watchFile;
    writeFile = import_fs_extra.default.writeFile;
    writeFileSync = import_fs_extra.default.writeFileSync;
    write = import_fs_extra.default.write;
    writeSync = import_fs_extra.default.writeSync;
    writev = import_fs_extra.default.writev;
    writevSync = import_fs_extra.default.writevSync;
    Dir = import_fs_extra.default.Dir;
    Dirent = import_fs_extra.default.Dirent;
    Stats = import_fs_extra.default.Stats;
    ReadStream = import_fs_extra.default.ReadStream;
    WriteStream = import_fs_extra.default.WriteStream;
    constants = import_fs_extra.default.constants;
    promises = import_fs_extra.default.promises;
    copySync = import_fs_extra.default.copySync;
    copy = import_fs_extra.default.copy;
    emptyDirSync = import_fs_extra.default.emptyDirSync;
    emptydirSync = import_fs_extra.default.emptydirSync;
    emptyDir = import_fs_extra.default.emptyDir;
    emptydir = import_fs_extra.default.emptydir;
    createFile = import_fs_extra.default.createFile;
    createFileSync = import_fs_extra.default.createFileSync;
    ensureFile = import_fs_extra.default.ensureFile;
    ensureFileSync = import_fs_extra.default.ensureFileSync;
    createLink = import_fs_extra.default.createLink;
    createLinkSync = import_fs_extra.default.createLinkSync;
    ensureLink = import_fs_extra.default.ensureLink;
    ensureLinkSync = import_fs_extra.default.ensureLinkSync;
    createSymlink = import_fs_extra.default.createSymlink;
    createSymlinkSync = import_fs_extra.default.createSymlinkSync;
    ensureSymlink = import_fs_extra.default.ensureSymlink;
    ensureSymlinkSync = import_fs_extra.default.ensureSymlinkSync;
    readJson = import_fs_extra.default.readJson;
    readJsonSync = import_fs_extra.default.readJsonSync;
    writeJson = import_fs_extra.default.writeJson;
    writeJsonSync = import_fs_extra.default.writeJsonSync;
    outputJson = import_fs_extra.default.outputJson;
    outputJsonSync = import_fs_extra.default.outputJsonSync;
    outputJSON = import_fs_extra.default.outputJSON;
    outputJSONSync = import_fs_extra.default.outputJSONSync;
    writeJSON = import_fs_extra.default.writeJSON;
    writeJSONSync = import_fs_extra.default.writeJSONSync;
    readJSON = import_fs_extra.default.readJSON;
    readJSONSync = import_fs_extra.default.readJSONSync;
    mkdirs = import_fs_extra.default.mkdirs;
    mkdirsSync = import_fs_extra.default.mkdirsSync;
    mkdirp = import_fs_extra.default.mkdirp;
    mkdirpSync = import_fs_extra.default.mkdirpSync;
    ensureDir = import_fs_extra.default.ensureDir;
    ensureDirSync = import_fs_extra.default.ensureDirSync;
    moveSync = import_fs_extra.default.moveSync;
    move = import_fs_extra.default.move;
    outputFile = import_fs_extra.default.outputFile;
    outputFileSync = import_fs_extra.default.outputFileSync;
    pathExists = import_fs_extra.default.pathExists;
    pathExistsSync = import_fs_extra.default.pathExistsSync;
    remove = import_fs_extra.default.remove;
    removeSync = import_fs_extra.default.removeSync;
  }
});

// node_modules/.pnpm/async@0.9.2/node_modules/async/lib/async.js
var require_async = __commonJS({
  "node_modules/.pnpm/async@0.9.2/node_modules/async/lib/async.js"(exports2, module2) {
    (function() {
      var async = {};
      var root2, previous_async;
      root2 = this;
      if (root2 != null) {
        previous_async = root2.async;
      }
      async.noConflict = function() {
        root2.async = previous_async;
        return async;
      };
      function only_once(fn) {
        var called = false;
        return function() {
          if (called)
            throw new Error("Callback was already called.");
          called = true;
          fn.apply(root2, arguments);
        };
      }
      var _toString = Object.prototype.toString;
      var _isArray = Array.isArray || function(obj) {
        return _toString.call(obj) === "[object Array]";
      };
      var _each = function(arr, iterator) {
        for (var i2 = 0; i2 < arr.length; i2 += 1) {
          iterator(arr[i2], i2, arr);
        }
      };
      var _map = function(arr, iterator) {
        if (arr.map) {
          return arr.map(iterator);
        }
        var results = [];
        _each(arr, function(x, i2, a) {
          results.push(iterator(x, i2, a));
        });
        return results;
      };
      var _reduce = function(arr, iterator, memo) {
        if (arr.reduce) {
          return arr.reduce(iterator, memo);
        }
        _each(arr, function(x, i2, a) {
          memo = iterator(memo, x, i2, a);
        });
        return memo;
      };
      var _keys = function(obj) {
        if (Object.keys) {
          return Object.keys(obj);
        }
        var keys = [];
        for (var k in obj) {
          if (obj.hasOwnProperty(k)) {
            keys.push(k);
          }
        }
        return keys;
      };
      if (typeof process === "undefined" || !process.nextTick) {
        if (typeof setImmediate === "function") {
          async.nextTick = function(fn) {
            setImmediate(fn);
          };
          async.setImmediate = async.nextTick;
        } else {
          async.nextTick = function(fn) {
            setTimeout(fn, 0);
          };
          async.setImmediate = async.nextTick;
        }
      } else {
        async.nextTick = process.nextTick;
        if (typeof setImmediate !== "undefined") {
          async.setImmediate = function(fn) {
            setImmediate(fn);
          };
        } else {
          async.setImmediate = async.nextTick;
        }
      }
      async.each = function(arr, iterator, callback) {
        callback = callback || function() {
        };
        if (!arr.length) {
          return callback();
        }
        var completed = 0;
        _each(arr, function(x) {
          iterator(x, only_once(done));
        });
        function done(err) {
          if (err) {
            callback(err);
            callback = function() {
            };
          } else {
            completed += 1;
            if (completed >= arr.length) {
              callback();
            }
          }
        }
      };
      async.forEach = async.each;
      async.eachSeries = function(arr, iterator, callback) {
        callback = callback || function() {
        };
        if (!arr.length) {
          return callback();
        }
        var completed = 0;
        var iterate = function() {
          iterator(arr[completed], function(err) {
            if (err) {
              callback(err);
              callback = function() {
              };
            } else {
              completed += 1;
              if (completed >= arr.length) {
                callback();
              } else {
                iterate();
              }
            }
          });
        };
        iterate();
      };
      async.forEachSeries = async.eachSeries;
      async.eachLimit = function(arr, limit, iterator, callback) {
        var fn = _eachLimit(limit);
        fn.apply(null, [arr, iterator, callback]);
      };
      async.forEachLimit = async.eachLimit;
      var _eachLimit = function(limit) {
        return function(arr, iterator, callback) {
          callback = callback || function() {
          };
          if (!arr.length || limit <= 0) {
            return callback();
          }
          var completed = 0;
          var started = 0;
          var running = 0;
          (function replenish() {
            if (completed >= arr.length) {
              return callback();
            }
            while (running < limit && started < arr.length) {
              started += 1;
              running += 1;
              iterator(arr[started - 1], function(err) {
                if (err) {
                  callback(err);
                  callback = function() {
                  };
                } else {
                  completed += 1;
                  running -= 1;
                  if (completed >= arr.length) {
                    callback();
                  } else {
                    replenish();
                  }
                }
              });
            }
          })();
        };
      };
      var doParallel = function(fn) {
        return function() {
          var args = Array.prototype.slice.call(arguments);
          return fn.apply(null, [async.each].concat(args));
        };
      };
      var doParallelLimit = function(limit, fn) {
        return function() {
          var args = Array.prototype.slice.call(arguments);
          return fn.apply(null, [_eachLimit(limit)].concat(args));
        };
      };
      var doSeries = function(fn) {
        return function() {
          var args = Array.prototype.slice.call(arguments);
          return fn.apply(null, [async.eachSeries].concat(args));
        };
      };
      var _asyncMap = function(eachfn, arr, iterator, callback) {
        arr = _map(arr, function(x, i2) {
          return { index: i2, value: x };
        });
        if (!callback) {
          eachfn(arr, function(x, callback2) {
            iterator(x.value, function(err) {
              callback2(err);
            });
          });
        } else {
          var results = [];
          eachfn(arr, function(x, callback2) {
            iterator(x.value, function(err, v) {
              results[x.index] = v;
              callback2(err);
            });
          }, function(err) {
            callback(err, results);
          });
        }
      };
      async.map = doParallel(_asyncMap);
      async.mapSeries = doSeries(_asyncMap);
      async.mapLimit = function(arr, limit, iterator, callback) {
        return _mapLimit(limit)(arr, iterator, callback);
      };
      var _mapLimit = function(limit) {
        return doParallelLimit(limit, _asyncMap);
      };
      async.reduce = function(arr, memo, iterator, callback) {
        async.eachSeries(arr, function(x, callback2) {
          iterator(memo, x, function(err, v) {
            memo = v;
            callback2(err);
          });
        }, function(err) {
          callback(err, memo);
        });
      };
      async.inject = async.reduce;
      async.foldl = async.reduce;
      async.reduceRight = function(arr, memo, iterator, callback) {
        var reversed = _map(arr, function(x) {
          return x;
        }).reverse();
        async.reduce(reversed, memo, iterator, callback);
      };
      async.foldr = async.reduceRight;
      var _filter = function(eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function(x, i2) {
          return { index: i2, value: x };
        });
        eachfn(arr, function(x, callback2) {
          iterator(x.value, function(v) {
            if (v) {
              results.push(x);
            }
            callback2();
          });
        }, function(err) {
          callback(_map(results.sort(function(a, b) {
            return a.index - b.index;
          }), function(x) {
            return x.value;
          }));
        });
      };
      async.filter = doParallel(_filter);
      async.filterSeries = doSeries(_filter);
      async.select = async.filter;
      async.selectSeries = async.filterSeries;
      var _reject = function(eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function(x, i2) {
          return { index: i2, value: x };
        });
        eachfn(arr, function(x, callback2) {
          iterator(x.value, function(v) {
            if (!v) {
              results.push(x);
            }
            callback2();
          });
        }, function(err) {
          callback(_map(results.sort(function(a, b) {
            return a.index - b.index;
          }), function(x) {
            return x.value;
          }));
        });
      };
      async.reject = doParallel(_reject);
      async.rejectSeries = doSeries(_reject);
      var _detect = function(eachfn, arr, iterator, main_callback) {
        eachfn(arr, function(x, callback) {
          iterator(x, function(result) {
            if (result) {
              main_callback(x);
              main_callback = function() {
              };
            } else {
              callback();
            }
          });
        }, function(err) {
          main_callback();
        });
      };
      async.detect = doParallel(_detect);
      async.detectSeries = doSeries(_detect);
      async.some = function(arr, iterator, main_callback) {
        async.each(arr, function(x, callback) {
          iterator(x, function(v) {
            if (v) {
              main_callback(true);
              main_callback = function() {
              };
            }
            callback();
          });
        }, function(err) {
          main_callback(false);
        });
      };
      async.any = async.some;
      async.every = function(arr, iterator, main_callback) {
        async.each(arr, function(x, callback) {
          iterator(x, function(v) {
            if (!v) {
              main_callback(false);
              main_callback = function() {
              };
            }
            callback();
          });
        }, function(err) {
          main_callback(true);
        });
      };
      async.all = async.every;
      async.sortBy = function(arr, iterator, callback) {
        async.map(arr, function(x, callback2) {
          iterator(x, function(err, criteria) {
            if (err) {
              callback2(err);
            } else {
              callback2(null, { value: x, criteria });
            }
          });
        }, function(err, results) {
          if (err) {
            return callback(err);
          } else {
            var fn = function(left, right) {
              var a = left.criteria, b = right.criteria;
              return a < b ? -1 : a > b ? 1 : 0;
            };
            callback(null, _map(results.sort(fn), function(x) {
              return x.value;
            }));
          }
        });
      };
      async.auto = function(tasks, callback) {
        callback = callback || function() {
        };
        var keys = _keys(tasks);
        var remainingTasks = keys.length;
        if (!remainingTasks) {
          return callback();
        }
        var results = {};
        var listeners = [];
        var addListener = function(fn) {
          listeners.unshift(fn);
        };
        var removeListener = function(fn) {
          for (var i2 = 0; i2 < listeners.length; i2 += 1) {
            if (listeners[i2] === fn) {
              listeners.splice(i2, 1);
              return;
            }
          }
        };
        var taskComplete = function() {
          remainingTasks--;
          _each(listeners.slice(0), function(fn) {
            fn();
          });
        };
        addListener(function() {
          if (!remainingTasks) {
            var theCallback = callback;
            callback = function() {
            };
            theCallback(null, results);
          }
        });
        _each(keys, function(k) {
          var task = _isArray(tasks[k]) ? tasks[k] : [tasks[k]];
          var taskCallback = function(err) {
            var args = Array.prototype.slice.call(arguments, 1);
            if (args.length <= 1) {
              args = args[0];
            }
            if (err) {
              var safeResults = {};
              _each(_keys(results), function(rkey) {
                safeResults[rkey] = results[rkey];
              });
              safeResults[k] = args;
              callback(err, safeResults);
              callback = function() {
              };
            } else {
              results[k] = args;
              async.setImmediate(taskComplete);
            }
          };
          var requires = task.slice(0, Math.abs(task.length - 1)) || [];
          var ready = function() {
            return _reduce(requires, function(a, x) {
              return a && results.hasOwnProperty(x);
            }, true) && !results.hasOwnProperty(k);
          };
          if (ready()) {
            task[task.length - 1](taskCallback, results);
          } else {
            var listener = function() {
              if (ready()) {
                removeListener(listener);
                task[task.length - 1](taskCallback, results);
              }
            };
            addListener(listener);
          }
        });
      };
      async.retry = function(times, task, callback) {
        var DEFAULT_TIMES = 5;
        var attempts = [];
        if (typeof times === "function") {
          callback = task;
          task = times;
          times = DEFAULT_TIMES;
        }
        times = parseInt(times, 10) || DEFAULT_TIMES;
        var wrappedTask = function(wrappedCallback, wrappedResults) {
          var retryAttempt = function(task2, finalAttempt) {
            return function(seriesCallback) {
              task2(function(err, result) {
                seriesCallback(!err || finalAttempt, { err, result });
              }, wrappedResults);
            };
          };
          while (times) {
            attempts.push(retryAttempt(task, !(times -= 1)));
          }
          async.series(attempts, function(done, data) {
            data = data[data.length - 1];
            (wrappedCallback || callback)(data.err, data.result);
          });
        };
        return callback ? wrappedTask() : wrappedTask;
      };
      async.waterfall = function(tasks, callback) {
        callback = callback || function() {
        };
        if (!_isArray(tasks)) {
          var err = new Error("First argument to waterfall must be an array of functions");
          return callback(err);
        }
        if (!tasks.length) {
          return callback();
        }
        var wrapIterator = function(iterator) {
          return function(err2) {
            if (err2) {
              callback.apply(null, arguments);
              callback = function() {
              };
            } else {
              var args = Array.prototype.slice.call(arguments, 1);
              var next = iterator.next();
              if (next) {
                args.push(wrapIterator(next));
              } else {
                args.push(callback);
              }
              async.setImmediate(function() {
                iterator.apply(null, args);
              });
            }
          };
        };
        wrapIterator(async.iterator(tasks))();
      };
      var _parallel = function(eachfn, tasks, callback) {
        callback = callback || function() {
        };
        if (_isArray(tasks)) {
          eachfn.map(tasks, function(fn, callback2) {
            if (fn) {
              fn(function(err) {
                var args = Array.prototype.slice.call(arguments, 1);
                if (args.length <= 1) {
                  args = args[0];
                }
                callback2.call(null, err, args);
              });
            }
          }, callback);
        } else {
          var results = {};
          eachfn.each(_keys(tasks), function(k, callback2) {
            tasks[k](function(err) {
              var args = Array.prototype.slice.call(arguments, 1);
              if (args.length <= 1) {
                args = args[0];
              }
              results[k] = args;
              callback2(err);
            });
          }, function(err) {
            callback(err, results);
          });
        }
      };
      async.parallel = function(tasks, callback) {
        _parallel({ map: async.map, each: async.each }, tasks, callback);
      };
      async.parallelLimit = function(tasks, limit, callback) {
        _parallel({ map: _mapLimit(limit), each: _eachLimit(limit) }, tasks, callback);
      };
      async.series = function(tasks, callback) {
        callback = callback || function() {
        };
        if (_isArray(tasks)) {
          async.mapSeries(tasks, function(fn, callback2) {
            if (fn) {
              fn(function(err) {
                var args = Array.prototype.slice.call(arguments, 1);
                if (args.length <= 1) {
                  args = args[0];
                }
                callback2.call(null, err, args);
              });
            }
          }, callback);
        } else {
          var results = {};
          async.eachSeries(_keys(tasks), function(k, callback2) {
            tasks[k](function(err) {
              var args = Array.prototype.slice.call(arguments, 1);
              if (args.length <= 1) {
                args = args[0];
              }
              results[k] = args;
              callback2(err);
            });
          }, function(err) {
            callback(err, results);
          });
        }
      };
      async.iterator = function(tasks) {
        var makeCallback = function(index) {
          var fn = function() {
            if (tasks.length) {
              tasks[index].apply(null, arguments);
            }
            return fn.next();
          };
          fn.next = function() {
            return index < tasks.length - 1 ? makeCallback(index + 1) : null;
          };
          return fn;
        };
        return makeCallback(0);
      };
      async.apply = function(fn) {
        var args = Array.prototype.slice.call(arguments, 1);
        return function() {
          return fn.apply(null, args.concat(Array.prototype.slice.call(arguments)));
        };
      };
      var _concat = function(eachfn, arr, fn, callback) {
        var r = [];
        eachfn(arr, function(x, cb) {
          fn(x, function(err, y) {
            r = r.concat(y || []);
            cb(err);
          });
        }, function(err) {
          callback(err, r);
        });
      };
      async.concat = doParallel(_concat);
      async.concatSeries = doSeries(_concat);
      async.whilst = function(test, iterator, callback) {
        if (test()) {
          iterator(function(err) {
            if (err) {
              return callback(err);
            }
            async.whilst(test, iterator, callback);
          });
        } else {
          callback();
        }
      };
      async.doWhilst = function(iterator, test, callback) {
        iterator(function(err) {
          if (err) {
            return callback(err);
          }
          var args = Array.prototype.slice.call(arguments, 1);
          if (test.apply(null, args)) {
            async.doWhilst(iterator, test, callback);
          } else {
            callback();
          }
        });
      };
      async.until = function(test, iterator, callback) {
        if (!test()) {
          iterator(function(err) {
            if (err) {
              return callback(err);
            }
            async.until(test, iterator, callback);
          });
        } else {
          callback();
        }
      };
      async.doUntil = function(iterator, test, callback) {
        iterator(function(err) {
          if (err) {
            return callback(err);
          }
          var args = Array.prototype.slice.call(arguments, 1);
          if (!test.apply(null, args)) {
            async.doUntil(iterator, test, callback);
          } else {
            callback();
          }
        });
      };
      async.queue = function(worker, concurrency) {
        if (concurrency === void 0) {
          concurrency = 1;
        }
        function _insert(q2, data, pos, callback) {
          if (!q2.started) {
            q2.started = true;
          }
          if (!_isArray(data)) {
            data = [data];
          }
          if (data.length == 0) {
            return async.setImmediate(function() {
              if (q2.drain) {
                q2.drain();
              }
            });
          }
          _each(data, function(task) {
            var item2 = {
              data: task,
              callback: typeof callback === "function" ? callback : null
            };
            if (pos) {
              q2.tasks.unshift(item2);
            } else {
              q2.tasks.push(item2);
            }
            if (q2.saturated && q2.tasks.length === q2.concurrency) {
              q2.saturated();
            }
            async.setImmediate(q2.process);
          });
        }
        var workers = 0;
        var q = {
          tasks: [],
          concurrency,
          saturated: null,
          empty: null,
          drain: null,
          started: false,
          paused: false,
          push: function(data, callback) {
            _insert(q, data, false, callback);
          },
          kill: function() {
            q.drain = null;
            q.tasks = [];
          },
          unshift: function(data, callback) {
            _insert(q, data, true, callback);
          },
          process: function() {
            if (!q.paused && workers < q.concurrency && q.tasks.length) {
              var task = q.tasks.shift();
              if (q.empty && q.tasks.length === 0) {
                q.empty();
              }
              workers += 1;
              var next = function() {
                workers -= 1;
                if (task.callback) {
                  task.callback.apply(task, arguments);
                }
                if (q.drain && q.tasks.length + workers === 0) {
                  q.drain();
                }
                q.process();
              };
              var cb = only_once(next);
              worker(task.data, cb);
            }
          },
          length: function() {
            return q.tasks.length;
          },
          running: function() {
            return workers;
          },
          idle: function() {
            return q.tasks.length + workers === 0;
          },
          pause: function() {
            if (q.paused === true) {
              return;
            }
            q.paused = true;
          },
          resume: function() {
            if (q.paused === false) {
              return;
            }
            q.paused = false;
            for (var w = 1; w <= q.concurrency; w++) {
              async.setImmediate(q.process);
            }
          }
        };
        return q;
      };
      async.priorityQueue = function(worker, concurrency) {
        function _compareTasks(a, b) {
          return a.priority - b.priority;
        }
        ;
        function _binarySearch(sequence, item2, compare) {
          var beg = -1, end = sequence.length - 1;
          while (beg < end) {
            var mid = beg + (end - beg + 1 >>> 1);
            if (compare(item2, sequence[mid]) >= 0) {
              beg = mid;
            } else {
              end = mid - 1;
            }
          }
          return beg;
        }
        function _insert(q2, data, priority, callback) {
          if (!q2.started) {
            q2.started = true;
          }
          if (!_isArray(data)) {
            data = [data];
          }
          if (data.length == 0) {
            return async.setImmediate(function() {
              if (q2.drain) {
                q2.drain();
              }
            });
          }
          _each(data, function(task) {
            var item2 = {
              data: task,
              priority,
              callback: typeof callback === "function" ? callback : null
            };
            q2.tasks.splice(_binarySearch(q2.tasks, item2, _compareTasks) + 1, 0, item2);
            if (q2.saturated && q2.tasks.length === q2.concurrency) {
              q2.saturated();
            }
            async.setImmediate(q2.process);
          });
        }
        var q = async.queue(worker, concurrency);
        q.push = function(data, priority, callback) {
          _insert(q, data, priority, callback);
        };
        delete q.unshift;
        return q;
      };
      async.cargo = function(worker, payload) {
        var working = false, tasks = [];
        var cargo = {
          tasks,
          payload,
          saturated: null,
          empty: null,
          drain: null,
          drained: true,
          push: function(data, callback) {
            if (!_isArray(data)) {
              data = [data];
            }
            _each(data, function(task) {
              tasks.push({
                data: task,
                callback: typeof callback === "function" ? callback : null
              });
              cargo.drained = false;
              if (cargo.saturated && tasks.length === payload) {
                cargo.saturated();
              }
            });
            async.setImmediate(cargo.process);
          },
          process: function process2() {
            if (working)
              return;
            if (tasks.length === 0) {
              if (cargo.drain && !cargo.drained)
                cargo.drain();
              cargo.drained = true;
              return;
            }
            var ts = typeof payload === "number" ? tasks.splice(0, payload) : tasks.splice(0, tasks.length);
            var ds = _map(ts, function(task) {
              return task.data;
            });
            if (cargo.empty)
              cargo.empty();
            working = true;
            worker(ds, function() {
              working = false;
              var args = arguments;
              _each(ts, function(data) {
                if (data.callback) {
                  data.callback.apply(null, args);
                }
              });
              process2();
            });
          },
          length: function() {
            return tasks.length;
          },
          running: function() {
            return working;
          }
        };
        return cargo;
      };
      var _console_fn = function(name2) {
        return function(fn) {
          var args = Array.prototype.slice.call(arguments, 1);
          fn.apply(null, args.concat([function(err) {
            var args2 = Array.prototype.slice.call(arguments, 1);
            if (typeof console !== "undefined") {
              if (err) {
                if (console.error) {
                  console.error(err);
                }
              } else if (console[name2]) {
                _each(args2, function(x) {
                  console[name2](x);
                });
              }
            }
          }]));
        };
      };
      async.log = _console_fn("log");
      async.dir = _console_fn("dir");
      async.memoize = function(fn, hasher) {
        var memo = {};
        var queues = {};
        hasher = hasher || function(x) {
          return x;
        };
        var memoized = function() {
          var args = Array.prototype.slice.call(arguments);
          var callback = args.pop();
          var key = hasher.apply(null, args);
          if (key in memo) {
            async.nextTick(function() {
              callback.apply(null, memo[key]);
            });
          } else if (key in queues) {
            queues[key].push(callback);
          } else {
            queues[key] = [callback];
            fn.apply(null, args.concat([function() {
              memo[key] = arguments;
              var q = queues[key];
              delete queues[key];
              for (var i2 = 0, l = q.length; i2 < l; i2++) {
                q[i2].apply(null, arguments);
              }
            }]));
          }
        };
        memoized.memo = memo;
        memoized.unmemoized = fn;
        return memoized;
      };
      async.unmemoize = function(fn) {
        return function() {
          return (fn.unmemoized || fn).apply(null, arguments);
        };
      };
      async.times = function(count, iterator, callback) {
        var counter = [];
        for (var i2 = 0; i2 < count; i2++) {
          counter.push(i2);
        }
        return async.map(counter, iterator, callback);
      };
      async.timesSeries = function(count, iterator, callback) {
        var counter = [];
        for (var i2 = 0; i2 < count; i2++) {
          counter.push(i2);
        }
        return async.mapSeries(counter, iterator, callback);
      };
      async.seq = function() {
        var fns = arguments;
        return function() {
          var that = this;
          var args = Array.prototype.slice.call(arguments);
          var callback = args.pop();
          async.reduce(fns, args, function(newargs, fn, cb) {
            fn.apply(that, newargs.concat([function() {
              var err = arguments[0];
              var nextargs = Array.prototype.slice.call(arguments, 1);
              cb(err, nextargs);
            }]));
          }, function(err, results) {
            callback.apply(that, [err].concat(results));
          });
        };
      };
      async.compose = function() {
        return async.seq.apply(null, Array.prototype.reverse.call(arguments));
      };
      var _applyEach = function(eachfn, fns) {
        var go = function() {
          var that = this;
          var args2 = Array.prototype.slice.call(arguments);
          var callback = args2.pop();
          return eachfn(fns, function(fn, cb) {
            fn.apply(that, args2.concat([cb]));
          }, callback);
        };
        if (arguments.length > 2) {
          var args = Array.prototype.slice.call(arguments, 2);
          return go.apply(this, args);
        } else {
          return go;
        }
      };
      async.applyEach = doParallel(_applyEach);
      async.applyEachSeries = doSeries(_applyEach);
      async.forever = function(fn, callback) {
        function next(err) {
          if (err) {
            if (callback) {
              return callback(err);
            }
            throw err;
          }
          fn(next);
        }
        next();
      };
      if (typeof module2 !== "undefined" && module2.exports) {
        module2.exports = async;
      } else if (typeof define !== "undefined" && define.amd) {
        define([], function() {
          return async;
        });
      } else {
        root2.async = async;
      }
    })();
  }
});

// node_modules/.pnpm/mute-stream@0.0.8/node_modules/mute-stream/mute.js
var require_mute = __commonJS({
  "node_modules/.pnpm/mute-stream@0.0.8/node_modules/mute-stream/mute.js"(exports2, module2) {
    var Stream = __require("stream");
    module2.exports = MuteStream;
    function MuteStream(opts) {
      Stream.apply(this);
      opts = opts || {};
      this.writable = this.readable = true;
      this.muted = false;
      this.on("pipe", this._onpipe);
      this.replace = opts.replace;
      this._prompt = opts.prompt || null;
      this._hadControl = false;
    }
    MuteStream.prototype = Object.create(Stream.prototype);
    Object.defineProperty(MuteStream.prototype, "constructor", {
      value: MuteStream,
      enumerable: false
    });
    MuteStream.prototype.mute = function() {
      this.muted = true;
    };
    MuteStream.prototype.unmute = function() {
      this.muted = false;
    };
    Object.defineProperty(MuteStream.prototype, "_onpipe", {
      value: onPipe,
      enumerable: false,
      writable: true,
      configurable: true
    });
    function onPipe(src) {
      this._src = src;
    }
    Object.defineProperty(MuteStream.prototype, "isTTY", {
      get: getIsTTY,
      set: setIsTTY,
      enumerable: true,
      configurable: true
    });
    function getIsTTY() {
      return this._dest ? this._dest.isTTY : this._src ? this._src.isTTY : false;
    }
    function setIsTTY(isTTY) {
      Object.defineProperty(this, "isTTY", {
        value: isTTY,
        enumerable: true,
        writable: true,
        configurable: true
      });
    }
    Object.defineProperty(MuteStream.prototype, "rows", {
      get: function() {
        return this._dest ? this._dest.rows : this._src ? this._src.rows : void 0;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(MuteStream.prototype, "columns", {
      get: function() {
        return this._dest ? this._dest.columns : this._src ? this._src.columns : void 0;
      },
      enumerable: true,
      configurable: true
    });
    MuteStream.prototype.pipe = function(dest, options) {
      this._dest = dest;
      return Stream.prototype.pipe.call(this, dest, options);
    };
    MuteStream.prototype.pause = function() {
      if (this._src)
        return this._src.pause();
    };
    MuteStream.prototype.resume = function() {
      if (this._src)
        return this._src.resume();
    };
    MuteStream.prototype.write = function(c) {
      if (this.muted) {
        if (!this.replace)
          return true;
        if (c.match(/^\u001b/)) {
          if (c.indexOf(this._prompt) === 0) {
            c = c.substr(this._prompt.length);
            c = c.replace(/./g, this.replace);
            c = this._prompt + c;
          }
          this._hadControl = true;
          return this.emit("data", c);
        } else {
          if (this._prompt && this._hadControl && c.indexOf(this._prompt) === 0) {
            this._hadControl = false;
            this.emit("data", this._prompt);
            c = c.substr(this._prompt.length);
          }
          c = c.toString().replace(/./g, this.replace);
        }
      }
      this.emit("data", c);
    };
    MuteStream.prototype.end = function(c) {
      if (this.muted) {
        if (c && this.replace) {
          c = c.toString().replace(/./g, this.replace);
        } else {
          c = null;
        }
      }
      if (c)
        this.emit("data", c);
      this.emit("end");
    };
    function proxy(fn) {
      return function() {
        var d = this._dest;
        var s = this._src;
        if (d && d[fn])
          d[fn].apply(d, arguments);
        if (s && s[fn])
          s[fn].apply(s, arguments);
      };
    }
    MuteStream.prototype.destroy = proxy("destroy");
    MuteStream.prototype.destroySoon = proxy("destroySoon");
    MuteStream.prototype.close = proxy("close");
  }
});

// node_modules/.pnpm/read@1.0.7/node_modules/read/lib/read.js
var require_read = __commonJS({
  "node_modules/.pnpm/read@1.0.7/node_modules/read/lib/read.js"(exports2, module2) {
    module2.exports = read2;
    var readline2 = __require("readline");
    var Mute = require_mute();
    function read2(opts, cb) {
      if (opts.num) {
        throw new Error("read() no longer accepts a char number limit");
      }
      if (typeof opts.default !== "undefined" && typeof opts.default !== "string" && typeof opts.default !== "number") {
        throw new Error("default value must be string or number");
      }
      var input = opts.input || process.stdin;
      var output = opts.output || process.stdout;
      var prompt3 = (opts.prompt || "").trim() + " ";
      var silent = opts.silent;
      var editDef = false;
      var timeout = opts.timeout;
      var def = opts.default || "";
      if (def) {
        if (silent) {
          prompt3 += "(<default hidden>) ";
        } else if (opts.edit) {
          editDef = true;
        } else {
          prompt3 += "(" + def + ") ";
        }
      }
      var terminal = !!(opts.terminal || output.isTTY);
      var m = new Mute({ replace: opts.replace, prompt: prompt3 });
      m.pipe(output, { end: false });
      output = m;
      var rlOpts = { input, output, terminal };
      if (process.version.match(/^v0\.6/)) {
        var rl = readline2.createInterface(rlOpts.input, rlOpts.output);
      } else {
        var rl = readline2.createInterface(rlOpts);
      }
      output.unmute();
      rl.setPrompt(prompt3);
      rl.prompt();
      if (silent) {
        output.mute();
      } else if (editDef) {
        rl.line = def;
        rl.cursor = def.length;
        rl._refreshLine();
      }
      var called = false;
      rl.on("line", onLine);
      rl.on("error", onError);
      rl.on("SIGINT", function() {
        rl.close();
        onError(new Error("canceled"));
      });
      var timer;
      if (timeout) {
        timer = setTimeout(function() {
          onError(new Error("timed out"));
        }, timeout);
      }
      function done() {
        called = true;
        rl.close();
        if (process.version.match(/^v0\.6/)) {
          rl.input.removeAllListeners("data");
          rl.input.removeAllListeners("keypress");
          rl.input.pause();
        }
        clearTimeout(timer);
        output.mute();
        output.end();
      }
      function onError(er) {
        if (called)
          return;
        done();
        return cb(er);
      }
      function onLine(line) {
        if (called)
          return;
        if (silent && terminal) {
          output.unmute();
          output.write("\r\n");
        }
        done();
        line = line.replace(/\r?\n$/, "");
        var isDefault = !!(editDef && line === def);
        if (def && !line) {
          isDefault = true;
          line = def;
        }
        cb(null, line, isDefault);
      }
    }
  }
});

// node_modules/.pnpm/revalidator@0.1.8/node_modules/revalidator/lib/revalidator.js
var require_revalidator = __commonJS({
  "node_modules/.pnpm/revalidator@0.1.8/node_modules/revalidator/lib/revalidator.js"(exports2, module2) {
    (function(exports3) {
      exports3.validate = validate;
      exports3.mixin = mixin;
      function validate(object, schema, options) {
        options = mixin({}, options, validate.defaults);
        var errors = [];
        validateObject(object, schema, options, errors);
        return {
          valid: !errors.length,
          errors
        };
      }
      ;
      validate.defaults = {
        validateFormats: true,
        validateFormatsStrict: false,
        validateFormatExtensions: true
      };
      validate.messages = {
        required: "is required",
        allowEmpty: "must not be empty",
        minLength: "is too short (minimum is %{expected} characters)",
        maxLength: "is too long (maximum is %{expected} characters)",
        pattern: "invalid input",
        minimum: "must be greater than or equal to %{expected}",
        maximum: "must be less than or equal to %{expected}",
        exclusiveMinimum: "must be greater than %{expected}",
        exclusiveMaximum: "must be less than %{expected}",
        divisibleBy: "must be divisible by %{expected}",
        minItems: "must contain more than %{expected} items",
        maxItems: "must contain less than %{expected} items",
        uniqueItems: "must hold a unique set of values",
        format: "is not a valid %{expected}",
        conform: "must conform to given constraint",
        type: "must be of %{expected} type"
      };
      validate.messages["enum"] = "must be present in given enumerator";
      validate.formats = {
        "email": /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i,
        "ip-address": /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/i,
        "ipv6": /^([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}$/,
        "date-time": /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:.\d{1,3})?Z$/,
        "date": /^\d{4}-\d{2}-\d{2}$/,
        "time": /^\d{2}:\d{2}:\d{2}$/,
        "color": /^#[a-z0-9]{6}|#[a-z0-9]{3}|(?:rgb\(\s*(?:[+-]?\d+%?)\s*,\s*(?:[+-]?\d+%?)\s*,\s*(?:[+-]?\d+%?)\s*\))aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|orange|purple|red|silver|teal|white|yellow$/i,
        "host-name": /^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])/,
        "utc-millisec": {
          test: function(value2) {
            return typeof value2 === "number" && value2 >= 0;
          }
        },
        "regex": {
          test: function(value2) {
            try {
              new RegExp(value2);
            } catch (e) {
              return false;
            }
            return true;
          }
        }
      };
      validate.formatExtensions = {
        "url": /^(https?|ftp|git):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i
      };
      function mixin(obj) {
        var sources = Array.prototype.slice.call(arguments, 1);
        while (sources.length) {
          var source = sources.shift();
          if (!source) {
            continue;
          }
          if (typeof source !== "object") {
            throw new TypeError("mixin non-object");
          }
          for (var p in source) {
            if (source.hasOwnProperty(p)) {
              obj[p] = source[p];
            }
          }
        }
        return obj;
      }
      ;
      function validateObject(object, schema, options, errors) {
        var props, allProps = Object.keys(object), visitedProps = [];
        if (schema.properties) {
          props = schema.properties;
          for (var p in props) {
            if (props.hasOwnProperty(p)) {
              visitedProps.push(p);
              validateProperty(object, object[p], p, props[p], options, errors);
            }
          }
        }
        if (schema.patternProperties) {
          props = schema.patternProperties;
          for (var p in props) {
            if (props.hasOwnProperty(p)) {
              var re = new RegExp(p);
              for (var k in object) {
                if (object.hasOwnProperty(k)) {
                  visitedProps.push(k);
                  if (re.exec(k) !== null) {
                    validateProperty(object, object[k], p, props[p], options, errors);
                  }
                }
              }
            }
          }
        }
        if (schema.additionalProperties !== void 0) {
          var i2, l;
          var unvisitedProps = allProps.filter(function(k2) {
            return visitedProps.indexOf(k2) === -1;
          });
          if (schema.additionalProperties === false && unvisitedProps.length > 0) {
            for (i2 = 0, l = unvisitedProps.length; i2 < l; i2++) {
              error("additionalProperties", unvisitedProps[i2], object[unvisitedProps[i2]], false, errors);
            }
          } else if (typeof schema.additionalProperties == "object" && unvisitedProps.length > 0) {
            for (i2 = 0, l = unvisitedProps.length; i2 < l; i2++) {
              validateProperty(object, object[unvisitedProps[i2]], unvisitedProps[i2], schema.unvisitedProperties, options, errors);
            }
          }
        }
      }
      ;
      function validateProperty(object, value2, property, schema, options, errors) {
        var format, valid, spec, type;
        function constrain(name2, value3, assert) {
          if (schema[name2] !== void 0 && !assert(value3, schema[name2])) {
            error(name2, property, value3, schema, errors);
          }
        }
        if (value2 === void 0) {
          if (schema.required && schema.type !== "any") {
            return error("required", property, void 0, schema, errors);
          } else {
            return;
          }
        }
        if (options.cast) {
          if ((schema.type === "integer" || schema.type === "number") && value2 == +value2) {
            value2 = +value2;
            object[property] = value2;
          }
          if (schema.type === "boolean") {
            if (value2 === "true" || value2 === "1" || value2 === 1) {
              value2 = true;
              object[property] = value2;
            }
            if (value2 === "false" || value2 === "0" || value2 === 0) {
              value2 = false;
              object[property] = value2;
            }
          }
        }
        if (schema.format && options.validateFormats) {
          format = schema.format;
          if (options.validateFormatExtensions) {
            spec = validate.formatExtensions[format];
          }
          if (!spec) {
            spec = validate.formats[format];
          }
          if (!spec) {
            if (options.validateFormatsStrict) {
              return error("format", property, value2, schema, errors);
            }
          } else {
            if (!spec.test(value2)) {
              return error("format", property, value2, schema, errors);
            }
          }
        }
        if (schema["enum"] && schema["enum"].indexOf(value2) === -1) {
          error("enum", property, value2, schema, errors);
        }
        if (typeof schema.dependencies === "string" && object[schema.dependencies] === void 0) {
          error("dependencies", property, null, schema, errors);
        }
        if (isArray(schema.dependencies)) {
          for (var i2 = 0, l = schema.dependencies.length; i2 < l; i2++) {
            if (object[schema.dependencies[i2]] === void 0) {
              error("dependencies", property, null, schema, errors);
            }
          }
        }
        if (typeof schema.dependencies === "object") {
          validateObject(object, schema.dependencies, options, errors);
        }
        checkType(value2, schema.type, function(err, type2) {
          if (err)
            return error("type", property, typeof value2, schema, errors);
          constrain("conform", value2, function(a, e) {
            return e(a, object);
          });
          switch (type2 || (isArray(value2) ? "array" : typeof value2)) {
            case "string":
              constrain("allowEmpty", value2, function(a, e) {
                return e ? e : a !== "";
              });
              constrain("minLength", value2.length, function(a, e) {
                return a >= e;
              });
              constrain("maxLength", value2.length, function(a, e) {
                return a <= e;
              });
              constrain("pattern", value2, function(a, e) {
                e = typeof e === "string" ? e = new RegExp(e) : e;
                return e.test(a);
              });
              break;
            case "integer":
            case "number":
              constrain("minimum", value2, function(a, e) {
                return a >= e;
              });
              constrain("maximum", value2, function(a, e) {
                return a <= e;
              });
              constrain("exclusiveMinimum", value2, function(a, e) {
                return a > e;
              });
              constrain("exclusiveMaximum", value2, function(a, e) {
                return a < e;
              });
              constrain("divisibleBy", value2, function(a, e) {
                var multiplier = Math.max((a - Math.floor(a)).toString().length - 2, (e - Math.floor(e)).toString().length - 2);
                multiplier = multiplier > 0 ? Math.pow(10, multiplier) : 1;
                return a * multiplier % (e * multiplier) === 0;
              });
              break;
            case "array":
              constrain("items", value2, function(a, e) {
                for (var i3 = 0, l2 = a.length; i3 < l2; i3++) {
                  validateProperty(object, a[i3], property, e, options, errors);
                }
                return true;
              });
              constrain("minItems", value2, function(a, e) {
                return a.length >= e;
              });
              constrain("maxItems", value2, function(a, e) {
                return a.length <= e;
              });
              constrain("uniqueItems", value2, function(a) {
                var h = {};
                for (var i3 = 0, l2 = a.length; i3 < l2; i3++) {
                  var key = JSON.stringify(a[i3]);
                  if (h[key])
                    return false;
                  h[key] = true;
                }
                return true;
              });
              break;
            case "object":
              if (schema.properties || schema.patternProperties || schema.additionalProperties) {
                validateObject(value2, schema, options, errors);
              }
              break;
          }
        });
      }
      ;
      function checkType(val, type, callback) {
        var result = false, types = isArray(type) ? type : [type];
        if (type === void 0)
          return callback(null, type);
        for (var i2 = 0, l = types.length; i2 < l; i2++) {
          type = types[i2].toLowerCase().trim();
          if (type === "string" ? typeof val === "string" : type === "array" ? isArray(val) : type === "object" ? val && typeof val === "object" && !isArray(val) : type === "number" ? typeof val === "number" : type === "integer" ? typeof val === "number" && ~~val === val : type === "null" ? val === null : type === "boolean" ? typeof val === "boolean" : type === "date" ? isDate(val) : type === "any" ? typeof val !== "undefined" : false) {
            return callback(null, type);
          }
        }
        ;
        callback(true);
      }
      ;
      function error(attribute, property, actual, schema, errors) {
        var lookup = { expected: schema[attribute], actual, attribute, property };
        var message = schema.messages && schema.messages[attribute] || schema.message || validate.messages[attribute] || "no default message";
        message = message.replace(/%\{([a-z]+)\}/ig, function(_, match) {
          return lookup[match.toLowerCase()] || "";
        });
        errors.push({
          attribute,
          property,
          expected: schema[attribute],
          actual,
          message
        });
      }
      ;
      function isArray(value2) {
        var s = typeof value2;
        if (s === "object") {
          if (value2) {
            if (typeof value2.length === "number" && !value2.propertyIsEnumerable("length") && typeof value2.splice === "function") {
              return true;
            }
          }
        }
        return false;
      }
      function isDate(value2) {
        var s = typeof value2;
        if (s === "object") {
          if (value2) {
            if (typeof value2.getTime === "function") {
              return true;
            }
          }
        }
        return false;
      }
    })(typeof module2 === "object" && module2 && module2.exports ? module2.exports : window);
  }
});

// node_modules/.pnpm/winston@2.4.5/node_modules/winston/package.json
var require_package = __commonJS({
  "node_modules/.pnpm/winston@2.4.5/node_modules/winston/package.json"(exports2, module2) {
    module2.exports = {
      name: "winston",
      description: "A multi-transport async logging library for Node.js",
      version: "2.4.5",
      author: "Charlie Robbins <charlie.robbins@gmail.com>",
      maintainers: [
        "Jarrett Cruger <jcrugzz@gmail.com>",
        "Alberto Pose <albertopose@gmail.com>"
      ],
      repository: {
        type: "git",
        url: "https://github.com/winstonjs/winston.git"
      },
      keywords: [
        "winston",
        "logging",
        "sysadmin",
        "tools"
      ],
      dependencies: {
        async: "~1.0.0",
        colors: "1.0.x",
        cycle: "1.0.x",
        eyes: "0.1.x",
        isstream: "0.1.x",
        "stack-trace": "0.0.x"
      },
      devDependencies: {
        "cross-spawn-async": "^2.0.0",
        hock: "1.x.x",
        "std-mocks": "~1.0.0",
        vows: "0.7.x"
      },
      main: "./lib/winston",
      scripts: {
        test: "vows --dot-matrix --isolate"
      },
      types: "./index.d.ts",
      engines: {
        node: ">= 0.10.0"
      },
      license: "MIT"
    };
  }
});

// node_modules/.pnpm/cycle@1.0.3/node_modules/cycle/cycle.js
var require_cycle = __commonJS({
  "node_modules/.pnpm/cycle@1.0.3/node_modules/cycle/cycle.js"(exports, module) {
    var cycle = exports;
    cycle.decycle = function decycle(object) {
      "use strict";
      var objects = [], paths = [];
      return function derez(value2, path2) {
        var i2, name2, nu;
        if (typeof value2 === "object" && value2 !== null && !(value2 instanceof Boolean) && !(value2 instanceof Date) && !(value2 instanceof Number) && !(value2 instanceof RegExp) && !(value2 instanceof String)) {
          for (i2 = 0; i2 < objects.length; i2 += 1) {
            if (objects[i2] === value2) {
              return { $ref: paths[i2] };
            }
          }
          objects.push(value2);
          paths.push(path2);
          if (Object.prototype.toString.apply(value2) === "[object Array]") {
            nu = [];
            for (i2 = 0; i2 < value2.length; i2 += 1) {
              nu[i2] = derez(value2[i2], path2 + "[" + i2 + "]");
            }
          } else {
            nu = {};
            for (name2 in value2) {
              if (Object.prototype.hasOwnProperty.call(value2, name2)) {
                nu[name2] = derez(value2[name2], path2 + "[" + JSON.stringify(name2) + "]");
              }
            }
          }
          return nu;
        }
        return value2;
      }(object, "$");
    };
    cycle.retrocycle = function retrocycle($) {
      "use strict";
      var px = /^\$(?:\[(?:\d+|\"(?:[^\\\"\u0000-\u001f]|\\([\\\"\/bfnrt]|u[0-9a-zA-Z]{4}))*\")\])*$/;
      (function rez(value) {
        var i, item, name, path;
        if (value && typeof value === "object") {
          if (Object.prototype.toString.apply(value) === "[object Array]") {
            for (i = 0; i < value.length; i += 1) {
              item = value[i];
              if (item && typeof item === "object") {
                path = item.$ref;
                if (typeof path === "string" && px.test(path)) {
                  value[i] = eval(path);
                } else {
                  rez(item);
                }
              }
            }
          } else {
            for (name in value) {
              if (typeof value[name] === "object") {
                item = value[name];
                if (item) {
                  path = item.$ref;
                  if (typeof path === "string" && px.test(path)) {
                    value[name] = eval(path);
                  } else {
                    rez(item);
                  }
                }
              }
            }
          }
        }
      })($);
      return $;
    };
  }
});

// node_modules/.pnpm/colors@1.0.3/node_modules/colors/lib/styles.js
var require_styles = __commonJS({
  "node_modules/.pnpm/colors@1.0.3/node_modules/colors/lib/styles.js"(exports2, module2) {
    var styles = {};
    module2["exports"] = styles;
    var codes = {
      reset: [0, 0],
      bold: [1, 22],
      dim: [2, 22],
      italic: [3, 23],
      underline: [4, 24],
      inverse: [7, 27],
      hidden: [8, 28],
      strikethrough: [9, 29],
      black: [30, 39],
      red: [31, 39],
      green: [32, 39],
      yellow: [33, 39],
      blue: [34, 39],
      magenta: [35, 39],
      cyan: [36, 39],
      white: [37, 39],
      gray: [90, 39],
      grey: [90, 39],
      bgBlack: [40, 49],
      bgRed: [41, 49],
      bgGreen: [42, 49],
      bgYellow: [43, 49],
      bgBlue: [44, 49],
      bgMagenta: [45, 49],
      bgCyan: [46, 49],
      bgWhite: [47, 49],
      blackBG: [40, 49],
      redBG: [41, 49],
      greenBG: [42, 49],
      yellowBG: [43, 49],
      blueBG: [44, 49],
      magentaBG: [45, 49],
      cyanBG: [46, 49],
      whiteBG: [47, 49]
    };
    Object.keys(codes).forEach(function(key) {
      var val = codes[key];
      var style = styles[key] = [];
      style.open = "[" + val[0] + "m";
      style.close = "[" + val[1] + "m";
    });
  }
});

// node_modules/.pnpm/colors@1.0.3/node_modules/colors/lib/system/supports-colors.js
var require_supports_colors = __commonJS({
  "node_modules/.pnpm/colors@1.0.3/node_modules/colors/lib/system/supports-colors.js"(exports2, module2) {
    var argv = process.argv;
    module2.exports = function() {
      if (argv.indexOf("--no-color") !== -1 || argv.indexOf("--color=false") !== -1) {
        return false;
      }
      if (argv.indexOf("--color") !== -1 || argv.indexOf("--color=true") !== -1 || argv.indexOf("--color=always") !== -1) {
        return true;
      }
      if (process.stdout && !process.stdout.isTTY) {
        return false;
      }
      if (process.platform === "win32") {
        return true;
      }
      if ("COLORTERM" in process.env) {
        return true;
      }
      if (process.env.TERM === "dumb") {
        return false;
      }
      if (/^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test(process.env.TERM)) {
        return true;
      }
      return false;
    }();
  }
});

// node_modules/.pnpm/colors@1.0.3/node_modules/colors/lib/custom/trap.js
var require_trap = __commonJS({
  "node_modules/.pnpm/colors@1.0.3/node_modules/colors/lib/custom/trap.js"(exports2, module2) {
    module2["exports"] = function runTheTrap(text, options) {
      var result = "";
      text = text || "Run the trap, drop the bass";
      text = text.split("");
      var trap = {
        a: ["@", "\u0104", "\u023A", "\u0245", "\u0394", "\u039B", "\u0414"],
        b: ["\xDF", "\u0181", "\u0243", "\u026E", "\u03B2", "\u0E3F"],
        c: ["\xA9", "\u023B", "\u03FE"],
        d: ["\xD0", "\u018A", "\u0500", "\u0501", "\u0502", "\u0503"],
        e: ["\xCB", "\u0115", "\u018E", "\u0258", "\u03A3", "\u03BE", "\u04BC", "\u0A6C"],
        f: ["\u04FA"],
        g: ["\u0262"],
        h: ["\u0126", "\u0195", "\u04A2", "\u04BA", "\u04C7", "\u050A"],
        i: ["\u0F0F"],
        j: ["\u0134"],
        k: ["\u0138", "\u04A0", "\u04C3", "\u051E"],
        l: ["\u0139"],
        m: ["\u028D", "\u04CD", "\u04CE", "\u0520", "\u0521", "\u0D69"],
        n: ["\xD1", "\u014B", "\u019D", "\u0376", "\u03A0", "\u048A"],
        o: ["\xD8", "\xF5", "\xF8", "\u01FE", "\u0298", "\u047A", "\u05DD", "\u06DD", "\u0E4F"],
        p: ["\u01F7", "\u048E"],
        q: ["\u09CD"],
        r: ["\xAE", "\u01A6", "\u0210", "\u024C", "\u0280", "\u042F"],
        s: ["\xA7", "\u03DE", "\u03DF", "\u03E8"],
        t: ["\u0141", "\u0166", "\u0373"],
        u: ["\u01B1", "\u054D"],
        v: ["\u05D8"],
        w: ["\u0428", "\u0460", "\u047C", "\u0D70"],
        x: ["\u04B2", "\u04FE", "\u04FC", "\u04FD"],
        y: ["\xA5", "\u04B0", "\u04CB"],
        z: ["\u01B5", "\u0240"]
      };
      text.forEach(function(c) {
        c = c.toLowerCase();
        var chars = trap[c] || [" "];
        var rand = Math.floor(Math.random() * chars.length);
        if (typeof trap[c] !== "undefined") {
          result += trap[c][rand];
        } else {
          result += c;
        }
      });
      return result;
    };
  }
});

// node_modules/.pnpm/colors@1.0.3/node_modules/colors/lib/custom/zalgo.js
var require_zalgo = __commonJS({
  "node_modules/.pnpm/colors@1.0.3/node_modules/colors/lib/custom/zalgo.js"(exports2, module2) {
    module2["exports"] = function zalgo(text, options) {
      text = text || "   he is here   ";
      var soul = {
        "up": [
          "\u030D",
          "\u030E",
          "\u0304",
          "\u0305",
          "\u033F",
          "\u0311",
          "\u0306",
          "\u0310",
          "\u0352",
          "\u0357",
          "\u0351",
          "\u0307",
          "\u0308",
          "\u030A",
          "\u0342",
          "\u0313",
          "\u0308",
          "\u034A",
          "\u034B",
          "\u034C",
          "\u0303",
          "\u0302",
          "\u030C",
          "\u0350",
          "\u0300",
          "\u0301",
          "\u030B",
          "\u030F",
          "\u0312",
          "\u0313",
          "\u0314",
          "\u033D",
          "\u0309",
          "\u0363",
          "\u0364",
          "\u0365",
          "\u0366",
          "\u0367",
          "\u0368",
          "\u0369",
          "\u036A",
          "\u036B",
          "\u036C",
          "\u036D",
          "\u036E",
          "\u036F",
          "\u033E",
          "\u035B",
          "\u0346",
          "\u031A"
        ],
        "down": [
          "\u0316",
          "\u0317",
          "\u0318",
          "\u0319",
          "\u031C",
          "\u031D",
          "\u031E",
          "\u031F",
          "\u0320",
          "\u0324",
          "\u0325",
          "\u0326",
          "\u0329",
          "\u032A",
          "\u032B",
          "\u032C",
          "\u032D",
          "\u032E",
          "\u032F",
          "\u0330",
          "\u0331",
          "\u0332",
          "\u0333",
          "\u0339",
          "\u033A",
          "\u033B",
          "\u033C",
          "\u0345",
          "\u0347",
          "\u0348",
          "\u0349",
          "\u034D",
          "\u034E",
          "\u0353",
          "\u0354",
          "\u0355",
          "\u0356",
          "\u0359",
          "\u035A",
          "\u0323"
        ],
        "mid": [
          "\u0315",
          "\u031B",
          "\u0300",
          "\u0301",
          "\u0358",
          "\u0321",
          "\u0322",
          "\u0327",
          "\u0328",
          "\u0334",
          "\u0335",
          "\u0336",
          "\u035C",
          "\u035D",
          "\u035E",
          "\u035F",
          "\u0360",
          "\u0362",
          "\u0338",
          "\u0337",
          "\u0361",
          " \u0489"
        ]
      }, all = [].concat(soul.up, soul.down, soul.mid), zalgo2 = {};
      function randomNumber(range) {
        var r = Math.floor(Math.random() * range);
        return r;
      }
      function is_char(character) {
        var bool = false;
        all.filter(function(i2) {
          bool = i2 === character;
        });
        return bool;
      }
      function heComes(text2, options2) {
        var result = "", counts, l;
        options2 = options2 || {};
        options2["up"] = options2["up"] || true;
        options2["mid"] = options2["mid"] || true;
        options2["down"] = options2["down"] || true;
        options2["size"] = options2["size"] || "maxi";
        text2 = text2.split("");
        for (l in text2) {
          if (is_char(l)) {
            continue;
          }
          result = result + text2[l];
          counts = { "up": 0, "down": 0, "mid": 0 };
          switch (options2.size) {
            case "mini":
              counts.up = randomNumber(8);
              counts.min = randomNumber(2);
              counts.down = randomNumber(8);
              break;
            case "maxi":
              counts.up = randomNumber(16) + 3;
              counts.min = randomNumber(4) + 1;
              counts.down = randomNumber(64) + 3;
              break;
            default:
              counts.up = randomNumber(8) + 1;
              counts.mid = randomNumber(6) / 2;
              counts.down = randomNumber(8) + 1;
              break;
          }
          var arr = ["up", "mid", "down"];
          for (var d in arr) {
            var index = arr[d];
            for (var i2 = 0; i2 <= counts[index]; i2++) {
              if (options2[index]) {
                result = result + soul[index][randomNumber(soul[index].length)];
              }
            }
          }
        }
        return result;
      }
      return heComes(text);
    };
  }
});

// node_modules/.pnpm/colors@1.0.3/node_modules/colors/lib/maps/america.js
var require_america = __commonJS({
  "node_modules/.pnpm/colors@1.0.3/node_modules/colors/lib/maps/america.js"(exports2, module2) {
    var colors = require_colors();
    module2["exports"] = function() {
      return function(letter, i2, exploded) {
        if (letter === " ")
          return letter;
        switch (i2 % 3) {
          case 0:
            return colors.red(letter);
          case 1:
            return colors.white(letter);
          case 2:
            return colors.blue(letter);
        }
      };
    }();
  }
});

// node_modules/.pnpm/colors@1.0.3/node_modules/colors/lib/maps/zebra.js
var require_zebra = __commonJS({
  "node_modules/.pnpm/colors@1.0.3/node_modules/colors/lib/maps/zebra.js"(exports2, module2) {
    var colors = require_colors();
    module2["exports"] = function(letter, i2, exploded) {
      return i2 % 2 === 0 ? letter : colors.inverse(letter);
    };
  }
});

// node_modules/.pnpm/colors@1.0.3/node_modules/colors/lib/maps/rainbow.js
var require_rainbow = __commonJS({
  "node_modules/.pnpm/colors@1.0.3/node_modules/colors/lib/maps/rainbow.js"(exports2, module2) {
    var colors = require_colors();
    module2["exports"] = function() {
      var rainbowColors = ["red", "yellow", "green", "blue", "magenta"];
      return function(letter, i2, exploded) {
        if (letter === " ") {
          return letter;
        } else {
          return colors[rainbowColors[i2++ % rainbowColors.length]](letter);
        }
      };
    }();
  }
});

// node_modules/.pnpm/colors@1.0.3/node_modules/colors/lib/maps/random.js
var require_random = __commonJS({
  "node_modules/.pnpm/colors@1.0.3/node_modules/colors/lib/maps/random.js"(exports2, module2) {
    var colors = require_colors();
    module2["exports"] = function() {
      var available = ["underline", "inverse", "grey", "yellow", "red", "green", "blue", "white", "cyan", "magenta"];
      return function(letter, i2, exploded) {
        return letter === " " ? letter : colors[available[Math.round(Math.random() * (available.length - 1))]](letter);
      };
    }();
  }
});

// node_modules/.pnpm/colors@1.0.3/node_modules/colors/lib/colors.js
var require_colors = __commonJS({
  "node_modules/.pnpm/colors@1.0.3/node_modules/colors/lib/colors.js"(exports2, module2) {
    var colors = {};
    module2["exports"] = colors;
    colors.themes = {};
    var ansiStyles = colors.styles = require_styles();
    var defineProps = Object.defineProperties;
    colors.supportsColor = require_supports_colors();
    if (typeof colors.enabled === "undefined") {
      colors.enabled = colors.supportsColor;
    }
    colors.stripColors = colors.strip = function(str) {
      return ("" + str).replace(/\x1B\[\d+m/g, "");
    };
    var stylize = colors.stylize = function stylize2(str, style) {
      return ansiStyles[style].open + str + ansiStyles[style].close;
    };
    var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;
    var escapeStringRegexp = function(str) {
      if (typeof str !== "string") {
        throw new TypeError("Expected a string");
      }
      return str.replace(matchOperatorsRe, "\\$&");
    };
    function build(_styles) {
      var builder = function builder2() {
        return applyStyle.apply(builder2, arguments);
      };
      builder._styles = _styles;
      builder.__proto__ = proto;
      return builder;
    }
    var styles = function() {
      var ret = {};
      ansiStyles.grey = ansiStyles.gray;
      Object.keys(ansiStyles).forEach(function(key) {
        ansiStyles[key].closeRe = new RegExp(escapeStringRegexp(ansiStyles[key].close), "g");
        ret[key] = {
          get: function() {
            return build(this._styles.concat(key));
          }
        };
      });
      return ret;
    }();
    var proto = defineProps(function colors2() {
    }, styles);
    function applyStyle() {
      var args = arguments;
      var argsLen = args.length;
      var str = argsLen !== 0 && String(arguments[0]);
      if (argsLen > 1) {
        for (var a = 1; a < argsLen; a++) {
          str += " " + args[a];
        }
      }
      if (!colors.enabled || !str) {
        return str;
      }
      var nestedStyles = this._styles;
      var i2 = nestedStyles.length;
      while (i2--) {
        var code = ansiStyles[nestedStyles[i2]];
        str = code.open + str.replace(code.closeRe, code.open) + code.close;
      }
      return str;
    }
    function applyTheme(theme) {
      for (var style in theme) {
        (function(style2) {
          colors[style2] = function(str) {
            return colors[theme[style2]](str);
          };
        })(style);
      }
    }
    colors.setTheme = function(theme) {
      if (typeof theme === "string") {
        try {
          colors.themes[theme] = __require(theme);
          applyTheme(colors.themes[theme]);
          return colors.themes[theme];
        } catch (err) {
          console.log(err);
          return err;
        }
      } else {
        applyTheme(theme);
      }
    };
    function init() {
      var ret = {};
      Object.keys(styles).forEach(function(name2) {
        ret[name2] = {
          get: function() {
            return build([name2]);
          }
        };
      });
      return ret;
    }
    var sequencer = function sequencer2(map2, str) {
      var exploded = str.split(""), i2 = 0;
      exploded = exploded.map(map2);
      return exploded.join("");
    };
    colors.trap = require_trap();
    colors.zalgo = require_zalgo();
    colors.maps = {};
    colors.maps.america = require_america();
    colors.maps.zebra = require_zebra();
    colors.maps.rainbow = require_rainbow();
    colors.maps.random = require_random();
    for (map in colors.maps) {
      (function(map2) {
        colors[map2] = function(str) {
          return sequencer(colors.maps[map2], str);
        };
      })(map);
    }
    var map;
    defineProps(colors, init());
  }
});

// node_modules/.pnpm/colors@1.0.3/node_modules/colors/safe.js
var require_safe = __commonJS({
  "node_modules/.pnpm/colors@1.0.3/node_modules/colors/safe.js"(exports2, module2) {
    var colors = require_colors();
    module2["exports"] = colors;
  }
});

// node_modules/.pnpm/winston@2.4.5/node_modules/winston/lib/winston/config/cli-config.js
var require_cli_config = __commonJS({
  "node_modules/.pnpm/winston@2.4.5/node_modules/winston/lib/winston/config/cli-config.js"(exports2) {
    var cliConfig = exports2;
    cliConfig.levels = {
      error: 0,
      warn: 1,
      help: 2,
      data: 3,
      info: 4,
      debug: 5,
      prompt: 6,
      verbose: 7,
      input: 8,
      silly: 9
    };
    cliConfig.colors = {
      error: "red",
      warn: "yellow",
      help: "cyan",
      data: "grey",
      info: "green",
      debug: "blue",
      prompt: "grey",
      verbose: "cyan",
      input: "grey",
      silly: "magenta"
    };
  }
});

// node_modules/.pnpm/winston@2.4.5/node_modules/winston/lib/winston/config/npm-config.js
var require_npm_config = __commonJS({
  "node_modules/.pnpm/winston@2.4.5/node_modules/winston/lib/winston/config/npm-config.js"(exports2) {
    var npmConfig = exports2;
    npmConfig.levels = {
      error: 0,
      warn: 1,
      info: 2,
      verbose: 3,
      debug: 4,
      silly: 5
    };
    npmConfig.colors = {
      error: "red",
      warn: "yellow",
      info: "green",
      verbose: "cyan",
      debug: "blue",
      silly: "magenta"
    };
  }
});

// node_modules/.pnpm/winston@2.4.5/node_modules/winston/lib/winston/config/syslog-config.js
var require_syslog_config = __commonJS({
  "node_modules/.pnpm/winston@2.4.5/node_modules/winston/lib/winston/config/syslog-config.js"(exports2) {
    var syslogConfig = exports2;
    syslogConfig.levels = {
      emerg: 0,
      alert: 1,
      crit: 2,
      error: 3,
      warning: 4,
      notice: 5,
      info: 6,
      debug: 7
    };
    syslogConfig.colors = {
      emerg: "red",
      alert: "yellow",
      crit: "red",
      error: "red",
      warning: "red",
      notice: "yellow",
      info: "green",
      debug: "blue"
    };
  }
});

// node_modules/.pnpm/winston@2.4.5/node_modules/winston/lib/winston/config.js
var require_config = __commonJS({
  "node_modules/.pnpm/winston@2.4.5/node_modules/winston/lib/winston/config.js"(exports2) {
    var colors = require_safe();
    colors.enabled = true;
    var config = exports2;
    var allColors = exports2.allColors = {};
    config.addColors = function(colors2) {
      mixin(allColors, colors2);
    };
    config.colorize = function(level, message) {
      if (typeof message === "undefined")
        message = level;
      var colorized = message;
      if (allColors[level] instanceof Array) {
        for (var i2 = 0, l = allColors[level].length; i2 < l; ++i2) {
          colorized = colors[allColors[level][i2]](colorized);
        }
      } else if (allColors[level].match(/\s/)) {
        var colorArr = allColors[level].split(/\s+/);
        for (var i2 = 0; i2 < colorArr.length; ++i2) {
          colorized = colors[colorArr[i2]](colorized);
        }
        allColors[level] = colorArr;
      } else {
        colorized = colors[allColors[level]](colorized);
      }
      return colorized;
    };
    config.cli = require_cli_config();
    config.npm = require_npm_config();
    config.syslog = require_syslog_config();
    config.addColors(config.cli.colors);
    config.addColors(config.npm.colors);
    config.addColors(config.syslog.colors);
    function mixin(target) {
      var args = Array.prototype.slice.call(arguments, 1);
      args.forEach(function(a) {
        var keys = Object.keys(a);
        for (var i2 = 0; i2 < keys.length; i2++) {
          target[keys[i2]] = a[keys[i2]];
        }
      });
      return target;
    }
  }
});

// node_modules/.pnpm/winston@2.4.5/node_modules/winston/lib/winston/common.js
var require_common2 = __commonJS({
  "node_modules/.pnpm/winston@2.4.5/node_modules/winston/lib/winston/common.js"(exports2) {
    var util = __require("util");
    var crypto2 = __require("crypto");
    var cycle2 = require_cycle();
    var fs3 = __require("fs");
    var StringDecoder = __require("string_decoder").StringDecoder;
    var Stream = __require("stream").Stream;
    var config = require_config();
    exports2.setLevels = function(target, past, current, isDefault) {
      var self2 = this;
      if (past) {
        Object.keys(past).forEach(function(level) {
          delete target[level];
        });
      }
      target.levels = current || config.npm.levels;
      if (target.padLevels) {
        target.levelLength = exports2.longestElement(Object.keys(target.levels));
      }
      Object.keys(target.levels).forEach(function(level) {
        if (level === "log") {
          console.warn('Log level named "log" will clash with the method "log". Consider using a different name.');
          return;
        }
        target[level] = function(msg) {
          var args = [level].concat(Array.prototype.slice.call(arguments));
          target.log.apply(target, args);
        };
      });
      return target;
    };
    exports2.longestElement = function(xs) {
      return Math.max.apply(null, xs.map(function(x) {
        return x.length;
      }));
    };
    exports2.clone = function(obj) {
      if (obj instanceof Error) {
        var copy2 = { message: obj.message };
        Object.getOwnPropertyNames(obj).forEach(function(key) {
          copy2[key] = obj[key];
        });
        return cycle2.decycle(copy2);
      } else if (!(obj instanceof Object)) {
        return obj;
      } else if (obj instanceof Date) {
        return new Date(obj.getTime());
      }
      return clone(cycle2.decycle(obj));
    };
    function clone(obj) {
      var copy2 = Array.isArray(obj) ? [] : {};
      for (var i2 in obj) {
        if (obj.hasOwnProperty(i2)) {
          if (Array.isArray(obj[i2])) {
            copy2[i2] = obj[i2].slice(0);
          } else if (obj[i2] instanceof Buffer) {
            copy2[i2] = obj[i2].slice(0);
          } else if (typeof obj[i2] != "function") {
            copy2[i2] = obj[i2] instanceof Object ? exports2.clone(obj[i2]) : obj[i2];
          } else if (typeof obj[i2] === "function") {
            copy2[i2] = obj[i2];
          }
        }
      }
      return copy2;
    }
    exports2.log = function(options) {
      var timestampFn = typeof options.timestamp === "function" ? options.timestamp : exports2.timestamp, timestamp = options.timestamp ? timestampFn() : null, showLevel = options.showLevel === void 0 ? true : options.showLevel, meta = options.meta !== null && options.meta !== void 0 ? exports2.clone(options.meta) : options.meta || null, output;
      if (options.raw) {
        if (typeof meta !== "object" && meta != null) {
          meta = { meta };
        }
        output = exports2.clone(meta) || {};
        output.level = options.level;
        output.message = options.message.stripColors ? options.message.stripColors : options.message;
        return JSON.stringify(output);
      }
      if (options.json || options.logstash === true) {
        if (typeof meta !== "object" && meta != null) {
          meta = { meta };
        }
        output = exports2.clone(meta) || {};
        output.level = options.level;
        output.message = output.message || "";
        if (options.label) {
          output.label = options.label;
        }
        if (options.message) {
          output.message = options.message;
        }
        if (timestamp) {
          output.timestamp = timestamp;
        }
        if (options.logstash === true) {
          var logstashOutput = {};
          if (output.message !== void 0) {
            logstashOutput["@message"] = output.message;
            delete output.message;
          }
          if (output.timestamp !== void 0) {
            logstashOutput["@timestamp"] = output.timestamp;
            delete output.timestamp;
          }
          logstashOutput["@fields"] = exports2.clone(output);
          output = logstashOutput;
        }
        if (typeof options.stringify === "function") {
          return options.stringify(output);
        }
        return JSON.stringify(output, function(key, value2) {
          return value2 instanceof Buffer ? value2.toString("base64") : value2;
        });
      }
      if (typeof options.formatter == "function") {
        options.meta = meta || options.meta;
        if (options.meta instanceof Error) {
          options.meta = exports2.clone(options.meta);
        }
        return String(options.formatter(exports2.clone(options)));
      }
      output = timestamp ? timestamp + " - " : "";
      if (showLevel) {
        output += options.colorize === "all" || options.colorize === "level" || options.colorize === true ? config.colorize(options.level) : options.level;
      }
      output += options.align ? "	" : "";
      output += timestamp || showLevel ? ": " : "";
      output += options.label ? "[" + options.label + "] " : "";
      output += options.colorize === "all" || options.colorize === "message" ? config.colorize(options.level, options.message) : options.message;
      if (meta !== null && meta !== void 0) {
        if (typeof meta !== "object") {
          output += " " + meta;
        } else if (Object.keys(meta).length > 0) {
          if (typeof options.prettyPrint === "function") {
            output += " " + options.prettyPrint(meta);
          } else if (options.prettyPrint) {
            output += " \n" + util.inspect(meta, false, options.depth || null, options.colorize);
          } else if (options.humanReadableUnhandledException && Object.keys(meta).length >= 5 && meta.hasOwnProperty("date") && meta.hasOwnProperty("process") && meta.hasOwnProperty("os") && meta.hasOwnProperty("trace") && meta.hasOwnProperty("stack")) {
            var stack = meta.stack;
            delete meta.stack;
            delete meta.trace;
            output += " " + exports2.serialize(meta);
            if (stack) {
              output += "\n" + stack.join("\n");
            }
          } else {
            output += " " + exports2.serialize(meta);
          }
        }
      }
      return output;
    };
    exports2.capitalize = function(str) {
      return str && str[0].toUpperCase() + str.slice(1);
    };
    exports2.hash = function(str) {
      return crypto2.createHash("sha1").update(str).digest("hex");
    };
    exports2.pad = function(n) {
      return n < 10 ? "0" + n.toString(10) : n.toString(10);
    };
    exports2.timestamp = function() {
      return new Date().toISOString();
    };
    exports2.serialize = function(obj, key) {
      if (typeof key === "symbol") {
        key = key.toString();
      }
      if (typeof obj === "symbol") {
        obj = obj.toString();
      }
      if (obj === null) {
        obj = "null";
      } else if (obj === void 0) {
        obj = "undefined";
      } else if (obj === false) {
        obj = "false";
      }
      if (typeof obj !== "object") {
        return key ? key + "=" + obj : obj;
      }
      if (obj instanceof Buffer) {
        return key ? key + "=" + obj.toString("base64") : obj.toString("base64");
      }
      var msg = "", keys = Object.keys(obj), length = keys.length;
      for (var i2 = 0; i2 < length; i2++) {
        if (Array.isArray(obj[keys[i2]])) {
          msg += keys[i2] + "=[";
          for (var j = 0, l = obj[keys[i2]].length; j < l; j++) {
            msg += exports2.serialize(obj[keys[i2]][j]);
            if (j < l - 1) {
              msg += ", ";
            }
          }
          msg += "]";
        } else if (obj[keys[i2]] instanceof Date) {
          msg += keys[i2] + "=" + obj[keys[i2]];
        } else {
          msg += exports2.serialize(obj[keys[i2]], keys[i2]);
        }
        if (i2 < length - 1) {
          msg += ", ";
        }
      }
      return msg;
    };
    exports2.tailFile = function(options, callback) {
      var buffer = Buffer.alloc(64 * 1024), decode = new StringDecoder("utf8"), stream = new Stream(), buff = "", pos = 0, row = 0;
      if (options.start === -1) {
        delete options.start;
      }
      stream.readable = true;
      stream.destroy = function() {
        stream.destroyed = true;
        stream.emit("end");
        stream.emit("close");
      };
      fs3.open(options.file, "a+", "0644", function(err, fd) {
        if (err) {
          if (!callback) {
            stream.emit("error", err);
          } else {
            callback(err);
          }
          stream.destroy();
          return;
        }
        (function read2() {
          if (stream.destroyed) {
            fs3.close(fd, nop);
            return;
          }
          return fs3.read(fd, buffer, 0, buffer.length, pos, function(err2, bytes) {
            if (err2) {
              if (!callback) {
                stream.emit("error", err2);
              } else {
                callback(err2);
              }
              stream.destroy();
              return;
            }
            if (!bytes) {
              if (buff) {
                if (options.start == null || row > options.start) {
                  if (!callback) {
                    stream.emit("line", buff);
                  } else {
                    callback(null, buff);
                  }
                }
                row++;
                buff = "";
              }
              return setTimeout(read2, 1e3);
            }
            var data = decode.write(buffer.slice(0, bytes));
            if (!callback) {
              stream.emit("data", data);
            }
            var data = (buff + data).split(/\n+/), l = data.length - 1, i2 = 0;
            for (; i2 < l; i2++) {
              if (options.start == null || row > options.start) {
                if (!callback) {
                  stream.emit("line", data[i2]);
                } else {
                  callback(null, data[i2]);
                }
              }
              row++;
            }
            buff = data[l];
            pos += bytes;
            return read2();
          });
        })();
      });
      if (!callback) {
        return stream;
      }
      return stream.destroy;
    };
    exports2.stringArrayToSet = function(strArray, errMsg) {
      if (typeof errMsg === "undefined") {
        errMsg = "Cannot make set from Array with non-string elements";
      }
      return strArray.reduce(function(set, el) {
        if (!(typeof el === "string" || el instanceof String)) {
          throw new Error(errMsg);
        }
        set[el] = true;
        return set;
      }, Object.create(null));
    };
    function nop() {
    }
  }
});

// node_modules/.pnpm/winston@2.4.5/node_modules/winston/lib/winston/transports/transport.js
var require_transport = __commonJS({
  "node_modules/.pnpm/winston@2.4.5/node_modules/winston/lib/winston/transports/transport.js"(exports2) {
    var events = __require("events");
    var util = __require("util");
    var Transport = exports2.Transport = function(options) {
      events.EventEmitter.call(this);
      options = options || {};
      this.silent = options.silent || false;
      this.raw = options.raw || false;
      this.name = options.name || this.name;
      this.formatter = options.formatter;
      this.level = options.level;
      this.handleExceptions = options.handleExceptions || false;
      this.exceptionsLevel = options.exceptionsLevel || "error";
      this.humanReadableUnhandledException = options.humanReadableUnhandledException || false;
    };
    util.inherits(Transport, events.EventEmitter);
    Transport.prototype.formatQuery = function(query) {
      return query;
    };
    Transport.prototype.normalizeQuery = function(options) {
      options = options || {};
      options.rows = options.rows || options.limit || 10;
      options.start = options.start || 0;
      options.until = options.until || new Date();
      if (typeof options.until !== "object") {
        options.until = new Date(options.until);
      }
      options.from = options.from || options.until - 24 * 60 * 60 * 1e3;
      if (typeof options.from !== "object") {
        options.from = new Date(options.from);
      }
      options.order = options.order || "desc";
      options.fields = options.fields;
      return options;
    };
    Transport.prototype.formatResults = function(results, options) {
      return results;
    };
    Transport.prototype.logException = function(msg, meta, callback) {
      var self2 = this, called;
      if (this.silent) {
        return callback();
      }
      function onComplete() {
        if (!called) {
          called = true;
          self2.removeListener("logged", onComplete);
          self2.removeListener("error", onComplete);
          callback();
        }
      }
      this.once("logged", onComplete);
      this.once("error", onComplete);
      this.log(self2.exceptionsLevel, msg, meta, function() {
      });
    };
  }
});

// node_modules/.pnpm/winston@2.4.5/node_modules/winston/lib/winston/transports/console.js
var require_console = __commonJS({
  "node_modules/.pnpm/winston@2.4.5/node_modules/winston/lib/winston/transports/console.js"(exports2) {
    var events = __require("events");
    var os = __require("os");
    var util = __require("util");
    var common = require_common2();
    var Transport = require_transport().Transport;
    var Console = exports2.Console = function(options) {
      Transport.call(this, options);
      options = options || {};
      this.json = options.json || false;
      this.colorize = options.colorize || false;
      this.prettyPrint = options.prettyPrint || false;
      this.timestamp = typeof options.timestamp !== "undefined" ? options.timestamp : false;
      this.showLevel = options.showLevel === void 0 ? true : options.showLevel;
      this.label = options.label || null;
      this.logstash = options.logstash || false;
      this.depth = options.depth || null;
      this.align = options.align || false;
      this.stderrLevels = setStderrLevels(options.stderrLevels, options.debugStdout);
      this.eol = options.eol || os.EOL;
      if (this.json) {
        this.stringify = options.stringify || function(obj) {
          return JSON.stringify(obj, null, 2);
        };
      }
      function setStderrLevels(levels, debugStdout) {
        var defaultMsg = "Cannot have non-string elements in stderrLevels Array";
        if (debugStdout) {
          if (levels) {
            throw new Error("Cannot set debugStdout and stderrLevels together");
          }
          return common.stringArrayToSet(["error"], defaultMsg);
        }
        if (!levels) {
          return common.stringArrayToSet(["error", "debug"], defaultMsg);
        } else if (!Array.isArray(levels)) {
          throw new Error("Cannot set stderrLevels to type other than Array");
        }
        return common.stringArrayToSet(levels, defaultMsg);
      }
      ;
    };
    util.inherits(Console, Transport);
    Console.prototype.name = "console";
    Console.prototype.log = function(level, msg, meta, callback) {
      if (this.silent) {
        return callback(null, true);
      }
      var self2 = this, output;
      output = common.log({
        colorize: this.colorize,
        json: this.json,
        level,
        message: msg,
        meta,
        stringify: this.stringify,
        timestamp: this.timestamp,
        showLevel: this.showLevel,
        prettyPrint: this.prettyPrint,
        raw: this.raw,
        label: this.label,
        logstash: this.logstash,
        depth: this.depth,
        formatter: this.formatter,
        align: this.align,
        humanReadableUnhandledException: this.humanReadableUnhandledException
      });
      if (this.stderrLevels[level]) {
        process.stderr.write(output + this.eol);
      } else {
        process.stdout.write(output + this.eol);
      }
      self2.emit("logged");
      callback(null, true);
    };
  }
});

// node_modules/.pnpm/async@1.0.0/node_modules/async/lib/async.js
var require_async2 = __commonJS({
  "node_modules/.pnpm/async@1.0.0/node_modules/async/lib/async.js"(exports2, module2) {
    (function() {
      var async = {};
      var noop = function() {
      };
      var root2, previous_async;
      if (typeof window == "object" && this === window) {
        root2 = window;
      } else if (typeof global == "object" && this === global) {
        root2 = global;
      } else {
        root2 = this;
      }
      if (root2 != null) {
        previous_async = root2.async;
      }
      async.noConflict = function() {
        root2.async = previous_async;
        return async;
      };
      function only_once(fn) {
        var called = false;
        return function() {
          if (called)
            throw new Error("Callback was already called.");
          called = true;
          fn.apply(root2, arguments);
        };
      }
      var _toString = Object.prototype.toString;
      var _isArray = Array.isArray || function(obj) {
        return _toString.call(obj) === "[object Array]";
      };
      var _each = function(arr, iterator) {
        var index = -1, length = arr.length;
        while (++index < length) {
          iterator(arr[index], index, arr);
        }
      };
      var _map = function(arr, iterator) {
        var index = -1, length = arr.length, result = Array(length);
        while (++index < length) {
          result[index] = iterator(arr[index], index, arr);
        }
        return result;
      };
      var _reduce = function(arr, iterator, memo) {
        _each(arr, function(x, i2, a) {
          memo = iterator(memo, x, i2, a);
        });
        return memo;
      };
      var _forEachOf = function(object, iterator) {
        _each(_keys(object), function(key) {
          iterator(object[key], key);
        });
      };
      var _keys = Object.keys || function(obj) {
        var keys = [];
        for (var k in obj) {
          if (obj.hasOwnProperty(k)) {
            keys.push(k);
          }
        }
        return keys;
      };
      var _baseSlice = function(arr, start) {
        start = start || 0;
        var index = -1;
        var length = arr.length;
        if (start) {
          length -= start;
          length = length < 0 ? 0 : length;
        }
        var result = Array(length);
        while (++index < length) {
          result[index] = arr[index + start];
        }
        return result;
      };
      var _setImmediate;
      if (typeof setImmediate === "function") {
        _setImmediate = setImmediate;
      }
      if (typeof process === "undefined" || !process.nextTick) {
        if (_setImmediate) {
          async.nextTick = function(fn) {
            _setImmediate(fn);
          };
          async.setImmediate = async.nextTick;
        } else {
          async.nextTick = function(fn) {
            setTimeout(fn, 0);
          };
          async.setImmediate = async.nextTick;
        }
      } else {
        async.nextTick = process.nextTick;
        if (_setImmediate) {
          async.setImmediate = function(fn) {
            _setImmediate(fn);
          };
        } else {
          async.setImmediate = async.nextTick;
        }
      }
      async.each = function(arr, iterator, callback) {
        callback = callback || noop;
        if (!arr.length) {
          return callback();
        }
        var completed = 0;
        _each(arr, function(x) {
          iterator(x, only_once(done));
        });
        function done(err) {
          if (err) {
            callback(err);
            callback = noop;
          } else {
            completed += 1;
            if (completed >= arr.length) {
              callback();
            }
          }
        }
      };
      async.forEach = async.each;
      async.eachSeries = function(arr, iterator, callback) {
        callback = callback || noop;
        if (!arr.length) {
          return callback();
        }
        var completed = 0;
        var iterate = function() {
          iterator(arr[completed], function(err) {
            if (err) {
              callback(err);
              callback = noop;
            } else {
              completed += 1;
              if (completed >= arr.length) {
                callback();
              } else {
                iterate();
              }
            }
          });
        };
        iterate();
      };
      async.forEachSeries = async.eachSeries;
      async.eachLimit = function(arr, limit, iterator, callback) {
        var fn = _eachLimit(limit);
        fn.apply(null, [arr, iterator, callback]);
      };
      async.forEachLimit = async.eachLimit;
      var _eachLimit = function(limit) {
        return function(arr, iterator, callback) {
          callback = callback || noop;
          if (!arr.length || limit <= 0) {
            return callback();
          }
          var completed = 0;
          var started = 0;
          var running = 0;
          (function replenish() {
            if (completed >= arr.length) {
              return callback();
            }
            while (running < limit && started < arr.length) {
              started += 1;
              running += 1;
              iterator(arr[started - 1], function(err) {
                if (err) {
                  callback(err);
                  callback = noop;
                } else {
                  completed += 1;
                  running -= 1;
                  if (completed >= arr.length) {
                    callback();
                  } else {
                    replenish();
                  }
                }
              });
            }
          })();
        };
      };
      async.forEachOf = async.eachOf = function(object, iterator, callback) {
        callback = callback || function() {
        };
        var size = object.length || _keys(object).length;
        var completed = 0;
        if (!size) {
          return callback();
        }
        _forEachOf(object, function(value2, key) {
          iterator(object[key], key, function(err) {
            if (err) {
              callback(err);
              callback = function() {
              };
            } else {
              completed += 1;
              if (completed === size) {
                callback(null);
              }
            }
          });
        });
      };
      async.forEachOfSeries = async.eachOfSeries = function(obj, iterator, callback) {
        callback = callback || function() {
        };
        var keys = _keys(obj);
        var size = keys.length;
        if (!size) {
          return callback();
        }
        var completed = 0;
        var iterate = function() {
          var sync = true;
          var key = keys[completed];
          iterator(obj[key], key, function(err) {
            if (err) {
              callback(err);
              callback = function() {
              };
            } else {
              completed += 1;
              if (completed >= size) {
                callback(null);
              } else {
                if (sync) {
                  async.nextTick(iterate);
                } else {
                  iterate();
                }
              }
            }
          });
          sync = false;
        };
        iterate();
      };
      async.forEachOfLimit = async.eachOfLimit = function(obj, limit, iterator, callback) {
        _forEachOfLimit(limit)(obj, iterator, callback);
      };
      var _forEachOfLimit = function(limit) {
        return function(obj, iterator, callback) {
          callback = callback || function() {
          };
          var keys = _keys(obj);
          var size = keys.length;
          if (!size || limit <= 0) {
            return callback();
          }
          var completed = 0;
          var started = 0;
          var running = 0;
          (function replenish() {
            if (completed >= size) {
              return callback();
            }
            while (running < limit && started < size) {
              started += 1;
              running += 1;
              var key = keys[started - 1];
              iterator(obj[key], key, function(err) {
                if (err) {
                  callback(err);
                  callback = function() {
                  };
                } else {
                  completed += 1;
                  running -= 1;
                  if (completed >= size) {
                    callback();
                  } else {
                    replenish();
                  }
                }
              });
            }
          })();
        };
      };
      var doParallel = function(fn) {
        return function() {
          var args = _baseSlice(arguments);
          return fn.apply(null, [async.each].concat(args));
        };
      };
      var doParallelLimit = function(limit, fn) {
        return function() {
          var args = _baseSlice(arguments);
          return fn.apply(null, [_eachLimit(limit)].concat(args));
        };
      };
      var doSeries = function(fn) {
        return function() {
          var args = _baseSlice(arguments);
          return fn.apply(null, [async.eachSeries].concat(args));
        };
      };
      var _asyncMap = function(eachfn, arr, iterator, callback) {
        arr = _map(arr, function(x, i2) {
          return { index: i2, value: x };
        });
        if (!callback) {
          eachfn(arr, function(x, callback2) {
            iterator(x.value, function(err) {
              callback2(err);
            });
          });
        } else {
          var results = [];
          eachfn(arr, function(x, callback2) {
            iterator(x.value, function(err, v) {
              results[x.index] = v;
              callback2(err);
            });
          }, function(err) {
            callback(err, results);
          });
        }
      };
      async.map = doParallel(_asyncMap);
      async.mapSeries = doSeries(_asyncMap);
      async.mapLimit = function(arr, limit, iterator, callback) {
        return _mapLimit(limit)(arr, iterator, callback);
      };
      var _mapLimit = function(limit) {
        return doParallelLimit(limit, _asyncMap);
      };
      async.reduce = function(arr, memo, iterator, callback) {
        async.eachSeries(arr, function(x, callback2) {
          iterator(memo, x, function(err, v) {
            memo = v;
            callback2(err);
          });
        }, function(err) {
          callback(err, memo);
        });
      };
      async.inject = async.reduce;
      async.foldl = async.reduce;
      async.reduceRight = function(arr, memo, iterator, callback) {
        var reversed = _map(arr, function(x) {
          return x;
        }).reverse();
        async.reduce(reversed, memo, iterator, callback);
      };
      async.foldr = async.reduceRight;
      var _filter = function(eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function(x, i2) {
          return { index: i2, value: x };
        });
        eachfn(arr, function(x, callback2) {
          iterator(x.value, function(v) {
            if (v) {
              results.push(x);
            }
            callback2();
          });
        }, function(err) {
          callback(_map(results.sort(function(a, b) {
            return a.index - b.index;
          }), function(x) {
            return x.value;
          }));
        });
      };
      async.filter = doParallel(_filter);
      async.filterSeries = doSeries(_filter);
      async.select = async.filter;
      async.selectSeries = async.filterSeries;
      var _reject = function(eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function(x, i2) {
          return { index: i2, value: x };
        });
        eachfn(arr, function(x, callback2) {
          iterator(x.value, function(v) {
            if (!v) {
              results.push(x);
            }
            callback2();
          });
        }, function(err) {
          callback(_map(results.sort(function(a, b) {
            return a.index - b.index;
          }), function(x) {
            return x.value;
          }));
        });
      };
      async.reject = doParallel(_reject);
      async.rejectSeries = doSeries(_reject);
      var _detect = function(eachfn, arr, iterator, main_callback) {
        eachfn(arr, function(x, callback) {
          iterator(x, function(result) {
            if (result) {
              main_callback(x);
              main_callback = noop;
            } else {
              callback();
            }
          });
        }, function(err) {
          main_callback();
        });
      };
      async.detect = doParallel(_detect);
      async.detectSeries = doSeries(_detect);
      async.some = function(arr, iterator, main_callback) {
        async.each(arr, function(x, callback) {
          iterator(x, function(v) {
            if (v) {
              main_callback(true);
              main_callback = noop;
            }
            callback();
          });
        }, function(err) {
          main_callback(false);
        });
      };
      async.any = async.some;
      async.every = function(arr, iterator, main_callback) {
        async.each(arr, function(x, callback) {
          iterator(x, function(v) {
            if (!v) {
              main_callback(false);
              main_callback = noop;
            }
            callback();
          });
        }, function(err) {
          main_callback(true);
        });
      };
      async.all = async.every;
      async.sortBy = function(arr, iterator, callback) {
        async.map(arr, function(x, callback2) {
          iterator(x, function(err, criteria) {
            if (err) {
              callback2(err);
            } else {
              callback2(null, { value: x, criteria });
            }
          });
        }, function(err, results) {
          if (err) {
            return callback(err);
          } else {
            var fn = function(left, right) {
              var a = left.criteria, b = right.criteria;
              return a < b ? -1 : a > b ? 1 : 0;
            };
            callback(null, _map(results.sort(fn), function(x) {
              return x.value;
            }));
          }
        });
      };
      async.auto = function(tasks, callback) {
        callback = callback || noop;
        var keys = _keys(tasks);
        var remainingTasks = keys.length;
        if (!remainingTasks) {
          return callback();
        }
        var results = {};
        var listeners = [];
        var addListener = function(fn) {
          listeners.unshift(fn);
        };
        var removeListener = function(fn) {
          for (var i2 = 0; i2 < listeners.length; i2 += 1) {
            if (listeners[i2] === fn) {
              listeners.splice(i2, 1);
              return;
            }
          }
        };
        var taskComplete = function() {
          remainingTasks--;
          _each(listeners.slice(0), function(fn) {
            fn();
          });
        };
        addListener(function() {
          if (!remainingTasks) {
            var theCallback = callback;
            callback = noop;
            theCallback(null, results);
          }
        });
        _each(keys, function(k) {
          var task = _isArray(tasks[k]) ? tasks[k] : [tasks[k]];
          var taskCallback = function(err) {
            var args = _baseSlice(arguments, 1);
            if (args.length <= 1) {
              args = args[0];
            }
            if (err) {
              var safeResults = {};
              _each(_keys(results), function(rkey) {
                safeResults[rkey] = results[rkey];
              });
              safeResults[k] = args;
              callback(err, safeResults);
              callback = noop;
            } else {
              results[k] = args;
              async.setImmediate(taskComplete);
            }
          };
          var requires = task.slice(0, Math.abs(task.length - 1)) || [];
          var len = requires.length;
          var dep;
          while (len--) {
            if (!(dep = tasks[requires[len]])) {
              throw new Error("Has inexistant dependency");
            }
            if (_isArray(dep) && !!~dep.indexOf(k)) {
              throw new Error("Has cyclic dependencies");
            }
          }
          var ready = function() {
            return _reduce(requires, function(a, x) {
              return a && results.hasOwnProperty(x);
            }, true) && !results.hasOwnProperty(k);
          };
          if (ready()) {
            task[task.length - 1](taskCallback, results);
          } else {
            var listener = function() {
              if (ready()) {
                removeListener(listener);
                task[task.length - 1](taskCallback, results);
              }
            };
            addListener(listener);
          }
        });
      };
      async.retry = function(times, task, callback) {
        var DEFAULT_TIMES = 5;
        var attempts = [];
        if (typeof times === "function") {
          callback = task;
          task = times;
          times = DEFAULT_TIMES;
        }
        times = parseInt(times, 10) || DEFAULT_TIMES;
        var wrappedTask = function(wrappedCallback, wrappedResults) {
          var retryAttempt = function(task2, finalAttempt) {
            return function(seriesCallback) {
              task2(function(err, result) {
                seriesCallback(!err || finalAttempt, { err, result });
              }, wrappedResults);
            };
          };
          while (times) {
            attempts.push(retryAttempt(task, !(times -= 1)));
          }
          async.series(attempts, function(done, data) {
            data = data[data.length - 1];
            (wrappedCallback || callback)(data.err, data.result);
          });
        };
        return callback ? wrappedTask() : wrappedTask;
      };
      async.waterfall = function(tasks, callback) {
        callback = callback || noop;
        if (!_isArray(tasks)) {
          var err = new Error("First argument to waterfall must be an array of functions");
          return callback(err);
        }
        if (!tasks.length) {
          return callback();
        }
        var wrapIterator = function(iterator) {
          return function(err2) {
            if (err2) {
              callback.apply(null, arguments);
              callback = noop;
            } else {
              var args = _baseSlice(arguments, 1);
              var next = iterator.next();
              if (next) {
                args.push(wrapIterator(next));
              } else {
                args.push(callback);
              }
              async.setImmediate(function() {
                iterator.apply(null, args);
              });
            }
          };
        };
        wrapIterator(async.iterator(tasks))();
      };
      var _parallel = function(eachfn, tasks, callback) {
        callback = callback || noop;
        if (_isArray(tasks)) {
          eachfn.map(tasks, function(fn, callback2) {
            if (fn) {
              fn(function(err) {
                var args = _baseSlice(arguments, 1);
                if (args.length <= 1) {
                  args = args[0];
                }
                callback2.call(null, err, args);
              });
            }
          }, callback);
        } else {
          var results = {};
          eachfn.each(_keys(tasks), function(k, callback2) {
            tasks[k](function(err) {
              var args = _baseSlice(arguments, 1);
              if (args.length <= 1) {
                args = args[0];
              }
              results[k] = args;
              callback2(err);
            });
          }, function(err) {
            callback(err, results);
          });
        }
      };
      async.parallel = function(tasks, callback) {
        _parallel({ map: async.map, each: async.each }, tasks, callback);
      };
      async.parallelLimit = function(tasks, limit, callback) {
        _parallel({ map: _mapLimit(limit), each: _eachLimit(limit) }, tasks, callback);
      };
      async.series = function(tasks, callback) {
        callback = callback || noop;
        if (_isArray(tasks)) {
          async.mapSeries(tasks, function(fn, callback2) {
            if (fn) {
              fn(function(err) {
                var args = _baseSlice(arguments, 1);
                if (args.length <= 1) {
                  args = args[0];
                }
                callback2.call(null, err, args);
              });
            }
          }, callback);
        } else {
          var results = {};
          async.eachSeries(_keys(tasks), function(k, callback2) {
            tasks[k](function(err) {
              var args = _baseSlice(arguments, 1);
              if (args.length <= 1) {
                args = args[0];
              }
              results[k] = args;
              callback2(err);
            });
          }, function(err) {
            callback(err, results);
          });
        }
      };
      async.iterator = function(tasks) {
        var makeCallback = function(index) {
          var fn = function() {
            if (tasks.length) {
              tasks[index].apply(null, arguments);
            }
            return fn.next();
          };
          fn.next = function() {
            return index < tasks.length - 1 ? makeCallback(index + 1) : null;
          };
          return fn;
        };
        return makeCallback(0);
      };
      async.apply = function(fn) {
        var args = _baseSlice(arguments, 1);
        return function() {
          return fn.apply(null, args.concat(_baseSlice(arguments)));
        };
      };
      var _concat = function(eachfn, arr, fn, callback) {
        var r = [];
        eachfn(arr, function(x, cb) {
          fn(x, function(err, y) {
            r = r.concat(y || []);
            cb(err);
          });
        }, function(err) {
          callback(err, r);
        });
      };
      async.concat = doParallel(_concat);
      async.concatSeries = doSeries(_concat);
      async.whilst = function(test, iterator, callback) {
        if (test()) {
          iterator(function(err) {
            if (err) {
              return callback(err);
            }
            async.whilst(test, iterator, callback);
          });
        } else {
          callback();
        }
      };
      async.doWhilst = function(iterator, test, callback) {
        iterator(function(err) {
          if (err) {
            return callback(err);
          }
          var args = _baseSlice(arguments, 1);
          if (test.apply(null, args)) {
            async.doWhilst(iterator, test, callback);
          } else {
            callback();
          }
        });
      };
      async.until = function(test, iterator, callback) {
        if (!test()) {
          iterator(function(err) {
            if (err) {
              return callback(err);
            }
            async.until(test, iterator, callback);
          });
        } else {
          callback();
        }
      };
      async.doUntil = function(iterator, test, callback) {
        iterator(function(err) {
          if (err) {
            return callback(err);
          }
          var args = _baseSlice(arguments, 1);
          if (!test.apply(null, args)) {
            async.doUntil(iterator, test, callback);
          } else {
            callback();
          }
        });
      };
      async.queue = function(worker, concurrency) {
        if (concurrency === void 0) {
          concurrency = 1;
        } else if (concurrency === 0) {
          throw new Error("Concurrency must not be zero");
        }
        function _insert(q2, data, pos, callback) {
          if (!q2.started) {
            q2.started = true;
          }
          if (!_isArray(data)) {
            data = [data];
          }
          if (data.length === 0) {
            return async.setImmediate(function() {
              if (q2.drain) {
                q2.drain();
              }
            });
          }
          _each(data, function(task) {
            var item2 = {
              data: task,
              callback: typeof callback === "function" ? callback : null
            };
            if (pos) {
              q2.tasks.unshift(item2);
            } else {
              q2.tasks.push(item2);
            }
            if (q2.saturated && q2.tasks.length === q2.concurrency) {
              q2.saturated();
            }
            async.setImmediate(q2.process);
          });
        }
        var workers = 0;
        var q = {
          tasks: [],
          concurrency,
          saturated: null,
          empty: null,
          drain: null,
          started: false,
          paused: false,
          push: function(data, callback) {
            _insert(q, data, false, callback);
          },
          kill: function() {
            q.drain = null;
            q.tasks = [];
          },
          unshift: function(data, callback) {
            _insert(q, data, true, callback);
          },
          process: function() {
            if (!q.paused && workers < q.concurrency && q.tasks.length) {
              var task = q.tasks.shift();
              if (q.empty && q.tasks.length === 0) {
                q.empty();
              }
              workers += 1;
              var next = function() {
                workers -= 1;
                if (task.callback) {
                  task.callback.apply(task, arguments);
                }
                if (q.drain && q.tasks.length + workers === 0) {
                  q.drain();
                }
                q.process();
              };
              var cb = only_once(next);
              worker(task.data, cb);
            }
          },
          length: function() {
            return q.tasks.length;
          },
          running: function() {
            return workers;
          },
          idle: function() {
            return q.tasks.length + workers === 0;
          },
          pause: function() {
            if (q.paused === true) {
              return;
            }
            q.paused = true;
          },
          resume: function() {
            if (q.paused === false) {
              return;
            }
            q.paused = false;
            var resumeCount = Math.min(q.concurrency, q.tasks.length);
            for (var w = 1; w <= resumeCount; w++) {
              async.setImmediate(q.process);
            }
          }
        };
        return q;
      };
      async.priorityQueue = function(worker, concurrency) {
        function _compareTasks(a, b) {
          return a.priority - b.priority;
        }
        function _binarySearch(sequence, item2, compare) {
          var beg = -1, end = sequence.length - 1;
          while (beg < end) {
            var mid = beg + (end - beg + 1 >>> 1);
            if (compare(item2, sequence[mid]) >= 0) {
              beg = mid;
            } else {
              end = mid - 1;
            }
          }
          return beg;
        }
        function _insert(q2, data, priority, callback) {
          if (!q2.started) {
            q2.started = true;
          }
          if (!_isArray(data)) {
            data = [data];
          }
          if (data.length === 0) {
            return async.setImmediate(function() {
              if (q2.drain) {
                q2.drain();
              }
            });
          }
          _each(data, function(task) {
            var item2 = {
              data: task,
              priority,
              callback: typeof callback === "function" ? callback : null
            };
            q2.tasks.splice(_binarySearch(q2.tasks, item2, _compareTasks) + 1, 0, item2);
            if (q2.saturated && q2.tasks.length === q2.concurrency) {
              q2.saturated();
            }
            async.setImmediate(q2.process);
          });
        }
        var q = async.queue(worker, concurrency);
        q.push = function(data, priority, callback) {
          _insert(q, data, priority, callback);
        };
        delete q.unshift;
        return q;
      };
      async.cargo = function(worker, payload) {
        var working = false, tasks = [];
        var cargo = {
          tasks,
          payload,
          saturated: null,
          empty: null,
          drain: null,
          drained: true,
          push: function(data, callback) {
            if (!_isArray(data)) {
              data = [data];
            }
            _each(data, function(task) {
              tasks.push({
                data: task,
                callback: typeof callback === "function" ? callback : null
              });
              cargo.drained = false;
              if (cargo.saturated && tasks.length === payload) {
                cargo.saturated();
              }
            });
            async.setImmediate(cargo.process);
          },
          process: function process2() {
            if (working)
              return;
            if (tasks.length === 0) {
              if (cargo.drain && !cargo.drained)
                cargo.drain();
              cargo.drained = true;
              return;
            }
            var ts = typeof payload === "number" ? tasks.splice(0, payload) : tasks.splice(0, tasks.length);
            var ds = _map(ts, function(task) {
              return task.data;
            });
            if (cargo.empty)
              cargo.empty();
            working = true;
            worker(ds, function() {
              working = false;
              var args = arguments;
              _each(ts, function(data) {
                if (data.callback) {
                  data.callback.apply(null, args);
                }
              });
              process2();
            });
          },
          length: function() {
            return tasks.length;
          },
          running: function() {
            return working;
          }
        };
        return cargo;
      };
      var _console_fn = function(name2) {
        return function(fn) {
          var args = _baseSlice(arguments, 1);
          fn.apply(null, args.concat([function(err) {
            var args2 = _baseSlice(arguments, 1);
            if (typeof console !== "undefined") {
              if (err) {
                if (console.error) {
                  console.error(err);
                }
              } else if (console[name2]) {
                _each(args2, function(x) {
                  console[name2](x);
                });
              }
            }
          }]));
        };
      };
      async.log = _console_fn("log");
      async.dir = _console_fn("dir");
      async.memoize = function(fn, hasher) {
        var memo = {};
        var queues = {};
        hasher = hasher || function(x) {
          return x;
        };
        var memoized = function() {
          var args = _baseSlice(arguments);
          var callback = args.pop();
          var key = hasher.apply(null, args);
          if (key in memo) {
            async.nextTick(function() {
              callback.apply(null, memo[key]);
            });
          } else if (key in queues) {
            queues[key].push(callback);
          } else {
            queues[key] = [callback];
            fn.apply(null, args.concat([function() {
              memo[key] = _baseSlice(arguments);
              var q = queues[key];
              delete queues[key];
              for (var i2 = 0, l = q.length; i2 < l; i2++) {
                q[i2].apply(null, arguments);
              }
            }]));
          }
        };
        memoized.memo = memo;
        memoized.unmemoized = fn;
        return memoized;
      };
      async.unmemoize = function(fn) {
        return function() {
          return (fn.unmemoized || fn).apply(null, arguments);
        };
      };
      async.times = function(count, iterator, callback) {
        var counter = [];
        for (var i2 = 0; i2 < count; i2++) {
          counter.push(i2);
        }
        return async.map(counter, iterator, callback);
      };
      async.timesSeries = function(count, iterator, callback) {
        var counter = [];
        for (var i2 = 0; i2 < count; i2++) {
          counter.push(i2);
        }
        return async.mapSeries(counter, iterator, callback);
      };
      async.seq = function() {
        var fns = arguments;
        return function() {
          var that = this;
          var args = _baseSlice(arguments);
          var callback = args.pop();
          async.reduce(fns, args, function(newargs, fn, cb) {
            fn.apply(that, newargs.concat([function() {
              var err = arguments[0];
              var nextargs = _baseSlice(arguments, 1);
              cb(err, nextargs);
            }]));
          }, function(err, results) {
            callback.apply(that, [err].concat(results));
          });
        };
      };
      async.compose = function() {
        return async.seq.apply(null, Array.prototype.reverse.call(arguments));
      };
      var _applyEach = function(eachfn, fns) {
        var go = function() {
          var that = this;
          var args2 = _baseSlice(arguments);
          var callback = args2.pop();
          return eachfn(fns, function(fn, cb) {
            fn.apply(that, args2.concat([cb]));
          }, callback);
        };
        if (arguments.length > 2) {
          var args = _baseSlice(arguments, 2);
          return go.apply(this, args);
        } else {
          return go;
        }
      };
      async.applyEach = doParallel(_applyEach);
      async.applyEachSeries = doSeries(_applyEach);
      async.forever = function(fn, callback) {
        function next(err) {
          if (err) {
            if (callback) {
              return callback(err);
            }
            throw err;
          }
          fn(next);
        }
        next();
      };
      if (typeof module2 !== "undefined" && module2.exports) {
        module2.exports = async;
      } else if (typeof define !== "undefined" && define.amd) {
        define([], function() {
          return async;
        });
      } else {
        root2.async = async;
      }
    })();
  }
});

// node_modules/.pnpm/isstream@0.1.2/node_modules/isstream/isstream.js
var require_isstream = __commonJS({
  "node_modules/.pnpm/isstream@0.1.2/node_modules/isstream/isstream.js"(exports2, module2) {
    var stream = __require("stream");
    function isStream(obj) {
      return obj instanceof stream.Stream;
    }
    function isReadable(obj) {
      return isStream(obj) && typeof obj._read == "function" && typeof obj._readableState == "object";
    }
    function isWritable(obj) {
      return isStream(obj) && typeof obj._write == "function" && typeof obj._writableState == "object";
    }
    function isDuplex(obj) {
      return isReadable(obj) && isWritable(obj);
    }
    module2.exports = isStream;
    module2.exports.isReadable = isReadable;
    module2.exports.isWritable = isWritable;
    module2.exports.isDuplex = isDuplex;
  }
});

// node_modules/.pnpm/winston@2.4.5/node_modules/winston/lib/winston/transports/file.js
var require_file2 = __commonJS({
  "node_modules/.pnpm/winston@2.4.5/node_modules/winston/lib/winston/transports/file.js"(exports2) {
    var events = __require("events");
    var fs3 = __require("fs");
    var path2 = __require("path");
    var util = __require("util");
    var async = require_async2();
    var zlib = __require("zlib");
    var common = require_common2();
    var Transport = require_transport().Transport;
    var isWritable = require_isstream().isWritable;
    var Stream = __require("stream").Stream;
    var os = __require("os");
    var File = exports2.File = function(options) {
      var self2 = this;
      Transport.call(this, options);
      function throwIf(target) {
        Array.prototype.slice.call(arguments, 1).forEach(function(name2) {
          if (options[name2]) {
            throw new Error("Cannot set " + name2 + " and " + target + "together");
          }
        });
      }
      if (options.filename || options.dirname) {
        throwIf("filename or dirname", "stream");
        this._basename = this.filename = options.filename ? path2.basename(options.filename) : "winston.log";
        this.dirname = options.dirname || path2.dirname(options.filename);
        this.options = options.options || { flags: "a" };
        this.options.highWaterMark = this.options.highWaterMark || 24;
      } else if (options.stream) {
        throwIf("stream", "filename", "maxsize");
        this._stream = options.stream;
        this._isStreams2 = isWritable(this._stream);
        this._stream.on("error", function(error) {
          self2.emit("error", error);
        });
        this._stream.setMaxListeners(Infinity);
      } else {
        throw new Error("Cannot log to file without filename or stream.");
      }
      this.json = options.json !== false;
      this.logstash = options.logstash || false;
      this.colorize = options.colorize || false;
      this.maxsize = options.maxsize || null;
      this.rotationFormat = options.rotationFormat || false;
      this.zippedArchive = options.zippedArchive || false;
      this.maxFiles = options.maxFiles || null;
      this.prettyPrint = options.prettyPrint || false;
      this.label = options.label || null;
      this.timestamp = options.timestamp != null ? options.timestamp : true;
      this.eol = options.eol || os.EOL;
      this.tailable = options.tailable || false;
      this.depth = options.depth || null;
      this.showLevel = options.showLevel === void 0 ? true : options.showLevel;
      this.maxRetries = options.maxRetries || 2;
      if (this.json) {
        this.stringify = options.stringify;
      }
      this._size = 0;
      this._created = 0;
      this._buffer = [];
      this._draining = false;
      this._opening = false;
      this._failures = 0;
      this._archive = null;
    };
    util.inherits(File, Transport);
    File.prototype.name = "file";
    File.prototype.log = function(level, msg, meta, callback) {
      if (this.silent) {
        return callback(null, true);
      }
      if (this._failures >= this.maxRetries) {
        return callback(new Error("Transport is in a failed state."));
      }
      var self2 = this;
      if (typeof msg !== "string") {
        msg = "" + msg;
      }
      var output = common.log({
        level,
        message: msg,
        meta,
        json: this.json,
        logstash: this.logstash,
        colorize: this.colorize,
        prettyPrint: this.prettyPrint,
        timestamp: this.timestamp,
        showLevel: this.showLevel,
        stringify: this.stringify,
        label: this.label,
        depth: this.depth,
        formatter: this.formatter,
        humanReadableUnhandledException: this.humanReadableUnhandledException
      });
      if (typeof output === "string") {
        output += this.eol;
      }
      if (!this.filename) {
        this._write(output, callback);
        this._size += output.length;
        this._lazyDrain();
      } else {
        this.open(function(err) {
          if (err) {
            return self2._buffer.push([output, callback]);
          }
          self2._write(output, callback);
          self2._size += output.length;
          self2._lazyDrain();
        });
      }
    };
    File.prototype._write = function(data, callback) {
      if (this._isStreams2) {
        this._stream.write(data);
        return callback && process.nextTick(function() {
          callback(null, true);
        });
      }
      var ret = this._stream.write(data);
      if (!callback)
        return;
      if (ret === false) {
        return this._stream.once("drain", function() {
          callback(null, true);
        });
      }
      process.nextTick(function() {
        callback(null, true);
      });
    };
    File.prototype.query = function(options, callback) {
      if (typeof options === "function") {
        callback = options;
        options = {};
      }
      var file = path2.join(this.dirname, this.filename), options = this.normalizeQuery(options), buff = "", results = [], row = 0;
      var stream = fs3.createReadStream(file, {
        encoding: "utf8"
      });
      stream.on("error", function(err) {
        if (stream.readable) {
          stream.destroy();
        }
        if (!callback)
          return;
        return err.code !== "ENOENT" ? callback(err) : callback(null, results);
      });
      stream.on("data", function(data) {
        var data = (buff + data).split(/\n+/), l = data.length - 1, i2 = 0;
        for (; i2 < l; i2++) {
          if (!options.start || row >= options.start) {
            add(data[i2]);
          }
          row++;
        }
        buff = data[l];
      });
      stream.on("close", function() {
        if (buff)
          add(buff, true);
        if (options.order === "desc") {
          results = results.reverse();
        }
        if (callback)
          callback(null, results);
      });
      function add(buff2, attempt) {
        try {
          var log3 = JSON.parse(buff2);
          if (check(log3))
            push(log3);
        } catch (e) {
          if (!attempt) {
            stream.emit("error", e);
          }
        }
      }
      function push(log3) {
        if (options.rows && results.length >= options.rows && options.order != "desc") {
          if (stream.readable) {
            stream.destroy();
          }
          return;
        }
        if (options.fields) {
          var obj = {};
          options.fields.forEach(function(key) {
            obj[key] = log3[key];
          });
          log3 = obj;
        }
        if (options.order === "desc") {
          if (results.length >= options.rows) {
            results.shift();
          }
        }
        results.push(log3);
      }
      function check(log3) {
        if (!log3)
          return;
        if (typeof log3 !== "object")
          return;
        var time = new Date(log3.timestamp);
        if (options.from && time < options.from || options.until && time > options.until || options.level && options.level !== log3.level) {
          return;
        }
        return true;
      }
    };
    File.prototype.stream = function(options) {
      var file = path2.join(this.dirname, this.filename), options = options || {}, stream = new Stream();
      var tail = {
        file,
        start: options.start
      };
      stream.destroy = common.tailFile(tail, function(err, line) {
        if (err) {
          return stream.emit("error", err);
        }
        try {
          stream.emit("data", line);
          line = JSON.parse(line);
          stream.emit("log", line);
        } catch (e) {
          stream.emit("error", e);
        }
      });
      return stream;
    };
    File.prototype.open = function(callback) {
      if (this.opening) {
        return callback(true);
      } else if (!this._stream || this.maxsize && this._size >= this.maxsize) {
        callback(true);
        return this._createStream();
      }
      this._archive = this.zippedArchive ? this._stream.path : null;
      callback();
    };
    File.prototype.close = function() {
      var self2 = this;
      if (this._stream) {
        this._stream.end();
        this._stream.destroySoon();
        this._stream.once("finish", function() {
          self2.emit("flush");
          self2.emit("closed");
        });
      }
    };
    File.prototype.flush = function() {
      var self2 = this;
      if (!this._buffer.length) {
        return self2.emit("flush");
      }
      this._buffer.forEach(function(item2) {
        var str = item2[0], callback = item2[1];
        process.nextTick(function() {
          self2._write(str, callback);
          self2._size += str.length;
        });
      });
      self2._buffer.length = 0;
      self2._stream.once("drain", function() {
        self2.emit("flush");
        self2.emit("logged");
      });
    };
    File.prototype._createStream = function() {
      var self2 = this;
      this.opening = true;
      (function checkFile(target) {
        var fullname = path2.join(self2.dirname, target);
        function createAndFlush(size) {
          if (self2._stream) {
            self2._stream.end();
            self2._stream.destroySoon();
          }
          self2._size = size;
          self2.filename = target;
          self2._stream = fs3.createWriteStream(fullname, self2.options);
          self2._isStreams2 = isWritable(self2._stream);
          self2._stream.on("error", function(error) {
            if (self2._failures < self2.maxRetries) {
              self2._createStream();
              self2._failures++;
            } else {
              self2.emit("error", error);
            }
          });
          self2._stream.setMaxListeners(Infinity);
          self2.once("flush", function() {
            self2.flush();
            self2.opening = false;
            self2.emit("open", fullname);
          });
          self2.flush();
          compressFile();
        }
        function compressFile() {
          if (self2._archive) {
            var gzip = zlib.createGzip();
            var inp = fs3.createReadStream(String(self2._archive));
            var out = fs3.createWriteStream(self2._archive + ".gz");
            inp.pipe(gzip).pipe(out);
            fs3.unlink(String(self2._archive), function() {
            });
            self2._archive = "";
          }
        }
        fs3.stat(fullname, function(err, stats) {
          if (err) {
            if (err.code !== "ENOENT") {
              return self2.emit("error", err);
            }
            return createAndFlush(0);
          }
          if (!stats || self2.maxsize && stats.size >= self2.maxsize) {
            return self2._incFile(function() {
              checkFile(self2._getFile());
            });
          }
          createAndFlush(stats.size);
        });
      })(this._getFile());
    };
    File.prototype._incFile = function(callback) {
      var ext = path2.extname(this._basename), basename = path2.basename(this._basename, ext), oldest, target;
      if (!this.tailable) {
        this._created += 1;
        this._checkMaxFilesIncrementing(ext, basename, callback);
      } else {
        this._checkMaxFilesTailable(ext, basename, callback);
      }
    };
    File.prototype._getFile = function() {
      var ext = path2.extname(this._basename), basename = path2.basename(this._basename, ext);
      return !this.tailable && this._created ? basename + (this.rotationFormat ? this.rotationFormat() : this._created) + ext : basename + ext;
    };
    File.prototype._checkMaxFilesIncrementing = function(ext, basename, callback) {
      var oldest, target, self2 = this;
      if (self2.zippedArchive) {
        self2._archive = path2.join(self2.dirname, basename + (self2._created === 1 ? "" : self2._created - 1) + ext);
      }
      if (!self2.maxFiles || self2._created < self2.maxFiles) {
        return callback();
      }
      oldest = self2._created - self2.maxFiles;
      target = path2.join(self2.dirname, basename + (oldest !== 0 ? oldest : "") + ext + (self2.zippedArchive ? ".gz" : ""));
      fs3.unlink(target, callback);
    };
    File.prototype._checkMaxFilesTailable = function(ext, basename, callback) {
      var tasks = [], self2 = this;
      if (!this.maxFiles)
        return;
      for (var x = this.maxFiles - 1; x > 0; x--) {
        tasks.push(function(i2) {
          return function(cb) {
            var tmppath = path2.join(self2.dirname, basename + (i2 - 1) + ext + (self2.zippedArchive ? ".gz" : ""));
            fs3.exists(tmppath, function(exists2) {
              if (!exists2) {
                return cb(null);
              }
              fs3.rename(tmppath, path2.join(self2.dirname, basename + i2 + ext + (self2.zippedArchive ? ".gz" : "")), cb);
            });
          };
        }(x));
      }
      if (self2.zippedArchive) {
        self2._archive = path2.join(self2.dirname, basename + 1 + ext);
      }
      async.series(tasks, function(err) {
        fs3.rename(path2.join(self2.dirname, basename + ext), path2.join(self2.dirname, basename + 1 + ext), callback);
      });
    };
    File.prototype._lazyDrain = function() {
      var self2 = this;
      if (!this._draining && this._stream) {
        this._draining = true;
        this._stream.once("drain", function() {
          self2._draining = false;
          self2.emit("logged");
        });
      }
    };
  }
});

// node_modules/.pnpm/winston@2.4.5/node_modules/winston/lib/winston/transports/http.js
var require_http = __commonJS({
  "node_modules/.pnpm/winston@2.4.5/node_modules/winston/lib/winston/transports/http.js"(exports2) {
    var util = __require("util");
    var winston = require_winston();
    var http2 = __require("http");
    var https = __require("https");
    var Stream = __require("stream").Stream;
    var Transport = require_transport().Transport;
    var Http = exports2.Http = function(options) {
      Transport.call(this, options);
      options = options || {};
      this.name = "http";
      this.ssl = !!options.ssl;
      this.host = options.host || "localhost";
      this.port = options.port;
      this.auth = options.auth;
      this.path = options.path || "";
      this.agent = options.agent;
      this.headers = options.headers || {};
      this.headers["content-type"] = "application/json";
      if (!this.port) {
        this.port = this.ssl ? 443 : 80;
      }
    };
    util.inherits(Http, winston.Transport);
    Http.prototype.name = "http";
    Http.prototype._request = function(options, callback) {
      options = options || {};
      var auth = options.auth || this.auth, path2 = options.path || this.path || "", req;
      delete options.auth;
      delete options.path;
      req = (this.ssl ? https : http2).request({
        host: this.host,
        port: this.port,
        path: "/" + path2.replace(/^\//, ""),
        method: "POST",
        headers: this.headers,
        agent: this.agent,
        auth: auth ? auth.username + ":" + auth.password : ""
      });
      req.on("error", callback);
      req.on("response", function(res) {
        var body = "";
        res.on("data", function(chunk) {
          body += chunk;
        });
        res.on("end", function() {
          callback(null, res, body);
        });
        res.resume();
      });
      req.end(new Buffer.from(JSON.stringify(options), "utf8"));
    };
    Http.prototype.log = function(level, msg, meta, callback) {
      var self2 = this;
      if (typeof meta === "function") {
        callback = meta;
        meta = {};
      }
      var options = {
        method: "collect",
        params: {
          level,
          message: msg,
          meta
        }
      };
      if (meta) {
        if (meta.path) {
          options.path = meta.path;
          delete meta.path;
        }
        if (meta.auth) {
          options.auth = meta.auth;
          delete meta.auth;
        }
      }
      this._request(options, function(err, res) {
        if (res && res.statusCode !== 200) {
          err = new Error("HTTP Status Code: " + res.statusCode);
        }
        if (err)
          return callback(err);
        self2.emit("logged");
        if (callback)
          callback(null, true);
      });
    };
    Http.prototype.query = function(options, callback) {
      if (typeof options === "function") {
        callback = options;
        options = {};
      }
      var self2 = this, options = this.normalizeQuery(options);
      options = {
        method: "query",
        params: options
      };
      if (options.params.path) {
        options.path = options.params.path;
        delete options.params.path;
      }
      if (options.params.auth) {
        options.auth = options.params.auth;
        delete options.params.auth;
      }
      this._request(options, function(err, res, body) {
        if (res && res.statusCode !== 200) {
          err = new Error("HTTP Status Code: " + res.statusCode);
        }
        if (err)
          return callback(err);
        if (typeof body === "string") {
          try {
            body = JSON.parse(body);
          } catch (e) {
            return callback(e);
          }
        }
        callback(null, body);
      });
    };
    Http.prototype.stream = function(options) {
      options = options || {};
      var self2 = this, stream = new Stream(), req, buff;
      stream.destroy = function() {
        req.destroy();
      };
      options = {
        method: "stream",
        params: options
      };
      if (options.params.path) {
        options.path = options.params.path;
        delete options.params.path;
      }
      if (options.params.auth) {
        options.auth = options.params.auth;
        delete options.params.auth;
      }
      req = this._request(options);
      buff = "";
      req.on("data", function(data) {
        var data = (buff + data).split(/\n+/), l = data.length - 1, i2 = 0;
        for (; i2 < l; i2++) {
          try {
            stream.emit("log", JSON.parse(data[i2]));
          } catch (e) {
            stream.emit("error", e);
          }
        }
        buff = data[l];
      });
      req.on("error", function(err) {
        stream.emit("error", err);
      });
      return stream;
    };
  }
});

// node_modules/.pnpm/winston@2.4.5/node_modules/winston/lib/winston/transports/memory.js
var require_memory = __commonJS({
  "node_modules/.pnpm/winston@2.4.5/node_modules/winston/lib/winston/transports/memory.js"(exports2) {
    var events = __require("events");
    var util = __require("util");
    var common = require_common2();
    var Transport = require_transport().Transport;
    var Memory = exports2.Memory = function(options) {
      Transport.call(this, options);
      options = options || {};
      this.errorOutput = [];
      this.writeOutput = [];
      this.json = options.json || false;
      this.colorize = options.colorize || false;
      this.prettyPrint = options.prettyPrint || false;
      this.timestamp = typeof options.timestamp !== "undefined" ? options.timestamp : false;
      this.showLevel = options.showLevel === void 0 ? true : options.showLevel;
      this.label = options.label || null;
      this.depth = options.depth || null;
      if (this.json) {
        this.stringify = options.stringify || function(obj) {
          return JSON.stringify(obj, null, 2);
        };
      }
    };
    util.inherits(Memory, Transport);
    Memory.prototype.name = "memory";
    Memory.prototype.log = function(level, msg, meta, callback) {
      if (this.silent) {
        return callback(null, true);
      }
      var self2 = this, output;
      output = common.log({
        colorize: this.colorize,
        json: this.json,
        level,
        message: msg,
        meta,
        stringify: this.stringify,
        timestamp: this.timestamp,
        prettyPrint: this.prettyPrint,
        raw: this.raw,
        label: this.label,
        depth: this.depth,
        formatter: this.formatter,
        humanReadableUnhandledException: this.humanReadableUnhandledException
      });
      if (level === "error" || level === "debug") {
        this.errorOutput.push(output);
      } else {
        this.writeOutput.push(output);
      }
      self2.emit("logged");
      callback(null, true);
    };
    Memory.prototype.clearLogs = function() {
      this.errorOutput = [];
      this.writeOutput = [];
    };
  }
});

// node_modules/.pnpm/winston@2.4.5/node_modules/winston/lib/winston/transports.js
var require_transports = __commonJS({
  "node_modules/.pnpm/winston@2.4.5/node_modules/winston/lib/winston/transports.js"(exports2) {
    Object.defineProperty(exports2, "Console", {
      configurable: true,
      enumerable: true,
      get: function() {
        return require_console().Console;
      }
    });
    Object.defineProperty(exports2, "File", {
      configurable: true,
      enumerable: true,
      get: function() {
        return require_file2().File;
      }
    });
    Object.defineProperty(exports2, "Http", {
      configurable: true,
      enumerable: true,
      get: function() {
        return require_http().Http;
      }
    });
    Object.defineProperty(exports2, "Memory", {
      configurable: true,
      enumerable: true,
      get: function() {
        return require_memory().Memory;
      }
    });
  }
});

// node_modules/.pnpm/stack-trace@0.0.10/node_modules/stack-trace/lib/stack-trace.js
var require_stack_trace = __commonJS({
  "node_modules/.pnpm/stack-trace@0.0.10/node_modules/stack-trace/lib/stack-trace.js"(exports2) {
    exports2.get = function(belowFn) {
      var oldLimit = Error.stackTraceLimit;
      Error.stackTraceLimit = Infinity;
      var dummyObject = {};
      var v8Handler = Error.prepareStackTrace;
      Error.prepareStackTrace = function(dummyObject2, v8StackTrace2) {
        return v8StackTrace2;
      };
      Error.captureStackTrace(dummyObject, belowFn || exports2.get);
      var v8StackTrace = dummyObject.stack;
      Error.prepareStackTrace = v8Handler;
      Error.stackTraceLimit = oldLimit;
      return v8StackTrace;
    };
    exports2.parse = function(err) {
      if (!err.stack) {
        return [];
      }
      var self2 = this;
      var lines = err.stack.split("\n").slice(1);
      return lines.map(function(line) {
        if (line.match(/^\s*[-]{4,}$/)) {
          return self2._createParsedCallSite({
            fileName: line,
            lineNumber: null,
            functionName: null,
            typeName: null,
            methodName: null,
            columnNumber: null,
            "native": null
          });
        }
        var lineMatch = line.match(/at (?:(.+)\s+\()?(?:(.+?):(\d+)(?::(\d+))?|([^)]+))\)?/);
        if (!lineMatch) {
          return;
        }
        var object = null;
        var method = null;
        var functionName = null;
        var typeName = null;
        var methodName = null;
        var isNative = lineMatch[5] === "native";
        if (lineMatch[1]) {
          functionName = lineMatch[1];
          var methodStart = functionName.lastIndexOf(".");
          if (functionName[methodStart - 1] == ".")
            methodStart--;
          if (methodStart > 0) {
            object = functionName.substr(0, methodStart);
            method = functionName.substr(methodStart + 1);
            var objectEnd = object.indexOf(".Module");
            if (objectEnd > 0) {
              functionName = functionName.substr(objectEnd + 1);
              object = object.substr(0, objectEnd);
            }
          }
          typeName = null;
        }
        if (method) {
          typeName = object;
          methodName = method;
        }
        if (method === "<anonymous>") {
          methodName = null;
          functionName = null;
        }
        var properties = {
          fileName: lineMatch[2] || null,
          lineNumber: parseInt(lineMatch[3], 10) || null,
          functionName,
          typeName,
          methodName,
          columnNumber: parseInt(lineMatch[4], 10) || null,
          "native": isNative
        };
        return self2._createParsedCallSite(properties);
      }).filter(function(callSite) {
        return !!callSite;
      });
    };
    function CallSite(properties) {
      for (var property in properties) {
        this[property] = properties[property];
      }
    }
    var strProperties = [
      "this",
      "typeName",
      "functionName",
      "methodName",
      "fileName",
      "lineNumber",
      "columnNumber",
      "function",
      "evalOrigin"
    ];
    var boolProperties = [
      "topLevel",
      "eval",
      "native",
      "constructor"
    ];
    strProperties.forEach(function(property) {
      CallSite.prototype[property] = null;
      CallSite.prototype["get" + property[0].toUpperCase() + property.substr(1)] = function() {
        return this[property];
      };
    });
    boolProperties.forEach(function(property) {
      CallSite.prototype[property] = false;
      CallSite.prototype["is" + property[0].toUpperCase() + property.substr(1)] = function() {
        return this[property];
      };
    });
    exports2._createParsedCallSite = function(properties) {
      return new CallSite(properties);
    };
  }
});

// node_modules/.pnpm/winston@2.4.5/node_modules/winston/lib/winston/exception.js
var require_exception = __commonJS({
  "node_modules/.pnpm/winston@2.4.5/node_modules/winston/lib/winston/exception.js"(exports2) {
    var os = __require("os");
    var stackTrace = require_stack_trace();
    var exception = exports2;
    exception.getAllInfo = function(err) {
      return {
        date: new Date().toString(),
        process: exception.getProcessInfo(),
        os: exception.getOsInfo(),
        trace: exception.getTrace(err),
        stack: err.stack && err.stack.split("\n")
      };
    };
    exception.getProcessInfo = function() {
      return {
        pid: process.pid,
        uid: process.getuid ? process.getuid() : null,
        gid: process.getgid ? process.getgid() : null,
        cwd: process.cwd(),
        execPath: process.execPath,
        version: process.version,
        argv: process.argv,
        memoryUsage: process.memoryUsage()
      };
    };
    exception.getOsInfo = function() {
      return {
        loadavg: os.loadavg(),
        uptime: os.uptime()
      };
    };
    exception.getTrace = function(err) {
      var trace = err ? stackTrace.parse(err) : stackTrace.get();
      return trace.map(function(site) {
        return {
          column: site.getColumnNumber(),
          file: site.getFileName(),
          function: site.getFunctionName(),
          line: site.getLineNumber(),
          method: site.getMethodName(),
          native: site.isNative()
        };
      });
    };
  }
});

// node_modules/.pnpm/winston@2.4.5/node_modules/winston/lib/winston/container.js
var require_container = __commonJS({
  "node_modules/.pnpm/winston@2.4.5/node_modules/winston/lib/winston/container.js"(exports2) {
    var common = require_common2();
    var winston = require_winston();
    var extend = __require("util")._extend;
    var Container = exports2.Container = function(options) {
      this.loggers = {};
      this.options = options || {};
      this.default = {
        transports: [
          new winston.transports.Console({
            level: "silly",
            colorize: false
          })
        ]
      };
    };
    Container.prototype.get = Container.prototype.add = function(id, options) {
      var self2 = this, existing;
      if (!this.loggers[id]) {
        options = extend({}, options || this.options || this.default);
        existing = options.transports || this.options.transports;
        options.transports = existing ? existing.slice() : [];
        if (options.transports.length === 0 && (!options || !options["console"])) {
          options.transports.push(this.default.transports[0]);
        }
        Object.keys(options).forEach(function(key) {
          if (key === "transports" || key === "filters" || key === "rewriters") {
            return;
          }
          var name2 = common.capitalize(key);
          if (!winston.transports[name2]) {
            throw new Error("Cannot add unknown transport: " + name2);
          }
          var namedOptions = options[key];
          namedOptions.id = id;
          options.transports.push(new winston.transports[name2](namedOptions));
        });
        options.id = id;
        this.loggers[id] = new winston.Logger(options);
        this.loggers[id].on("close", function() {
          self2._delete(id);
        });
      }
      return this.loggers[id];
    };
    Container.prototype.has = function(id) {
      return !!this.loggers[id];
    };
    Container.prototype.close = function(id) {
      var self2 = this;
      function _close(id2) {
        if (!self2.loggers[id2]) {
          return;
        }
        self2.loggers[id2].close();
        self2._delete(id2);
      }
      return id ? _close(id) : Object.keys(this.loggers).forEach(function(id2) {
        _close(id2);
      });
    };
    Container.prototype._delete = function(id) {
      delete this.loggers[id];
    };
  }
});

// node_modules/.pnpm/winston@2.4.5/node_modules/winston/lib/winston/logger.js
var require_logger = __commonJS({
  "node_modules/.pnpm/winston@2.4.5/node_modules/winston/lib/winston/logger.js"(exports2) {
    var events = __require("events");
    var util = __require("util");
    var async = require_async2();
    var config = require_config();
    var common = require_common2();
    var exception = require_exception();
    var Stream = __require("stream").Stream;
    var formatRegExp = /%[sdj%]/g;
    var Logger = exports2.Logger = function(options) {
      events.EventEmitter.call(this);
      this.configure(options);
    };
    util.inherits(Logger, events.EventEmitter);
    Logger.prototype.configure = function(options) {
      var self2 = this;
      if (Array.isArray(this._names) && this._names.length) {
        this.clear();
      }
      options = options || {};
      this.transports = {};
      this._names = [];
      if (options.transports) {
        options.transports.forEach(function(transport) {
          self2.add(transport, null, true);
        });
      }
      this.padLevels = options.padLevels || false;
      this.setLevels(options.levels);
      if (options.colors) {
        config.addColors(options.colors);
      }
      this.id = options.id || null;
      this.level = options.level || "info";
      this.emitErrs = options.emitErrs || false;
      this.stripColors = options.stripColors || false;
      this.exitOnError = typeof options.exitOnError !== "undefined" ? options.exitOnError : true;
      this.exceptionHandlers = {};
      this.profilers = {};
      ["rewriters", "filters"].forEach(function(kind) {
        self2[kind] = Array.isArray(options[kind]) ? options[kind] : [];
      });
      if (options.exceptionHandlers) {
        this.handleExceptions(options.exceptionHandlers);
      }
    };
    Logger.prototype.log = function(level) {
      var args = Array.prototype.slice.call(arguments, 1), self2 = this, transports;
      while (args[args.length - 1] === null) {
        args.pop();
      }
      var callback = typeof args[args.length - 1] === "function" ? args.pop() : null;
      function onError(err) {
        if (callback) {
          callback(err);
        } else if (self2.emitErrs) {
          self2.emit("error", err);
        }
      }
      if (this._names.length === 0) {
        return onError(new Error("Cannot log with no transports."));
      } else if (typeof self2.levels[level] === "undefined") {
        return onError(new Error("Unknown log level: " + level));
      }
      var targets = this._names.filter(function(name2) {
        var transport = self2.transports[name2];
        return transport.level && self2.levels[transport.level] >= self2.levels[level] || !transport.level && self2.levels[self2.level] >= self2.levels[level];
      });
      if (!targets.length) {
        if (callback) {
          callback();
        }
        return;
      }
      var msg, meta = {}, validMeta = false;
      var hasFormat = args && args[0] && args[0].match && args[0].match(formatRegExp) !== null;
      var tokens = hasFormat ? args[0].match(formatRegExp) : [];
      var ptokens = tokens.filter(function(t) {
        return t === "%%";
      });
      if (args.length - 1 - (tokens.length - ptokens.length) > 0 || args.length === 1) {
        meta = args[args.length - 1] || args;
        var metaType = Object.prototype.toString.call(meta);
        validMeta = metaType === "[object Object]" || metaType === "[object Error]" || metaType === "[object Array]";
        meta = validMeta ? args.pop() : {};
      }
      msg = util.format.apply(null, args);
      function finish(err) {
        if (callback) {
          if (err)
            return callback(err);
          callback(null, level, msg, meta);
        }
        callback = null;
        if (!err) {
          self2.emit("logged", level, msg, meta);
        }
      }
      if (this.padLevels) {
        msg = new Array(this.levelLength - level.length + 1).join(" ") + msg;
      }
      this.rewriters.forEach(function(rewriter) {
        meta = rewriter(level, msg, meta, self2);
      });
      this.filters.forEach(function(filter) {
        var filtered = filter(level, msg, meta, self2);
        if (typeof filtered === "string")
          msg = filtered;
        else {
          msg = filtered.msg;
          meta = filtered.meta;
        }
      });
      if (this.stripColors) {
        var code = /\u001b\[(\d+(;\d+)*)?m/g;
        msg = ("" + msg).replace(code, "");
      }
      function transportLog(name2, next) {
        var transport = self2.transports[name2];
        transport.log(level, msg, meta, function(err) {
          if (err) {
            err.transport = transport;
            finish(err);
            return next();
          }
          self2.emit("logging", transport, level, msg, meta);
          next();
        });
      }
      async.forEach(targets, transportLog, finish);
      return this;
    };
    Logger.prototype.query = function(options, callback) {
      if (typeof options === "function") {
        callback = options;
        options = {};
      }
      var self2 = this, options = options || {}, results = {}, query = common.clone(options.query) || {}, transports;
      function queryTransport(transport, next) {
        if (options.query) {
          options.query = transport.formatQuery(query);
        }
        transport.query(options, function(err, results2) {
          if (err) {
            return next(err);
          }
          next(null, transport.formatResults(results2, options.format));
        });
      }
      function addResults(transport, next) {
        queryTransport(transport, function(err, result) {
          if (next) {
            result = err || result;
            if (result) {
              results[transport.name] = result;
            }
            next();
          }
          next = null;
        });
      }
      if (options.transport) {
        options.transport = options.transport.toLowerCase();
        return queryTransport(this.transports[options.transport], callback);
      }
      transports = this._names.map(function(name2) {
        return self2.transports[name2];
      }).filter(function(transport) {
        return !!transport.query;
      });
      async.forEach(transports, addResults, function() {
        callback(null, results);
      });
    };
    Logger.prototype.stream = function(options) {
      var self2 = this, options = options || {}, out = new Stream(), streams = [], transports;
      if (options.transport) {
        var transport = this.transports[options.transport];
        delete options.transport;
        if (transport && transport.stream) {
          return transport.stream(options);
        }
      }
      out._streams = streams;
      out.destroy = function() {
        var i2 = streams.length;
        while (i2--)
          streams[i2].destroy();
      };
      transports = this._names.map(function(name2) {
        return self2.transports[name2];
      }).filter(function(transport2) {
        return !!transport2.stream;
      });
      transports.forEach(function(transport2) {
        var stream = transport2.stream(options);
        if (!stream)
          return;
        streams.push(stream);
        stream.on("log", function(log3) {
          log3.transport = log3.transport || [];
          log3.transport.push(transport2.name);
          out.emit("log", log3);
        });
        stream.on("error", function(err) {
          err.transport = err.transport || [];
          err.transport.push(transport2.name);
          out.emit("error", err);
        });
      });
      return out;
    };
    Logger.prototype.close = function() {
      var self2 = this;
      this._names.forEach(function(name2) {
        var transport = self2.transports[name2];
        if (transport && transport.close) {
          transport.close();
        }
      });
      this.emit("close");
    };
    Logger.prototype.handleExceptions = function() {
      var args = Array.prototype.slice.call(arguments), handlers = [], self2 = this;
      args.forEach(function(a) {
        if (Array.isArray(a)) {
          handlers = handlers.concat(a);
        } else {
          handlers.push(a);
        }
      });
      this.exceptionHandlers = this.exceptionHandlers || {};
      handlers.forEach(function(handler) {
        self2.exceptionHandlers[handler.name] = handler;
      });
      this._hnames = Object.keys(self2.exceptionHandlers);
      if (!this.catchExceptions) {
        this.catchExceptions = this._uncaughtException.bind(this);
        process.on("uncaughtException", this.catchExceptions);
      }
    };
    Logger.prototype.unhandleExceptions = function() {
      var self2 = this;
      if (this.catchExceptions) {
        Object.keys(this.exceptionHandlers).forEach(function(name2) {
          var handler = self2.exceptionHandlers[name2];
          if (handler.close) {
            handler.close();
          }
        });
        this.exceptionHandlers = {};
        Object.keys(this.transports).forEach(function(name2) {
          var transport = self2.transports[name2];
          if (transport.handleExceptions) {
            transport.handleExceptions = false;
          }
        });
        process.removeListener("uncaughtException", this.catchExceptions);
        this.catchExceptions = false;
      }
    };
    Logger.prototype.add = function(transport, options, created) {
      var instance = created ? transport : new transport(options);
      if (!instance.name && !instance.log) {
        throw new Error("Unknown transport with no log() method");
      } else if (this.transports[instance.name]) {
        throw new Error("Transport already attached: " + instance.name + ", assign a different name");
      }
      this.transports[instance.name] = instance;
      this._names = Object.keys(this.transports);
      instance._onError = this._onError.bind(this, instance);
      if (!created) {
        instance.on("error", instance._onError);
      }
      if (instance.handleExceptions && !this.catchExceptions) {
        this.handleExceptions();
      }
      return this;
    };
    Logger.prototype.clear = function() {
      Object.keys(this.transports).forEach(function(name2) {
        this.remove({ name: name2 });
      }, this);
    };
    Logger.prototype.remove = function(transport) {
      var name2 = typeof transport !== "string" ? transport.name || transport.prototype.name : transport;
      if (!this.transports[name2]) {
        throw new Error("Transport " + name2 + " not attached to this instance");
      }
      var instance = this.transports[name2];
      delete this.transports[name2];
      this._names = Object.keys(this.transports);
      if (instance.close) {
        instance.close();
      }
      if (instance._onError) {
        instance.removeListener("error", instance._onError);
      }
      return this;
    };
    Logger.prototype.startTimer = function() {
      return new ProfileHandler(this);
    };
    Logger.prototype.profile = function(id) {
      var now = Date.now(), then, args, msg, meta, callback;
      if (this.profilers[id]) {
        then = this.profilers[id];
        delete this.profilers[id];
        args = Array.prototype.slice.call(arguments);
        callback = typeof args[args.length - 1] === "function" ? args.pop() : null;
        meta = typeof args[args.length - 1] === "object" ? args.pop() : {};
        msg = args.length === 2 ? args[1] : id;
        meta.durationMs = now - then;
        return this.info(msg, meta, callback);
      } else {
        this.profilers[id] = now;
      }
      return this;
    };
    Logger.prototype.setLevels = function(target) {
      return common.setLevels(this, this.levels, target);
    };
    Logger.prototype.cli = function() {
      this.padLevels = true;
      this.setLevels(config.cli.levels);
      config.addColors(config.cli.colors);
      if (this.transports.console) {
        this.transports.console.colorize = this.transports.console.colorize || true;
        this.transports.console.timestamp = this.transports.console.timestamp || false;
      }
      return this;
    };
    Logger.prototype._uncaughtException = function(err) {
      var self2 = this, responded = false, info = exception.getAllInfo(err), handlers = this._getExceptionHandlers(), timeout, doExit;
      doExit = typeof this.exitOnError === "function" ? this.exitOnError(err) : this.exitOnError;
      function logAndWait(transport, next) {
        transport.logException("uncaughtException: " + (err.message || err), info, next, err);
      }
      function gracefulExit() {
        if (doExit && !responded) {
          clearTimeout(timeout);
          responded = true;
          process.exit(1);
        }
      }
      if (!handlers || handlers.length === 0) {
        return gracefulExit();
      }
      async.forEach(handlers, logAndWait, gracefulExit);
      if (doExit) {
        timeout = setTimeout(gracefulExit, 3e3);
      }
    };
    Logger.prototype._getExceptionHandlers = function() {
      var self2 = this;
      return this._hnames.map(function(name2) {
        return self2.exceptionHandlers[name2];
      }).concat(this._names.map(function(name2) {
        return self2.transports[name2].handleExceptions && self2.transports[name2];
      })).filter(Boolean);
    };
    Logger.prototype._onError = function(transport, err) {
      if (this.emitErrs) {
        this.emit("error", err, transport);
      }
    };
    function ProfileHandler(logger) {
      this.logger = logger;
      this.start = Date.now();
    }
    ProfileHandler.prototype.done = function(msg) {
      var args = Array.prototype.slice.call(arguments), callback = typeof args[args.length - 1] === "function" ? args.pop() : null, meta = typeof args[args.length - 1] === "object" ? args.pop() : {};
      meta.duration = Date.now() - this.start + "ms";
      return this.logger.info(msg, meta, callback);
    };
  }
});

// node_modules/.pnpm/winston@2.4.5/node_modules/winston/lib/winston.js
var require_winston = __commonJS({
  "node_modules/.pnpm/winston@2.4.5/node_modules/winston/lib/winston.js"(exports2) {
    var winston = exports2;
    winston.version = require_package().version;
    winston.transports = require_transports();
    var common = require_common2();
    winston.hash = common.hash;
    winston.clone = common.clone;
    winston.longestElement = common.longestElement;
    winston.exception = require_exception();
    winston.config = require_config();
    winston.addColors = winston.config.addColors;
    winston.Container = require_container().Container;
    winston.Logger = require_logger().Logger;
    winston.Transport = require_transport().Transport;
    winston.loggers = new winston.Container();
    var defaultLogger = new winston.Logger({
      transports: [new winston.transports.Console()]
    });
    var methods = [
      "log",
      "query",
      "stream",
      "add",
      "remove",
      "clear",
      "profile",
      "startTimer",
      "extend",
      "cli",
      "handleExceptions",
      "unhandleExceptions",
      "configure"
    ];
    winston.padLevels = false;
    common.setLevels(winston, null, defaultLogger.levels);
    methods.forEach(function(method) {
      winston[method] = function() {
        return defaultLogger[method].apply(defaultLogger, arguments);
      };
    });
    winston.cli = function() {
      winston.padLevels = true;
      common.setLevels(winston, defaultLogger.levels, winston.config.cli.levels);
      defaultLogger.setLevels(winston.config.cli.levels);
      winston.config.addColors(winston.config.cli.colors);
      if (defaultLogger.transports.console) {
        defaultLogger.transports.console.colorize = true;
        defaultLogger.transports.console.timestamp = false;
      }
      return winston;
    };
    winston.setLevels = function(target) {
      common.setLevels(winston, defaultLogger.levels, target);
      defaultLogger.setLevels(target);
    };
    Object.defineProperty(winston, "level", {
      get: function() {
        return defaultLogger.level;
      },
      set: function(val) {
        defaultLogger.level = val;
        Object.keys(defaultLogger.transports).forEach(function(key) {
          defaultLogger.transports[key].level = val;
        });
      }
    });
    ["emitErrs", "exitOnError", "padLevels", "levelLength", "stripColors"].forEach(function(prop) {
      Object.defineProperty(winston, prop, {
        get: function() {
          return defaultLogger[prop];
        },
        set: function(val) {
          defaultLogger[prop] = val;
        }
      });
    });
    Object.defineProperty(winston, "default", {
      get: function() {
        return {
          transports: defaultLogger.transports,
          exceptionHandlers: defaultLogger.exceptionHandlers
        };
      }
    });
  }
});

// node_modules/.pnpm/colors@1.4.0/node_modules/colors/lib/styles.js
var require_styles2 = __commonJS({
  "node_modules/.pnpm/colors@1.4.0/node_modules/colors/lib/styles.js"(exports2, module2) {
    var styles = {};
    module2["exports"] = styles;
    var codes = {
      reset: [0, 0],
      bold: [1, 22],
      dim: [2, 22],
      italic: [3, 23],
      underline: [4, 24],
      inverse: [7, 27],
      hidden: [8, 28],
      strikethrough: [9, 29],
      black: [30, 39],
      red: [31, 39],
      green: [32, 39],
      yellow: [33, 39],
      blue: [34, 39],
      magenta: [35, 39],
      cyan: [36, 39],
      white: [37, 39],
      gray: [90, 39],
      grey: [90, 39],
      brightRed: [91, 39],
      brightGreen: [92, 39],
      brightYellow: [93, 39],
      brightBlue: [94, 39],
      brightMagenta: [95, 39],
      brightCyan: [96, 39],
      brightWhite: [97, 39],
      bgBlack: [40, 49],
      bgRed: [41, 49],
      bgGreen: [42, 49],
      bgYellow: [43, 49],
      bgBlue: [44, 49],
      bgMagenta: [45, 49],
      bgCyan: [46, 49],
      bgWhite: [47, 49],
      bgGray: [100, 49],
      bgGrey: [100, 49],
      bgBrightRed: [101, 49],
      bgBrightGreen: [102, 49],
      bgBrightYellow: [103, 49],
      bgBrightBlue: [104, 49],
      bgBrightMagenta: [105, 49],
      bgBrightCyan: [106, 49],
      bgBrightWhite: [107, 49],
      blackBG: [40, 49],
      redBG: [41, 49],
      greenBG: [42, 49],
      yellowBG: [43, 49],
      blueBG: [44, 49],
      magentaBG: [45, 49],
      cyanBG: [46, 49],
      whiteBG: [47, 49]
    };
    Object.keys(codes).forEach(function(key) {
      var val = codes[key];
      var style = styles[key] = [];
      style.open = "[" + val[0] + "m";
      style.close = "[" + val[1] + "m";
    });
  }
});

// node_modules/.pnpm/colors@1.4.0/node_modules/colors/lib/system/has-flag.js
var require_has_flag = __commonJS({
  "node_modules/.pnpm/colors@1.4.0/node_modules/colors/lib/system/has-flag.js"(exports2, module2) {
    "use strict";
    module2.exports = function(flag, argv) {
      argv = argv || process.argv;
      var terminatorPos = argv.indexOf("--");
      var prefix = /^-{1,2}/.test(flag) ? "" : "--";
      var pos = argv.indexOf(prefix + flag);
      return pos !== -1 && (terminatorPos === -1 ? true : pos < terminatorPos);
    };
  }
});

// node_modules/.pnpm/colors@1.4.0/node_modules/colors/lib/system/supports-colors.js
var require_supports_colors2 = __commonJS({
  "node_modules/.pnpm/colors@1.4.0/node_modules/colors/lib/system/supports-colors.js"(exports2, module2) {
    "use strict";
    var os = __require("os");
    var hasFlag = require_has_flag();
    var env = process.env;
    var forceColor = void 0;
    if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false")) {
      forceColor = false;
    } else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) {
      forceColor = true;
    }
    if ("FORCE_COLOR" in env) {
      forceColor = env.FORCE_COLOR.length === 0 || parseInt(env.FORCE_COLOR, 10) !== 0;
    }
    function translateLevel(level) {
      if (level === 0) {
        return false;
      }
      return {
        level,
        hasBasic: true,
        has256: level >= 2,
        has16m: level >= 3
      };
    }
    function supportsColor(stream) {
      if (forceColor === false) {
        return 0;
      }
      if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) {
        return 3;
      }
      if (hasFlag("color=256")) {
        return 2;
      }
      if (stream && !stream.isTTY && forceColor !== true) {
        return 0;
      }
      var min = forceColor ? 1 : 0;
      if (process.platform === "win32") {
        var osRelease = os.release().split(".");
        if (Number(process.versions.node.split(".")[0]) >= 8 && Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
          return Number(osRelease[2]) >= 14931 ? 3 : 2;
        }
        return 1;
      }
      if ("CI" in env) {
        if (["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI"].some(function(sign) {
          return sign in env;
        }) || env.CI_NAME === "codeship") {
          return 1;
        }
        return min;
      }
      if ("TEAMCITY_VERSION" in env) {
        return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
      }
      if ("TERM_PROGRAM" in env) {
        var version = parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
        switch (env.TERM_PROGRAM) {
          case "iTerm.app":
            return version >= 3 ? 3 : 2;
          case "Hyper":
            return 3;
          case "Apple_Terminal":
            return 2;
        }
      }
      if (/-256(color)?$/i.test(env.TERM)) {
        return 2;
      }
      if (/^screen|^xterm|^vt100|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
        return 1;
      }
      if ("COLORTERM" in env) {
        return 1;
      }
      if (env.TERM === "dumb") {
        return min;
      }
      return min;
    }
    function getSupportLevel(stream) {
      var level = supportsColor(stream);
      return translateLevel(level);
    }
    module2.exports = {
      supportsColor: getSupportLevel,
      stdout: getSupportLevel(process.stdout),
      stderr: getSupportLevel(process.stderr)
    };
  }
});

// node_modules/.pnpm/colors@1.4.0/node_modules/colors/lib/custom/trap.js
var require_trap2 = __commonJS({
  "node_modules/.pnpm/colors@1.4.0/node_modules/colors/lib/custom/trap.js"(exports2, module2) {
    module2["exports"] = function runTheTrap(text, options) {
      var result = "";
      text = text || "Run the trap, drop the bass";
      text = text.split("");
      var trap = {
        a: ["@", "\u0104", "\u023A", "\u0245", "\u0394", "\u039B", "\u0414"],
        b: ["\xDF", "\u0181", "\u0243", "\u026E", "\u03B2", "\u0E3F"],
        c: ["\xA9", "\u023B", "\u03FE"],
        d: ["\xD0", "\u018A", "\u0500", "\u0501", "\u0502", "\u0503"],
        e: [
          "\xCB",
          "\u0115",
          "\u018E",
          "\u0258",
          "\u03A3",
          "\u03BE",
          "\u04BC",
          "\u0A6C"
        ],
        f: ["\u04FA"],
        g: ["\u0262"],
        h: ["\u0126", "\u0195", "\u04A2", "\u04BA", "\u04C7", "\u050A"],
        i: ["\u0F0F"],
        j: ["\u0134"],
        k: ["\u0138", "\u04A0", "\u04C3", "\u051E"],
        l: ["\u0139"],
        m: ["\u028D", "\u04CD", "\u04CE", "\u0520", "\u0521", "\u0D69"],
        n: ["\xD1", "\u014B", "\u019D", "\u0376", "\u03A0", "\u048A"],
        o: [
          "\xD8",
          "\xF5",
          "\xF8",
          "\u01FE",
          "\u0298",
          "\u047A",
          "\u05DD",
          "\u06DD",
          "\u0E4F"
        ],
        p: ["\u01F7", "\u048E"],
        q: ["\u09CD"],
        r: ["\xAE", "\u01A6", "\u0210", "\u024C", "\u0280", "\u042F"],
        s: ["\xA7", "\u03DE", "\u03DF", "\u03E8"],
        t: ["\u0141", "\u0166", "\u0373"],
        u: ["\u01B1", "\u054D"],
        v: ["\u05D8"],
        w: ["\u0428", "\u0460", "\u047C", "\u0D70"],
        x: ["\u04B2", "\u04FE", "\u04FC", "\u04FD"],
        y: ["\xA5", "\u04B0", "\u04CB"],
        z: ["\u01B5", "\u0240"]
      };
      text.forEach(function(c) {
        c = c.toLowerCase();
        var chars = trap[c] || [" "];
        var rand = Math.floor(Math.random() * chars.length);
        if (typeof trap[c] !== "undefined") {
          result += trap[c][rand];
        } else {
          result += c;
        }
      });
      return result;
    };
  }
});

// node_modules/.pnpm/colors@1.4.0/node_modules/colors/lib/custom/zalgo.js
var require_zalgo2 = __commonJS({
  "node_modules/.pnpm/colors@1.4.0/node_modules/colors/lib/custom/zalgo.js"(exports2, module2) {
    module2["exports"] = function zalgo(text, options) {
      text = text || "   he is here   ";
      var soul = {
        "up": [
          "\u030D",
          "\u030E",
          "\u0304",
          "\u0305",
          "\u033F",
          "\u0311",
          "\u0306",
          "\u0310",
          "\u0352",
          "\u0357",
          "\u0351",
          "\u0307",
          "\u0308",
          "\u030A",
          "\u0342",
          "\u0313",
          "\u0308",
          "\u034A",
          "\u034B",
          "\u034C",
          "\u0303",
          "\u0302",
          "\u030C",
          "\u0350",
          "\u0300",
          "\u0301",
          "\u030B",
          "\u030F",
          "\u0312",
          "\u0313",
          "\u0314",
          "\u033D",
          "\u0309",
          "\u0363",
          "\u0364",
          "\u0365",
          "\u0366",
          "\u0367",
          "\u0368",
          "\u0369",
          "\u036A",
          "\u036B",
          "\u036C",
          "\u036D",
          "\u036E",
          "\u036F",
          "\u033E",
          "\u035B",
          "\u0346",
          "\u031A"
        ],
        "down": [
          "\u0316",
          "\u0317",
          "\u0318",
          "\u0319",
          "\u031C",
          "\u031D",
          "\u031E",
          "\u031F",
          "\u0320",
          "\u0324",
          "\u0325",
          "\u0326",
          "\u0329",
          "\u032A",
          "\u032B",
          "\u032C",
          "\u032D",
          "\u032E",
          "\u032F",
          "\u0330",
          "\u0331",
          "\u0332",
          "\u0333",
          "\u0339",
          "\u033A",
          "\u033B",
          "\u033C",
          "\u0345",
          "\u0347",
          "\u0348",
          "\u0349",
          "\u034D",
          "\u034E",
          "\u0353",
          "\u0354",
          "\u0355",
          "\u0356",
          "\u0359",
          "\u035A",
          "\u0323"
        ],
        "mid": [
          "\u0315",
          "\u031B",
          "\u0300",
          "\u0301",
          "\u0358",
          "\u0321",
          "\u0322",
          "\u0327",
          "\u0328",
          "\u0334",
          "\u0335",
          "\u0336",
          "\u035C",
          "\u035D",
          "\u035E",
          "\u035F",
          "\u0360",
          "\u0362",
          "\u0338",
          "\u0337",
          "\u0361",
          " \u0489"
        ]
      };
      var all = [].concat(soul.up, soul.down, soul.mid);
      function randomNumber(range) {
        var r = Math.floor(Math.random() * range);
        return r;
      }
      function isChar(character) {
        var bool = false;
        all.filter(function(i2) {
          bool = i2 === character;
        });
        return bool;
      }
      function heComes(text2, options2) {
        var result = "";
        var counts;
        var l;
        options2 = options2 || {};
        options2["up"] = typeof options2["up"] !== "undefined" ? options2["up"] : true;
        options2["mid"] = typeof options2["mid"] !== "undefined" ? options2["mid"] : true;
        options2["down"] = typeof options2["down"] !== "undefined" ? options2["down"] : true;
        options2["size"] = typeof options2["size"] !== "undefined" ? options2["size"] : "maxi";
        text2 = text2.split("");
        for (l in text2) {
          if (isChar(l)) {
            continue;
          }
          result = result + text2[l];
          counts = { "up": 0, "down": 0, "mid": 0 };
          switch (options2.size) {
            case "mini":
              counts.up = randomNumber(8);
              counts.mid = randomNumber(2);
              counts.down = randomNumber(8);
              break;
            case "maxi":
              counts.up = randomNumber(16) + 3;
              counts.mid = randomNumber(4) + 1;
              counts.down = randomNumber(64) + 3;
              break;
            default:
              counts.up = randomNumber(8) + 1;
              counts.mid = randomNumber(6) / 2;
              counts.down = randomNumber(8) + 1;
              break;
          }
          var arr = ["up", "mid", "down"];
          for (var d in arr) {
            var index = arr[d];
            for (var i2 = 0; i2 <= counts[index]; i2++) {
              if (options2[index]) {
                result = result + soul[index][randomNumber(soul[index].length)];
              }
            }
          }
        }
        return result;
      }
      return heComes(text, options);
    };
  }
});

// node_modules/.pnpm/colors@1.4.0/node_modules/colors/lib/maps/america.js
var require_america2 = __commonJS({
  "node_modules/.pnpm/colors@1.4.0/node_modules/colors/lib/maps/america.js"(exports2, module2) {
    module2["exports"] = function(colors) {
      return function(letter, i2, exploded) {
        if (letter === " ")
          return letter;
        switch (i2 % 3) {
          case 0:
            return colors.red(letter);
          case 1:
            return colors.white(letter);
          case 2:
            return colors.blue(letter);
        }
      };
    };
  }
});

// node_modules/.pnpm/colors@1.4.0/node_modules/colors/lib/maps/zebra.js
var require_zebra2 = __commonJS({
  "node_modules/.pnpm/colors@1.4.0/node_modules/colors/lib/maps/zebra.js"(exports2, module2) {
    module2["exports"] = function(colors) {
      return function(letter, i2, exploded) {
        return i2 % 2 === 0 ? letter : colors.inverse(letter);
      };
    };
  }
});

// node_modules/.pnpm/colors@1.4.0/node_modules/colors/lib/maps/rainbow.js
var require_rainbow2 = __commonJS({
  "node_modules/.pnpm/colors@1.4.0/node_modules/colors/lib/maps/rainbow.js"(exports2, module2) {
    module2["exports"] = function(colors) {
      var rainbowColors = ["red", "yellow", "green", "blue", "magenta"];
      return function(letter, i2, exploded) {
        if (letter === " ") {
          return letter;
        } else {
          return colors[rainbowColors[i2++ % rainbowColors.length]](letter);
        }
      };
    };
  }
});

// node_modules/.pnpm/colors@1.4.0/node_modules/colors/lib/maps/random.js
var require_random2 = __commonJS({
  "node_modules/.pnpm/colors@1.4.0/node_modules/colors/lib/maps/random.js"(exports2, module2) {
    module2["exports"] = function(colors) {
      var available = [
        "underline",
        "inverse",
        "grey",
        "yellow",
        "red",
        "green",
        "blue",
        "white",
        "cyan",
        "magenta",
        "brightYellow",
        "brightRed",
        "brightGreen",
        "brightBlue",
        "brightWhite",
        "brightCyan",
        "brightMagenta"
      ];
      return function(letter, i2, exploded) {
        return letter === " " ? letter : colors[available[Math.round(Math.random() * (available.length - 2))]](letter);
      };
    };
  }
});

// node_modules/.pnpm/colors@1.4.0/node_modules/colors/lib/colors.js
var require_colors2 = __commonJS({
  "node_modules/.pnpm/colors@1.4.0/node_modules/colors/lib/colors.js"(exports2, module2) {
    var colors = {};
    module2["exports"] = colors;
    colors.themes = {};
    var util = __require("util");
    var ansiStyles = colors.styles = require_styles2();
    var defineProps = Object.defineProperties;
    var newLineRegex = new RegExp(/[\r\n]+/g);
    colors.supportsColor = require_supports_colors2().supportsColor;
    if (typeof colors.enabled === "undefined") {
      colors.enabled = colors.supportsColor() !== false;
    }
    colors.enable = function() {
      colors.enabled = true;
    };
    colors.disable = function() {
      colors.enabled = false;
    };
    colors.stripColors = colors.strip = function(str) {
      return ("" + str).replace(/\x1B\[\d+m/g, "");
    };
    var stylize = colors.stylize = function stylize2(str, style) {
      if (!colors.enabled) {
        return str + "";
      }
      var styleMap = ansiStyles[style];
      if (!styleMap && style in colors) {
        return colors[style](str);
      }
      return styleMap.open + str + styleMap.close;
    };
    var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;
    var escapeStringRegexp = function(str) {
      if (typeof str !== "string") {
        throw new TypeError("Expected a string");
      }
      return str.replace(matchOperatorsRe, "\\$&");
    };
    function build(_styles) {
      var builder = function builder2() {
        return applyStyle.apply(builder2, arguments);
      };
      builder._styles = _styles;
      builder.__proto__ = proto;
      return builder;
    }
    var styles = function() {
      var ret = {};
      ansiStyles.grey = ansiStyles.gray;
      Object.keys(ansiStyles).forEach(function(key) {
        ansiStyles[key].closeRe = new RegExp(escapeStringRegexp(ansiStyles[key].close), "g");
        ret[key] = {
          get: function() {
            return build(this._styles.concat(key));
          }
        };
      });
      return ret;
    }();
    var proto = defineProps(function colors2() {
    }, styles);
    function applyStyle() {
      var args = Array.prototype.slice.call(arguments);
      var str = args.map(function(arg2) {
        if (arg2 != null && arg2.constructor === String) {
          return arg2;
        } else {
          return util.inspect(arg2);
        }
      }).join(" ");
      if (!colors.enabled || !str) {
        return str;
      }
      var newLinesPresent = str.indexOf("\n") != -1;
      var nestedStyles = this._styles;
      var i2 = nestedStyles.length;
      while (i2--) {
        var code = ansiStyles[nestedStyles[i2]];
        str = code.open + str.replace(code.closeRe, code.open) + code.close;
        if (newLinesPresent) {
          str = str.replace(newLineRegex, function(match) {
            return code.close + match + code.open;
          });
        }
      }
      return str;
    }
    colors.setTheme = function(theme) {
      if (typeof theme === "string") {
        console.log("colors.setTheme now only accepts an object, not a string.  If you are trying to set a theme from a file, it is now your (the caller's) responsibility to require the file.  The old syntax looked like colors.setTheme(__dirname + '/../themes/generic-logging.js'); The new syntax looks like colors.setTheme(require(__dirname + '/../themes/generic-logging.js'));");
        return;
      }
      for (var style in theme) {
        (function(style2) {
          colors[style2] = function(str) {
            if (typeof theme[style2] === "object") {
              var out = str;
              for (var i2 in theme[style2]) {
                out = colors[theme[style2][i2]](out);
              }
              return out;
            }
            return colors[theme[style2]](str);
          };
        })(style);
      }
    };
    function init() {
      var ret = {};
      Object.keys(styles).forEach(function(name2) {
        ret[name2] = {
          get: function() {
            return build([name2]);
          }
        };
      });
      return ret;
    }
    var sequencer = function sequencer2(map2, str) {
      var exploded = str.split("");
      exploded = exploded.map(map2);
      return exploded.join("");
    };
    colors.trap = require_trap2();
    colors.zalgo = require_zalgo2();
    colors.maps = {};
    colors.maps.america = require_america2()(colors);
    colors.maps.zebra = require_zebra2()(colors);
    colors.maps.rainbow = require_rainbow2()(colors);
    colors.maps.random = require_random2()(colors);
    for (map in colors.maps) {
      (function(map2) {
        colors[map2] = function(str) {
          return sequencer(colors.maps[map2], str);
        };
      })(map);
    }
    var map;
    defineProps(colors, init());
  }
});

// node_modules/.pnpm/colors@1.4.0/node_modules/colors/safe.js
var require_safe2 = __commonJS({
  "node_modules/.pnpm/colors@1.4.0/node_modules/colors/safe.js"(exports2, module2) {
    var colors = require_colors2();
    module2["exports"] = colors;
  }
});

// node_modules/.pnpm/prompt@1.2.0/node_modules/prompt/package.json
var require_package2 = __commonJS({
  "node_modules/.pnpm/prompt@1.2.0/node_modules/prompt/package.json"(exports2, module2) {
    module2.exports = {
      name: "prompt",
      version: "1.2.0",
      description: "A beautiful command-line prompt for node.js",
      author: "Nodejitsu Inc. <info@nodejitsu.com>",
      maintainers: [
        "indexzero <charlie@nodejitsu.com>",
        "jesusabdullah <josh@nodejitsu.com>"
      ],
      repository: {
        type: "git",
        url: "http://github.com/flatiron/prompt.git"
      },
      keywords: [
        "prompt",
        "command-line",
        "customize",
        "validation"
      ],
      dependencies: {
        async: "~0.9.0",
        colors: "^1.1.2",
        read: "1.0.x",
        revalidator: "0.1.x",
        winston: "2.x"
      },
      devDependencies: {
        eslint: "^7.32.0",
        vows: "^0.7.0"
      },
      main: "./lib/prompt",
      scripts: {
        test: "vows test/prompt-test.js --spec",
        "test-all": "vows --spec"
      },
      license: "MIT",
      engines: {
        node: ">= 0.6.6"
      }
    };
  }
});

// node_modules/.pnpm/prompt@1.2.0/node_modules/prompt/lib/prompt.js
var require_prompt = __commonJS({
  "node_modules/.pnpm/prompt@1.2.0/node_modules/prompt/lib/prompt.js"(exports2, module2) {
    var events = __require("events");
    var readline2 = __require("readline");
    var async = require_async();
    var read2 = require_read();
    var validate = require_revalidator().validate;
    var winston = require_winston();
    var colors = require_safe2();
    readline2.Interface.prototype.setPrompt = function(prompt4, length) {
      this._prompt = prompt4;
      if (length) {
        this._promptLength = length;
      } else {
        var lines = prompt4.split(/[\r\n]/);
        var lastLine = lines[lines.length - 1];
        this._promptLength = lastLine.replace(/\u001b\[(\d+(;\d+)*)?m/g, "").length;
      }
    };
    module2.exports.version = require_package2().version;
    var stdin;
    var stdout;
    var history = [];
    var prompt3 = module2.exports = Object.create(events.EventEmitter.prototype);
    var logger = prompt3.logger = new winston.Logger({
      transports: [new winston.transports.Console()]
    });
    prompt3.started = false;
    prompt3.paused = false;
    prompt3.stopped = true;
    prompt3.allowEmpty = false;
    prompt3.message = "prompt";
    prompt3.delimiter = ": ";
    prompt3.colors = true;
    prompt3.properties = {};
    logger.cli();
    prompt3.start = function(options) {
      if (prompt3.started) {
        return;
      }
      options = options || {};
      stdin = options.stdin || process.stdin;
      stdout = options.stdout || process.stdout;
      prompt3.memory = options.memory || 10;
      prompt3.allowEmpty = options.allowEmpty || false;
      prompt3.message = options.message || prompt3.message;
      prompt3.delimiter = options.delimiter || prompt3.delimiter;
      prompt3.colors = options.colors || prompt3.colors;
      if (!options.noHandleSIGINT) {
        if (process.platform !== "win32") {
          process.on("SIGINT", function() {
            stdout.write("\n");
            process.exit(1);
          });
        } else {
          stdin.on("keypress", function(char, key) {
            if (key && key.ctrl && key.name == "c") {
              stdout.write("\n");
              process.emit("SIGINT");
              process.exit(1);
            }
          });
        }
      }
      prompt3.emit("start");
      prompt3.started = true;
      prompt3.stopped = false;
      return prompt3;
    };
    prompt3.pause = function() {
      if (!prompt3.started || prompt3.stopped || prompt3.paused) {
        return;
      }
      stdin.pause();
      prompt3.emit("pause");
      prompt3.paused = true;
      return prompt3;
    };
    prompt3.stop = function() {
      if (prompt3.stopped || !prompt3.started) {
        return;
      }
      stdin.destroy();
      prompt3.emit("stop");
      prompt3.stopped = true;
      prompt3.started = false;
      prompt3.paused = false;
      return prompt3;
    };
    prompt3.resume = function() {
      if (!prompt3.started || !prompt3.paused) {
        return;
      }
      stdin.resume();
      prompt3.emit("resume");
      prompt3.paused = false;
      return prompt3;
    };
    prompt3.history = function(search) {
      if (typeof search === "number") {
        return history[search] || {};
      }
      var names = history.map(function(pair) {
        return typeof pair.property === "string" ? pair.property : pair.property.name;
      });
      if (!~names.indexOf(search)) {
        return null;
      }
      return history.filter(function(pair) {
        return typeof pair.property === "string" ? pair.property === search : pair.property.name === search;
      })[0];
    };
    prompt3.get = function(schema, callback) {
      if (typeof callback === "function")
        return prompt3._get(schema, callback);
      return new Promise(function(resolve, reject) {
        prompt3._get(schema, function(err, result) {
          return err ? reject(err) : resolve(result);
        });
      });
    };
    prompt3._get = function(schema, callback) {
      function untangle(schema2, path2) {
        var results = [];
        path2 = path2 || [];
        if (schema2.properties) {
          Object.keys(schema2.properties).forEach(function(key) {
            var obj = {};
            obj[key] = schema2.properties[key];
            results = results.concat(untangle(obj[key], path2.concat(key)));
          });
          return results;
        }
        return {
          path: path2,
          schema: schema2
        };
      }
      function iterate(schema2, get, done) {
        var iterator = [], result = {};
        if (typeof schema2 === "string") {
          iterator.push({
            path: [schema2],
            schema: prompt3.properties[schema2.toLowerCase()] || {}
          });
        } else if (Array.isArray(schema2)) {
          iterator = schema2.map(function(element) {
            if (typeof element === "string") {
              return {
                path: [element],
                schema: prompt3.properties[element.toLowerCase()] || {}
              };
            } else if (element.properties) {
              return {
                path: [Object.keys(element.properties)[0]],
                schema: element.properties[Object.keys(element.properties)[0]]
              };
            } else if (element.path && element.schema) {
              return element;
            } else {
              return {
                path: [element.name || "question"],
                schema: element
              };
            }
          });
        } else if (schema2.properties) {
          iterator = untangle(schema2);
        } else {
          iterator = [{
            schema: schema2.schema ? schema2.schema : schema2,
            path: schema2.path || [schema2.name || "question"]
          }];
        }
        async.forEachSeries(iterator, function(branch, next) {
          get(branch, function assembler(err, line) {
            if (err) {
              return next(err);
            }
            function build(path2, line2) {
              var obj = {};
              if (path2.length) {
                obj[path2[0]] = build(path2.slice(1), line2);
                return obj;
              }
              return line2;
            }
            function attach(obj, attr) {
              var keys;
              if (typeof attr !== "object" || attr instanceof Array) {
                return attr;
              }
              keys = Object.keys(attr);
              if (keys.length) {
                if (!obj[keys[0]]) {
                  obj[keys[0]] = {};
                }
                obj[keys[0]] = attach(obj[keys[0]], attr[keys[0]]);
              }
              return obj;
            }
            result = attach(result, build(branch.path, line));
            next();
          });
        }, function(err) {
          return err ? done(err) : done(null, result);
        });
      }
      iterate(schema, function get(target, next) {
        prompt3.getInput(target, function(err, line) {
          return err ? next(err) : next(null, line);
        });
      }, callback);
      return prompt3;
    };
    prompt3.confirm = function() {
      var args = Array.prototype.slice.call(arguments), msg = args.shift(), callback = args.pop(), opts = args.shift(), vars = !Array.isArray(msg) ? [msg] : msg, RX_Y = /^[yt]{1}/i, RX_YN = /^[yntf]{1}/i;
      function confirm(target, next) {
        var yes = target.yes || RX_Y, options = {
          description: typeof target === "string" ? target : target.description || "yes/no",
          pattern: target.pattern || RX_YN,
          name: "confirm",
          message: target.message || "yes/no"
        };
        for (var k in opts || {}) {
          if (opts.hasOwnProperty(k)) {
            options[k] = opts[k];
          }
        }
        prompt3.get([options], function(err, result) {
          next(err ? false : yes.test(result[options.name]));
        });
      }
      async.rejectSeries(vars, confirm, function(result) {
        callback(null, result.length === 0);
      });
    };
    var tmp = [];
    prompt3.getInput = function(prop, callback) {
      var schema = prop.schema || prop, propName = prop.path && prop.path.join(":") || prop, storedSchema = prompt3.properties[propName.toLowerCase()], delim = prompt3.delimiter, defaultLine, against, hidden, length, valid, name2, raw, msg;
      if (schema instanceof Object && !Object.keys(schema).length && typeof storedSchema !== "undefined") {
        schema = storedSchema;
      }
      if (typeof prop === "string" && !storedSchema) {
        schema = {};
      }
      schema = convert(schema);
      defaultLine = schema.default;
      name2 = prop.description || schema.description || propName;
      raw = prompt3.colors ? [colors.grey(name2), colors.grey(delim)] : [name2, delim];
      if (prompt3.message)
        raw.unshift(prompt3.message, delim);
      prop = {
        schema,
        path: propName.split(":")
      };
      if (!schema.properties) {
        schema = function() {
          var obj = { properties: {} };
          obj.properties[propName] = schema;
          return obj;
        }();
      }
      if (prompt3.override && prompt3.override.hasOwnProperty(propName)) {
        if (prompt3._performValidation(name2, prop, prompt3.override, schema, -1, callback)) {
          return callback(null, prompt3.override[propName]);
        }
        delete prompt3.override[propName];
      }
      if (typeof prop.schema.ask === "function" && !prop.schema.ask()) {
        return callback(null, prop.schema.default || "");
      }
      var type = (schema.properties && schema.properties[propName] && schema.properties[propName].type || "").toLowerCase().trim(), wait = type === "array";
      if (type === "array") {
        length = prop.schema.maxItems;
        if (length) {
          msg = (tmp.length + 1).toString() + "/" + length.toString();
        } else {
          msg = (tmp.length + 1).toString();
        }
        msg += delim;
        raw.push(prompt3.colors ? colors.grey(msg) : msg);
      }
      length = raw.join("").length;
      msg = raw.join("");
      if (schema.help) {
        schema.help.forEach(function(line) {
          logger.help(line);
        });
      }
      prompt3.emit("prompt", prop);
      if (typeof defaultLine === "function") {
        defaultLine = defaultLine();
      }
      if (typeof defaultLine === "undefined") {
        defaultLine = "";
      }
      defaultLine = defaultLine.toString();
      read2({
        prompt: msg,
        silent: prop.schema && prop.schema.hidden,
        replace: prop.schema && prop.schema.replace,
        default: defaultLine,
        input: stdin,
        output: stdout
      }, function(err, line) {
        if (err && wait === false) {
          return callback(err);
        }
        var against2 = {}, numericInput, isValid;
        if (line !== "") {
          if (schema.properties[propName]) {
            var type2 = (schema.properties[propName].type || "").toLowerCase().trim() || void 0;
            if (type2 === "number" || type2 === "integer") {
              line = Number(line);
            }
            if (type2 == "boolean") {
              if (line.toLowerCase() === "true" || line.toLowerCase() === "t") {
                line = true;
              } else if (line.toLowerCase() === "false" || line.toLowerCase() === "f") {
                line = false;
              }
            }
            if (type2 == "array") {
              var length2 = prop.schema.maxItems;
              if (err) {
                if (err.message == "canceled") {
                  wait = false;
                  stdout.write("\n");
                }
              } else {
                if (length2) {
                  if (tmp.length + 1 < length2) {
                    isValid = false;
                    wait = true;
                  } else {
                    isValid = true;
                    wait = false;
                  }
                } else {
                  isValid = false;
                  wait = true;
                }
                tmp.push(line);
              }
              line = tmp;
            }
          }
          against2[propName] = line;
        }
        if (prop && prop.schema.before) {
          line = prop.schema.before(line);
        }
        if (isValid === void 0)
          isValid = prompt3._performValidation(name2, prop, against2, schema, line, callback);
        if (!isValid) {
          return prompt3.getInput(prop, callback);
        }
        logger.input(line.yellow);
        prompt3._remember(propName, line);
        callback(null, line);
        tmp = [];
      });
    };
    prompt3._performValidation = function(name2, prop, against, schema, line, callback) {
      var numericInput, valid, msg;
      try {
        valid = validate(against, schema);
      } catch (err) {
        return line !== -1 ? callback(err) : false;
      }
      if (!valid.valid) {
        if (prop.schema.message) {
          logger.error(prop.schema.message);
        } else {
          msg = line !== -1 ? "Invalid input for " : "Invalid command-line input for ";
          if (prompt3.colors) {
            logger.error(msg + colors.grey(name2));
          } else {
            logger.error(msg + name2);
          }
        }
        prompt3.emit("invalid", prop, line);
      }
      return valid.valid;
    };
    prompt3.addProperties = function(obj, properties, callback) {
      properties = properties.filter(function(prop) {
        return typeof obj[prop] === "undefined";
      });
      if (properties.length === 0) {
        return callback(null, obj);
      }
      prompt3.get(properties, function(err, results) {
        if (err) {
          return callback(err);
        } else if (!results) {
          return callback(null, obj);
        }
        function putNested(obj2, path2, value2) {
          var last = obj2, key;
          while (path2.length > 1) {
            key = path2.shift();
            if (!last[key]) {
              last[key] = {};
            }
            last = last[key];
          }
          last[path2.shift()] = value2;
        }
        Object.keys(results).forEach(function(key) {
          putNested(obj, key.split("."), results[key]);
        });
        callback(null, obj);
      });
      return prompt3;
    };
    prompt3._remember = function(property, value2) {
      history.unshift({
        property,
        value: value2
      });
      if (history.length > prompt3.memory) {
        history.splice(prompt3.memory, history.length - prompt3.memory);
      }
    };
    function convert(schema) {
      var newProps = Object.keys(validate.messages), newSchema = false, key;
      newProps = newProps.concat(["description", "dependencies"]);
      for (key in schema) {
        if (newProps.indexOf(key) > 0) {
          newSchema = true;
          break;
        }
      }
      if (!newSchema || schema.validator || schema.warning || typeof schema.empty !== "undefined") {
        if (typeof schema.message !== "undefined") {
          schema.description = schema.message;
        }
        if (typeof schema.warning !== "undefined") {
          schema.message = schema.warning;
        }
        if (typeof schema.validator === "function") {
          schema.conform = schema.validator;
        } else {
          schema.pattern = schema.validator;
        }
        if (typeof schema.empty !== "undefined") {
          schema.required = !schema.empty;
        }
        delete schema.warning;
        delete schema.validator;
        delete schema.empty;
      }
      return schema;
    }
  }
});

// pkgs/boot/src/base.ts
var import_arg = __toModule(require_arg());
import { join as join8 } from "path";

// pkgs/boot/src/utils/logging.ts
var import_lodash = __toModule(require_lodash());
var import_lodash2 = __toModule(require_lodash2());
var import_lodash3 = __toModule(require_lodash3());
import readline from "readline";

// pkgs/boot/src/utils/picocolors.ts
import tty from "tty";
var isColorSupported = !("NO_COLOR" in process.env || process.argv.includes("--no-color")) && ("FORCE_COLOR" in process.env || process.argv.includes("--color") || process.platform === "win32" || tty.isatty(1) && process.env.TERM !== "dumb" || "CI" in process.env);
var formatter = (open2, close2, replace = open2) => (input) => {
  let string = "" + input;
  let index = string.indexOf(close2, open2.length);
  return ~index ? open2 + replaceClose(string, close2, replace, index) + close2 : open2 + string + close2;
};
var replaceClose = (string, close2, replace, index) => {
  let start = string.substring(0, index) + replace;
  let end = string.substring(index + close2.length);
  let nextIndex = end.indexOf(close2);
  return ~nextIndex ? start + replaceClose(end, close2, replace, nextIndex) : start + end;
};
var createColors = (enabled = isColorSupported) => ({
  isColorSupported: enabled,
  reset: enabled ? (s) => `[0m${s}[0m` : String,
  bold: enabled ? formatter("[1m", "[22m", "[22m[1m") : String,
  dim: enabled ? formatter("[2m", "[22m", "[22m[2m") : String,
  italic: enabled ? formatter("[3m", "[23m") : String,
  underline: enabled ? formatter("[4m", "[24m") : String,
  inverse: enabled ? formatter("[7m", "[27m") : String,
  hidden: enabled ? formatter("[8m", "[28m") : String,
  strikethrough: enabled ? formatter("[9m", "[29m") : String,
  black: enabled ? formatter("[30m", "[39m") : String,
  red: enabled ? formatter("[31m", "[39m") : String,
  green: enabled ? formatter("[32m", "[39m") : String,
  yellow: enabled ? formatter("[33m", "[39m") : String,
  blue: enabled ? formatter("[34m", "[39m") : String,
  magenta: enabled ? formatter("[35m", "[39m") : String,
  cyan: enabled ? formatter("[36m", "[39m") : String,
  white: enabled ? formatter("[37m", "[39m") : String,
  gray: enabled ? formatter("[90m", "[39m") : String,
  bgBlack: enabled ? formatter("[40m", "[49m") : String,
  bgRed: enabled ? formatter("[41m", "[49m") : String,
  bgGreen: enabled ? formatter("[42m", "[49m") : String,
  bgYellow: enabled ? formatter("[43m", "[49m") : String,
  bgBlue: enabled ? formatter("[44m", "[49m") : String,
  bgMagenta: enabled ? formatter("[45m", "[49m") : String,
  bgCyan: enabled ? formatter("[46m", "[49m") : String,
  bgWhite: enabled ? formatter("[47m", "[49m") : String
});
var picocolors_default = createColors();

// pkgs/boot/src/utils/logging.ts
import { join } from "path";
var root = join(process.cwd());
var pkgs = join(root, "pkgs");
var dirs = {
  root,
  build: join(root, "build"),
  app: {
    db: join(root, "app", "db"),
    web: join(root, "app", "web"),
    mobile: join(root, "app", "mobile"),
    server: join(root, "app", "server")
  },
  pkgs: {
    boot: join(pkgs, "boot"),
    main: join(pkgs, "main"),
    docs: join(pkgs, "docs"),
    dev: join(pkgs, "dev"),
    figma: join(pkgs, "figma"),
    libs: join(pkgs, "libs"),
    web: join(pkgs, "web"),
    builder: join(pkgs, "builder"),
    platform: join(pkgs, "platform")
  }
};
var EXECA_FULL_COLOR = {
  stdout: "inherit",
  cwd: dirs.root,
  all: true,
  env: { FORCE_COLOR: "true" }
};
var logo = () => {
  const base2 = picocolors_default.bold(`${picocolors_default.green("Base")}`);
  return picocolors_default.gray(`[   ${base2}   ]`);
};
var log = (type, msg, newline = true) => {
  const strtype = picocolors_default.gray(`[ ${(0, import_lodash3.default)(type, 9, " ")}]`);
  const text = `${strtype} ${msg}${newline ? "\n" : ""}`;
  if (newline) {
    process.stdout.write("\n");
  }
  process.stdout.write(text);
};

// pkgs/boot/src/main.ts
var log2 = log;
var dirs2 = dirs;

// pkgs/boot/src/dev/install-deps.ts
var import_command_exists = __toModule(require_command_exists2());
var import_execa = __toModule(require_execa());
import { join as join2 } from "path";
var installDeps = async (args) => {
  console.log(logo() + ` Welcome to base`);
  if (!await (0, import_command_exists.default)("pnpm")) {
    await (0, import_execa.default)("npm", ["i", "-g", "pnpm"], EXECA_FULL_COLOR);
  }
  if (await (0, import_command_exists.default)("pnpm")) {
    if (args && args.length > 0) {
      const pnpmList = JSON.parse((await (0, import_execa.default)("pnpm", ["list", "--json"])).stdout);
      const deps = pnpmList[0].dependencies;
      const workspace = args[0];
      let pkgDir = dirs2.app.web;
      if (deps[workspace] && deps[workspace].version) {
        pkgDir = join2(dirs2.root, deps[workspace].version.substr("link:".length));
        log2(workspace, `Installing: ${args.slice(1).join(" ")} 
`);
      } else {
        log2("web-app", `Installing: ${args.join(" ")} 
`);
      }
      await (0, import_execa.default)("pnpm", ["i", ...args], __spreadProps(__spreadValues({}, EXECA_FULL_COLOR), {
        cwd: pkgDir
      }));
      return true;
    } else {
      log2("boot", "Preparing dependencies...\n\n");
      await (0, import_execa.default)("pnpm", ["i"], EXECA_FULL_COLOR);
    }
    return true;
  } else {
    log2("error", "Failed to install pnpm");
  }
  return false;
};

// pkgs/boot/src/dev/remove-deps.ts
var import_command_exists2 = __toModule(require_command_exists2());
var import_execa2 = __toModule(require_execa());
import { join as join3 } from "path";
var removeDeps = async (args) => {
  console.log(logo() + ` Welcome to base`);
  if (!await (0, import_command_exists2.default)("pnpm")) {
    await (0, import_execa2.default)("npm", ["i", "-g", "pnpm"], EXECA_FULL_COLOR);
  }
  if (await (0, import_command_exists2.default)("pnpm")) {
    if (args && args.length > 0) {
      const pnpmList = JSON.parse((await (0, import_execa2.default)("pnpm", ["list", "--json"])).stdout);
      const deps = pnpmList[0].dependencies;
      const workspace = args[0];
      let pkgDir = dirs2.app.web;
      if (deps[workspace] && deps[workspace].version) {
        pkgDir = join3(dirs2.root, deps[workspace].version.substr("link:".length));
        log2(workspace, `Removing: ${args.slice(1).join(" ")} 
`);
      } else {
        log2("web-app", `Removing: ${args.join(" ")} 
`);
      }
      await (0, import_execa2.default)("pnpm", ["remove", ...args], __spreadProps(__spreadValues({}, EXECA_FULL_COLOR), {
        cwd: pkgDir
      }));
      return true;
    }
    return true;
  } else {
    log2("error", "Failed to install pnpm");
  }
  return false;
};

// pkgs/boot/src/utils/base-push.ts
var import_isomorphic_git = __toModule(require_isomorphic_git());
var import_node = __toModule(require_node2());
init_fs();
var import_prompt = __toModule(require_prompt());
import fs2 from "fs";
import { tmpdir } from "os";
import { join as join4 } from "path";
var basePush = async (arg2) => {
  log2("base", "Requesting credentials...");
  const { username, password, msg } = await getGitUserPass((await getCommitMsg(arg2)).trim().replace(/(\r\n|\n|\r)/gm, ""));
  console.log("");
  const dir = join4(tmpdir(), "andro-base");
  if (await pathExists(dir)) {
    log2("base", "Cleaning base dir...");
    await remove(dir);
  }
  log2("base", `tempdir: ${dir}`);
  log2("base", "Pulling base from bitbucket...");
  await import_isomorphic_git.default.clone({
    fs: fs2,
    http: import_node.default,
    url: "https://bitbucket.org/andromedia/base",
    dir,
    depth: 1,
    onAuth: (url) => {
      return {
        username,
        password
      };
    }
  });
  const files = [
    ".gitignore",
    "package.json",
    ".prettierrc",
    "pnpm-workspace.yaml"
  ];
  for (let [k, v] of Object.entries(dirs2.pkgs)) {
    if (k !== "web") {
      await copyPkgs(v, dir);
    } else {
      const webDirs = await readdir(v);
      for (let d of webDirs) {
        await copyPkgs(join4(v, d), dir);
      }
    }
  }
  for (let i2 of files) {
    await copy(join4(dirs2.root, i2), join4(dir, i2));
  }
};
var copyPkgs = async (dir, to) => {
  const subdir = dir.substring(join4(dirs2.root, "pkgs").length);
  for (let i2 of await readdir(dir)) {
    if (i2 !== "node_modules" && i2 !== "build") {
      await copy(join4(dir, i2), join4(to, "pkgs", subdir, i2));
    }
  }
};
var getGitUserPass = (msg) => {
  import_prompt.default.message = "  ";
  import_prompt.default.delimiter = "";
  console.log("\nBitbucket login");
  return new Promise((resolve) => {
    import_prompt.default.get([
      {
        name: "username",
        description: "  Username:",
        required: true
      },
      {
        name: "password",
        description: "  Password:",
        hidden: true,
        conform: function(value2) {
          return true;
        }
      },
      {
        name: "msg",
        default: msg,
        description: "  Commit Message:"
      }
    ], function(err, result) {
      resolve(result);
    });
  });
};
var getCommitMsg = async (arg2) => {
  const lastCommit = await import_isomorphic_git.default.log({
    fs: fs2,
    dir: dirs2.root,
    depth: 1
  });
  let commitMsg = arg2.slice(1).join("") || "fix";
  if (lastCommit.length > 0) {
    commitMsg = lastCommit[0].commit.message;
  }
  return commitMsg;
};

// pkgs/boot/src/utils/clean-build.ts
init_fs();
import { join as join5 } from "path";
var cleanBuild = async () => {
  log2("boot", "Cleaning all build directory...");
  const rm2 = [];
  rm2.push(remove(dirs2.build));
  for (let [k, v] of Object.entries(dirs2.app)) {
    rm2.push(remove(join5(v, "build")));
    if (k === "db")
      rm2.push(remove(join5(v, "node_modules")));
  }
  for (let [k, v] of Object.entries(dirs2.pkgs)) {
    if (k !== "web") {
      rm2.push(remove(join5(v, "build")));
    } else {
      const webDirs = await readdir(v);
      for (let d of webDirs) {
        rm2.push(remove(join5(v, d, "build")));
      }
    }
  }
  await Promise.all(rm2);
};

// pkgs/boot/src/utils/db-index.ts
var import_lodash4 = __toModule(require_lodash2());

// pkgs/boot/src/utils/db-add.ts
init_fs();
var import_prompt2 = __toModule(require_prompt());
import { join as join6 } from "path";
var dbAdd = async () => {
  try {
    let { name: name2, url } = await getDbConn();
    name2 = name2.replace(/\W/g, "").toLowerCase();
    const dir = join6(dirs2.app.db, "more", name2);
    if (await pathExists(dir)) {
      log2("base", `Adding db failed, "${name2}" already exits.`);
    }
    await ensureDir(dir);
    const pkgJsonPath = join6(dirs2.app.db, "package.json");
    const pkgJson = await readJson(pkgJsonPath);
    pkgJson.name = `db-${name2}`;
    await writeJson(join6(dir, "package.json"), pkgJson, { spaces: 2 });
    await ensureDir(join6(dir, "prisma"));
    await writeFile(join6(dir, "index.ts"), `import type prisma from '.prisma/client'
import { PrismaClient } from '@prisma/client'

export const db = new PrismaClient() as prisma.PrismaClient`);
    await writeFile(join6(dir, "prisma", "schema.prisma"), `generator client {
  provider = "prisma-client-js"
  previewFeatures = ["filterJson"]
}

datasource db {
  provider = "postgresql"
  url      = "${url}"
}`);
  } catch (e) {
  }
};
var getDbConn = () => {
  import_prompt2.default.message = "  ";
  import_prompt2.default.delimiter = "";
  console.log("\nAdd More Database to Base");
  console.log(`  Please see this reference for connection url:
  https://www.prisma.io/docs/reference/database-reference/connection-urls`);
  console.log("");
  return new Promise((resolve) => {
    import_prompt2.default.get([
      {
        name: "name",
        description: "  Database Name:",
        required: true
      },
      {
        name: "url",
        description: "  Connection URL:",
        required: true
      }
    ], function(err, result) {
      resolve(result);
    });
  });
};

// pkgs/boot/src/utils/db-index.ts
var dbIndex = async (args) => {
  const commands = {
    add: {
      desc: "Add new additional database",
      func: dbAdd
    },
    pull: {
      desc: "Update current schema from database",
      func: async () => {
      }
    },
    generate: {
      desc: "Generate typings from current schema",
      func: async () => {
      }
    }
  };
  if (args.length > 0) {
    commands[args[0]].func();
  } else {
    console.log(`node base db [command]

command are
${Object.keys(commands).map((e) => {
      const item2 = commands[e];
      return `  ${(0, import_lodash4.default)(e, 10)}: ${item2.desc}`;
    }).join("\n")}
    `);
  }
};

// pkgs/boot/src/utils/start-base.ts
import { join as join7 } from "path";
import { parentPort, Worker } from "worker_threads";
var startBase = async () => {
  if (parentPort) {
    while (await boot()) {
    }
  } else {
    base();
  }
};
var base = () => {
  return new Promise((resolve) => {
    const args = process.argv.slice(2);
    const worker = new Worker(join7(dirs2.root, "base.js"), {
      argv: args
    });
    worker.addListener("message", async (msg) => {
      if (msg === "restart") {
        worker.terminate();
      }
    });
    worker.addListener("exit", async (msg) => {
      base();
    });
    worker.postMessage("start");
  });
};
var boot = () => {
  return new Promise((resolve) => {
    const args = process.argv.slice(2);
    const worker = new Worker(join7(dirs2.pkgs.boot, "boot.js"), {
      argv: args
    });
    worker.addListener("message", async (msg) => {
      if (msg === "restart" && parentPort) {
        parentPort.postMessage("restart");
        worker.terminate();
      }
    });
    worker.addListener("exit", async (msg) => {
      resolve(worker);
    });
    worker.postMessage("start");
  });
};

// pkgs/boot/src/base.ts
(async () => {
  const { pathExists: pathExists2 } = await Promise.resolve().then(() => (init_fs(), fs_exports));
  try {
    const args = (0, import_arg.default)({
      "--port": Number
    });
    const _ = args._;
    const mode = _[0] || "dev";
    if (!await pathExists2(join8(dirs2.root, "node_modules"))) {
      await installDeps();
    }
    switch (mode) {
      case "clean":
        await cleanBuild();
        break;
      case "push":
        await basePush(_);
        break;
      case "db":
        await dbIndex(_.slice(1));
        break;
      case "dev":
      case "prod":
        await startBase();
        break;
      case "i":
      case "install":
      case "add":
        try {
          await installDeps(_.slice(1));
        } catch (e) {
        }
        break;
      case "r":
      case "rm":
      case "remove":
      case "uninstall":
      case "delete":
        try {
          await removeDeps(_.slice(1));
        } catch (e) {
        }
        break;
    }
  } catch (e) {
    console.log(e.message);
  }
})();
/*!
 * async
 * https://github.com/caolan/async
 *
 * Copyright 2010-2014 Caolan McMahon
 * Released under the MIT license
 */
/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
/*! simple-concat. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
