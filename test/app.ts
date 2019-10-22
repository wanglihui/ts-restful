import * as express from 'express';
import { registerControllerToKoaRouter, registerControllerToRouter, setLogger } from '../core/router';
import { scannerDecoration } from '../core/decorator';
import * as path from 'path';
import bodyParser = require('body-parser');
import cookieParser = require('cookie-parser');
const app = express();

app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
app.use(cookieParser())

const router = express.Router();
const ignores = [/\.d\.ts$/, /\.js\.map$/, /\.test\./, 'ignore']
 //* if want to scan muti direction , you can call muti times scannerDecoration()
const scannerPath = path.resolve(__dirname, 'server')
scannerDecoration(scannerPath, ignores);
scannerDecoration(path.resolve(__dirname, 'server2'));
registerControllerToRouter(router, {isKoaRouter: false, swagger: true, isShowUrls: true, urlsPath: '/~urls'});

const adminRoute = express.Router();
function respFormat(data) {
    return data;
}
import * as Log4js from 'log4js';

Log4js.configure({
    appenders: {
        all: {
            type: 'file',
            filename: 'log/log.log'
        }
    },
    categories: {
        default: {
            appenders: ['all'],
            level: 'debug'
        }
    }
});
setLogger(Log4js.getLogger());

function callback() {
    console.log(`resp finish call callback `)
}
registerControllerToRouter(adminRoute, {group: 'admin', respFormat, respFinishCallback: callback});

app.use(router);
app.use('/admin', adminRoute);

app.use( (err, req, res, next) => {
    if (err && err.code != 404) {
        return res.status(500).json({code: 500, msg: 'System Error'})
    }
    return next(err);
})

import * as Koa from 'koa';
const koaApp = new Koa();
import * as KoaRoute from 'koa-router';
const koaRouter = new KoaRoute();
koaApp.use(koaRouter.routes());

registerControllerToKoaRouter(koaRouter, {isKoaRouter: true});

export {app, koaApp};