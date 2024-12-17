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
            Mala: 'public/enojado.gif',
            Regular: 'public/neutral.gif',
            Buena: 'public/contento.gif',
            No: 'public/enojado.gif',
            'No lo sé': 'public/neutral.gif',
            Sí: 'public/contento.gif',
            Malas: 'public/enojado.gif',
            Regulares: 'public/neutral.gif',
            Buenas: 'public/contento.gif',
            'Más o menos': 'public/neutral.gif',
            'Muy mal': 'public/enojado.gif',
            'Puede mejorar': 'public/neutral.gif',
            Excelente: 'public/contento.gif',
        },
    };

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [isAnswerSelected, setIsAnswerSelected] = useState(false);
    const [explosionEmojis, setExplosionEmojis] = useState([]); // Para guardar las explosiones de emojis

    const handleAnswerSelection = (answer) => {
        setAnswers({ ...answers, [question.id]: answer });
        setIsAnswerSelected(true); // Marcar como seleccionada

        // Generar múltiples emojis para la explosión (por ejemplo, 20 emojis)
        const explosionCount = 20; // Número de emojis generados
        const emojis = Array(explosionCount).fill(answer); // Crea un array de respuestas para la explosión
        setExplosionEmojis(emojis); // Actualiza el estado con los emojis para la explosión

        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex < data.questions.length) {
            setCurrentQuestionIndex(nextIndex);
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

    return (
        <div className="h-screen flex flex-col gap-40 relative">
            <p className="text-xl md:text-4xl lg:text-5xl font-black text-black text-center mt-8 uppercase">
                Tu opinión nos importa
            </p>
            <motion.section
                key={currentQuestionIndex}
                className="flex flex-col items-center gap-10 p-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <article>
                    <h1 className="text-3xl md:text-6xl font-black text-black text-center">
                        {question.question}
                    </h1>
                    <form action="" className="flex justify-around mt-28">
                        {question.answers.map((answer, index) => (
                            <div key={index} className="relative">
                                <label
                                    htmlFor={`answer-${question.id}-${index}`}
                                    className="cursor-pointer text-center"
                                    onClick={() => handleAnswerSelection(answer)}
                                >
                                    <motion.img
                                        src={data.answerImages[answer]}
                                        alt={answer}
                                        className="w-36 h-36 mix-blend-multiply"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.5 }}
                                    />
                                    <p className="text-2xl font-bold">{answer}</p>
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
                                                    x: (Math.random() - 0.5) * 300, // Mayor dispersión
                                                    y: (Math.random() - 0.5) * 300, // Mayor dispersión
                                                }}
                                                transition={{
                                                    duration: 1,
                                                    ease: "easeOut",
                                                }}
                                            >
                                                <img
                                                    src={data.answerImages[emoji]}
                                                    alt={emoji}
                                                    className="w-8 h-8 mix-blend-multiply"
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

            <footer className="flex flex-col items-center gap-72">
                <span>
                    <p className="text-5xl font-black">
                        {currentQuestionIndex + 1} de {data.questions.length}
                    </p>
                </span>
                <div className="flex w-full justify-around gap-36">
                    <a
                        href="/"
                        className="bg-red-950 text-3xl font-bold text-white py-6 px-20 rounded-2xl uppercase"
                    >
                        Salir
                    </a>
                    <button
                        onClick={nextQuestion}
                        disabled={!isAnswerSelected}
                        className="bg-black text-3xl font-bold text-white py-6 px-20 rounded-2xl uppercase cursor-pointer"
                    >
                        Siguiente
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default Questions;
