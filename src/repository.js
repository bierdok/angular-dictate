/**
 * # EntityRepository
 * An EntityRepository serves as a repository for entities with generic as well as business specific methods for retrieving entities.
 *
 * ---
 */
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
                /**
                 * @method clear
                 * @description Clears the repository, causing all managed entities to become detached.
                 */
                clear: function () {
                    $dictateEntities[entityName] = localStorageService.get(entityName);
                },
                /**
                 * @method count
                 * @description Returns the number of entities in the repository.
                 * @return {number} The number of entities.
                 */
                count: function () {
                    return Object.keys(getEntities()).length;
                },
                /**
                 * @method find
                 * @description Finds an entity by its identifier.
                 * @param {number} id The identifier of the entity.
                 * @return {Object|null} The entity.
                 */
                find: function (id) {
                    return this.findOneBy(function(entity) {
                        return entity.id == id;
                    });
                },
                /**
                 * @method findBy
                 * @description Finds entities by filter.
                 * @param {Function|Object} [filter] The function or object for matching the entities.
                 * @return {Array} The entities.
                 */
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
                /**
                 * @method findAll
                 * @description Finds all entities in the repository.
                 * @return {Array} The entities.
                 */
                findAll: function () {
                    return this.findBy();
                },
                /**
                 * @method findOneBy
                 * @description Finds a single entity by filter.
                 * @param {Function|Object} filter The function or object for matching the entity.
                 * @return {Object|null} The entity.
                 */
                findOneBy: function (filter) {
                    var result = this.findBy(filter);
                    return result.length == 1 ? result[0] : null;
                },
                /**
                 * @method new
                 * @description Factory method to create a new entity instance.
                 * @param {Object} [properties] The properties of the entity.
                 * @return {Object} The entity.
                 */
                new: function (proprietes) {
                    return angular.extend(new $dictateEntity(entityName, $dictateUid()), proprietes || {});
                }
            };
        };
    });
