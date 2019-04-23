import { API_KEY } from './constant';
import * as path from 'path';
let pkg: any = {};
try {
    pkg = require(path.join(process.cwd(), 'package.json'));
} catch (err) { 
    console.warn(process.cwd() + "目录下找不到package.json，无法加载version,description,name信息到swagger");
}
import 'reflect-metadata';

export const swagger: ISwagger = {
    swagger: "2.0",
    info: {
        title: pkg.name,
        description: pkg.description,
        version: pkg.version,
    }
};

export function defineModel(model: any, name?: string) { 
    if (!name) { 
        name = model.name;
    }
    if (!swagger.definitions) { 
        swagger.definitions = {};
    }
    if (!swagger.definitions[name]) { 
        swagger.definitions[name] = {
            type: 'object',
            properties: {
            }
        }
    }
}

export function definePath(path: string, method: string, obj: ISwaggerPathMethod) { 
    if (!swagger.paths) { 
        swagger.paths = {};
    }
    if (!swagger.paths[path]) { 
        swagger.paths[path] = {};
    }
    if (!swagger.paths[path][method]) {
        obj = Object.assign({
            responses: {
                "200": {
                    description: "successed!",
                }
            }
        }, obj);
        swagger.paths[path][method] = obj;
    }
}

export interface ISwagger { 
    swagger?: "2.0" | "1.0";
    info?: ISwaggerInfo;
    host?: string;
    basePath?: string;
    tags?: ISwaggerTag[];
    schemas?: ISwaggerSchema[],
    paths?: ISwaggerPaths;
    securityDefinitions?: ISecurity;
    definitions?: { [index: string]: IModelDefine };
    externalDocs?: ISwaggerExternalDocs
}

export interface IModelDefine { 
    type: string;
    required?: string[];
    properties?: { [index: string]: IModelPropertity };
}

export interface IModelPropertity { 
    type: IType;
    format?: string;
    description?: string;
    $ref?: string;
    example?: string;
    enum?: string[];
}

export interface ISwaggerInfo { 
    description?: string;
    version?: string;
    title?: string;
    termsOfService?: string;
    contact?: ISwaggerInfoContract;
    license?: ISwaggerInfoLicense;
    
}
export interface ISwaggerInfoContract { 
    email?: string;
}

export interface ISwaggerInfoLicense { 
    type?: string;
    url?: string;
}

export interface ISwaggerTag { 
    name: string;
    description: string;
    externalDocs?: ISwaggerExternalDocs;
}

export interface ISwaggerExternalDocs { 
    description?: string;
    url?: string;
}

export type ISwaggerSchema = "https" | "http" | "ftp";

export interface ISwaggerPaths { 
    [index: string]: ISwaggerMethods;
}

export interface ISwaggerMethods { 
    [index: string]: ISwaggerPathMethod
}

export interface ISwaggerPathMethod { 
    tags?: string[];
    summary?: string;
    description?: string;
    operationId?: string;
    consumes?: string[];
    produces?: string[];
    parameters?: ISwaggerParam[];
    responses?: { [index: string]: ISwaggerResponse };
    security?: any;
    deprecated?: boolean;
}

export interface ISwaggerParam { 
    in: string;
    name: string;
    description?: string;
    required: boolean;
    schema?: {
        $ref?: string;
    };
    type?: IType;
    format?: string;
    items?: ISwaggerParamItem;
    collectionFormat?: "multi"
}

export interface ISwaggerParamItem { 
    type?: IType;
    enum?: string[];
    default?: string;
}

export interface ISwaggerResponse { 
    description?: string;
    schema?: {
        type?: IType;
        items?: {
            $ref?: string;
        }
        additionalProperties?: {
            type?: IType;
            format?: string;
        },
        $ref?: string;
    };
}

type IType = "array" | "string" | "integer" | "enum";

export interface ISecurity { 
    [index: string]: IOAuth | IApiKey;
}

export interface IOAuth { 
    type: "oauth2";
    authorizationUrl?: string;
    flow?: "string";
    scopes?: { [index: string]: string };
}
export interface IApiKey { 
    type: "apiKey";
    name: string;
    in?: string;
}

export interface ISwaggerPropertyOption { 
    type?: IType;
    description?: string;
}

export function SwaggerProperty(options?: ISwaggerPropertyOption) { 
    return function (target, propertyKey) { 
        if (!swagger.definitions) { 
            swagger.definitions = {};
        }
        let name = target.constructor.name;
        if (!swagger.definitions[name]) { 
            swagger.definitions[name] = {
                type: 'object',
            };
        }
        if (!swagger.definitions[name].properties) { 
            swagger.definitions[name].properties = {};
        }
        swagger.definitions[name].properties[propertyKey] = {
            type: options && options.type || 'string',
            description: options && options.description,
        };
    }
}

export function Api(sumary: string, description?: string) { 
    return function (target, propertyKey) { 
        Reflect.defineMetadata(API_KEY, { sumary, description }, target, propertyKey);
    }
}