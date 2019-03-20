let obj = {
  obj: {
    __shine: {
      type: "table",
      index: 94,
      keys: [],
      values: [],
      numValues: [null],
      refCount: 1
    },
    key: "value"
  },
  str: "string",
  num: 12,
  bool: false,
  arr: {
    __shine: {
      type: "table",
      index: 95,
      keys: [],
      values: [],
      numValues: [
        null,
        1,
        {
          __shine: {
            type: "table",
            index: 96,
            keys: [],
            values: [],
            numValues: [
              null,
              1,
              {
                __shine: {
                  type: "table",
                  index: 97,
                  keys: [],
                  values: [],
                  numValues: [null],
                  refCount: 2
                },
                a: "b",
                c: {
                  __shine: {
                    type: "table",
                    index: 98,
                    keys: [],
                    values: [],
                    numValues: [
                      null,
                      1,
                      2,
                      {
                        __shine: {
                          type: "table",
                          index: 99,
                          keys: [],
                          values: [],
                          numValues: [
                            null,
                            "a",
                            {
                              __shine: {
                                type: "table",
                                index: 100,
                                keys: [],
                                values: [],
                                numValues: [null, 1, 2, 3],
                                refCount: 2
                              }
                            }
                          ],
                          refCount: 2
                        }
                      }
                    ],
                    refCount: 1
                  }
                }
              },
              3
            ],
            refCount: 2
          }
        },
        3
      ],
      refCount: 2
    }
  },
  id: "Sez7ygNKRjVMWb1Oqp67",
  time: "2019-03-20T02:03:24.898Z"
};

function identify(elem) {
  if (typeof elem === "string") {
    return "string";
  }
  if (typeof elem === "boolean") {
    return "boolean";
  }
  if (typeof elem === "number") {
    return "number";
  }
  if (typeof elem === "object") {
    if (Array.isArray(elem)) {
      return "array";
    }
    if (Object.keys(elem).length > 0 && !elem.__shine) {
      return "object";
    }
    if (Object.keys(elem).length > 1 && elem.__shine) {
      return "luaobject";
    }
    if (elem.__shine.numValues.length > 1) {
      return "luaarray";
    }
  }

  return "neither";
}

function parseAndReturn(elem) {
  if (identify(elem) == "number") {
    return elem;
  }
  if (identify(elem) == "string") {
    return elem;
  }
  if (identify(elem) == "boolean") {
    return elem;
  }
  if (identify(elem) == "object") {
    let tmp = {};
    Object.keys(elem).map(k => {
      let v = elem[k];
      tmp[k] = parseAndReturn(v);
    });
    return tmp;
  }
  if (identify(elem) == "array") {
    let tmp = elem.map(v => {
      return parseAndReturn(v);
    });
    return tmp;
  }
  if (identify(elem) == "luaobject") {
    let tmp = JSON.parse(JSON.stringify(elem));
    delete tmp.__shine;
    Object.keys(tmp).map(k => {
      let v = tmp[k];
      tmp[k] = parseAndReturn(v);
    });
    return tmp;
  }
  if (identify(elem) == "luaarray") {
    let tmp = elem.__shine.numValues.slice(1).map(v => {
      return parseAndReturn(v);
    });
    return tmp;
  }

  return "CANT PARSE THIS";
}

function parseToLua(elem) {
  if (typeof elem == "undefined") {
    return undefined;
  }
  elem = JSON.parse(JSON.stringify(elem));
  if (identify(elem) == "number") {
    return elem;
  }
  if (identify(elem) == "string") {
    return elem;
  }
  if (identify(elem) == "boolean") {
    return elem;
  }
  if (identify(elem) == "object") {
    let tmp = {};
    Object.keys(elem).map(k => {
      let v = elem[k];
      tmp[k] = parseToLua(v);
    });
    return tmp;
  }
  if (identify(elem) == "array") {
    let tmp = [null].concat(
      elem.map(v => {
        return parseToLua(v);
      })
    );
    return tmp;
  }
  return "cant parse this";
}

console.log(
  JSON.stringify(
    parseToLua({
      status: "ok",
      data: {
        item: {
          time: "2019-03-20T02:59:54.579Z",
          id: "ROl6wJUAL8b6LvB5zMoq",
          arr: ["first", "second"]
        }
      }
    })
  )
);
