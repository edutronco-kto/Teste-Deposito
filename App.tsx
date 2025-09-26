import React, { useState, createContext, useContext, useMemo, useCallback, useEffect } from 'react';

// SECTION: TYPES
enum Screen {
  Register,
  Verification,
  Home,
  DepositSelect,
  DepositConfirm,
  DepositAmount,
  DepositReview,
}

enum PixKeyType {
  CPF = 'CPF',
  Email = 'Email',
  Celular = 'Celular',
  Aleatoria = 'Chave aleatória',
}

interface UserData {
  cpf: string;
  email: string;
  phone: string;
}

// SECTION: ICONS
interface IconProps {
  className?: string;
}

const CloseIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const CheckCircleIcon: React.FC<IconProps> = ({ className = 'w-16 h-16' }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
  </svg>
);

const PlusIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const ChevronRightIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

const ArrowLeftIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
);

const InfoIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
  </svg>
);

const CpfIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
);

const EmailIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
);

const PhoneIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18h3" />
    </svg>
);

const RandomKeyIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

const CheckIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
);


// START: NEW ICONS FOR HOME SCREEN
const HamburgerIcon = () => <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>;
const BellIcon = () => <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
const SearchIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const SoccerIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5C7.5 4.5 4.5 7.5 4.5 12s3 7.5 7.5 7.5 7.5-3 7.5-7.5S16.5 4.5 12 4.5zM12 19.5L7.5 12l4.5-7.5 4.5 7.5-4.5 7.5zm0 0V4.5m-4.5 7.5h9" /></svg>;
const BasketballIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5a7.5 7.5 0 110 15 7.5 7.5 0 010-15zm0 0c-2.3 0-4.4.9-6 2.3M18 6.8a7.5 7.5 0 01-12 10.4m12-10.4L6 17.2" /></svg>;
const TennisIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5a7.5 7.5 0 110 15 7.5 7.5 0 010-15zm-3.4 2.1a7.5 7.5 0 016.8 10.8" /></svg>;
const AmericanFootballIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5c-4.1 0-7.5 3.4-7.5 7.5s3.4 7.5 7.5 7.5 7.5-3.4 7.5-7.5-3.4-4.5-7.5-4.5zm0 15c-3 0-5.5-2-6.7-4.7m13.4 0A7.4 7.4 0 0012 7.5" /></svg>;
const BaseballIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5a7.5 7.5 0 110 15 7.5 7.5 0 010-15zm-3.5 3.5l7 7m-7 0l7-7" /></svg>;
const BoxingIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5a7.5 7.5 0 017.5 7.5c0 1.5-.4 2.9-1.2 4.1l-2.3 2.3a4.5 4.5 0 01-6.4 0L7.2 16.1A7.5 7.5 0 0112 4.5z" /></svg>;
const GreenCheckIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" /></svg>;
const FootballIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

const SportsShoeIcon = () => <svg className="w-7 h-7 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 16V7a1 1 0 0 1 1-1h8"/><path d="M17.5 16.5a2.5 2.5 0 1 1-5 0"/><path d="M4 16h16"/></svg>;
const LiveIconSvg = () => <svg className="w-7 h-7 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="10" rx="2"/><path d="M7 12h2l2-3 2 3h2"/></svg>;
const ClockIcon = () => <svg className="w-7 h-7 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>;
const BetslipIcon = () => <svg className="w-7 h-7 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 7h4"/><path d="M8 11h.01"/><path d="M8 7h.01"/><rect x="8" y="4" width="8" height="4" rx="1"/></svg>;
const ExploreIcon = () => <svg className="w-7 h-7 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 16-4-4 4-4"/><path d="m6 8 4 4-4 4"/><path d="M12 20V4"/></svg>;
const CasinoChipIcon = () => <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm4.5-8a1.5 1.5 0 1 1-1.5-1.5 1.5 1.5 0 0 1 1.5 1.5zm-3 0a1.5 1.5 0 1 1-1.5-1.5 1.5 1.5 0 0 1 1.5 1.5zm-3 0a1.5 1.5 0 1 1-1.5-1.5 1.5 1.5 0 0 1 1.5 1.5z"/></svg>;
// END: NEW ICONS

// SECTION: CONTEXT
interface AppContextType {
  setScreen: (screen: Screen) => void;
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  selectedPixKey: PixKeyType | null;
  setSelectedPixKey: React.Dispatch<React.SetStateAction<PixKeyType | null>>;
  depositAmount: string;
  setDepositAmount: React.Dispatch<React.SetStateAction<string>>;
  showToast: (message: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

// SECTION: HELPER FUNCTIONS & COMPONENTS
const formatCPF = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .substring(0, 14);
};

const Header: React.FC<{ title: string; variant?: 'dark' | 'light'; onBack?: () => void; showClose?: boolean; onClose: () => void; }> = ({ title, variant = 'dark', onBack, showClose = true, onClose }) => {
    const isDark = variant === 'dark';
    const bgColor = isDark ? 'bg-black' : 'bg-white';
    const textColor = isDark ? 'text-white' : 'text-black';

    return (
        <div className={`${bgColor} ${textColor} p-4 flex items-center justify-center relative h-14`}>
            {onBack && (
                <button onClick={onBack} className="absolute left-4">
                    <ArrowLeftIcon className="w-5 h-5" />
                </button>
            )}
            <h1 className="text-lg font-semibold">{title}</h1>
            {showClose && (
                <button onClick={onClose} className="absolute right-4">
                    <CloseIcon className="w-5 h-5" />
                </button>
            )}
        </div>
    );
};

const Toast: React.FC<{ message: string; onClose: () => void; }> = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 10000); // 10 seconds

        return () => {
            clearTimeout(timer);
        };
    }, [onClose]);

    return (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-11/12 max-w-sm bg-[#00e77c] text-black p-4 rounded-lg shadow-lg flex justify-between items-center z-50 animate-fade-in-down">
            <span className="font-medium">{message}</span>
            <button onClick={onClose}>
                <CloseIcon className="w-5 h-5" />
            </button>
        </div>
    );
};


// SECTION: SCREEN COMPONENTS
const RegisterScreen: React.FC = () => {
    const { setScreen, userData, setUserData } = useAppContext();
    const [localCpf, setLocalCpf] = useState(userData.cpf);

    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalCpf(formatCPF(e.target.value));
    };

    const handleNext = () => {
        setUserData(prev => ({ ...prev, cpf: localCpf }));
        setScreen(Screen.Verification);
    };

    const isFormValid = useMemo(() => {
        return localCpf.length === 14 && userData.email.includes('@') && userData.phone.length === 11;
    }, [localCpf, userData.email, userData.phone]);

    return (
        <div className="flex flex-col h-full bg-white">
            <Header title="Registro" variant="dark" showClose={false} onClose={() => {}} />
            <div className="p-6 flex-grow">
                <h2 className="text-2xl font-bold mb-6 text-black">Registre-se na KTO</h2>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700">CPF</label>
                        <input
                            type="text"
                            placeholder="999.999.999-99"
                            value={localCpf}
                            onChange={handleCpfChange}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 text-black"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            placeholder="Preencha seu email"
                            value={userData.email}
                            onChange={e => setUserData(prev => ({ ...prev, email: e.target.value }))}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 text-black"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Telefone</label>
                        <input
                            type="tel"
                            placeholder="(99) 99999-9999"
                            value={userData.phone}
                            maxLength={11}
                            onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, '').slice(0, 11) }))}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 text-black"
                        />
                    </div>
                </div>
            </div>
            <div className="p-6">
                <button
                    onClick={handleNext}
                    disabled={!isFormValid}
                    className={`w-full text-center py-3 rounded-md font-semibold transition-colors ${isFormValid ? 'bg-[#00e77c] text-black' : 'bg-gray-200 text-gray-500'}`}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

const VerificationScreen: React.FC = () => {
    const { setScreen } = useAppContext();
    return (
        <div className="flex flex-col h-full bg-white">
            <Header title="Verification" onClose={() => setScreen(Screen.Home)} />
            <div className="flex-grow flex flex-col justify-center items-center text-center p-6">
                <CheckCircleIcon className="w-20 h-20 text-[#00e77c] mb-6" />
                <h2 className="text-2xl font-bold text-black mb-2">Sua conta está ativada!</h2>
                <p className="text-gray-600">Que tal fazer seu primeiro depósito?</p>
            </div>
            <div className="p-6 space-y-3">
                <button
                    onClick={() => setScreen(Screen.DepositSelect)}
                    className="w-full text-center py-3 rounded-md text-black font-semibold bg-[#00e77c] hover:opacity-90 transition-opacity"
                >
                    Depositar
                </button>
                <button
                    onClick={() => setScreen(Screen.Home)}
                    className="w-full text-center py-3 rounded-md text-gray-600 font-semibold hover:bg-gray-100 transition-colors"
                >
                    Agora não
                </button>
            </div>
        </div>
    );
};

const HomeScreen: React.FC = () => {
    const { setScreen } = useAppContext();

    const sportsIcons = [
        { icon: <SearchIcon />, key: 'search' },
        { icon: <SoccerIcon />, key: 'soccer' },
        { icon: <BasketballIcon />, key: 'basketball' },
        { icon: <TennisIcon />, key: 'tennis' },
        { icon: <AmericanFootballIcon />, key: 'football' },
        { icon: <BaseballIcon />, key: 'baseball' },
        { icon: <BoxingIcon />, key: 'boxing' },
    ];
    
    const MatchRow = ({ time, teams, odds }: {time:string, teams: string[], odds: string[]}) => (
        <div className="flex items-center py-4 border-b border-gray-800">
            <div className="w-1/3 text-xs pr-2">
                <p className="text-gray-400">{time}</p>
                <p className="font-bold text-base mt-1">{teams[0]}</p>
                <p className="font-bold text-base">{teams[1]}</p>
                <a href="#" className="text-gray-400 mt-2 inline-block">Mostrar mais apostas &gt;</a>
            </div>
            <div className="w-2/3 grid grid-cols-3 gap-2">
                {odds.map((odd, index) => (
                    <button key={index} className="bg-[#2a2a2a] py-3 rounded-md text-base font-bold">
                        {odd}
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-[#0c0c0c] text-white font-sans">
            <header className="bg-black p-3 flex items-center justify-between sticky top-0 z-20 h-14 shrink-0">
                <div className="flex items-center space-x-4">
                    <HamburgerIcon />
                    <BellIcon />
                </div>
                <div className="absolute left-1/2 -translate-x-1/2">
                     <svg className="h-7" viewBox="0 0 100 40"><text x="50" y="30" fontSize="35" fontWeight="bold" fill="red" textAnchor="middle">KTO</text></svg>
                </div>
                <button onClick={() => setScreen(Screen.DepositSelect)} className="bg-[#2a2a2a] rounded-full p-0.5 flex items-center space-x-2 pl-3">
                    <span className="text-sm font-semibold">R$ 0,00</span>
                    <div className="bg-[#00e77c] rounded-full p-1.5">
                        <PlusIcon className="w-4 h-4 text-black" />
                    </div>
                </button>
            </header>

            <main className="flex-grow overflow-y-auto pb-24">
                <section className="p-3">
                    <div className="flex space-x-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                        {sportsIcons.map((item) => (
                           <div key={item.key} className="bg-[#2a2a2a] rounded-full p-3 flex-shrink-0">
                             {item.icon}
                           </div>
                        ))}
                    </div>
                </section>

                <section className="px-3">
                    <div className="h-40 rounded-lg bg-cover bg-center relative" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400')" }}>
                        <div className="absolute inset-0 bg-red-700 opacity-60 rounded-lg"></div>
                    </div>
                </section>

                <section className="p-3">
                   <h2 className="text-xl font-bold mt-4">Top Events Widget</h2>
                   <div className="flex items-center space-x-2 text-green-400 mt-1">
                       <GreenCheckIcon />
                       <p className="text-gray-300">Encontre sua aposta em nossos destaques de ligas</p>
                   </div>
                   
                   <div className="flex space-x-2 mt-4">
                       <button className="bg-[#3a3a3a] px-4 py-2 rounded-full font-semibold">Top sports</button>
                       <button className="bg-[#1e1e1e] px-4 py-2 rounded-full text-gray-400">Teaser+</button>
                   </div>

                   <div className="border-b border-gray-800 mt-4">
                       <div className="flex space-x-4 text-sm text-gray-400">
                           <button className="py-2 text-white border-b-2 border-white">Série A</button>
                           <button className="py-2">Bundesliga - Masculinos</button>
                           <button className="py-2">Premier League</button>
                       </div>
                   </div>

                   <div className="border-b border-gray-800 mt-0">
                       <div className="flex space-x-4 text-sm text-gray-400">
                           <button className="py-2 text-white">Match</button>
                           <button className="py-2">Total</button>
                           <button className="py-2">Both Teams To Score</button>
                       </div>
                   </div>

                   <div className="flex items-center space-x-2 text-gray-400 mt-4 text-sm">
                       <FootballIcon/>
                       <span>Futebol / Itália / Série A</span>
                       <div className="flex-grow grid grid-cols-3 text-center font-semibold">
                           <span>1</span>
                           <span>X</span>
                           <span>2</span>
                       </div>
                   </div>
                   
                   <MatchRow time="qua. @ 20:00" teams={['Internazionale', 'Como']} odds={['1.50', '2.00', '2.50']} />
                   <MatchRow time="qui. @ 00:00" teams={['Roma', '']} odds={['1.50', '2.00', '2.50']} />
                </section>
            </main>

            <footer className="bg-black fixed bottom-0 w-full max-w-sm h-20 flex items-start pt-2 justify-around text-center text-xs text-gray-400 border-t border-gray-800 z-10">
                <div className="flex flex-col items-center text-white relative pt-1">
                  <SportsShoeIcon />
                  <span className="mt-1">Esportes</span>
                  <div className="absolute -bottom-2 w-10 h-1 bg-red-600 rounded-t-sm"></div>
                </div>
                <div className="flex flex-col items-center pt-1">
                  <LiveIconSvg />
                   <span className="mt-1">Ao Vivo</span>
                </div>
                <div className="flex flex-col items-center pt-1">
                  <ClockIcon />
                   <span className="mt-1">Em Breve</span>
                </div>
                <div className="flex flex-col items-center pt-1">
                  <BetslipIcon />
                  <span className="mt-1">Apostas</span>
                </div>
                <div className="flex flex-col items-center pt-1">
                  <ExploreIcon />
                  <span className="mt-1">Explorar</span>
                </div>
                <div className="relative">
                   <div className="bg-[#1e1e1e] rounded-full p-1 border-2 border-green-500">
                      <CasinoChipIcon />
                   </div>
                </div>
            </footer>
        </div>
    );
};

const DepositSelectScreen: React.FC = () => {
    const { setScreen, setSelectedPixKey } = useAppContext();

    const handleSelect = (key: PixKeyType) => {
        setSelectedPixKey(key);
        setScreen(Screen.DepositConfirm);
    };

    const pixOptions: { key: PixKeyType, icon: React.ReactNode }[] = [
        { key: PixKeyType.CPF, icon: <CpfIcon className="w-5 h-5 text-gray-600"/> },
        { key: PixKeyType.Email, icon: <EmailIcon className="w-5 h-5 text-gray-600"/> },
        { key: PixKeyType.Celular, icon: <PhoneIcon className="w-5 h-5 text-gray-600"/> },
        { key: PixKeyType.Aleatoria, icon: <RandomKeyIcon className="w-5 h-5 text-gray-600"/> }
    ];

    return (
        <div className="flex flex-col h-full bg-white">
            <Header title="Depósito" onClose={() => setScreen(Screen.Home)} />
            <div className="p-6">
                <h2 className="text-2xl font-bold text-black">Para começar, selecione sua chave PIX favorita.</h2>
                <p className="text-gray-600 mt-2 mb-8">Você usará a conta bancária dessa chave para depositar e sacar na KTO.</p>
                <div className="divide-y divide-gray-200">
                    {pixOptions.map(option => (
                        <button key={option.key} onClick={() => handleSelect(option.key)} className="w-full flex items-center justify-between py-4 hover:bg-gray-50 transition-colors text-left">
                            <div className="flex items-center space-x-4">
                                {option.icon}
                                <span className="font-medium text-gray-800">{option.key}</span>
                            </div>
                            <ChevronRightIcon className="w-3 h-3 text-gray-400" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const DepositConfirmScreen: React.FC = () => {
    const { setScreen, userData, setUserData, selectedPixKey, showToast } = useAppContext();
    const [isChecked, setIsChecked] = useState(false);
    const [randomKey, setRandomKey] = useState(''); // For 'Chave aleatória'

    const isEditable = selectedPixKey !== PixKeyType.CPF;
    const isRandomKey = selectedPixKey === PixKeyType.Aleatoria;

    const handleContinue = () => {
        setScreen(Screen.DepositAmount);
    }

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        switch (selectedPixKey) {
            case PixKeyType.Email:
                setUserData(prev => ({ ...prev, email: value }));
                break;
            case PixKeyType.Celular:
                setUserData(prev => ({ ...prev, phone: value.replace(/\D/g, '') }));
                break;
            case PixKeyType.Aleatoria:
                setRandomKey(value);
                break;
        }
    };

    const getValue = () => {
        switch (selectedPixKey) {
            case PixKeyType.CPF: return userData.cpf;
            case PixKeyType.Email: return userData.email;
            case PixKeyType.Celular: return userData.phone;
            case PixKeyType.Aleatoria: return randomKey;
            default: return '';
        }
    };

    return (
        <div className="flex flex-col h-full bg-white">
            <Header title="Depósito" onBack={() => setScreen(Screen.DepositSelect)} onClose={() => setScreen(Screen.Home)} />
            <div className="p-6 flex-grow">
                <h2 className="text-2xl font-bold text-black">Confirme sua chave PIX.</h2>
                <p className="text-gray-600 mt-2 mb-8">Confirme que a conta bancária vinculada a esta chave é sua para garantir depósitos e saques com segurança.</p>

                <div>
                    <label className="text-sm font-medium text-gray-700">{selectedPixKey}</label>
                    {isEditable ? (
                        <input
                            type={selectedPixKey === PixKeyType.Email ? 'email' : 'text'}
                            value={getValue()}
                            onChange={handleValueChange}
                            placeholder={isRandomKey ? 'Insira sua chave aleatória' : ''}
                            className="mt-1 block w-full px-3 py-3 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 text-black"
                        />
                    ) : (
                        <div className="mt-1 block w-full px-3 py-3 bg-gray-100 border border-gray-200 rounded-md text-black">
                            {getValue()}
                        </div>
                    )}
                </div>

                <div className="flex items-start mt-6">
                    <button
                        type="button"
                        role="checkbox"
                        aria-checked={isChecked}
                        onClick={() => setIsChecked(!isChecked)}
                        className={`h-6 w-6 border rounded shrink-0 mt-1 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00e77c] ${
                            isChecked ? 'bg-[#00e77c] border-[#00e77c]' : 'bg-white border-gray-300'
                        }`}
                    >
                        {isChecked && (
                            <svg className="w-4 h-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                        )}
                    </button>
                    <label onClick={() => setIsChecked(!isChecked)} className="ml-3 text-sm text-gray-600 cursor-pointer select-none">
                        Autorizo o armazenamento dos meus dados bancários vinculados a esta chave PIX para uso em depósitos e saques na minha conta KTO.
                    </label>
                </div>

            </div>

            <div className="p-6 space-y-4">
                 <div className="bg-gray-100 p-4 rounded-lg flex items-start space-x-3">
                    <InfoIcon className="text-gray-500 shrink-0 mt-1 w-7 h-7"/>
                    <div>
                        <h3 className="font-bold text-gray-800">Atenção!</h3>
                        <p className="text-sm text-gray-600">Vamos transferir R$0.01 para a conta bancária vinculada a sua chave PIX para garantir que é válida. Isso não afetará seu saldo na KTO.</p>
                    </div>
                </div>
                <button
                    onClick={handleContinue}
                    disabled={!isChecked}
                    className="w-full text-center py-3 rounded-md text-black font-semibold transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed bg-[#00e77c] enabled:hover:opacity-90"
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

const DepositAmountScreen: React.FC = () => {
    const { setScreen, depositAmount, setDepositAmount, showToast } = useAppContext();
    const [localAmount, setLocalAmount] = useState(depositAmount);
    
    useEffect(() => {
        showToast("Chave Pix verificada e conta validada com sucesso!");
    }, [showToast]);

    const presetAmounts = ["10", "15", "20", "30", "50", "100"];

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setLocalAmount(value);
    };

    const handleContinue = () => {
        setDepositAmount(localAmount);
        setScreen(Screen.DepositReview);
    };
    
    return (
         <div className="flex flex-col h-full bg-white">
            <Header title="Depósito" onBack={() => setScreen(Screen.DepositConfirm)} onClose={() => setScreen(Screen.Home)} />
            <div className="p-6 flex-grow">
                <h2 className="text-2xl font-bold text-black mb-6">Valor do depósito</h2>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black text-lg font-bold">R$</span>
                    <input
                        type="text"
                        value={localAmount}
                        onChange={handleAmountChange}
                        className="w-full pl-12 pr-10 py-3 bg-white border border-gray-300 rounded-md text-lg font-bold shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-black"
                    />
                     {parseInt(localAmount) >= 10 && <CheckIcon className="w-5 h-5 text-green-500 absolute right-3 top-1/2 -translate-y-1/2"/>}
                </div>
                
                <div className="grid grid-cols-3 gap-3 mt-4">
                    {presetAmounts.map(amount => (
                        <button key={amount} onClick={() => setLocalAmount(amount)} className={`py-3 rounded-md font-semibold text-sm ${localAmount === amount ? 'bg-[#00e77c] text-black' : 'bg-gray-100 text-gray-800'}`}>
                            R$ {amount}
                        </button>
                    ))}
                </div>

                <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>Min R$ 10</span>
                    <span>Max R$ 10,000</span>
                </div>
            </div>
            <div className="p-6">
                <button
                    onClick={handleContinue}
                    disabled={!localAmount || parseInt(localAmount) < 10}
                    className="w-full text-center py-3 rounded-md text-black font-semibold transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed bg-[#00e77c] enabled:hover:opacity-90"
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

const DepositReviewScreen: React.FC = () => {
    const { setScreen, depositAmount, showToast } = useAppContext();

    const handleCopy = () => {
        const pixCode = "0002010102122683001400...";
        navigator.clipboard.writeText(pixCode).then(() => {
            showToast("Código copiado com sucesso");
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    return (
        <div className="flex flex-col h-full bg-white">
            <Header title="Depósito" onBack={() => setScreen(Screen.DepositAmount)} onClose={() => setScreen(Screen.Home)} />
            <div className="p-6 flex-grow">
                <h2 className="text-2xl font-bold text-black mb-6">Revise as informações e complete o depósito</h2>

                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-500">Valor a ser pago</p>
                        <p className="text-4xl font-bold text-black">R$ {depositAmount}</p>
                    </div>
                    <button onClick={() => setScreen(Screen.DepositAmount)} className="text-sm font-semibold text-gray-700 flex items-center space-x-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>
                        <span>Alterar</span>
                    </button>
                </div>
                
                <hr className="my-6"/>

                <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Banco:</span> <span className="font-medium text-gray-800">Seu Banco</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Agência:</span> <span className="font-medium text-gray-800">001</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Conta Corrente:</span> <span className="font-medium text-gray-800">1234567890</span></div>
                </div>

                 <div className="bg-gray-100 p-4 rounded-lg flex items-start space-x-3 mt-8">
                    <InfoIcon className="text-gray-500 shrink-0 mt-1 w-6 h-6"/>
                    <div>
                        <h3 className="font-bold text-gray-800">Importante!</h3>
                        <p className="text-sm text-gray-600">Apenas depósitos de contas cadastradas no nome do titular serão aceitos. Os demais serão reembolsados em até 24h.</p>
                    </div>
                </div>
            </div>
            <div className="p-6 border-t">
                <p className="text-center font-semibold mb-3 text-gray-800">Copie o código PIX abaixo</p>
                <div className="flex space-x-2">
                    <input type="text" readOnly value="0002010102122683001400..." className="w-full bg-gray-100 rounded-md px-3 text-sm border-gray-200 text-gray-600"/>
                    <button onClick={handleCopy} className="bg-[#00e77c] text-black font-semibold px-6 py-3 rounded-md text-sm">Copiar</button>
                </div>
                 <button className="w-full text-center py-2 text-gray-600 font-semibold mt-2">Abrir QR Code</button>
            </div>
        </div>
    );
};


// SECTION: MAIN APP COMPONENT
const App: React.FC = () => {
    const [screen, setScreen] = useState<Screen>(Screen.Register);
    const [userData, setUserData] = useState<UserData>({ cpf: '', email: '', phone: '' });
    const [selectedPixKey, setSelectedPixKey] = useState<PixKeyType | null>(null);
    const [depositAmount, setDepositAmount] = useState('50');
    const [toastMessage, setToastMessage] = useState('');

    const showToast = useCallback((message: string) => {
        setToastMessage(message);
    }, []);

    const contextValue = useMemo(() => ({
        setScreen,
        userData,
        setUserData,
        selectedPixKey,
        setSelectedPixKey,
        depositAmount,
        setDepositAmount,
        showToast,
    }), [userData, selectedPixKey, depositAmount, showToast]);

    const renderScreen = useCallback(() => {
        switch (screen) {
            case Screen.Register: return <RegisterScreen />;
            case Screen.Verification: return <VerificationScreen />;
            case Screen.Home: return <HomeScreen />;
            case Screen.DepositSelect: return <DepositSelectScreen />;
            case Screen.DepositConfirm: return <DepositConfirmScreen />;
            case Screen.DepositAmount: return <DepositAmountScreen />;
            case Screen.DepositReview: return <DepositReviewScreen />;
            default: return <RegisterScreen />;
        }
    }, [screen]);

    return (
        <AppContext.Provider value={contextValue}>
            <div className="bg-gray-800 flex justify-center font-sans">
                <div className="w-full max-w-sm min-h-screen bg-white shadow-2xl overflow-hidden relative">
                    {renderScreen()}
                    {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}
                </div>
            </div>
        </AppContext.Provider>
    );
};

export default App;
