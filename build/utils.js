module.exports = {
    isUrl(url) {
        return (url.indexOf('http') === 0 || url.indexOf('//') === 0);
    },
    urlJoin() {
        return [].slice.call(arguments).join('/').replace(/\/+/g, '/').replace(':/', '://');
    },
    sequence(tasks, fn) {
        return tasks.reduce((promise, task) => promise.then(() => fn(task)), Promise.resolve);
    },
    async  waitFor(ms) {
        return new Promise(resolve => setTimeout(resolve, (ms || 0)));
    }
}