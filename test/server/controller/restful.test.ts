import {testUrl} from '../../helper';

describe("decoration", ()=> {
    it("@Restful() should be ok", async () => {
        return testUrl('/restful', 'get');
    })
    it('@Restful("/url) should be ok', async() => {
        return testUrl('/url', 'get');
    })
    it("@GetMapping should be ok", async() => {
        return testUrl('/url/get-mapping', 'get');
    })
    it("@PostMapping should be ok", async () => {
        return testUrl('/url/post-mapping', 'post');
    })
    it("@RequestMapping with delete method should be ok", async() => {
        return testUrl("/url/request-mapping", 'delete');
    })
    it("RequestMaping with put method should be ok", async() => {
        return testUrl("/url/put-mapping", "put");
    })
    it("@Router should be ok", async () => {
        return testUrl("/url/router-post", 'post');
    })
    it("@Router should be ok", async () => {
        return testUrl("/url/router-get", 'get');
    })
    it("error should be handle by", async () => {
        return testUrl("/url/error", 'get', 500);
    })
});