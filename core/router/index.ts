import { ISwaggerParam } from '../swagger';
import { URL_KEY, METHOD_KEY, DOC_KEY, SCHEMA_KEY, GROUP_KEY, API_KEY, REQUEST_BODY_SYMBOL, REQUEST_GET_SYMBOL, REQUEST_PARAM_SYMBOL, REQUEST_BODY_PARAM_SYMBOL, REQUEST_SYMBOL, RESPONSE_SYMBOL, NEXT_SYMBOL } from './../constant';
/**
 * Created by wlh on 2017/8/29.
 */

'use strict';
import {getControllers} from "../decorator";
import express = require("express");
import _ = require("lodash");
import 'reflect-metadata';
import { swagger as swaggerObj} from '../swagger';
import * as swagger from '../swagger';

const respFormat = async function(data: any) {
    return data;
}

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
    /**
     * 是否开启swagger文档
     */
    swagger?: boolean;
    /**
     * 绑定的路由是否是KOA 路由，默认为false
     */
    isKoaRouter?: boolean;
    /**
     * 格式化输出结果
     */
    respFormat?: (data: any) => Promise<any>;
}

export function getDefaultUrl(fnName: string) { 
    if (fnName == 'get') {
        return '/:id';
    }
    if (fnName == 'update') {
        return '/:id';
    }
    if (fnName == 'delete') {
        return '/:id';
    }
    return '/';
}

export function getDefaultMethod(fnName: string) { 
    if (fnName == 'get') {
        return 'get';
    }
    if (fnName == 'update') {
        return 'put';
    }
    if (fnName == 'delete') {
        return 'delete';
    }
    if (fnName == 'add') { 
        return 'post';
    }
    return 'get';
}

export function registerControllerToKoaRouter(router: any, options?: RegisterControllerOptions) {
    options = Object.assign({}, options);
    options.isKoaRouter = true;
    return registerControllerToRouter(router, options);
}

export function registerControllerToRouter(router: express.Router | any, options?: RegisterControllerOptions) {
    let controllers = getControllers();
    let urls = [];
    if (!options) {
        options = {};
    }
    if (!options.respFormat) {
        options.respFormat = respFormat;
    }
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
            const url = Reflect.getMetadata(URL_KEY, cls, fnName);
            return ['get', 'update', 'delete', 'add', 'find'].indexOf(fnName) >= 0
                || (typeof cls[fnName] == 'function' && url);
        });

        methods.forEach((fnName) => {
            let curUrl = url;
            let method = 'get';

            let fn = cls[fnName];
            if (Reflect.hasMetadata(URL_KEY, cls, fnName)) {
                curUrl += Reflect.getMetadata(URL_KEY, cls, fnName);
            } else { 
                curUrl += getDefaultUrl(fnName);
            }

            if (Reflect.hasMetadata(METHOD_KEY, cls, fnName)) {
                method = Reflect.getMetadata(METHOD_KEY, cls, fnName)
            } else { 
                method = getDefaultMethod(fnName);
            }
            let methodDoc = '';
            if (Reflect.hasMetadata(DOC_KEY, cls, fnName)) {
                methodDoc = Reflect.getMetadata(DOC_KEY, cls, fnName)
            }
            let schema = null;
            if (Reflect.hasMetadata(SCHEMA_KEY, cls, fnName)) {
                schema = Reflect.getMetadata(SCHEMA_KEY, cls, fnName)
            }

            //赋值 @RequestBody, @QueryStringParam @RequestParam @Request @Response 值
            let oldFn = fn;
            const paramNames = getFnParamNames(oldFn);
            const paramTypes = Reflect.getMetadata("design:paramtypes", cls, fnName);
            fn = function (req, res, next) { 
                //解析RequestGet
                let arr = Array.from(arguments);
                [NEXT_SYMBOL, REQUEST_BODY_SYMBOL, REQUEST_GET_SYMBOL, REQUEST_PARAM_SYMBOL, REQUEST_BODY_PARAM_SYMBOL, REQUEST_SYMBOL, RESPONSE_SYMBOL].forEach((symbol) => {
                    let needValues: number[] = Reflect.getMetadata(symbol, cls, fnName) || [];
                    let value: any = undefined;
                    needValues.map((idx) => {
                        let paramName = paramNames[idx];
                        switch (symbol) {
                            case REQUEST_BODY_SYMBOL:
                                value = req.body;
                                break;
                            case REQUEST_GET_SYMBOL:
                                value = req.query[paramName];
                                break;
                            case REQUEST_PARAM_SYMBOL:
                                value = req.params[paramName];
                                break;
                            case REQUEST_BODY_PARAM_SYMBOL:
                                value = req.body[paramName];
                                break;
                            case REQUEST_SYMBOL:
                                value = req;
                                break;
                            case RESPONSE_SYMBOL:
                                value = res;
                                break;
                            case NEXT_SYMBOL:
                                value = next;
                                break;
                            default:
                                throw new Error("not support!");
                        }
                        arr[idx] = value;
                    });
                });
                let ret = oldFn.apply(cls, arr);
                return ret;
            }
            //挂在的URL中存在/:id or /:id/ 时启用ID验证
            if (curUrl.indexOf("/:id") >= 0 || curUrl.indexOf("/:id/") >= 0) {
                fn = wrapVerifyIdFn.bind(cls)(fn);
            }
            //统一处理async错误，和返回的数据
            fn = wrapNextFn.bind(cls)(fn, options.isKoaRouter, options.respFormat);

            method = method.toLowerCase();
            router[method](curUrl, fn.bind(cls));
            console.log(method, curUrl)
            urls.push({ url: method.toUpperCase() + '  ' + curUrl + '  ' + methodDoc, schema: schema });
            if (!options.swagger) { 
                return;
            }
            //以下是生成swagger文档，如果没有开启生成文档，下面代码将不执行
            const returnType = Reflect.getMetadata("design:returntype", cls, fnName);
            let swaggerSchema: any = {
                type: returnType && returnType.name.toLowerCase(),
            }
            if (returnType && ['String', 'Boolean', 'Array', 'undefined', 'Number'].indexOf(returnType.name) < 0) { 
                swagger.defineModel(returnType);
                swaggerSchema = {
                    $ref: '#/definitions/' + returnType.name,
                }
            }
            const doc: any = Reflect.getMetadata(API_KEY, cls, fnName);
            const paramters = paramNames.map((val, index) => { 
                return {
                    name: val,
                    required: true,
                    type: paramTypes && paramTypes.length > index && paramTypes[index],
                } as ISwaggerParam;
            })
            swagger.definePath(curUrl, method, {
                parameters: paramters,
                description: doc && doc.description || methodDoc,
                summary: doc && doc.sumary || methodDoc,
                operationId: Controller.name+'.' + fnName,
                responses: {
                    "200": {
                        description: "",
                        schema: swaggerSchema
                    }
                },
                tags: [(group || '') + "." + Controller.name],
            })
        })
    }

    if (options && options.isShowUrls) {
        let urlsPath = options.urlsPath || '/~urls';
        router.all(urlsPath, wrapNextFn(function(req, res, next) {
            return urls;
        }, options.isKoaRouter, respFormat));
    }
    if (options && options.swagger) { 
        router.all('/swagger', wrapNextFn(function (req, res, next) { 
            let obj: swagger.ISwagger = JSON.parse(JSON.stringify(swaggerObj));
            obj = cleanSwagger(options.group, obj);
            return obj;
        }, options.isKoaRouter, respFormat));
    }
    return router;
}

const cacheSwaggerGroup: { [index: string]: swagger.ISwagger } = {};

function cleanSwagger(group: string, swagger: swagger.ISwagger) { 
    if (cacheSwaggerGroup[group]) { 
        return cacheSwaggerGroup[group];
    }
    let paths = Object.keys(swagger.paths);
    if (!group) { 
        group = '.';
    }
    for (let p of paths) {
        for (let method in swagger.paths[p]) {
            if (!swagger.paths[p][method]) {
                continue;
            }
            for (let t of swagger.paths[p][method].tags) {
                if (t.indexOf(group)  !== 0) {
                    delete swagger.paths[p][method]
                }
            }
        }
    }
    cacheSwaggerGroup[group] = swagger;
    return swagger;
}

function getAllMethods(Cls) {
    let methods = [];
    let prototype = Cls.prototype;
    do {
        if (prototype) {
            let keys = Object.getOwnPropertyNames(prototype);
            for(let key of keys) {
                if (methods.indexOf(key) < 0) {
                    methods.push(key);
                }
            }
        }
        prototype = Object.getPrototypeOf(prototype)
    } while(prototype);
    return methods;
}

function wrapVerifyIdFn(fn) {
    let self = this;
    return async (req, res, next) => {
        let id = req.params.id;
        if (!id) {
            return fn.bind(self)(req, res, next);
        }
        if (!self.$isValidId.bind(self)(id)) {
            //执行下次匹配
            if (next && typeof next == 'function') {
                return next();
            }
            throw new Error("Invalid ID");
        }
        return fn.bind(self)(req, res, next)
    }

}

function wrapKoaNextFn(fn, respFormat: Function) {
    let self = this;
    return async(ctx, next) => {
        let {req, res} = ctx;
        let label = req.url;
        let beginTime = process.hrtime();
        req.params = ctx.params;
        req.body = ctx.body;
        req.query = ctx.query;
        try {
            let ret = fn.bind(self)(req, res, next);
            if (ret) {
                ret = await ret;
            }
            ret = await respFormat(ret);
            if (ret) {
                ctx.body = ret;
            }
        } catch(err) {
            ctx.throw(err);
        } finally {
            let diff = process.hrtime(beginTime);
            console.log(`${label} ${diff[0]* 1e3 + diff[1]/1e6}ms`);
        }
    }
}

function wrapNextFn(fn, isKoaRouter: boolean = false, respFormat: Function) {
    let self = this;
    if (isKoaRouter) {
        return wrapKoaNextFn(fn, respFormat).bind(self);
    }

    return async (req, res, next) => {
        let label = req.url;
        let beginTime = process.hrtime();
        try {
            let ret = fn.bind(self)(req, res, next);
            if (ret) { 
                ret = await ret;
                ret = await respFormat(ret);
                res.json(ret);
            }
        } catch (err) { 
            return next(err);
        } finally { 
            let diff = process.hrtime(beginTime);
            console.log(`${label} ${diff[0]* 1e3 + diff[1]/1e6}ms`);
        }
    }
}

function getFnParamNames(fn: Function) { 
    let reg = /\(([^)]+)\)/i;
    var groups = reg.exec(fn.toString());
    if (!groups) {
        return [];
    }
    return groups[1].split(",").map((param) => {
        return param.replace(/\s/g, '');
    });
}