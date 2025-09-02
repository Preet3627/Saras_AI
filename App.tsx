import React, { useState, useEffect, useRef } from 'react';
import { STEPS } from './constants';
import { ROBOT_CODEBASE } from './codebase';
import { StepCard } from './components/StepCard';
import { LogoIcon, TerminalIcon, SettingsIcon, ScanIcon, RobotIcon, VisionIcon, SpeakerOnIcon, SpeakerOffIcon, ArrowUpIcon, ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon, ArrowUturnLeftIcon, ArrowUturnRightIcon, StopIcon, BeakerIcon, DownloadIcon, ShieldCheckIcon, VideoCameraIcon, AutopilotIcon, TrafficLightIcon, FollowIcon, FindBookIcon, ExploreIcon, BrainIcon as SparklesIcon, ChatBubbleLeftRightIcon, TrashIcon, PlayIcon, CogIcon, CameraIcon } from './components/Icons';
import type { LogEntry, LogLevel, CustomResponse } from './types';

declare const JSZip: any;

type AutopilotMode = 'off' | 'avoid' | 'traffic' | 'follow' | 'explore';

const App: React.FC = () => {
  const [robotIp, setRobotIp] = useState<string>('192.168.1.10'); // Default IP
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [autopilotMode, setAutopilotMode] = useState<AutopilotMode>('off');
  const [isStreamLoading, setIsStreamLoading] = useState<boolean>(true);
  
  // State for custom responses
  const [customResponses, setCustomResponses] = useState<CustomResponse[]>([
    { id: 1, question: "Who are you?", answer: "I am Saras, an AI Robot." },
    { id: 2, question: "What can you do?", answer: "I can see, move, talk, and learn new things!" }
  ]);
  const [newQuestion, setNewQuestion] = useState<string>('');
  const [newAnswer, setNewAnswer] = useState<string>('');
  
  // State for wake word
  const [wakeWord, setWakeWord] = useState<string>('hey saras');


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
  
  const handleAction = (command: string, response: string, text?: string) => {
    addLog('System', 'command', command);
    // Here you would typically send the command to the robot's API
    // For this simulation, we just add a delayed response.
    setTimeout(() => addLog('Robot', 'response', response), 500);
  };

  const handleSetWakeUpWord = () => {
    if (!wakeWord.trim()) {
      addLog('System', 'error', 'Wake word cannot be empty.');
      return;
    }
    addLog('System', 'command', `Setting wake word to "${wakeWord}"...`);
    // Mock API call
    setTimeout(() => {
        addLog('Robot', 'response', 'Wake word updated successfully.');
    }, 500);
  };

  const handleAddResponse = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) {
      addLog('System', 'error', 'Question and Answer cannot be empty.');
      return;
    }
    const newResponse: CustomResponse = { id: Date.now(), question: newQuestion, answer: newAnswer };
    setCustomResponses([...customResponses, newResponse]);
    setNewQuestion('');
    setNewAnswer('');
    addLog('System', 'info', `Custom response for "${newQuestion}" added. Save to robot to apply.`);
  };

  const handleDeleteResponse = (id: number) => {
    setCustomResponses(customResponses.filter(r => r.id !== id));
    addLog('System', 'info', 'Custom response removed.');
  };
  
  const handleSaveResponsesToRobot = () => {
    addLog('System', 'command', 'Saving all custom responses to robot...');
    // In a real app, this would be an API call:
    // fetch(`http://${robotIp}:5001/custom-responses`, { 
    //   method: 'POST', 
    //   headers: {'Content-Type': 'application/json'},
    //   body: JSON.stringify({ responses: customResponses })
    // });
    setTimeout(() => {
        addLog('Robot', 'response', 'Custom responses updated successfully.');
    }, 500);
  };
  
  const handleTestResponse = (question: string, answer: string) => {
    addLog('System', 'command', `Testing custom response for: "${question}"`);
    setTimeout(() => {
        addLog('Robot', 'response', answer);
    }, 500);
  };

  
  const handleToggleAutopilot = (mode: AutopilotMode) => {
    const nextMode = autopilotMode === mode ? 'off' : mode;
    setAutopilotMode(nextMode);

    let command = '';
    let response = '';

    if (nextMode === 'off') {
        command = 'Deactivate Autopilot';
        response = 'All autopilot systems deactivated.';
    } else {
        switch(nextMode) {
            case 'avoid':
                command = 'Activate Obstacle Avoidance';
                response = 'Autopilot engaged: Obstacle Avoidance mode.';
                break;
            case 'traffic':
                command = 'Activate Traffic Mode';
                response = 'Autopilot engaged: Traffic Sign Recognition mode.';
                break;
            case 'follow':
                command = 'Activate Follow Car Mode';
                response = 'Autopilot engaged: Following designated car.';
                break;
            case 'explore':
                command = 'Activate Explore Mode';
                response = 'Autopilot engaged: Exploring surroundings randomly.';
                break;
        }
    }
    
    handleAction(command, response);
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
      setAutopilotMode('off');
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
              <h1 className="text-2xl font-bold text-white animate-rgb-text-glow">Saras AI Robot</h1>
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
                <div className="flex items-center mb-4">
                    <CogIcon className="h-5 w-5 mr-3 text-cyan-400" />
                    <h3 className="text-lg font-semibold text-white">AI Settings</h3>
                </div>
                <div className="space-y-3">
                    <label htmlFor="wake-word" className="block text-sm font-medium text-gray-300">Custom Voice Wake Word</label>
                    <div className="flex items-center space-x-2">
                        <input
                            id="wake-word"
                            type="text"
                            value={wakeWord}
                            onChange={(e) => setWakeWord(e.target.value)}
                            disabled={!isConnected}
                            className="flex-grow bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
                            placeholder="e.g., Hey Saras"
                        />
                        <button
                            onClick={handleSetWakeUpWord}
                            disabled={!isConnected || !wakeWord.trim()}
                            className="px-4 py-2 text-sm bg-cyan-600 hover:bg-cyan-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-gray-800/40 border border-gray-700/50 rounded-lg shadow-lg p-6 backdrop-blur-sm">
               <div className="flex items-center mb-4">
                 <AutopilotIcon className="h-5 w-5 mr-3 text-cyan-400" />
                 <h3 className="text-lg font-semibold text-white">Autopilot Systems</h3>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <button onClick={() => handleToggleAutopilot('avoid')} disabled={!isConnected} className={`flex items-center justify-center p-3 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${autopilotMode === 'avoid' ? 'bg-cyan-600' : 'bg-gray-700 hover:bg-gray-600'}`}>
                   <ShieldCheckIcon className="h-5 w-5 mr-2" />
                   Avoidance
                 </button>
                 <button onClick={() => handleToggleAutopilot('traffic')} disabled={!isConnected} className={`flex items-center justify-center p-3 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${autopilotMode === 'traffic' ? 'bg-cyan-600' : 'bg-gray-700 hover:bg-gray-600'}`}>
                   <TrafficLightIcon className="h-5 w-5 mr-2" />
                   Traffic Mode
                 </button>
                 <button onClick={() => handleToggleAutopilot('follow')} disabled={!isConnected} className={`flex items-center justify-center p-3 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${autopilotMode === 'follow' ? 'bg-cyan-600' : 'bg-gray-700 hover:bg-gray-600'}`}>
                   <FollowIcon className="h-5 w-5 mr-2" />
                   Follow Car
                 </button>
                  <button onClick={() => handleToggleAutopilot('explore')} disabled={!isConnected} className={`flex items-center justify-center p-3 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${autopilotMode === 'explore' ? 'bg-cyan-600' : 'bg-gray-700 hover:bg-gray-600'}`}>
                   <ExploreIcon className="h-5 w-5 mr-2" />
                   Explore
                 </button>
               </div>
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
                 <button onClick={() => handleAction('Describe Scene', 'I see a desk with a computer and a window.')} disabled={!isConnected} className="col-span-2 flex items-center justify-center p-3 bg-gray-700/50 rounded-md hover:bg-gray-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors animate-rgb-border-glow font-semibold text-lg">
                    <CameraIcon className="h-6 w-6 mr-3" />See & Describe Scene
                 </button>
                 <button onClick={() => handleAction('wake_word', 'Listening...')} disabled={!isConnected} className="flex items-center justify-center p-3 bg-gray-700 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><SparklesIcon className="h-5 w-5 mr-2" />Test Wake Effect</button>
                 <button onClick={() => handleAction('Introduce Yourself (Gujarati)', 'હું એક AI રોબોટ છું, મારું નામ સારસ છે અને મને PM શ્રી પ્રાથમિક વિદ્યામંદિર પોણસરી દ્વારા વિકસાવવામાં આવ્યો છે.')} disabled={!isConnected} className="flex items-center justify-center p-3 bg-gray-700 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><RobotIcon className="h-5 w-5 mr-2" />Introduce (Gujarati)</button>
                 <button onClick={() => handleAction('Find a Book', 'Searching for a book... Found one!')} disabled={!isConnected} className="flex items-center justify-center p-3 bg-gray-700 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><FindBookIcon className="h-5 w-5 mr-2" />Find a Book</button>
                <button onClick={() => handleAction('Scan Question', 'The question is "What is the capital of France?". The answer is Paris.')} disabled={!isConnected} className="flex items-center justify-center p-3 bg-gray-700 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><ScanIcon className="h-5 w-5 mr-2" />Scan Question</button>
              </div>
            </div>

            <div className="bg-gray-800/40 border border-gray-700/50 rounded-lg shadow-lg p-6 backdrop-blur-sm">
               <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center">
                   <ChatBubbleLeftRightIcon className="h-5 w-5 mr-3 text-cyan-400" />
                   <h3 className="text-lg font-semibold text-white">Custom AI Responses</h3>
                 </div>
                 <button onClick={handleSaveResponsesToRobot} disabled={!isConnected || customResponses.length === 0} className="px-4 py-1 text-sm bg-cyan-600 hover:bg-cyan-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Save to Robot</button>
               </div>
               <div className="space-y-4">
                 <div className="space-y-2">
                   <input type="text" value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} placeholder="When user says..." className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"/>
                   <textarea value={newAnswer} onChange={(e) => setNewAnswer(e.target.value)} placeholder="Robot will answer..." rows={2} className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"/>
                 </div>
                 <button onClick={handleAddResponse} className="w-full p-2 bg-gray-700 hover:bg-gray-600 rounded-md font-semibold transition-colors">Add Response</button>
               </div>
               <div className="mt-6 space-y-3 max-h-60 overflow-y-auto pr-2">
                 {customResponses.map((res) => (
                   <div key={res.id} className="bg-gray-900/50 p-3 rounded-md border border-gray-700 flex justify-between items-center">
                     <div className="flex-1">
                       <p className="text-sm font-semibold text-purple-300">{res.question}</p>
                       <p className="text-sm text-cyan-300 mt-1">{res.answer}</p>
                     </div>
                     <div className="flex items-center space-x-2 ml-4">
                       <button onClick={() => handleTestResponse(res.question, res.answer)} disabled={!isConnected} className="p-2 text-gray-400 hover:text-white disabled:opacity-50 transition-colors" aria-label="Test Response"><PlayIcon className="h-5 w-5"/></button>
                       <button onClick={() => handleDeleteResponse(res.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors" aria-label="Delete Response"><TrashIcon className="h-5 w-5"/></button>
                     </div>
                   </div>
                 ))}
               </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default App;