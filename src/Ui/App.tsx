import { useCallback } from "react"
import { View } from "react-native"
import "./src/config/firebaseConfig"
import { Routes } from "./src/navigation"
import { LocationContextProvider, UserContextProvider } from "./src/context"
import {UserRepositoryImp, HttpRepositoryImp } from "@infrastructure/repositories"
import { UserService } from "@domain/services"
import { useCustomFonts } from "./src/hooks"
import * as SplashScreen from 'expo-splash-screen';
import { geohashGeneratorHelper } from "src/helpers/geohashGeneratorHelper"


SplashScreen.preventAutoHideAsync();

export default function App() {
  const [isFontLoaded] = useCustomFonts()

  const userRepository = new UserRepositoryImp(); 
  const userService = new UserService(userRepository); 
  const httpRepository = new HttpRepositoryImp("https://api.github.com/users"); 


  const onLayoutRootView = useCallback(async () => {
    if (isFontLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [isFontLoaded]);

  if(!isFontLoaded) return

  return (
    <View
      onLayout={onLayoutRootView}
      style={{flex: 1}}
    >
      <LocationContextProvider>
      <UserContextProvider
        userService={userService}
        httpRepository={httpRepository}
        geohashGenerator={geohashGeneratorHelper}>
        <Routes />
      </UserContextProvider>
      </LocationContextProvider>
    </View>
  );
}

