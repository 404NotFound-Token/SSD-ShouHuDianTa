import { _decorator, Component, Node } from 'cc';
import { ZombieMager } from '../zombie/ZombieMager';
import { Vec3 } from 'cc';
import { Zombie } from '../zombie/Zombie';
import { GameMager } from '../GameMager';
import { Label } from 'cc';
import { Attacker, GameInfo, TowerInfo } from '../config/GameData';
import { v3 } from 'cc';
import { tween } from 'cc';
import { Prefab } from 'cc';
import { instantiate } from 'cc';
import { isValid } from 'cc';
import { UIOpacity, Sprite } from 'cc';
import { EVENT_TYPE, IEvent } from '../tools/CustomEvent';
import { Quat } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Tower')
export class Tower extends Component {
    public static ins: Tower = null;

    @property(Node) goldUI: Node = null;

    @property(Node) level1AttackRangeTip: Node = null;
    @property(Node) level2AttackRangeTip: Node = null;
    // @property(Node) bulletFirePoint: Node = null;
    @property(Prefab) bullet: Prefab = null;
    @property(Node) hp: Node = null;
    @property(Node) bujian: Node = null;


    private gold: number = 0;
    private level_1_need_gold: number = 50;
    private level_2_need_gold: number = 500;
    private currentHP: number = TowerInfo.HP;
    private uio: UIOpacity = null;
    private hpbar: Sprite = null;

    level: number = 1;
    data: any = null;

    protected onLoad(): void {
        Tower.ins = this;
        this.data = TowerInfo.Level1;
        this.uio = this.hp.getComponent(UIOpacity);
        this.hpbar = this.hp.getChildByName("Bar").getComponent(Sprite);
    }

    protected update(dt: number): void {
        this.goldUI.setWorldRotation(GameMager.ins.camera.node.worldRotation);
        const gold = this.level == 1 ? this.level_1_need_gold : this.level_2_need_gold;
        this.goldUI.getChildByName("Label").getComponent(Label).string = `${this.gold}/${gold}`;
    }

    protected lateUpdate(dt: number): void {
        this.hp.setWorldRotation(GameMager.ins.camera.node.worldRotation);
    }

    start() {
        this.schedule(() => {
            if (GameMager.ins.GameEnd) return;
            this.attack();
        }, this.data.AttackInterval)
    }

    // attack() {
    //     const zombie = ZombieMager.ins.returnMinDistanceZombie(this.node);
    //     if (zombie) {
    //         if (Vec3.distance(zombie.node.worldPosition, this.node.worldPosition) < this.data.AttackRange) {
    //             const bullet = instantiate(this.bullet);
    //             bullet.setParent(this.node);

    //             // 计算子弹指向僵尸的方向向量
    //             const direction = new Vec3();
    //             Vec3.subtract(direction, zombie.node.worldPosition, bullet.worldPosition);
    //             direction.normalize(); // 标准化方向向量

    //             // 使用lookAt方法让子弹朝向目标
    //             bullet.lookAt(zombie.node.worldPosition);

    //             // 设置Y轴旋转角度（如果需要特定的Y轴旋转）
    //             const yRotation = Math.atan2(direction.x, direction.z) * 180 / Math.PI;
    //             bullet.eulerAngles = new Vec3(0, yRotation, 0);

    //             tween(bullet)
    //                 .to(0.2, { worldPosition: zombie.node.worldPosition })
    //                 .call(() => {
    //                     if (zombie && isValid(zombie) && zombie.node && isValid(zombie.node)) {
    //                         if (zombie.tx) {
    //                             zombie.tx.active = true;
    //                         }
    //                         zombie.getComponent(Zombie).beHurt(this.data.Attack, Attacker.Tower);
    //                         this.scheduleOnce(() => {
    //                             if (zombie && isValid(zombie) && zombie.tx) {
    //                                 zombie.tx.active = false;
    //                             }
    //                         }, 1);
    //                     }
    //                     bullet.destroy();
    //                 })
    //                 .start();
    //         }
    //     }
    // }

    attack() {
        ZombieMager.ins.Zombies.forEach(zombie => {
            const bol = Vec3.distance(zombie.node.worldPosition, this.node.worldPosition) < this.data.AttackRange;
            if (bol) {
                if (zombie && isValid(zombie) && zombie.node && isValid(zombie.node)) {
                    const bullet = instantiate(this.bullet);
                    bullet.setParent(this.node);

                    // 计算子弹指向僵尸的方向向量
                    const direction = new Vec3();
                    Vec3.subtract(direction, zombie.node.worldPosition, bullet.worldPosition);
                    direction.normalize(); // 标准化方向向量

                    // 使用lookAt方法让子弹朝向目标
                    bullet.lookAt(zombie.node.worldPosition);

                    // 设置Y轴旋转角度（如果需要特定的Y轴旋转）
                    const yRotation = Math.atan2(direction.x, direction.z) * 180 / Math.PI;
                    bullet.eulerAngles = new Vec3(0, yRotation, 0);

                    tween(bullet)
                        .to(0.2, { worldPosition: zombie.node.worldPosition })
                        .call(() => {
                            if (zombie && isValid(zombie) && zombie.node && isValid(zombie.node)) {
                                if (zombie.tx) {
                                    zombie.tx.active = true;
                                }
                                zombie.getComponent(Zombie).beHurt(this.data.Attack, Attacker.Tower);
                                this.scheduleOnce(() => {
                                    if (zombie && isValid(zombie) && zombie.tx) {
                                        zombie.tx.active = false;
                                    }
                                }, 1);
                            }
                            bullet.destroy();
                        })
                        .start();
                }
            }
        })
    }

    beHurt(num: number) {
        this.currentHP -= num;
        this.hpbar.fillRange = this.currentHP / TowerInfo.HP;

        if (this.currentHP <= 0) {
            IEvent.emit(EVENT_TYPE.GAME_OVER);
        }
    }

    changeGold(num: number) {
        this.gold += num;
        let _gold: number = 0;
        if (this.level == 1)
            _gold = this.level_1_need_gold;
        else if (this.level == 2)
            _gold = this.level_2_need_gold;

        if (this.gold >= _gold) {
            this.Upgrade();
            this.gold = 0;
        }
    }

    Upgrade() {
        this.level++;
        this.bujian.active = true;

        if (this.level == 2) {
            this.data = TowerInfo.Level2;
            GameInfo.C = 3;
            // this.level1AttackRangeTip.active = false;
            // this.level2AttackRangeTip.active = true;
            ZombieMager.ins.loadSecondZombies();
        }
        tween(this.node)
            .to(0.2, { scale: v3(0.9, 0.9, 0.9) })
            .to(0.2, { scale: v3(1, 1, 1) })
            .call(() => {
                console.log("Upgrade Tower Level:", this.level, TowerInfo);
            })
            .start();
    }

}


