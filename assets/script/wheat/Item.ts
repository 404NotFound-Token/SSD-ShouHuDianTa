import { BoxCollider } from 'cc';
import { ICollisionEvent } from 'cc';
import { Collider } from 'cc';
import { _decorator, Component } from 'cc';
import { WheatMager } from './WheatMager';
import { ColliderGroup } from '../config/GameData';
import { Node } from 'cc';
import { GameMager } from '../GameMager';
const { ccclass, property } = _decorator;

@ccclass('Item')
export class Item extends Component {

    @property(BoxCollider)
    collider: BoxCollider = null;

    @property(Node) wheat: Node = null;

    protected start(): void {
        this.collider.on('onTriggerEnter', this.onTriggerEnter, this);
    }

    protected update(dt: number): void {
        this.wheat.setWorldRotation(GameMager.ins.camera.node.worldRotation);
    }

    onTriggerEnter(event: ICollisionEvent) {
        if (event.otherCollider.getGroup() === ColliderGroup.Player) {
            WheatMager.instance.changeWheatCount(1);
            this.node.destroy();
        }
        if (event.otherCollider.getGroup() === ColliderGroup.Zombie) {
            this.node.destroy();
        }
    }
}


