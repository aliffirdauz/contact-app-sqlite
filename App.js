import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ListContact from './screens/ListContact'
import AddContact from './screens/AddContact'
import DetailContact from './screens/DetailContact'

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="ListContact" component={ListContact} />
        <Stack.Screen name="AddContact" component={AddContact} />
        <Stack.Screen name="DetailContact" component={DetailContact} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}