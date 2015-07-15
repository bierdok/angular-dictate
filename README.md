# AngularDictate

AngularDictate is an object-relational mapper (ORM) based on [Doctrine Project](http://www.doctrine-project.org/) for [AngularJS](http://angularjs.org/) applications that provides transparent persistence for Javascript objects. It uses the Data Mapper pattern at the heart, aiming for a complete separation of your domain/business logic from the persistence in the LocalStorage.

The benefit of AngularDictate for the programmer is the ability to focus on the object-oriented business logic and worry about persistence only as a secondary problem. This doesn’t mean persistence is downplayed by AngularDictate, however it is our belief that there are considerable benefits for object-oriented programming if persistence and entities are kept separated.

## Documentation

+ Check the [documentation](https://github.com/softilabs/angular-dictate/blob/master/doc/current.md)


## Quick start

+ Install AngularDictate with [Npm](https://www.npmjs.com/) and [Bower](https://github.com/bower/bower).

>
```bash
$ npm install -g bower gulp
$ bower install angular-dictate --save
```

+ Include the required libraries in your `index.html`:

>
``` html
<script src="bower_components/angular/angular.min.js"></script>
<script src="bower_components/angular-local-storage/dist/angular-local-storage.min.js"></script>
<script src="bower_components/angular-dictate/dist/angular-dictate.min.js"></script>
```

+ Inject the `softilabs.ngDictate` module into your app and set the mapping:

>
``` js
angular
    .module('myApp', [
        'myApp.myCtrl',
        'softilabs.ngDictate'
    ])
    .config(function ($dictateProvider) {
        $dictateProvider.setMapping({
            address: {},
            company: {
                hasOne: ['address'],
                hasMany: ['persons'],
                cascade: {
                    all: ['address']
                }
            },
            person: {
                hasOne: ['address'],
                hasOne: ['company'],
                cascade: {
                    all: ['address'],
                    persist: ['company']
                }
            }
        });
    });
```

+ Obtain the entity manager in a controller:

>
``` js
angular
    .module('myApp.myCtrl', [])
    .controller('MyCtrl', function ($dictate) {
        var em = $dictate.getManager();
    });
```

+ Read the documentation.

## Communication

- If you **need help**, use [Stack Overflow](http://stackoverflow.com/questions/tagged/angular-dictate). (Tag 'angular-dictate')
- If you **found a bug**, open an issue.
- If you **have a feature request**, open an issue.
- If you **want to contribute**, submit a pull request.

## Developers

+ Clone the repo, `git clone git://github.com/softilabs/angular-dictate.git` or [download the latest release](https://github.com/softilabs/angular-dictate/zipball/master).

+ Build and run the docker image [selenium/standalone-chrome](https://registry.hub.docker.com/u/selenium/standalone-chrome/).

+ You will need to have bower, gulp installed globally into your node environment. 

>
``` bash
$ npm install
$ bower install
$ gulp build [-m]
$ gulp doc
$ gulp test [-s <spec>] [-w]
```

## Copyright and license

```
The MIT License

Copyright (c) 2015 SoftiLabs

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```