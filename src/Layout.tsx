import { Outlet, Link } from "react-router-dom";
import { css } from "@emotion/react";
import { ButtonGroup, Button, Box, Container } from "@mui/material";
import { useLocation } from "react-router-dom";

function Layout() {
  const location = useLocation();
  console.log(location);

  function getButtonVariant(path: string) {
    return location.pathname === path ? "contained" : "outlined";
  }

  return (
    <Container>
      <Box mt={2}>
        <Box mb={2}>
          <ButtonGroup aria-label="outlined button group">
            <Link to={"/sort-algorithm"}>
              <Button variant={getButtonVariant("/sort-algorithm")}>
                Sort Algorithm
              </Button>
            </Link>
            <Link to={"/car-chart-race"}>
              <Button variant={getButtonVariant("/car-chart-race")}>
                <div>bar chart race</div>
              </Button>
            </Link>
            <Link to={"/a"}>
              <Button variant={getButtonVariant("/a")}>
                <div>SortAlgorithm</div>
              </Button>
            </Link>
          </ButtonGroup>
        </Box>
        <Box mb={2}>
          <Outlet />
        </Box>
      </Box>
    </Container>
  );
}

export default Layout;
