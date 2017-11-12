# restful
---

### Restful/Controller映射规范
---

- GET       /ctrl/      => ctrl.find
- GET       /ctrl/:id   => ctrl.get
- PUT       /ctrl/:id   => ctrl.update
- POST      /ctrl/      => ctrl.add
- DELETE    /ctrl/:id   => ctrl.delete

### 说明
---

- @Restful(mountUrl) 此装饰器可以接受一个URL函数，标示此Controller想要挂载的URL,如果没有
  挂载的URL为Controller名字去掉Controller后缀
- @Router(url) 此装饰器可以自定义Controller中函数对外的URL地址
- scannerDecorator 此函数会同步遍历 controller文件夹下所有文件去执行require("文件");
- registerControllerToRouter 此函数会把所有调用了@Restful的controller注册到路由上
- (controller instance).$isValidId 主要是用于验证此controller 的ID风格，如果此函数返回false，则不是ID
- (controller instance).$before 调用Controller的每个函数之前会先调用
    $before函数，此函数中可以做一些权限校验或者数据统一
- @ResponseBody() 直接将函数返回内容作为response相应内容

### 使用
---

```javascript
// router/index.ts 

import http = require("http");

import {scannerControllers, registerControllerToRouter} from "@jingli/restful";

import path = require("path");
import express = require("express");
var router = express.Router();

scannerControllers(path.join(__dirname, 'controller'));
registerControllerToRouter(router);

export async function initHttp(app) {
    app.use('/api/v1', router);
}
```

```javascript
// controller/city.ts
import {AbstractController, Restful, Router} from "@jingli/restful";

//此处可以是 @Restful('/test')
@Restful()
export class TestController extends AbstractController {
    constructor() {
        super();
    }

    $isValidId(id: string) {
        //只有ID是数字是才认为是ID 如 /test/1 可以请求到get  /test/xx 为返回404  /test/other 为映射到 other函数
        return /^\d+$/.test(id);
    }
    
    async $before(req, res, next) {
        console.log("before...");
        next(); //切记需要调用next，否则就停止到这里了
    }

    // 调用地址为 /test/:id
    async get(req, res, next) {
        res.send("get");
    }
    
    // 调用地址为 /test/other
    @Router("/other")
    async other(req, res, next) {
        res.send("other");
    }

    //调用ResponseBody
    @Router("/responseBody")
    @ResponseBody()
    async responseBody(ctx) {
        let id = ctx.req.params.id;
        return this.reply(0, {
            id,
            name: "Restful Test"
        })
    }
}
```

