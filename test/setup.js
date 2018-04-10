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
