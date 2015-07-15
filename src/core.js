/**
 * # $dictate
 */
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
                /**
                 * @method getManager
                 * @description Gets the EntityManager.
                 * @return {Object} The EntityManager.
                 */
                getManager: function() {
                    return $dictateManager;
                },
                /**
                 * @method wipe
                 * @description Removes all entities from the LocalStorage and clear managed entities.
                 */
                wipe: function() {
                    angular.forEach($dictateMapping, function (relations, entityName) {
                        localStorageService.set(entityName, {});
                        $dictateEntities[entityName] = {};
                    });
                }
            };
        }
    });
