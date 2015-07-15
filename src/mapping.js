/**
 * # Mapping
 * A mapping defines associations between entities, in other words the relational schema.
 *
 * ## Associations
 * Associations between entities are represented just like in regular object using references to other objects or collections of objects.
 *
 * The following associations exist:
 *
 * ```hasOne``` References an other object.
 * ```hasMany``` References a collection of objects.
 *
 * ## Cascade operations
 * Persisting, removing, detaching, refreshing and merging individual entities can become pretty cumbersome, especially when a highly interweaved object graph is involved. Therefore Doctrine 2 provides a mechanism for transitive persistence through cascading of these operations. Each association to another entity or a collection of entities can be configured to automatically cascade certain operations. By default, no operations are cascaded.
 *
 * The following cascade options exist:
 *
 * ```persist``` Cascades persist operations to the associated entities.
 * ```remove``` Cascades remove operations to the associated entities.
 * ```merge``` Cascades merge operations to the associated entities.
 * ```detach``` Cascades detach operations to the associated entities.
 * ```refresh``` Cascades refresh operations to the associated entities.
 * ```all``` Cascades persist, remove, merge, refresh and detach operations to associated entities.
 *
 * ---
 */
angular
    .module('softilabs.ngDictate.mapping', [])
    .factory('$dictateMapping', function () {

        return {};
    });
