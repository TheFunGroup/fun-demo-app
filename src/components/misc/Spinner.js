import * as React from "react"

const Spinner = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    style={{
      background: "0 0",
      display: "block",
      shapeRendering: "auto",
      height: props.height || "22px",
      width: props.width || "22px",
      marginLeft: props.marginLeft || "0px",
      marginRight: props.marginRight || "0px"
    }}
    width={200}
    height={200}
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid"
    {...props}
  >
    <circle
      cx={50}
      cy={50}
      fill="none"
      stroke="#989898"
      strokeWidth={10}
      r={35}
      strokeDasharray="164.93361431346415 56.97787143782138"
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        repeatCount="indefinite"
        dur="0.5555555555555556s"
        values="0 50 50;360 50 50"
        keyTimes="0;1"
      />
    </circle>
  </svg>
)

export default Spinner;
