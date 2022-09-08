import { Scene, Vector3 } from 'three';
import { saveSTL, VecZero } from './threeUtils';
import { saveAs } from 'file-saver'

jest.mock('file-saver', () => ({
  saveAs: jest.fn(),
}));

describe('three util file', () => {
  test('should vec zero equate to 0,0,0', () => {
    expect(VecZero()).toEqual(new Vector3(0, 0, 0));
  });

  test('should be able to save STL properly', async () => {
    await saveSTL(new Scene(), "test-scene");

    expect(saveAs).toHaveBeenCalled();
  })

})
