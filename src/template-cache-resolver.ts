import {Injectable} from "angular2/core";

export interface CacheResolver {
    isCacheHit(url:string):boolean;
    getCachedTemplate(url:string):string;
}

@Injectable()
export class TemplateCacheResolver implements CacheResolver {
    private domElementsCache = {};

    isCacheHit(templateUrl) {
        return this.getDomElement(templateUrl);
    }

    getCachedTemplate(templateUrl) {
        return this.getDomElement(templateUrl).innerHTML;
    }

    private getDomElement(templateId) {
        if (!this.domElementsCache[templateId]) {
            this.domElementsCache[templateId] = document.getElementById(templateId);
        }
        
        return this.domElementsCache[templateId];
    }
}