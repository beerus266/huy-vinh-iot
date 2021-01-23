import pyttsx3
import speech_recognition
import paho.mqtt.client as paho
from playsound import playsound
from datetime import date, datetime
import time

robot_ear = speech_recognition.Recognizer()
robot_mouth = pyttsx3.init()
robot_brain = ""
you = ""
robot_mouth.setProperty('rate', 150)     # setting up new voice rate
voices = robot_mouth.getProperty('voices')       #getting details of current voice
robot_mouth.setProperty('voice', voices[1].id)   #changing index, changes voices. 1 for female

def analyzeAndAnswer(mySpeech):
    robot_mouth.say("yes sir.")
    robot_mouth.runAndWait()
    with speech_recognition.Microphone() as mic:
        audio = robot_ear.listen(mic)
    try:
        you = robot_ear.recognize_google(audio)
    except:
        you = "I don't understand what you speak. Please try again"
        print("--Beerus-- : I don't understand what you speak. Please try again ..")

    print("--You--    : "+mySpeech)
    print(you)
    if "hello" in you:
        robot_brain = "Hello Hai"
    elif you == "what is your name":
        robot_brain = " I 'm Beerus. I am your Assistent"+"\n"
    elif "today" in you:
        today = date.today()
        robot_brain = today.strftime("%B %d, %Y"+"\n")
    elif "time" in you:
        now = datetime.now()
        robot_brain = now.strftime(" %H hour %M minute %S second"+"\n")
    elif "music" in you:
        robot_brain = "Wait a second. I am playing a music"
        robot_mouth.say(robot_brain)
        robot_mouth.runAndWait()
        playsound('NiuDuyen.mp3')
    elif "lamp" in you:
        if "on" in you:
            client.publish("HuyVinhIOTTopic","lamp=on")
        elif "off" in you:
            client.publish("HuyVinhIOTTopic","lamp=off")
        robot_brain = "Controlling your home. "+ you
    elif "door" in you:
        if "open" in you:
            client.publish("HuyVinhIOTTopic","door=open")
        elif "close" in you:
            client.publish("HuyVinhIOTTopic","door=close")
        robot_brain = "Controlling your home. "+ you
    elif "bye" in you:
        robot_brain = "Goodbye. I love you. See you again."
        print("--Beerus-- : "+robot_brain+"\n")
        robot_mouth.say(robot_brain)
        robot_mouth.runAndWait()
    else:
        return

    print("--Beerus-- : "+robot_brain)

        #Answer in sound
    robot_mouth.say(robot_brain)
    robot_mouth.runAndWait()


def on_connect(client, userdata, flags, rc):  # The callback for when the client connects to the broker
    print("Connected with result code {0}".format(str(rc)))  # Print result of connection attempt
    client.subscribe("HuyVinhIOTTopic")  # Subscribe to the topic “digitest/test1”, receive any messages published on it

def on_message(client, userdata, message):
    time.sleep(0.5)
    print("received message :",str(message.payload.decode("utf-8")))
    if str(message.payload.decode("utf-8")) == "music=on":
        playsound('NiuDuyen.mp3')

client= paho.Client("Mr.Huy-Mr.Vinh") #create client object client1.on_publish = on_publish #assign function to callback client1.connect(broker,port) #establish connection client1.publish("house/bulb1","on")
client.on_connect=on_connect
client.on_message=on_message

print("connecting to broker ")
client.connect("broker.hivemq.com", 1883, 60)#connect
client.loop_start() #start loop to process received messages
# client.loop_forever()

while True:
    # Connect to Mic of Computer and Listen
    with speech_recognition.Microphone() as mic:
        print("\n...................................... ")
        audio = robot_ear.listen(mic)
    try:
        you = robot_ear.recognize_google(audio)
    except:
        you = 'I donnot understand what you speak. Please try again'
        print("--Beerus-- : I don't understand what you speak. Please try again ..")

    print("--You--    : "+you)

    # Analyze and Answer
    if "hey" in you or "Siri" in you:
        analyzeAndAnswer(you)
        # if "hello" in you:
        #     robot_brain = "Hello Hai"
        # elif you == "what is your name":
        #     robot_brain = " I 'm Beerus. I am your Assistent"+"\n"
        # elif "today" in you:
        #     today = date.today()
        #     robot_brain = today.strftime("%B %d, %Y"+"\n")
        # elif "time" in you:
        #     now = datetime.now()
        #     robot_brain = now.strftime(" %H hour %M minute %S second"+"\n")
        # elif "music" in you:
        #     robot_brain = "Wait a second. I am playing a music"
        #     robot_mouth.say(robot_brain)
        #     robot_mouth.runAndWait()
        #     playsound('NiuDuyen.mp3')
        # elif "lamp" in you:
        #     if "on" in you:
        #         client.publish("HuyVinhIOTTopic","lamp=on")
        #     elif "off" in you:
        #         client.publish("HuyVinhIOTTopic","lamp=off")
        #     robot_brain = "Controlling your home. "+ you
        # elif "door" in you:
        #     if "open" in you:
        #         client.publish("HuyVinhIOTTopic","door=open")
        #     elif "close" in you:
        #         client.publish("HuyVinhIOTTopic","door=close")
        #     robot_brain = "Controlling your home. "+ you
        # elif "bye" in you:
        #     robot_brain = "Goodbye"
        #     print("--Beerus-- : "+robot_brain+"\n")
        #     robot_mouth.say(robot_brain)
        #     robot_mouth.runAndWait()
        #     break
        # # else:
        # #     robot_brain = "publishing :"+you

        # print("--Beerus-- : "+robot_brain)

        # # print("publishing :"+you)
        # client.publish("HuyVinhIOTTopic",you)#publish

        # #Answer in sound
        # robot_mouth.say(robot_brain)
        # robot_mouth.runAndWait()