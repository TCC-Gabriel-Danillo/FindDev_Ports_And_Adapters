import { Position } from "@domain/entities"
import { createContext } from "react"
import * as Location from 'expo-location';
import { useState, useEffect } from "react";

interface ILocationContext {
    getPositionAsync: () => Promise<Position>
    position: Position
}

export const LocationContext = createContext<ILocationContext>({} as ILocationContext)

interface Props {
    children: JSX.Element
}
export function LocationContextProvider({ children }:Props){
    const [position, setPosistion] = useState<Position>({} as Position)
    
    const getPositionAsync = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return {
            latitude: 0,
            longitude: 0
        };

        const location = await Location.getCurrentPositionAsync({});
        return {
              latitude: location.coords.latitude, 
              longitude: location.coords.longitude
        };
    }

    useEffect(()=>{
        (async()=>{
            const position = await getPositionAsync() as Position;
            setPosistion(position);
        })()
    },[])

    return(
        <LocationContext.Provider value={{getPositionAsync, position }}>
            {children}
        </LocationContext.Provider>
    )
}