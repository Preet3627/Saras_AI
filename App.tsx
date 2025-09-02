import React, { useState, useEffect, useRef } from 'react';
import { STEPS } from './constants';
import { ROBOT_CODEBASE } from './codebase';
import { StepCard } from './components/StepCard';
import { LogoIcon, TerminalIcon, SettingsIcon, ScanIcon, RobotIcon, VisionIcon, SpeakerOnIcon, SpeakerOffIcon, ArrowUpIcon, ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon, ArrowUturnLeftIcon, ArrowUturnRightIcon, StopIcon, BeakerIcon, DownloadIcon, ShieldCheckIcon, VideoCameraIcon } from './components/Icons';
import type { LogEntry, LogLevel } from './types';

declare const JSZip: any;

const App: React.FC = () => {
  const [robotIp, setRobotIp] = useState<string>('192.168.1.10'); // Default IP
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isAvoiding, setIsAvoiding] = useState<boolean>(false);
  const [isStreamLoading, setIsStreamLoading] = useState<boolean>(true);

  const logsEndRef = useRef<HTMLDivElement>(null);
  const connectSoundRef = useRef<HTMLAudioElement | null>(null);
  const disconnectSoundRef = useRef<HTMLAudioElement | null>(null);
  const messageSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    connectSoundRef.current = new Audio('https://uploads.static.prod.pro.coinbase.com/assets/sounds/send_01.mp3');
    disconnectSoundRef.current = new Audio('https://uploads.static.prod.pro.coinbase.com/assets/sounds/cancel_01.mp3');
    messageSoundRef.current = new Audio('https://uploads.static.prod.pro.coinbase.com/assets/sounds/receive_01.mp3');
  }, []);

  const playSound = (sound: 'connect' | 'disconnect' | 'message') => {
    if (isMuted) return;
    const audioMap = {
      connect: connectSoundRef.current,
      disconnect: disconnectSoundRef.current,
      message: messageSoundRef.current,
    };
    const audio = audioMap[sound];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(error => console.error(`Audio play failed for ${sound}:`, error));
    }
  };
  
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (source: 'System' | 'Robot', level: LogLevel, message: string) => {
    const newLog: LogEntry = { timestamp: new Date().toLocaleTimeString(), source, level, message };
    if (source === 'Robot') playSound('message');
    setLogs(prevLogs => [...prevLogs, newLog]);
  };
  
  const handleAction = (command: string, response: string) => {
    addLog('System', 'command', command);
    setTimeout(() => addLog('Robot', 'response', response), 500);
  };
  
  const handleToggleAvoidance = () => {
    const nextState = !isAvoiding;
    setIsAvoiding(nextState);
    handleAction(
      nextState ? 'Start Obstacle Avoidance' : 'Stop Obstacle Avoidance',
      nextState ? 'Autonomous driving enabled.' : 'Autonomous driving disabled.'
    );
  };

  const handleDownloadCode = () => {
    const zip = new JSZip();
    const rootFolder = zip.folder("saras_ai_robot");

    if (rootFolder) {
      for (const [filePath, content] of Object.entries(ROBOT_CODEBASE)) {
        rootFolder.file(filePath, content);
      }
    }
    
    zip.generateAsync({ type: "blob" }).then(content => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = "saras_ai_robot.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
    addLog('System', 'info', 'Robot backend code ZIP file downloaded.');
  };

  const handleConnect = () => {
    if (isConnected) {
      setIsConnected(false);
      setIsAvoiding(false);
      playSound('disconnect');
      addLog('System', 'info', `Disconnected from robot at ${robotIp}.`);
    } else if (!isConnecting) {
      setIsConnecting(true);
      addLog('System', 'info', `Connecting to robot at ${robotIp}...`);
      setTimeout(() => {
        setIsConnected(true);
        setIsStreamLoading(true);
        playSound('connect');
        addLog('System', 'info', 'Successfully connected to Saras AI Robot.');
        addLog('Robot', 'response', 'Hello! I am Saras. How can I help you today?');
        setIsConnecting(false);
      }, 1500);
    }
  };

  const cameraUrl = isConnected ? `http://${robotIp}:5001/video_feed` : '';

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <LogoIcon className="h-10 w-10 text-cyan-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">Saras AI Robot</h1>
              <p className="text-sm text-gray-400">Control Panel & Setup Guide</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadCode}
              className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
              aria-label="Download robot code"
            >
              <DownloadIcon className="h-6 w-6" />
            </button>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
              aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
            >
              {isMuted ? <SpeakerOffIcon className="h-6 w-6" /> : <SpeakerOnIcon className="h-6 w-6" />}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">Setup Guide</h2>
            {STEPS.map((step, index) => (
              <StepCard key={step.id} step={step} index={index} />
            ))}
          </div>

          <div className="sticky top-8 self-start space-y-6">
            <div className="bg-gray-800/40 border border-gray-700/50 rounded-lg shadow-lg p-6 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-white mb-4">Control Panel</h2>
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  value={robotIp}
                  onChange={(e) => setRobotIp(e.target.value)}
                  disabled={isConnected || isConnecting}
                  className="flex-grow bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
                  placeholder="Enter Robot IP Address"
                  aria-label="Robot IP Address"
                />
                <button
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className={`px-6 py-2 rounded-md font-semibold transition-colors w-32 ${
                    isConnected ? 'bg-red-600 hover:bg-red-700' : 'bg-cyan-600 hover:bg-cyan-700'
                  } text-white disabled:opacity-50 disabled:cursor-wait`}
                >
                  {isConnected ? 'Disconnect' : isConnecting ? 'Connecting...' : 'Connect'}
                </button>
              </div>
               <p className={`text-sm mt-2 ${isConnected ? 'text-green-400' : 'text-gray-400'}`}>
                Status: {isConnected ? 'Connected' : isConnecting ? 'Connecting...' : 'Disconnected'}
              </p>
            </div>
            
            {isConnected && (
              <div className="bg-gray-800/40 border border-gray-700/50 rounded-lg shadow-lg backdrop-blur-sm">
                <div className="flex items-center p-4 border-b border-gray-700/50">
                  <VideoCameraIcon className="h-5 w-5 mr-3 text-cyan-400" />
                  <h3 className="text-lg font-semibold text-white">Live Camera Feed</h3>
                </div>
                <div className="p-4 bg-black/20 aspect-video flex items-center justify-center">
                  {isStreamLoading && <span className="text-gray-400">Loading stream...</span>}
                  <img
                    src={cameraUrl}
                    alt="Robot camera feed"
                    className={`w-full h-full object-cover ${isStreamLoading ? 'hidden' : 'block'}`}
                    onLoad={() => setIsStreamLoading(false)}
                    onError={() => setIsStreamLoading(true)}
                  />
                </div>
              </div>
            )}

            <div className="bg-gray-800/40 border border-gray-700/50 rounded-lg shadow-lg backdrop-blur-sm">
              <div className="flex items-center p-4 border-b border-gray-700/50">
                <TerminalIcon className="h-5 w-5 mr-3 text-cyan-400" />
                <h3 className="text-lg font-semibold text-white">Live Action Log</h3>
              </div>
              <div className="h-64 overflow-y-auto p-4 bg-black/20">
                {logs.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <span>Logs will appear here...</span>
                  </div>
                ) : (
                  <div className="space-y-2 text-sm font-mono">
                    {logs.map((log, index) => (
                      <div key={index} className="flex">
                        <span className="text-gray-500 mr-2">{log.timestamp}</span>
                        <span className={`mr-2 font-bold ${log.source === 'Robot' ? 'text-cyan-400' : 'text-purple-400'}`}>{log.source}:</span>
                        <span className="flex-1 whitespace-pre-wrap">{log.message}</span>
                      </div>
                    ))}
                    <div ref={logsEndRef} />
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-800/40 border border-gray-700/50 rounded-lg shadow-lg p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-4">Autonomous Systems</h3>
               <button onClick={handleToggleAvoidance} disabled={!isConnected} className={`w-full flex items-center justify-center p-3 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isAvoiding ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'}`}>
                <ShieldCheckIcon className="h-5 w-5 mr-2" />
                {isAvoiding ? 'Stop Self-Drive' : 'Start Self-Drive'}
              </button>
            </div>

            <div className="bg-gray-800/40 border border-gray-700/50 rounded-lg shadow-lg p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-4">Movement & Sensors</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                <div className="col-span-3 sm:col-span-3 grid grid-cols-3 gap-2">
                   <button onClick={() => handleAction('Rotate Left', 'Rotating left.')} disabled={!isConnected} className="flex items-center justify-center p-3 bg-gray-700 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" aria-label="Rotate Left"><ArrowUturnLeftIcon className="h-6 w-6" /></button>
                  <button onClick={() => handleAction('Move Forward', 'Moving forward.')} disabled={!isConnected} className="flex items-center justify-center p-3 bg-gray-700 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" aria-label="Move Forward"><ArrowUpIcon className="h-6 w-6" /></button>
                  <button onClick={() => handleAction('Rotate Right', 'Rotating right.')} disabled={!isConnected} className="flex items-center justify-center p-3 bg-gray-700 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" aria-label="Rotate Right"><ArrowUturnRightIcon className="h-6 w-6" /></button>
                  <button onClick={() => handleAction('Strafe Left', 'Strafing left.')} disabled={!isConnected} className="flex items-center justify-center p-3 bg-gray-700 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" aria-label="Strafe Left"><ArrowLeftIcon className="h-6 w-6" /></button>
                  <button onClick={() => handleAction('Stop', 'Stopping all movement.')} disabled={!isConnected} className="flex items-center justify-center p-3 bg-red-600/80 rounded-md hover:bg-red-500/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" aria-label="Stop"><StopIcon className="h-6 w-6" /></button>
                  <button onClick={() => handleAction('Strafe Right', 'Strafing right.')} disabled={!isConnected} className="flex items-center justify-center p-3 bg-gray-700 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" aria-label="Strafe Right"><ArrowRightIcon className="h-6 w-6" /></button>
                  <div/><button onClick={() => handleAction('Move Backward', 'Moving backward.')} disabled={!isConnected} className="flex items-center justify-center p-3 bg-gray-700 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" aria-label="Move Backward"><ArrowDownIcon className="h-6 w-6" /></button><div/>
                </div>
                <div className="col-span-3 sm:col-span-1 flex flex-col gap-4">
                   <button onClick={() => handleAction('Measure Distance', `Obstacle detected at ${Math.floor(Math.random() * 100) + 10} cm.`)} disabled={!isConnected} className="flex items-center text-center justify-center w-full h-full p-3 bg-gray-700 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                     <BeakerIcon className="h-5 w-5 mr-2" />Measure Distance</button>
                </div>
              </div>
            </div>

             <div className="bg-gray-800/40 border border-gray-700/50 rounded-lg shadow-lg p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-4">AI Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                 <button onClick={() => handleAction('Describe Scene', 'I see a desk with a computer and a window.')} disabled={!isConnected} className="flex items-center justify-center p-3 bg-gray-700 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><VisionIcon className="h-5 w-5 mr-2" />Describe Scene</button>
                <button onClick={() => handleAction('Scan Question', 'The question is "What is the capital of France?". The answer is Paris.')} disabled={!isConnected} className="flex items-center justify-center p-3 bg-gray-700 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><ScanIcon className="h-5 w-5 mr-2" />Scan Question</button>
                 <button onClick={() => handleAction('Introduce Yourself', 'Hello, my name is Saras.')} disabled={!isConnected} className="flex items-center justify-center p-3 bg-gray-700 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><RobotIcon className="h-5 w-5 mr-2" />Introduce Yourself</button>
                 <button onClick={() => handleAction('Custom Command', 'Executing custom command.')} disabled={!isConnected} className="flex items-center justify-center p-3 bg-gray-700 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><SettingsIcon className="h-5 w-5 mr-2" />Custom Command</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;