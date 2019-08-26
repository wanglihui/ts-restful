import * as request from "supertest";

import { app } from "../../app";
import * as assert from 'assert';

describe('inject param', () => {

    it("@QueryString id: string should be ok", async () => {
        let id = '1';
        return request(app)
        .get('/param/index?id='+id)
        .expect(200)
        .then( (response) => {
            let ret = response.body;
            if (typeof ret == 'string') {
                ret = JSON.parse(ret);
            }
            assert.equal(id, ret.id);
        }) 
    })

    it("@RequestParam id: string should be ok", async () => {
        let id = '1';
        return request(app)
        .get('/param/'+id)
        .expect(200)
        .then( (response) => {
            let ret = response.body;
            if (typeof ret == 'string') {
                ret = JSON.parse(ret);
            }
            assert.equal(id, ret.id);
        }) 
    })

    it("@RequestBody id: string should be ok", async () => {
        let id = '1';
        return request(app)
        .post('/param/post-body')
        .send({id})
        .expect(200)
        .then( (response) => {
            let ret = response.body;
            console.log("=====>", ret);
            if (typeof ret == 'string') {
                ret = JSON.parse(ret);
            }
            assert.equal(id, ret.id);
        }) 
    })

    it("@RequestBodyParam id: string should be ok", async () => {
        let id = '1';
        return request(app)
        .post('/param/post-body')
        .send({id})
        .expect(200)
        .then( (response) => {
            let ret = response.body;
            console.log("=====>", ret);
            if (typeof ret == 'string') {
                ret = JSON.parse(ret);
            }
            assert.equal(id, ret.id);
        }) 
    })

    it("@Header id: string should be ok", async () => {
        let id = '1';
        return request(app)
        .get('/param/header-param')
        .set("id", id)
        .expect(200)
        .then( (response) => {
            let ret = response.body;
            console.log("=====>", ret);
            if (typeof ret == 'string') {
                ret = JSON.parse(ret);
            }
            assert.equal(id, ret.id);
        }) 
    })

    it("@Cookie id: string should be ok", async () => {
        let id = '1';
        return request(app)
        .get('/param/cookie-param')
        .set('Cookie', "id="+id)
        .expect(200)
        .then( (response) => {
            let ret = response.body;
            console.log("=====>", ret);
            if (typeof ret == 'string') {
                ret = JSON.parse(ret);
            }
            assert.equal(id, ret.id);
        }) 
    });

    it("@HttpRequest should be ok", async () => {
        let id = '1';
        return request(app)
        .get('/param/httprequest?id='+id)
        .expect(200)
        .then( (response) => {
            let ret = response.body;
            console.log("=====>", ret);
            if (typeof ret == 'string') {
                ret = JSON.parse(ret);
            }
            assert.equal(id, ret.id);
        }) 
    });

    it("@HttpResponse should be ok", async () => {
        return request(app)
        .get('/param/httpresponse')
        .expect(201)
    });

    it("@NextFunction should be ok", async () => {
        return request(app)
        .get('/param/next')
        .expect(200)
    });

    it("@QueryString @RequestParam muti inject should be ok", async () => {
        let id = 1;
        let data = 2;
        let qs = 3;
        return request(app)
        .get('/param/muti-param/'+id)
        .query({data, qs})
        .expect(200)
        .then( (res) => {
            let ret = res.body;
            if (typeof ret == 'string') {
                ret = JSON.parse(ret);
            }
            assert.equal(ret.id, id);
            assert.equal(ret.data, data);
            assert.equal(ret.qs, qs);
        })
    });

    it("@QueryString @RequestParam ... overthree param inject should be ok", async () => {
        let id = 1;
        let data = 2;
        let qs = 3;
        let three = 4;
        return request(app)
        .get('/param/over-three-param')
        .query({data, qs, three, id})
        .expect(200)
        .then( (res) => {
            let ret = res.body;
            if (typeof ret == 'string') {
                ret = JSON.parse(ret);
            }
            assert.equal(ret.id, id);
            assert.equal(ret.data, data);
            assert.equal(ret.qs, qs);
            assert.equal(ret.three, three);
        })
    });
})