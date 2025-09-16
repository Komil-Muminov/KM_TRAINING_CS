// Компонент панели управления
interface ControlPanelProps {
    running: boolean;
    headshotKills: number;
    bodyKills: number;
    misses: number;
    round: number;
    timer: number;
    gameMode: 'aim' | 'flick' | 'tracking' | 'headshot-only';
    crosshairStyle: string;
    sensitivity: number;
    soundEnabled: boolean;
    showFPS: boolean;
    distanceMode: boolean;
    onStart: () => void;
    onReset: () => void;
    onGameModeChange: (mode: 'aim' | 'flick' | 'tracking' | 'headshot-only') => void;
    onCrosshairChange: (style: string) => void;
    onSensitivityChange: (value: number) => void;
    onSoundToggle: (enabled: boolean) => void;
    onFPSToggle: (enabled: boolean) => void;
    onDistanceModeToggle: (enabled: boolean) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
    running,
    headshotKills,
    bodyKills,
    misses,
    round,
    timer,
    gameMode,
    crosshairStyle,
    sensitivity,
    soundEnabled,
    showFPS,
    distanceMode,
    onStart,
    onReset,
    onGameModeChange,
    onCrosshairChange,
    onSensitivityChange,
    onSoundToggle,
    onFPSToggle,
    onDistanceModeToggle,
}) => {
    const totalKills = headshotKills + bodyKills;
    const totalShots = headshotKills + bodyKills + misses;
    const headshotPercentage = totalKills > 0 ? ((headshotKills / totalKills) * 100).toFixed(1) : '0';
    const accuracy = totalShots > 0 ? ((totalKills / totalShots) * 100).toFixed(1) : '0';

    return (
        <div className="w-full max-w-lg bg-gray-800 border border-gray-700 rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4 text-center text-orange-400">
                🔫 Counter-Strike 1.6 Headshot Trainer
            </h2>

            <div className="flex gap-2 mb-4">
                <button
                    onClick={onStart}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
                >
                    {running ? '⏸️ Пауза' : '▶️ Старт'}
                </button>
                <button
                    onClick={onReset}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold"
                >
                    🔄 Сброс
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="text-white text-sm block mb-1">Режим игры:</label>
                    <select
                        value={gameMode}
                        onChange={(e) => onGameModeChange(e.target.value as any)}
                        className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
                        disabled={running}
                    >
                        <option value="aim">🎯 Точность</option>
                        <option value="flick">⚡ Флик-шоты</option>
                        <option value="tracking">📍 Трекинг</option>
                        <option value="headshot-only">💀 Только хедшоты</option>
                    </select>
                </div>
                <div>
                    <label className="text-white text-sm block mb-1">Прицел:</label>
                    <select
                        value={crosshairStyle}
                        onChange={(e) => onCrosshairChange(e.target.value)}
                        className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
                    >
                        <option value="default">+ Стандартный</option>
                        <option value="small">⊕ Маленький</option>
                        <option value="dot">• Точка</option>
                        <option value="cross">✚ Крест</option>
                    </select>
                </div>
            </div>

            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm">🔊 Звук:</span>
                    <button
                        onClick={() => onSoundToggle(!soundEnabled)}
                        className={`w-10 h-6 rounded-full ${
                            soundEnabled ? 'bg-blue-600' : 'bg-gray-600'
                        } relative transition-colors`}
                    >
                        <div
                            className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                                soundEnabled ? 'translate-x-5' : 'translate-x-1'
                            }`}
                        ></div>
                    </button>
                </div>

                <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm">📊 FPS:</span>
                    <button
                        onClick={() => onFPSToggle(!showFPS)}
                        className={`w-10 h-6 rounded-full ${
                            showFPS ? 'bg-blue-600' : 'bg-gray-600'
                        } relative transition-colors`}
                    >
                        <div
                            className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                                showFPS ? 'translate-x-5' : 'translate-x-1'
                            }`}
                        ></div>
                    </button>
                </div>

                <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm">📏 Разные дистанции:</span>
                    <button
                        onClick={() => onDistanceModeToggle(!distanceMode)}
                        className={`w-10 h-6 rounded-full ${
                            distanceMode ? 'bg-blue-600' : 'bg-gray-600'
                        } relative transition-colors`}
                    >
                        <div
                            className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                                distanceMode ? 'translate-x-5' : 'translate-x-1'
                            }`}
                        ></div>
                    </button>
                </div>

                <div>
                    <span className="text-white text-sm">🖱️ Чувствительность: {sensitivity.toFixed(1)}</span>
                    <input
                        type="range"
                        min={0.5}
                        max={5.0}
                        step={0.1}
                        value={sensitivity}
                        onChange={(e) => onSensitivityChange(parseFloat(e.target.value))}
                        className="w-full mt-1"
                    />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-gray-700 p-2 rounded text-center">
                    <div className="text-blue-400">Раунд {round}</div>
                    <div className="text-yellow-400">
                        {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                    </div>
                </div>
                <div className="bg-gray-700 p-2 rounded text-center">
                    <div className="text-red-400">💀 HS: {headshotKills}</div>
                    {gameMode !== 'headshot-only' && <div className="text-orange-400">🎯 Body: {bodyKills}</div>}
                    {gameMode === 'headshot-only' && <div className="text-gray-500">Body отключено</div>}
                </div>
                <div className="bg-gray-700 p-2 rounded text-center">
                    <div className="text-gray-400">Miss: {misses}</div>
                    <div className="text-green-400">Acc: {accuracy}%</div>
                </div>
            </div>

            <div className="mt-2 text-center">
                <div className="text-red-400 font-bold">Headshot Rate: {headshotPercentage}%</div>
                <div className="text-purple-400">K/D: {(totalKills / Math.max(misses, 1)).toFixed(2)}</div>
            </div>

            <div className="mt-4 text-xs text-gray-400 text-center">
                Горячие клавиши: Space - пауза, R - сброс, Ctrl+F - FPS
                <br />
                🔴 Красная обводка = хитбокс головы
                <br />
                {gameMode === 'flick' && '⚡ Режим флик-шотов: быстрые цели!'}
                {gameMode === 'tracking' && '📍 Режим трекинга: движущиеся цели!'}
                {gameMode === 'aim' && '🎯 Режим точности: тренировка прицеливания!'}
                {gameMode === 'headshot-only' && '💀 Только хедшоты: попадания в тело не засчитываются!'}
            </div>

            {headshotKills > 0 && headshotKills % 5 === 0 && (
                <div className="mt-2 text-center">
                    <div className="text-2xl font-bold text-red-400 animate-pulse">🔥 {headshotKills} HEADSHOTS!</div>
                </div>
            )}
        </div>
    );
};
