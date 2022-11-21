import { useState, useEffect } from 'react';
import { View, Image, ActivityIndicator } from 'react-native';
import { useUserService, useLocation, useAuth } from '../../hooks';
import { Text, Button } from "../../components"
import devImg from "../../../assets/dev.png"
import { styles } from './style';
import { WHITE } from '../../constants';
import { useNavigation } from '@react-navigation/native';
import { NavigationPages } from '../../navigation/config';

const InitialPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false); 

    const navigation = useNavigation()
    const { signInWithGithub, isUserAuthenticated, user } = useAuth()
    const { createUser, updateUser } = useUserService()
    const position = useLocation()
    
    useEffect(()=>{
      const isPositionVoid = !!Object.keys(position).length;
      if(isUserAuthenticated && isPositionVoid) {
        setIsLoading(true);
        updateUser({...user, position}).then(()=>{
          navigation.navigate(NavigationPages.map)
          setIsLoading(false);
        })
      }

    }, [isUserAuthenticated, position])

    const signIn = async () => {
      setIsLoading(true);
      
      if(!isUserAuthenticated) {
        await signInWithGithub().then(async (userCredentials) => {
          const isUserAdded  = await createUser(userCredentials, position)
          if(isUserAdded) navigation.navigate(NavigationPages.map)
        }).catch((e)=>{
          console.error(e);
        })
      }

      setIsLoading(false);
    }

  return(
    <View style={styles.container}>
        <Text fontType='h1' fontWeight='bold'>Bem Vindo ao FindDev!</Text>
        <Text fontType='h2' style={styles.subtitle}>Encontre incríveis desenvolvedores próximos a você.</Text>
       
        <Image source={devImg} style={{width: 300, height: 300, resizeMode: "contain"}} />
        
        <Button onPress={signIn} style={styles.button}>  
          {isLoading ? <ActivityIndicator color={WHITE}/> : "Entrar com Github"}
        </Button>
    </View>
  )
}

export default InitialPage;