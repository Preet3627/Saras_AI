import type { Step } from './types';
import {
  FolderIcon,
  HardwareIcon,
  SoftwareIcon,
  LightIcon,
  BrainIcon,
  VisionIcon,
  RobotIcon,
  CalculatorIcon,
  BeakerIcon,
  VideoCameraIcon,
  ShieldCheckIcon,
  RemoteControlIcon,
} from './components/Icons';

export const STEPS: Step[] = [
  {
    id: 1,
    title: 'Project Setup & Code Structure',
    icon: FolderIcon,
    description: `This project uses a client-server model. This web page is the client. The robot runs a Python server. First, set up this directory structure on your robot's Raspberry Pi. You can download all the code for these files using the download icon in the header.`,
    code: `saras_ai_robot/
├── .env
├── main.py
├── requirements.txt
├── core/
│   ├── __init__.py
│   ├── camera.py
│   ├── gemini_ai.py
│   ├── ir_remote.py
│   ├── led_control.py
│   ├── motor_control.py
│   ├── ultrasonic.py
│   └── vision.py
└── utils/
    ├── __init__.py
    └── text_to_speech.py
`,
  },
  {
    id: 2,
    title: 'Hardware & Environment Setup',
    icon: HardwareIcon,
    description: `Ensure your RASPBOT V2 is correctly assembled. Then, install the required Python libraries from the 'requirements.txt' file. It's recommended to use a virtual environment.`,
    code: `
# Open a terminal on your Raspberry Pi and run these commands:
# Create and activate a virtual environment (optional but recommended)
python3 -m venv .venv
source .venv/bin/activate

# Install core libraries from your requirements file
pip install -r requirements.txt
`,
  },
  {
    id: 3,
    title: 'Building the Web API Server',
    icon: SoftwareIcon,
    description: `The robot's backend is a web server built with Flask. This server listens for commands from this web UI. The 'main.py' file creates API endpoints to handle movement, AI actions, and streaming. This is the core of the robot's remote control functionality.`,
    code: `
# This is a simplified version of main.py
# The full code is in the downloadable ZIP

from flask import Flask, jsonify, request, Response
from flask_cors import CORS
# import core modules like motor_control, vision, camera

app = Flask(__name__)
CORS(app) # Allow requests from the web browser

# Route to handle commands
@app.route('/command', methods=['POST'])
def command():
    action = request.json.get('action')
    # Add logic to call motor_control functions
    # e.g., if action == 'move_forward': motor_control.move_forward()
    return jsonify(status="success", action=action)

# Route for video streaming
@app.route('/video_feed')
def video_feed():
    return Response(camera.generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    # Run the Flask app
    # Use different ports for command and video to handle requests simultaneously
    # This requires running the app in threaded mode
    app.run(host='0.0.0.0', port=5000, threaded=True)

`,
  },
  {
    id: 4,
    title: 'Live Camera Streaming',
    icon: VideoCameraIcon,
    description: `To get a live video feed in the control panel, the Flask server streams video from the camera using OpenCV. A dedicated function captures frames, encodes them as JPEG, and sends them in a multipart response. This allows for a continuous, low-latency video stream.`,
    code: `
# This code goes in 'core/camera.py'
import cv2
import time

class Camera:
    def __init__(self):
        self.video = cv2.VideoCapture(0)
        if not self.video.isOpened():
            raise RuntimeError("Could not start camera.")

    def __del__(self):
        self.video.release()

    def get_frame(self):
        success, image = self.video.read()
        if not success:
            return None
        # Encode frame as JPEG
        ret, jpeg = cv2.imencode('.jpg', image)
        return jpeg.tobytes()

def generate_frames(camera):
    while True:
        frame = camera.get_frame()
        if frame is None:
            break
        # Yield the frame in the multipart response format
        yield (b'--frame\\r\\n'
               b'Content-Type: image/jpeg\\r\\n\\r\\n' + frame + b'\\r\\n')
        time.sleep(0.05) # control frame rate
`,
  },
  {
    id: 5,
    title: 'Autonomous Obstacle Avoidance',
    icon: ShieldCheckIcon,
    description: `The self-drive mode works by running a loop in a background thread. This loop continuously checks the distance from the ultrasonic sensor. If an obstacle is too close, the robot stops, turns, and then continues forward, effectively navigating around objects on its own.`,
    code: `
# This logic is managed in 'main.py' using a background thread
import threading
import time
from core import ultrasonic, motor_control

AVOIDANCE_ENABLED = False
AVOIDANCE_THREAD = None

def obstacle_avoidance_loop():
    global AVOIDANCE_ENABLED
    while AVOIDANCE_ENABLED:
        distance = ultrasonic.get_distance()
        if distance > 20:
            motor_control.move_forward(speed=40)
        else:
            motor_control.stop()
            time.sleep(0.1)
            motor_control.rotate_left(speed=50)
            time.sleep(0.5)
            motor_control.stop()
        time.sleep(0.1)
    motor_control.stop()

# In the /autonomous route in main.py:
# - When "start" is received, set AVOIDANCE_ENABLED = True
#   and start the obstacle_avoidance_loop in a new thread.
# - When "stop" is received, set AVOIDANCE_ENABLED = False
#   to stop the loop.
`,
  },
    {
    id: 6,
    title: 'IR Remote Control',
    icon: RemoteControlIcon,
    description: `The Yahboom Robot HAT includes an infrared (IR) receiver. You can control the robot's movement using a standard IR remote. The code maps specific IR key codes to motor functions (e.g., arrow keys for movement, 'OK' button to stop). This runs in a background thread so it doesn't block the web server.`,
    code: `
# This code goes in 'core/ir_remote.py'
from yahboom_robot_hat import YahboomRobot
from core import motor_control
import time

robot = YahboomRobot()

def ir_control_loop():
    while True:
        try:
            key = robot.get_ir_remote_code()
            if key is not None:
                print(f"IR Key Pressed: {key}")
                if key == robot.IR_REMOTE_UP:
                    motor_control.move_forward()
                elif key == robot.IR_REMOTE_DOWN:
                    motor_control.move_backward()
                elif key == robot.IR_REMOTE_LEFT:
                    motor_control.rotate_left()
                elif key == robot.IR_REMOTE_RIGHT:
                    motor_control.rotate_right()
                elif key == robot.IR_REMOTE_OK:
                    motor_control.stop()
        except Exception as e:
            print(f"IR Error: {e}")
        time.sleep(0.1)

# To use this, start ir_control_loop() in a background
# thread from main.py when the server starts.
`,
  },
  {
    id: 7,
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
    id: 8,
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
    id: 9,
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
    id: 10,
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
  {
    id: 11,
    title: 'Omnidirectional Motor Control',
    icon: HardwareIcon,
    description: `The RASPBOT V2 uses mecanum wheels, allowing for omnidirectional movement. This means it can move forward, backward, strafe left/right, and rotate on the spot. We'll write functions in 'core/motor_control.py' to handle these complex movements by controlling the four motors individually.

The Yahboom library simplifies this. You'll need to install it first: 'pip install yahboom-robot-hat'.`,
    code: `
# This code goes in 'core/motor_control.py'
from yahboom_robot_hat import YahboomRobot

# Initialize the robot hardware interface
robot = YahboomRobot()

def stop():
    robot.set_motor(0, 0, 0, 0) # Stop all four motors

def move_forward(speed=50):
    # All wheels forward
    robot.set_motor(speed, speed, speed, speed)

def move_backward(speed=50):
    # All wheels backward
    robot.set_motor(-speed, -speed, -speed, -speed)
    
def strafe_left(speed=50):
    # Front-left and back-right move backward
    # Front-right and back-left move forward
    robot.set_motor(-speed, speed, -speed, speed)

def strafe_right(speed=50):
    # Front-left and back-right move forward
    # Front-right and back-left move backward
    robot.set_motor(speed, -speed, speed, -speed)

def rotate_left(speed=50):
    # Left wheels backward, right wheels forward
    robot.set_motor(-speed, speed, -speed, speed)

def rotate_right(speed=50):
    # Left wheels forward, right wheels backward
    robot.set_motor(speed, -speed, speed, -speed)

# Example usage from main.py:
# from core import motor_control
# import time
#
# motor_control.move_forward()
# time.sleep(1)
# motor_control.stop()
`,
  },
  {
    id: 12,
    title: 'Ultrasonic Distance Sensing',
    icon: BeakerIcon,
    description: `The robot is equipped with an ultrasonic sensor to measure distances and avoid obstacles. This sensor works by sending out a sound wave and measuring how long it takes to bounce back.

We can write a function in a new file, 'core/ultrasonic.py', to get the distance in centimeters. The Yahboom library also makes this straightforward.`,
    code: `
# This code goes in 'core/ultrasonic.py'
from yahboom_robot_hat import YahboomRobot
import time

robot = YahboomRobot()

def get_distance():
    """
    Measures the distance using the ultrasonic sensor.
    Returns the distance in centimeters (cm).
    """
    # The get_distance method handles the trigger and echo logic.
    distance = robot.get_distance()
    if distance is not None:
        print(f"Distance: {distance:.2f} cm")
        return distance
    else:
        print("Failed to get distance reading.")
        return -1 # Return an error value

# Example usage from main.py:
# from core import ultrasonic
#
# current_distance = ultrasonic.get_distance()
# if current_distance < 15 and current_distance != -1:
#     print("Obstacle detected!")
#     # Stop the robot
`,
  },
];