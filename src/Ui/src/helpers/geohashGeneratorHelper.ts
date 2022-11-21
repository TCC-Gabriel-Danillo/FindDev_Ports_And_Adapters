import { Position } from "@domain/entities";
import { geohashForLocation } from "geofire-common";

export const geohashGeneratorHelper = (position: Position) => {
  const {latitude, longitude} = position
  return geohashForLocation([latitude, longitude]);
}
