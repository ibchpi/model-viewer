import {
    type AppBase,
    type CameraComponent,
    type Entity,
    type Layer,
    GIZMOSPACE_LOCAL,
    GIZMOSPACE_WORLD,
    Gizmo,
    RotateGizmo,
    ScaleGizmo,
    TransformGizmo,
    TranslateGizmo
} from 'playcanvas';

export type GizmoMode = 'none' | 'translate' | 'rotate' | 'scale';
export type GizmoSpace = 'local' | 'world';

type ActiveGizmoMode = Exclude<GizmoMode, 'none'>;

export interface TransformControllerCallbacks {
    onStart: () => void;
    onMove: () => void;
    onEnd: () => void;
}

export class TransformController {
    private layer: Layer;

    private gizmos: Record<ActiveGizmoMode, TransformGizmo>;

    private mode: GizmoMode = 'none';

    private space: GizmoSpace = 'local';

    private target: Entity | null = null;

    constructor(app: AppBase, camera: CameraComponent, callbacks: TransformControllerCallbacks) {
        this.layer = Gizmo.createLayer(app);
        camera.layers = camera.layers.concat([this.layer.id]);

        this.gizmos = {
            translate: new TranslateGizmo(camera, this.layer),
            rotate: new RotateGizmo(camera, this.layer),
            scale: new ScaleGizmo(camera, this.layer)
        };

        (Object.values(this.gizmos) as TransformGizmo[]).forEach((gizmo) => {
            gizmo.enabled = false;
            gizmo.coordSpace = this.space;
            gizmo.on(TransformGizmo.EVENT_TRANSFORMSTART, () => callbacks.onStart());
            gizmo.on(TransformGizmo.EVENT_TRANSFORMMOVE, () => callbacks.onMove());
            gizmo.on(TransformGizmo.EVENT_TRANSFORMEND, () => callbacks.onEnd());
        });
    }

    private getActiveGizmo(): TransformGizmo | null {
        return this.mode === 'none' ? null : this.gizmos[this.mode];
    }

    setMode(mode: GizmoMode) {
        if (mode === this.mode) {
            return;
        }

        const prev = this.getActiveGizmo();
        if (prev) {
            prev.detach();
            prev.enabled = false;
        }

        this.mode = mode;

        const next = this.getActiveGizmo();
        if (next) {
            next.enabled = true;
            if (this.target) {
                next.attach([this.target]);
            }
        }
    }

    getMode(): GizmoMode {
        return this.mode;
    }

    setSpace(space: GizmoSpace) {
        this.space = space;
        const mapped = space === 'local' ? GIZMOSPACE_LOCAL : GIZMOSPACE_WORLD;
        (Object.values(this.gizmos) as TransformGizmo[]).forEach((gizmo) => {
            gizmo.coordSpace = mapped;
        });
    }

    attach(entity: Entity | null) {
        this.target = entity;
        const active = this.getActiveGizmo();
        if (!active) {
            return;
        }
        if (entity) {
            active.attach([entity]);
        } else {
            active.detach();
        }
    }

    getTarget(): Entity | null {
        return this.target;
    }

    resetTransform() {
        if (!this.target) {
            return;
        }
        this.target.setLocalPosition(0, 0, 0);
        this.target.setLocalEulerAngles(0, 0, 0);
        this.target.setLocalScale(1, 1, 1);
    }

    destroy() {
        (Object.values(this.gizmos) as TransformGizmo[]).forEach((gizmo) => {
            gizmo.destroy();
        });
    }
}
