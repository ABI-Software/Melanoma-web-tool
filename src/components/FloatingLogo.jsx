import { Box } from "@mui/material";

/**
 * Renders a fixed position logo overlay in the bottom right corner of the screen.
 * The logo is responsive across breakpoints and ignores pointer events so it does
 * not block interaction with underlying UI elements.
 *
 * @param {Object} props Component props.
 * @param {string} props.src Image source URL for the logo.
 * @param {string} [props.alt="Logo"] Alternative text for the logo image.
 * @param {number} [props.width=300] Base width prop retained for API compatibility.
 * @param {number} [props.height=70] Height of the rendered logo image.
 * @param {Object} [props.bottom={ xs: 8, sm: 10, md: 12 }] Responsive bottom offset.
 * @param {Object} [props.right={ xs: 12, sm: 16, md: 24 }] Responsive right offset.
 * @param {number} [props.zIndex=1300] Stacking order for the floating logo.
 * @returns {JSX.Element | null} The rendered floating logo, or null when no source is provided.
 */
export default function FloatingLogo({
  src,
  alt = "Logo",
  width = 300,
  height = 70,
  bottom = {xs:8, sm:10, md:12},
  right = {xs:12, sm:16, md:24},
  zIndex = 1300,
}) {
  if (!src) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        bottom,
        right,
        zIndex,
        // Allow clicks and gestures to pass through to the UI underneath.
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      <Box
        component="img"
        src={src}
        alt={alt}
        sx={{
          width : {xs:160, sm:200, md:240, lg:300},
          height,
          display: "block",
          objectFit: "contain",
        }}
      />
    </Box>
  );
}
