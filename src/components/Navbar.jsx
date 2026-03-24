import { useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Box,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";

/**
 * Top level navigation items rendered in both the desktop navbar
 * and the mobile drawer menu.
 */
const navItems = [
  { label: "Home", to: "/" },
  { label: "Skin Selection Tool", to: "/tool1" },
  { label: "Heatmaps Tool", to: "/tool2" },
  { label: "Our Team", to: "/team" },
];

/**
 * Responsive top navigation bar for the application.
 * Displays inline navigation buttons on larger screens and a drawer menu on mobile.
 *
 * @param {Object} props Component props.
 * @param {string} props.title Title text shown on the left side of the navbar.
 * @returns {JSX.Element} The rendered navigation bar and mobile drawer.
 */
export default function Navbar({ title }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const location = useLocation();
  const activePath = location.pathname;

  /**
   * Resolves which top level navigation item should be treated as active.
   * Falls back to prefix matching so nested routes still highlight their parent section.
   */
  const activeIndex = useMemo(() => {
    const idx = navItems.findIndex((x) => x.to === activePath);
    if (idx >= 0) return idx;
    const prefixIdx = navItems.findIndex(
      (x) => x.to !== "/" && activePath.startsWith(x.to)
    );
    return prefixIdx >= 0 ? prefixIdx : 0;
  }, [activePath]);

  /**
   * Returns the shared button styling for desktop navigation links.
   *
   * @param {boolean} isActive Whether the link represents the current route.
   * @returns {Object} MUI sx style object for the link button.
   */
  const linkSx = (isActive) => ({
    textTransform: "none",
    fontWeight: 600,
    borderRadius: 999,
    px: 1.4,
    py: 0.8,
    color: isActive ? "text.primary" : "text.secondary",
    bgcolor: isActive ? "action.hover" : "transparent",
    "&:hover": { bgcolor: "action.hover" },
  });

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          // Use a translucent surface so page content can subtly show through.
          bgcolor: "rgba(16, 24, 38, 0.75)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Toolbar sx={{ gap: 1.5 }}>
          <Typography
            variant="h6"
            component={NavLink}
            to="/"
            sx={{
              textDecoration: "none",
              color: "text.primary",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          {/* Show a compact drawer trigger on small screens, otherwise render inline nav links. */}
          {isMobile ? (
            <IconButton
              aria-label="Open navigation menu"
              onClick={() => setDrawerOpen(true)}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: "flex", gap: 0.5 }}>
              {navItems.map((item) => (
                <Button
                  key={item.to}
                  component={NavLink}
                  to={item.to}
                  end={item.to === "/"}
                  sx={({ palette }) =>
                    linkSx(
                      item.to === "/"
                        ? activeIndex === 0
                        : activePath === item.to || activePath.startsWith(item.to)
                    )
                  }
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        slotProps={{
          paper: { sx: { width: 280 } },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
            {title}
          </Typography>
        </Box>
        <Divider />
        <List sx={{ py: 0 }}>
          {/* Reuse the same route list in the mobile drawer with active state highlighting. */}
          {navItems.map((item) => {
            const isActive =
              item.to === "/"
                ? activeIndex === 0
                : activePath === item.to || activePath.startsWith(item.to);

            return (
              <ListItemButton
                key={item.to}
                component={NavLink}
                to={item.to}
                onClick={() => setDrawerOpen(false)}
                selected={isActive}
              >
                <ListItemText
                  primary={item.label}
                  slotProps={{
                    primary: { sx: { fontWeight: 650 } },
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Drawer>
    </>
  );
}
