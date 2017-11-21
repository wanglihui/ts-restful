/**
 * Created by wlh on 2017/8/29.
 */


'use strict';
import {IController, ReplyData} from "./IController";
import {ERR_TEXT} from './code';

export function reply(code: number, data: any): ReplyData {
    let msg = ERR_TEXT[code];
    let responseTime = Date.now();

    let respData:ReplyData = {
        code,
        msg,
        responseTime,
        data,
    }
    return respData;
}

export abstract class AbstractController implements IController {

    abstract $isValidId(id: string) :boolean;
    reply= reply;
}

