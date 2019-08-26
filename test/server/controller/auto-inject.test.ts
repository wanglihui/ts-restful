import * as request from 'supertest';
import { app } from '../../app';
import * as assert from 'assert';

describe("inject service", () => {
    it("@Autowire should be ok", async () => {

        return request(app)
        .get('/autoinject/index')
        .expect(200)
        .then( (res) => {
            assert.equal(res.body, 'helloworld');
        })
    })
})