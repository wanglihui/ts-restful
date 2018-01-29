/**
 * Created by wlh on 2017/8/28.
 */

'use strict';

import fs = require("fs")
import path = require("path");
import { Request, Response } from 'express';

const controllers = {};
export function getControllers() {
    return controllers;
}

export interface RouterOptionInterface { 
    doc?: string;
}

export function Router(url: string, method?: string | RouterOptionInterface, options?: RouterOptionInterface) {
    return function (target, propertyKey, desc) {
        let defaultMethod = 'GET'
        if (typeof method == 'object') { 
            options = <RouterOptionInterface>method;
            method = defaultMethod
        }
        let fn = desc.value;
        fn.$url = url;
        fn.$method = method || defaultMethod;
        fn.$doc = options && options.doc;
    }
}

export function Restful(mountUrl?: string) {
    return function(target) {
        target.prototype.$isValidId = target.prototype.$isValidId || function(id) {
            return /^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/.test(id.toString());
        };

        if (!mountUrl) {
            mountUrl = '/' + target.name.replace(/Controller/, '');
        }
        controllers[mountUrl] = target;
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

export function ResponseBody() { 
    return  function (target, propertyKey, desc) { 
        let fn: ResponseBodyFunc = desc.value;
        desc.value = async function(req, res, next) {
            let ctx = {
                req,
                res,
                next,
            }
            let ret = await fn.bind(this)(ctx);
            return res.json(ret);
        }
    }
}


const services: {[index: string]: any} = {}

export function Service(name?: string) {

    return function(constructor) {
        if (!name) {
            name = constructor.name.toLowerCase();
        }
        if (services[name]) {
            console.warn(`\n!!!ignore registry [${constructor.name}], services [${name}] has register [${services[name].name}]!!!\n`);
            return;
        }
        services[name] = constructor;
    }

}

const waitInject: Array<{target, funcName, serviceName}> = [];

export function AutoInject(serviceName?: string) {
    return function(target, funcName, desc) {
        if (!serviceName) {
            serviceName = funcName;
        }
        waitInject.push({
            target,
            funcName,
            serviceName
        });
    }
}

function _inject() {
    if (!services.$cache) {
        services.$cache = {};
    }
    for(let item of waitInject) {
        let {serviceName, target, funcName} = item;
        let serv = services.$cache[serviceName]
        if (!serv) {
            if (!services[serviceName]) {
                throw new Error(`no service [${serviceName}] registry`);
            }
            serv = new services[serviceName]();
            services.$cache[serviceName] = serv;
        }

        Object.defineProperty(target, funcName, {
            get: function() {
                return serv;
            }
        })
    }
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

export function scannerDecoration(dir: string, ignores?: (string|RegExp)[]) {
    _scan(dir, ignores);
    _inject();
}

