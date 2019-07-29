/**
 * Created by wlh on 2017/11/1.
 */


'use strict';
import {AbstractController} from "../../../core/AbstractController";
import {Restful, RequestMapping, QueryStringParam, HttpRequest} from "../../../core/decorator";
import { Api } from '../../../core/swagger';
import { Request} from 'express-serve-static-core';

@Restful
export class OtherController extends AbstractController {

    $isValidId(id: string) {
        return /^\d+$/.test(id);
    }

    @Api("获取用户信息", "通过用户ID获取单条用户信息")
    @RequestMapping('/user')
    get(ctx: any) { 
        return {}
    }

    @Api("添加用户")
    add(ctx: any) { 
    }

    @Api("获取列表")
    find(ctx: any) {
        return [];
    }

    @Api("删除用户")
    delete(ctx: any) { 

    }

    @RequestMapping('/test-property-decorate')
    testPropertyDecorate(@QueryStringParam test: any) { 
        return test;
    }

    @RequestMapping("/test-inject-request")
    testInjectRequest(@HttpRequest req: Request) { 
        return req.query;
    }
}