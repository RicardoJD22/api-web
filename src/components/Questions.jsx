import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

const CELEBRATION_EMOJIS = ['🎉','🎊','⭐','✨','🌟','💫','🎈','🏆','👏','🎆'];

const CelebrationOverlay = () => {
    const particles = Array.from({ length: 60 }, (_, i) => ({
        id: i,
        emoji: CELEBRATION_EMOJIS[i % CELEBRATION_EMOJIS.length],
        x: Math.random() * 100,
        delay: Math.random() * 0.8,
        duration: 1.2 + Math.random() * 1.2,
        size: 28 + Math.floor(Math.random() * 36),
        rotate: Math.random() * 720 - 360,
    }));

    return (
        <motion.div
            className="fixed inset-0 z-[999] flex flex-col items-center justify-center pointer-events-none overflow-hidden"
            style={{ background: 'rgba(0,0,0,0.72)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Partículas que caen */}
            {particles.map(p => (
                <motion.span
                    key={p.id}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: `${p.x}%`,
                        fontSize: p.size,
                        lineHeight: 1,
                    }}
                    initial={{ y: -80, opacity: 1, rotate: 0 }}
                    animate={{ y: '110vh', opacity: [1, 1, 0], rotate: p.rotate }}
                    transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
                >
                    {p.emoji}
                </motion.span>
            ))}

            {/* Mensaje central */}
            <motion.div
                className="flex flex-col items-center gap-4 z-10"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.2 }}
            >
                <span style={{ fontSize: 96 }}>🎉</span>
                <h2 className="text-6xl font-black text-white drop-shadow-[0_0_30px_rgba(34,211,238,0.9)] text-center tracking-wide">
                    ¡Gracias!
                </h2>
                <p className="text-2xl font-bold text-cyan-300 text-center">
                    Tu opinión hace la diferencia
                </p>
            </motion.div>
        </motion.div>
    );
};

const Questions = () => {
    const data = {
        questions: [
            { id: 1, question: "¿Cómo consideras la limpieza del Malecón?", answers: ["Mala", "Regular", "Buena"] },
            { id: 2, question: "¿Crees que debería haber más eventos artísticos?", answers: ["No", "No lo sé", "Sí"] },
            { id: 3, question: "¿Qué te parecen las áreas verdes del Malecón?", answers: ["Malas", "Regulares", "Buenas"] },
            { id: 4, question: "¿Consideras el Malecón un lugar seguro?", answers: ["No", "Más o menos", "Sí"] },
            { id: 5, question: "En general, ¿Qué te parece el Malecón?", answers: ["Muy mal", "Puede mejorar", "Excelente"] }
        ],
        answerImages: {
            Mala: '/enojado.gif', Regular: '/neutral.gif', Buena: '/contento.gif',
            No: '/enojado.gif', 'No lo sé': '/neutral.gif', Sí: '/contento.gif',
            Malas: '/enojado.gif', Regulares: '/neutral.gif', Buenas: '/contento.gif',
            'Más o menos': '/neutral.gif', 'Muy mal': '/enojado.gif', 'Puede mejorar': '/neutral.gif', Excelente: '/contento.gif',
        },
    };

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [isAnswerSelected, setIsAnswerSelected] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [explosionEmojis, setExplosionEmojis] = useState([]);
    const [showCelebration, setShowCelebration] = useState(false);

    const handleAnswerSelection = (answer) => {
        if (isAnswerSelected) return;

        setAnswers({ ...answers, [question.id]: answer });
        setIsAnswerSelected(true);
        setSelectedAnswer(answer);

        const explosionCount = 30;
        const emojis = Array(explosionCount).fill(answer);
        setExplosionEmojis(emojis);

        setTimeout(() => {
            const nextIndex = currentQuestionIndex + 1;
            if (nextIndex < data.questions.length) {
                setCurrentQuestionIndex(nextIndex);
                setIsAnswerSelected(false);
                setSelectedAnswer(null);
                setExplosionEmojis([]);
            } else {
                // Mostrar celebración primero
                setExplosionEmojis([]);
                setShowCelebration(true);
                setTimeout(() => {
                    setShowCelebration(false);
                    Swal.fire({
                        title: "¡Gracias por tu tiempo!",
                        text: "Tus respuestas ayudan a mejorar nuestro malecón.",
                        icon: "success",
                        background: '#0f172a',
                        color: '#fff',
                        showConfirmButton: false,
                        timer: 3000
                    }).then(() => {
                        window.location.href = "/";
                    });
                }, 2800);
            }
        }, 1100);
    };

    const question = data.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / data.questions.length) * 100;

    return (
        <>
            <AnimatePresence>
                {showCelebration && <CelebrationOverlay />}
            </AnimatePresence>

            <div className="min-h-screen flex flex-col justify-center items-center pt-8 pb-6 px-4 md:px-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 to-slate-950 select-none overflow-hidden touch-manipulation">
                
                <div className="w-full max-w-5xl flex flex-col items-center">
                    
                    <h1 className="text-3xl md:text-5xl font-black text-cyan-400 uppercase tracking-widest drop-shadow-[0_0_15px_rgba(34,211,238,0.4)] mb-6 text-center">
                        Tu Opinión Nos Importa
                    </h1>

                    {/* Progress Bar */}
                    <div className="w-full max-w-3xl bg-slate-800 rounded-full h-8 md:h-10 mb-8 shadow-inner border border-slate-700/50 relative overflow-hidden">
                        <motion.div
                            className="h-full bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.8)] relative"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            <div className="absolute inset-0 bg-white/20 w-full h-full" style={{backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)'}}></div>
                        </motion.div>
                    </div>

                    {/* Question Box */}
                    <div className="w-full bg-slate-900/60 backdrop-blur-xl border border-slate-700/60 rounded-3xl p-10 md:p-16 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)]">
                        
                        <AnimatePresence mode='wait'>
                            <motion.div
                                key={currentQuestionIndex}
                                className="flex flex-col items-center gap-10 md:gap-16"
                                initial={{ opacity: 0, scale: 0.85, y: 40 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 1.1, y: -40 }}
                                transition={{ type: 'spring', stiffness: 180, damping: 18 }}
                            >
                                <h2 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-slate-100 text-center leading-tight drop-shadow-md">
                                    {question.question}
                                </h2>

                                <div className="flex flex-col sm:flex-row justify-center items-stretch gap-6 md:gap-8 w-full">
                                    {question.answers.map((answer, index) => {
                                        const isSelected = selectedAnswer === answer;
                                        return (
                                            <div key={index} className="flex-1 relative flex flex-col items-center">
                                                
                                                <motion.button
                                                    className={`w-full flex flex-col items-center justify-center p-10 rounded-3xl transition-colors duration-200 touch-manipulation group outline-none
                                                    ${isSelected 
                                                        ? 'bg-cyan-900/40 border-4 border-cyan-400 shadow-[0_0_40px_rgba(34,211,238,0.5)]' 
                                                        : 'bg-slate-800 border-4 border-transparent hover:border-slate-600 shadow-xl'}`}
                                                    onClick={() => handleAnswerSelection(answer)}
                                                    aria-label={`Seleccionar: ${answer}`}
                                                    whileTap={{ scale: 0.92 }}
                                                    whileHover={{ scale: 1.04, y: -4 }}
                                                    initial={{ opacity: 0, y: 30 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 + 0.2, type: 'spring', stiffness: 200 }}
                                                >
                                                    <motion.img
                                                        src={data.answerImages[answer]}
                                                        alt={`Opción ${answer}`}
                                                        className="w-44 h-44 sm:w-52 sm:h-52 object-contain drop-shadow-2xl"
                                                        loading="lazy"
                                                        draggable={false}
                                                        animate={isSelected ? { scale: [1, 1.3, 1.15], rotate: [0, -8, 8, 0] } : { scale: 1 }}
                                                        transition={{ duration: 0.5 }}
                                                    />
                                                    <p className={`text-3xl sm:text-4xl font-black mt-6 tracking-wide ${isSelected ? 'text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]' : 'text-slate-300'}`}>
                                                        {answer}
                                                    </p>
                                                </motion.button>

                                                {/* Explosión al seleccionar */}
                                                {isSelected && explosionEmojis.length > 0 && (
                                                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                                                        {explosionEmojis.map((emoji, idx) => (
                                                            <motion.img
                                                                key={idx}
                                                                src={data.answerImages[emoji]}
                                                                alt=""
                                                                className="absolute object-contain"
                                                                style={{ width: 40 + Math.floor(Math.random() * 30) }}
                                                                initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                                                                animate={{
                                                                    opacity: 0,
                                                                    scale: Math.random() * 2 + 0.5,
                                                                    x: (Math.random() - 0.5) * 500,
                                                                    y: (Math.random() - 0.5) * 500,
                                                                    rotate: Math.random() * 540
                                                                }}
                                                                transition={{ duration: 1.0, ease: "easeOut", delay: idx * 0.02 }}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        </AnimatePresence>

                    </div>

                    {/* Controles */}
                    <div className="w-full max-w-5xl flex justify-end items-center mt-8 px-4">
                        <span className="text-slate-500 font-bold text-2xl md:text-3xl tracking-widest uppercase">
                            PREGUNTA {currentQuestionIndex + 1} DE {data.questions.length}
                        </span>
                    </div>

                </div>
            </div>
        </>
    );
};

export default Questions;
