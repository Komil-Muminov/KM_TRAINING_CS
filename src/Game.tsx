import { useCallback, useEffect, useRef, useState } from 'react';
interface GameCanvasProps {
    running: boolean;
    gameMode: 'aim' | 'flick' | 'tracking';
    round: number;
    onHit: (isHeadshot: boolean) => void;
    onMiss: () => void;
    soundEnabled: boolean;
    showFPS: boolean;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
    running,
    gameMode,
    round,
    onHit,
    onMiss,
    soundEnabled,
    showFPS,
}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animationRef = useRef<number>();
    const audioContextRef = useRef<AudioContext | null>(null);
    const [fps, setFps] = useState(0);

    // Типы для игровых объектов
    interface CSTarget {
        x: number;
        y: number;
        width: number;
        height: number;
        vx: number;
        vy: number;
        life: number;
        team: 'terrorist' | 'counter';
        stance: 'standing' | 'crouching';
        moving: boolean;
        headX: number;
        headY: number;
        headSize: number;
        bodyHit: boolean;
    }

    interface Particle {
        x: number;
        y: number;
        vx: number;
        vy: number;
        life: number;
        maxLife: number;
        color: string;
    }

    const targetsRef = useRef<CSTarget[]>([]);
    const particlesRef = useRef<Particle[]>([]);
    const fpsRef = useRef({ lastTime: 0, frames: 0 });

    const rand = (min: number, max: number) => Math.random() * (max - min) + min;

    // CS 1.6 звуки
    const playCSSound = useCallback(
        (type: 'headshot' | 'hit' | 'miss') => {
            if (!soundEnabled) return;

            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }

            const ctx = audioContextRef.current;
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            switch (type) {
                case 'headshot':
                    oscillator.frequency.setValueAtTime(1200, ctx.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
                    oscillator.type = 'square';
                    gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
                    oscillator.start(ctx.currentTime);
                    oscillator.stop(ctx.currentTime + 0.15);
                    break;
                case 'hit':
                    oscillator.frequency.setValueAtTime(600, ctx.currentTime);
                    oscillator.type = 'sine';
                    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
                    oscillator.start(ctx.currentTime);
                    oscillator.stop(ctx.currentTime + 0.1);
                    break;
                case 'miss':
                    oscillator.frequency.setValueAtTime(150, ctx.currentTime);
                    oscillator.type = 'sawtooth';
                    gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
                    oscillator.start(ctx.currentTime);
                    oscillator.stop(ctx.currentTime + 0.2);
                    break;
            }
        },
        [soundEnabled],
    );

    // Создание частиц попадания
    const createHitEffect = useCallback((x: number, y: number, isHeadshot: boolean) => {
        const color = isHeadshot ? 'rgba(255,0,0,1)' : 'rgba(255,255,0,1)';
        const count = isHeadshot ? 15 : 8;

        for (let i = 0; i < count; i++) {
            particlesRef.current.push({
                x,
                y,
                vx: rand(-4, 4),
                vy: rand(-4, 4),
                life: isHeadshot ? 30 : 20,
                maxLife: isHeadshot ? 30 : 20,
                color,
            });
        }
    }, []);

    const spawnSingleTarget = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const team = Math.random() > 0.5 ? 'terrorist' : 'counter';
        const stance = Math.random() > 0.7 ? 'crouching' : 'standing';
        const moving = gameMode === 'tracking' || (gameMode === 'aim' && Math.random() > 0.6);

        const width = 25;
        const height = stance === 'crouching' ? 45 : 65;
        const headSize = 12;

        const target: CSTarget = {
            x: rand(width, canvas.width - width),
            y: rand(height, canvas.height - height),
            width,
            height,
            vx: moving ? rand(-1.5, 1.5) : 0,
            vy: 0,
            life: gameMode === 'flick' ? rand(800, 1500) : rand(3000, 6000),
            team,
            stance,
            moving,
            headX: 0,
            headY: 0,
            headSize,
            bodyHit: false,
        };

        target.headX = target.x;
        target.headY = target.y - target.height * 0.35;

        targetsRef.current.push(target);
    }, [gameMode]);

    const spawnCSTargets = useCallback(() => {
        targetsRef.current = [];
        const targetCount = gameMode === 'flick' ? 1 : Math.min(2 + Math.floor(round / 2), 5);

        for (let i = 0; i < targetCount; i++) {
            spawnSingleTarget();
        }
    }, [round, gameMode, spawnSingleTarget]);

    // FPS счетчик
    const updateFPS = useCallback(() => {
        const now = performance.now();
        fpsRef.current.frames++;

        if (now - fpsRef.current.lastTime >= 1000) {
            setFps(fpsRef.current.frames);
            fpsRef.current.frames = 0;
            fpsRef.current.lastTime = now;
        }
    }, []);

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        updateFPS();

        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        targetsRef.current = targetsRef.current.filter((target) => {
            if (!target.bodyHit) {
                // Движение цели
                if (target.moving && gameMode !== 'flick') {
                    target.x += target.vx;
                    if (target.x <= target.width || target.x >= canvas.width - target.width) {
                        target.vx *= -1;
                    }
                }

                target.life -= 16;

                target.headX = target.x;
                target.headY = target.y - target.height * 0.35;

                // Рисуем тело
                const teamColor = target.team === 'terrorist' ? '#8B4513' : '#000080';
                const alpha = target.life < 1000 && gameMode !== 'flick' ? 0.3 + 0.7 * Math.sin(Date.now() * 0.01) : 1;

                ctx.fillStyle = teamColor;
                ctx.globalAlpha = alpha;
                ctx.fillRect(target.x - target.width / 2, target.y - target.height, target.width, target.height);

                // Голова
                ctx.fillStyle = '#FFE4C4';
                ctx.beginPath();
                ctx.arc(target.headX, target.headY, target.headSize, 0, Math.PI * 2);
                ctx.fill();

                ctx.strokeStyle = 'rgba(255,0,0,0.5)';
                ctx.lineWidth = 1;
                ctx.stroke();

                ctx.globalAlpha = 1;

                // Цель удаляется из массива, если ее "жизнь" истекла (кроме режима flick)
                if (gameMode !== 'flick' && target.life <= 0) {
                    onMiss();
                    return false;
                }

                return true;
            }
            return false;
        });

        // Рисуем частицы
        particlesRef.current = particlesRef.current.filter((p) => {
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.9;
            p.vy += 0.2;
            p.life--;

            const alpha = p.life / p.maxLife;
            ctx.globalAlpha = alpha;
            ctx.fillStyle = p.color.replace('1)', `${alpha})`);
            ctx.fillRect(p.x - 1, p.y - 1, 2, 2);
            ctx.globalAlpha = 1;

            return p.life > 0;
        });

        if (running) {
            animationRef.current = requestAnimationFrame(draw);
        }
    }, [running, gameMode, updateFPS, onMiss]);

    const handleClick = useCallback(
        (e: React.MouseEvent) => {
            if (!running) return;
            const canvas = canvasRef.current;
            if (!canvas) return;

            const rect = canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left) * (canvas.width / rect.width);
            const y = (e.clientY - rect.top) * (canvas.height / rect.height);

            // let hit = false;
            let hitTargetIndex = -1;

            targetsRef.current.forEach((target, index) => {
                if (target.bodyHit) return;

                const headDx = x - target.headX;
                const headDy = y - target.headY;
                const headDist = Math.sqrt(headDx * headDx + headDy * headDy);

                if (headDist <= target.headSize) {
                    // hit = true;
                    hitTargetIndex = index;
                    playCSSound('headshot');
                    createHitEffect(target.headX, target.headY, true);
                    onHit(true);
                    return;
                }

                if (
                    x >= target.x - target.width / 2 &&
                    x <= target.x + target.width / 2 &&
                    y >= target.y - target.height &&
                    y <= target.y
                ) {
                    // hit = true;
                    hitTargetIndex = index;
                    playCSSound('hit');
                    createHitEffect(target.x, target.y - target.height / 2, false);
                    onHit(false);
                }
            });

            // Если попали в цель, удаляем ее и создаем новую
            if (hitTargetIndex !== -1) {
                const target = targetsRef.current[hitTargetIndex];

                if (gameMode === 'flick') {
                    // В режиме flick просто меняем координаты цели
                    targetsRef.current = targetsRef.current.filter((t) => t !== target);
                    spawnSingleTarget();
                } else {
                    // В режимах aim и tracking удаляем цель
                    targetsRef.current = targetsRef.current.filter((t) => t !== target);
                    spawnSingleTarget(); // И создаем новую, чтобы количество целей оставалось постоянным
                }
            } else {
                playCSSound('miss');
                onMiss();
            }
        },
        [running, gameMode, playCSSound, onHit, onMiss, createHitEffect, spawnSingleTarget],
    );

    // Основной эффект для запуска/остановки игры
    useEffect(() => {
        if (running) {
            spawnCSTargets();
            draw();
        } else {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [running, spawnCSTargets, draw]);

    // Сброс при смене режима игры
    useEffect(() => {
        if (running) {
            spawnCSTargets();
        }
    }, [gameMode, spawnCSTargets, running]);

    return (
        <div className="relative">
            <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="border border-gray-600 bg-gray-800 cursor-crosshair"
                onClick={handleClick}
            />

            {showFPS && (
                <div className="absolute top-2 left-2 text-lime-400 text-sm font-mono bg-black bg-opacity-50 px-2 py-1 rounded">
                    FPS: {fps}
                </div>
            )}
        </div>
    );
};
