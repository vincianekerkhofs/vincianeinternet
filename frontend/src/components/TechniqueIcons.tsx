/**
 * GUITAR GUIDE PRO - TECHNIQUE SVG ICONS
 * Custom organic, gesture-based icons for each technique
 */

import React from 'react';
import Svg, { Path, Circle, G, Line, Rect } from 'react-native-svg';
import { COLORS } from '../constants/theme';

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

// HAMMER-ON: Hand coming down on string
export const HammerOnIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.text, strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 4 L12 10"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Path
      d="M8 10 C8 10 10 8 12 10 C14 8 16 10 16 10"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Circle cx="12" cy="16" r="4" stroke={color} strokeWidth={strokeWidth} fill="none" />
    <Path
      d="M7 20 L17 20"
      stroke={color}
      strokeWidth={strokeWidth + 1}
      strokeLinecap="round"
      opacity={0.5}
    />
  </Svg>
);

// PULL-OFF: Finger pulling away from string
export const PullOffIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.text, strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="10" r="4" stroke={color} strokeWidth={strokeWidth} fill="none" />
    <Path
      d="M12 14 L12 18"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Path
      d="M9 18 L12 21 L15 18"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M7 6 L17 6"
      stroke={color}
      strokeWidth={strokeWidth + 1}
      strokeLinecap="round"
      opacity={0.5}
    />
  </Svg>
);

// SLIDE: Smooth horizontal motion
export const SlideIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.text, strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 12 L19 12"
      stroke={color}
      strokeWidth={strokeWidth + 1}
      strokeLinecap="round"
      opacity={0.5}
    />
    <Circle cx="7" cy="12" r="3" stroke={color} strokeWidth={strokeWidth} fill="none" />
    <Path
      d="M10 12 L14 12"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeDasharray="2 2"
    />
    <Circle cx="17" cy="12" r="3" stroke={color} strokeWidth={strokeWidth} fill={color} fillOpacity={0.3} />
    <Path
      d="M14 9 L17 12 L14 15"
      stroke={color}
      strokeWidth={strokeWidth - 0.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// BEND HALF: Curved arrow up (small)
export const BendHalfIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.text, strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 18 L19 18"
      stroke={color}
      strokeWidth={strokeWidth + 1}
      strokeLinecap="round"
      opacity={0.5}
    />
    <Circle cx="12" cy="14" r="3" stroke={color} strokeWidth={strokeWidth} fill="none" />
    <Path
      d="M12 11 Q 14 8 14 6"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      fill="none"
    />
    <Path
      d="M12 6 L14 6 L14 8"
      stroke={color}
      strokeWidth={strokeWidth - 0.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <Path
      d="M10 5 L14 5"
      stroke={color}
      strokeWidth={1}
      strokeLinecap="round"
      strokeDasharray="1 2"
      opacity={0.6}
    />
  </Svg>
);

// BEND FULL: Curved arrow up (larger)
export const BendFullIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.text, strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 20 L19 20"
      stroke={color}
      strokeWidth={strokeWidth + 1}
      strokeLinecap="round"
      opacity={0.5}
    />
    <Circle cx="12" cy="16" r="3" stroke={color} strokeWidth={strokeWidth} fill="none" />
    <Path
      d="M12 13 Q 16 8 16 4"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      fill="none"
    />
    <Path
      d="M13 4 L16 4 L16 7"
      stroke={color}
      strokeWidth={strokeWidth - 0.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <Path
      d="M9 4 L16 4"
      stroke={color}
      strokeWidth={1}
      strokeLinecap="round"
      strokeDasharray="1 2"
      opacity={0.6}
    />
  </Svg>
);

// VIBRATO: Wavy motion
export const VibratoIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.text, strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 16 L19 16"
      stroke={color}
      strokeWidth={strokeWidth + 1}
      strokeLinecap="round"
      opacity={0.5}
    />
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={strokeWidth} fill="none" />
    <Path
      d="M4 6 Q 6 4 8 6 T 12 6 T 16 6 T 20 6"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      fill="none"
    />
  </Svg>
);

// POSITION SHIFT: Hand moving along neck
export const PositionShiftIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.text, strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="10" width="18" height="4" rx="2" stroke={color} strokeWidth={strokeWidth} fill="none" opacity={0.5} />
    <Circle cx="7" cy="12" r="2" fill={color} fillOpacity={0.3} stroke={color} strokeWidth={1} />
    <Path
      d="M10 12 L14 12"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeDasharray="2 2"
    />
    <Circle cx="17" cy="12" r="2" fill={color} stroke={color} strokeWidth={1} />
    <Path
      d="M14 9 L17 12 L14 15"
      stroke={color}
      strokeWidth={strokeWidth - 0.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// FINGER ROLLING: Curved finger motion
export const FingerRollIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.text, strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 8 L19 8"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      opacity={0.4}
    />
    <Path
      d="M5 12 L19 12"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      opacity={0.4}
    />
    <Path
      d="M5 16 L19 16"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      opacity={0.4}
    />
    <Path
      d="M10 6 Q 12 10 10 14 Q 12 18 14 18"
      stroke={color}
      strokeWidth={strokeWidth + 0.5}
      strokeLinecap="round"
      fill="none"
    />
    <Circle cx="10" cy="8" r="2" fill={color} />
    <Circle cx="10" cy="12" r="2" fill={color} fillOpacity={0.5} />
    <Circle cx="12" cy="16" r="2" fill={color} fillOpacity={0.3} />
  </Svg>
);

// ALTERNATE PICKING: Up/down arrows
export const AlternatePickingIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.text, strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 12 L19 12"
      stroke={color}
      strokeWidth={strokeWidth + 1}
      strokeLinecap="round"
      opacity={0.5}
    />
    <Path
      d="M8 8 L8 16"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Path
      d="M5 11 L8 8 L11 11"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16 8 L16 16"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Path
      d="M13 13 L16 16 L19 13"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// PALM MUTE: Hand resting on strings
export const PalmMuteIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.text, strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 10 L19 10"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      opacity={0.4}
    />
    <Path
      d="M5 14 L19 14"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      opacity={0.4}
    />
    <Path
      d="M5 18 L19 18"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      opacity={0.4}
    />
    <Rect x="12" y="8" width="8" height="12" rx="3" fill={color} fillOpacity={0.3} stroke={color} strokeWidth={strokeWidth} />
    <Path
      d="M14 12 L18 12"
      stroke={color}
      strokeWidth={1}
      strokeLinecap="round"
    />
    <Path
      d="M14 16 L18 16"
      stroke={color}
      strokeWidth={1}
      strokeLinecap="round"
    />
  </Svg>
);

// ACCENT: Emphasis marker
export const AccentIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.text, strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 18 L19 18"
      stroke={color}
      strokeWidth={strokeWidth + 1}
      strokeLinecap="round"
      opacity={0.5}
    />
    <Circle cx="12" cy="14" r="4" stroke={color} strokeWidth={strokeWidth} fill={color} fillOpacity={0.2} />
    <Path
      d="M8 6 L12 10 L16 6"
      stroke={color}
      strokeWidth={strokeWidth + 1}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// LEGATO: Flowing connection
export const LegatoIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.text, strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 16 L19 16"
      stroke={color}
      strokeWidth={strokeWidth + 1}
      strokeLinecap="round"
      opacity={0.5}
    />
    <Circle cx="6" cy="12" r="2" fill={color} />
    <Path
      d="M8 12 Q 12 6 16 12"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      fill="none"
    />
    <Circle cx="12" cy="9" r="2" fill={color} fillOpacity={0.6} />
    <Circle cx="18" cy="12" r="2" fill={color} fillOpacity={0.3} />
  </Svg>
);

// Icon selector by technique ID
export const getTechniqueIcon = (techniqueId: string, props: IconProps = {}) => {
  const icons: Record<string, React.FC<IconProps>> = {
    'hammer_on': HammerOnIcon,
    'pull_off': PullOffIcon,
    'slide': SlideIcon,
    'bend_half': BendHalfIcon,
    'bend_full': BendFullIcon,
    'vibrato': VibratoIcon,
    'position_shift': PositionShiftIcon,
    'finger_rolling': FingerRollIcon,
    'alternate_picking': AlternatePickingIcon,
    'palm_mute': PalmMuteIcon,
    'accented_picking': AccentIcon,
    'legato': LegatoIcon,
  };
  
  const IconComponent = icons[techniqueId];
  if (!IconComponent) return null;
  
  return <IconComponent {...props} />;
};

// Map solo technique to icon component
export const getSoloTechniqueIcon = (technique: string | undefined, props: IconProps = {}) => {
  if (!technique) return null;
  
  const map: Record<string, string> = {
    'hammer': 'hammer_on',
    'pull': 'pull_off',
    'slide': 'slide',
    'bend': 'bend_full',
    'vibrato': 'vibrato',
  };
  
  const techniqueId = map[technique];
  return techniqueId ? getTechniqueIcon(techniqueId, props) : null;
};
