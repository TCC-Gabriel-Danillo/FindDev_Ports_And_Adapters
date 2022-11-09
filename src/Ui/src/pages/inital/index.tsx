import { useState } from 'react';
import { View, Image, ActivityIndicator} from 'react-native';
import { useUserService, useLocation } from '../../hooks';
import { Text, Input, Button, CONST } from "dev-ui"
import devImg from "../../../assets/dev.png"
import { styles } from './style';
import { useNavigation } from '@react-navigation/native';
import { NavigationPages } from '../../navigation/config';

const InitialPage: React.FC = () => {
    const navigation = useNavigation()
    const { addUser, isLoading } = useUserService()
    const position = useLocation()
    const [username, setUsername] = useState(''); 
    
    const handleButtonPress = async () => {
        const isUserAdded  = await addUser(username, position)
        if(isUserAdded) navigation.navigate(NavigationPages.map)
    }

  return(
    <View style={styles.container}>
        <Text fontType='h1' fontWeight='bold'>Bem Vindo ao FindDev!</Text>
        <Text fontType='h2' style={styles.subtitle}>Encontre incríveis desenvolvedores próximos a você.</Text>
       
        <Image source={devImg} style={{width: 300, height: 300, resizeMode: "contain"}} />
        
        <Input onChange={(value) => setUsername(value)} placeholder='Seu Usuário no Github'/>
        <Button onPress={handleButtonPress} style={styles.button}>  
          {isLoading ? <ActivityIndicator color={CONST.WHITE}/> : "Entrar"}
        </Button>
    </View>
  )
}

export default InitialPage;