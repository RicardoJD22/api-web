import React, { useState } from 'react';
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

    const question = data.questions[currentQuestionIndex];

    const nextQuestion = () => {
        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex < data.questions.length) {
            setCurrentQuestionIndex(nextIndex);
        } else {
            console.log(answers); // TODO: Test, NO OLVIDAR BORRARLO!!!
            let timerInterval;
            Swal.fire({
                title: "Gracias por tu tiempo",
                html: "Tu opinión será tomada en cuenta para mejorar.",
                icon: "success",
                iconColor: "#25574e",
                background: "#dedcbb",
                timer: 8000,
                didOpen: () => {
                    Swal.showLoading();
                    const popup = Swal.getPopup();
                    const timer = popup ? popup.querySelector("b") : null;
                    if (timer) {
                        timerInterval = setInterval(() => {
                            if (timer) {
                                timer.textContent = `${Swal.getTimerLeft()}`;
                            }
                        }, 100);
                    }
                },
                willClose: () => {
                    clearInterval(timerInterval);
                },
            }).then(() => {
                window.location.href = "/";
            });
        }
    };

    const handleAnswerSelection = (answer) => {
        setAnswers({...answers, [question.id]: answer});
        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex < data.questions.length) {
            setCurrentQuestionIndex(nextIndex); 
        } else {
            nextQuestion()
        }
    };

    return (
        <div className="h-screen flex flex-col gap-60">
            <section className="flex flex-col items-center gap-28 p-6">
                <p className="text-4xl text-black font-black text-center mt-10 uppercase">
                    Tu opinión nos importa
                </p>
                <article>
                    <h1 className="text-6xl font-black text-black text-center">
                        {question.question}
                    </h1>
                    <form action="" className="flex justify-around mt-28">
                        {question.answers.map((answer, index) => (
                            <div key={index}>
                                <label className="cursor-pointer text-center" htmlFor={`answer-${question.id}-${index}`}>
                                    <img
                                        src={data.answerImages[answer]}
                                        alt={answer}
                                        className="w-36 h-36 mix-blend-multiply"
                                    />
                                    <input
                                        
                                        type="radio"
                                        name={`question-${question.id}`} // Nombre único para cada grupo de opciones
                                        id={`answer-${question.id}-${index}`}
                                        value={answer}
                                        checked={answers[question.id] === answer} // Marca la opción seleccionada
                                        onChange={() => handleAnswerSelection(answer)} // Invoca la función al seleccionar una respuesta
                                    />
                                    <p className="text-2xl font-bold">{answer}</p>
                                </label>
                            </div>
                        ))}
                    </form>
                </article>
            </section>

            <footer className="flex flex-col items-center gap-24">
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
                        className="bg-black text-3xl font-bold text-white py-6 px-20 rounded-2xl uppercase cursor-pointer"
                    >
                        Omitir
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default Questions;
