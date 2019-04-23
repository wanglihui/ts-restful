import { SwaggerProperty } from '../../../core/swagger';

export class Test3 { 
    @SwaggerProperty({type: 'integer', description: "字段a"})
    public a = 1;
    @SwaggerProperty()
    public b = '2';
    
    constructor(public y = 1, public z = 2) { 
        this.a = 1;
        this.b = '2';
    }
}

export class X { 
    @SwaggerProperty({type: 'integer', description: '属性a'})
    public a = 1;
}