import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Paper, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Outlet, useLocation } from "react-router-dom";

import SharedBodyViewer from "../components/SharedBodyViewer";
import CanvasControls from "../components/CanvasControls";
import ViewControls from "../components/ViewControls";

/** Minimum allowed width for the desktop sidebar panel. */
const MIN_SIDEBAR_W = 290;
/** Maximum allowed width for the desktop sidebar panel. */
const MAX_SIDEBAR_W = 720;
/** Default desktop sidebar width used when no saved preference exists. */
const DEFAULT_SIDEBAR_W = 520;

/**
 * Shared page layout for both interactive tool routes.
 * It coordinates the responsive sidebar, shared 3D viewer, floating controls,
 * and route-specific state passed down through the outlet context.
 *
 * @returns {JSX.Element} The rendered tools layout.
 */
export default function ToolsLayout() {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const location = useLocation();

  // Stores the imperative viewer API exposed by the shared body viewer.
  const apiRef = useRef(null);

  // Derive the currently active tool mode from the route.
  const activeTool = location.pathname.includes("/tool2") ? "heatmap" : "skin";

  // Selected camera preset shared with the floating view controls.
  const [viewPreset, setViewPreset] = useState("All");

  // Desktop sidebar width, restored from local storage when available.
  const [sidebarW, setSidebarW] = useState(() => {
    if (typeof window === "undefined") return DEFAULT_SIDEBAR_W;
    const saved = Number(window.localStorage.getItem("tools_sidebarW"));
    return Number.isFinite(saved) && saved > 0 ? saved : DEFAULT_SIDEBAR_W;
  });

  // Persist sidebar width changes so the desktop layout keeps the user's preference.
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("tools_sidebarW", String(sidebarW));
  }, [sidebarW]);

  // Shared state for the skin selection tool
  const [skinState, setSkinState] = useState({
    rows: [],
    showPatientCounts: true,
    showNodecodes: true,
    showDrainage: true,
  });

  // Shared state for the heatmap tool
  const [heatmapState, setHeatmapState] = useState({
    region: "Right Axilla",
    pointDisplayMode: "normalised", // none or sites or normalised
    regions: [],
    patientDataKeys: [],
    defaultRegion: "Right Axilla",
  });

  /**
   * Static grouped heatmap region definitions used to derive user-facing labels.
   * Memoised because the structure does not change between renders.
   */
  const heatmapSections = useMemo(
    () => [
      {
        title: "Head and Neck",
        rows: [
          { type: "lr", label: "Occipital", left: "Left Occipital", right: "Right Occipital" },
          { type: "lr", label: "Preauricular", left: "Left Preauricular", right: "Right Preauricular" },
          { type: "lr", label: "Postauricular", left: "Left Postauricular", right: "Right Postauricular" },
          { type: "lr", label: "Cervical Level I", left: "Left Cervical Level I", right: "Right Cervical Level I" },
          { type: "lr", label: "Cervical Level II", left: "Left Cervical Level II", right: "Right Cervical Level II" },
          { type: "lr", label: "Cervical Level III", left: "Left Cervical Level III", right: "Right Cervical Level III" },
          { type: "lr", label: "Cervical Level IV", left: "Left Cervical Level IV", right: "Right Cervical Level IV" },
          { type: "lr", label: "Cervical Level V", left: "Left Cervical Level V", right: "Right Cervical Level V" },
          { type: "lr", label: "Submental", left: "Left Submental", right: "Right Submental" },
          { type: "single", label: "Anterior Node Fields", valueKey: "Anterior Head" },
          { type: "single", label: "Posterior Node Fields", valueKey: "Posterior Head" },
        ],
      },
      {
        title: "Torso and Upper Limb",
        rows: [
          { type: "lr", label: "Axilla Levels I, II, III", left: "Left Axilla", right: "Right Axilla" },
          { type: "lr", label: "Axilla Level I Anterior", left: "Left Axilla/Sub-Node Fields Laa", right: "Right Axilla/Sub-Node Fields Raa" },
          { type: "lr", label: "Axilla Level I Mid", left: "Left Axilla/Sub-Node Fields Lam", right: "Right Axilla/Sub-Node Fields Ram" },
          { type: "lr", label: "Axilla Level I Posterior", left: "Left Axilla/Sub-Node Fields Lap", right: "Right Axilla/Sub-Node Fields Rap" },
          { type: "lr", label: "Axilla Level I Lateral", left: "Left Axilla/Sub-Node Fields Lal", right: "Right Axilla/Sub-Node Fields Ral" },
          { type: "lr", label: "Triangular Intermuscular Space", left: "Left Triangular Intermuscular Space", right: "Right Triangular Intermuscular Space" },
          { type: "lr", label: "Supraclavicular Fossa", left: "Left Supraclavicular Fossa", right: "Right Supraclavicular Fossa" },
          { type: "lr", label: "Epitrochlear", left: "Left Epitrochlear", right: "Right Epitrochlear" },
        ],
      },
      {
        title: "Lower Limb",
        rows: [
          { type: "lr", label: "Groin (External Iliac, Femoral, Inguinal)", left: "Left Groin", right: "Right Groin" },
          { type: "lr", label: "External Iliac", left: "Left Groin/Sub-Node Fields Liei", right: "Right Groin/Sub-Node Fields Riei" },
          { type: "lr", label: "Femoral", left: "Left Groin/Sub-Node Fields Lif", right: "Right Groin/Sub-Node Fields Rif" },
          { type: "lr", label: "Inguinal", left: "Left Groin/Sub-Node Fields Lii", right: "Right Groin/Sub-Node Fields Rii" },
          { type: "lr", label: "Popliteal", left: "Left Popliteal", right: "Right Popliteal" },
        ],
      },
    ],
    []
  );

  /**
   * Converts an internal heatmap region key into the label displayed in the viewer overlay.
   *
   * @param {string} value Internal region identifier.
   * @returns {string} Human-readable region label.
   */
  const getDisplayRegionLabel = (value) => {
    for (const sec of heatmapSections) {
      for (const row of sec.rows) {
        if (row.type === "single" && row.valueKey === value) {
          return row.label;
        }
        if (row.type === "lr") {
          if (row.left === value) return `Left ${row.label}`;
          if (row.right === value) return `Right ${row.label}`;
        }
      }
    }

    if (value === "1 Draining Node Fields") return "1 Draining Node Field";
    if (value === "2 Or More Draining Node Fields") return "2+ Draining Node Fields";
    if (value === "3 Or More Draining Node Fields") return "3+ Draining Node Fields";
    if (value === "4 Or More Draining Node Fields") return "4+ Draining Node Fields";

    return value;
  };

  // Human-readable label shown over the viewer for the currently selected heatmap region.
  const selectedRegionLabel = getDisplayRegionLabel(heatmapState.region);

  /**
   * Resets the shared view controls and active-tool state back to their defaults.
   * Also forwards the reset request to the underlying 3D viewer API.
   */
  const handleReset = () => {
    setViewPreset("All");

    if (activeTool === "skin") {
      setSkinState((prev) => ({
        ...prev,
        rows: [],
      }));
    }

    if (activeTool === "heatmap") {
      setHeatmapState((prev) => ({
        ...prev,
        region: prev.defaultRegion || "Right Axilla",
        pointDisplayMode: "normalised",
      }));
    }

    apiRef.current?.resetAll?.();
  };

  /**
   * Starts desktop sidebar resizing and tracks pointer movement until release.
   *
   * @param {PointerEvent | React.PointerEvent} e Pointer event from the resize handle.
   */
  const startResize = (e) => {
    if (!isMdUp) return;
    if (e.button !== 0) return;

    e.preventDefault();

    const startX = e.clientX;
    const startW = sidebarW;

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const onMove = (ev) => {
      const next = Math.min(
        MAX_SIDEBAR_W,
        Math.max(MIN_SIDEBAR_W, startW + (ev.clientX - startX))
      );
      setSidebarW(next);
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  /**
   * Shared context object passed to nested tool routes through React Router's outlet.
   * Keeps both tool pages connected to the same viewer and layout state.
   */
  const outletContext = useMemo(
    () => ({
      activeTool,
      isMdUp,
      skinState,
      setSkinState,
      heatmapState,
      setHeatmapState,
    }),
    [activeTool, isMdUp, skinState, heatmapState]
  );

  // Render the responsive two panel layout with the shared viewer and route-specific sidebar.
  return (
    <Box
      sx={{
        position: "relative",
        height: { xs: "calc(100dvh - 56px)", sm: "calc(100dvh - 64px)" },
        width: "100%",
        display: { xs: "block", md: "grid" },
        gridTemplateColumns: { md: `${sidebarW}px 1fr` },
        overflow: "hidden",
      }}
    >
      {/* Desktop only sidebar column with a draggable resize handle and nested route content. */}
      {isMdUp && (
        <Box
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            minWidth: 0,
            minHeight: 0,
            borderRight: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            overflow: "hidden",
          }}
        >
          {/* Thin draggable edge used to resize the desktop sidebar width. */}
          <Box
            onPointerDown={startResize}
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize side panel"
            sx={{
              position: "absolute",
              top: 0,
              right: -4,
              width: 8,
              height: "100%",
              cursor: "col-resize",
              zIndex: 50,
              "&:hover": { bgcolor: "action.hover" },
            }}
          />

          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              overflow: "auto",
            }}
          >
            <Outlet context={outletContext} />
          </Box>
        </Box>
      )}

      <Box
        sx={{
          position: "relative",
          height: "100%",
          width: "100%",
          overflow: "hidden",
          isolation: "isolate",
          minWidth: 0,
          minHeight: 0,
        }}
      >
        {/* Shared Three.js viewer that stays mounted while switching between tool sidebars. */}
        <SharedBodyViewer
          activeTool={activeTool}
          viewPreset={viewPreset}
          skinState={skinState}
          heatmapState={heatmapState}
          onSkinRowsChange={(rows) => {
            setSkinState((prev) => ({
              ...prev,
              rows,
            }));
          }}
          onHeatmapMetaReady={(meta) => {
            setHeatmapState((prev) => ({
              ...prev,
              regions: meta.regions,
              patientDataKeys: meta.patientDataKeys,
              defaultRegion: meta.defaultRegion,
              region: meta.regions.includes(prev.region)
                ? prev.region
                : meta.defaultRegion,
            }));
          }}
          onApiReady={(api) => {
            apiRef.current = api;
          }}
        />

        {/* Floating zoom and reset controls wired to the viewer API. */}
        <CanvasControls
          onZoomIn={() => apiRef.current?.zoomIn?.()}
          onZoomOut={() => apiRef.current?.zoomOut?.()}
          onReset={handleReset}
        />

        {/* Floating view-preset selector shared by both tools. */}
        <ViewControls value={viewPreset} onChange={setViewPreset} />

        {/* Desktop heatmap legend anchored in the bottom-left corner of the viewer. */}
        {activeTool === "heatmap" && isMdUp && (
          <Box
            sx={{
              position: "absolute",
              left: 12,
              bottom: 12,
              zIndex: 25,
              pointerEvents: "none",
              width: 260,
            }}
          >
            <HeatmapLegend />
          </Box>
        )}

        {/* Bottom-centre overlay showing the currently selected heatmap region label. */}
        {activeTool === "heatmap" && (
          <Paper
            variant="outlined"
            sx={{
              position: "absolute",
              left: "50%",
              bottom: 12,
              transform: "translateX(-50%)",
              zIndex: 26,
              px: 1.5,
              py: 0.75,
              borderRadius: 2.5,
              bgcolor: "background.paper",
              pointerEvents: "none",
              maxWidth: "calc(100% - 24px)",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: 1000,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {selectedRegionLabel}
            </Typography>
          </Paper>
        )}

        {/* Mobile layout overlays the nested tool UI on top of the shared viewer. */}
        {!isMdUp && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 30,
              pointerEvents: "none",
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: "100%",
                pointerEvents: "none",
              }}
            >
              <Box sx={{ pointerEvents: "auto" }}>
                <Outlet context={outletContext} />
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}

/**
 * Compact legend describing the colour scale used by the heatmap viewer.
 *
 * @returns {JSX.Element} The rendered heatmap legend card.
 */
function HeatmapLegend() {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.25,
        borderRadius: 2.5,
        bgcolor: "background.paper",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
        <Typography variant="caption" color="text.secondary">
          0%
        </Typography>

        <Typography
          variant="caption"
          sx={{ flex: 1, textAlign: "center", fontWeight: 700 }}
        >
          % Drainage likelihood
        </Typography>

        <Typography variant="caption" color="text.secondary">
          100%
        </Typography>
      </Box>

      <Box
        sx={{
          height: 14,
          borderRadius: 999,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            height: "100%",
            width: "100%",
            background:
              "linear-gradient(90deg, #0033ff 0%, #00d5ff 25%, #00ff66 50%, #ffe600 75%, #ff2a00 100%)",
          }}
        />
      </Box>
    </Paper>
  );
}