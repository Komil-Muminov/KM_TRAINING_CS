import { Button, Card, Select, Slider, Switch } from 'antd';
// Компонент ControlPanel
interface ControlPanelProps {
    running: boolean;
    headshotKills: number;
    bodyKills: number;
    misses: number;
    round: number;
    timer: number;
    gameMode: 'aim' | 'flick' | 'tracking';
    crosshairStyle: string;
    sensitivity: number;
    soundEnabled: boolean;
    showFPS: boolean;
    onStart: () => void;
    onReset: () => void;
    onGameModeChange: (mode: 'aim' | 'flick' | 'tracking') => void;
    onCrosshairChange: (style: string) => void;
    onSensitivityChange: (value: number) => void;
    onSoundToggle: (enabled: boolean) => void;
    onFPSToggle: (enabled: boolean) => void;
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
    onStart,
    onReset,
    onGameModeChange,
    onCrosshairChange,
    onSensitivityChange,
    onSoundToggle,
    onFPSToggle,
}) => {
    const totalKills = headshotKills + bodyKills;
    const totalShots = headshotKills + bodyKills + misses;
    const headshotPercentage = totalKills > 0 ? ((headshotKills / totalKills) * 100).toFixed(1) : '0';
    const accuracy = totalShots > 0 ? ((totalKills / totalShots) * 100).toFixed(1) : '0';

    const { Option } = Select;
    return (
        <Card className="w-full max-w-lg bg-gray-800 border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-center text-orange-400">
                🔫 Counter-Strike 1.6 Headshot Trainer
            </h2>

            <div className="flex gap-2 mb-4">
                <Button type="primary" onClick={onStart} className="flex-1" size="large">
                    {running ? '⏸️ Пауза' : '▶️ Старт'}
                </Button>
                <Button onClick={onReset} className="flex-1" size="large">
                    🔄 Сброс
                </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="text-white text-sm">Режим игры:</label>
                    <Select value={gameMode} onChange={onGameModeChange} className="w-full" disabled={running}>
                        <Option value="aim">🎯 Точность</Option>
                        <Option value="flick">⚡ Флик-шоты</Option>
                        <Option value="tracking">📍 Трекинг</Option>
                    </Select>
                </div>
                <div>
                    <label className="text-white text-sm">Прицел:</label>
                    <Select value={crosshairStyle} onChange={onCrosshairChange} className="w-full">
                        <Option value="default">+ Стандартный</Option>
                        <Option value="small">⊕ Маленький</Option>
                        <Option value="dot">• Точка</Option>
                        <Option value="cross">✚ Крест</Option>
                    </Select>
                </div>
            </div>

            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm">🔊 Звук:</span>
                    <Switch checked={soundEnabled} onChange={onSoundToggle} size="small" />
                </div>

                <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm">📊 FPS:</span>
                    <Switch checked={showFPS} onChange={onFPSToggle} size="small" />
                </div>

                <div>
                    <span className="text-white text-sm">🖱️ Чувствительность: {sensitivity.toFixed(1)}</span>
                    <Slider min={0.5} max={5.0} step={0.1} value={sensitivity} onChange={onSensitivityChange} />
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
                    <div className="text-orange-400">🎯 Body: {bodyKills}</div>
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
            </div>

            {headshotKills > 0 && headshotKills % 5 === 0 && (
                <div className="mt-2 text-center">
                    <div className="text-2xl font-bold text-red-400 animate-pulse">🔥 {headshotKills} HEADSHOTS!</div>
                </div>
            )}
        </Card>
    );
};
