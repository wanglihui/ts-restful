/**
 * Created by wlh on 2017/9/16.
 */


'use strict';

import argv = require("argv");
var args = argv.option([
    {
        name: 'group',
        short: 'g',
        type: 'string'
    }
]).run();

var group = args.options.group;

// argv.info
import http = require("http");
import express = require("express");
import {scannerDecoration, } from "../core/decorator";
import {registerControllerToRouter} from '../core/router';

const app = express();
import path = require("path");

scannerDecoration(path.join(__dirname, 'app'), [/\.d\.ts$/]);
async function respFormat(data: any) {
    return {
        code: 0,
        data: data,
    }
}
const server = http.createServer(app);
const PORT = 5000;

var router = express.Router();
if (group) { 
    console.log(`启用分组:${group}`)
}

registerControllerToRouter(router, { isShowUrls: true, kebabCase: true, group: group, swagger: true , respFormat: respFormat});
const router2 = express.Router();
registerControllerToRouter(router2, { group: 'manager', swagger: true});
app.use('/api/v1', router);
app.use('/manager', router2);

server.on('listening', (err) => {
    if (!err) {
        console.log(`SERVER START ON ${PORT}`);
    }
})
server.listen(PORT);