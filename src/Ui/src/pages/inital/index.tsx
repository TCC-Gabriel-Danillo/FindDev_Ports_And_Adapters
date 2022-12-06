import React, { useState, useEffect } from 'react';
import { View, Image, ActivityIndicator } from 'react-native';
import { useUserService, useLocation, useAuth } from '../../hooks';
import { Text, Button } from "../../components"
import devImg from "../../../assets/dev.png"
import { styles } from './style';
import { WHITE } from '../../constants';
import { useNavigation } from '@react-navigation/native';
import { NavigationPages } from '../../navigation/config';

export const BUTTON_TEST_ID = 'GITHUB_BUTTON_TEST_ID'

const InitialPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false); 

    const { navigate } = useNavigation()
    const { signInWithGithub, isUserAuthenticated, user } = useAuth()
    const { createUser, updateUser } = useUserService()
    const { getPositionAsync } = useLocation()
    
    useEffect(()=>{
      (async () => {
        const position = await getPositionAsync()
        if(isUserAuthenticated && position && user) {
          setIsLoading(true);
          updateUser({...user, position}).then(()=>{
            navigate(NavigationPages.map, { position })
            setIsLoading(false);
          })
        }
      })()

    }, [isUserAuthenticated])

    const signIn = async () => {
      setIsLoading(true);
      
      if(!isUserAuthenticated) {
        const userCredentials = await signInWithGithub();
        const position = await getPositionAsync()
        const isUserAdded  = await createUser(userCredentials, position);
        if(isUserAdded) navigate(NavigationPages.map)
      }

      setIsLoading(false);
    }

  return(
    <View style={styles.container}>
        <Text fontType='h1' fontWeight='bold'>Bem Vindo ao FindDev!</Text>
        <Text fontType='h2' style={styles.subtitle}>Encontre incríveis desenvolvedores próximos a você.</Text>
       
        <Image source={devImg} style={{width: 300, height: 300, resizeMode: "contain"}} />
        
        <Button onPress={signIn} style={styles.button} testID={BUTTON_TEST_ID} disabled={isUserAuthenticated}>  
          {isLoading ? <ActivityIndicator color={WHITE}/> : "Entrar com Github"}
        </Button>
    </View>
  )
}

export default InitialPage;