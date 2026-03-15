import { useEffect, useRef } from "react";
import { SharedBodyEngine } from "../three/SharedBodyEngine";
import "../three/ThreeLabels.css";

export default function SharedBodyViewer({
  activeTool,
  viewPreset,
  skinState,
  heatmapState,
  onSkinRowsChange,
  onHeatmapMetaReady,
  onApiReady,
}) {
  const hostRef = useRef(null);
  const engineRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let cancelled = false;

    const engine = new SharedBodyEngine({
      host,
      onSkinRowsChange,
      onHeatmapMetaReady,
    });

    engineRef.current = engine;

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

    return () => {
      cancelled = true;
      onApiReady?.(null);
      engine.dispose?.();
      engineRef.current = null;
    };
  }, []);

  useEffect(() => {
    engineRef.current?.setActiveTool?.(activeTool);
  }, [activeTool]);

  useEffect(() => {
    engineRef.current?.setViewPreset?.(viewPreset);
  }, [viewPreset]);

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

  useEffect(() => {
    engineRef.current?.setHeatmapSelection?.({
      region: heatmapState.region,
      pointDisplayMode: heatmapState.pointDisplayMode,
    });
  }, [
    heatmapState.region,
    heatmapState.pointDisplayMode,
  ]);

  return <div ref={hostRef} style={{ position: "absolute", inset: 0 }} />;
}