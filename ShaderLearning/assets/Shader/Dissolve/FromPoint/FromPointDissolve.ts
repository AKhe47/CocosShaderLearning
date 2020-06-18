/*
 * @Author: Dreamy Icecream 
 * @Date: 2020-06-18 18:08:44 
 * @Description: 从特定位置开始消融特效控制
 */

import { _decorator, Component, Node, Material, ModelComponent, Vec3, v3, Mesh, GFXAttributeName } from "cc";
const { ccclass, property } = _decorator;

@ccclass("FromPointDissolve")
export class FromPointDissolve extends Component {

    private dissolveMat: Material = null;

    private localPosition: Vec3 = v3(0, 0.5, 0);

    private worldStartPosition: Vec3 = null;

    private threshold: number = 0;

    private speed: number = 0.06;

    public onEnable(): void {
        this.worldStartPosition = Vec3.add(v3(), this.node.worldPosition, this.localPosition);
        this.dissolveMat = this.node.getComponent(ModelComponent).materials[0];
        this.dissolveMat.setProperty("maxDistance", this.getMaxDistance());
        this.dissolveMat.setProperty("worldStartPosition", this.worldStartPosition);
        this.dissolveMat.setProperty("distanceEffect", 0);
    }

    public update(dt): void {
        this.threshold += dt * this.speed;
        this.dissolveMat.setProperty("threshold", this.threshold);
    }

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
                let dis = Vec3.distance(aPosition, this.localPosition);
                if (dis > maxDistance) {
                    maxDistance = dis;
                }
            }
        }
        return maxDistance;
    }

}
