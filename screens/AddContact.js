import { useState, useCallback } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as SQLite from "expo-sqlite";
import { useNavigation } from "@react-navigation/native";

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

export default function AddContact() {
  const [name, setName] = useState(null);
  const [number, setNumber] = useState(null);

  const navigation = useNavigation();

  const add = (name, number) => {
    // is text empty?
    if (name === null || name === "") {
      return false;
    }
    if (number === null || number === "") {
      return false;
    }

    db.transaction(
      (tx) => {
        tx.executeSql("insert into user (value, value2) values (?, ?)", [name, number]);
        tx.executeSql("select * from user", [], (_, { rows }) =>
          console.log(JSON.stringify(rows))
        );
      },
      null
    );
    navigation.navigate("Contact List");
  };

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
        <View style={{ backgroundColor: '#BCBDF1', width: '100%', height: '100%' }}>
          <View style={{ flex: 1, alignItems: 'center', marginTop: 20, backgroundColor: '#F1BCD8', margin: 20, borderRadius: 10, justifyContent:'center' }}>
            <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/64/64572.png' }} style={{ margin: 20, width: 200, height: 200 }} />
            <View style={styles.inputContainer}>
              <TextInput
                onChangeText={(text) => setName(text)}
                placeholder="Input Name"
                style={styles.input}
                value={name}
              />
              <TextInput
                keyboardType='numeric'
                onChangeText={(text) => onChanged(text)}
                placeholder="Input Number"
                style={styles.input}
                value={number}
                maxLength={13}
              />
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => {
                  add(name, number);
                  setName(null);
                  setNumber(null);
                  console.log(name);
                  console.log(number);
                }}
                style={[styles.button, { width: 100, marginTop: 20 }]}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

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