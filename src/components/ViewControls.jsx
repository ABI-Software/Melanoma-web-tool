import { useState } from "react";
import { Box, Fab, Menu, MenuItem } from "@mui/material";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";

/**
 * Available camera/view presets shown in the view selector menu.
 */
const PRESETS = ["Anterior", "Posterior", "Left lateral", "Right lateral", "All"];

/**
 * Converts internal preset labels into shorter display labels for the UI.
 *
 * @param {string} p Internal preset name.
 * @returns {string} User-facing label for the preset.
 */
function labelForPreset(p) {
  if (p === "Left lateral") return "Left";
  if (p === "Right lateral") return "Right";
  return p;
}

/**
 * Shared styling for the pillshaped floating action button used to open
 * the view preset menu.
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
  textTransform: "none",
  "&:hover": { bgcolor: "background.paper" },
};

/**
 * Floating view selector for switching between predefined view presets.
 *
 * @param {Object} props Component props.
 * @param {string} [props.value="All"] Currently selected preset.
 * @param {(preset: string) => void} [props.onChange] Callback fired when a new preset is selected.
 * @param {import("@mui/material").SxProps} [props.sx] Optional additional MUI sx styles for the wrapper.
 * @param {number} [props.offsetY=52] Vertical offset below the top safe area.
 * @returns {JSX.Element} The rendered floating view controls.
 */
export default function ViewControls({
  value = "All",
  onChange,
  sx,
  offsetY = 52,
}) {
  // Anchor element used to position the dropdown menu beside the trigger button.
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Respect device safe areas so controls do not overlap notches or screen edges.
  const safeTop = "calc(env(safe-area-inset-top, 0px) + 12px)";
  const safeRight = "calc(env(safe-area-inset-right, 0px) + 12px)";

  return (
    <Box
      sx={{
        position: "absolute",
        top: `calc(${safeTop} + ${offsetY}px)`,
        right: safeRight,
        zIndex: 30,
        pointerEvents: "auto",
        ...sx,
      }}
    >
      <Fab
        size="small"
        variant="extended"
        disableRipple
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={pillFabSx}
      >
        <TuneOutlinedIcon sx={{ mr: 0.75, fontSize: 20 }} />
        View: {labelForPreset(value)}
      </Fab>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: { sx: { borderRadius: 2, mt: 1, minWidth: 180 } },
        }}
      >
        {/* Render all available presets with the current one highlighted. */}
        {PRESETS.map((p) => (
          <MenuItem
            key={p}
            selected={value === p}
            onClick={() => {
              onChange?.(p);
              setAnchorEl(null);
            }}
          >
            {labelForPreset(p)}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
