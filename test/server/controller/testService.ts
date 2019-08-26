import { Service } from "../../../core/decorator";

@Service()
export default class TestService {

    sayHello() {
        return 'helloworld';
    }
}