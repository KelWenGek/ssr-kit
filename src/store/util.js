import Immutable from 'seamless-immutable';
const sep = '/';
function stringArrayToObject(actionsArray, namespace) {
    if (actionsArray.some(actionName => !actionName || typeof actionName !== 'string')) {
        throw new Error('Action or mutation names must be an array of strings.')
    }
    return Immutable(actionsArray).asObject(actionName => [
        actionName,
        namespace ? `${namespace}${sep}${actionName}` : actionName
    ]);
}
//create types for mutation or action
export function createTypes(actionsArray, namespace) {
    return stringArrayToObject(actionsArray, namespace);
}

//create store module 
export function createStoreModule(namespace, typesArray, definition) {
    if (typeof namespace === 'object') {
        definition = typesArray;
        typesArray = namespace;
        namespace = '';
    }
    let types = createTypes(typesArray),
        shouldNamespaced = !!namespace;

    let namespacedTypes;

    let res = {};

    if (shouldNamespaced) {
        res.namespaced = namespace;
        namespacedTypes = createTypes(typesArray, namespace);
    } else {
        res.namespaced = false;
        namespacedTypes = null;
    }

    //如果模块定义是一个对象
    if (typeof definition === 'object') {
        //过滤出是store的key
        const keys = Object.keys(definition).filter(key => {
            return ['state', 'getters', 'mutations', 'actions', 'modules'].indexOf(key) > 0;
        });
        for (let i = 0, len = keys.length; i < len; i++) {
            res[key] = definition[key];
        }
    } else if (typeof definition === 'function') {
        res = Object.assign({}, res, definition.call(null, types));
    }
    return {
        mod: res,
        types,
        namespacedTypes,
        namespace
    };
}