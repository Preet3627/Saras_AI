import type { Step } from './types';
import {
  FolderIcon,
  HardwareIcon,
  SoftwareIcon,
  MicIcon,
  LightIcon,
  BrainIcon,
  VisionIcon,
  RobotIcon,
  CalculatorIcon
} from './components/Icons';

export const STEPS: Step[] = [
  {
    id: 1,
    title: 'Project Setup & Code Structure (Ubuntu/Raspberry Pi)',
    icon: FolderIcon,
    description: `Before writing the code, it's crucial to set up a clean and scalable project structure on your robot's operating system (like Ubuntu or Raspberry Pi OS). This keeps your code organized and easy to manage as the project grows.

Here is the recommended directory structure. You can create these folders and empty files using the 'mkdir' and 'touch' commands in your terminal.`,
    code: `saras_ai_robot/
├── .env
├── .gitignore
├── main.py
├── requirements.txt
├── core/
│   ├── __init__.py
│   ├── gemini_ai.py
│   ├── led_control.py
│   ├── motor_control.py
│   ├── vision.py
│   └── wake_word.py
└── utils/
    ├── __init__.py
    └── text_to_speech.py

# --- File Explanations ---
#
# .env: Stores your secret API key. (e.g., API_KEY="...")
# .gitignore: Tells git which files to ignore (e.g., .env, __pycache__).
# main.py: The main entry point to start the robot.
# requirements.txt: Lists all the Python libraries needed.
#
# core/: Contains the core logic for the robot's main features.
#   - gemini_ai.py: Handles all communication with the Google Gemini API.
#   - led_control.py: Manages the RGB light animations.
#   - motor_control.py: Controls the robot's movements.
#   - vision.py: Manages the camera and computer vision tasks.
#   - wake_word.py: Handles listening for "Hey Saras".
#
# utils/: Contains helper functions used across the project.
#   - text_to_speech.py: Converts text responses into spoken audio.
`,
  },
  {
    id: 2,
    title: 'Hardware & Environment Setup',
    icon: HardwareIcon,
    description: `First, ensure your RASPBOT V2 is correctly assembled. Verify all connections for the Raspberry Pi, camera module, microphone, motor driver, and RGB LEDs.
    
Then, set up the software environment on your Raspberry Pi. This involves installing required Python libraries from your 'requirements.txt' file.`,
    code: `
# Open a terminal on your Raspberry Pi and run these commands:
# Update package lists
sudo apt-get update && sudo apt-get upgrade -y

# Install core libraries from your requirements file
pip install -r requirements.txt
`,
  },
  {
    id: 3,
    title: 'Wake Word Detection: "Hey Saras"',
    icon: MicIcon,
    description: `The robot needs to listen for its wake word. We'll create a simple loop using the SpeechRecognition library to continuously listen to the microphone in the background. When "Hey Saras" is detected, it will trigger the command listening mode. This code would go in 'core/wake_word.py'.`,
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
    id: 4,
    title: 'RGB Light Indication',
    icon: LightIcon,
    description: `To provide visual feedback, the robot's RGB lights will animate when it hears the wake word. We'll use the RPi.GPIO library to control the LEDs and cycle through Google-like colors (blue, red, yellow, green) for a few seconds. This code belongs in 'core/led_control.py'.`,
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
    id: 5,
    title: 'Gemini API Integration',
    icon: BrainIcon,
    description: `This is the core of the robot's intelligence. We'll integrate the Google Gemini API to process commands, describe scenes, and generate responses. Remember to set your API key in the .env file. This code goes in 'core/gemini_ai.py'.`,
    code: `
import os
from google.generativeai import GoogleGenAI
import base64

# IMPORTANT: Your API key should be in a .env file
# and loaded securely, e.g., using python-dotenv library.

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
    id: 6,
    title: 'Vision: See and Describe',
    icon: VisionIcon,
    description: `Using the camera and Gemini's vision capabilities, Saras can describe its surroundings. A function will capture an image, send it to the Gemini API with a prompt like "Describe what you see in detail," and then speak the response. This logic belongs in 'core/vision.py'.`,
    code: `
import cv2
# from utils.text_to_speech import speak
# from core.gemini_ai import get_gemini_response

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
    speak(description)
`,
  },
    {
    id: 7,
    title: 'Intelligent Actions & Custom Responses',
    icon: RobotIcon,
    description: `Combine all features into a main control loop in 'main.py'. This function will parse the user's command after the wake word is detected and trigger the appropriate action, from object detection to custom Gujarati greetings. We'll use a set to track seen faces/dogs to ensure "Namaste" is said only once.`,
    code: `
# This code would be part of your main.py

seen_entities = set()

def handle_command(command):
    command = command.lower()
    
    if "introduce yourself" in command:
        response_text = "હું એક AI રોબોટ છું, મારું નામ સારસ છે અને મને PM શ્રી પ્રાથમિક વિદ્યામંદિર પોણસરી દ્વારા વિકસાવવામાં આવ્યો છે."
        speak(response_text)
    
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
        speak(response)

def detect_and_greet():
    # In a background thread, run object detection
    # If a person or dog is detected for the first time:
    entity_id = "person_1" # Get a unique ID for the detected entity
    if entity_id not in seen_entities:
        greeting = "નમસ્તે"
        speak(greeting)
        seen_entities.add(entity_id)
`,
  },
  {
    id: 8,
    title: 'Mathematical Problem Solving',
    icon: CalculatorIcon,
    description: `To make Saras a helpful school assistant, we can give it the ability to solve mathematical sums. The robot will listen for phrases like "calculate" or "what is" followed by a math expression.

We'll use a regular expression to find and extract the mathematical part of the command (e.g., "5 * (10 + 2)"). Then, for simplicity, we use Python's built-in 'eval()' function to compute the result.

**Important Note:** Using 'eval()' can be a security risk if the input isn't controlled. For a school project this is acceptable, but for a production system, a safer math parsing library like 'asteval' is recommended.`,
    code: `
# Add this logic inside your handle_command(command) function in main.py
import re

# ... inside handle_command function

elif "calculate" in command or "what is" in command or "solve" in command:
    # Use regex to find a mathematical expression
    math_expression = re.search(r'[\\d\\s\\+\\-\\*\\/\\(\\)]+$', command)
    
    if math_expression:
        expression = math_expression.group(0).strip()
        try:
            # IMPORTANT: eval() can be risky. Use with trusted input.
            result = eval(expression)
            response_text = f"The answer is {result}."
            print(f"Solved: {expression} = {result}")
            speak(response_text)
        except Exception as e:
            print(f"Could not solve the math problem: {e}")
            speak("I'm sorry, I couldn't understand that math problem.")
    else:
        speak("I didn't find a math problem to solve in your command.")

# Example commands this would handle:
# "Hey Saras, what is 15 plus 27"
# "Hey Saras, calculate 100 divided by 4"
# "Hey Saras, solve 5 * (2 + 8)"
`,
  },
];
