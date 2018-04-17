import webpackObject from '../../src/webpack-object';

const generatedObject = webpackObject('v3', {
  debug: true,
  performance: {
    hints: false,
  },
  entry: 'somefile'
});

console.log(generatedObject);
