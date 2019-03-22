# restful
---
```
    当我们使用 nodejs express开发web项目时,是否写了很多 路由和 controller 映射的代码？我们的路由规则是否是按照restful规范去实现的呢？
    ts-express-restful帮你去简化路由与controller映射的样板代码，如果按照restfu规范，你只需要关注资源提供方式，剩下的交给ts-express-restful.
    当然如果你想自定义路由也很简单，只需要简单一句注解就好，感谢spring mvc 给了我很大的参考。
```    

### Router与Controller自动映射逻辑
---

此处ctrl为controller类名 去掉 Controller后缀.如类名为 UserController, ctrl为 user;

| Controller函数名 | 映射的Http Method | 映射的路由地址 | 
|-----------------|------------------|--------------|
| find            | /ctrl/           |  GET         |
| get             | /ctrl/:id        |  GET         |
| update          | /ctrl/:id        |  PUT         |
| add             | /ctrl/           |  POST        |
| delete          | /ctrl/:id        |  DELETE      |
| @Router("/other", "GET")| /ctrl/other     | GET   |


### 主要函数\注解说明
---


-  @Restful @Restful(mountUrl)
   - 将一个Controller转为一个RestfulController, 此装饰器可以接受一个URL函数，标示此Controller想要挂载的URL,如果没有挂载的URL为Controller名字去掉Controller后缀
- @Router(url, method?: string, options: any) 
  - 将Controller中的函数转为一个可供外部访问的Http Api, 此装饰器可以自定义Controller中函数对外的URL地址
- @RequestMapping @PostMapping @GetMapping
  - 类似于Router
- scannerDecorator 
  - 此函数会需要扫描注解的路径
- registerControllerToRouter 
  - 此函数会把所有调用了@Restful的controller注册到路由上
- (controller instance).$isValidId 
  - 主要是用于验证此controller 的ID风格，如果此函数返回false，则不是ID
- (controller instance).$before
  -  调用Controller的每个函数之前会先调用$before函数，此函数中可以做一些权限校验或者数据统一
- @ResponseBody() 
  - 直接将函数返回内容作为response相应内容
- @SchemaFilter(schema: any, checkType: boolean) 
  - 按照schema指定的格式过滤返回结果, checkType 如果不指定或者未true，将严格检查响应的类型是否和指定的schema类型匹配
- @Autowire 
  - 自动注入Service
- @Service 
  - 将一个class标记为service

### 使用
---

###### tsconfig.json 中开启 emitDecorateMetadata

```javascript
// router/index.ts 

import http = require("http");

import {scannerControllers, registerControllerToRouter} from "ts-express-restful";

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
import {AbstractController, Restful, Router} from "ts-express-restful";

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

### service自动注入
```
    @Service()
    export class TestService {

        sayHello() {
            return 'hello world';
        }
    }

    @Restful
    export class TestController {

        @Autowire
        test: TestService;

        @GetMapping("/helloword")
        sayHello(req, res, next) {
            res.send(this.test.sayHello());
        }
    }
```

# changelog
- V 3.0 支持 @SchemaFilter 直接支持按照指定的schema过滤返回给客户端的结果,schema 参考 https://www.npmjs.com/package/json-filter2
- v 4.0 使用 reflect-metadata 重新实现metadata信息
- v 4.0 重新实现 @Service @Autowire