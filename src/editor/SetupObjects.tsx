import GUI from "lil-gui";
import { Scene } from "three";
import { GLTF, GLTFLoader } from "three-stdlib";
import Chair from "../models/Chair";
import DisplayRoom from "../models/DisplayRoom";
import DSEObject from "../models/DSEObject";
import MonitorSample from "../models/MonitorSample";
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
    this.initOnDeskObjects();

    // const loader = new GLTFLoader();

    // loader.load(
    //   // resource URL
    //   'https://raw.githubusercontent.com/f1982/planet-of-images/main/img/my-room-v0.69.gltf',
    //   // called when the resource is loaded
    //   (gltf: GLTF) => {
    //     // this.body = gltf.scene;
    //     // console.log('this.body ', this.body);
    //     // this.add(this.body);
    //     this.scene.add(gltf.scene);
    //   },
    //   // called while loading is progressing
    //   (xhr: ProgressEvent) => {
    //     console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
    //   },
    //   // called when loading has errors
    //   (error) => {
    //     console.log('An error  happened');
    //   },
    // );
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

  private initInRoomObjects() {
    const desk = new SimpleDesk();
    desk.setGUI(this.gui);
    desk.addEventListener('layout-change', () => {
      this.updateOnTableObjectRestrictArea();
    });
    this.scene.add(desk);
    this.inRoomObjects.push(desk);
    this.desk = desk;

    const chair = new Chair();
    this.inRoomObjects.push(chair);
    this.scene.add(chair);

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