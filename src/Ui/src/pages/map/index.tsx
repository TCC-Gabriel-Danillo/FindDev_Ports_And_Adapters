import React, { useState } from 'react';
import MapView, { Marker, Callout } from 'react-native-maps';
import { Image, View } from 'react-native';
import { useLocation, useUserService, useFilterUsers, useAuth } from '../../hooks';
import { Button, Text } from '../../components';
import makerImg from "../../../assets/marker.png"
import { styles } from "./styles"
import { Position, User } from '@domain/entities';
import * as Linking from 'expo-linking';
import { useNavigation } from '@react-navigation/native';
import { NavigationPages } from '../../navigation/config';
import Ionicons from '@expo/vector-icons/Ionicons';
import { WHITE } from '../../constants';

export const MAP_TEST_ID = 'MAP_TEST_ID'
export const MARKER_TEST_ID = 'MARKER_TEST_ID'
export const LOGOUT_BUTTON_TEST_ID = 'BUTTON_TEST_ID'
export const CALLOUT_TEST_ID = 'CALLOUT_TEST_ID'

export default function Map() {
  const [ mapPosition, setMapPosition ] = useState<Position | undefined>(undefined)

  const { navigate } = useNavigation()
  const { position } = useLocation()
  const { listUsers } = useUserService()
  const { signOut } = useAuth()

  const { users } = useFilterUsers({position: mapPosition || position, callback: listUsers})
  
  const handleCalloutPress = async (user: User) => {
     await Linking.openURL(user.profileUrl);
  }

  const signOutUser = () => {
    signOut();
    navigate(NavigationPages.inital)
  }

  return (
    <View style={styles.container}>
      <MapView style={styles.map}
        testID={MAP_TEST_ID}
        onRegionChangeComplete={(e:Position) => {
          const {latitude, longitude} = e
          setMapPosition({latitude, longitude})
        }}
        initialRegion={{
          latitude: Number(position?.latitude), 
          longitude: Number(position?.longitude), 
          latitudeDelta: 0.05, 
          longitudeDelta: 0.05,
        }}
        maxZoomLevel={14}
        minZoomLevel={3.5}
      >
        {
          users.map(user => {
            return(
              <Marker 
                testID={`${MARKER_TEST_ID}_${user.id}`}
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
                      <Image source={{uri: user.photoUrl}} style={styles.imageMarker}/>
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
      <Button onPress={signOutUser} style={styles.logoutButton} testID={LOGOUT_BUTTON_TEST_ID}>
        <Ionicons name="md-log-out" size={32} color={WHITE} />
      </Button>
    </View>
  );
}

