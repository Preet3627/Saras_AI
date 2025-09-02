export const ROBOT_CODEBASE: Record<string, string> = {
  '.env': `API_KEY="YOUR_GEMINI_API_KEY_HERE"
`,
  '.gitignore': `
# Byte-compiled / optimized / DLL files
__pycache__/
*.py[cod]
*$py.class

# C extensions
*.so

# Distribution / packaging
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg
MANIFEST

# PyInstaller
#  Usually these files are written by a python script from a template
#  before PyInstaller builds the exe, so as to inject date/other infos into it.
*.manifest
*.spec

# Installer logs
pip-log.txt
pip-delete-this-directory.txt

# Unit test / coverage reports
htmlcov/
.tox/
.nox/
.coverage
.coverage.*
.cache
nosetests.xml
coverage.xml
*.cover
*.log
.hypothesis/
.pytest_cache/

# Environments
.env
.venv
env/
venv/
ENV/
env.bak/
venv.bak/

# IDE files
.idea/
.vscode/
`,
  'requirements.txt': `Flask
Flask-Cors
google-generativeai
python-dotenv
yahboom-robot-hat
opencv-python
gunicorn
`,
  'main.py': `import os
import threading
import time
from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from dotenv import load_dotenv

from core import motor_control, vision, ultrasonic, ir_remote, led_control
from core.camera import Camera
from utils import text_to_speech

# Load environment variables
load_dotenv()

# Initialize Robot Hardware
try:
    led_control.setup_leds()
    led_control.google_light_animation()
except Exception as e:
    print(f"Could not initialize LEDs: {e}")

# --- Autonomous Mode State ---
AVOIDANCE_ENABLED = False
AVOIDANCE_THREAD = None

# --- Flask App Initialization ---
app = Flask(__name__)
CORS(app) # Allow requests from the web browser UI

# --- Camera Initialization ---
# Use two separate camera instances for streaming and captures to avoid conflicts
stream_camera = Camera()

# --- Background Threads ---
def start_ir_listener():
    print("Starting IR remote listener...")
    ir_thread = threading.Thread(target=ir_remote.ir_control_loop, daemon=True)
    ir_thread.start()

# --- Autonomous Driving Logic ---
def obstacle_avoidance_loop():
    """Continuously drive forward and turn to avoid obstacles."""
    global AVOIDANCE_ENABLED
    print("Starting obstacle avoidance loop.")
    while AVOIDANCE_ENABLED:
        distance = ultrasonic.get_distance()
        if distance is not None and distance > 25:
            motor_control.move_forward(speed=40)
        else:
            print(f"Obstacle detected at {distance} cm. Turning.")
            motor_control.stop()
            time.sleep(0.1)
            motor_control.rotate_left(speed=50)
            time.sleep(0.5) # Turn for half a second
            motor_control.stop()
        time.sleep(0.1) # Loop delay
    motor_control.stop()
    print("Obstacle avoidance loop stopped.")


# --- API Endpoints ---
@app.route('/')
def index():
    return "Saras AI Robot API is running."

@app.route('/command', methods=['POST'])
def handle_command():
    data = request.json
    command = data.get('command')
    print(f"Received command: {command}")

    # Movement Commands
    if command == 'move_forward': motor_control.move_forward()
    elif command == 'move_backward': motor_control.move_backward()
    elif command == 'strafe_left': motor_control.strafe_left()
    elif command == 'strafe_right': motor_control.strafe_right()
    elif command == 'rotate_left': motor_control.rotate_left()
    elif command == 'rotate_right': motor_control.rotate_right()
    elif command == 'stop': motor_control.stop()
    
    # Sensor Commands
    elif command == 'measure_distance':
        distance = ultrasonic.get_distance()
        return jsonify(status="success", message=f"Distance: {distance:.2f} cm")
        
    # AI Commands
    elif command == 'describe_scene':
        # This should run in a thread to avoid blocking
        description = vision.see_and_describe()
        text_to_speech.speak(description)
        return jsonify(status="success", message=description)

    return jsonify(status="success", command=command)

@app.route('/autonomous', methods=['POST'])
def handle_autonomous():
    global AVOIDANCE_ENABLED, AVOIDANCE_THREAD
    data = request.json
    mode = data.get('mode') # "start" or "stop"

    if mode == 'start' and not AVOIDANCE_ENABLED:
        AVOIDANCE_ENABLED = True
        AVOIDANCE_THREAD = threading.Thread(target=obstacle_avoidance_loop, daemon=True)
        AVOIDANCE_THREAD.start()
        return jsonify(status="success", message="Obstacle avoidance started.")
    elif mode == 'stop' and AVOIDANCE_ENABLED:
        AVOIDANCE_ENABLED = False
        if AVOIDANCE_THREAD:
            AVOIDANCE_THREAD.join() # Wait for the thread to finish
        return jsonify(status="success", message="Obstacle avoidance stopped.")
    
    return jsonify(status="ignored", message=f"Mode is already {AVOIDANCE_ENABLED}")


@app.route('/video_feed')
def video_feed():
    """Video streaming route."""
    return Response(stream_camera.generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    start_ir_listener()
    print("Starting Flask server...")
    # Use gunicorn for production or Flask's built-in server for development
    # Note: The built-in server is not ideal for multi-client streaming
    app.run(host='0.0.0.0', port=5001, threaded=True)
`,
  'core/__init__.py': ``,
  'core/camera.py': `import cv2
import time
import threading

class Camera:
    """A thread-safe camera class that handles video capturing."""
    def __init__(self, src=0):
        self.stream = cv2.VideoCapture(src)
        if not self.stream.isOpened():
            raise IOError("Cannot open camera")
        
        (self.grabbed, self.frame) = self.stream.read()
        self.started = False
        self.read_lock = threading.Lock()

    def start(self):
        if self.started:
            return None
        self.started = True
        self.thread = threading.Thread(target=self.update, args=())
        self.thread.daemon = True
        self.thread.start()
        return self

    def update(self):
        while self.started:
            (grabbed, frame) = self.stream.read()
            with self.read_lock:
                self.grabbed = grabbed
                self.frame = frame

    def read(self):
        with self.read_lock:
            frame = self.frame.copy()
            grabbed = self.grabbed
        return grabbed, frame

    def stop(self):
        self.started = False
        if self.thread.is_alive():
            self.thread.join()

    def __exit__(self, exec_type, exc_value, traceback):
        self.stream.release()

    def capture_frame(self):
        """Captures a single high-quality frame for tasks like image analysis."""
        # This could be improved to ensure the latest frame is captured
        ret, frame = self.stream.read()
        if ret:
            cv2.imwrite("capture.jpg", frame)
            return "capture.jpg"
        return None

    def generate_frames(self):
        """Generator function for streaming frames."""
        while True:
            # Use a separate read for streaming to avoid interfering with other captures
            success, frame = self.stream.read()
            if not success:
                break
            else:
                ret, buffer = cv2.imencode('.jpg', frame)
                frame = buffer.tobytes()
                yield (b'--frame\\r\\n'
                       b'Content-Type: image/jpeg\\r\\n\\r\\n' + frame + b'\\r\\n')
            time.sleep(0.03) # Limit frame rate to ~30fps
`,
  'core/gemini_ai.py': `import os
from google.generativeai import GoogleGenAI
import base64

# Ensure the API key is set in the environment
if "API_KEY" not in os.environ:
    raise ValueError("API_KEY not found in environment variables.")

ai = GoogleGenAI(api_key=os.environ.get("API_KEY"))

async def get_gemini_response(prompt_text, image_path=None):
    """
    Gets a response from the Gemini API, with an optional image.
    """
    try:
        contents = []
        if image_path:
            if not os.path.exists(image_path):
                return "Error: Image file not found."
            with open(image_path, "rb") as image_file:
                encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
            
            image_part = {
                "inlineData": {
                    "mimeType": "image/jpeg",
                    "data": encoded_string
                }
            }
            contents.append(image_part)
        
        text_part = {"text": prompt_text}
        contents.append(text_part)

        response = await ai.models.generateContent({
            'model': 'gemini-2.5-flash',
            'contents': {"parts": contents}
        })
        return response.text
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return "I'm sorry, I encountered an error trying to process that."
`,
  'core/ir_remote.py': `import time
from yahboom_robot_hat import YahboomRobot
from core import motor_control

# Initialize robot singleton
robot = YahboomRobot()

def ir_control_loop():
    """A loop that listens for IR remote signals and controls the robot."""
    print("IR control loop started.")
    while True:
        try:
            key = robot.get_ir_remote_code()
            if key is not None:
                print(f"IR Key Press Detected: {key}")
                # Map keys to motor functions
                if key == robot.IR_REMOTE_UP:
                    motor_control.move_forward()
                elif key == robot.IR_REMOTE_DOWN:
                    motor_control.move_backward()
                elif key == robot.IR_REMOTE_LEFT:
                    motor_control.rotate_left()
                elif key == robot.IR_REMOTE_RIGHT:
                    motor_control.rotate_right()
                elif key == "C": # Strafe Left (assuming 'C' maps to a key)
                    motor_control.strafe_left()
                elif key == "D": # Strafe Right
                    motor_control.strafe_right()
                elif key == robot.IR_REMOTE_OK:
                    motor_control.stop()
                
                # Small delay after command
                time.sleep(0.2)

        except Exception as e:
            print(f"Error in IR loop: {e}")
            # Avoid spamming logs on error
            time.sleep(2)
        
        time.sleep(0.1) # Polling interval
`,
  'core/led_control.py': `import RPi.GPIO as GPIO
import time

# Define GPIO pins for R, G, B using BCM numbering
RED_PIN, GREEN_PIN, BLUE_PIN = 17, 27, 22 
is_setup = False

def setup_leds():
    global is_setup
    GPIO.setwarnings(False)
    GPIO.setmode(GPIO.BCM)
    GPIO.setup([RED_PIN, GREEN_PIN, BLUE_PIN], GPIO.OUT, initial=GPIO.LOW)
    is_setup = True
    print("LEDs setup complete.")

def set_color(r, g, b):
    if not is_setup: setup_leds()
    GPIO.output(RED_PIN, r)
    GPIO.output(GREEN_PIN, g)
    GPIO.output(BLUE_PIN, b)

def turn_off():
    set_color(0, 0, 0)

def google_light_animation():
    """Cycles through Google colors to indicate startup."""
    if not is_setup: setup_leds()
    colors = [(0, 0, 1), (1, 0, 0), (1, 1, 0), (0, 1, 0)] # Blue, Red, Yellow, Green
    for r, g, b in colors:
        set_color(r, g, b)
        time.sleep(0.5)
    turn_off()
    print("Startup animation complete.")

def cleanup():
    """Clean up GPIO resources."""
    print("Cleaning up GPIO.")
    GPIO.cleanup()
`,
  'core/motor_control.py': `from yahboom_robot_hat import YahboomRobot
import atexit

# Initialize the robot hardware interface as a singleton
robot = YahboomRobot()

def stop():
    """Stop all four motors."""
    robot.set_motor(0, 0, 0, 0)

def move_forward(speed=50):
    """Move forward by running all wheels in the same direction."""
    robot.set_motor(speed, speed, speed, speed)

def move_backward(speed=50):
    """Move backward."""
    robot.set_motor(-speed, -speed, -speed, -speed)
    
def strafe_left(speed=50):
    """Strafe left without changing orientation."""
    robot.set_motor(-speed, speed, speed, -speed)

def strafe_right(speed=50):
    """Strafe right without changing orientation."""
    robot.set_motor(speed, -speed, -speed, speed)

def rotate_left(speed=50):
    """Rotate counter-clockwise on the spot."""
    robot.set_motor(-speed, speed, -speed, speed)

def rotate_right(speed=50):
    """Rotate clockwise on the spot."""
    robot.set_motor(speed, -speed, speed, -speed)

# Register a cleanup function to stop motors on exit
atexit.register(stop)
`,
  'core/ultrasonic.py': `from yahboom_robot_hat import YahboomRobot
import time

robot = YahboomRobot()

def get_distance():
    """
    Measures the distance using the ultrasonic sensor.
    Returns the distance in centimeters (cm) or None on failure.
    """
    distance = robot.get_distance()
    if distance is not None and distance > 0:
        # print(f"Distance: {distance:.1f} cm")
        return distance
    else:
        # print("Failed to get a valid distance reading.")
        return None # Return None for easier error handling
`,
  'core/vision.py': `import asyncio
from core.gemini_ai import get_gemini_response
from core.camera import Camera

# Use a separate camera instance for captures to avoid conflicts with streaming
capture_camera = Camera()

def see_and_describe():
    """
    Captures an image from the camera, sends it to Gemini for description,
    and returns the textual description.
    """
    print("Capturing scene for description...")
    image_path = capture_camera.capture_frame()
    
    if image_path:
        print(f"Image captured: {image_path}. Getting description from Gemini...")
        # Run the async function
        description = asyncio.run(get_gemini_response("Describe this scene in detail.", image_path))
        print(f"Gemini description: {description}")
        return description
    else:
        print("Failed to capture image.")
        return "I'm sorry, I couldn't see anything."
`,
  'utils/__init__.py': ``,
  'utils/text_to_speech.py': `import os

def speak(text):
    """
    Converts text to speech using the 'espeak' command-line tool.
    This is a simple, offline method suitable for Raspberry Pi.
    """
    try:
        # Sanitize text to prevent command injection
        sanitized_text = text.replace('"', '').replace("'", "").replace(";", "")
        command = f'espeak -v en+f3 -k5 -s150 "{sanitized_text}"'
        print(f"Speaking: {sanitized_text}")
        os.system(command)
    except Exception as e:
        print(f"Error in text-to-speech: {e}")
`,
};
