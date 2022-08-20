import GUI from "lil-gui";
import { Scene } from "three";
import Chair from "../models/Chair";
import DisplayRoom from "../models/DisplayRoom";
import DSEObject from "../models/DSEObject";
import MonitorSample from "../models/MonitorSample";
import Mug from "../models/Mug";
import SimpleDesk from "../models/SimpleDesk";

class SetupObjects {
  private scene?: Scene;
  private gui?: GUI;


  private room: DisplayRoom;
  private desk: SimpleDesk;

  private inRoomObjects: DSEObject[] = [];
  private onTableObjects: DSEObject[] = [];

  constructor(scene: Scene, gui: GUI) {
    this.scene = scene;
    this.gui = gui;

    this.initRoom();
    this.initInRoomObjects();
    this.initOnDeskObjects();
  }

  public dispose() {
    this.scene = undefined;
    this.gui = undefined;
  }

  public findItemInRoom(name: string) {
    return this.inRoomObjects.find(item => item.name === name);
  }

  public get allObjects() {
    return [...this.inRoomObjects, ...this.onTableObjects]
  }

  public get randomObject() {
    const all = this.allObjects;
    return all[Math.floor(Math.random() * all.length)];
  }

  public findObject(name: string) {
    this.allObjects.find(item => item.name === name)
  }

  public unselectAll() {
    this.allObjects.forEach(object => {
      object.unselect();
    })
  }

  private initRoom() {
    const room = new DisplayRoom();
    //TODO: remove event listener
    room.addEventListener('layout-change', () => {
      this.updateInRoomObjectsRestrictArea();
    })

    room.setGUI(this.gui!);
    this.scene!.add(room);
    this.room = room;
  }

  private initInRoomObjects() {
    const desk = new SimpleDesk();
    desk.setGUI(this.gui!);
    //TODO: remove event listener
    desk.addEventListener('layout-change', () => {
      this.updateOnTableObjectRestrictArea();
    });
    this.scene!.add(desk);
    this.inRoomObjects.push(desk);
    this.desk = desk;

    const chair = new Chair();
    this.inRoomObjects.push(chair);
    chair.position.set(0, 0, 1)
    this.scene!.add(chair);

    const monitor = new MonitorSample()
    this.inRoomObjects.push(monitor);
    this.scene?.add(monitor);

    const mug = new Mug();
    this.scene?.add(mug);
    mug.position.set(2, 0, -1)
    this.inRoomObjects.push(mug);


    this.updateInRoomObjectsRestrictArea();
  }

  private updateInRoomObjectsRestrictArea() {
    const { min, max } = this.room.getContainerBox();
    // update all the object
    this.inRoomObjects.forEach(obj => {
      obj.updateRestrictArea(min, max);
    });
  }

  private initOnDeskObjects() {

    const mug = new Mug();
    this.desk.addSub(mug);
    this.onTableObjects.push(mug);


    const monitor = new MonitorSample()
    this.desk.addSub(monitor);
    this.onTableObjects.push(monitor);


    // addDragAndDrop(this.camera, this.renderer.domElement, [desk]);
    // ctrl.attachObject(desk);
    // ctrl.attachObject(mug);

    this.updateOnTableObjectRestrictArea();
  }

  private updateOnTableObjectRestrictArea() {
    const { min, max } = this.desk.getContainerBox();
    this.onTableObjects.forEach(obj => {
      obj.updateRestrictArea(min, max);
    });
  }

}


export default SetupObjects;