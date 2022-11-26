import { Position } from "@domain/entities"
import { createContext, useState, useEffect } from "react"
import * as Location from 'expo-location';


export const LocationContext = createContext<Position>({} as Position)

interface Props {
    children: JSX.Element
}
export function LocationContextProvider({ children }:Props){
    const [position, setPosition] = useState<Position>({} as Position)

    useEffect(() => {
        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') return;

          const location = await Location.getCurrentPositionAsync({});
          setPosition({
                latitude: location.coords.latitude, 
                longitude: location.coords.longitude
            });
        })();
      }, []);

    return(
        <LocationContext.Provider value={position}>
            {children}
        </LocationContext.Provider>
    )
}