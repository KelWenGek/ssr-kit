
const WebpackDevSSR = require('./build/renderer');
const renderOptions = require('./render.conf');
const renderer = new WebpackDevSSR(renderOptions);
render.ready();