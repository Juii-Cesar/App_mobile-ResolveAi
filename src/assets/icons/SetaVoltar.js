import * as React from "react"
import Svg, { Rect, Path } from "react-native-svg"
const SetaVoltar = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 45 45"
    fill="none"
    {...props}
  >
    <Rect
      width={43}
      height={43}
      x={1}
      y={1}
      stroke="#076BDE"
      strokeWidth={2}
      rx={21.5}
    />
    <Path
      fill="#076BDE"
      d="M32 22a1 1 0 1 1 0 2v-2Zm-20.707 1.707a1 1 0 0 1 0-1.414l6.364-6.364a1 1 0 0 1 1.414 1.414L13.414 23l5.657 5.657a1 1 0 0 1-1.414 1.414l-6.364-6.364ZM32 23v1H12v-2h20v1Z"
    />
  </Svg>
)
export default SetaVoltar
