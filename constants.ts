
import type { Step } from './types';
import {
  HardwareIcon,
  SoftwareIcon,
  MicIcon,
  LightIcon,
  BrainIcon,
  VisionIcon,
  RobotIcon
} from './components/Icons';

export const STEPS: Step[] = [
  {
    id: 1,
    title: 'Hardware & Environment Setup',
    icon: HardwareIcon,
    description: `First, ensure your RASPBOT V2 is correctly assembled. Verify all connections for the Raspberry Pi, camera module, microphone, motor driver, and RGB LEDs.
    
Then, set up the software environment on your Raspberry Pi. This involves installing required Python libraries that will power the robot's new abilities.`,
    code: `
# Open a terminal on your Raspberry Pi and run these commands:
# Update package lists
sudo apt-get update && sudo apt-get upgrade -y

# Install core libraries
pip install google-generativeai
pip install opencv-python-headless
pip install SpeechRecognition
pip install PyAudio
pip install RPi.GPIO
`,
  },
  {
    id: 2,
    title: 'Wake Word Detection: "Hey Saras"',
    icon: MicIcon,
    description: `The robot needs to listen for its wake word. We'll create a simple loop using the SpeechRecognition library to continuously listen to the microphone in the background. When "Hey Saras" is detected, it will trigger the command listening mode.`,
    code: `
import speech_recognition as sr

def listen_for_wake_word():
    r = sr.Recognizer()
    with sr.Microphone() as source:
        print("Listening for 'Hey Saras'...")
        r.adjust_for_ambient_noise(source)
        while True:
            try:
                audio = r.listen(source)
                text = r.recognize_google(audio).lower()
                print(f"Heard: {text}")
                if "hey saras" in text or "hi saras" in text:
                    print("Wake word detected!")
                    # Trigger command listening and light animation
                    listen_for_command()
            except sr.UnknownValueError:
                pass # Ignore if speech is not understood
            except sr.RequestError as e:
                print(f"Could not request results; {e}")
`,
  },
    {
    id: 3,
    title: 'RGB Light Indication',
    icon: LightIcon,
    description: `To provide visual feedback, the robot's RGB lights will animate when it hears the wake word. We'll use the RPi.GPIO library to control the LEDs and cycle through Google-like colors (blue, red, yellow, green) for a few seconds.`,
    code: `
import RPi.GPIO as GPIO
import time

# Define GPIO pins for R, G, B
RED_PIN, GREEN_PIN, BLUE_PIN = 17, 27, 22 

def setup_leds():
    GPIO.setmode(GPIO.BCM)
    GPIO.setup([RED_PIN, GREEN_PIN, BLUE_PIN], GPIO.OUT)

def google_light_animation():
    colors = [(1,0,0), (0,1,0), (0,0,1), (1,1,0)] # Red, Green, Blue, Yellow
    for _ in range(3): # Loop animation
        for r,g,b in colors:
            GPIO.output(RED_PIN, r)
            GPIO.output(GREEN_PIN, g)
            GPIO.output(BLUE_PIN, b)
            time.sleep(0.5)
    # Turn off lights
    GPIO.output([RED_PIN, GREEN_PIN, BLUE_PIN], 0)

# Call this function after "Hey Saras" is detected
# google_light_animation()
`,
  },
  {
    id: 4,
    title: 'Gemini API Integration',
    icon: BrainIcon,
    description: `This is the core of the robot's intelligence. We'll integrate the Google Gemini API to process commands, describe scenes, and generate responses. Remember to set your API key as an environment variable for security.`,
    code: `
import os
from google.generativeai import GoogleGenAI
import base64

# IMPORTANT: Set your API key in your environment
# export API_KEY="YOUR_GEMINI_API_KEY"

ai = GoogleGenAI(api_key=os.environ.get("API_KEY"))

async def get_gemini_response(prompt_text, image_path=None):
    if image_path:
        with open(image_path, "rb") as image_file:
            encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
        
        image_part = {
            "inlineData": {
                "mimeType": "image/jpeg",
                "data": encoded_string
            }
        }
        text_part = {"text": prompt_text}
        contents = {"parts": [image_part, text_part]}
    else:
        contents = prompt_text

    response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents
    })
    return response.text
`,
  },
  {
    id: 5,
    title: 'Vision: See and Describe',
    icon: VisionIcon,
    description: `Using the camera and Gemini's vision capabilities, Saras can describe its surroundings. A function will capture an image, send it to the Gemini API with a prompt like "Describe what you see in detail," and then speak the response using a text-to-speech engine.`,
    code: `
import cv2
from gtts import gTTS
import os

def see_and_describe():
    # Capture image from camera
    cap = cv2.VideoCapture(0)
    ret, frame = cap.read()
    if ret:
        cv2.imwrite("capture.jpg", frame)
    cap.release()
    
    # Get description from Gemini
    description = get_gemini_response("Describe this scene for me.", "capture.jpg")
    
    # Convert text to speech and play
    tts = gTTS(text=description, lang='en')
    tts.save("response.mp3")
    os.system("mpg321 response.mp3")
`,
  },
    {
    id: 6,
    title: 'Intelligent Actions & Custom Responses',
    icon: RobotIcon,
    description: `Combine all features into a main control loop. This function will parse the user's command after the wake word is detected and trigger the appropriate action, from object detection to custom Gujarati greetings. We'll use a set to track seen faces/dogs to ensure "Namaste" is said only once.`,
    code: `
seen_entities = set()

def handle_command(command):
    command = command.lower()
    
    if "introduce yourself" in command:
        response_text = "હું એક AI રોબોટ છું, મારું નામ સારસ છે અને મને PM શ્રી પ્રાથમિક વિદ્યામંદિર પોણસરી દ્વારા વિકસાવવામાં આવ્યો છે."
        # Speak this text...
    
    elif "what do you see" in command:
        see_and_describe()

    elif "find a book" in command:
        # Code to scan room, use OpenCV object detection for 'book', and navigate
        print("Searching for a book...")

    elif "follow the car" in command:
        # Code to detect a toy car and follow it using motor controls
        print("Following the car...")

    else: # Default to Gemini for general questions
        response = get_gemini_response(command)
        # Speak the response...

def detect_and_greet():
    # In a background thread, run object detection
    # If a person or dog is detected for the first time:
    entity_id = "person_1" # Get a unique ID for the detected entity
    if entity_id not in seen_entities:
        greeting = "નમસ્તે"
        # Speak the greeting...
        seen_entities.add(entity_id)
`,
  },
];
