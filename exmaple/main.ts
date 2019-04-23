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

const server = http.createServer(app);
const PORT = 5000;

var router = express.Router();
if (group) { 
    console.log(`启用分组:${group}`)
}

registerControllerToRouter(router, { isShowUrls: true, kebabCase: true, group: group, swagger: true });
app.use('/api/v1', router);

server.on('listening', (err) => {
    if (!err) {
        console.log(`SERVER START ON ${PORT}`);
    }
})
server.listen(PORT);