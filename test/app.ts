import * as express from 'express';
import { registerControllerToKoaRouter, registerControllerToRouter } from '../core/router';
import { scannerDecoration } from '../core/decorator';
import * as path from 'path';
import bodyParser = require('body-parser');
import cookieParser = require('cookie-parser');
const app = express();

app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
app.use(cookieParser())

const router = express.Router();
const ignores = [/\.d\.ts$/, /\.js\.map$/, /\.test\./]
 //* if want to scan muti direction , you can call muti times scannerDecoration()
const scannerPath = path.resolve(__dirname, 'server')
scannerDecoration(scannerPath, ignores);
registerControllerToRouter(router, {isKoaRouter: false});
app.use(router);
export {app};