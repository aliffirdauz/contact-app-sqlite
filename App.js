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
        <Stack.Screen name="Contact List" component={ListContact} />
        <Stack.Screen name="Add Contact" component={AddContact} />
        <Stack.Screen name="Detail Contact" component={DetailContact} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}