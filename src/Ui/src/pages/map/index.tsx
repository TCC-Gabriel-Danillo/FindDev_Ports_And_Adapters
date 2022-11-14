import React from 'react';
import MapView, { Marker, Callout } from 'react-native-maps';
import { Image, View } from 'react-native';
import { useLocation, useUserService, useGeohash } from '../../hooks';
import { Text } from '../../components';
import makerImg from "../../../assets/marker.png"
import { styles } from "./styles"
import { User } from '@domain/entities';
import * as Linking from 'expo-linking';


export default function Map() {
  const position = useLocation()
  const { listUsers } = useUserService()
  const {users} = useGeohash({position, callback: listUsers})
  
  const handleCalloutPress = async (user: User) => {
     await Linking.openURL(user.profileUrl);
  }


  return (
    <View style={styles.container}>
      <MapView style={styles.map}
        initialRegion={{
          latitude: position.latitude, 
          longitude: position.longitude, 
          latitudeDelta: 0.05, 
          longitudeDelta: 0.05,
        }}
      >
        {
          users.map(user => {
            return(
              <Marker 
                key={user.id} 
                coordinate={{
                  latitude: user.position.latitude, 
                  longitude: user.position.longitude
                }}
                image={makerImg}
              >

                <Callout onPress={() => handleCalloutPress(user)}>
                  <View style={styles.calloutView}>
                    <View style={styles.calloutImage}>
                      <Image source={{uri: user.phoroUrl}} style={styles.imageMarker}/>
                      <Text fontWeight='bold' style={styles.calloutTitle}>{user.username}</Text>
                    </View>
                    <Text style={styles.calloutContent}>Techs: {user.techs?.join(", ")}</Text>
                    {user.email && <Text style={styles.calloutContent}>Email: {user.email}</Text>}
                  </View>
                </Callout>
              </Marker>
            )
          })
        }
      
      </MapView>
    </View>
  );
}

