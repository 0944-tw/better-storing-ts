
interface BetterStoring {
  types: string[];
  provide: any;
  nowUsing: string | null;
  getStoringInstance: Function;
  registerType: Function;
  use: Function;
  getBulitInMiddle: Function;
  
}
export default () => {
  
  var mod: BetterStoring = {
    types: [],
    provide: {},
    nowUsing: null,
    getStoringInstance: () => {},
    registerType: () => {},
    use: () => {},
    getBulitInMiddle: () => {},
  };
  mod.types = ["JSON", "MEMORY", "MYSQL", "REDIS", "MONGO"];
  mod.provide = {
    JSON: import("./src/storing/json"),
    MEMORY: import("./src/storing/memory"),
    MYSQL: import("./src/storing/mysql"),
    REDIS: import("./src/storing/redis"),
    MONGO: import("./src/storing/mongo"),
    // REPLIT: require("./src/storing/replit"),
  };
  mod.nowUsing = null;

  mod.getStoringInstance = function () {
    if (!mod.nowUsing) throw new Error("No type selected.");
    return mod.provide[mod.nowUsing];
  };

  mod.registerType = function (type: string, provider: any) {
    mod.types.push(type);
    mod.provide[type] = provider;
  };

  mod.use = function (type: string) {
    if (!mod.types.includes(type)) throw new Error("Bad type, abort.");
    mod.nowUsing = type;
    return mod;
  };

  mod.getBulitInMiddle = function () {
    function isJSON(json: object | string) {
      try {
        if (!["object", "string"].includes(typeof json))
          throw new Error("not a json");
        if (typeof json === "object") JSON.stringify(json);
        if (typeof json === "string") JSON.parse(json);
        return true;
      } catch (e) {
        return false;
      }
    }

    function startJSON(value: object | string) {
      if (!isJSON(value)) return value;
      return JSON.stringify(value, null, 2);
    }

    function endJSON(value: string) {
      if (!isJSON(value)) return value;
      return JSON.parse(value);
    }

    return { isJSON: isJSON, startJSON: startJSON, endJSON: endJSON };
  };

  return mod;
};
