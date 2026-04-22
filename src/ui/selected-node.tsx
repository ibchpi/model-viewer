import { Button, Container, Label } from '@playcanvas/pcui/react';
import React from 'react';

import { SetProperty, ObserverData } from '../types';
import { Vector, Detail } from './components';

const vecEqualToArray = (vec: any, arr: number[]) => {
    if (!vec || !arr || arr.length < 3) {
        return false;
    }
    return Number(vec[0]) === arr[0] && Number(vec[1]) === arr[1] && Number(vec[2]) === arr[2];
};

class SelectedNode extends React.Component < { sceneData: ObserverData['scene'], setProperty: SetProperty } > {
    shouldComponentUpdate(nextProps: Readonly<{ sceneData: ObserverData['scene']; setProperty: SetProperty; }>): boolean {
        return (
            nextProps.sceneData.nodes !== this.props.sceneData.nodes ||
            nextProps.sceneData.selectedNode.path !== this.props.sceneData.selectedNode.path ||
            nextProps.sceneData.selectedNode.name !== this.props.sceneData.selectedNode.name ||
            nextProps.sceneData.selectedNode.position !== this.props.sceneData.selectedNode.position ||
            nextProps.sceneData.selectedNode.rotation !== this.props.sceneData.selectedNode.rotation ||
            nextProps.sceneData.selectedNode.scale !== this.props.sceneData.selectedNode.scale
        );
    }

    render() {
        const scene = this.props.sceneData;
        const hasHierarchy = scene.nodes !== '[]';
        const nodeSelected = scene.selectedNode.path;
        const setProperty = this.props.setProperty;
        return hasHierarchy && nodeSelected ? (
            <div className='selected-node-panel-parent'>
                <Container class='selected-node-panel' flex>
                    <Detail label='Name' value={scene.selectedNode.name} />
                    <Vector label='Position' dimensions={3} value={scene.selectedNode.position} enabled={true}
                        onChange={(value: number[]) => {
                            if (vecEqualToArray(scene.selectedNode.position, value)) return;
                            setProperty('scene.selectedNode.position', value);
                        }}/>
                    <Vector label='Rotation' dimensions={3} value={scene.selectedNode.rotation} enabled={true}
                        onChange={(value: number[]) => {
                            if (vecEqualToArray(scene.selectedNode.rotation, value)) return;
                            setProperty('scene.selectedNode.rotation', value);
                        }}/>
                    <Vector label='Scale' dimensions={3} value={scene.selectedNode.scale} enabled={true}
                        onChange={(value: number[]) => {
                            if (vecEqualToArray(scene.selectedNode.scale, value)) return;
                            setProperty('scene.selectedNode.scale', value);
                        }}/>
                    <Container class='panel-option'>
                        <Label class='panel-label' text='Reset' />
                        <Button class='panel-value' text='Reset transform'
                            onClick={() => setProperty('gizmoResetTrigger', Date.now())} />
                    </Container>
                </Container>
            </div>
        ) : null;
    }
}

export default SelectedNode;
