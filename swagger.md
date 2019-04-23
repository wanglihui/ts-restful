# Swagger文档
---

## 注册路由时提供可选参数 swagger=true,启动文档

```
    registerControllerToRouter(router, { isShowUrls: true, kebabCase: true, group: group, swagger: true });
```

## 常用文档标签

- @Api(sumary="", description="") 用户描述单个路由信息, 比如 getUser(ctx: any);
```
    @Restful
    export class OtherController extends AbstractController {

        $isValidId(id: string) {
            return /^\d+$/.test(id);
        }

        @Api("获取用户信息", "通过用户ID获取单条用户信息")
        @ResponseBody()
        @RequestMapping('/user')
        getUser(ctx: any) { 
            return {}
        }
    }
```

- @SwaggerProperty 定义返回的Model 属性信息
```
  export class Test3 { 
    @SwaggerProperty({type: 'integer', description: "字段a"})
    public a = 1;
    @SwaggerProperty()
    public b = '2';
    
    constructor(public y = 1, public z = 2) { 
        this.a = 1;
        this.b = '2';
    }
}
```

## 其他约定
---

- swagger version title description字段默认从 process.cwd() 的 package.json 中读取
```
    let pkg: any = {};
    try {
        pkg = require(path.join(process.cwd(), 'package.json'));
    } catch (err) { 
        console.warn(process.cwd() + "目录下找不到package.json，无法加载version,description,name信息到swagger");
    }
    import 'reflect-metadata';

    export const swagger: ISwagger = {
        swagger: "2.0",
        info: {
            title: pkg.name,
            description: pkg.description,
            version: pkg.version,
        }
    };
```

- swagger 挂载路径为 /swagger,返回为json信息，可以使用 chrome swagger插件直接预览

## TODO
- 输入参数不能显示
- 输出参数只能显示打过@SwaggerProperty 属性参数