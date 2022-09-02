import { Box3, Vector3 } from 'three';
import DSEObject from './DSEObject'

describe('test dse object', () => {

  test('should be able to add and remove kids correctly', () => {
    const obj = new DSEObject();

    obj.addKid(new DSEObject());
    expect(obj.kids.length).toBe(1);
    obj.removeAllKids();
    expect(obj.kids.length).toBe(0);
  });

  test('should update restrict area correctly', () => {
    const obj = new DSEObject();

    const kid = new DSEObject();
    obj.addKid(kid);
    
    expect(obj.getContainerBox().containsPoint(kid.position)).toBeTruthy();
  })
})