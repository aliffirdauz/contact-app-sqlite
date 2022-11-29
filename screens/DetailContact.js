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
        if ((name === null || name === "") && (number === null || number === "")) {
            return false;
        }
        if (name === null || name === "") {
            db.transaction(
                (tx) => {
                    tx.executeSql(`update user set value = ?, value2 = ? where id = ?;`, [items[0].value, number, id]);
                },
                null,
                onRefresh
            );
            navigation.navigate("Contact List");
        } else if (number === null || number === "") {
            db.transaction(
                (tx) => {
                    tx.executeSql(`update user set value = ?, value2 = ? where id = ?;`, [name, items[0].value2, id]);
                },
                null,
                onRefresh
            );
            navigation.navigate("Contact List");
        } else {
            db.transaction(
                (tx) => {
                    tx.executeSql(`update user set value = ?, value2 = ? where id = ?;`, [name, number, id]);
                },
                null,
                onRefresh
            );
            navigation.navigate("Contact List");
        }
    }

    const onChanged = (text) => {
        let newText = '';
        let numbers = '0123456789';

        for (var i = 0; i < text.length; i++) {
            if (numbers.indexOf(text[i]) > -1) {
                newText = newText + text[i];
            }
            else {
                alert("please enter numbers only");
            }
        }
        setNumber(newText);
    }

    useEffect(() => {
        console.log(JSON.stringify(route.params.items))
    }, [])

    return (
        <View style={{ backgroundColor: '#BCBDF1', width: '100%', height: '100%' }}>
            <View style={{ flex: 1, alignItems: 'center', marginTop: 20, backgroundColor: '#F1BCD8', margin: 20, borderRadius: 10, justifyContent:'center' }}>
                <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/64/64572.png' }} style={{ margin: 20, width: 200, height: 200 }} />
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Input Name"
                        defaultValue={items[0].value}
                        onChangeText={text => setName(text)}
                        style={styles.input}
                    />
                    <TextInput
                        keyboardType='numeric'
                        placeholder="Input Number"
                        defaultValue={items[0].value2}
                        onChangeText={text => onChanged(text)}
                        style={styles.input}
                        maxLength={13}
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
        </View>
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
        backgroundColor: '#F1F0BC',
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
        color: 'black',
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