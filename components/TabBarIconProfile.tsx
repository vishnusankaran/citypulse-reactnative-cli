import React from 'react';
import {Image} from 'react-native';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons';

const TabBarIconProfile = ({size, color}: {size: number; color: string}) => {
  const user = auth().currentUser;
  if (user?.photoURL) {
    return (
      <Image
        source={{uri: user.photoURL}}
        style={{width: size, height: size, borderRadius: size / 2}}
      />
    );
  }
  return <Icon name="user" size={size} color={color} />;
};

export default TabBarIconProfile;
