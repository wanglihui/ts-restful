/**
 * Created by wlh on 2017/8/28.
 */

'use strict';

import fs = require("fs")
import path = require("path");
import { Request } from '_debugger';

const controllers = {};
export function getControllers() {
    return controllers;
}

export function Router(url: string, method?: string) {
    return function(target, propertyKey, desc) {
        let fn = desc.value;
        fn.$url = url;
        fn.$method = method || 'GET';
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

function _scan(dir: string, ignores?: string[]) {
    let files = fs.readdirSync(dir);
    for(let f of files) {
        let extReg = /\.ts|\.js$/;
        if (ignores && ignores.indexOf(f.replace(extReg, '')) >= 0) {
            continue;
        }
        let p = path.join(dir, f);
        let stat = fs.statSync(p);
        if (stat.isDirectory()) {
            _scan(p);
            continue;
        }
        if (!extReg.test(p)) {
            continue;
        }
        p = p.replace(extReg, '');
        require(p);
    }
}

export function scannerDecoration(dir: string, ignores?: string[]) {
    _scan(dir, ignores);
    _inject();
}

