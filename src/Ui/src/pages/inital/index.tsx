import { useState } from 'react';
import { View, Image, ActivityIndicator, Alert } from 'react-native';
import { useUserService, useLocation } from '../../hooks';
import { Text, Input, Button } from "../../components"
import devImg from "../../../assets/dev.png"
import { styles } from './style';
import { WHITE } from '../../constants';
import { useNavigation } from '@react-navigation/native';
import { NavigationPages } from '../../navigation/config';

const InitialPage: React.FC = () => {
    const navigation = useNavigation()
    const { addUser, isLoading, getUser, updateUser } = useUserService()
    const position = useLocation()
    const [username, setUsername] = useState(''); 
    
    const handleButtonPress = async () => {
      let successfulRequest = false;
      const isUserExist = await getUser(username);
      
      if (isUserExist){
        successfulRequest = await updateUser(username, position);
      } else {
        successfulRequest = await addUser(username, position);
      }
  
      if (successfulRequest) navigation.navigate(NavigationPages.map);
    };

  return(
    <View style={styles.container}>
        <Text fontType='h1' fontWeight='bold'>Bem Vindo ao FindDev!</Text>
        <Text fontType='h2' style={styles.subtitle}>Encontre incríveis desenvolvedores próximos a você.</Text>
       
        <Image source={devImg} style={{width: 300, height: 300, resizeMode: "contain"}} />
        
        <Input onChange={(value) => setUsername(value)} placeholder='Seu Usuário no Github'/>
        <Button onPress={handleButtonPress} style={styles.button}>  
          {isLoading ? <ActivityIndicator color={WHITE}/> : "Entrar"}
        </Button>
    </View>
  )
}

export default InitialPage;