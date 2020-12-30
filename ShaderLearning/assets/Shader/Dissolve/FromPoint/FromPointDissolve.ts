/*
 * @Author: Dreamy Icecream 
 * @Date: 2020-06-18 18:08:44 
 * @Description: 从特定位置开始消融特效控制
 */

import { _decorator, Component, Material, ModelComponent, Vec3, v3, Mesh, GFXAttributeName, v4 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("FromPointDissolve")
export class FromPointDissolve extends Component {

    private dissolveMat: Material = null;

    /** 消融的起始位置，模型空间 */
    private localStartPosition: Vec3 = v3(0.5, 1, 0.3);

    private threshold: number = 0;

    /** 笑容速度，在1/speed的时间内消融完成 */
    private speed: number = 0.1;

    public onEnable(): void {
        this.dissolveMat = this.node.getComponent(ModelComponent).materials[0];
        this.dissolveMat.setProperty("maxDistance", this.getMaxDistance());
        this.dissolveMat.setProperty("objectStartPosition", v4(this.localStartPosition.x, this.localStartPosition.y, this.localStartPosition.z, 0));

        //设置距离对消融的影响程度，[0, 1]
        this.dissolveMat.setProperty("distanceEffect", 0.85);
    }

    public update(dt): void {
        this.threshold += dt * this.speed;
        this.dissolveMat.setProperty("threshold", this.threshold);
    }

    /** 得到模型中离起始位置最远的顶点，到起始位置的距离 */
    private getMaxDistance(): number {
        let mesh = this.node.getComponent(ModelComponent).mesh;
        let maxDistance = 0;
        for (let index = 0, length = mesh.subMeshCount; index < length; index++) {
            let subMeshData = mesh.getSubMesh(index);
            let vertexPosition = subMeshData.geometricInfo.positions;
            for (let vIndex = 0, length = vertexPosition.length / 4; vIndex < length; vIndex++) {
                let aPosition = Vec3.fromArray(
                    v3(),
                    [vertexPosition[vIndex * 4], vertexPosition[vIndex * 4 + 1], vertexPosition[vIndex * 4 + 2], vertexPosition[vIndex * 4 + 3]]
                );
                let dis = Vec3.distance(aPosition, this.localStartPosition);
                if (dis > maxDistance) {
                    maxDistance = dis;
                }
            }
        }
        return maxDistance;
    }

}
