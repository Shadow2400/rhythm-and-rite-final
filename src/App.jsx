import React, { useState, useRef, useEffect } from 'react';
// THE VECTOR ARMORY
import { 
  ChessQueen, 
  AudioWaveform, 
  MicVocal, 
  Origami, 
  Sparkles, 
  Guitar, 
  Rose, 
  Swords, 
  Map, 
  CupSoda, 
  Crosshair, 
  BowArrow, 
  Plane, 
  HandHeart, 
  HeartCrack, 
  Flame,
  ChevronRight, 
  ChevronDown,
  Activity,
  Share2,
  Info,
  X
} from 'lucide-react';

// VALIDATED SPOTIFY STREAMING DATA
const STARTING_SONGS = [
  { title: "Golden", artist: "HUNTR/X", audioFile: "/audio/Golden.mp3", icon: ChessQueen, streams: 1562818502 },
  { title: "Rumi's Signs", artist: "Marcelo Zarvos", audioFile: "/audio/Rumi's Signs.mp3", icon: HeartCrack, streams: 295308 },
  { title: "Strategy", artist: "TWICE", audioFile: "/audio/Strategy.mp3", icon: Crosshair, streams: 313582879 },
  { title: "Takedown (TWICE Ver)", artist: "TWICE", audioFile: "/audio/Takedown (TWICE Ver).mp3", icon: BowArrow, streams: 299684827 },
  
  { title: "How It’s Done", artist: "HUNTR/X", audioFile: "/audio/How It's Done.mp3", icon: Plane, streams: 591777936 },
  { title: "오솔길 Path", artist: "Jokers", audioFile: "/audio/오솔길 Path.mp3", icon: Map, streams: 50885149 },
  { title: "What It Sounds Like", artist: "HUNTR/X", audioFile: "/audio/What It Sounds Like.mp3", icon: Sparkles, streams: 550984488 },
  { title: "Score Suite", artist: "Marcelo Zarvos", audioFile: "/audio/Score Suite.mp3", icon: AudioWaveform, streams: 53839159 },
  
  { title: "Soda Pop", artist: "Saja Boys", audioFile: "/audio/Soda Pop.mp3", icon: CupSoda, streams: 700990932 },
  { title: "Jinu’s Lament", artist: "Ahn Hyo-seop", audioFile: "/audio/Jinu's Lament.mp3", icon: Guitar, streams: 8480771 },
  { title: "Takedown", artist: "HUNTR/X", audioFile: "/audio/Takedown.mp3", icon: Swords, streams: 473517280 },
  { title: "사랑인가 봐 Love, Maybe", artist: "MeloMance", audioFile: "/audio/사랑인가 봐 Love, Maybe.mp3", icon: Rose, streams: 198654317 },
  
  { title: "Your Idol", artist: "Saja Boys", audioFile: "/audio/Your Idol.mp3", icon: Flame, streams: 688206884 },
  { title: "Prologue (Mantra)", artist: "Zarvos / EJAE", audioFile: "/audio/Prologue.mp3", icon: MicVocal, streams: 13283743 },
  { title: "Free", artist: "Rumi & Jinu", audioFile: "/audio/Free.mp3", icon: Origami, streams: 482365287 },
  { title: "Love Me Right", artist: "EXO", audioFile: "/audio/Love Me Right.mp3", icon: HandHeart, streams: 109607891 }
];

const ICON_TO_EMOJI = {
  ChessQueen: "👑", AudioWaveform: "〰️", MicVocal: "🎤", Origami: "🕊️",
  Sparkles: "✨", Guitar: "🎸", Rose: "🌹", Swords: "⚔️",
  Map: "🗺️", CupSoda: "🥤", Crosshair: "🎯", BowArrow: "🏹",
  Plane: "✈️", HandHeart: "🫶", HeartCrack: "💔", Flame: "🔥"
};

const shufflePairs = (array) => {
  const shuffled = [];
  for (let i = 0; i < array.length; i += 2) {
    if (array[i + 1] && Math.random() > 0.5) {
      shuffled.push(array[i + 1], array[i]); 
    } else {
      shuffled.push(array[i], array[i + 1]); 
    }
  }
  return shuffled.filter(Boolean); 
};

const GoldenConfetti = () => {
  const pieces = Array.from({ length: 75 });
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = 2.5 + Math.random() * 4;
        const colors = ['from-yellow-300 to-yellow-500', 'from-amber-300 to-amber-600', 'from-yellow-100 to-yellow-300'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        return (
          <div
            key={i}
            className={`absolute top-[-10%] w-2 h-5 bg-gradient-to-b ${color} rounded-sm shadow-[0_0_10px_rgba(253,224,71,0.6)]`}
            style={{ left: `${left}%`, animation: `confettiFall ${duration}s linear ${delay}s infinite`, opacity: 0 }}
          />
        );
      })}
    </div>
  );
};

export default function App() {
  const PERSIST_KILL_ANIMATION = true; 

  const [showBanner, setShowBanner] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [matchups, setMatchups] = useState(() => shufflePairs(STARTING_SONGS));
  const [winners, setWinners] = useState([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [playingUrl, setPlayingUrl] = useState(null); 
  const [hoveredSide, setHoveredSide] = useState(null); 
  const audioPlayerRef = useRef(null);
  const [votingFor, setVotingFor] = useState(null);
  const [revealedKills, setRevealedKills] = useState([]);
  const [isCopied, setIsCopied] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  // --- THE VIEWPORT SENSOR ---
  const [isDesktop, setIsDesktop] = useState(true);
  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const arenaRef = useRef(null); 

  if (currentMatchIndex >= matchups.length && matchups.length > 1) {
    if (matchups.length === 2) {
      setMatchups(winners);
      setWinners([]);
      setCurrentMatchIndex(0);
      return null; 
    }

    setMatchups(shufflePairs(winners));
    setWinners([]);
    setCurrentMatchIndex(0);
    
    setShowBanner(true);
    setTimeout(() => {
      setShowBanner(false);
    }, 2000); 

    return null; 
  }

  const playAudio = (audioUrl) => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    const audio = new Audio(audioUrl);
    audio.volume = 0.4; 
    audio.play().catch(err => console.log("Browser blocked auto-play", err));
    audioPlayerRef.current = audio;
    setPlayingUrl(audioUrl);
  };

  const stopAudio = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.currentTime = 0;
    }
    setPlayingUrl(null);
  };

  useEffect(() => {
    if (matchups.length <= 1 || hoveredSide === null) return;
    if (!isDesktop) return; 

    const delayTimer = setTimeout(() => {
      if (hoveredSide === 'left' && matchups[currentMatchIndex]) {
        playAudio(matchups[currentMatchIndex].audioFile);
      } else if (hoveredSide === 'right' && matchups[currentMatchIndex + 1]) {
        playAudio(matchups[currentMatchIndex + 1].audioFile);
      }
    }, 500); 

    return () => clearTimeout(delayTimer);
  }, [currentMatchIndex, matchups, hoveredSide, isDesktop]); 

  useEffect(() => {
    if (matchups.length === 1 && matchups[0]) {
      playAudio(matchups[0].audioFile);
    }
  }, [matchups.length]); 

  const handleMobilePreview = (e, audioUrl) => {
    e.stopPropagation(); 
    if (playingUrl === audioUrl) {
      stopAudio(); 
    } else {
      playAudio(audioUrl);
    }
  };

  const handleVote = (winner) => {
    if (votingFor) return; 

    setHoveredSide(null);
    setVotingFor(winner); 

    // Mobile Pre-Scroll: Smoothly glide up while the victory animation plays
    if (!isDesktop && arenaRef.current) {
      const y = arenaRef.current.getBoundingClientRect().top + window.scrollY - 20; 
      window.scrollTo({ top: y, behavior: 'smooth' });
    }

    const loser = matchups[currentMatchIndex].title === winner.title 
      ? matchups[currentMatchIndex + 1] 
      : matchups[currentMatchIndex];

    setTimeout(() => {
      stopAudio(); 
      
      const advancedWinner = {
        ...winner,
        defeated: loser ? [...(winner.defeated || []), loser] : (winner.defeated || [])
      };

      const newWinners = [...winners, advancedWinner];

      if (currentMatchIndex + 2 >= matchups.length) {
        if (matchups.length === 2) {
          setMatchups(newWinners);
          setWinners([]);
          setCurrentMatchIndex(0);
          setVotingFor(null);
        } else {
          setShowBanner(true);
          setMatchups(shufflePairs(newWinners));
          setWinners([]);
          setCurrentMatchIndex(0);
          setVotingFor(null);
          
          setTimeout(() => {
            setShowBanner(false);
          }, 2000);
        }
      } else {
        setWinners(newWinners);
        setCurrentMatchIndex(prevIndex => prevIndex + 2);
        setVotingFor(null); 
      }
    }, 1000); 
  };

  const handleRevealKill = (index) => {
    if (PERSIST_KILL_ANIMATION && !revealedKills.includes(index)) {
      setRevealedKills(prev => [...prev, index]);
    }
  };

  const handleShare = () => {
    const winner = matchups[0];
    const runnerUp = winner.defeated?.[winner.defeated.length - 1];
    
    const getEmoji = (track) => {
      const iconName = track.icon?.name || track.icon?.displayName || "ChessQueen";
      return ICON_TO_EMOJI[iconName] || "🎵";
    };

    const winnerEmoji = getEmoji(winner);
    
    let finalProbText = "N/A";
    if (runnerUp) {
      const totalStreams = winner.streams + runnerUp.streams;
      const rawProb = (winner.streams / totalStreams) * 100;
      const displayWinProb = rawProb < 0.1 ? "< 0.1" : rawProb.toFixed(1);
      finalProbText = rawProb < 50 ? `${displayWinProb}% Underdog Upset!` : `${displayWinProb}% Expected Win`;
    }

    const roundPrefixes = ["R1", "QF", "SF", "FINALS"];
    let killFeed = "";
    winner.defeated.forEach((track, index) => {
      if (track) {
        const prefix = roundPrefixes[index] || `R${index + 1}`;
        const trackEmoji = getEmoji(track);
        const extraText = index === winner.defeated.length - 1 ? ` (${finalProbText})` : "";
        killFeed += `${prefix}: ${trackEmoji} ${track.title}${extraText}\n`;
      }
    });

    const shareText = `RHYTHM & RITE 🎧\n${winnerEmoji} ULTIMATE TRACK: ${winner.title}\n\nTHE TAKEDOWN:\n${killFeed}\nPlay: rhythm-and-rite.com`;

    navigator.clipboard.writeText(shareText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const isGameOver = matchups.length === 1;

  const AboutModal = () => {
    if (!showAbout) return null;
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity">
        <div className="bg-slate-950 border border-cyan-500/50 rounded-2xl p-8 md:p-10 max-w-lg w-full shadow-[0_0_50px_rgba(34,211,238,0.2)] relative">
          <button 
            onClick={() => setShowAbout(false)}
            className="absolute top-4 right-4 text-slate-500 hover:text-rose-400 transition-colors"
          >
            <X size={24} />
          </button>
          
          {/* ----- RESTRICTED GRADIENT TITLE ----- */}
          <h2 className="text-2xl font-black mb-6 text-center drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#ff00ff] to-cyan-400 selection:bg-cyan-500 selection:text-white">
            Hunter Archives
          </h2>
          
          <div className="space-y-4 text-slate-300 text-sm md:text-base leading-relaxed">
            <p>
              Welcome to the <span className="text-[#ff00ff] font-bold">Rhythm & Rite</span> bracket.
            </p>
            <p>
              What started as a random conversation with my friend <span className="text-cyan-300 font-semibold">HonorableMushu</span> spiraled into a full-blown passion project. I designed this gauntlet from scratch as a love letter to the music and the <em>K-Pop Demon Hunters</em> universe.
            </p>
            <p>
              Listen to the tracks, trust your instincts, and vote to advance your favorite tracks. Once a victor is crowned, our network cross-references your choice against real-world Spotify streaming data to calculate the exact statistical probability of your takedown. 
            </p>
            <p className="border-t border-slate-800 pt-4 text-xs text-slate-500 text-center uppercase tracking-widest leading-relaxed">
              Designed and Directed by <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ff00ff] to-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.4)] selection:bg-cyan-500 selection:text-white">Shadow2400</span><br/>
              <span className="text-slate-600 text-[10px]">Coded with (much) help from AI</span>
            </p>
          </div>
        </div>
      </div>
    );
  };

  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white relative overflow-hidden p-8">
        <AboutModal />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#ff00ff]/20 rounded-full blur-[120px] pointer-events-none"></div>
        
        <button 
          onClick={() => setShowAbout(true)}
          className="absolute top-6 right-6 md:top-8 md:right-8 group z-20"
        >
          {/* ANIMATED GHOST BUTTON - WITH BACKGROUND BLUR */}
          <div className="px-6 py-2 border border-cyan-500 bg-black/40 backdrop-blur-sm rounded-md transition-all duration-300 ease-out group-hover:border-[#ff00ff] group-hover:bg-[#ff00ff]/20 group-hover:shadow-[0_0_20px_rgba(255,0,255,0.6)] flex items-center gap-2 animate-subtle-glow">
            <Info size={16} className="text-cyan-400 group-hover:text-white transition-colors" />
            <span className="text-xs font-bold tracking-widest uppercase text-cyan-400 group-hover:text-white transition-colors">
              Hunter Archives
            </span>
          </div>
        </button>

        <h1 className="text-7xl md:text-9xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-br from-slate-200 via-cyan-300 to-[#ff00ff] drop-shadow-[0_0_30px_rgba(255,0,255,0.5)] tracking-widest uppercase text-center z-10">
          Rhythm<br/>& Rite
        </h1>
        <p className="text-2xl text-cyan-300/80 mb-8 tracking-[0.4em] uppercase font-semibold text-center z-10">
          K-Pop Demon Hunters Bracket
        </p>

        <div className="z-10 bg-black/50 border border-fuchsia-900/50 backdrop-blur-sm rounded-xl p-6 mb-12 max-w-lg text-center shadow-[0_0_20px_rgba(0,0,0,0.5)]">
          <p className="text-slate-300 leading-relaxed mb-6 border-b border-slate-700 pb-4">
            Click a card to vote for your favorite track and advance it to the next cycle.
          </p>
          <div className="space-y-3">
            <p className="text-[#ff00ff] font-bold tracking-wider uppercase text-xs md:text-sm">
              💻 Desktop: Hover over any card to preview
            </p>
            <p className="text-cyan-400 font-bold tracking-wider uppercase text-xs md:text-sm">
              📱 Mobile: Tap the "▶ PREVIEW" button safely
            </p>
          </div>
        </div>
        
        <button 
          onClick={() => setHasStarted(true)}
          className="z-10 px-12 py-6 bg-black/40 hover:bg-[#ff00ff]/10 border-2 border-cyan-400 hover:border-[#ff00ff] rounded-2xl transition-all duration-300 ease-out transform hover:-translate-y-2 group shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:shadow-[0_0_60px_rgba(255,0,255,0.6)] backdrop-blur-md"
        >
          <span className="text-2xl font-black text-slate-200 group-hover:text-white tracking-[0.3em] uppercase transition-colors">
            Enter The Realm
          </span>
        </button>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(-10vh) rotate(0deg) scale(1); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg) scale(0.6); opacity: 0; }
        }

        @keyframes hoverBob {
          0%, 100% { transform: translateY(-16px) scale(1.05); }
          50% { transform: translateY(-6px) scale(1.05); }
        }
        .animate-bob {
          transition: transform 0.2s ease-out, box-shadow 0.3s ease-out, border-color 0.3s ease-out;
        }
        .animate-bob:hover {
          animation: hoverBob 2s ease-in-out infinite;
        }

        @keyframes bassPump {
          0%, 100% { transform: scale(1); }
          20% { transform: scale(1.15); } 
          50% { transform: scale(0.95); } 
          80% { transform: scale(1.05); } 
        }
        .animate-pump {
          animation: bassPump 0.5s ease-in-out infinite;
        }

        @keyframes slideInLeft {
          0% { transform: translateX(-100%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInRight {
          0% { transform: translateX(100%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        .animate-clash-left { animation: slideInLeft 0.4s cubic-bezier(0.25, 1, 0.5, 1); }
        .animate-clash-right { animation: slideInRight 0.4s cubic-bezier(0.25, 1, 0.5, 1); }

        @keyframes immolate {
          0% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); border-color: transparent; }
          20% { opacity: 1; transform: translateY(10px) scale(0.95); filter: blur(1px); border-color: #ef4444; box-shadow: inset 0 0 30px rgba(239, 68, 68, 0.5), 0 0 40px rgba(239, 68, 68, 0.8); background-color: rgba(239, 68, 68, 0.2); }
          100% { opacity: 0; transform: translateY(-100px) scaleY(1.5) scaleX(0.8); filter: blur(20px); border-color: #ef4444; box-shadow: inset 0 0 0 transparent, 0 0 100px rgba(239, 68, 68, 0); }
        }
        .animate-immolate {
          animation: immolate 0.8s cubic-bezier(0.4, 0, 1, 1) forwards;
        }

        @keyframes punchIn {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
          60% { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
          100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        .animate-punch {
          animation: punchIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        /* THE BOOSTED SLOW BREATHING GLOW */
        @keyframes subtleGlow {
          0%, 100% { box-shadow: 0 0 0 rgba(34,211,238,0); border-color: rgba(34,211,238,0.4); }
          50% { box-shadow: 0 0 20px rgba(34,211,238,0.6); border-color: rgba(34,211,238,1); }
        }
        .animate-subtle-glow {
          animation: subtleGlow 4s ease-in-out infinite;
        }
        .group:hover .animate-subtle-glow {
          animation: none;
        }
      `}</style>

      {/* OVERFLOW ANCHOR LOCK - Protects Mobile Chrome from itself */}
      <div 
        className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-rose-950 text-white p-4 md:p-8 flex flex-col items-center font-sans selection:bg-cyan-500 selection:text-white relative"
        style={{ overflowAnchor: 'none' }}
      >
        <AboutModal />
        {isGameOver && <GoldenConfetti />}

        {/* --- THE GHOST BANNER --- */}
        {showBanner && (
          <div className="fixed top-1/2 left-1/2 z-[1000] p-[3px] rounded-[18px] bg-gradient-to-br from-[#ff00ff] to-cyan-400 shadow-[0_0_50px_rgba(128,0,255,0.5)] pointer-events-none animate-punch w-[320px] md:w-[450px]">
            <div className="bg-black/95 text-white py-6 md:py-8 rounded-[15px] flex items-center justify-center">
              <h1 className="text-3xl md:text-5xl font-black tracking-[0.1em] uppercase m-0 text-center">
                {matchups.length === 2 ? "Final Round!" : "Next Round!"}
              </h1>
            </div>
          </div>
        )}

        <div className="w-full max-w-5xl flex justify-between items-start mt-4 md:mt-8 mb-2 relative z-10">
          <div className="flex-1"></div>
          
          <div className="flex-1 text-center">
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-300 via-cyan-400 to-[#ff00ff] drop-shadow-[0_0_15px_rgba(34,211,238,0.4)] tracking-widest uppercase">
              Rhythm & Rite
            </h1>
            <h2 className="text-sm md:text-xl text-[#ff00ff]/70 tracking-widest uppercase font-semibold mt-2">
              K-Pop Demon Hunters Bracket
            </h2>
          </div>

          <div className="flex-1 flex justify-end">
            <button 
              onClick={() => setShowAbout(true)}
              className="group z-20"
            >
              {/* MAIN ARENA ANIMATED GHOST BUTTON - WITH BACKGROUND BLUR */}
              <div className="px-6 py-2 border border-cyan-500 bg-black/40 backdrop-blur-sm rounded-md transition-all duration-300 ease-out group-hover:border-[#ff00ff] group-hover:bg-[#ff00ff]/20 group-hover:shadow-[0_0_20px_rgba(255,0,255,0.6)] flex items-center gap-2 animate-subtle-glow">
                <Info size={16} className="text-cyan-400 group-hover:text-white transition-colors" />
                <span className="text-xs font-bold tracking-widest uppercase text-cyan-400 group-hover:text-white transition-colors">
                  Hunter Archives
                </span>
              </div>
            </button>
          </div>
        </div>

        {!isGameOver && (
          <div className="mb-8 px-6 py-2 rounded-full border border-cyan-400/30 bg-black/40 text-cyan-300 text-xs font-bold tracking-[0.2em] uppercase text-center shadow-[0_0_15px_rgba(34,211,238,0.2)] mt-4">
            <span className="hidden md:inline">🔊 Hover over a track to preview</span>
            <span className="md:hidden">📱 Tap ▶ PREVIEW to hear a track</span>
          </div>
        )}

        {isGameOver ? (
          <div className="text-center bg-black/40 backdrop-blur-md p-8 md:p-16 rounded-2xl border-2 border-cyan-400 shadow-[0_0_40px_rgba(34,211,238,0.5)] mt-4 mx-4 w-full max-w-5xl relative z-10">
            <h2 className="text-xl md:text-2xl font-bold mb-8 text-slate-300 tracking-widest uppercase">🏆 Ultimate Track 🏆</h2>
            
            {(() => {
              const IconComponent = matchups[0].icon || ChessQueen;
              const isPlaying = playingUrl === matchups[0].audioFile;
              
              return (
                <IconComponent 
                  size={160} 
                  strokeWidth={1.5}
                  className={`mx-auto mb-8 text-[#ff00ff] transition-all duration-300 ${
                    isPlaying ? 'drop-shadow-[0_0_60px_rgba(255,0,255,1)] animate-pump' : 'drop-shadow-[0_0_40px_rgba(255,0,255,0.8)]'
                  }`} 
                />
              );
            })()}
            
            <p className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-[#ff99ff] to-[#ff00ff] drop-shadow-lg text-center mb-4">
              {matchups[0].title}
            </p>
            <p className="text-xl md:text-2xl font-bold text-slate-300 tracking-widest uppercase text-center mb-8">
              {matchups[0].artist}
            </p>

            {(() => {
              const winner = matchups[0];
              const runnerUp = winner.defeated?.[winner.defeated.length - 1];
              
              if (runnerUp) {
                const totalStreams = winner.streams + runnerUp.streams;
                const rawProb = (winner.streams / totalStreams) * 100;
                
                const displayWinProb = rawProb < 0.1 ? "< 0.1" : rawProb.toFixed(1);
                const displayLoserProb = (100 - rawProb) < 0.1 ? "< 0.1" : (100 - rawProb).toFixed(1);
                const isUnderdog = rawProb < 50;

                let victoryText = "";
                if (rawProb < 30) {
                  victoryText = "A statistical anomaly. You executed a massive underdog victory against staggering odds!";
                } else if (rawProb >= 30 && rawProb < 50) {
                  victoryText = "A razor-thin margin! You pulled off a tactical upset in a tightly contested match.";
                } else if (rawProb >= 50 && rawProb < 70) {
                  victoryText = "A hard-fought victory! The data favored you, but they put up a serious fight.";
                } else {
                  victoryText = "An absolute knockout. You cruised to an easy, expected victory.";
                }

                return (
                  <div className="w-full max-w-2xl mx-auto my-12 bg-slate-950/80 border border-slate-700/50 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)] p-6 md:p-8 flex flex-col justify-center text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Activity size={18} className="text-cyan-400" />
                      <p className="text-xs text-cyan-400 tracking-[0.2em] uppercase font-bold">Final Matchup Analytics</p>
                    </div>
                    
                    <p className="text-sm md:text-base text-slate-300 mb-8 leading-relaxed max-w-lg mx-auto text-left">
                      Global streaming data indicated that <strong>{winner.title}</strong> had a <span className={`font-black ${isUnderdog ? 'text-rose-400' : 'text-cyan-400'}`}>{displayWinProb}%</span> probability of defeating <strong>{runnerUp.title}</strong>.
                      <span className="text-white font-semibold"> {victoryText}</span>
                    </p>

                    <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden flex shadow-inner relative">
                      <div 
                        className={`h-full ${isUnderdog ? 'bg-rose-500' : 'bg-cyan-500'} transition-all duration-1000 ease-out`} 
                        style={{ width: `${rawProb}%` }}
                      ></div>
                      <div 
                        className="h-full bg-slate-600 transition-all duration-1000 ease-out" 
                        style={{ width: `${100 - rawProb}%` }}
                      ></div>
                      
                      <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/20 z-10"></div>
                    </div>
                    
                    <div className="flex justify-between mt-3 text-[10px] text-slate-500 font-bold uppercase tracking-wider px-1">
                      <span>{winner.title} ({displayWinProb}%)</span>
                      <span>{runnerUp.title} ({displayLoserProb}%)</span>
                    </div>
                  </div>
                );
              }
              return null;
            })()}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
              <button 
                onClick={() => { 
                stopAudio(); 
                setHoveredSide(null);
                setMatchups(shufflePairs(STARTING_SONGS)); 
                setWinners([]); 
                setCurrentMatchIndex(0); 
                setRevealedKills([]); 
                setHasStarted(false); 
                setIsCopied(false);
                }}
                className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-[#ff00ff]/10 hover:bg-[#ff00ff]/20 border border-[#ff00ff]/50 hover:border-[#ff00ff] rounded-xl transition-all font-bold tracking-wider uppercase text-sm md:text-base"
              >
                Restart Tournament
              </button>

              <button 
                onClick={handleShare}
                className={`w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 rounded-xl transition-all font-bold tracking-wider uppercase flex items-center justify-center gap-2 text-sm md:text-base ${
                  isCopied 
                  ? 'bg-green-500/20 border border-green-400 text-green-300 shadow-[0_0_15px_rgba(74,222,128,0.4)]' 
                  : 'bg-cyan-500/20 hover:bg-cyan-400/30 border border-cyan-400 hover:border-cyan-300 text-cyan-50 shadow-[0_0_15px_rgba(34,211,238,0.4)] hover:shadow-[0_0_25px_rgba(34,211,238,0.6)]'
                }`}
              >
                {isCopied ? (
                  <>Copied to Clipboard! ✓</>
                ) : (
                  <>
                  <Share2 size={18} />
                  Share Bracket
                  </>
                )}
              </button>
            </div>

            {matchups[0].defeated && matchups[0].defeated.length > 0 && (
              <div className="mt-16 pt-12 border-t border-cyan-900/40 w-full max-w-4xl mx-auto">
                <h3 className="text-lg md:text-xl font-black text-cyan-400 tracking-[0.3em] uppercase mb-2 text-center drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                  The Takedown
                </h3>

                <div className="flex flex-col items-center justify-center gap-1 mb-10 text-rose-500/80">
                  <Crosshair size={16} className="animate-pulse" />
                  <p className="text-[9px] md:text-[10px] tracking-[0.2em] uppercase font-bold">
                    <span className="md:hidden">Tap to verify takedowns</span>
                    <span className="hidden md:inline">Hover to verify takedowns</span>
                  </p>
                </div>
                
                <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-6">
                  {matchups[0].defeated.map((track, index) => {
                    if (!track) return null; 
                    const VictimIcon = track.icon || ChessQueen;
                    const roundNames = ["Round 1", "Quarter-Final", "Semi-Final", "Final Match"];
                    const isRevealed = revealedKills.includes(index);

                    return (
                      <React.Fragment key={track.title}>
                        <div 
                          onMouseEnter={() => handleRevealKill(index)}
                          onClick={() => handleRevealKill(index)}
                          className={`border rounded-xl p-6 flex flex-col items-center w-full md:w-48 transition-all duration-300 ${
                            isRevealed 
                              ? 'border-cyan-500 bg-cyan-950/20 shadow-[0_0_15px_rgba(34,211,238,0.2)]' 
                              : 'bg-black/60 border-slate-800 hover:border-cyan-500 hover:bg-cyan-950/20 group cursor-pointer'
                          }`}
                        >
                          <p className={`text-[10px] uppercase tracking-widest mb-4 font-black z-10 transition-colors ${isRevealed ? 'text-cyan-400' : 'text-slate-500 group-hover:text-cyan-400'}`}>
                            {roundNames[index]}
                          </p>
                          
                          <div className="relative flex items-center justify-center mb-4 w-20 h-20">
                            <div className={`absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-400 rounded-tl-full transition-all duration-[250ms] ease-out drop-shadow-[0_0_5px_rgba(34,211,238,0.8)] z-20 ${isRevealed ? 'opacity-100 translate-x-0 translate-y-0' : 'opacity-0 -translate-x-4 -translate-y-4 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0'}`}></div>
                            <div className={`absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan-400 rounded-tr-full transition-all duration-[250ms] ease-out drop-shadow-[0_0_5px_rgba(34,211,238,0.8)] z-20 ${isRevealed ? 'opacity-100 translate-x-0 translate-y-0' : 'opacity-0 translate-x-4 -translate-y-4 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0'}`}></div>
                            <div className={`absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-cyan-400 rounded-bl-full transition-all duration-[250ms] ease-out drop-shadow-[0_0_5px_rgba(34,211,238,0.8)] z-20 ${isRevealed ? 'opacity-100 translate-x-0 translate-y-0' : 'opacity-0 -translate-x-4 translate-y-4 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0'}`}></div>
                            <div className={`absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-cyan-400 rounded-br-full transition-all duration-[250ms] ease-out drop-shadow-[0_0_5px_rgba(34,211,238,0.8)] z-20 ${isRevealed ? 'opacity-100 translate-x-0 translate-y-0' : 'opacity-0 translate-x-4 translate-y-4 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0'}`}></div>
                            
                            <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
                              <div className={`w-[140%] h-1 bg-rose-500 rotate-[25deg] transition-all duration-[200ms] delay-[250ms] ease-out drop-shadow-[0_0_10px_rgba(225,29,72,1)] ${isRevealed ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100'}`}></div>
                            </div>

                            <VictimIcon 
                              size={40} 
                              className={`transition-all duration-[250ms] z-10 relative ${isRevealed ? 'text-rose-500 scale-75 drop-shadow-[0_0_8px_rgba(225,29,72,0.6)]' : 'text-slate-600 group-hover:text-rose-500 group-hover:scale-75 group-hover:drop-shadow-[0_0_8px_rgba(225,29,72,0.6)]'}`} 
                            />
                          </div>

                          <p className={`text-sm font-bold text-center leading-tight mb-2 transition-colors ${isRevealed ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>{track.title}</p>
                          <p className="text-[10px] text-slate-500 text-center leading-tight">{track.artist}</p>
                        </div>

                        {index < matchups[0].defeated.length - 1 && (
                          <div className="hidden md:block text-slate-700">
                            <ChevronRight size={32} />
                          </div>
                        )}
                        
                        {index < matchups[0].defeated.length - 1 && (
                          <div className="block md:hidden text-slate-700 py-2">
                            <ChevronDown size={32} />
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div ref={arenaRef} className="w-full max-w-5xl mt-2 relative z-10 min-h-[700px] md:min-h-[500px]">
            <div className="flex flex-col md:flex-row justify-between items-stretch space-y-6 md:space-y-0 md:space-x-8">
              
              {/* THE HYBRID KEY: Dynamic for Desktop, Static for Mobile */}
              <div 
                key={isDesktop ? `desktop-left-${currentMatchIndex}-${matchups.length}` : 'mobile-left-stable'} 
                className={isDesktop ? "animate-clash-left flex-1 flex relative" : "flex-1 flex relative"}
              >
                <div 
                  onClick={() => handleVote(matchups[currentMatchIndex])}
                  onMouseEnter={() => setHoveredSide('left')}
                  onMouseLeave={() => {
                    if (!votingFor) {
                      setHoveredSide(null);
                      stopAudio();
                    }
                  }}
                  className={`w-full cursor-pointer rounded-2xl p-8 md:p-12 flex flex-col items-center justify-start backdrop-blur-sm transition-all duration-300
                    ${votingFor?.title === matchups[currentMatchIndex].title 
                      ? 'scale-[1.15] border-4 border-cyan-300 bg-gradient-to-br from-cyan-400/40 to-[#ff00ff]/40 shadow-[0_0_80px_rgba(34,211,238,0.7)] ring-4 ring-cyan-400/30 z-50' 
                      : votingFor 
                        ? 'animate-immolate pointer-events-none' 
                        : 'bg-black/40 hover:bg-indigo-900/40 border-2 border-fuchsia-900/50 hover:border-cyan-400 group shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_40px_rgba(34,211,238,0.6)] animate-bob'}
                  `}
                >
                  {(() => {
                    const IconComponent = matchups[currentMatchIndex].icon;
                    const isPlaying = playingUrl === matchups[currentMatchIndex].audioFile;
                    const isWinner = votingFor?.title === matchups[currentMatchIndex].title;
                    
                    return (
                      <IconComponent 
                        size={120} 
                        strokeWidth={1.5}
                        className={`mb-6 transition-all duration-300 pointer-events-none
                          ${isWinner 
                            ? 'text-white drop-shadow-[0_0_40px_rgba(255,255,255,1)] scale-[1.2] animate-pump'
                            : isPlaying 
                              ? 'text-cyan-400 drop-shadow-[0_0_35px_rgba(34,211,238,1)] animate-pump' 
                              : 'text-slate-600 group-hover:text-cyan-400 drop-shadow-none group-hover:drop-shadow-[0_0_25px_rgba(34,211,238,0.8)]'
                          }
                        `} 
                      />
                    );
                  })()}
                  
                  <h3 className={`text-2xl md:text-4xl font-bold transition-colors drop-shadow-md text-center pointer-events-none ${votingFor?.title === matchups[currentMatchIndex].title ? 'text-white' : 'text-slate-200 group-hover:text-cyan-300'}`}>
                    {matchups[currentMatchIndex].title}
                  </h3>
                  <p className={`mt-2 md:mt-4 text-sm md:text-xl font-semibold transition-colors text-center tracking-wider pointer-events-none ${votingFor?.title === matchups[currentMatchIndex].title ? 'text-cyan-100' : 'text-slate-400 group-hover:text-cyan-100/70'}`}>
                    {matchups[currentMatchIndex].artist}
                  </p>

                  <button 
                    onClick={(e) => handleMobilePreview(e, matchups[currentMatchIndex].audioFile)}
                    className="mt-6 md:hidden px-6 py-2 bg-slate-900 border border-cyan-500 text-cyan-400 rounded-full font-bold tracking-widest uppercase text-xs shadow-[0_0_10px_rgba(34,211,238,0.3)] active:bg-cyan-900"
                  >
                    {playingUrl === matchups[currentMatchIndex].audioFile ? "⏹ STOP" : "▶ PREVIEW"}
                  </button>
                </div>
              </div>

              <div className={`text-2xl md:text-4xl font-black text-rose-500/50 italic drop-shadow-[0_0_10px_rgba(225,29,72,0.8)] px-4 flex items-center justify-center py-2 md:py-0 transition-opacity duration-300 ${votingFor ? 'opacity-0' : 'opacity-100'}`}>
                VS
              </div>

              {/* THE HYBRID KEY: Dynamic for Desktop, Static for Mobile */}
              <div 
                key={isDesktop ? `desktop-right-${currentMatchIndex}-${matchups.length}` : 'mobile-right-stable'} 
                className={isDesktop ? "animate-clash-right flex-1 flex relative" : "flex-1 flex relative"}
              >
                <div 
                  onClick={() => handleVote(matchups[currentMatchIndex + 1])}
                  onMouseEnter={() => setHoveredSide('right')}
                  onMouseLeave={() => {
                    if (!votingFor) {
                      setHoveredSide(null);
                      stopAudio();
                    }
                  }}
                  className={`w-full cursor-pointer rounded-2xl p-8 md:p-12 flex flex-col items-center justify-start backdrop-blur-sm transition-all duration-300
                    ${votingFor?.title === matchups[currentMatchIndex + 1]?.title 
                      ? 'scale-[1.15] border-4 border-[#ff00ff] bg-gradient-to-br from-[#ff00ff]/40 to-cyan-400/40 shadow-[0_0_80px_rgba(255,0,255,0.7)] ring-4 ring-[#ff00ff]/30 z-50' 
                      : votingFor 
                        ? 'animate-immolate pointer-events-none' 
                        : 'bg-black/40 hover:bg-[#ff00ff]/10 border-2 border-fuchsia-900/50 hover:border-[#ff00ff] group shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_40px_rgba(255,255,255,0.6)] animate-bob'}
                  `}
                >
                  {matchups[currentMatchIndex + 1] ? (
                    <>
                      {(() => {
                        const IconComponent = matchups[currentMatchIndex + 1].icon;
                        const isPlaying = playingUrl === matchups[currentMatchIndex + 1].audioFile;
                        const isWinner = votingFor?.title === matchups[currentMatchIndex + 1].title;

                        return (
                          <IconComponent 
                            size={120} 
                            strokeWidth={1.5}
                            className={`mb-6 transition-all duration-300 pointer-events-none
                              ${isWinner
                                ? 'text-white drop-shadow-[0_0_40px_rgba(255,255,255,1)] scale-[1.2] animate-pump'
                                : isPlaying 
                                  ? 'text-[#ff00ff] drop-shadow-[0_0_35px_rgba(255,0,255,1)] animate-pump' 
                                  : 'text-slate-600 group-hover:text-[#ff00ff] drop-shadow-none group-hover:drop-shadow-[0_0_25px_rgba(255,0,255,0.8)]'
                              }
                            `} 
                          />
                        );
                      })()}

                      <h3 className={`text-2xl md:text-4xl font-bold transition-colors drop-shadow-md text-center pointer-events-none ${votingFor?.title === matchups[currentMatchIndex + 1].title ? 'text-white' : 'text-slate-200 group-hover:text-[#ff00ff]'}`}>
                        {matchups[currentMatchIndex + 1].title}
                      </h3>
                      <p className={`mt-2 md:mt-4 text-sm md:text-xl font-semibold transition-colors text-center tracking-wider pointer-events-none ${votingFor?.title === matchups[currentMatchIndex + 1].title ? 'text-[#ff99ff]' : 'text-slate-400 group-hover:text-[#ff99ff]/70'}`}>
                        {matchups[currentMatchIndex + 1].artist}
                      </p>

                      <button 
                        onClick={(e) => handleMobilePreview(e, matchups[currentMatchIndex + 1].audioFile)}
                        className="mt-6 md:hidden px-6 py-2 bg-slate-900 border border-[#ff00ff] text-[#ff00ff] rounded-full font-bold tracking-widest uppercase text-xs shadow-[0_0_10px_rgba(255,0,255,0.3)] active:bg-fuchsia-900"
                      >
                        {playingUrl === matchups[currentMatchIndex + 1].audioFile ? "⏹ STOP" : "▶ PREVIEW"}
                      </button>
                    </>
                  ) : (
                    <h3 className="text-2xl md:text-4xl font-bold text-slate-200 group-hover:text-[#ff00ff] transition-colors drop-shadow-md text-center my-auto">BYE</h3>
                  )}
                </div>
              </div>

            </div>

            <div className="mt-12 md:mt-20 text-center flex flex-col items-center">
              <p className="text-[#ff00ff]/80 font-bold tracking-widest uppercase text-sm md:text-base">Round of {matchups.length}</p>
              <p className="mt-2 text-xs md:text-sm text-cyan-400/60 tracking-wider mb-6 md:mb-8">Match {currentMatchIndex / 2 + 1} of {matchups.length / 2}</p>
              
              <button 
                onClick={() => { 
                  stopAudio(); 
                  setHoveredSide(null);
                  setMatchups(shufflePairs(STARTING_SONGS)); 
                  setWinners([]); 
                  setCurrentMatchIndex(0); 
                  setHasStarted(false); 
                }}                
                className="text-[10px] md:text-xs text-slate-600 hover:text-rose-400 border border-slate-800 hover:border-rose-900 px-4 py-2 rounded-md transition-all tracking-[0.2em] uppercase"
              >
                Abort Tournament
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}