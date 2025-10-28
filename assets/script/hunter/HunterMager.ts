import { instantiate } from 'cc';
import { Vec3 } from 'cc';
import { NodePool } from 'cc';
import { Prefab } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { Hunter } from './Hunter';
import { HunterController } from './HunterController';
import { HunterInfo } from '../config/GameData';
const { ccclass, property } = _decorator;

@ccclass('HunterMager')
export class HunterMager extends Component {
    public static instance: HunterMager = null;

    @property(Prefab) hunter: Prefab = null;
    @property([Node]) doors: Node[] = [];
    @property(Node) point: Node = null;

    public hunters: Node[] = [];

    protected onLoad(): void {
        HunterMager.instance = this;
    }

    loadHunter() {
        if (HunterInfo.Current >= HunterInfo.Max) return;

        const hunter = instantiate(this.hunter);
        hunter.parent = this.node;
        hunter.setPosition(Vec3.ZERO)

        const hunterCtrl = hunter.getComponent(HunterController);
        hunterCtrl.setPoint(this.point);

        this.hunters.push(hunter)

        HunterInfo.Current++;
    }

    recycleHunter(hunter: Node) {
        this.hunters.splice(this.hunters.indexOf(hunter), 1);
        HunterInfo.Current -= 1;
        hunter.destroy();
    }
}


