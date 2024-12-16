import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

const Questions = () => {
    const data = {
        questions: [
            {
                id: 1,
                question: "¿Como consideras la limpieza del Malecon?",
                answers: [
                    "Mala",
                    "Regular",
                    "Buena"
                ]
            },
            {
                id: 2,
                question: "¿Crees que deberia haber mas eventos artisticos?",
                answers: [
                    "No",
                    "No lo se",
                    "Si"
                ]
            },
            {
                id: 3,
                question: "¿Que te parecen las areas verdes del Malecon?",
                answers: [
                    "Malas",
                    "Regulares",
                    "Buenas"
                ]
            },
            {
                id: 4,
                question: "¿Consideras el Malecon un lugar seguro?",
                answers: [
                    "No",
                    "Mas o menos",
                    "Si"
                ]
            },
            {
                id: 5,
                question: "En general, ¿Que te parece el Malecon?",
                answers: [
                    "Muy mal",
                    "Puede Mejorar",
                    "Excelente"
                ]
            }
        ],
        answerImages: {
            Mala: 'public/enojado.gif',
            Regular: 'public/neutral.gif',
            Buena: 'public/contento.gif',
            No: 'public/enojado.gif',
            'No lo se': 'public/neutral.gif',
            Si: 'public/contento.gif',
            Malas: 'public/enojado.gif',
            Regulares: 'public/neutral.gif',
            Buenas: 'public/contento.gif',
            'Mas o menos': 'public/neutral.gif',
            'Muy mal': 'public/enojado.gif',
            'Puede Mejorar': 'public/neutral.gif',
            Excelente: 'public/contento.gif',
        },
    };

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [isAnswerSelected, setIsAnswerSelected] = useState(false); // Nueva variable para controlar la selección de respuestas

    let answerMapped = Object.keys(answers).map((key) => answers[key]);
    const question = data.questions[currentQuestionIndex];

    useEffect(() => {
        // Cargar respuestas desde localStorage si existen
        const savedAnswers = JSON.parse(localStorage.getItem('userAnswers')) || {};
        setAnswers(savedAnswers);
    }, []);

    const nextQuestion = () => {
        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex < data.questions.length) {
            setCurrentQuestionIndex(nextIndex);
            setIsAnswerSelected(false); // Resetear selección de respuesta
        } else {
            // Guardar respuestas al finalizar
            localStorage.setItem('userAnswers', JSON.stringify(answers));
            let answerSummary = answerMapped.join(", ");
            Swal.fire({
                title: "Gracias por tu tiempo",
                html: `Tus respuestas: <br> ${answerSummary} <br> <strong>¡Volviendo al inicio!</strong>`,
                icon: "success",
                showConfirmButton: false,
                iconColor: "#25574e",
                background: "#dedcbb",
                timer: 5000,
            }).then(() => {
                window.location.href = "/";  // Redirige al inicio después de 5 segundos
            });
        }
    };

    const handleAnswerSelection = (answer) => {
        setAnswers({ ...answers, [question.id]: answer });
        setIsAnswerSelected(true);  // Marcar como seleccionada
        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex < data.questions.length) {
            setCurrentQuestionIndex(nextIndex);
        } else {
            nextQuestion();
        }
    };

    return (
        <div className="h-screen flex flex-col gap-40">
            <p className="text-xl md:text-4xl lg:text-5xl font-black text-black text-center mt-8 uppercase">
                Tu opinión nos importa
            </p>
            <AnimatePresence mode='wait'>
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
                                <div key={index}>
                                    <label className="cursor-pointer text-center" htmlFor={`answer-${question.id}-${index}`} aria-label={`Selecciona ${answer} para la pregunta: ${question.question}`}>
                                        <img
                                            src={data.answerImages[answer]}
                                            alt={answer}
                                            className="w-36 h-36 mix-blend-multiply"
                                        />
                                        <input
                                            className='hidden'
                                            type="radio"
                                            name={`question-${question.id}`}
                                            id={`answer-${question.id}-${index}`}
                                            value={answer}
                                            checked={answers[question.id] === answer} 
                                            onChange={() => handleAnswerSelection(answer)} 
                                        />
                                        <p className="text-2xl font-bold">{answer}</p>
                                    </label>
                                </div>
                            ))}
                        </form>
                    </article>
                </motion.section>
            </AnimatePresence>

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
                        disabled={!isAnswerSelected}  // Deshabilita el botón si no se selecciona una respuesta
                        className="bg-black text-3xl font-bold text-white py-6 px-20 rounded-2xl uppercase cursor-pointer"
                    >
                        Siguiente
                    </button>
                </div>
            </footer>

            {/* Botón para reiniciar la encuesta */}
            <button
                onClick={() => setCurrentQuestionIndex(0)}  // Reinicia el índice de la pregunta
                className="bg-blue-500 text-3xl font-bold text-white py-6 px-20 rounded-2xl uppercase cursor-pointer mt-8"
            >
                Volver a empezar
            </button>
        </div>
    );
};

export default Questions;
