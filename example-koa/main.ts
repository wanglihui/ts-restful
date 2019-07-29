import * as Koa from "koa";
import * as path from 'path';

import * as Router from 'koa-router';
import { scannerDecoration } from '../core/decorator';
import { registerControllerToKoaRouter } from '../core/router';

const route = new Router();


const app = new Koa();
//加载路由
scannerDecoration(path.resolve(__dirname, 'server'), [/\.d\.ts$/, /\.js\.map$/]);
registerControllerToKoaRouter(route, {isShowUrls: true});

function wrapVerifyIdFn(fn) {
    // let self = this;
    return (req, res, next) => {
        // let id = req.params.id;
        // if (!id) {
        //     return fn.bind(self)(req, res, next);
        // }
        // if (!self.$isValidId.bind(self)(id)) {
        //     //执行下次匹配
        //     if (next && typeof next == 'function') {
        //         return next();
        //     }
        //     throw new Error("Invalid ID");
        // }
        // return fn.bind(self)(req, res, next)
        return next();
    }

}

app.use(route.routes());

app.on('listening', () => {
    console.log("SERVER STARTED...");
})
app.on('error', (err) => {
    console.error(err);
    process.exit(-1);
})

app.listen(3000, function() {
    console.log("SERVER STARTED ON 3000")
});

