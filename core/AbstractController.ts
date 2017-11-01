/**
 * Created by wlh on 2017/8/29.
 */

'use strict';
import {IController} from "./IController";

import {ERR_TEXT} from './code';

export abstract class AbstractController implements IController {

    abstract $isValidId(id: string) :boolean;
    reply: reply;
}

export function reply(code, data): ReplyData {
    let msg = ERR_TEXT[code];
    return {
        code,
        msg,
        data,
    }
}