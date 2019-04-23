/**
 * Created by wlh on 2017/11/1.
 */


'use strict';
import {AbstractController} from "../../../core/AbstractController";
import {Restful, ResponseBody, RequestMapping} from "../../../core/decorator";
import { Api } from '../../../core/swagger';

@Restful
export class OtherController extends AbstractController {

    $isValidId(id: string) {
        return /^\d+$/.test(id);
    }

    @Api("获取用户信息", "通过用户ID获取单条用户信息")
    @ResponseBody()
    @RequestMapping('/user')
    get(ctx: any) { 
        return {}
    }

    @Api("添加用户")
    add(ctx: any) { 
    }

    @Api("获取列表")
    find(ctx: any) { 
    }

    @Api("删除用户")
    delete(ctx: any) { 

    }
}