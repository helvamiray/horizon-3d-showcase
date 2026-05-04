import * as THREE from "three";

export const GRID_UNIT = 0.5;

export const snapToGrid = (value: number) => Math.round(value / GRID_UNIT) * GRID_UNIT;

export const v3 = (x: number, y: number, z: number) =>
  new THREE.Vector3(snapToGrid(x), snapToGrid(y), snapToGrid(z));

export const SCENE_POSITIONS = {
  FLOOR_Y: 0,
  CEILING_Y: 6,
  FIRST_FLOOR_Y: 0,
  SECOND_FLOOR_Y: 3,
  WALL_HEIGHT: 3,
  WALL_WIDTH: 6,
  WALL_DEPTH: 4,
  CAMERA_DEFAULT_POSITION: v3(8, 6, 10),
  CAMERA_DEFAULT_LOOK_AT: v3(0, 2.5, 0),
  SALON: { x: [-3, 0] as const, z: [-2, 2] as const },
  BEDROOM_1: { x: [0, 3] as const, z: [-2, 0] as const },
  BEDROOM_2: { x: [0, 3] as const, z: [0, 2] as const },
  MECHANICAL_ROOM: { x: [1, 3] as const, z: [-2, 2] as const },
  AC_UNIT_SALON: v3(-1.5, 4.5, 2),
  AC_UNIT_BEDROOM_1: v3(1.5, 4.5, 2),
  AC_UNIT_BEDROOM_2: v3(0, 4.5, -2),
  BOILER: v3(2, 1.5, -1.5),
  HEATPUMP: v3(2, 0.5, 1.5),
  FIRE_SYSTEM: v3(2, 0, 0.5),
  TANK: v3(1, 1, -1),
  PUMP: v3(1.5, 0.5, -0.5),
  MANIFOLD: v3(0.5, 0.5, -1.5),
  UNDERFLOOR_START_X: -2.5,
  UNDERFLOOR_END_X: 2.5,
  UNDERFLOOR_STEP: 0.5,
  UNDERFLOOR_Y: 0,
  RADIATOR_POSITIONS: [v3(-2.5, 4.5, 2), v3(2.5, 4.5, 2), v3(0, 4.5, -2)],
  KITBASH: v3(1, 1, -2),
} as const;

export const BLUEPRINT_COLOR = 0x00d4ff;
