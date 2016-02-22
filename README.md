# angular2-template-caching
* angular2 template cache replacement (angular $templateCache) to cache the templates from @Component {templateUrl:} on production servers.
* Uses angular grunt-inline-angular-templates to generate and write the templates inside index.html



##Getting started

* Install dependencies and start compiling:
`
npm install
`

* Run if you want to watch for changes in the file system - e.g. when editing
./node_modules/.bin/webpack --watch

* Optionally start the static resources server (and visit http://localhost:8080
     npm start
or use a server of your choice and open index.html in any browser

* run grunt default task to execute grunt-inline-angular-templates task e.g.

`grunt build`

* Copy RuntimeMetadataResolverWrapper and TemplateCacheResolver classes within your project
* Add the code to the app bootstrapper:

`
bootstrap(<any>RouterComponent, [
    ROUTER_PROVIDERS,
    TemplateCacheResolver,
    provide(LocationStrategy, {useClass: HashLocationStrategy}),
    provide(RuntimeMetadataResolver, {useClass: RuntimeMetadataResolverWrapper}),
    Http,
    HTTP_PROVIDERS,
    FORM_DIRECTIVES
]);
`

The webpack task won't be necessary if system.js is used (index.html has to be modified to work with system.js).