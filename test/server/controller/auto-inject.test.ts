import * as request from 'supertest';
import { app } from '../../app';
import * as assert from 'assert';

describe("inject service", () => {
    it("@Autowire should be ok", async () => {

        request(app)
        .get('/autoinject')
        .expect(200)
        .then( (res) => {
            assert.equal(res.body, 'helloworld');
        })
    })
})