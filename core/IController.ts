/**
 * Created by wlh on 2017/8/29.
 */


'use strict';
export interface ReplyData {
    code: number;
    data: any;
    responseTime: number;
    msg?: string;
    sign?: string;
}

export interface IController {
    $isValidId(id: string): boolean;
    $before?: (req, res, next?)=> Promise<any>;
    reply(code: number, data: any): ReplyData;
}