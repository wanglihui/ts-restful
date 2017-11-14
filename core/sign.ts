/**
 * Created by wlh on 2017/11/14.
 */

'use strict';

import crypto = require("crypto");
function md5(str) {
    //计算签名
    return crypto.createHash("md5").update(str).digest('hex');
}

export default function sign(originData: any, key: string) : string {
    //排序
    let sortedData = sortData(originData);
    //转成字符串
    sortedData = JSON.stringify(sortedData);
    //替换所有空格
    sortedData = sortedData.replace(/\s+/g, '');
    sortedData = sortedData+key;
    return md5(sortedData);
    // let sign = md5.update(sortedData).digest('hex');
    // return sign;
}

//排序函数
function sortData(data) {
    if (!isObject(data)) {
        return data
    }
    let sortedKeys = [];
    let sortedObject = {};
    for(let key in data) {
        sortedKeys.push(key);
        sortedKeys.sort();
        //排序value
        let val = data[key]
        if (isObject(val)) {
            val = sortData(val);
        }
        data[key] = val;
    }

    //将排序好的重新赋值
    sortedKeys.forEach( (key) => {
        sortedObject[key] = data[key];
    });
    return sortedObject;
}

function isObject(obj) {
    return Object.prototype.toString.bind(obj).call() == '[object Object]'
}