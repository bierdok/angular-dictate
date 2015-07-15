

<!-- Start src/cached-entities.js -->

<!-- End src/cached-entities.js -->




<!-- Start src/cached-repositories.js -->

<!-- End src/cached-repositories.js -->




<!-- Start src/core.js -->

# $dictate

## getManager()

Gets the EntityManager.

### Return:

* **Object** The EntityManager.

## wipe()

Removes all entities from the LocalStorage and clear managed entities.

<!-- End src/core.js -->




<!-- Start src/entity.js -->

# Entity
An entity contains persistable properties. A persistable property is an instance variable of the entity that is saved into and retrieved from the LocalStorage by Dictate’s data mapping capabilities.

<!-- End src/entity.js -->




<!-- Start src/inflector.js -->

<!-- End src/inflector.js -->




<!-- Start src/managed-entities.js -->

<!-- End src/managed-entities.js -->




<!-- Start src/manager.js -->

# EntityManager
An EntityManager provides the access point to the complete lifecycle management of your entities and transforms entities from and back to persistence.

## clear([entityName])

Clears the EntityManager. All entities that are currently managed by this EntityManager become detached.

### Params:

* **string** *[entityName]* The name of the entity. If given, only associated entities will get detached.

## contains(entity)

Determines whether an entity instance is managed in this EntityManager.

### Params:

* **Object** *entity* The entity to check.

### Return:

* **boolean** Returns true on success if this EntityManager currently manages the given entity, false otherwise.

## detach(entity)

Detaches an entity from the EntityManager, causing a managed entity to become detached. Unflushed changes made to the entity if any (including removal of the entity), will not be synchronized to the LocalStorage. Entities which previously referenced the detached entity will continue to reference it.

### Params:

* **Object** *entity* The entity to detach.

## find(entityName, id)

Repository alias. Finds an entity by its identifier.

### Params:

* **string** *entityName* The name of the entity.
* **number** *id* The identifier of the entity.

### Return:

* **Object** The entity.

## flush([entityName])

Flushes all changes to objects that have been queued up to now to the LocalStorage. This effectively synchronizes the in-memory state of managed objects with the LocalStorage.

### Params:

* **string** *[entityName]* The name of the entity. If given, only associated entities will get flushed.

## getRepository(entityName)

Gets the repository for an entity name.

### Params:

* **string** *entityName* The name of the entity.

### Return:

* **Object** The repository.

## merge(entity)

Merges the state of a detached entity into the persistence context of this EntityManager and returns the managed copy of the entity. The entity passed to merge will not become associated/managed with this EntityManager.

### Params:

* **Object** *entity* The detached entity to merge into the persistence context.

### Return:

* **Object** The managed copy of the entity.

## new(entityName, [properties])

Repository alias. Factory method to create a new entity instance.

### Params:

* **string** *entityName* The name of the entity.
* **Object** *[properties]* The properties of the entity.

### Return:

* **Object** The entity.

## persist(entity)

Tells the EntityManager to make an instance managed and persistent. The entity will be entered into the LocalStorage as a result of the flush operation.

### Params:

* **Object** *entity* The entity to persist.

## refresh(entity)

Refreshes the persistent state of an entity from the LocalStorage, overriding any local changes that have not yet been persisted.

### Params:

* **Object** *entity* The entity to refresh.

## remove(entity)

Removes an entity instance. A removed entity will be removed from the LocalStorage as a result of the flush operation.

### Params:

* **Object** *entity* The entity to remove.

<!-- End src/manager.js -->




<!-- Start src/mapping.js -->

# Mapping
A mapping defines associations between entities, in other words the relational schema.

## Associations
Associations between entities are represented just like in regular object using references to other objects or collections of objects.

The following associations exist:

+ ```hasOne``` References an other object.
+ ```hasMany``` References a collection of objects.

## Cascade operations
Persisting, removing, detaching, refreshing and merging individual entities can become pretty cumbersome, especially when a highly interweaved object graph is involved. Therefore Doctrine 2 provides a mechanism for transitive persistence through cascading of these operations. Each association to another entity or a collection of entities can be configured to automatically cascade certain operations. By default, no operations are cascaded.

The following cascade options exist:

+ ```persist``` Cascades persist operations to the associated entities.
+ ```remove``` Cascades remove operations to the associated entities.
+ ```merge``` Cascades merge operations to the associated entities.
+ ```detach``` Cascades detach operations to the associated entities.
+ ```refresh``` Cascades refresh operations to the associated entities.
+ ```all``` Cascades persist, remove, merge, refresh and detach operations to associated entities.

<!-- End src/mapping.js -->




<!-- Start src/provider.js -->

<!-- End src/provider.js -->




<!-- Start src/repositories.js -->

<!-- End src/repositories.js -->




<!-- Start src/repository.js -->

# EntityRepository
An EntityRepository serves as a repository for entities with generic as well as business specific methods for retrieving entities.

## clear()

Clears the repository, causing all managed entities to become detached.

## count()

Returns the number of entities in the repository.

### Return:

* **number** The number of entities.

## find(id)

Finds an entity by its identifier.

### Params:

* **number** *id* The identifier of the entity.

### Return:

* **Object** The entity.

## findBy([filter])

Finds entities by filter.

### Params:

* **Function|Object** *[filter]* The function or object for matching the entities.

### Return:

* **Array** The entities.

## findAll()

Finds all entities in the repository.

### Return:

* **Array** The entities.

## findOneBy(filter)

Finds a single entity by filter.

### Params:

* **Function|Object** *filter* The function or object for matching the entity.

### Return:

* **Object** The entity.

## new([properties])

Factory method to create a new entity instance.

### Params:

* **Object** *[properties]* The properties of the entity.

### Return:

* **Object** The entity.

<!-- End src/repository.js -->




<!-- Start src/uid.js -->

<!-- End src/uid.js -->

