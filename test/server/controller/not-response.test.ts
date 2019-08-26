import * as request from 'supertest';
import { app } from '../../app';

describe("@NotReponse should be ok", () => {

    it("@NotResponse should be ok", async() => {
        return request(app)
        .get('/not-response')
        .expect(302)
    })
})