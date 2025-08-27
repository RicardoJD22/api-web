import { useState } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

const Questions = () => {
    const data = {
        questions: [
            {
                id: 1,
                question: "¿Cómo consideras la limpieza del Malecón?",
                answers: [
                    "Mala",
                    "Regular",
                    "Buena"
                ]
            },
            {
                id: 2,
                question: "¿Crees que debería haber más eventos artísticos?",
                answers: [
                    "No",
                    "No lo sé",
                    "Sí"
                ]
            },
            {
                id: 3,
                question: "¿Qué te parecen las áreas verdes del Malecón?",
                answers: [
                    "Malas",
                    "Regulares",
                    "Buenas"
                ]
            },
            {
                id: 4,
                question: "¿Consideras el Malecón un lugar seguro?",
                answers: [
                    "No",
                    "Más o menos",
                    "Sí"
                ]
            },
            {
                id: 5,
                question: "En general, ¿Qué te parece el Malecón?",
                answers: [
                    "Muy mal",
                    "Puede mejorar",
                    "Excelente"
                ]
            }
        ],
        answerImages: {
            Mala: '/enojado.gif',
            Regular: '/neutral.gif',
            Buena: '/contento.gif',
            No: '/enojado.gif',
            'No lo sé': '/neutral.gif',
            Sí: '/contento.gif',
            Malas: '/enojado.gif',
            Regulares: '/neutral.gif',
            Buenas: '/contento.gif',
            'Más o menos': '/neutral.gif',
            'Muy mal': '/enojado.gif',
            'Puede mejorar': '/neutral.gif',
            Excelente: '/contento.gif',
        },
    };

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [isAnswerSelected, setIsAnswerSelected] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [explosionEmojis, setExplosionEmojis] = useState([]); // Para guardar las explosiones de emojis

    const handleAnswerSelection = (answer) => {
        setAnswers({ ...answers, [question.id]: answer });
        setIsAnswerSelected(true); // Marcar como seleccionada
        setSelectedAnswer(answer); // Guardar la opción seleccionada

        // Generar múltiples emojis para la explosión (por ejemplo, 20 emojis)
        const explosionCount = 20; // Número de emojis generados
        const emojis = Array(explosionCount).fill(answer); // Crea un array de respuestas para la explosión
        setExplosionEmojis(emojis); // Actualiza el estado con los emojis para la explosión

        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex < data.questions.length) {
            setCurrentQuestionIndex(nextIndex);
            setSelectedAnswer(null); // Limpiar selección para la siguiente pregunta
        } else {
            nextQuestion();
        }
    };

    const question = data.questions[currentQuestionIndex];

    const nextQuestion = () => {
        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex < data.questions.length) {
            setCurrentQuestionIndex(nextIndex);
            setIsAnswerSelected(false); // Resetear selección de respuesta
        } else {
            Swal.fire({
                title: "Gracias por tu tiempo",
                text: "Tus respuestas han sido registradas.",
                icon: "success",
            }).then(() => {
                window.location.href = "/";  // Redirige al inicio después de mostrar el mensaje
            });
        }
    };

    // Barra de progreso
    const progress = ((currentQuestionIndex + 1) / data.questions.length) * 100;

    return (
        <div className="min-h-screen flex flex-col gap-16 md:gap-40 relative px-2 md:px-0 bg-gradient-to-b from-blue-50 to-white" role="form" aria-label="Encuesta de opinión sobre el Malecón">
            <div className="max-w-3xl mx-auto w-full rounded-3xl shadow-xl bg-white/80 p-4 md:p-6 mt-8">
                {/* Barra de progreso visual */}
                <div className="w-full h-4 bg-blue-100 rounded-full mb-6 overflow-hidden">
                    <div
                        className="h-full bg-yellow-400 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                        aria-valuenow={progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        role="progressbar"
                    />
                </div>
                <p className="text-lg sm:text-2xl md:text-4xl lg:text-5xl font-black text-black text-center uppercase">
                    Tu opinión nos importa
                </p>
                <motion.section
                    key={currentQuestionIndex}
                    className="flex flex-col items-center gap-6 md:gap-10 p-2 md:p-6"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                >
                    <article aria-labelledby={`question-title-${question.id}`}> 
                        <h1 id={`question-title-${question.id}`} className="text-xl sm:text-2xl md:text-4xl lg:text-6xl font-black text-blue-900 text-center">
                            {question.question}
                        </h1>
                        <form action="" className="flex flex-col sm:flex-row justify-center items-center gap-8 md:gap-16 mt-10 md:mt-28" aria-describedby={`question-title-${question.id}`}> 
                            {question.answers.map((answer, index) => (
                                <div key={index} className="relative flex flex-col items-center">
                                    <label
                                        htmlFor={`answer-${question.id}-${index}`}
                                        className={`cursor-pointer text-center focus:outline focus:outline-2 focus:outline-blue-500 transition-all duration-200 rounded-2xl px-2 py-2 ${selectedAnswer === answer ? 'ring-4 ring-yellow-400 scale-105 bg-yellow-50' : ''}`}
                                        aria-label={`Respuesta: ${answer}`}
                                        tabIndex={0}
                                        onKeyPress={e => (e.key === 'Enter' || e.key === ' ') && handleAnswerSelection(answer)}
                                        onClick={() => handleAnswerSelection(answer)}
                                    >
                                        <motion.img
                                            src={data.answerImages[answer]}
                                            alt={`Opción ${answer}`}
                                            className="w-24 h-24 sm:w-36 sm:h-36 mix-blend-multiply mx-auto"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.5 }}
                                        />
                                        <p className="text-lg sm:text-2xl font-bold mt-2">{answer}</p>
                                    </label>

                                    {/* Explosión de múltiples emojis */}
                                    {explosionEmojis.includes(answer) && (
                                        <>
                                            {explosionEmojis.map((emoji, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    className="absolute top-0 left-0"
                                                    initial={{
                                                        opacity: 1,
                                                        scale: 1,
                                                        x: 0,
                                                        y: 0,
                                                    }}
                                                    animate={{
                                                        opacity: 0,
                                                        scale: 0.5,
                                                        x: (Math.random() - 0.5) * 150, // Menor dispersión en móvil
                                                        y: (Math.random() - 0.5) * 150,
                                                    }}
                                                    transition={{
                                                        duration: 1,
                                                        ease: "easeOut",
                                                    }}
                                                >
                                                    <img
                                                        src={data.answerImages[emoji]}
                                                        alt={`Emoji ${emoji}`}
                                                        className="w-6 h-6 sm:w-8 sm:h-8 mix-blend-multiply"
                                                    />
                                                </motion.div>
                                            ))}
                                        </>
                                    )}
                                </div>
                            ))}
                        </form>
                    </article>
                </motion.section>
                <footer className="flex flex-col items-center gap-16 md:gap-72 mt-8 md:mt-0">
                    <span>
                        <p className="text-2xl md:text-5xl font-black">
                            {currentQuestionIndex + 1} de {data.questions.length}
                        </p>
                    </span>
                    <div className="flex flex-col sm:flex-row w-full justify-center items-center gap-6 md:gap-36">
                        <a
                            href="/"
                            className="bg-red-950 text-lg sm:text-2xl md:text-3xl font-bold text-white py-4 px-8 md:py-6 md:px-20 rounded-2xl uppercase mb-2 sm:mb-0 shadow-md hover:bg-red-900 transition"
                        >
                            Salir
                        </a>
                        <button
                            onClick={nextQuestion}
                            disabled={!isAnswerSelected}
                            className={`bg-yellow-400 hover:bg-yellow-500 text-black text-lg sm:text-2xl md:text-3xl font-bold py-4 px-8 md:py-6 md:px-20 rounded-2xl uppercase cursor-pointer shadow-md transition-all duration-200 ${!isAnswerSelected ? 'opacity-50 scale-95' : 'animate-bounceOnce'}`}
                            aria-disabled={!isAnswerSelected}
                        >
                            Siguiente
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );

// Animación personalizada para el botón siguiente
// Agrega esto a tu archivo CSS global si usas Tailwind JIT
// @layer utilities {
//   .animate-bounceOnce {
//     animation: bounceOnce 0.4s;
//   }
//   @keyframes bounceOnce {
//     0% { transform: scale(1); }
//     30% { transform: scale(1.08); }
//     60% { transform: scale(0.97); }
//     100% { transform: scale(1); }
//   }
// }
};

export default Questions;
