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
    getUser(ctx: any) { 
        return {}
    }
}