import React from "react"
import { useCallback } from "react"
import { StatusBar, View } from "react-native"
import "./src/config/firebaseConfig"
import { Routes } from "./src/navigation"
import { AuthContextProvider, LocationContextProvider, UserContextProvider } from "./src/context"
import {UserRepositoryImp, HttpRepositoryImp, AuthRepositoryImp, LocalStorageImp} from "@infrastructure/repositories"
import { geohashGeneratorHelper } from "./src/helpers/geohashGeneratorHelper"
import { UserService, AuthService } from "@domain/services"
import { useAuthRequest, useCustomFonts } from "./src/hooks"
import * as SplashScreen from 'expo-splash-screen';
import { GITHUB_URL, PRIMARY } from "./src/constants"


SplashScreen.preventAutoHideAsync();

export default function App() {
  const [isFontLoaded] = useCustomFonts()

  const localStorage = new LocalStorageImp()
  const userRepository = new UserRepositoryImp(); 
  const authRepository = new AuthRepositoryImp();

  const gitApi = new HttpRepositoryImp(GITHUB_URL.API_BASE_URL); 
  const gitAuth = new HttpRepositoryImp(GITHUB_URL.AUTH_BASE_URL); 

  const userService = new UserService(userRepository); 
  const authService = new AuthService(gitAuth, authRepository);

  const onLayoutRootView = useCallback(async () => {
    if (isFontLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [isFontLoaded]);
  
  const { promptAsync } = useAuthRequest()

  if(!isFontLoaded) return

  return (
    <>
      <StatusBar backgroundColor={PRIMARY}/>
      <View
        onLayout={onLayoutRootView}
        style={{flex: 1}}
      >
        <AuthContextProvider
          authService={authService}
          localStorage={localStorage}
          promptAsync={promptAsync}
        >
          <LocationContextProvider>
            <UserContextProvider
              userService={userService}
              authService={authService}
              localStorage={localStorage}
              githubApi={gitApi}
              geohashGenerator={geohashGeneratorHelper}
            >
              <Routes />
            </UserContextProvider>
          </LocationContextProvider>
        </AuthContextProvider>
      </View>
    </>
  );
}

