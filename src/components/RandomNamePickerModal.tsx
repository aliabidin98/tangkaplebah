import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  RotateCw, 
  Trash2, 
  Users, 
  Shuffle, 
  Sparkles, 
  Check, 
  History, 
  HelpCircle,
  Play,
  RotateCcw,
  PlusCircle,
  Award
} from 'lucide-react';
import { soundFx } from '../utils/audio';

const STORAGE_KEY = 'game_ar_random_picker_names_v1';
const HISTORY_KEY = 'game_ar_random_picker_history_v1';

const DEFAULT_NAMES = [
  'Kelompok 1',
  'Kelompok 2',
  'Kelompok 3',
  'Kelompok 4',
  'Kelompok 5',
  'Kelompok 6',
  'Kelompok 7',
  'Kelompok 8'
];

const PRESET_STUDENTS = [
  'Ahmad Fauzi',
  'Budi Santoso',
  'Cantika Putri',
  'Dedi Kurniawan',
  'Eka Rahmawati',
  'Fajar Pratama',
  'Gita Nirmala',
  'Hadi Saputra',
  'Indah Permata',
  'Joko Triwahyudi',
  'Kirana Larasati',
  'Luthfi Hakim'
];

// Rich, high-contrast, lively color palette for wheel sectors
const WHEEL_COLORS = [
  '#F59E0B', // Amber
  '#3B82F6', // Blue
  '#10B981', // Emerald
  '#EF4444', // Red
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#F97316', // Orange
  '#14B8A6', // Teal
  '#6366F1', // Indigo
  '#84CC16', // Lime
  '#D946EF'  // Fuchsia
];

interface RandomNamePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PickedRecord {
  id: string;
  name: string;
  timestamp: string;
  removed: boolean;
}

export function RandomNamePickerModal({ isOpen, onClose }: RandomNamePickerModalProps) {
  // Names input state (raw text, one per line)
  const [namesText, setNamesText] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return saved;
    } catch {
      // Ignore
    }
    return DEFAULT_NAMES.join('\n');
  });

  // Picked history
  const [history, setHistory] = useState<PickedRecord[]>(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }
    return [];
  });

  // Wheel interaction state
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [winnerName, setWinnerName] = useState<string | null>(null);
  const [showWinnerModal, setShowWinnerModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'wheel' | 'history'>('wheel');

  // Canvas & animation refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rotationAngleRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const spinStartTimeRef = useRef<number>(0);
  const spinDurationRef = useRef<number>(4500);
  const startAngleRef = useRef<number>(0);
  const targetAngleRef = useRef<number>(0);
  const lastTickSliceIndexRef = useRef<number>(-1);

  // Parse active names from text
  const namesList = namesText
    .split('\n')
    .map(n => n.trim())
    .filter(n => n.length > 0);

  // Keep names saved
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, namesText);
    } catch {
      // Ignore
    }
  }, [namesText]);

  // Keep history saved
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch {
      // Ignore
    }
  }, [history]);

  // Render Wheel to Canvas
  const drawWheel = useCallback((currentAngle: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 16;

    ctx.clearRect(0, 0, width, height);

    // If no names, draw placeholder wheel
    if (namesList.length === 0) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#1e293b';
      ctx.fill();
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 18px "Fredoka", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Masukkan nama untuk memutar', centerX, centerY);
      ctx.restore();
      return;
    }

    const numSlices = namesList.length;
    const sliceAngle = (Math.PI * 2) / numSlices;

    // Draw outer glow and shadow
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 8, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fill();

    // Draw outer golden ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 6, 0, Math.PI * 2);
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 8;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 2, 0, Math.PI * 2);
    ctx.strokeStyle = '#FEF3C7';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    // Draw Slices
    for (let i = 0; i < numSlices; i++) {
      const startA = currentAngle + i * sliceAngle;
      const endA = startA + sliceAngle;
      const color = WHEEL_COLORS[i % WHEEL_COLORS.length];

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startA, endA);
      ctx.closePath();

      // Slice background
      ctx.fillStyle = color;
      ctx.fill();

      // Slice border
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = numSlices > 24 ? 1 : 2.5;
      ctx.stroke();

      // Inner subtle shading
      const grad = ctx.createRadialGradient(centerX, centerY, radius * 0.4, centerX, centerY, radius);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0.15)');
      ctx.fillStyle = grad;
      ctx.fill();

      // Text along the slice radius
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startA + sliceAngle / 2);

      const text = namesList[i];
      // Adaptive font size based on slice count and length
      let fontSize = 16;
      if (numSlices <= 8) fontSize = 18;
      else if (numSlices <= 16) fontSize = 14;
      else if (numSlices <= 30) fontSize = 11;
      else fontSize = 9;

      ctx.font = `bold ${fontSize}px "Fredoka", "Nunito", sans-serif`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';

      // Trim text if too long
      const maxTextWidth = radius - 45;
      let displayText = text;
      if (ctx.measureText(displayText).width > maxTextWidth) {
        while (displayText.length > 3 && ctx.measureText(displayText + '…').width > maxTextWidth) {
          displayText = displayText.slice(0, -1);
        }
        displayText += '…';
      }

      // Text stroke for crisp legibility
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.lineWidth = 3;
      ctx.strokeText(displayText, radius - 20, 0);

      // Text fill
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(displayText, radius - 20, 0);

      ctx.restore();
      ctx.restore();
    }

    // Outer decorative studs / pegs around the rim
    const numPegs = Math.max(numSlices, 16);
    const pegAngleStep = (Math.PI * 2) / numPegs;
    for (let p = 0; p < numPegs; p++) {
      const a = currentAngle + p * pegAngleStep;
      const px = centerX + (radius + 2) * Math.cos(a);
      const py = centerY + (radius + 2) * Math.sin(a);

      ctx.save();
      ctx.beginPath();
      ctx.arc(px, py, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFBEB';
      ctx.fill();
      ctx.strokeStyle = '#B45309';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }

    // Center Hub (Wheel Center)
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, 38, 0, Math.PI * 2);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, 32, 0, Math.PI * 2);
    ctx.fillStyle = '#1e293b';
    ctx.fill();

    // Center icon/text
    ctx.font = '22px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🐝', centerX, centerY - 2);

    ctx.font = 'bold 9px "Fredoka", sans-serif';
    ctx.fillStyle = '#FBBF24';
    ctx.fillText('PUTAR', centerX, centerY + 16);
    ctx.restore();

    // Top Pointer Needle (At 12 o'clock / -Math.PI / 2)
    ctx.save();
    const needleTopY = centerY - radius - 14;
    const needleTipY = centerY - radius + 12;

    // Pointer shadow
    ctx.beginPath();
    ctx.moveTo(centerX - 12, needleTopY - 2);
    ctx.lineTo(centerX + 12, needleTopY - 2);
    ctx.lineTo(centerX, needleTipY + 2);
    ctx.closePath();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fill();

    // Pointer triangle body
    ctx.beginPath();
    ctx.moveTo(centerX - 12, needleTopY);
    ctx.lineTo(centerX + 12, needleTopY);
    ctx.lineTo(centerX, needleTipY);
    ctx.closePath();
    ctx.fillStyle = '#EF4444';
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Pointer pin / base circle
    ctx.beginPath();
    ctx.arc(centerX, needleTopY, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#FCD34D';
    ctx.fill();
    ctx.strokeStyle = '#B45309';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }, [namesList]);

  // Redraw when names or modal visibility changes
  useEffect(() => {
    if (isOpen) {
      drawWheel(rotationAngleRef.current);
    }
  }, [isOpen, drawWheel]);

  // Calculate winner based on final angle
  const getSelectedWinner = useCallback((currentAngle: number): string | null => {
    if (namesList.length === 0) return null;
    const numSlices = namesList.length;
    const sliceAngle = (Math.PI * 2) / numSlices;

    // Pointer is at the top (12 o'clock, which is -Math.PI / 2 or 3 * Math.PI / 2)
    const pointerAngle = (3 * Math.PI) / 2;
    let norm = (pointerAngle - currentAngle) % (Math.PI * 2);
    if (norm < 0) norm += Math.PI * 2;

    const winnerIndex = Math.floor(norm / sliceAngle) % numSlices;
    return namesList[winnerIndex] || null;
  }, [namesList]);

  // Spin the wheel
  const handleSpin = () => {
    if (isSpinning || namesList.length === 0) return;

    setShowWinnerModal(false);
    setIsSpinning(true);
    setWinnerName(null);

    const now = performance.now();
    spinStartTimeRef.current = now;
    startAngleRef.current = rotationAngleRef.current % (Math.PI * 2);

    // Random duration between 4.2 and 5.2 seconds
    const duration = 4400 + Math.random() * 800;
    spinDurationRef.current = duration;

    // Minimum 6 full rotations (12*PI) + random slice offset
    const fullTurns = 6 + Math.floor(Math.random() * 4);
    const randomAngle = Math.random() * Math.PI * 2;
    const totalDelta = fullTurns * Math.PI * 2 + randomAngle;
    targetAngleRef.current = startAngleRef.current + totalDelta;

    const numSlices = namesList.length;
    const sliceAngle = (Math.PI * 2) / numSlices;
    lastTickSliceIndexRef.current = -1;

    // Deceleration easing function (quintic ease-out)
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

    const animate = (currentTime: number) => {
      const elapsed = currentTime - spinStartTimeRef.current;
      const progress = Math.min(1, elapsed / spinDurationRef.current);

      const currentAngle = startAngleRef.current + totalDelta * easeOut(progress);
      rotationAngleRef.current = currentAngle;

      // Play tick sound when passing slice boundaries
      const pointerAngle = (3 * Math.PI) / 2;
      let norm = (pointerAngle - currentAngle) % (Math.PI * 2);
      if (norm < 0) norm += Math.PI * 2;
      const currentSliceIdx = Math.floor(norm / sliceAngle);

      if (currentSliceIdx !== lastTickSliceIndexRef.current) {
        lastTickSliceIndexRef.current = currentSliceIdx;
        // Pitch variation based on progress
        const pitch = 0.9 + (1 - progress) * 0.4;
        soundFx.playTick(pitch);
      }

      drawWheel(currentAngle);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Spin finished!
        setIsSpinning(false);
        const winner = getSelectedWinner(currentAngle);
        if (winner) {
          setWinnerName(winner);
          setShowWinnerModal(true);

          // Triumphant sound
          soundFx.playVictory();

          // Confetti celebration
          try {
            confetti({
              particleCount: 90,
              spread: 80,
              origin: { y: 0.55 },
              zIndex: 9999
            });
          } catch {
            // Ignore
          }
        }
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
  };

  // Cancel animation on unmount or close
  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // Keyboard shortcut: Spacebar to spin
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === ' ' && !isSpinning && !showWinnerModal) {
        // Only trigger if not typing inside textarea
        if (document.activeElement?.tagName !== 'TEXTAREA' && document.activeElement?.tagName !== 'INPUT') {
          e.preventDefault();
          handleSpin();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSpinning, showWinnerModal, handleSpin]);

  // Actions for Winner Modal
  const handleRemoveWinnerAndContinue = () => {
    if (!winnerName) return;

    // Record to history as removed
    const newRecord: PickedRecord = {
      id: Date.now().toString(),
      name: winnerName,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      removed: true
    };
    setHistory(prev => [newRecord, ...prev]);

    // Remove first instance of the winner from namesText
    const lines = namesText.split('\n');
    const indexToRemove = lines.findIndex(l => l.trim() === winnerName.trim());
    if (indexToRemove !== -1) {
      lines.splice(indexToRemove, 1);
      const updatedText = lines.join('\n');
      setNamesText(updatedText);
    }

    setShowWinnerModal(false);
    setWinnerName(null);

    // Auto-spin again if there are still names left
    const remainingCount = namesList.length - 1;
    if (remainingCount > 0) {
      setTimeout(() => {
        handleSpin();
      }, 400);
    }
  };

  const handleKeepWinnerAndContinue = () => {
    if (!winnerName) return;

    // Record to history as kept
    const newRecord: PickedRecord = {
      id: Date.now().toString(),
      name: winnerName,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      removed: false
    };
    setHistory(prev => [newRecord, ...prev]);

    setShowWinnerModal(false);
    setWinnerName(null);

    setTimeout(() => {
      handleSpin();
    }, 400);
  };

  const handleDismissWinner = (keep: boolean = true) => {
    if (!winnerName) return;

    const newRecord: PickedRecord = {
      id: Date.now().toString(),
      name: winnerName,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      removed: !keep
    };
    setHistory(prev => [newRecord, ...prev]);

    if (!keep) {
      const lines = namesText.split('\n');
      const indexToRemove = lines.findIndex(l => l.trim() === winnerName.trim());
      if (indexToRemove !== -1) {
        lines.splice(indexToRemove, 1);
        setNamesText(lines.join('\n'));
      }
    }

    setShowWinnerModal(false);
  };

  // Quick preset handlers
  const handleLoadStudents = () => {
    setNamesText(PRESET_STUDENTS.join('\n'));
  };

  const handleLoadGroups = () => {
    setNamesText(DEFAULT_NAMES.join('\n'));
  };

  const handleShuffleNames = () => {
    const list = [...namesList];
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    setNamesText(list.join('\n'));
    soundFx.playHover();
  };

  const handleRestoreRemovedNames = () => {
    const removedNames = history.filter(h => h.removed).map(h => h.name);
    if (removedNames.length === 0) return;

    const combined = [...namesList, ...removedNames];
    setNamesText(combined.join('\n'));
    // Mark history as restored
    setHistory(prev => prev.map(h => ({ ...h, removed: false })));
    soundFx.playHover();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
      <div className="bg-slate-900 border-2 border-amber-400/80 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* Modal Header (Fixed, Never Shrinks) */}
        <div className="shrink-0 bg-gradient-to-r from-amber-600/30 via-slate-800 to-amber-600/30 border-b border-amber-400/30 p-4 sm:px-6 flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-2xl shadow-inner shrink-0">
              🎡
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-amber-300 font-heading flex items-center gap-2">
                Pilih Nama Acak (Roda Putar)
              </h2>
              <p className="text-xs text-slate-300 font-medium">
                Putar roda untuk mengacak nama siswa atau kelompok giliran kelas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Tutup (Esc)"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: Wheel Section (7 Cols on desktop) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-950/50 rounded-2xl p-4 border border-slate-800 relative">
            
            {/* Wheel Canvas Container */}
            <div 
              className="relative flex items-center justify-center cursor-pointer select-none group"
              onClick={handleSpin}
              title={isSpinning ? 'Sedang memutar...' : 'Klik pada roda untuk memutar!'}
            >
              <canvas
                ref={canvasRef}
                width={380}
                height={380}
                className="max-w-full w-[310px] sm:w-[360px] h-auto drop-shadow-[0_10px_25px_rgba(0,0,0,0.6)] transition-transform group-hover:scale-[1.01]"
              />

              {/* Hover overlay hint when idle */}
              {!isSpinning && namesList.length > 0 && (
                <div className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="bg-slate-950/80 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-400/50 shadow-lg animate-pulse">
                    Klik untuk Putar 🎡
                  </div>
                </div>
              )}
            </div>

            {/* Spin Controls */}
            <div className="w-full max-w-sm mt-4 flex flex-col items-center gap-2">
              <button
                onClick={handleSpin}
                disabled={isSpinning || namesList.length === 0}
                className={`w-full py-3.5 px-6 rounded-2xl font-black text-lg sm:text-xl shadow-[0_6px_0_#b45309] active:shadow-none active:translate-y-1.5 transition-all flex items-center justify-center gap-2 font-heading ${
                  isSpinning || namesList.length === 0
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-[0_6px_0_#b45309]'
                }`}
              >
                <RotateCw className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
                {isSpinning ? 'Sedang Berputar...' : 'PUTAR RODA (SPIN)'}
              </button>

              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <span>💡 Tekan tombol <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-slate-300 font-mono">Spasi</kbd> atau klik roda langsung untuk memutar</span>
              </div>
            </div>

            {/* Quick Status Bar */}
            <div className="mt-3 flex items-center gap-3 text-xs font-bold">
              <span className="bg-slate-800/80 px-3 py-1 rounded-lg text-amber-300 border border-amber-400/30 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                {namesList.length} Nama Aktif di Roda
              </span>
              {history.length > 0 && (
                <span className="text-slate-400">
                  {history.length} Kali Terpilih
                </span>
              )}
            </div>

          </div>

          {/* RIGHT: Names Editor & Management (5 Cols on desktop) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            {/* Tabs: Daftar Nama vs Riwayat */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab('wheel')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'wheel'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" /> Daftar Nama ({namesList.length})
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'history'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <History className="w-3.5 h-3.5" /> Riwayat Terpilih ({history.length})
              </button>
            </div>

            {activeTab === 'wheel' ? (
              <>
                {/* Input Textarea Header */}
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300">
                    Daftar Nama <span className="text-amber-400 font-normal">(Satu nama per baris)</span>
                  </label>
                  <button
                    onClick={handleShuffleNames}
                    className="text-xs text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1 hover:underline"
                    title="Acak urutan nama di daftar"
                  >
                    <Shuffle className="w-3.5 h-3.5" /> Acak Urutan
                  </button>
                </div>

                {/* Textarea */}
                <div className="relative">
                  <textarea
                    value={namesText}
                    onChange={(e) => setNamesText(e.target.value)}
                    placeholder="Contoh:&#10;Ahmad Fauzi&#10;Budi Santoso&#10;Cantika Putri&#10;Kelompok 1&#10;Kelompok 2"
                    rows={9}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400 font-mono leading-relaxed resize-none shadow-inner"
                  />
                  <div className="absolute bottom-2.5 right-3 text-[11px] font-bold text-slate-500 bg-slate-900/80 px-2 py-0.5 rounded">
                    {namesList.length} nama
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="flex flex-col gap-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Pilihan Contoh / Preset Cepat:
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleLoadStudents}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl py-2 px-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Users className="w-3.5 h-3.5 text-sky-400" /> Contoh Siswa (12)
                    </button>
                    <button
                      onClick={handleLoadGroups}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl py-2 px-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Kelompok 1-8
                    </button>
                  </div>
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={() => setNamesText('')}
                      className="flex-1 bg-slate-800/80 hover:bg-rose-950/60 hover:text-rose-300 text-slate-400 border border-slate-700/80 rounded-xl py-1.5 px-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Kosongkan Daftar
                    </button>
                    {history.some(h => h.removed) && (
                      <button
                        onClick={handleRestoreRemovedNames}
                        className="flex-1 bg-slate-800 hover:bg-emerald-950/60 hover:text-emerald-300 text-emerald-400 border border-emerald-500/40 rounded-xl py-1.5 px-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                        title="Kembalikan nama yang sebelumnya dihapus saat undian"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Pulihkan Nama
                      </button>
                    )}
                  </div>
                </div>

                {/* Helpful Instruction Note */}
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-xs text-slate-400 flex items-start gap-2 mt-auto">
                  <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed text-[11px]">
                    Saat nama terpilih, Anda bisa memilih <b>"Hapus dari Daftar"</b> agar tidak terpilih lagi pada undian berikutnya, atau <b>"Tetap Simpan"</b> untuk tetap diacak.
                  </p>
                </div>
              </>
            ) : (
              /* HISTORY TAB */
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-bold text-slate-300">
                    Riwayat Undian Sesi Ini
                  </div>
                  {history.length > 0 && (
                    <button
                      onClick={() => setHistory([])}
                      className="text-[11px] text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Hapus Riwayat
                    </button>
                  )}
                </div>

                {history.length === 0 ? (
                  <div className="flex-1 bg-slate-950 rounded-xl border border-slate-800 p-6 flex flex-col items-center justify-center text-center text-slate-500 text-xs">
                    <History className="w-8 h-8 text-slate-600 mb-2" />
                    <span>Belum ada nama yang terpilih. Putar roda untuk memulai!</span>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto max-h-[340px] bg-slate-950 rounded-xl border border-slate-800 p-2 flex flex-col gap-1.5">
                    {history.map((rec, idx) => (
                      <div
                        key={rec.id}
                        className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center text-[10px]">
                            {history.length - idx}
                          </span>
                          <span className="font-bold text-white text-sm">
                            {rec.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-500">
                            {rec.timestamp}
                          </span>
                          {rec.removed ? (
                            <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              Dihapus
                            </span>
                          ) : (
                            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              Disimpan
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

        {/* WINNER ANNOUNCEMENT MODAL OVERLAY */}
        {showWinnerModal && winnerName && (
          <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-slate-900 border-4 border-amber-400 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center animate-scaleUp">
              
              <div className="relative mb-3">
                <span className="text-6xl animate-bounce inline-block">🎉</span>
                <span className="absolute -top-1 -right-2 text-2xl">✨</span>
              </div>

              <div className="text-xs uppercase font-extrabold tracking-widest text-amber-400 mb-1">
                HASIL ACAK TERPILIH!
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-200 font-heading mb-4 px-4 py-3 bg-amber-950/60 border-2 border-amber-400/50 rounded-2xl w-full shadow-inner break-words">
                {winnerName}
              </h3>

              <p className="text-slate-300 text-xs sm:text-sm font-medium mb-6 max-w-xs">
                Apakah Anda ingin menghapus nama ini dari daftar untuk undian berikutnya?
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5 w-full">
                
                {/* 1. Hapus Nama & Putar Lagi */}
                <button
                  onClick={handleRemoveWinnerAndContinue}
                  className="w-full bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-black py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all font-heading"
                >
                  <Trash2 className="w-4 h-4" />
                  Hapus Nama & Putar Lagi
                </button>

                {/* 2. Tetap Simpan & Putar Lagi */}
                <button
                  onClick={handleKeepWinnerAndContinue}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all font-heading"
                >
                  <RotateCw className="w-4 h-4" />
                  Tetap Simpan & Putar Lagi
                </button>

                {/* 3. Secondary Options */}
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => handleDismissWinner(false)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-rose-300 font-bold py-2 px-3 rounded-xl text-xs border border-rose-500/30 transition-colors"
                  >
                    Hapus Saja (Stop)
                  </button>
                  <button
                    onClick={() => handleDismissWinner(true)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2 px-3 rounded-xl text-xs border border-slate-700 transition-colors"
                  >
                    Tutup Modal
                  </button>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
