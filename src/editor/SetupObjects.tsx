import GUI from "lil-gui";
import { Scene } from "three";
import Chair from "../models/Chair";
import DisplayRoom from "../models/DisplayRoom";
import DSEObject from "../models/DSEObject";
import Mug from "../models/Mug";
import SimpleDesk from "../models/SimpleDesk";

class SetupObjects {
  private scene: Scene;
  private gui: GUI;


  private room: DisplayRoom;
  private desk: SimpleDesk;

  private inRoomObjects: DSEObject[] = [];
  private onTableObjects: DSEObject[] = [];

  constructor(scene: Scene, gui: GUI) {
    this.scene = scene;
    this.gui = gui;

    this.initRoom();
    this.initInRoomObjects();
    // this.init();
  }

  private initRoom() {
    const room = new DisplayRoom();
    room.addEventListener('layout-change', () => {
      this.updateInRoomObjectsRestrictArea();
    })

    room.setGUI(this.gui);
    this.scene.add(room);
    this.room = room;
  }

  private initInRoomObjects () {
    const desk = new SimpleDesk();
    desk.setGUI(this.gui);
    desk.addEventListener('layout-change', () => {
      // const { min, max } = desk.getContainerBox();
      // mug.updateRestrictArea(min, max);
      //update all on desk objects restriction area
    });
    this.scene.add(desk);
    this.inRoomObjects.push(desk);
    this.desk = desk;

    const chair = new Chair();
    this.inRoomObjects.push(chair);
    this.scene.add(chair);
    
    this.updateInRoomObjectsRestrictArea();
  }

  private updateInRoomObjectsRestrictArea(){
    const { min, max } = this.room.getContainerBox();
    // update all the object
    this.inRoomObjects.forEach(obj => {
      obj.updateRestrictArea(min, max);
    });
  }

  private init() {

    // this.scene.add(getCubeGroup());

    // loadScene((obj: THREE.Group) => {
    //   this.scene.add(obj);
    // });

    const mug = new Mug();
    this.scene.add(mug);
    // this.movableObjects.push(mug);

    const desk = new SimpleDesk();
    desk.setGUI(this.gui);
    // Need to send initial container area to all the children items
    const { min: rmin, max: rmax } = this.room.getContainerBox()
    this.desk.updateRestrictArea(rmin, rmax);

    desk.addEventListener('layout-change', () => {
      const { min, max } = desk.getContainerBox();
      mug.updateRestrictArea(min, max);
    });
    desk.position.set(1, 0, 1);
    this.scene.add(desk);
    // this.movableObjects.push(desk);

    //test
    // const mug2 = new Mug();
    // desk.addSub(mug2);

    // init state to set mug on the desk
    const { min, max } = desk.getContainerBox();
    mug.updateRestrictArea(min, max);



    // addDragAndDrop(this.camera, this.renderer.domElement, [desk]);
    // ctrl.attachObject(desk);
    // ctrl.attachObject(mug);

  }

}


export default SetupObjects;