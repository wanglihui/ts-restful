require("ts-node").register({fast: false});

require('./server/controller/valid-id.test');
require("./server/controller/restful.test");
require("./server/controller/paramt.test");
require("./server/controller/auto-inject");