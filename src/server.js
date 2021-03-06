import createApp from './app';
export default ctx => {
    return new Promise((resolve, reject) => {
        const { app, router, store } = createApp();
        router.push(ctx.url);
        router.onReady(() => {
            const matchedComponents = router.getMatchedComponents();
            if (!matchedComponents.length) {
                return reject(
                    {
                        status: 404
                    }
                )
            }
            Promise.all(matchedComponents.map(component => {
                if (component.asyncData) {
                    return component.asyncData(
                        {
                            store,
                            route: router.currentRoute
                        }
                    )
                }
            })).then(() => {
                ctx.state = store.state;
                // console.log(ctx.state)
                resolve(app);
            }).catch(reject)
        }, reject);
    });
}