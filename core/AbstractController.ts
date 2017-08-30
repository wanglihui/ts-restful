/**
 * Created by wlh on 2017/8/29.
 */

'use strict';
import {IController} from "./IController";

import {ERR_TEXT} from './code';

export abstract class AbstractController implements IController {

    reply(code: number, data: any) {
        return {
            code: code,
            data: data,
            msg: ERR_TEXT[code]
        }
    }
}