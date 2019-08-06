import AbstractCtrl from './abstract';
import { Restful } from '../../../core/decorator';

@Restful()
export default class ExtController extends AbstractCtrl {

    async get() {
        return 2;
    }
}