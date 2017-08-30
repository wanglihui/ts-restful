/**
 * Created by wlh on 2017/5/10.
 */

'use strict';

export enum ERR {
    NOT_FOUND = 404,
    NOT_PERMIT = 403,
    INVALID_SIGN = 500,
    REQ_TIMEOUT = 501,
    REQ_PARAM_ERROR = 502,
    OK = 0
}

export const ERR_TEXT = {
    404: '资源不存在',
    403: '没有权限访问',
    500: '签名错误',
    501: '请求超时',
    502: '参数不正确',
    0: 'ok'
}