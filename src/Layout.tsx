import { Outlet, Link } from "react-router-dom";
import { css, Global } from "@emotion/react";
import { ButtonGroup, Button, Box, Container } from "@mui/material";
import { useLocation } from "react-router-dom";

const globalStyle = css`
  body {
    background-color: #eceff1;
  }
`;

function Layout() {
  const location = useLocation();

  function getButtonVariant(path: string) {
    return location.pathname === path ? "contained" : "outlined";
  }

  return (
    <>
      <Global styles={globalStyle} />
      <Container>
        <Box mt={2} className="as">
          <Box mb={2}>
            <ButtonGroup aria-label="outlined button group">
              <Link to={"/sort-algorithm"}>
                <Button variant={getButtonVariant("/sort-algorithm")}>
                  Sort Algorithm
                </Button>
              </Link>
              <Link to={"/bar-chart-race"}>
                <Button variant={getButtonVariant("/bar-chart-race")}>
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
    </>
  );
}

export default Layout;
