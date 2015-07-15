/**
 * angular-dictate
 * @version v1.4.1 (2015-07-15)
 * @link https://github.com/softilabs/angular-dictate
 * @author Benoît Bourgeois <ben.bourgeois@softilabs.com> (https://github.com/softilabs)
 * @license MIT
 */
angular
    .module('softilabs.ngDictate.cachedEntities', [])
    .factory('$dictateCachedEntities', function () {

        return {};
    });

angular
    .module('softilabs.ngDictate.cachedRepositories', [])
    .factory('$dictateCachedRepositories', function () {

        return {};
    });

angular
    .module('softilabs.ngDictate.core', [])
    .factory('$dictateCore', function ($dictateCachedEntities, $dictateCachedRepositories, $dictateEntities, $dictateManager, $dictateMapping, $dictateRepositories, $dictateRepository, localStorageService) {

        return function(config) {

            angular.copy(config.mapping, $dictateMapping);

            angular.forEach($dictateMapping, function (relations, entityName) {
                localStorageService.get(entityName) || localStorageService.set(entityName, {});

                $dictateEntities[entityName] = localStorageService.get(entityName);
                $dictateRepositories[entityName] = $dictateRepository(entityName);

                $dictateCachedEntities[entityName] = {};
                $dictateCachedRepositories[entityName] = $dictateRepository(entityName, true);
            });

            return {
                                getManager: function() {
                    return $dictateManager;
                },
                                wipe: function() {
                    angular.forEach($dictateMapping, function (relations, entityName) {
                        localStorageService.set(entityName, {});
                        $dictateEntities[entityName] = {};
                    });
                }
            };
        }
    });

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

angular
    .module('softilabs.ngDictate.inflector', [])
    .factory('$dictateInflector', function () {

        var rules = {
            plural: [
                [/move$/i, 'moves'],
                [/sex$/i, 'sexes'],
                [/child$/i, 'children'],
                [/man$/i, 'men'],
                [/foot$/i, 'feet'],
                [/person$/i, 'people'],
                [/taxon$/i, 'taxa'],
                [/(quiz)$/i, '$1zes'],
                [/^(ox)$/i, '$1en'],
                [/(m|l)ouse$/i, '$1ice'],
                [/(matr|vert|ind|suff)ix|ex$/i, '$1ices'],
                [/(x|ch|ss|sh)$/i, '$1es'],
                [/([^aeiouy]|qu)y$/i, '$1ies'],
                [/(?:([^f])fe|([lr])f)$/i, '$1$2ves'],
                [/sis$/i, 'ses'],
                [/([ti]|addend)um$/i, '$1a'],
                [/(alumn|formul)a$/i, '$1ae'],
                [/(buffal|tomat|her)o$/i, '$1oes'],
                [/(bu)s$/i, '$1ses'],
                [/(alias|status)$/i, '$1es'],
                [/(octop|vir)us$/i, '$1i'],
                [/(gen)us$/i, '$1era'],
                [/(ax|test)is$/i, '$1es'],
                [/s$/i, 's'],
                [/$/, 's']
            ],
            singular: [
                [/cookies$/i, 'cookie'],
                [/moves$/i, 'move'],
                [/sexes$/i, 'sex'],
                [/children$/i, 'child'],
                [/men$/i, 'man'],
                [/feet$/i, 'foot'],
                [/people$/i, 'person'],
                [/taxa$/i, 'taxon'],
                [/databases$/i, 'database'],
                [/(quiz)zes$/i, '$1'],
                [/(matr|suff)ices$/i, '$1ix'],
                [/(vert|ind)ices$/i, '$1ex'],
                [/^(ox)en/i, '$1'],
                [/(alias|status)es$/i, '$1'],
                [/(tomato|hero|buffalo)es$/i, '$1'],
                [/([octop|vir])i$/i, '$1us'],
                [/(gen)era$/i, '$1us'],
                [/(cris|ax|test)es$/i, '$1is'],
                [/(shoe)s$/i, '$1'],
                [/(o)es$/i, '$1'],
                [/(bus)es$/i, '$1'],
                [/([m|l])ice$/i, '$1ouse'],
                [/(x|ch|ss|sh)es$/i, '$1'],
                [/(m)ovies$/i, '$1ovie'],
                [/(s)eries$/i, '$1eries'],
                [/([^aeiouy]|qu)ies$/i, '$1y'],
                [/([lr])ves$/i, '$1f'],
                [/(tive)s$/i, '$1'],
                [/(hive)s$/i, '$1'],
                [/([^f])ves$/i, '$1fe'],
                [/(^analy)ses$/i, '$1sis'],
                [/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$/i, '$1\2sis'],
                [/([ti]|addend)a$/i, '$1um'],
                [/(alumn|formul)ae$/i, '$1a'],
                [/(n)ews$/i, '$1ews'],
                [/(.*)s$/i, '$1']
            ],
            countable: [
                'aircraft',
                'cannon',
                'deer',
                'equipment',
                'fish',
                'information',
                'money',
                'moose',
                'rice',
                'series',
                'sheep',
                'species',
                'swine'
            ]
        };

        return {
            pluralize: function (word) {
                var result = word;

                rules.plural.some(function (plural) {
                    if (plural[0].test(word)) return result = word.replace(plural[0], plural[1]);
                });

                rules.countable.some(function (countable) {
                    if (word == countable) return result = countable;
                });

                return result;
            },
            singularize: function (word) {
                var result = word;

                rules.singular.some(function (singular) {
                    if (singular[0].test(word)) return result = word.replace(singular[0], singular[1]);
                });

                rules.countable.some(function (countable) {
                    if (word == countable) return result = countable;
                });

                return result;
            },
            isSingular: function (singular) {
                return this.singularize(this.pluralize(singular)).toLowerCase() == singular.toLowerCase();
            },
            isPlural: function (plural) {
                return this.pluralize(this.singularize(plural)).toLowerCase() == plural.toLowerCase();
            }
        };
    });

angular
    .module('softilabs.ngDictate.managedEntities', [])
    .factory('$dictateEntities', function () {

        return {};
    });

angular
    .module('softilabs.ngDictate.manager', [])
    .factory('$dictateManager', function ($dictateCachedEntities, $dictateEntities, $dictateMapping, $dictateRepositories, $dictateRepository, localStorageService) {

        var Manager = {
                        clear: function (entityName) {
                if (entityName) {
                    $dictateEntities[entityName] = localStorageService.get(entityName);
                    return;
                }
                angular.forEach($dictateMapping, function (relations, entityName) {
                    $dictateEntities[entityName] = localStorageService.get(entityName);
                });
            },
                        contains: function (entity) {
                return !!$dictateEntities[entity['_name']][entity['_uid']];
            },
                        detach: function (entity) {
                cascade('detach', entity);
                delete $dictateEntities[entity['_name']][entity['_uid']];
            },
                        find: function (entityName, id) {
                return $dictateRepositories[entityName].find(id);
            },
                        flush: function (entityName) {
                if (entityName) {
                    localStorageService.set(entityName, $dictateEntities[entityName]);
                    return;
                }
                angular.forEach($dictateMapping, function (relations, entityName) {
                    localStorageService.set(entityName, $dictateEntities[entityName]);
                });
            },
                        getRepository: function (entityName) {
                return $dictateRepositories[entityName];
            },
                        merge: function (entity) {
                cascade('merge', entity);
                var entity = angular.copy(entity);
                $dictateEntities[entity['_name']][entity['_uid']] = entity;
                return entity;
            },
                        new: function (entityName, properties) {
                return $dictateRepositories[entityName].new(properties);
            },
                        persist: function (entity) {
                cascade('persist', entity);
                $dictateEntities[entity['_name']][entity['_uid']] = entity;
            },
                        refresh: function (entity) {
                cascade('refresh', entity);
                angular.copy(localStorageService.get(entity['_name'])[entity['_uid']], entity);
            },
                        remove: function (entity) {
                cascade('remove', entity);
                delete $dictateEntities[entity['_name']][entity['_uid']];
            }
        };

        var cascade = function (operation, entity) {
            angular.forEach($dictateMapping, function (models) {
                angular.forEach(models, function (relations, type) {
                    if (type != 'cascade') return;
                    if (relations['all']) {
                        angular.forEach(relations['all'], function (relation) {
                            if (angular.isDefined(entity[relation])) {
                                if (entity[relation]['_uid']) {
                                    Manager[operation](entity[relation]);
                                } else {
                                    entity[relation].map(Manager[operation]);
                                }
                            }
                        });
                    }
                    if (relations[operation]) {
                        angular.forEach(relations[operation], function (relation) {
                            if (angular.isDefined(entity[relation])) {
                                if (entity[relation]['_uid']) {
                                    Manager[operation](entity[relation]);
                                } else {
                                    entity[relation].map(Manager[operation]);
                                }
                            }
                        });
                    }
                });
            });
        };

        return Manager;
    });

angular
    .module('softilabs.ngDictate.mapping', [])
    .factory('$dictateMapping', function () {

        return {};
    });

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

angular
    .module('softilabs.ngDictate.repositories', [])
    .factory('$dictateRepositories', function () {

        return {};
    });

angular
    .module('softilabs.ngDictate.repository', [])
    .factory('$dictateRepository', function ($dictateCachedEntities, $dictateEntity, $dictateEntities, $dictateRepositories, $dictateUid, localStorageService) {

        return function (entityName, cache) {

            var getEntities = function () {
                if(cache) return angular.extend($dictateEntities[entityName], $dictateCachedEntities[entityName]);
                return $dictateEntities[entityName];
            };

            var getEntityInstance = function (entity, uid) {
                if (entity['_uid']) return entity;
                return angular.extend(new $dictateEntity(entityName, uid), entity);
            };

            return {
                                clear: function () {
                    $dictateEntities[entityName] = localStorageService.get(entityName);
                },
                                count: function () {
                    return Object.keys(getEntities()).length;
                },
                                find: function (id) {
                    return this.findOneBy(function(entity) {
                        return entity.id == id;
                    });
                },
                                findBy: function (filter) {
                    var entities = [];
                    angular.forEach(getEntities(), function (entity, uid) {
                        if (typeof filter == 'object') {
                            var match = true;
                            angular.forEach(filter, function (value, name) {
                                if (entity[name] != value) match = false;
                            });
                            if (match) {
                                entities.push(getEntityInstance(entity, uid));
                            }
                        } else if (typeof filter == 'function') {
                            if (filter(entity)) {
                                entities.push(getEntityInstance(entity, uid));
                            }
                        } else {
                            entities.push(getEntityInstance(entity, uid));
                        }
                    });
                    return entities;
                },
                                findAll: function () {
                    return this.findBy();
                },
                                findOneBy: function (filter) {
                    var result = this.findBy(filter);
                    return result.length == 1 ? result[0] : null;
                },
                                new: function (proprietes) {
                    return angular.extend(new $dictateEntity(entityName, $dictateUid()), proprietes || {});
                }
            };
        };
    });

angular
    .module('softilabs.ngDictate.uid', [])
    .factory('$dictateUid', function () {

        return function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        };
    });
