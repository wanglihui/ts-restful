import { Autowire, Restful, GetMapping } from "../../../core/decorator";
import TestService from './testService';

@Restful("/autoinject")
export default class AutoInjectController {

    @Autowire
    private testService!: TestService;

    @GetMapping("/index")
    async index() {
        return this.testService.sayHello;
    }

}
