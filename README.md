# angular2-template-caching
* angular2 template cache replacement (angular $templateCache) to cache the templates from @Component {templateUrl:} on production servers.
* Uses angular grunt-inline-angular-templates to generate and write the templates inside index.html



##Getting started with the example

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


##How to use
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
* install grunt-inline-angular-templates 

`
npm install --save-dev grunt-inline-angular-templates
`

* Add a task to your Gruntfile.js to generate the templates inside index.html
* Run the task and the templates should be cached inside index.html (e.g. in build/index.html)

##Notes
* The class works with angular2.0.0-beta.7
* Optionally TemplateCacheResolver can be replaced with anything else as long as it implements the CacheResolver interface.

The webpack task won't be necessary if system.js is used (index.html has to be modified to work with system.js).