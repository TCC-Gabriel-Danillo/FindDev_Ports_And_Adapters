import { geohashQueryBounds } from "geofire-common";
import { ListUserParams, Position, User } from "@domain/entities";
import { useEffect, useState } from "react";

const RADIUS_IN_METERS = 10000

type useFilterUsersType = {
  position?: Position,
  callback: (listUserParams: ListUserParams) => Promise<User[]>
}

export const useFilterUsers = ({position, callback}: useFilterUsersType) => {
  
  const [users, setUsers] = useState<User[]>([])
  
  useEffect(() => {
    let listUserParams: ListUserParams;

    if(position) {
      const {start, end} = getGeohashes(position);
      listUserParams = { start, end, type: 'geohash' }
    }    
    
    callback(listUserParams).then(response => {
      setUsers(response)
    })
      
  },[position])

  const getGeohashes = (position: Position) => {
    const {latitude, longitude} = position
    const bounds = geohashQueryBounds([latitude, longitude],RADIUS_IN_METERS)

    const start = bounds[0].join("")
    const end = bounds[1].join("")

    return { start, end };
  }

  return { users };
}