#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <Servo.h>
#include <FirebaseArduino.h>
#include <ArduinoJson.h>


// Update these with values suitable for your network.

#define FIREBASE_HOST "huyvinhprojectiot-default-rtdb.firebaseio.com" //--> URL address of your Firebase Realtime Database. without http:// or https://  https://iot-smartagriculture-project3-default-rtdb.firebaseio.com/
#define FIREBASE_AUTH "IqYubyjysd5P8ccRp9bGeg5HNqYlaJCcUB623NGE" //--> Your firebase database secret code. Setting -> Service accounts -> Database secrets 
const char* ssid = "Doanh";
const char* password = "doanh2007";
const char* mqtt_server = "broker.mqtt-dashboard.com";

WiFiClient espClient;
PubSubClient client(espClient);
Servo myServo;
unsigned long lastMsg = 0;
#define MSG_BUFFER_SIZE  (50)
char msg[MSG_BUFFER_SIZE];
int value = 0;

int cambienvatcanPin = 16; // GPIO16 D0  === Cam bien vat can E18-D80NK
int buzzer = 15; //    D8 == Buzzer 
int redLed = 12; //    D6 ==  redLed
int greenLed = 0; //    SSD3 ==  greenLed
int servoPin = 5; //    D1 == Servo 
int relayPin = 4; // D2 === relay control Lamp
int RPin = A0; // bien tro

void setup_wifi() {

  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  randomSeed(micros());

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
}

void callback(char* topic, byte* payload, unsigned int length) {
   String command = "";
  String stt ;
  String  a ;
  Serial.print(" Message arrived ["); // \a phat ra tieng keu
  Serial.print(topic);
  Serial.print("]:  ");
  for (int i = 0; i < length; i++) {
    command += (char)payload[i];
  }
  Serial.println(command);

  if ( strstr( command.c_str(),"lamp") != NULL ){
    stt = strchr(command.c_str(), '=');
    if ( stt == "=on"){                                                            // Turn ON LED
      digitalWrite(relayPin, HIGH);
    } else if ( stt == "=off"){                                                     // Turn OFF LED
      digitalWrite(relayPin, LOW);
    }
  };
  if ( strstr( command.c_str(),"door") != NULL ){
    stt = strchr(command.c_str(), '=');
    if ( stt == "=open"){                                                            // Turn ON Door
      myServo.write(180);
      digitalWrite(greenLed, HIGH);
    } else if ( stt == "=close"){                                                     // Turn OFF Door
      myServo.write(0);
      digitalWrite(greenLed, LOW);
    }
  };


}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Create a random client ID
    String clientId = "ESP8266Client-";
    clientId += String(random(0xffff), HEX);
    // Attempt to connect
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
      // Once connected, publish an announcement...
//      client.publish("outTopic", "hello world");
      // ... and resubscribe
      client.subscribe("HuyVinhIOTTopic");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void setup() {
  pinMode(BUILTIN_LED, OUTPUT);     // Initialize the BUILTIN_LED pin as an output
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);

  pinMode (cambienvatcanPin, INPUT_PULLUP);
  pinMode (relayPin, OUTPUT);
  pinMode (buzzer, OUTPUT);
  pinMode (redLed, OUTPUT);
  pinMode (greenLed, OUTPUT);
  //----------------------------------------Firebase Realtime Database Configuration.
//  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  //----------------------------------------
  myServo.attach(servoPin);
  myServo.write(0);
}

void loop() {

  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  unsigned long now = millis();
      // ==========identify object==============
      if (digitalRead(cambienvatcanPin)==0){
            Serial.print("vat can:");
            digitalWrite(buzzer,HIGH);
            digitalWrite(redLed,HIGH);
      } else {
            digitalWrite(buzzer,LOW);
            digitalWrite(redLed,LOW);
      }

  if (now - lastMsg > 5000) {
    lastMsg = now;
    
    // doc bien tro
    int valueR = analogRead(RPin);
    int degree ;
    bool statusAlarm = Firebase.getBool("Data/alarm");
    Serial.println(statusAlarm);
  }
//    if (Firebase.failed()) { 
//      Serial.print("Setting /Value failed :");
//      Serial.println(Firebase.error());  
//      delay(500);
//      return;
//    }
}
