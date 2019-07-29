import { AbstractController } from '../../../core/AbstractController';
import { Restful, RequestParam, QueryStringParam, GetMapping } from '../../../core/decorator';

@Restful("/test")
export default class TestController extends AbstractController {
    $isValidId(id: string): boolean {
        return /^\d+$/.test(id);
    }

    get(@RequestParam id: number, @QueryStringParam username: string, next) {
        return {
            id,
            username,
        }
    }

    @GetMapping("/x")
    test() {
        return {
            id: 1,
            username: '/x'
        }
    }

    @GetMapping("/y")
    test2() {
        return {}
    }
}