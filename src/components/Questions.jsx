import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

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

    const handleAnswerSelection = (answer) => {
        if (isAnswerSelected) return; // Prevenir múltiples toques mientras avanza

        setAnswers({ ...answers, [question.id]: answer });
        setIsAnswerSelected(true);
        setSelectedAnswer(answer);

        const explosionCount = 15;
        const emojis = Array(explosionCount).fill(answer);
        setExplosionEmojis(emojis);

        // Auto-Avanzar tras 1.2 segundos para darle tiempo de ver la animación
        setTimeout(() => {
            const nextIndex = currentQuestionIndex + 1;
            if (nextIndex < data.questions.length) {
                setCurrentQuestionIndex(nextIndex);
                setIsAnswerSelected(false);
                setSelectedAnswer(null);
                setExplosionEmojis([]);
            } else {
                Swal.fire({
                    title: "¡Gracias por tu tiempo!",
                    text: "Tus respuestas ayudan a mejorar nuestro malecón.",
                    icon: "success",
                    background: '#0f172a',
                    color: '#fff',
                    showConfirmButton: false, // Auto cierre para Kioskos táctiles
                    timer: 3500 // 3.5 segundos para reset
                }).then(() => {
                    window.location.href = "/";
                });
            }
        }, 1100);
    };

    const question = data.questions[currentQuestionIndex];

    const progress = ((currentQuestionIndex + 1) / data.questions.length) * 100;

    return (
        <div className="min-h-screen flex flex-col justify-center items-center py-10 px-4 md:px-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 to-slate-950 select-none overflow-hidden touch-manipulation">
            
            <div className="w-full max-w-5xl flex flex-col items-center">
                
                {/* Header Title */}
                <h1 className="text-3xl md:text-5xl font-black text-cyan-400 uppercase tracking-widest drop-shadow-[0_0_15px_rgba(34,211,238,0.4)] mb-8 text-center">
                    Tu Opinión Nos Importa
                </h1>

                {/* Progress Bar Kiosko */}
                <div className="w-full max-w-2xl bg-slate-800 rounded-full h-6 md:h-8 mb-12 shadow-inner border border-slate-700/50 relative overflow-hidden">
                    <motion.div
                        className="h-full bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.8)] relative"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]" style={{backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)'}}></div>
                    </motion.div>
                </div>

                {/* Question Box */}
                <div className="w-full bg-slate-900/60 backdrop-blur-xl border border-slate-700/60 rounded-3xl p-8 md:p-14 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)]">
                    
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={currentQuestionIndex}
                            className="flex flex-col items-center gap-10 md:gap-14"
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 1.05, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-slate-100 text-center leading-tight drop-shadow-md">
                                {question.question}
                            </h2>

                            <div className="flex flex-col sm:flex-row justify-center items-stretch gap-6 md:gap-8 w-full">
                                {question.answers.map((answer, index) => {
                                    const isSelected = selectedAnswer === answer;
                                    return (
                                        <div key={index} className="flex-1 relative flex flex-col items-center">
                                            
                                            <button
                                                className={`w-full flex flex-col items-center justify-center p-8 rounded-3xl transition-all duration-300 active:scale-95 touch-manipulation group outline-none
                                                ${isSelected 
                                                    ? 'bg-cyan-900/40 border-4 border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.3)]' 
                                                    : 'bg-slate-800 border-4 border-transparent hover:border-slate-600 shadow-xl'}`}
                                                onClick={() => handleAnswerSelection(answer)}
                                                aria-label={`Seleccionar: ${answer}`}
                                            >
                                                <img
                                                    src={data.answerImages[answer]}
                                                    alt={`Opción ${answer}`}
                                                    className={`w-32 h-32 sm:w-40 sm:h-40 object-contain drop-shadow-2xl transition-transform duration-300 ${isSelected ? 'scale-110' : 'group-hover:scale-105'}`}
                                                    loading="lazy"
                                                    draggable={false}
                                                />
                                                <p className={`text-2xl sm:text-3xl font-black mt-6 tracking-wide ${isSelected ? 'text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]' : 'text-slate-300'}`}>
                                                    {answer}
                                                </p>
                                            </button>

                                            {/* Explosión Kiosko (Optimizada) */}
                                            {explosionEmojis.includes(answer) && isSelected && (
                                                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                                                    {explosionEmojis.map((emoji, idx) => (
                                                        <motion.img
                                                            key={idx}
                                                            src={data.answerImages[emoji]}
                                                            alt=""
                                                            className="absolute w-12 h-12 object-contain"
                                                            initial={{ opacity: 1, scale: 0 }}
                                                            animate={{
                                                                opacity: 0,
                                                                scale: Math.random() * 1.5 + 0.5,
                                                                x: (Math.random() - 0.5) * 300,
                                                                y: (Math.random() - 0.5) * 300,
                                                                rotate: Math.random() * 360
                                                            }}
                                                            transition={{ duration: 0.8, ease: "easeOut" }}
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

                {/* Controles Kiosko (Navegación Inferior) */}
                <div className="w-full max-w-5xl flex flex-col-reverse sm:flex-row justify-between items-center mt-12 gap-8 px-4">
                    
                    <a
                        href="/"
                        className="w-full sm:w-auto bg-slate-800 text-slate-300 text-2xl font-bold py-5 px-12 md:py-6 md:px-16 rounded-full border border-slate-700 active:scale-95 transition-all text-center touch-manipulation uppercase tracking-widest shadow-lg"
                    >
                        Salir
                    </a>
                    
                    <div className="flex flex-col items-end">
                        <span className="text-slate-500 font-bold text-xl md:text-2xl tracking-widest uppercase">
                            PREGUNTA {currentQuestionIndex + 1} DE {data.questions.length}
                        </span>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default Questions;
