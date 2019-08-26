# restful

[![CircleCI](https://circleci.com/gh/wanglihui/ts-restful.svg?style=svg)](https://circleci.com/gh/wanglihui/ts-restful)

```
------------------------|----------|----------|----------|----------|-------------------|
File                    |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
------------------------|----------|----------|----------|----------|-------------------|
All files               |    68.97 |    49.52 |    65.71 |    69.82 |                   |
 ts-restful             |      100 |      100 |      100 |      100 |                   |
  index.ts              |      100 |      100 |      100 |      100 |                   |
 ts-restful/core        |    69.89 |    34.78 |    63.64 |    70.22 |                   |
  AbstractController.ts |      100 |      100 |      100 |      100 |                   |
  constant.ts           |      100 |      100 |      100 |      100 |                   |
  decorator.ts          |    76.34 |    52.17 |    72.97 |    77.42 |... 59,168,169,188 |
  swagger.ts            |    30.56 |        0 |        0 |    30.56 |... 05,207,215,216 |
 ts-restful/core/router |    67.69 |    56.83 |    69.23 |     68.9 |                   |
  index.ts              |    67.69 |    56.83 |    69.23 |     68.9 |... 74,382,398,410 |
------------------------|----------|----------|----------|----------|-------------------|
```

### 快速使用
- 支持express和KOA
- 为了简化ts-express-restful 模块使用，实现了一个[restful-started](https://www.npmjs.com/package/restful-started) 模块，使用默认配置，一句启动项目.


### 这个模块主要做那些事情

- 根据约定自动扫描controller生成路由
- 依赖注入
- 函数参数自动注入
- 综上：减少模板代码，使项目代码更易读

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
- <del>@ResponseBody()</del> 直接在函数中return默认将结果输出
  - 直接将函数返回内容作为response相应内容
- <del>@SchemaFilter(schema: any, checkType: boolean) </del>
  - 按照schema指定的格式过滤返回结果, checkType 如果不指定或者未true，将严格检查响应的类型是否和指定的schema类型匹配
- @Autowire 
  - 自动注入Service
- @Service 
  - 将一个class标记为service
- <del>@RequestBody</del> @RequestBodyParam @RequestParam @HttpRequest @HttpResponse @QueryStringParam
  - 自动注入函数参数 
  - @RequestBody 注入 req.body, 
  - @RequestBodyParam 注入 req.body.[参数名]
  - @RequestParam 注入 req.param.[参数名]
  - @QueryStringParam 注入  req.query.[参数名]
  - @HttpRequest 注入 req
  - @HttpResponse 注入 response

### 使用
---

###### tsconfig.json 中开启 emitDecorateMetadata

- 注意: 5.0 后不推荐直接使用 req, res 等，推荐使用 @RequestBody @RequestParam 等获取参数，方便生成文档

```javascript
// router/index.ts 

import http = require("http");

import {scannerControllers, registerControllerToRouter} from "ts-express-restful";

import path = require("path");
import express = require("express");
var router = express.Router();

scannerControllers(path.join(__dirname, 'controller'));
//挂载到express
registerControllerToRouter(router);


export async function initHttp(app) {
    app.use('/api/v1', router);
}

//或者挂载到koa
// import * as Router from 'koa-router';
// var app = new Koa();
// var route = new Router();
//registerControllerToKoaRouter(router);
// app.use(route.routes());
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

### @RequestBody @RequestBodyParam @QueryStringParam @HttpRequest @HttpRepsonse
```javascript
@Restful()
export class TestController {

    @PostMapping("/test")
    async test(@RequestBody test: Test) {
        return test;
    }

    @GetMapping("/test2")
    async test2(@QueryStringParam keyword: string, @QueryString password: string) {
        return {keyword, password};
    }

    @PostMapping("/test3")
    async test3(@HttpRequest req: Request) {
        let body = req.body;
        return body;
    }
    
}
```

## [自动生成文档](./swagger.md)
```
     自动生成文档还有若干问题,正在解决
```

# changelog
- V 3.0 支持 @SchemaFilter 直接支持按照指定的schema过滤返回给客户端的结果,schema 参考 https://www.npmjs.com/package/json-filter2
- v 4.0 使用 reflect-metadata 重新实现metadata信息
- v 4.0 重新实现 @Service @Autowire
- v 5.0 支持 @RequestBody @RequestBodyParam @RequestParam @QueryStringParam @HttpRequest @HttpResponse 自动注入到controller函数的参数