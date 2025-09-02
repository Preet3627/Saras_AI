# Saras AI Robot: Web Control Panel & Guide

This repository contains the source code for a web-based **control panel and setup guide** to transform the [Yahboom RASPBOT V2](https://www.yahboom.net/study/RASPBOT-V2) into an intelligent, interactive AI assistant named "Saras".

This project has evolved into a client-server architecture. The web application in this repository is the **frontend (the client)**, which you run in your browser. It communicates with a **Python web server (the backend)** that you will build and run on the robot itself.

This project was developed for **PM SHRI PRATHMIK VIDHYAMANDIR PONSRI**.

## Architecture Overview

1.  **Robot Backend (Python + Flask):** A web server runs on the Raspberry Pi, listening for commands via a local network API. It controls the robot's hardware and communicates with the Google Gemini API.
2.  **Web Frontend (React - This App):** A user-friendly dashboard that runs in your browser. You use it to send commands to the robot, configure its responses, and see a live log of its activities.



## Features

-   🌐 **Web-Based Control**: Operate your robot from any device with a web browser on the same network.
-   📹 **Live Camera Streaming**: View a real-time video feed from the robot's camera directly in the control panel.
-   🛡️ **Autonomous Obstacle Avoidance**: Toggle a self-driving mode that uses the ultrasonic sensor to navigate and avoid obstacles.
-   🕹️ **Omnidirectional Movement Control**: Directly control the robot's mecanum wheels to move and rotate in any direction.
-   📡 **IR Remote Control Ready**: Includes the backend code to allow control of the robot using a standard IR remote.
-   📏 **Ultrasonic Obstacle Detection**: Trigger the ultrasonic sensor to measure distances and detect obstacles.
-   ✍️ **Dynamic Command Configuration**: Add, edit, and delete custom text commands and responses directly from the web UI. The robot learns new phrases without needing a code change.
-   📸 **Scan-a-Question**: Point the robot's camera at a written question, and it will use Gemini's multimodal capabilities to read, understand, and answer it.
-   🔴 **Live Action Log**: See real-time status updates and responses from the robot in the control panel.
-   🧠 **Google Gemini API Integration**: Connects the robot to real-world data and provides powerful language and vision understanding.
-   👁️ **AI Vision**: Command Saras to capture images and describe what it sees out loud.
-   💬 **Custom Personality & Multilingual Responses**:
    -   Delivers a pre-defined introduction in **Gujarati**.
-   📚 **Guided Setup**: The application itself contains an updated, step-by-step guide to help you build the Python server backend on your robot.
-   📦 **Downloadable Code Bundle**: Get the entire backend server project as a downloadable ZIP file directly from the UI.

## How to Use

1.  **Frontend**: Open the `index.html` file in your browser. This is your control panel.
2.  **Backend**: Follow the "Setup Guide" steps displayed in the web application. You can download the complete code bundle using the download button in the header.
3.  **Connect**: Once the Python server is running on the robot, enter the robot's IP address into the control panel and click "Connect". You can now control your Saras AI Robot!

## Technology Stack

-   **Frontend (This Guide):** React, TypeScript, Tailwind CSS
-   **Backend (On Robot):** Python, Flask, google-generativeai, RPi.GPIO
-   **Communication:** REST API over local network