/**
 * # Entity
 * An entity contains persistable properties. A persistable property is an instance variable of the entity that is saved into and retrieved from the LocalStorage by Dictate’s data mapping capabilities.
 */
angular
    .module('softilabs.ngDictate.entity', [])
    .factory('$dictateEntity', function ($dictateCachedEntities, $dictateCachedRepositories, $dictateInflector, $dictateEntities, $dictateMapping) {

        var Entity = function (name, uid) {

            var self = this;

            Object.defineProperty(self, '_name', {
                get: function () {
                    return name;
                }
            });

            Object.defineProperty(self, '_uid', {
                get: function () {
                    return uid;
                }
            });

            angular.forEach($dictateMapping[name], function(foreignEntityNames, type) {
                switch (type) {

                    case 'hasOne':
                        angular.forEach(foreignEntityNames, function(foreignEntityName) {
                            var repository = $dictateCachedRepositories[foreignEntityName];
                            var foreignEntityKey = foreignEntityName + '#';
                            Object.defineProperty(self, foreignEntityName, {
                                get: function () {
                                    if (self[foreignEntityKey]) {
                                        return repository.findOneBy(function(entity) {
                                            return entity['_uid'] == self[foreignEntityKey];
                                        });
                                    }
                                    return undefined;
                                },
                                set: function (entity) {
                                    self[foreignEntityKey] = entity['_uid'];
                                }
                            });
                        });
                        break;

                    case 'hasMany':
                        angular.forEach(foreignEntityNames, function(foreignEntityName) {
                            Object.defineProperty(self, foreignEntityName, {
                                get: function () {
                                    foreignEntityName = $dictateInflector.singularize(foreignEntityName);
                                    var repository = $dictateCachedRepositories[foreignEntityName];
                                    return repository.findBy(function(entity){
                                        return entity[name + '#'] == uid;
                                    });
                                }
                            });
                        });
                        Object.defineProperty(self, 'add', {
                            get: function () {
                                return function(entity) {
                                    entity[name + '#'] = uid;
                                };
                            }
                        });
                        Object.defineProperty(self, 'remove', {
                            get: function () {
                                return function(entity) {
                                    delete entity[name + '#'];
                                };
                            }
                        });
                        break;
                }
            });

            $dictateCachedEntities[name][uid] = self;
        };

        return Entity;
    });
