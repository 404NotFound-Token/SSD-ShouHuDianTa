// import { _decorator, Component } from 'cc';
// import { RESOURCE_TYPE } from '../config/GameData';
// import { Vec3 } from 'cc';
// import { Prefab } from 'cc';
// import { Node } from 'cc';
// const { ccclass, property } = _decorator;

// @ccclass('PackgeInfo')
// export class PackgeInfo {
//     public type: RESOURCE_TYPE = RESOURCE_TYPE.NONE;
//     public count: number = 0;
//     public itemArr: Node[] = [];

//     constructor(type: RESOURCE_TYPE) {
//         this.type = type;
//     }
// }

// @ccclass('PackgeCtrl')
// export class PackgeCtrl extends Component {
//     public static ins: PackgeCtrl = null;

//     @property([Node]) packge_points: Node[] = [];

//     packges: PackgeInfo[] = [];
//     pos: Vec3 = new Vec3();

//     private z_offset: number = -0.2;

//     protected onLoad(): void {
//         PackgeCtrl.ins = this;
//     }

//     protected update(dt: number): void {
//         if (this.packges.length > 0) {
//             for (let i = 0; i < this.packges.length; i++) {
//                 const packge = this.packges[i];
//                 if (packge.itemArr.length > 0){
//                     packge
//                 }
//             }
//         }

//     }

//     public getPackge(type: RESOURCE_TYPE): PackgeInfo {
//         let packge = this.packges.find(packge => packge.type === type);
//         if (packge) {
//             return packge;
//         } else {
//             packge = new PackgeInfo(type);
//             packge.type = type;
//             this.packges.push(packge);
//             return packge;
//         }
//     }
// }


