/**
 * Created by wlh on 2017/8/29.
 */


'use strict';
import {IController, ReplyData} from "./IController";
import {ERR_TEXT} from './code';
import {getConfig} from "./config";

export function reply(code: number, data: any, key?: string): ReplyData {
    let msg = ERR_TEXT[code];
    let responseTime = Date.now();

    let respData:ReplyData = {
        code,
        msg,
        responseTime,
        data,
    }
    let singStr = null;
    key = key || getConfig().signKey;
    if (key) {
        singStr = getConfig().sign(respData, key);
    }
    respData.sign = singStr;
    return respData;
}

export abstract class AbstractController implements IController {

    abstract $isValidId(id: string) :boolean;
    reply= reply;
}

