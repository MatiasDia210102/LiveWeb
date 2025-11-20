import React, { useState, useEffect } from 'react';

export default function FeedbackSection() {

    const [isSubmitted, setIsSubmitted] = useState(
        sessionStorage.getItem('feedbackSubmitted') === 'true'
    );
    const [rating, setRating] = useState(0);
    const FORM_URL = "https://forms.gle/TTACioB3GkbauuucA";
    const ratingsOptions = [1, 2, 3, 4, 5];

    useEffect(() => {
        if (isSubmitted) {
            sessionStorage.setItem('feedbackSubmitted', 'true');
        } else {
            sessionStorage.removeItem('feedbackSubmitted');
        }
    }, [isSubmitted]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (rating === 0) {
            return;
        }

        window.open(FORM_URL, '_blank');
        setIsSubmitted(true);
        setRating(0);
    };

    if (isSubmitted) {
        return (
            <section className="py-16 bg-slate-900 text-center">
                <h2 className="text-4xl font-bold text-cyan-400 mb-4 drop-shadow-lg">¡Gracias por tu opinión!</h2>
                <p className="text-white text-lg">Tu feedback ha sido enviado. Esta sección se mantendrá en agradecimiento durante tu sesión de navegación.</p>
                <button onClick={() => setIsSubmitted(false)} className="mt-4 text-sm text-gray-400 hover:text-cyan-400 transition-colors">
                    (Ocultar mensaje)
                </button>
            </section>
        );
    }

    return (
        <section className="relative py-16 border-cyan-500/20 overflow-hidden">
 
            <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-black/80 to-transparent pointer-events-none"></div>
            <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
            <div className="max-w-3xl mx-auto px-4 relative z-10">

                <h2 className="text-4xl font-bold text-cyan-500 mb-6 text-center drop-shadow-lg">
                    Ayúdanos a Mejorar
                </h2>
                <p className="text-white text-xl mb-8 text-center">
                    Tu opinión es muy importante. Primero califica, y luego serás redirigido para dejar un comentario completo.
                </p>

                <form onSubmit={handleSubmit} className="bg-black/70 p-8 rounded-xl shadow-2xl border border-cyan-500/30">
                    
                    <div className="mb-6">
                        <label className="block text-2xl font-semibold text-pink-700 mb-3 text-center">
                            Califica el Contenido General:
                        </label>
                        <div className="flex justify-center gap-4">
                            {ratingsOptions.map((star) => (
                                <span key={star} onClick={() => setRating(star)} className={`text-4xl cursor-pointer transition-transform duration-200 
                                ${rating >= star ? 'text-yellow-400 scale-110' : 'text-gray-600 hover:text-yellow-300'}`}>
                                    ★
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="text-center mt-8">
                        <button type="submit" disabled={rating === 0} className={`px-8 py-3 rounded-full text-xl font-bold transition-all duration-300 drop-shadow-lg 
                        ${rating > 0 
                            ? 'bg-pink-600 text-white hover:bg-pink-700 shadow-pink-500/50' 
                            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        }`}>
                            Ir al Formulario Completo
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}