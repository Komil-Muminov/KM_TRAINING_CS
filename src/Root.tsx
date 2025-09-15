import { useCallback, useEffect, useState } from "react";
import { CSCrosshair } from "./Point";
import { ControlPanel } from "./Panel";
import { GameCanvas } from "./Game";

// 🎮 Главный компонент
export const CS16HeadshotTrainer: React.FC = () => {
    const [running, setRunning] = useState(false);
    const [headshotKills, setHeadshotKills] = useState(0);
    const [bodyKills, setBodyKills] = useState(0);
    const [misses, setMisses] = useState(0);
    const [round, setRound] = useState(1);
    const [timer, setTimer] = useState(120);
    const [crosshairStyle, setCrosshairStyle] = useState('default');
    const [gameMode, setGameMode] = useState<'aim' | 'flick' | 'tracking'>('aim');
    const [sensitivity, setSensitivity] = useState(2.0);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [showFPS, setShowFPS] = useState(false);

    // Загрузка/сохранение настроек
    useEffect(() => {
        const saved = localStorage.getItem('cs16trainer');
        if (saved) {
            const data = JSON.parse(saved);
            setCrosshairStyle(data.crosshairStyle || 'default');
            setSensitivity(data.sensitivity || 2.0);
            setSoundEnabled(data.soundEnabled !== false);
            setShowFPS(data.showFPS || false);
        }
    }, []);

    useEffect(() => {
        const data = {
            crosshairStyle,
            sensitivity,
            soundEnabled,
            showFPS,
        };
        localStorage.setItem('cs16trainer', JSON.stringify(data));
    }, [crosshairStyle, sensitivity, soundEnabled, showFPS]);

    // Обработчики событий
    const handleHit = useCallback((isHeadshot: boolean) => {
        if (isHeadshot) {
            setHeadshotKills((prev) => prev + 1);
        } else {
            setBodyKills((prev) => prev + 1);
        }
    }, []);

    const handleMiss = useCallback(() => {
        setMisses((prev) => prev + 1);
    }, []);

    const handleStart = useCallback(() => {
        setRunning((prev) => !prev);
    }, []);

    const resetStats = useCallback(() => {
        setHeadshotKills(0);
        setBodyKills(0);
        setMisses(0);
        setRound(1);
        setTimer(120);
    }, []);

    // Таймер раундов
    useEffect(() => {
        if (!running) return;

        const timerInterval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    setRound((r) => r + 1);
                    return 120;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerInterval);
    }, [running]);

    // Горячие клавиши
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                e.preventDefault();
                setRunning((prev) => !prev);
            } else if (e.code === 'KeyR') {
                e.preventDefault();
                resetStats();
            } else if (e.code === 'KeyF' && e.ctrlKey) {
                e.preventDefault();
                setShowFPS((prev) => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [resetStats]);

    return (
        <div
            className="flex flex-col items-center gap-4 p-4 bg-gray-900 min-h-screen text-white"
            style={{ fontFamily: 'monospace' }}
        >
            <ControlPanel
                running={running}
                headshotKills={headshotKills}
                bodyKills={bodyKills}
                misses={misses}
                round={round}
                timer={timer}
                gameMode={gameMode}
                crosshairStyle={crosshairStyle}
                sensitivity={sensitivity}
                soundEnabled={soundEnabled}
                showFPS={showFPS}
                onStart={handleStart}
                onReset={resetStats}
                onGameModeChange={setGameMode}
                onCrosshairChange={setCrosshairStyle}
                onSensitivityChange={setSensitivity}
                onSoundToggle={setSoundEnabled}
                onFPSToggle={setShowFPS}
            />

            <GameCanvas
                running={running}
                gameMode={gameMode}
                round={round}
                onHit={handleHit}
                onMiss={handleMiss}
                soundEnabled={soundEnabled}
                showFPS={showFPS}
            />

            <CSCrosshair style={crosshairStyle} isVisible={running} />
        </div>
    );
};
