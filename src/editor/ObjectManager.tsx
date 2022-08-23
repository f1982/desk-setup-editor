import GUI from "lil-gui";
import { MathUtils, Object3D, Scene } from "three";
import Chair from "../models/Chair";
import DisplayRoom from "../models/DisplayRoom";
import DSEObject from "../models/DSEObject";
import MonitorSample from "../models/MonitorSample";
import Mug from "../models/Mug";
import SimpleDesk from "../models/SimpleDesk";
import SelectedIndicator from "./SelectedIndicator";

class ObjectManager {
  private scene?: Scene;
  private gui?: GUI;

  public indicator: SelectedIndicator;

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

  public addRandomToRoom() {
    const ObjClasses = [Chair, MonitorSample];
    const ObjClass = ObjClasses[MathUtils.randInt(0, ObjClasses.length - 1)];
    const obj = new ObjClass();
    this.addToRoom(obj);
  }

  public addToRoom(obj: DSEObject) {
    // const chair = new Chair();
    // this.inRoomObjects.push(obj);
    this.room.addKid(obj);

    this.scene?.add(obj);
    // const { min, max } = this.room.getContainerBox();
    // obj.updateRestrictArea(min, max);

    obj.position.copy(obj.getRandomPosition());
    return obj;
  }

  public unselectAll() {
    this.allObjects.forEach(object => {
      object.removeGUI();
    });
    this.indicator.hide();
  }

  public moveIndicator(obj: Object3D) {
    this.indicator.moveTo(obj);
  }

  private initRoom() {
    const room = new DisplayRoom();
    //TODO: remove event listener
    // room.addEventListener('layout-change', () => {
    //   this.updateInRoomObjectsRestrictArea();
    // })

    // room.setGUI(this.gui!);
    this.scene!.add(room);
    this.room = room;

    this.indicator = new SelectedIndicator();
    this.scene!.add(this.indicator);

    this.indicator.show();
  }

  /**
   * Load all the objects from config file
   */
  private initInRoomObjects() {
    const desk = this.addToRoom(new SimpleDesk())
    //TODO: remove event listener
    // desk.addEventListener('layout-change', () => {
    //   this.updateInRoomObjectsRestrictArea();
    // });
    // desk.setGUI(this.gui!);

    this.desk = desk as SimpleDesk;

    this.addRandomToRoom();
    this.addRandomToRoom();
    this.addRandomToRoom();

    // this.updateInRoomObjectsRestrictArea();
  }

  // private updateInRoomObjectsRestrictArea() {
  //   const { min, max } = this.room.getContainerBox();
  //   // update all the object
  //   this.inRoomObjects.forEach(obj => {
  //     obj.updateRestrictArea(min, max);
  //   });
  // }

  private initOnDeskObjects() {

    const mug = new Mug();
    // this.desk.addSub(mug);
    // this.onTableObjects.push(mug);
    this.scene?.add(mug);
    this.desk.addKid(mug);


    // const monitor = new MonitorSample()
    // this.desk.addSub(monitor);
    // this.onTableObjects.push(monitor);


    // addDragAndDrop(this.camera, this.renderer.domElement, [desk]);
    // ctrl.attachObject(desk);
    // ctrl.attachObject(mug);

    // this.desk.updateChildrenRestrictArea();
    // this.updateOnTableObjectRestrictArea();
    mug.position.copy(mug.getRandomPosition());
  }

  private updateOnTableObjectRestrictArea() {
    const { min, max } = this.desk.getContainerBox();

    // this.onTableObjects.forEach(obj => {
    //   obj.updateRestrictArea(min, max);
    // });

    this.desk.kids.forEach(obj => {
      obj.updateRestrictArea(min, max);
    });
  }

}


export default ObjectManager;