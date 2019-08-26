import * as request from "supertest";
import { app } from '../../app';
import { response } from 'express';

describe("$isValidId", () => {

    it("$isInvalid should be ok with \d+ rule", async() => {
        return request(app)
        .get('/valid-id/1')
        .expect(200);
    })

    it.skip("$invalidId not match rule should return 404", async () => {
        return request(app)
        .get("/valid-id/not-found")
        // .then( (res) => {
        //     console.log("返回数据==》", res.body, response);
        // })
        .expect(404)
    })
})