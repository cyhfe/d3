import { Box, Typography } from "@mui/material";

function StateOfJs() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        React与D3集成
      </Typography>
      <Typography variant="body1" gutterBottom>
        React与 D3 集成的方式有 3 种:
        <ul>
          <li>
            D3渲染: 通过 ref 暴露 dom,在 useEffect 中由 D3渲染.这种方式可以使用
            D3 的所有能力,是我倾向使用的方式.
          </li>
          <li>
            React 渲染: 通过 map 的方式直接由 React渲染SVG 元素,这种方式只能将
            D3 作为工具函数,可以使用
            scale,axis,array等方法,transition,data-binding 等都不能用.
          </li>
          <li>
            混合模式: React 渲染 DOM, 当需要D3 能力时(比如动画),通过 ref
            交给D3处理
          </li>
        </ul>
      </Typography>
    </Box>
  );
}

export default StateOfJs;
