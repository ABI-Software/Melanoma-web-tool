import { Box, Typography, Stack, Button, Divider, Grid } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import PercentIcon from "@mui/icons-material/Percent";
import BubbleChartIcon from "@mui/icons-material/BubbleChart";

/**
 * Placeholder research links shown in the Previous Research section.
 * Replace these entries with the final paper.
 */
const previousPapers = [
  {
    title: "Paper title 1 Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    venue: "Journal / Conference, 2022",
    url: "https://doi.org/xx.xxxx/xxxxx"
  },
  {
    title: "Paper title 2 Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    venue: "Journal / Conference, 2020",
    url: "https://pubmed.ncbi.nlm.nih.gov/xxxxxxxx/"
  },
];

/**
 * Landing page for the melanoma lymphatic pathways web tool.
 * It introduces the project, highlights the two core tools,
 * and lists supporting prior research links.
 *
 * @returns {JSX.Element} The rendered home page.
 */
export default function Home() {
  return (
    <Box sx={{ px: { xs: 2, md: 5 }, pb: 6 }}>
      {/* Title */}
      <Stack
        spacing={1.25}
        sx={{
          textAlign: "left",
          mt: { xs: 4, sm: 5, md: 6 },
        }}
      >
        <Typography variant="h1" gutterBottom align="left">
          Melanoma Lymphatic Pathways
        </Typography>
        <Typography color="text.secondary" align="left">
          SUB TITLE Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </Typography>
      </Stack>

      {/* Main content row with project description and entry points to both tools. */}
      <Box sx={{ mt: 6 }}>
        <Grid
          container
          spacing={{ xs: 3, md: 6 }}
          alignItems="start"
        >
          {/* Left: description */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={1.25} sx={{ textAlign: "left" }}>
              <Typography color="text.secondary">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur.
              </Typography>
              <Typography color="text.secondary">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur.
              </Typography>
              <Typography color="text.secondary">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur.
              </Typography>
            </Stack>
          </Grid>

          {/* Middle: skin selection */}
          <Grid size={{ xs: 12, md: 4 }}>
            <ToolBlock
              icon={<PercentIcon />}
              imageSrc={`${import.meta.env.BASE_URL}images/tool1preview.png`}
              imageAlt="Skin Selection Tool preview"
              title="Skin Selection Tool"
              body="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero."
              ctaLabel="Open Skin Selection Tool"
              to="/tool1"
            />
          </Grid>

          {/* Right: Heatmaps */}
          <Grid size={{ xs: 12, md: 4 }}>
            <ToolBlock
              icon={<BubbleChartIcon />}
              imageSrc={`${import.meta.env.BASE_URL}images/tool2preview.png`}
              imageAlt="Heatmaps Tool preview"
              title="Heatmaps Tool"
              body="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero."
              ctaLabel="Open Heatmaps Tool"
              to="/tool2"
            />
          </Grid>
        </Grid>
      </Box>

      {/* Supporting literature section with external links to prior work. */}
      <Box sx={{ mt: 6 }}>
        <Stack spacing={1} sx={{ textAlign: "left" }}>
          <Typography variant="h2" align="left">
            Previous Research
          </Typography>
          <Typography color="text.secondary" align="left">
            Links to prior work and papers that underpin this project.
          </Typography>

          <Divider sx={{ my: 1.5 }} />

          <Stack spacing={2.25} divider={<Divider flexItem />}>
            {previousPapers.map((p) => (
              <Box
                key={p.url}
                sx={{
                  display: "flex",
                  alignItems: { xs: "flex-start", sm: "center" },
                  justifyContent: "space-between",
                  gap: 2.5,
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                <Box sx={{ textAlign: "left" }}>
                  <Typography sx={{ fontWeight: 800 }}>{p.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {p.venue}
                  </Typography>
                </Box>

                <Button
                  component="a"
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  sx={{
                    borderRadius: 999,
                    textTransform: "none",
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    alignSelf: { xs: "stretch", sm: "auto" },
                  }}
                >
                  Open paper
                </Button>
              </Box>
            ))}
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}

/**
 * Reusable content block used to present a tool preview on the home page.
 *
 * @param {Object} props Component props.
 * @param {JSX.Element} props.icon Icon displayed above the tool title.
 * @param {string} props.imageSrc Preview image source.
 * @param {string} props.imageAlt Alternative text for the preview image.
 * @param {string} props.title Tool title.
 * @param {string} props.body Short descriptive text for the tool.
 * @param {string} props.to Route path opened when the CTA button is clicked.
 * @returns {JSX.Element} The rendered tool preview block.
 */
function ToolBlock({ icon, imageSrc, imageAlt, title, body, ctaLabel, to }) {
  return (
    <Stack spacing={1.5} sx={{ textAlign: "center", alignItems: "center" }}>
      {/* Static preview image used to visually introduce the tool before navigation. */}
      <Box
        component="img"
        src={imageSrc}
        alt={imageAlt}
        sx={{
          width: "100%",
          maxWidth: 420,
          aspectRatio: "3 / 4",
          objectFit: "cover",
          borderRadius: 3,
          display: "block",
        }}
      />
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
        {icon}
        <Typography sx={{ fontWeight: 800 }}>{title}</Typography>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 520 }}>
        {body}
      </Typography>

      {/* Primary navigation action that takes the user directly into the selected tool. */}
      <Button
        component={RouterLink}
        to={to}
        variant="outlined"
        sx={{ borderRadius: 999, textTransform: "none", fontWeight: 700 }}
      >
        {ctaLabel}
      </Button>
    </Stack>
  );
}
