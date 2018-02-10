import Immutable from 'seamless-immutable';
const sep = '/';
//effects with loading setting
export const effects = {
    types: ['Loading', 'Success', 'Failure'],

    onSuccess(selector = (payload, state) => payload.data) {
        return function (state, payload) {
            state[`${payload.target}Loading`] = false;
            state[payload.target] = (payload.selector || selector)(payload, state);
            state[`${payload.target}Error`] = null;
        }
    },

    onLoading(selector = (payload, state) => true) {
        return function (state, payload) {
            state[`${payload.target}Loading`] = (payload.selector || selector)(payload, state);
        }
    },

    onFailure(selector = (payload, state) => payload.error) {
        return function (state, payload) {
            state[`${payload.target}Loading`] = false;
            state[`${payload.target}Error`] = (payload.selector || selector)(payload, state);
        }
    }
}
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


//complete types
export function completeTypes(types) {
    return (Array.isArray(types) ? types : [types]).concat(effects.types.map(type => `SET_${type.toUpperCase()}`));
}

//add state 
export function completeState(target) {
    return {
        [`${target}Loading`]: false,
        [target]: [],
        [`${target}Error`]: null
    }
}

//common loading mutation
export function completeMutation() {
    const mutations = {};
    effects.types.forEach(type => {
        mutations[`SET_${type.toUpperCase()}`] = effects[`on${type}`]()
    });
    return mutations;
}

//create store module 
export function createStoreModule(namespace, typesArray, definition, targestNeedLoading) {
    if (typeof namespace !== 'string') {
        definition = typesArray;
        typesArray = namespace;
        namespace = '';
    }
    let types = createTypes(completeTypes(typesArray)),
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
    if (targestNeedLoading && targestNeedLoading.length > 0) {
        res.state = targestNeedLoading.reduce((state, target) => {
            return Object.assign({}, state, completeState(target))
        }, res.state);
    }
    res.mutations = Object.assign({}, res.mutations, completeMutation())
    return {
        mod: res,
        types,
        namespacedTypes,
        namespace
    };
}