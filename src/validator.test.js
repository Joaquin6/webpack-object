import { validateOutputVersion } from './validator';

describe('validator', () => {
  it('should validate an existent webpack version', () => {
    expect(validateOutputVersion('2')).to.equal('v2');
    expect(validateOutputVersion('2.3.2')).to.equal('v2');
    expect(validateOutputVersion(4)).to.equal('v4');
  });

  it('should throw on a non-existent webpack version', () => {
    expect(validateOutputVersion(5)).to.equal(false);
    expect(validateOutputVersion(0)).to.equal(false);
  });
});
