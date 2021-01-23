/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  ClippingRectangle,
  Button,
  TouchableOpacity,
  Switch
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import MQTT from 'sp-react-native-mqtt';
import firebase from 'firebase';
import SwitchButton from './Components/SwitchButton'

var firebaseConfig = {
	apiKey: "AIzaSyB6FRzPcb7eczivkMCTD2EZcwwtZGY1ueE",
    authDomain: "huyvinhprojectiot.firebaseapp.com",
    databaseURL: "https://huyvinhprojectiot-default-rtdb.firebaseio.com",
    projectId: "huyvinhprojectiot",
    storageBucket: "huyvinhprojectiot.appspot.com",
    messagingSenderId: "493684307509",
    appId: "1:493684307509:web:d7b768e96878025dbf237c",
    measurementId: "G-3327FSG66Y"
};

var globalClient;

const App: () => React$Node = () => {

    const [turnedOnLamp,setTurnedOnLamp]=useState(true);
	const [textButtonLamp,setTextButtonLamp]=useState('Bật đèn');
	const [turnedOnMusic,setTurnedOnMusic]=useState(true);
	const [textButtonMusic,setTextButtonMusic]=useState('Bật nhạc');
	const [openedTheDoor,setOpenedTheDoor]=useState(true);
    const [textButtonDoor,setTextButtonDoor]=useState('Mở cửa');

  useEffect( () => {

    // =======MQTT Broker==========
    MQTT.createClient({
      uri: 'mqtt://broker.hivemq.com:1883',
      clientId: 'c1152957-3dbc-4de1-8575-16b83f56dec3'
    }).then(function(client) {

      globalClient = client;
     
      client.on('closed', function() {
        console.log('mqtt.event.closed');
      });
     
      client.on('error', function(msg) {
        console.log('mqtt.event.error', msg);
      });
     
      client.on('message', function(msg) {
        console.log('mqtt.event.message', msg);
      });
     
      client.on('connect', function() {
        console.log('connected');
        // client.subscribe('HuyVinhIOTTopic', 0);
        // client.publish('HuyVinhIOTTopic', "test", 0, false);
      });
     
      client.connect();
    }).catch(function(err){
      console.log(err);
    });
    //===================================================================================

    // =======FireBase=============

   

    if (!firebase.apps.length) {
      console.log("Init");
      firebase.initializeApp(firebaseConfig);
    }else {
      console.log("App()");
      firebase.app(); // if already initialized, use that one
    }

    database = firebase.database();
    // database.ref('Data').limitToLast(1).once('value', (data) => {
    //   // console.log("Once");
    //   // console.log(data.val());
    //   let dbs=data.val();
    //   let realData= dbs[Object.keys(dbs)[0]];
    //   // console.log(x);
    //   // console.log(data.val()[0]["Humi"]);
    //   setHumi(realData["Humi"]);
    //   setHumiOS(realData["HumiOS"]);
    //   setTemp(realData["Temp"]);
    // })

    // .then( (snapshot) => {
    //   console.log("snapshot");
    //   console.log(snapshot);
    // });

        // Get data when it have changed
    // database.ref('Data').limitToLast(1).on('value', (data) => {
    //       console.log("change");
    //       console.log(data.toJSON());
    //       // console.log(data.val());
    // });
    //===================================================================================

    getDataFireBaseChange();
  },[]);

  	const getDataFireBaseChange = () => {
            // Get data when it have changed
    firebase.database().ref('Data').on('value', (data) => {
              console.log("change");
              console.log(data.toJSON());
        });
  	}
	const buttonLampClickedHandler = () => {
		firebase.database().ref('Data').update({
			lamp: turnedOnLamp,
		});
		setTurnedOnLamp(!turnedOnLamp);
		if (turnedOnLamp){
			setTextButtonLamp('Tắt đèn');
			globalClient.publish('HuyVinhIOTTopic', "lamp=on", 0, false);
		} else {
			setTextButtonLamp('Bật đèn');
			globalClient.publish('HuyVinhIOTTopic', "lamp=off", 0, false);
		}
	};
	const buttonMusicClickedHandler = () => {
		firebase.database().ref('Data').update({
			music: turnedOnMusic,
		});
		setTurnedOnMusic(!turnedOnMusic);
		if (turnedOnMusic){
			setTextButtonMusic('Tắt nhạc');
			globalClient.publish('HuyVinhIOTTopic', "music=on", 0, false);
		} else {
			setTextButtonMusic('Bật nhạc');
			globalClient.publish('HuyVinhIOTTopic', "music=off", 0, false);
		}
	};
	const buttonDoorClickedHandler = () => {
		firebase.database().ref('Data').update({
			door: openedTheDoor,
		});
		setOpenedTheDoor(!openedTheDoor);
		if (openedTheDoor){
			setTextButtonDoor('Đóng cửa');
			globalClient.publish('HuyVinhIOTTopic', "door=open", 0, false);
		} else {
			setTextButtonDoor('Mở cửa');
			globalClient.publish('HuyVinhIOTTopic', "door=close", 0, false);
		}
	};
	const changeStatusAlarm = (val) => {

		let statusAlarm = val == 1 ? true : false;

		firebase.database().ref('Data').update({
			alarm: statusAlarm,
		});
	}

  return (
    <View style={{flex: 1,  flexDirection: 'column',backgroundColor: '#63d5e2'}}>
    	<Text
			style={{
				flex: 1,
				textAlign: 'center',
				fontWeight: 'bold',
				fontSize: 40,
				margin: 30,

			}}>
			Nhà thông minh
    	</Text>
		<View style={{flex: 7}}>
			<View style={styles.viewButton}>
				<TouchableOpacity
					onPress={buttonLampClickedHandler}
					style={styles.roundButton1}>
					<Text style={styles.textInRoundButton}>{textButtonLamp}</Text>
				</TouchableOpacity>
			</View>
			<View style={styles.viewButton}>
				<TouchableOpacity
					onPress={buttonMusicClickedHandler}
					style={styles.roundButton1}>
					<Text style={styles.textInRoundButton}>{textButtonMusic}</Text>
				</TouchableOpacity>
			</View>
			<View style={styles.viewButton}>
				<TouchableOpacity
					onPress={buttonDoorClickedHandler}
					style={styles.roundButton1}>
					<Text style={styles.textInRoundButton}>{textButtonDoor}</Text>
				</TouchableOpacity>
			</View>
			<View style={styles.viewButton}>
				<Text style={styles.textLabel}>Báo động</Text>
				<SwitchButton onValueChange={ (val) => {
					changeStatusAlarm(val);
				}}>
        		</SwitchButton>
			</View>
		</View>

    </View>
  );

};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	viewButton: {
		flex: 1, 
		alignItems: 'center'
	},
	textLabel: {
		marginBottom: 10,
		fontSize:20,
		fontWeight: 'bold',
	},
	textInRoundButton: {
		fontSize:20,
		color: '#e4e6eb',
		fontWeight: 'bold',
	},
	roundButton1: {
		width: 120,
		height: 120,
		textAlign:'center',
		// marginBottom: 40,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 10,
		borderRadius: 100,
		backgroundColor: '#4a4b4d',
	},
});

export default App;
