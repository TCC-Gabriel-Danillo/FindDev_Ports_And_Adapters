import { useState } from 'react';
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
    const { signInWithGithub } = useAuth()
    const { addUser } = useUserService()
    const position = useLocation()
    

    const handleButtonPress = async () => {
      setIsLoading(true);

      await signInWithGithub().then(async (userCredentials) => {
        const isUserAdded  = await addUser(userCredentials, position)
        if(isUserAdded) navigation.navigate(NavigationPages.map)
      }).catch((e)=>{
        console.error(e);
      })

      setIsLoading(false);
    }

  return(
    <View style={styles.container}>
        <Text fontType='h1' fontWeight='bold'>Bem Vindo ao FindDev!</Text>
        <Text fontType='h2' style={styles.subtitle}>Encontre incríveis desenvolvedores próximos a você.</Text>
       
        <Image source={devImg} style={{width: 300, height: 300, resizeMode: "contain"}} />
        
        <Button onPress={handleButtonPress} style={styles.button}>  
          {isLoading ? <ActivityIndicator color={WHITE}/> : "Entrar com Github"}
        </Button>
    </View>
  )
}

export default InitialPage;