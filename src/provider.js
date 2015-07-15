angular
    .module('softilabs.ngDictate', [
        'softilabs.ngDictate.cachedEntities',
        'softilabs.ngDictate.cachedRepositories',
        'softilabs.ngDictate.core',
        'softilabs.ngDictate.entity',
        'softilabs.ngDictate.inflector',
        'softilabs.ngDictate.managedEntities',
        'softilabs.ngDictate.manager',
        'softilabs.ngDictate.mapping',
        'softilabs.ngDictate.repositories',
        'softilabs.ngDictate.repository',
        'softilabs.ngDictate.uid',
        'LocalStorageModule'
    ])
    .provider('$dictate', function () {

        var config = {
            mapping: {}
        };

        return {
            setMapping: function (mapping) {
                config.mapping = mapping;
            },
            $get: function ($dictateCore) {
                return $dictateCore(config);
            }
        };
    });
