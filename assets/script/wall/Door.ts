import { ICollisionEvent } from 'cc';
import { CapsuleCollider } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { ColliderGroup } from '../config/GameData';
import { tween } from 'cc';
import { Vec3 } from 'cc';
import { CCBoolean } from 'cc';
import { Enum } from 'cc';
const { ccclass, property } = _decorator;

export enum DoorType {
    Vertical, // 垂直
    Horizontal // 水平
}

@ccclass('Door')
export class Door extends Component {

    @property(Node) left: Node = null;
    @property(Node) right: Node = null;
    @property({ type: Enum(DoorType) }) type: DoorType = DoorType.Vertical;

    private capsulesCollider: CapsuleCollider = null;

    protected onLoad(): void {
        this.capsulesCollider = this.node.getComponent(CapsuleCollider);
    }

    protected start(): void {
        this.capsulesCollider.on('onTriggerEnter', this.onTriggerEnter, this);
        this.capsulesCollider.on('onTriggerExit', this.onTriggerExit, this);
    }

    onTriggerEnter(e: ICollisionEvent) {
        if (e.otherCollider.getGroup() == ColliderGroup.Player || e.otherCollider.getGroup() == ColliderGroup.Hunter) {
            console.log('%c openDoor: ' + `${e.otherCollider.node.name}`, 'color: #0096FF; font-weight: bold;');

            let leftEnlerAngles = new Vec3();
            let rightEnlerAngles = new Vec3();

            const roleWorldPos = e.otherCollider.node.worldPosition;
            const doorWorldPos = this.node.worldPosition;

            // z轴为正前方
            if (this.type == DoorType.Horizontal) {
                // 人物在门下方
                if (roleWorldPos.z > doorWorldPos.z) {
                    leftEnlerAngles.set(0, 90, 0);
                    rightEnlerAngles.set(0, -90, 0);
                }
                // 人物在门上方
                else {
                    leftEnlerAngles.set(0, -90, 0);
                    rightEnlerAngles.set(0, 90, 0);
                }
            } else if (this.type == DoorType.Vertical) {
                // 人物在门左方
                if (roleWorldPos.x > doorWorldPos.x) {
                    leftEnlerAngles.set(0, 90, 0);
                    rightEnlerAngles.set(0, -90, 0);
                }
                // 人物在门右方
                else {
                    leftEnlerAngles.set(0, -90, 0);
                    rightEnlerAngles.set(0, 90, 0);
                }
            }

            tween(this.left)
                .to(0.2, { eulerAngles: leftEnlerAngles })
                .parallel(
                    tween(this.right)
                        .to(0.2, { eulerAngles: rightEnlerAngles })
                        .start()
                )
                .start();
        }
    }

    onTriggerExit(e: ICollisionEvent) {
        if (e.otherCollider.getGroup() == ColliderGroup.Player || e.otherCollider.getGroup() == ColliderGroup.Hunter) {
            console.log('%c closeDoor: ' + `${e.otherCollider.node.name}`, 'color: #ff0000ff; font-weight: bold;');
            tween(this.left)
                .to(0.2, { eulerAngles: Vec3.ZERO })
                .parallel(
                    tween(this.right)
                        .to(0.2, { eulerAngles: Vec3.ZERO })
                        .start()
                )
                .start();
        }
    }
}


