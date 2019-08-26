import * as request from "supertest";
import {app} from './app';

export function testUrl(url: string, method: string, code: number = 200) {
    return request(app)[method](url)
    .expect(code);
}