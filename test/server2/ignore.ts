import { Restful, GetMapping } from '../../core/decorator';

@Restful()
export default class Ignore2 {

    @GetMapping('/index')
    index() {
        return ''
    }
}