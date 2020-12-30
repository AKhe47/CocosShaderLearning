/*
 * @Author: Dreamy Icecream 
 * @Date: 2020-06-21 01:14:20 
 * @Description: 最后收束到一个点的消融效果控制
 * @Last Modified by: Dreamy Icecream
 * @Last Modified time: 2020-06-21 02:11:15
 */

import { _decorator, Component, Node, Material, ModelComponent, Mesh, view, Vec3, v3, CCObject, v4, Mat4 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("ToPointDissolve")
export class ToPointDissolve extends Component {

    /** 所有的material */
    private pointDissolveMatList: Material[] = [];

    private localTargetPosition: Vec3 = v3(1, 0, 0);

    /** 消融速度 */
    private speed: number = 0.1;

    private dissolveThreshold: number = 0;

    public onEnable(): void {
        let childrenModelList = this.node.getComponentsInChildren(ModelComponent);
        // let maxDistance = this.getMaxDistance(childrenModelList);
        let maxDistance = 0;

        for (const model of childrenModelList) {
            this.pointDissolveMatList.push(model.getMaterial(0));
        }

        for (const mat of this.pointDissolveMatList) {
            mat.setProperty("targetPosition", this.convertToWorldPostion(this.node, this.localTargetPosition));
            mat.setProperty("maxDistance", maxDistance);
            mat.setProperty("distanceEffect", 1);
        }
    }

    public update(dt: number): void {
        this.dissolveThreshold += dt * this.speed;
        this.pointDissolveMatList[0].setProperty("threshold", this.dissolveThreshold);
    }

    private getMaxDistance(childrenModels: ModelComponent[]): number {
        let worldTargetPosition = this.convertToWorldPostion(this.node, this.localTargetPosition);

        console.error(worldTargetPosition);

        let maxDistance = 0;
        for (const model of childrenModels) {
            let mesh = model.mesh;
            for (let index = 0, length = mesh.subMeshCount; index < length; index++) {
                let subMeshData = mesh.getSubMesh(index);
                let vertexPosition = subMeshData.geometricInfo.positions;
                for (let vIndex = 0, length = vertexPosition.length / 4; vIndex < length; vIndex++) {
                    let aPosition = Vec3.fromArray(
                        v3(),
                        [vertexPosition[vIndex * 4], vertexPosition[vIndex * 4 + 1], vertexPosition[vIndex * 4 + 2], vertexPosition[vIndex * 4 + 3]]
                    );
                    let aWorldPosition = this.convertToWorldPostion(model.node, aPosition);

                    let dis = Vec3.distance(aWorldPosition, worldTargetPosition);
                    if (dis > maxDistance) {
                        maxDistance = dis;
                    }
                }
            }
        }
        return maxDistance;
    }

    private convertToWorldPostion(node: Node, localPosition): Vec3 {
        node.updateWorldTransform();
        return Vec3.transformMat4(v3(), localPosition, node.getWorldMatrix());
    }

}
