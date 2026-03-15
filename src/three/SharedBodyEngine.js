import { Base3DEngine } from "./Base3DEngine";
import { AnatomyShellLayer } from "./AnatomyShellLayer";
import { SkinSelectionLayer } from "./SkinSelectionLayer";
import { HeatmapLayer } from "./HeatmapLayer";

export class SharedBodyEngine extends Base3DEngine {
  constructor({
    host,
    onSkinRowsChange,
    onHeatmapMetaReady,
  }) {
    super({ host });

    this.activeTool = "skin";

    this.onSkinRowsChange = onSkinRowsChange;
    this.onHeatmapMetaReady = onHeatmapMetaReady;

    this.anatomyShell = null;
    this.skinLayer = null;
    this.heatmapLayer = null;
  }

  async init() {
    this.initCore();

    this.anatomyShell = new AnatomyShellLayer({
      scene: this.scene,
      offset: this.offset,
    });
    await this.anatomyShell.init();

    this.skinLayer = new SkinSelectionLayer({
      scene: this.scene,
      camera: this.camera,
      controls: this.controls,
      host: this.host,
      offset: this.offset,
      anatomyShell: this.anatomyShell,
      onRowsChange: this.onSkinRowsChange,
      onFocusChange: (point) => {
        if (!point) return;
        this.focusPoint.copy(point);
        this.hasFocusPoint = true;
        this.setControlsTarget(point);
      },
      hasFocusPoint: () => this.hasFocusPoint,
    });
    await this.skinLayer.init();

    this.heatmapLayer = new HeatmapLayer({
      scene: this.scene,
      offset: this.offset,
    });
    await this.heatmapLayer.init();

    const meta = this.heatmapLayer.getMeta();
    this.onHeatmapMetaReady?.(meta);

    this.heatmapLayer.setSelection({
      region: meta.defaultRegion,
    });

    this.setActiveTool("skin");
    this.animate();
  }

  setActiveTool(tool) {
    this.activeTool = tool;

    this.anatomyShell?.setMode(tool);
    this.skinLayer?.setEnabled(tool === "skin");
    this.heatmapLayer?.setEnabled(tool === "heatmap");
  }

  setSkinFlags(flags) {
    this.skinLayer?.setShowFlags(flags);
  }

  setHeatmapSelection(selection) {
    this.heatmapLayer?.setSelection(selection);
  }

  beforeRender() {
    this.skinLayer?.beforeRender?.();
  }

  afterRender() {
    this.skinLayer?.renderLabels?.();
  }

  resizeToHost() {
    super.resizeToHost();
    this.skinLayer?.resize?.();
  }

  resetAll() {
    this.controls?.reset();
    this.controls?.update();

    this.hasFocusPoint = false;
    this.focusPoint.set(0, 0, 0);
    this.setControlsTarget(this.focusPoint);

    this.skinLayer?.reset?.();
    this.heatmapLayer?.reset?.();

    if (this.activeTool === "skin") {
      this.anatomyShell?.setMode("skin");
      this.skinLayer?.setEnabled(true);
      this.heatmapLayer?.setEnabled(false);
    } else {
      this.anatomyShell?.setMode("heatmap");
      this.skinLayer?.setEnabled(false);
      this.heatmapLayer?.setEnabled(true);
    }
  }

  dispose() {
    this.skinLayer?.dispose?.();
    this.heatmapLayer?.dispose?.();
    this.anatomyShell?.dispose?.();

    this.skinLayer = null;
    this.heatmapLayer = null;
    this.anatomyShell = null;

    super.dispose();
  }
}