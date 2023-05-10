import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";

import Drawer from "@mui/material/Drawer";

import ListItemText from "@mui/material/ListItemText";

import { Link, Outlet, useLocation } from "react-router-dom";
import * as colors from "@mui/material/colors";
import { MenuItem, MenuList } from "@mui/material";

const drawerWidth = 240;
const menuItemList = [
  {
    to: "/",
    label: "README",
  },
  {
    to: "/midi-viz",
    label: "MIDI音符可视化",
  },
  {
    to: "/sort-algorithm",
    label: "排序算法可视化",
  },
  {
    to: "/bar-chart-race",
    label: "趋势图动态排序",
  },
  {
    to: "/bar-chart",
    label: "barChart",
  },
  {
    to: "/area-chart",
    label: "areaChart",
  },
];

export default function ResponsiveDrawer() {
  const location = useLocation();

  function isSelected(to: string) {
    return location.pathname === to;
  }

  function renderMenuItem() {
    return menuItemList.map((m) => {
      return (
        <MenuItem
          key={m.to}
          component={Link}
          to={m.to}
          selected={isSelected(m.to)}
          sx={{
            "&.Mui-selected": {
              color: colors.blue[600],
            },
          }}
        >
          <ListItemText>{m.label}</ListItemText>
        </MenuItem>
      );
    });
  }

  const drawer = (
    <div>
      <MenuList>{renderMenuItem()}</MenuList>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      ></AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          background: colors.blueGrey[50],
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
