import { URL_KEY, METHOD_KEY, DOC_KEy, SCHEMA_KEY, GROUP_KEY } from './../constant';
/**
 * Created by wlh on 2017/8/29.
 */

'use strict';
import {getControllers} from "../decorator";
import express = require("express");
import _ = require("lodash");
import 'reflect-metadata';

export interface RegisterControllerOptions {
    /**
     * 是否显示挂载的URL
     * 如果启用，则会挂载 ~urls 到router上
     */
    isShowUrls?: boolean;
    /**
     * 给挂载的URL增加一个前缀
     * 例如 /jingli
     */
    urlsPath?: string;
    /**
     * kebabCase用于解决地址大小写问题
     * /ManagerUser转为 /manager-user
     * 默认false,不启用转换
     */
    kebabCase?: boolean; //default false
    /**
     * 分组用于解决：
     * 例如有普通地址，有的需要登录后才能访问的地址，有的可能只有管理员才能访问的地址
     * 普通地址我们想挂载到 /public, 需要登录后的地址我们要挂载到 /customer 管理员的地址挂载到 /manager
     * 
     * 
     * @Group("manager")
     * @Restful()
     * export class ManagerController extends AbstractController {
     *      
     *        get(req, res, next) { res.send("ok");}
     * }
     * 
     * var router = new express.Router();
     * registerControllerToRouter(router, {group: 'manager'});
     * app.use('/manager', router);
     */
    group?: string;      //分组
    /**
     * 是否开启日志，记录请求
     */
    logging?: boolean;
}

export function registerControllerToRouter(router: express.Router, options?: RegisterControllerOptions) {
    let controllers = getControllers();
    let urls = [];
    for (let Controller of controllers) { 
        let url = Reflect.getMetadata(URL_KEY, Controller);
        //如果已经启用分组,controller没有分组名称的直接跳过
        let group = Reflect.getMetadata(GROUP_KEY, Controller);
        if (options && options.group && !group) {
            continue;
        }
        //如果已经启用分组,controller分组与期望分组不一致，直接跳过
        if (options && options.group && group.indexOf(options.group) < 0) {
            continue;
        }
        //如果没启用分组，但是controller有分组，直接跳过
        if ((!options || !options.group) && group && group.length) {
            continue;
        }
        let methods = getAllMethods(Controller);

        if (options && options.kebabCase) {
            url = _.kebabCase(url);
        }
        if (!/^\//.test(url)) {
            url = '/' + url;
        }
        let cls = new Controller();
        if (cls.$before && typeof cls.$before == 'function') {
            router.use(url, wrapNextFn.bind(cls)(cls.$before));
        }

        methods = methods.filter((fnName) => {
            const url = Reflect.getMetadata(URL_KEY, cls, fnName)
            return ['get', 'update', 'delete', 'add', 'find'].indexOf(fnName) >= 0
                || (typeof cls[fnName] == 'function' && url);
        });

        methods.forEach((fnName) => {
            let curUrl = url;
            let method = 'get';

            if (fnName == 'get') {
                curUrl += '/:id'
            }

            if (fnName == 'update') {
                curUrl += '/:id';
                method = 'put';
            }

            if (fnName == 'delete') {
                curUrl += '/:id';
                method = 'delete';
            }

            if (fnName == 'add') {
                method = 'post';
            }

            let fn = cls[fnName];
            if (Reflect.hasMetadata(URL_KEY, cls, fnName)) {
                curUrl += Reflect.getMetadata(URL_KEY, cls, fnName);
            }

            if (Reflect.hasMetadata(METHOD_KEY, cls, fnName)) {
                method = Reflect.getMetadata(METHOD_KEY, cls, fnName)
            }
            let methodDoc = '';
            if (Reflect.hasMetadata(DOC_KEy, cls, fnName)) {
                methodDoc = Reflect.getMetadata(DOC_KEy, cls, fnName)
            }
            let schema = null;
            if (Reflect.hasMetadata(SCHEMA_KEY, cls, fnName)) {
                schema = Reflect.getMetadata(SCHEMA_KEY, cls, fnName)
            }

            //验证ID是否合法
            fn = wrapVerifyIdFn.bind(cls)(fn);
            //统一处理async错误
            fn = wrapNextFn.bind(cls)(fn);

            method = method.toLowerCase();
            router[method](curUrl, fn.bind(cls));
            urls.push({ url: method.toUpperCase() + '  ' + curUrl + '  ' + methodDoc, schema: schema });
        })
    }

    if (options && options.isShowUrls) {
        let urlsPath = options.urlsPath || '/~urls';
        router.all(urlsPath, wrapNextFn(function (req, res, next) {
            res.json(urls);
        }));
    }
    return router;
}

function getAllMethods(Cls) {
    let methods = [];
    let prototype = Cls.prototype;
    do {
        if (prototype) {
            methods = methods.concat(Object.getOwnPropertyNames(prototype));
        }
        prototype = Object.getPrototypeOf(prototype)
    } while(prototype);
    return methods;
}

function wrapVerifyIdFn(fn) {
    let self = this;
    return (req, res, next) => {
        let id = req.params.id;
        if (!id) {
            return fn.bind(self)(req, res, next);
        }
        if (!self.$isValidId.bind(self)(id)) {
            if (next && typeof next == 'function') {
                return next();
            }
            return res.send('Invalid Id');
        }
        return fn.bind(self)(req, res, next)
    }

}

function wrapNextFn(fn) {
    let self = this;
    return async (req, res, next) => {
        let label = req.url;
        let beginTime = process.hrtime();
        try {
            let ret = fn.bind(self)(req, res, next);
            if (ret) { 
                ret = await ret;
            }
            return ret;
        } catch (err) { 
            return next(err);
        } finally { 
            let diff = process.hrtime(beginTime);
            console.log(`${label} ${diff[0]* 1e3 + diff[1]/1e6}ms`);
        }
    }
}