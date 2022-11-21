import { useCallback } from "react"
import { View } from "react-native"
import "./src/config/firebaseConfig"
import { Routes } from "./src/navigation"
import { AuthContextProvider, LocationContextProvider, UserContextProvider } from "./src/context"
import {UserRepositoryImp, HttpRepositoryImp, AuthRepositoryImp } from "@infrastructure/repositories"
import { UserService, AuthService } from "@domain/services"
import { useCustomFonts } from "./src/hooks"
import * as SplashScreen from 'expo-splash-screen';
import { GITHUB_URL } from "./src/constants"


SplashScreen.preventAutoHideAsync();

export default function App() {
  const [isFontLoaded] = useCustomFonts()

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

  if(!isFontLoaded) return

  return (
    <View
      onLayout={onLayoutRootView}
      style={{flex: 1}}
    >
      <AuthContextProvider
        authService={authService}
      >
        <LocationContextProvider>
          <UserContextProvider
            userService={userService}
            httpRepository={gitApi}
            authService={authService}
          >
            <Routes />
          </UserContextProvider>
        </LocationContextProvider>
      </AuthContextProvider>
    </View>
  );
}

