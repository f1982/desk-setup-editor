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
    // return [...this.inRoomObjects, ...this.onTableObjects]

    const all: DSEObject[] = [];
    all.push(...this.room.kids);

    //sub kids
    this.room.kids.forEach(item => {
      item.kids && all.push(...item.kids)
    })

    return all;
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

    this.addTo(obj);
  }

  public addRandomToDesk() {
    const ObjClasses = [Mug, MonitorSample];
    const ObjClass = ObjClasses[MathUtils.randInt(0, ObjClasses.length - 1)];
    const obj = new ObjClass();

    this.addTo(obj, this.desk);
  }

  public addTo(obj: DSEObject, parent: DSEObject = this.room) {
    parent.addKid(obj);
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
    this.scene!.add(room);
    this.room = room;

    this.indicator = new SelectedIndicator();
    this.scene!.add(this.indicator);
  }

  /**
   * Load all the objects from config file
   */
  private initInRoomObjects() {
    const desk = this.addTo(new SimpleDesk())
    this.desk = desk as SimpleDesk;

    this.addRandomToRoom();
    this.addRandomToRoom();
    this.addRandomToRoom();
  }

  private initOnDeskObjects() {
    const mug = new Mug();
    this.desk.addKid(mug);
    mug.position.copy(mug.getRandomPosition());

    const monitor = new MonitorSample()
    this.desk.addKid(monitor);
    monitor.position.copy(monitor.getRandomPosition());
  }
}


export default ObjectManager;