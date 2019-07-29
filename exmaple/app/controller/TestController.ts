import { Test3, X } from './../model/Test3';
/**
 * Created by wlh on 2017/9/16.
 */


'use strict';
import {Test} from "../model/Test";
import {Restful, Router, RequestMapping, Autowire, Doc} from "../../../core/decorator";
import {AbstractController} from "../../../core/AbstractController";

@Restful('/test-1')
export class TestController extends AbstractController{

    constructor() {
        super();
    }

    $isValidId(id: string) : boolean{
        return /^\d+$/.test(id);
    }

    @Autowire
    test: Test;

    @RequestMapping('/index', {doc: "测试首页"})
    login(req, res, next) {
        res.send(this.test.asyHello());
    }

    @Doc("返回单条信息")
    get(ctx: any) : X{
        return new X();
        // return new Test3();
    }

    @Doc("返回列表信息")
    find(ctx: any): Test3 {
        // res.send("/find");
        const test3 = new Test3();
        console.log(test3);
        return test3;
    }
}