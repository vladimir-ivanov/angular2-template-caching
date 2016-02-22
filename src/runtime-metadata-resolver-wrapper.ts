import * as cpl from "angular2/compiler";
import {LIFECYCLE_HOOKS_VALUES} from '../node_modules/angular2/src/core/linker/interfaces';

import {
    Type,
    isBlank,
    isPresent,
    stringify
} from 'angular2/src/facade/lang';

import * as md from 'angular2/src/core/metadata/directives';
import {DirectiveResolver} from 'angular2/src/core/linker/directive_resolver';
import {PipeResolver} from 'angular2/src/core/linker/pipe_resolver';
import {ViewResolver} from 'angular2/src/core/linker/view_resolver';
import {hasLifecycleHook} from 'angular2/src/core/linker/directive_lifecycle_reflector';
import {reflector} from 'angular2/src/core/reflection/reflection';
import {Inject, Optional} from 'angular2/src/core/di';
import {PLATFORM_DIRECTIVES, PLATFORM_PIPES} from 'angular2/src/core/platform_directives_and_pipes';
import {getUrlScheme} from 'angular2/src/compiler/url_resolver';
import {RuntimeMetadataResolver} from "angular2/src/compiler/runtime_metadata";
import {MODULE_SUFFIX} from "angular2/src/compiler/util";
import {TemplateCacheResolver} from "./template-cache-resolver.ts";

export class RuntimeMetadataResolverWrapper extends RuntimeMetadataResolver {
    private directiveResolver;
    private viewResolver;
    private cacheResolver;
    private directiveCache = new Map<Type, cpl.CompileDirectiveMetadata>();

    constructor(_directiveResolver:DirectiveResolver, _pipeResolver:PipeResolver,
                _viewResolver:ViewResolver, @Optional() @Inject(PLATFORM_DIRECTIVES) _platformDirectives,
                @Optional() @Inject(PLATFORM_PIPES) _platformPipes) {
        super(_directiveResolver, _pipeResolver, _viewResolver, _platformDirectives, _platformPipes);
        this.directiveResolver = _directiveResolver;
        this.viewResolver = _viewResolver;
        this.cacheResolver = new TemplateCacheResolver();
    }

    getDirectiveMetadata(directiveType:Type):cpl.CompileDirectiveMetadata {
        let meta = this.directiveCache.get(directiveType);
        if (isBlank(meta)) {
            let dirMeta = this.directiveResolver.resolve(directiveType);
            let moduleUrl = null;
            let templateMeta = null;
            let changeDetectionStrategy = null;

            if (dirMeta instanceof md.ComponentMetadata) {
                let cmpMeta = <md.ComponentMetadata>dirMeta;
                moduleUrl = calcModuleUrl(directiveType, cmpMeta);
                let viewMeta = this.viewResolver.resolve(directiveType);

                if (viewMeta.templateUrl && this.cacheResolver.isCacheHit(viewMeta.templateUrl)) {
                    viewMeta.template = this.cacheResolver.getCachedTemplate(viewMeta.templateUrl);

                    delete viewMeta.templateUrl;
                }

                templateMeta = new cpl.CompileTemplateMetadata({
                    encapsulation: viewMeta.encapsulation,
                    template: viewMeta.template,
                    templateUrl: viewMeta.templateUrl,
                    styles: viewMeta.styles,
                    styleUrls: viewMeta.styleUrls
                });
                changeDetectionStrategy = cmpMeta.changeDetection;
            }
            meta = cpl.CompileDirectiveMetadata.create({
                selector: dirMeta.selector,
                exportAs: dirMeta.exportAs,
                isComponent: isPresent(templateMeta),
                dynamicLoadable: true,
                type: new cpl.CompileTypeMetadata({
                    name: stringify(directiveType),
                    moduleUrl: moduleUrl,
                    runtime: directiveType
                }),
                template: templateMeta,
                changeDetection: changeDetectionStrategy,
                inputs: dirMeta.inputs,
                outputs: dirMeta.outputs,
                host: dirMeta.host,
                lifecycleHooks: LIFECYCLE_HOOKS_VALUES.filter(hook => hasLifecycleHook(hook, directiveType))
            });
            this.directiveCache.set(directiveType, meta);
        }
        return meta;
    }
}

function calcModuleUrl(type:Type, cmpMetadata:md.ComponentMetadata):string {
    let moduleId = cmpMetadata.moduleId;
    if (isPresent(moduleId)) {
        let scheme = getUrlScheme(moduleId);
        return isPresent(scheme) && scheme.length > 0 ? moduleId :
            `package:${moduleId}${MODULE_SUFFIX}`;
    } else {
        return reflector.importUri(type);
    }
}
