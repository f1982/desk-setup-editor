import GUI from "lil-gui";
import { Object3D, Scene } from "three";
import { getInRoomObject, getOnTableObject } from "../models";
import DisplayRoom from "../models/DisplayRoom";
import DSEObject from "../models/DSEObject";
import SimpleDesk from "../models/SimpleDesk";
import SelectedIndicator from "./SelectedIndicator";

class ObjectManager {
  private scene?: Scene;
  private gui?: GUI;

  public indicator: SelectedIndicator;

  private room: DisplayRoom;
  private _desk: SimpleDesk;

  public get desk() {
    return this._desk;
  }

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
    return this.room.kids.find(item => item.name === name);
  }

  public get allObjects() {
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
    this.addTo(getInRoomObject());
  }

  public addRandomToDesk() {
    this.addTo(getOnTableObject(), this._desk);
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

  // public remove(obj: DSEObject) {
  //   if (obj && obj.parent) {
  //     obj.removeAllKids();
  //     obj.parent.remove(obj);
  //   }
  // }

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
    this._desk = desk as SimpleDesk;

    this.addRandomToRoom();
    this.addRandomToRoom();
    this.addRandomToRoom();
  }

  private initOnDeskObjects() {
    this.addRandomToDesk();
    this.addRandomToDesk();
    this.addRandomToDesk();
  }
}


export default ObjectManager;