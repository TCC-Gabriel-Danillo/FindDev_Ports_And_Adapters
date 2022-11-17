import { useCallback } from "react"
import { View } from "react-native"
import "./src/config/firebaseConfig"
import { Routes } from "./src/navigation"
import { AuthContextProvider, LocationContextProvider, UserContextProvider } from "./src/context"
import {UserRepositoryImp, HttpRepositoryImp } from "@infrastructure/repositories"
import { UserService } from "@domain/services"
import { useCustomFonts } from "./src/hooks"
import * as SplashScreen from 'expo-splash-screen';


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
      <AuthContextProvider>
        <LocationContextProvider>
          <UserContextProvider
            userService={userService}
            httpRepository={httpRepository}>
            <Routes />
          </UserContextProvider>
        </LocationContextProvider>
      </AuthContextProvider>
    </View>
  );
}

