import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

const IconWrapper: React.FC<IconProps & { children: React.ReactNode }> = ({ children, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    {children}
  </svg>
);

const SolidIconWrapper: React.FC<IconProps & { children: React.ReactNode }> = ({ children, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    {children}
  </svg>
);

export const LogoIcon: React.FC<IconProps> = (props) => (
  <SolidIconWrapper {...props}>
    <path d="M12.378 1.602a.75.75 0 00-.756 0L3.32 6.602a.75.75 0 00-.32.65A3.375 3.375 0 006.375 9.75h11.25A3.375 3.375 0 0021 7.252a.75.75 0 00-.32-.65L12.378 1.602zM12 7.5a.75.75 0 00-.75.75v6a.75.75 0 001.5 0v-6a.75.75 0 00-.75-.75z" />
    <path d="M4.5 13.905l2.73-1.638a.75.75 0 11.74 1.299l-2.483 1.49a.75.75 0 000 1.3l2.483 1.49a.75.75 0 11-.74 1.299L4.5 17.845V19.5a.75.75 0 01-1.5 0v-2.655l-2.73 1.638a.75.75 0 11-.74-1.3l2.483-1.49a.75.75 0 000-1.298L.03 13.906a.75.75 0 11.74-1.299L3 13.905V11.25a.75.75 0 011.5 0v2.655z" />
  </SolidIconWrapper>
);

export const TerminalIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" /></IconWrapper>
);

export const SettingsIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527c.44-.314 1.02-.12 1.273.343l.546 1.093c.253.504.06.94-.343 1.273l-.527.737c-.25.35-.272.806-.108 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.11v1.093c0 .55-.398 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.108 1.204l.527.738c.314.44.12 1.02-.343 1.273l-1.093.546c-.504.253-.94.06-1.273-.343l-.737-.527c-.35-.25-.806-.272-1.204-.108-.397.165-.71.505-.78.93l-.15.893c-.09.543-.56.94-1.11.94h-1.093c-.55 0-1.02-.398-1.11-.94l-.149-.894c-.07-.424-.384-.764-.78-.93-.398-.164-.855-.142-1.205.108l-.737.527c-.44.314-1.02.12-1.273-.343l-.546-1.093c-.253-.504-.06-.94.343-1.273l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.893-.15c-.543-.09-.94-.56-.94-1.11v-1.093c0-.55.398-1.02.94-1.11l.893-.149c.425-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.527-.738c-.314-.44-.12-1.02.343-1.273l1.093-.546c.504-.253.94-.06 1.273.343l.737.527c.35.25.806.272 1.204.108.397-.165.71-.505.78-.93l.15-.893z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></IconWrapper>
);

export const ScanIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.5a.75.75 0 00-.75.75v.5c0 .414.336.75.75.75h.5a.75.75 0 00.75-.75v-.5a.75.75 0 00-.75-.75h-.5zM3.75 9a.75.75 0 00-.75.75v.5c0 .414.336.75.75.75h.5a.75.75 0 00.75-.75v-.5a.75.75 0 00-.75-.75h-.5zM3.75 13.5a.75.75 0 00-.75.75v.5c0 .414.336.75.75.75h.5a.75.75 0 00.75-.75v-.5a.75.75 0 00-.75-.75h-.5zM8.25 4.5a.75.75 0 00-.75.75v.5c0 .414.336.75.75.75h.5a.75.75 0 00.75-.75v-.5a.75.75 0 00-.75-.75h-.5zM8.25 9a.75.75 0 00-.75.75v.5c0 .414.336.75.75.75h.5a.75.75 0 00.75-.75v-.5a.75.75 0 00-.75-.75h-.5zM8.25 13.5a.75.75 0 00-.75.75v.5c0 .414.336.75.75.75h.5a.75.75 0 00.75-.75v-.5a.75.75 0 00-.75-.75h-.5zM12.75 4.5a.75.75 0 00-.75.75v.5c0 .414.336.75.75.75h.5a.75.75 0 00.75-.75v-.5a.75.75 0 00-.75-.75h-.5zM12.75 9a.75.75 0 00-.75.75v.5c0 .414.336.75.75.75h.5a.75.75 0 00.75-.75v-.5a.75.75 0 00-.75-.75h-.5zM12.75 13.5a.75.75 0 00-.75.75v.5c0 .414.336.75.75.75h.5a.75.75 0 00.75-.75v-.5a.75.75 0 00-.75-.75h-.5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 19.5h16.5a.75.75 0 00.75-.75V4.5a.75.75 0 00-.75-.75H3.75a.75.75 0 00-.75.75v14.25c0 .414.336.75.75.75z" /></IconWrapper>
);

export const RobotIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.12M9 3.75v2.25m0-2.25h3.09m0 0a2.25 2.25 0 012.15 1.588l2.412 7.782M12 6h-3m3 0a2.25 2.25 0 00-2.15-1.588l-2.412-7.782m11.25 11.25L15 21m-4.5-3L12 21m-3-3v3m6-12h-3m3 0a2.25 2.25 0 00-2.15-1.588l-2.412-7.782M9 15.75h3m3 0h-3m-3 0h-3m0 0l-1.5 4.5M15 15.75l1.5 4.5" /></IconWrapper>
);

export const VisionIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639l4.25-6.918a.998.998 0 011.664 0l4.25 6.918a1.012 1.012 0 010 .639l-4.25 6.918a.998.998 0 01-1.664 0l-4.25-6.918z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></IconWrapper>
);

export const SpeakerOnIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /></IconWrapper>
);

export const SpeakerOffIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /></IconWrapper>
);

export const ArrowUpIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></IconWrapper>
);

export const ArrowDownIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></IconWrapper>
);

export const ArrowLeftIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></IconWrapper>
);

export const ArrowRightIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></IconWrapper>
);

export const ArrowUturnLeftIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" /></IconWrapper>
);

export const ArrowUturnRightIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" /></IconWrapper>
);

export const StopIcon: React.FC<IconProps> = (props) => (
  <SolidIconWrapper {...props}><path fillRule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clipRule="evenodd" /></SolidIconWrapper>
);

export const BeakerIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.21 1.002l-1.3 2.593a2.25 2.25 0 01-2.15 1.585h-1.425a2.25 2.25 0 01-2.15-1.585l-1.3-2.593a2.25 2.25 0 01-.21-1.002V3.104m7.5 0v5.714a2.25 2.25 0 00.21 1.002l1.3 2.593a2.25 2.25 0 002.15 1.585h1.425a2.25 2.25 0 002.15-1.585l1.3-2.593a2.25 2.25 0 00.21-1.002V3.104M12 4.5h.008v.008H12V4.5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 1.5V3" /><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75h16.5" /></IconWrapper>
);

export const DownloadIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></IconWrapper>
);

export const ShieldCheckIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008H12v-.008z" /></IconWrapper>
);

export const VideoCameraIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9A2.25 2.25 0 004.5 18.75z" /></IconWrapper>
);

export const AutopilotIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></IconWrapper>
);

export const TrafficLightIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5h6.75a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25H9a2.25 2.25 0 01-2.25-2.25V6.75A2.25 2.25 0 019 4.5zM9 15h.008v.008H9V15zm.008-3.001v.002H9.008V12h-.008zM9 9h.008v.008H9V9z" /></IconWrapper>
);

export const FollowIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962c.513-.96 1.487-1.59 2.57-1.59h9.862a3 3 0 00-4.682-2.72 9.094 9.094 0 00-3.741-.479m7.5 2.962v2.25m-.75-2.25v-2.25m0 2.25l-1.5-1.5m1.5 1.5l1.5-1.5m-15-3l-1.5-1.5m1.5 1.5l1.5-1.5m-3 3l-1.5-1.5m1.5 1.5l1.5-1.5m7.5-3v2.25m-.75-2.25v-2.25m0 2.25l-1.5-1.5m1.5 1.5l1.5-1.5m-15-3l-1.5-1.5m1.5 1.5l1.5-1.5m-3 3l-1.5-1.5m1.5 1.5l1.5-1.5" /></IconWrapper>
);

export const FindBookIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></IconWrapper>
);

export const ExploreIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048c-1.104.368-2.158.368-3.262 0l-.143-.048a2.25 2.25 0 01-1.161-.886l-.51-.766c-.32-4.8-.418-1.121.216-1.49l1.068-.89a1.125 1.125 0 00.405-.864v-.568c0-.621.504-1.125 1.125-1.125h.632c.621 0 1.125.504 1.125 1.125z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048c-1.104.368-2.158.368-3.262 0l-.143-.048a2.25 2.25 0 01-1.161-.886l-.51-.766c-.32-4.8-.418-1.121.216-1.49l1.068-.89a1.125 1.125 0 00.405-.864v-.568c0-.621.504-1.125 1.125-1.125h.632c.621 0 1.125.504 1.125 1.125z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" /></IconWrapper>
);

export const BrainIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 21v-1.5M15.75 3v1.5M15.75 21v-1.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 7.5h6v9H9v-9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 7.5h1.5v9H15v-9zM7.5 7.5H6v9h1.5v-9zM12 16.5v1.5M12 6V4.5" /></IconWrapper>
);

export const ChatBubbleLeftRightIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.722.534c-1.104.157-2.162-.596-2.586-1.741a4.5 4.5 0 01-8.72-1.94c0-.983.611-1.823 1.5-2.097c.146-.044.295-.08.446-.114v-2.951a.75.75 0 01.75-.75H14.25a.75.75 0 01.75.75v2.951c.15-.034.3-.07.446-.114c.884-.284 1.5-1.128 1.5-2.097v-4.286c0-1.136.847-2.1 1.98-2.193l3.722-.534c1.104-.157 2.162.596 2.586 1.741a4.5 4.5 0 018.72 1.94c0 .983-.611 1.823-1.5 2.097z" /></IconWrapper>
);

export const TrashIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></IconWrapper>
);

export const PlayIcon: React.FC<IconProps> = (props) => (
  <SolidIconWrapper {...props}><path d="M6.32 2.577a.75.75 0 01.896.063l10.5 7.5a.75.75 0 010 1.218l-10.5 7.5a.75.75 0 01-1.128-.971l1.637-6.046-1.637-6.046a.75.75 0 01.232-.962z" /></SolidIconWrapper>
);

export const CogIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213.926c.07.302.278.57.592.702l.978.396c.474.192.85.61.994 1.12l.333 1.168c.12.417.01.86-.282 1.15l-.79.79c-.24.24-.327.59-.222.906l.334 1.002c.108.324.03.68-.216.94l-.79.79c-.292.29-.392.733-.282 1.15l.333 1.168c.144.51.52.928.994 1.12l.978.396c.314.132.522.4.592.702l.213.926c.09.542.56.94 1.11.94h2.593c.55 0 1.02-.398 1.11-.94l.213-.926c.07-.302.278-.57.592-.702l.978-.396c.474-.192.85-.61.994-1.12l.333-1.168c.12-.417.01-.86-.282-1.15l-.79-.79c-.24-.24-.327-.59-.222-.906l.334-1.002c.108-.324.03-.68-.216-.94l-.79-.79c-.292-.29-.392-.733-.282-1.15l.333-1.168c.144-.51.52-.928.994-1.12l.978-.396c.314-.132.522-.4.592-.702l.213-.926c.09-.542-.56-.94-1.11-.94h-2.593c-.55 0-1.02.398-1.11.94l-.213.926c-.07.302-.278.57-.592.702l-.978.396c-.474.192-.85.61-.994 1.12l-.333 1.168c-.12.417-.01.86.282 1.15l.79.79c.24.24.327.59.222.906l-.334 1.002c-.108.324-.03.68.216.94l.79.79c.292.29.392.733.282 1.15l-.333 1.168c-.144.51-.52.928-.994 1.12l-.978.396c-.314.132-.522.4-.592.702l-.213.926c-.09.542-.56.94-1.11.94h-2.593c-.55 0-1.02-.398-1.11-.94l-.213-.926c-.07-.302-.278-.57-.592-.702l-.978-.396c-.474-.192-.85-.61-.994-1.12l-.333-1.168c-.12-.417-.01-.86.282-1.15l.79-.79c.24-.24.327-.59.222-.906l-.334-1.002c-.108-.324-.03-.68-.216-.94l-.79-.79c-.292-.29-.392-.733-.282-1.15l.333-1.168c.144-.51.52-.928.994-1.12l.978-.396c.314-.132.522-.4.592-.702l.213-.926z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></IconWrapper>
);

export const CameraIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008v-.008z" /></IconWrapper>
);

export const FolderIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></IconWrapper>
);

export const HardwareIcon: React.FC<IconProps> = BrainIcon;

export const SoftwareIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" /></IconWrapper>
);

export const CalculatorIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.5m3.75-13.5l-3.75 3.75m3.75-3.75L16.5 9m-4.5 4.5v1.5m3.75-13.5l-3.75 3.75m3.75-3.75L16.5 9m-4.5 4.5v1.5m-3.75-13.5l3.75 3.75m-3.75-3.75L4.5 9m4.5 4.5v1.5m-3.75-13.5l3.75 3.75M9 13.5m-3 0a3 3 0 106 0 3 3 0 00-6 0z" /></IconWrapper>
);

export const RemoteControlIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75-10.5a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM12 12.75h.008v.008H12v-.008z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 15a2.25 2.25 0 01-2.25-2.25V7.5a2.25 2.25 0 014.5 0v5.25A2.25 2.25 0 0112 15z" /></IconWrapper>
);

export const BiohazardIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM9.75 9a.75.75 0 011.5 0v3.75a.75.75 0 01-1.5 0V9zM12 15.75a.75.75 0 100 1.5.75.75 0 000-1.5z" /></IconWrapper>
);

export const HandWavingIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM15 9.75a.75.75 0 00-1.5 0v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75zM9 9.75a.75.75 0 011.5 0v.008a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75V9.75z" /></IconWrapper>
);

export const MicIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75-10.5a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM12 12.75h.008v.008H12v-.008z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 15a2.25 2.25 0 01-2.25-2.25V7.5a2.25 2.25 0 014.5 0v5.25A2.25 2.25 0 0112 15z" /></IconWrapper>
);

export const ChevronDownIcon: React.FC<IconProps> = (props) => (
  <SolidIconWrapper {...props}><path fillRule="evenodd" d="M5.22 8.22a.75.75 0 011.06 0L12 13.94l5.72-5.72a.75.75 0 111.06 1.06l-6.25 6.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z" clipRule="evenodd" /></SolidIconWrapper>
);
