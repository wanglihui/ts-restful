import * as request from 'supertest';
import { app } from '../../app';

describe('#get #update #delete #add #find() auto to mount restful', () => {

    it("#get should be mount on /:id", async() => {
        return request(app)
            .get('/auto-restful/1')
            .expect(200);
    })


    it("#find should be mount on /", async() => {
        return request(app)
            .get('/auto-restful/')
            .expect(200);
    })


    it("#add should be mount on /", async() => {
        return request(app)
            .post('/auto-restful/')
            .expect(200);
    })

    it("#delete should be mount on /", async() => {
        return request(app)
            .delete('/auto-restful/')
            .expect(200);
    })

    it("#update should be mount on /", async() => {
        return request(app)
            .put('/auto-restful/1')
            .expect(200);
    })
})