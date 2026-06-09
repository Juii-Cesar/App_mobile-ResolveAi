import React from 'react';
import Svg, { Rect } from 'react-native-svg';

export default function IdentidadeIcon({ width = 296, height = 111, ...props }) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 296 111"
      fill="none"
      {...props}
    >
      <Rect width="144" height="111" rx="5" fill="#4B9467" />
      <Rect x="152" width="144" height="111" rx="5" fill="#4B9467" />

      <Rect x="10" y="11" width="124" height="8" rx="2" fill="#3D7D56" />
      <Rect x="10" y="25" width="46" height="52" rx="3" fill="#D9D9D9" />
      <Rect x="64" y="25" width="70" height="6" rx="2" fill="#3D7D56" />
      <Rect x="64" y="36" width="52" height="5" rx="2" fill="#3D7D56" />
      <Rect x="64" y="46" width="70" height="5" rx="2" fill="#3D7D56" />
      <Rect x="64" y="56" width="38" height="5" rx="2" fill="#3D7D56" />
      <Rect x="10" y="84" width="124" height="16" rx="2" fill="#3D7D56" />

      <Rect x="162" y="11" width="124" height="6" rx="2" fill="#3D7D56" />
      <Rect x="162" y="23" width="124" height="6" rx="2" fill="#3D7D56" />
      <Rect x="162" y="35" width="124" height="22" rx="2" fill="#3D7D56" />
      <Rect x="162" y="63" width="56" height="6" rx="2" fill="#3D7D56" />
      <Rect x="230" y="63" width="56" height="6" rx="2" fill="#3D7D56" />
      <Rect x="162" y="74" width="124" height="6" rx="2" fill="#3D7D56" />
      <Rect x="162" y="85" width="124" height="15" rx="2" fill="#3D7D56" />
    </Svg>
  );
}