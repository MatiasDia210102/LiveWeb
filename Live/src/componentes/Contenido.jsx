import React from 'react';
import { games } from './data/juegos.js';
import { useScrollReveal } from '../hooks/aparicion.js';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css'; 
import 'swiper/css/autoplay';
import 'swiper/css/pagination';
import GameCard from './TarjetaJuego.jsx';

export default function GamesSection() {
    const [contentRef, isVisible] = useScrollReveal({ threshold: 0.1 });

    const transitionClasses = `transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
    }`;

    const swiperParams = {
        modules: [Autoplay, Pagination],
        pagination: { clickable: true },
        autoplay: { delay: 2000, disableOnInteraction: false, pauseOnMouseEnter: true },
        loop: true,
        spaceBetween: 24,
        speed: 2000,
        slidesPerView: 1,
        slidesPerGroup: 1,
        centeredSlides: true, 

        breakpoints: {
            640: {
                slidesPerView: 2,
                slidesPerGroup: 2,
                centeredSlides: false,
            },
            1024: {
                slidesPerView: 3,
                slidesPerGroup: 3,
                centeredSlides: false,
            },
        },
    };

    return (
        <section id="content" className="py-10 text-white font-[Poppins] relative" style={{ backgroundImage: `url('Fotos/azimuth.jpg')`, 
            backgroundSize: 'cover', backgroundPosition: 'center',   }}>

            <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-black/100 to-transparent"></div>
            <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/100 to-transparent"></div>
            
            <div className="container mx-auto max-w-6xl px-6">
                <h2 className={`text-4xl font-bold text-center mb-12 text-cyan-400 ${transitionClasses}`} style={{ transitionDelay: '0ms' }}>
                    Juegos que Transmito
                </h2>

                <div ref={contentRef} className="w-full">
                    <Swiper {...swiperParams} className="w-full h-auto relative pb-10">
                        {games.map((game, index) => (
                            <SwiperSlide key={game.id} className="w-full" style={{ transitionDelay: `${100 * (index + 1)}ms` }}>
                                <div className="w-full flex justify-center">
                                    <GameCard game={game} />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
}