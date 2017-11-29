/**
 * Created by wlh on 2017/9/16.
 */


'use strict';

import http = require("http");
import express = require("express");
import {scannerDecoration, } from "../core/decorator";
import {registerControllerToRouter} from '../core/router';

const app = express();
import path = require("path");

scannerDecoration(path.join(__dirname, 'app'));

const server = http.createServer(app);
const PORT = 5000;

var router = express.Router()
registerControllerToRouter(router, {isShowUrls: true, kebabCase: true});
app.use('/api/v1', router);

server.on('listening', (err) => {
    if (!err) {
        console.log(`SERVER START ON ${PORT}`);
    }
})
server.listen(PORT);