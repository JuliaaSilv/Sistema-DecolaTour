import React from "react";

interface OffersIconProps {
  width?: number;
  height?: number;
}

export default function OffersIcon({
  width = 27,
  height = 27,
}: OffersIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 27 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="27" height="27" fill="url(#pattern0_1_3120)" />
      <defs>
        <pattern
          id="pattern0_1_3120"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use xlinkHref="#image0_1_3120" transform="scale(0.0111111)" />
        </pattern>
        <image
          id="image0_1_3120"
          width="90"
          height="90"
          preserveAspectRatio="none"
          xlinkHref="data:image/png;base64,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"
        />
      </defs>
    </svg>
  );
}