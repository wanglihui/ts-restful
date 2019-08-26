import * as request from "supertest";
import {app} from './app';

export function testUrl(url: string, method: string) {
    return request(app)[method](url)
    .expect(200);
}