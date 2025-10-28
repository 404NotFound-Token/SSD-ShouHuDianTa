import { _decorator, Component } from 'cc';
import { Tower } from '../tower/Tower';
import { ZombieMager } from '../zombie/ZombieMager';
import { isValid } from 'cc';
import { Vec3 } from 'cc';
import { Attacker, WallInfo } from '../config/GameData';
import { GameMager } from '../GameMager';
const { ccclass, property } = _decorator;

@ccclass('Wall')
export class Wall extends Component {

    private isAttacling: boolean = false;



    protected update(dt: number): void {
        if (GameMager.ins.GameEnd) return;
        if (this.isAttacling) return;
        this.attack(Tower.ins.data.AttackInterval);
    }

    private attack(dt: number) {
        this.isAttacling = true;
        ZombieMager.ins.Zombies.forEach(zombie => {
            const bol = Vec3.distance(zombie.node.worldPosition, this.node.worldPosition) < WallInfo.AttackRange;
            if (bol) {
                if (zombie && isValid(zombie) && zombie.node && isValid(zombie.node)) {
                    // 添加检查确保 zombie.tx 存在
                    if (zombie.tx) {
                        zombie.tx.active = true;
                        this.scheduleOnce(() => {
                            if (zombie && isValid(zombie) && zombie.tx) {
                                zombie.tx.active = false;
                            }
                        }, 1);
                    }
                    zombie.beHurt(WallInfo.Attack, Attacker.Wall);
                }
            }
        });
        this.scheduleOnce(() => {
            this.isAttacling = false;
        }, dt);
    }

    public beHurt(num: number) {
        Tower.ins.beHurt(num);
    }
}


