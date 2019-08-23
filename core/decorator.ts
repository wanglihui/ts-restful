import { URL_KEY, DOC_KEY, METHOD_KEY, GROUP_KEY, SCHEMA_KEY, REQUEST_BODY_SYMBOL, REQUEST_GET_SYMBOL, REQUEST_PARAM_SYMBOL, REQUEST_BODY_PARAM_SYMBOL, REQUEST_SYMBOL, RESPONSE_SYMBOL, NEXT_SYMBOL, HEADER_SYMBOL, COOKIE_SYMBOL } from './constant';
/**
 * Created by wlh on 2017/8/28.
 */

'use strict';

import fs = require("fs")
import path = require("path");
import { Request, Response } from 'express';
import { filter } from 'json-filter2';
import 'reflect-metadata';
const controllers = [];
export function getControllers() {
    return controllers;
}

export type RouterOptionInterface = IDoc;

export interface IDoc { 
    doc?: string;
}

export function Doc(doc: string | IDoc) { 
    return function (target, propertyKey) { 
        if (typeof doc !='string') { 
            doc = doc.doc;
        }
        Reflect.defineMetadata(DOC_KEY, doc, target, propertyKey);
    }
}

export function RequestMapping(url: string, method?: string | RouterOptionInterface, options?: RouterOptionInterface) { 
    return function (target, propertyKey) {
        let defaultMethod = 'GET'
        if (typeof method == 'object') {
            options = <RouterOptionInterface>method;
            method = defaultMethod
        }
        Reflect.defineMetadata(URL_KEY, url, target, propertyKey);
        Reflect.defineMetadata(METHOD_KEY, method || defaultMethod, target, propertyKey);
        if (options && options.doc) { 
            Reflect.defineMetadata(DOC_KEY, options && options.doc, target, propertyKey);
        }
    }
}

export function PostMapping(url: string, options?: RouterOptionInterface) { 
    return RequestMapping(url, 'POST', options);
}

export function GetMapping(url: string, options?: RouterOptionInterface) { 
    return RequestMapping(url, 'GET', options);
}

export function Router(url: string, method?: string | RouterOptionInterface, options?: RouterOptionInterface) {
    return RequestMapping(url, method, options);
}

const UUID_REG = /^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/;

export function Restful(mountUrl?: string | any): any {
    const fn = function (target, url) {
        target.prototype.$isValidId = target.prototype.$isValidId || function (id) {
            return UUID_REG.test(id.toString());
        };

        if (!url) {
            url = '/' + target.name.replace(/Controller/, '');
        }
        controllers.push(target);
        Reflect.defineMetadata(URL_KEY, url, target);
    }

    if (typeof mountUrl == 'function') {
        let target = mountUrl;
        let url = '/' + target.name.replace(/Controller/, '');
        return fn(target, url);
    }
    return function (target) {
        return fn(target, mountUrl);
    }
}

export const groups = [];
/**
 * 支持Controller分组
 * @param groupName 分组名称
 */
export function Group(groupName: string) { 
    if (groupName && groups.indexOf(groupName) < 0) { 
        groups.push(groupName);
    }
    return function (target) { 
        if (!Reflect.hasMetadata(GROUP_KEY, target)) {
            Reflect.defineMetadata(GROUP_KEY, [], target);
        }
        Reflect.getMetadata(GROUP_KEY, target).push(groupName);
    }
}

export interface ContextInterface { 
    req: Request;
    res: Response;
    next?: Function;
}

export interface ResponseBodyFunc {
    (ctx: ContextInterface): Promise<Object>;
}

export function SchemaFilter(schema: { [index: string]: any }, checkType: boolean = true) { 
    return function (target, propertyKey: string, desc) { 
        let fn = desc.value;
        desc.value = async (req, res, next) => { 
            let jsonFn = res.json;
            res.json = (data: any) => { 
                return jsonFn.bind(res)(filter(data, schema, checkType))
            }
            return fn(req, res, next);
        }
        Reflect.defineMetadata(SCHEMA_KEY, schema, target, propertyKey);
        Object.assign(desc.value, fn);
    }
}


const services: {[index: string]: any} = {}
const serviceConstructors = [];

export function Service() {
    return function (constructor) {
        serviceConstructors.push(constructor);
    }
}

export function Autowire(target, key) { 
    const Constructor = Reflect.getMetadata('design:type', target, key);
    target[key] = getMatchService(Constructor);
}

function getMatchService(Constructor: any) { 
    if (!services[Constructor]) { 
        services[Constructor] = new Constructor();
    }
    return services[Constructor];
}

let extReg = /\.ts|\.js$/;

function isNeedIgnore(f: string, ignores: (string | RegExp)[]) { 
    let isIgnore = false;
    if (!ignores) { 
        return isIgnore;
    }
    
    for (let ignore of ignores) {
        if (ignore instanceof RegExp && ignore.test(f)) {
            isIgnore = true;
            break;
        }
        if (typeof ignore == 'string' && f.replace(extReg, '') == ignore) {
            isIgnore = true;
            break;
        }
    }
    return isIgnore;
}

function _scan(dir: string, ignores?: (string | RegExp)[]) {
    let files = fs.readdirSync(dir);
    for (let f of files) {
        if (isNeedIgnore(f, ignores)) { 
            continue;
        }
        let p = path.join(dir, f);
        let stat = fs.statSync(p);
        if (stat.isDirectory()) {
            _scan(p, ignores);
            continue;
        }
        if (!extReg.test(p)) {
            continue;
        }
        p = p.replace(extReg, '');
        require(p);
    }
}

/**
 * 扫描文件夹，初始化 装饰器设置
 * @param dir 
 * @param ignores 
 */
export function scannerDecoration(dir: string, ignores?: (string|RegExp)[]) {
    _scan(dir, ignores);
}

type propertyDecorateType = Symbol; //(REQUEST_BODY_SYMBOL | REQUEST_GET_SYMBOL | REQUEST_PARAM_SYMBOL);
function propertyDecorate(target, propertyName, paramterIndex, type: propertyDecorateType) { 
    const existValue = Reflect.getMetadata(type, target, propertyName) || [];
    existValue.push(paramterIndex);
    Reflect.defineMetadata(type, existValue, target, propertyName);
}

/**
 * 将request body 值赋值给参数
 * @param target 
 * @param propertyName 
 * @param paramterIndex 
 */
export function RequestBody(target: any, propertyName: string | symbol, paramterIndex: number) {
    return propertyDecorate(target, propertyName, paramterIndex, REQUEST_BODY_SYMBOL);
} 

/**
 * 获取URL中占位符参数
 * @param target 
 * @param propertyName 
 * @param paramterIndex 
 */
export function RequestParam(target: any, propertyName: string | symbol, paramterIndex: number) { 
    return propertyDecorate(target, propertyName, paramterIndex, REQUEST_PARAM_SYMBOL);
}

/**
 * 获取 QUERY STRING 参数
 * @param target 
 * @param propertyName 
 * @param paramterIndex 
 */
export function QueryStringParam(target: any, propertyName: string | symbol, paramterIndex: number) { 
    return propertyDecorate(target, propertyName, paramterIndex, REQUEST_GET_SYMBOL);
}

/**
 * 从 REQUEST Body中获取参数
 * @param target 
 * @param propertyName 
 * @param paramterIndex 
 */
export function RequestBodyParam(target: any, propertyName: string | symbol, paramterIndex: number) { 
    return propertyDecorate(target, propertyName, paramterIndex, REQUEST_BODY_PARAM_SYMBOL);
}

/**
 * 注入 Request
 * @param target 
 * @param propertyName 
 * @param paramterIndex 
 */
export function HttpRequest(target: any, propertyName: string | symbol, paramterIndex: number) { 
    return propertyDecorate(target, propertyName, paramterIndex, REQUEST_SYMBOL);
}

/**
 * 注入 Response
 * @param target 
 * @param propertyName 
 * @param paramterIndex 
 */
export function HttpResponse(target: any, propertyName: string | symbol, paramterIndex: number) { 
    return propertyDecorate(target, propertyName, paramterIndex, RESPONSE_SYMBOL);
}

/**
 * 注入 next
 * @param target 
 * @param propertyName 
 * @param paramterIndex 
 */
export function NextFunction(target: any, propertyName: string | symbol, paramterIndex: number) { 
    return propertyDecorate(target, propertyName, paramterIndex, NEXT_SYMBOL);
}

export function Header(target: any, propertyName: string | symbol, paramterIndex: number) {
    return propertyDecorate(target, propertyName, paramterIndex, HEADER_SYMBOL);
}

export function Cookie(target: any, propertyName: string| symbol, paramterIndex: number) {
    return propertyDecorate(target, propertyName, paramterIndex, COOKIE_SYMBOL);
}