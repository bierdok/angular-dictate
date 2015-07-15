/**
 * # EntityManager
 * An EntityManager provides the access point to the complete lifecycle management of your entities and transforms entities from and back to persistence.
 */
angular
    .module('softilabs.ngDictate.manager', [])
    .factory('$dictateManager', function ($dictateCachedEntities, $dictateEntities, $dictateMapping, $dictateRepositories, $dictateRepository, localStorageService) {

        var Manager = {
            /**
             * @method clear
             * @description Clears the EntityManager. All entities that are currently managed by this EntityManager become detached.
             * @param {string} [entityName] The name of the entity. If given, only associated entities will get detached.
             */
            clear: function (entityName) {
                if (entityName) {
                    $dictateEntities[entityName] = localStorageService.get(entityName);
                    return;
                }
                angular.forEach($dictateMapping, function (relations, entityName) {
                    $dictateEntities[entityName] = localStorageService.get(entityName);
                });
            },
            /**
             * @method contains
             * @description Determines whether an entity instance is managed in this EntityManager.
             * @param {Object} entity The entity to check.
             * @return {boolean} Returns true on success if this EntityManager currently manages the given entity, false otherwise.
             */
            contains: function (entity) {
                return !!$dictateEntities[entity['_name']][entity['_uid']];
            },
            /**
             * @method detach
             * @description Detaches an entity from the EntityManager, causing a managed entity to become detached. Unflushed changes made to the entity if any (including removal of the entity), will not be synchronized to the LocalStorage. Entities which previously referenced the detached entity will continue to reference it.
             * @param {Object} entity The entity to detach.
             */
            detach: function (entity) {
                cascade('detach', entity);
                delete $dictateEntities[entity['_name']][entity['_uid']];
            },
            /**
             * @method find
             * @description Repository alias. Finds an entity by its identifier.
             * @param {string} entityName The name of the entity.
             * @param {number} id The identifier of the entity.
             * @return {Object|null} The entity.
             */
            find: function (entityName, id) {
                return $dictateRepositories[entityName].find(id);
            },
            /**
             * @method flush
             * @description Flushes all changes to objects that have been queued up to now to the LocalStorage. This effectively synchronizes the in-memory state of managed objects with the LocalStorage.
             * @param {string} [entityName] The name of the entity. If given, only associated entities will get flushed.
             */
            flush: function (entityName) {
                if (entityName) {
                    localStorageService.set(entityName, $dictateEntities[entityName]);
                    return;
                }
                angular.forEach($dictateMapping, function (relations, entityName) {
                    localStorageService.set(entityName, $dictateEntities[entityName]);
                });
            },
            /**
             * @method getRepository
             * @description Gets the repository for an entity name.
             * @param {string} entityName The name of the entity.
             * @return {Object} The repository.
             */
            getRepository: function (entityName) {
                return $dictateRepositories[entityName];
            },
            /**
             * @method merge
             * @description Merges the state of a detached entity into the persistence context of this EntityManager and returns the managed copy of the entity. The entity passed to merge will not become associated/managed with this EntityManager.
             * @param {Object} The detached entity to merge into the persistence context.
             * @return {Object} The managed copy of the entity.
             */
            merge: function (entity) {
                cascade('merge', entity);
                var entity = angular.copy(entity);
                $dictateEntities[entity['_name']][entity['_uid']] = entity;
                return entity;
            },
            /**
             * @method new
             * @description Repository alias. Factory method to create a new entity instance.
             * @param {string} entityName The name of the entity.
             * @param {Object} [properties] The properties of the entity.
             * @return {Object} The entity.
             */
            new: function (entityName, properties) {
                return $dictateRepositories[entityName].new(properties);
            },
            /**
             * @method persist
             * @description Tells the EntityManager to make an instance managed and persistent. The entity will be entered into the LocalStorage as a result of the flush operation.
             * @param {Object} entity The entity to persist.
             */
            persist: function (entity) {
                cascade('persist', entity);
                $dictateEntities[entity['_name']][entity['_uid']] = entity;
            },
            /**
             * @method refresh
             * @description Refreshes the persistent state of an entity from the LocalStorage, overriding any local changes that have not yet been persisted.
             * @param {Object} entity The entity to refresh.
             */
            refresh: function (entity) {
                cascade('refresh', entity);
                angular.copy(localStorageService.get(entity['_name'])[entity['_uid']], entity);
            },
            /**
             * @method remove
             * @description Removes an entity instance. A removed entity will be removed from the LocalStorage as a result of the flush operation.
             * @param {Object} entity The entity to remove.
             */
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
