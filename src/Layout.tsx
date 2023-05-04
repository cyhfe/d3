import { Outlet, Link } from "react-router-dom";
import { css, Global } from "@emotion/react";
import { ButtonGroup, Button, Box, Container } from "@mui/material";
import { useLocation } from "react-router-dom";
import NiceTry from "../src/routes/niceTry/index";
const globalStyle = css`
  body {
    background-color: #eceff1;
  }
`;

function Layout() {
  const location = useLocation();

  function getButtonColor(path: string) {
    return location.pathname === path ? "success" : "primary";
  }

  return (
    <>
      <Global styles={globalStyle} />
      <Container>
        <Box mt={2} className="as">
          <Box mb={2}>
            <ButtonGroup aria-label="outlined button group">
              <Link to={"/sort-algorithm"}>
                <Button color={getButtonColor("/sort-algorithm")}>
                  Sort Algorithm
                </Button>
              </Link>
              <Link to={"/bar-chart-race"}>
                <Button color={getButtonColor("/bar-chart-race")}>
                  <div>bar chart race</div>
                </Button>
              </Link>
              <Link to={"/nice-try"}>
                <Button color={getButtonColor("/nice-try")}>SortAl</Button>
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
