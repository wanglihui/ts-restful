import { Restful, GetMapping } from '../../../core/decorator';

@Restful()
export default class Ignore {

    @GetMapping('/index')
    index() {
        return ''
    }
}