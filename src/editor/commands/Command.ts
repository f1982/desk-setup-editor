/**
 * Command abstract class 
 * It's from https://github.com/mrdoob/three.js/blob/master/editor/js/Command.js
 */

interface Output {
  type: string;
  id: number;
  name: string;
}

class Command {

  protected id: number = - 1;
  protected inMemory: boolean = false;
  protected updatable: boolean = false;
  protected type: string = '';
  protected name: string = '';
  protected editor: any = null;

  constructor(editor: any) {

    this.id = - 1;
    this.inMemory = false;
    this.updatable = false;
    this.type = '';
    this.name = '';
    this.editor = editor;

  }

  toJSON(): Output {
    return {
      type: this.type,
      id: this.id,
      name: this.name,
    };
  }

  fromJSON(json: Output) {

    this.inMemory = true;
    this.type = json.type;
    this.id = json.id;
    this.name = json.name;

  }

}

export { Command };