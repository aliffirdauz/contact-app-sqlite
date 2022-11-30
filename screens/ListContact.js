import { useState, useEffect, useCallback } from "react";
import {
    Image,
    RefreshControl,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import * as SQLite from "expo-sqlite";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from '@react-navigation/native';

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

export default function ListContact() {
    const navigation = useNavigation();
    const [items, setItems] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    const sendData = (id) => {
        db.transaction((tx) => {
            tx.executeSql(
                `select * from user where id = ?;`,
                [id],
                (_, { rows: { _array } }) => navigation.navigate("Detail Contact", { items: _array })
            );
        });
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
        db.transaction((tx) => {
            tx.executeSql(
                `select * from user;`,
                [],
                (_, { rows: { _array } }) => setItems(_array)
            );
        });
    }, []);

    const del = (id) => {
        db.transaction(
            (tx) => {
                tx.executeSql(`delete from user where id = ?;`, [id]);
            },
            null,
            onRefresh
        );
    }

    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql(
                "create table if not exists user (id integer primary key not null, value name, value2 text);"
            );
        });
    }, []);

    useFocusEffect(
        useCallback(() => {
            db.transaction((tx) => {
                tx.executeSql(
                    `select * from user;`,
                    [],
                    (_, { rows: { _array } }) => setItems(_array)
                );
            });
        }, [])
    );

    return (
        <View style={styles.container}>
            {Platform.OS === "web" ? (
                <View
                    style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
                >
                    <Text style={styles.heading}>
                        Expo SQlite is not supported on web!
                    </Text>
                </View>
            ) : (
                <>
                    <View style={styles.sectionContainer}>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate("Add Contact");
                            }}
                            style={[styles.button, { marginTop: 15 }]}
                        >
                            <Text style={styles.buttonText}>Add Contact</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={styles.listArea} refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }>
                        {items ? (
                            <View style={styles.sectionContainer}>
                                {items.map(({ id, value, value2 }) => (
                                    <TouchableOpacity
                                        onPress={() => {
                                            sendData(id);
                                        }}
                                    >
                                        <View style={styles.container}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/64/64572.png' }} style={styles.photo} />
                                                <View style={styles.container_text}>
                                                    <Text style={styles.title}>
                                                        {value}
                                                    </Text>
                                                    <Text style={styles.description}>
                                                        {value2}
                                                    </Text>
                                                </View>
                                                <TouchableOpacity onPress={() => { del(id) }}>
                                                    <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/9068/9068660.png' }} style={styles.photo} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ) : (
                            <View style={styles.sectionContainer}>
                                <Text style={styles.sectionHeading}>No Contact</Text>
                            </View>
                        )}
                    </ScrollView>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        marginLeft: 16,
        marginRight: 16,
        marginTop: 8,
        marginBottom: 8,
        borderRadius: 5,
        backgroundColor: '#bcbdf1',
        elevation: 2,
    },
    heading: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
    },
    flexRow: {
        flexDirection: "row",
    },
    input: {
        borderColor: "#4630eb",
        borderRadius: 4,
        borderWidth: 1,
        flex: 1,
        height: 48,
        margin: 16,
        padding: 8,
    },
    listArea: {
        backgroundColor: "#F1BCD8",
        flex: 1,
        paddingTop: 16,
    },
    sectionContainer: {
        marginBottom: 16,
        marginHorizontal: 16,
    },
    sectionHeading: {
        fontSize: 36,
        marginBottom: 8,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
    },
    button: {
        backgroundColor: '#F1F0BC',
        height: 48,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'black',
        fontWeight: '700',
        fontSize: 16,
    },
    title: {
        fontSize: 32,
        color: '#000',
    },
    container_text: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: 12,
        justifyContent: 'center',
    },
    description: {
        fontSize: 24,
        fontStyle: 'italic',
    },
    photo: {
        justifyContent: "center",
        alignSelf: "center",
        height: 70,
        width: 70,
    },
});