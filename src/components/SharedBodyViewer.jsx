import { useEffect, useRef } from "react";
import { SharedBodyEngine } from "../three/SharedBodyEngine";
import "../three/ThreeLabels.css";

/**
 * Mounts and manages the shared 3D body viewer used by both tools.
 * It initialises the Three.js engine once, exposes a small control API to the parent,
 * and keeps the engine in sync with React state changes for tool mode, view preset,
 * skin flags, and heatmap selection.
 *
 * @param {Object} props Component props.
 * @param {string} props.activeTool Currently active tool mode.
 * @param {string} props.viewPreset Current camera/view preset to apply.
 * @param {Object} props.skinState Skin selection display state.
 * @param {boolean} props.skinState.showNodecodes Whether node codes should be shown.
 * @param {boolean} props.skinState.showDrainage Whether drainage percentages should be shown.
 * @param {boolean} props.skinState.showPatientCounts Whether patient counts should be shown.
 * @param {Object} props.heatmapState Heatmap display state.
 * @param {string | null} props.heatmapState.region Currently selected heatmap region.
 * @param {string} props.heatmapState.pointDisplayMode Active heatmap point display mode.
 * @param {(rows: any[]) => void} [props.onSkinRowsChange] Callback for updated skin selection table rows.
 * @param {(meta: any) => void} [props.onHeatmapMetaReady] Callback when heatmap metadata is ready.
 * @param {(api: { zoomIn: () => void, zoomOut: () => void, resetAll: () => void } | null) => void} [props.onApiReady]
 * Callback that exposes the engine control API to the parent, or clears it on unmount.
 * @returns {JSX.Element} Absolute-positioned host element for the Three.js viewer.
 */
export default function SharedBodyViewer({
  activeTool,
  viewPreset,
  skinState,
  heatmapState,
  onSkinRowsChange,
  onHeatmapMetaReady,
  onApiReady,
}) {
  // DOM node that Three.js renders into.
  const hostRef = useRef(null);
  // Persistent engine instance so React updates can call imperative viewer methods.
  const engineRef = useRef(null);

  /**
   * Initialise the shared body engine once on mount and dispose it on unmount.
   * Also provides a minimal control API back to the parent after initialisation.
   */
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let cancelled = false;

    const engine = new SharedBodyEngine({
      host,
      initialTool: activeTool,
      onSkinRowsChange,
      onHeatmapMetaReady,
    });

    engineRef.current = engine;

    // Complete async engine setup, then push the latest React state into the viewer.
    (async () => {
      await engine.init();
      if (cancelled) return;

      onApiReady?.({
        zoomIn: () => engine.zoomIn?.(),
        zoomOut: () => engine.zoomOut?.(),
        resetAll: () => engine.resetAll?.(),
      });

      engine.setActiveTool?.(activeTool);
      engine.setViewPreset?.(viewPreset);

      engine.setSkinFlags?.({
        showNodecodes: skinState.showNodecodes,
        showDrainage: skinState.showDrainage,
        showPatientCounts: skinState.showPatientCounts,
      });

      engine.setHeatmapSelection?.({
        region: heatmapState.region,
        pointDisplayMode: heatmapState.pointDisplayMode,
      });
    })();

    // Tear down the engine and clear the parent facing API when the viewer unmounts.
    return () => {
      cancelled = true;
      onApiReady?.(null);
      engine.dispose?.();
      engineRef.current = null;
    };
  }, []);

  // Keep the engine's active tool mode in sync with React state.
  useEffect(() => {
    engineRef.current?.setActiveTool?.(activeTool);
  }, [activeTool]);

  // Apply camera/view preset changes after the engine has been created.
  useEffect(() => {
    engineRef.current?.setViewPreset?.(viewPreset);
  }, [viewPreset]);

  // Update which skin-selection overlays and labels should be visible.
  useEffect(() => {
    engineRef.current?.setSkinFlags?.({
      showNodecodes: skinState.showNodecodes,
      showDrainage: skinState.showDrainage,
      showPatientCounts: skinState.showPatientCounts,
    });
  }, [
    skinState.showNodecodes,
    skinState.showDrainage,
    skinState.showPatientCounts,
  ]);

  // Update the selected heatmap region and point display mode.
  useEffect(() => {
    engineRef.current?.setHeatmapSelection?.({
      region: heatmapState.region,
      pointDisplayMode: heatmapState.pointDisplayMode,
    });
  }, [
    heatmapState.region,
    heatmapState.pointDisplayMode,
  ]);

  // Full-size mount point for the shared Three.js canvas.
  return <div ref={hostRef} style={{ position: "absolute", inset: 0 }} />;
}