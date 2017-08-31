# restful
---

### 说明
---

- @Restful(mountUrl) 此装饰器可以接受一个URL函数，标示此Controller想要挂载的URL,如果没有
  挂载的URL为Controller名字去掉Controller后缀
- @Router(url) 此装饰器可以自定义Controller中函数对外的URL地址
- scannerControllers 此函数会同步遍历 controller文件夹下所有文件去执行require("文件");
- registerControllerToRouter 此函数会把所有调用了@Restful的controller注册到路由上
- Controller.$isValidId 主要是用于验证此controller 的ID风格，如果此函数返回false，则不是ID
- Controller.$before 调用Controller的每个函数之前会先调用
    $before函数，此函数中可以做一些权限校验或者数据统一

### 使用
---

```javascript
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


// controller/city.ts
import {AbstractController, Restful, Router} from "@jingli/restful";
import API from '@jingli/dnode-api';

@Restful()
export class CityController extends AbstractController {
    constructor() {
        super();
    }

    $isValidId(id: string) {
        return /^CTW?_\d+$/.test(id);
    }

    async get(req, res, next) {
        let {id} = req.params;
        let city = await API['place'].getCityInfo({cityCode: id});
        city = this.transform(city);
        res.json(this.reply(0, city));
    }

    async find(req, res, next) {
        let {keyword} = req.query;
        let cities = [];
        if (!keyword) {
            cities = await API['place'].queryHotCity({limit: 20});
        } else {
            cities = await API['place'].queryCity({keyword: keyword});
        }
        cities = cities.map( (city) => {
            return this.transform(city);
        });
        res.json(this.reply(0, cities));
    }

    private transform(city) {
        return {
            id: city.id,
            name: city.name,
            pinyin: city.pinyin,
            letter: city.letter,
            latitude: city.latitude,
            longitude: city.longitude,
            parentId: city.parentId,
        }
    }
}
```

