/* eslint-disable */

require('babel-register')({
  plugins: ['babel-plugin-espower']
});

import chai from 'chai'
import sinon from 'sinon'
import shell from 'shelljs'
import assert from 'power-assert'
import sinonChai from 'sinon-chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(sinonChai)
chai.use(chaiAsPromised)

const { expect } = chai

global.sinon = sinon
global.expect = expect
global.assert = assert

const shellLsStub = sinon.stub(shell, 'ls');
const shellTestStub = sinon.stub(shell, 'test');

// Its to expensive to run filesystem io-bound tests,
// also the behaviour on travis is a bit weird
shellTestStub.set((_, value) => /exists/.test(value))

shellLsStub.set((path_, couldBePath) => {
  const path = path_ === '-d' ? couldBePath : path_

  if (/does-not-exist/.test(path)) {
    return []
  } else if (/exists-with-babel-cli-js/.test(path)) {
    return ['babel-cli.js']
  } else if (/exists-with-codecov-folder/.test(path)) {
    if (path_ === '-d') {
      return ['codecov']
    }
    return []
  } else if (/exists-with-node-modules\/node_modules/.test(path)) {
    return ['babel-cli.js'] // should not be a problem
  } else if (/exists/.test(path)) {
    return ['stuff']
  } else {
    throw new Error(
      `You should handle the path "${path}" in the shell.ls stub. ` +
      'It its a path that should not exist, include the string "does-not-exist", ' +
      'It it should exist, include the string "exists", '
    )
  }
});
