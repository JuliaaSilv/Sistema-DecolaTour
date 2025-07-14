import React from "react";

interface ProfileIconProps {
  width?: number;
  height?: number;
}

export default function ProfileIcon({
  width = 32,
  height = 32,
}: ProfileIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="32" height="32" fill="url(#pattern0_1_3121)" />
      <defs>
        <pattern
          id="pattern0_1_3121"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use xlinkHref="#image0_1_3121" transform="scale(0.0111111)" />
        </pattern>
        <image
          id="image0_1_3121"
          width="90"
          height="90"
          preserveAspectRatio="none"
          xlinkHref="data:image/png;base64,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"
        />
      </defs>
    </svg>
  );
}