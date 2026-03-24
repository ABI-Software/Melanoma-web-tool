import { Box, Fab, Stack, Tooltip, Divider, IconButton } from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";

/**
 * Shared styling for the FAB container.
 * Matches the visual treatment used by the view controls for consistency.
 */
const pillFabSx = {
  borderRadius: 999,
  boxShadow: "none",
  border: "1px solid",
  borderColor: "divider",
  bgcolor: "background.paper",
  color: "text.primary",
  px: 1.0,
  typography: "body2",
  fontWeight: 500,
  letterSpacing: 0,
  "&:hover": { bgcolor: "background.paper" },
};

/**
 * Shared styling for each icon button inside the canvas controls.
 */
const iconBtnSx = {
  width: 32,
  height: 32,
  borderRadius: 999, 
  color: "text.primary",
  "&:hover": { bgcolor: "action.hover" },
};

/**
 * Floating canvas control group for zooming and resetting the 3D view.
 *
 * @param {Object} props Component props.
 * @param {() => void} props.onZoomIn Callback fired when the zoom-in button is clicked.
 * @param {() => void} props.onZoomOut Callback fired when the zoom-out button is clicked.
 * @param {() => void} props.onReset Callback fired when the reset-view button is clicked.
 * @param {import("@mui/material").SxProps} [props.sx] Optional additional MUI sx styles for the wrapper.
 * @returns {JSX.Element} The rendered canvas controls.
 */
export default function CanvasControls({ onZoomIn, onZoomOut, onReset, sx }) {
  const safeTop = "calc(env(safe-area-inset-top, 0px) + 12px)";
  const safeRight = "calc(env(safe-area-inset-right, 0px) + 12px)";

  return (
    <Box
      sx={{
        position: "absolute",
        top: safeTop,
        right: safeRight,
        zIndex: 30,
        pointerEvents: "auto",
        ...sx,
      }}
    >
      {/* Render as a non-button container so IconButtons are valid */}
      <Fab
        component="div"
        role="group"
        aria-label="Canvas controls"
        size="small"
        variant="extended"
        sx={pillFabSx}
      >
        <Stack direction="row" alignItems="center" sx={{ height: "100%" }}>
          <Tooltip title="Zoom in" placement="bottom" arrow>
            <IconButton size="small" onClick={onZoomIn} aria-label="Zoom in" sx={iconBtnSx}>
              <AddOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Zoom out" placement="bottom" arrow>
            <IconButton size="small" onClick={onZoomOut} aria-label="Zoom out" sx={iconBtnSx}>
              <RemoveOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5, opacity: 0.5 }} />

          <Tooltip title="Reset view" placement="bottom" arrow>
            <IconButton size="small" onClick={onReset} aria-label="Reset view" sx={iconBtnSx}>
              <ReplayOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Fab>
    </Box>
  );
}