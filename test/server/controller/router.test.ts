import * as request from 'supertest';
import { testUrl } from '../../helper';

describe('router.ts', () => {

    it("/swagger should be ok when swagger is enabled", async () => {
        return testUrl('/swagger', 'get')
    })

    it("/~urls should be ok when isShowUrls is enabled", async () => {
        return testUrl('/swagger', 'get')
    })

    it("/ignore/index should be 404 when scannerDecorate with ignore string list it", async () => {
        return testUrl('/ignore/index', 'get', 404);
    })

    it("/admin/group/index should be ok when registryDecorateToRouter set group", async () => {
        return testUrl('/admin/group/index', 'get', 200);
    })
})