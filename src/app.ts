import {provide} from "angular2/core";
import {ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy} from "angular2/router";
import {RouterComponent} from "./router/router-component";
import {Http, HTTP_PROVIDERS} from "angular2/http";
import {bootstrap} from "angular2/platform/browser";

import {RuntimeMetadataResolver} from "angular2/src/compiler/runtime_metadata";
import {FORM_DIRECTIVES} from "angular2/common";
import {RuntimeMetadataResolverWrapper} from "./runtime-metadata-resolver-wrapper";
import {TemplateCacheResolver} from "./template-cache-resolver";

bootstrap(<any>RouterComponent, [
    ROUTER_PROVIDERS,
    TemplateCacheResolver,
    provide(LocationStrategy, {useClass: HashLocationStrategy}),
    provide(RuntimeMetadataResolver, {useClass: RuntimeMetadataResolverWrapper}),
    Http,
    HTTP_PROVIDERS,
    FORM_DIRECTIVES
]);