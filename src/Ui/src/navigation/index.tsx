import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { InitialPage, MapPage } from "../pages"
import { NavigationPages } from "./config"
const Stack = createNativeStackNavigator()

export function Routes(){
    return(
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name={NavigationPages.inital} component={InitialPage} />
                <Stack.Screen name={NavigationPages.map} component={MapPage}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}