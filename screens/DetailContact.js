import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import * as SQLite from "expo-sqlite";
import { useNavigation } from '@react-navigation/native';

function openDatabase() {
    if (Platform.OS === "web") {
        return {
            transaction: () => {
                return {
                    executeSql: () => { },
                };
            },
        };
    }

    const db = SQLite.openDatabase("contact.db");
    return db;
}

const db = openDatabase();

const DetailContact = ({ route }) => {
    const [name, setName] = useState(null)
    const [number, setNumber] = useState(null)
    const { items } = route.params
    const [refreshing, setRefreshing] = useState(false);
    
    const navigation = useNavigation();

    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }
    
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);

    const update = (id) => {
        // is text empty?
        if (name === null || name === "") {
            return false;
        }
        if (number === null || number === "") {
            return false;
        }
        db.transaction(
            (tx) => {
                tx.executeSql(`update user set value = ?, value2 = ? where id = ?;`, [name, number, id]);
            },
            null,
            onRefresh
        );
        navigation.navigate("ListContact");
    }

    useEffect(() => {
        console.log(JSON.stringify(route.params.items))
    }, [])

    return (
        <ScrollView style={{ backgroundColor: 'f2f2f2' }}>
            <View style={{ flex: 1, alignItems: 'center', marginTop: 20, backgroundColor: 'white', margin: 20, borderRadius: 10, minHeight: 550 }}>
                <Text style={styles.title}>Detail Contact</Text>
                <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/64/64572.png' }} style={{ margin: 20, width: 200, height: 200 }} />
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Input Name"
                        defaultValue={items[0].value}
                        onChangeText={text => setName(text)}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Input Number"
                        defaultValue={items[0].value2}
                        onChangeText={text => setNumber(text)}
                        style={styles.input}
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={() => {
                            update(items[0].id)
                        }}
                        style={[styles.button, { width: 100, marginTop: 20 }]}
                    >
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

export default DetailContact

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        width: '80%'
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
        borderColor: 'lightgray',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',

    },
    buttonContainer: {
        width: '30%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
        flexDirection: 'row',
    },
    button: {
        backgroundColor: '#0782F9',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        marginRight: 10,
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonimage: {
        backgroundColor: '#0782F9',
        width: '100%',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
        borderColor: 'lightgray',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    title: {
        marginTop: 20,
        fontSize: 38,
        textAlign: 'center',
        fontWeight: '700',
    },
})