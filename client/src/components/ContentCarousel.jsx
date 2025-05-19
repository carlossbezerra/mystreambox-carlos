// client/src/components/ContentCarousel.jsx
import React from 'react';
import ContentCard from './ContentCard';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation'; // Para as setas de navegação
import 'swiper/css/pagination'; // Opcional, para dots de paginação

// import required modules
import { Navigation, Pagination } from 'swiper/modules'; // Importar módulos que usaremos

function ContentCarousel({ title, items }) { // onCardClick é tratado pelo ContentCard agora (navegação)
    const carouselContainerStyle = {
        marginBottom: '40px',
    };

    const titleStyle = {
        fontSize: '1.75rem',
        fontWeight: '700',
        color: 'var(--text-light)',
        marginBottom: '20px',
        // paddingLeft: '10px', // Pode não ser necessário com Swiper
    };

    if (!items || items.length === 0) {
        return null;
    }

    // Configurações do Swiper
    const swiperParams = {
        modules: [Navigation, Pagination], // Módulos a serem usados
        spaceBetween: 15,          // Espaço entre os slides
        slidesPerView: 'auto',     // Mostra quantos slides couberem, ou um número fixo
        loop: items.length > 5, // Habilita o loop infinito SE houver itens suficientes para justificar o loop
        // Se tiver poucos itens (ex: menos que o dobro de slides visíveis), o loop pode parecer estranho.
        // Ajuste este valor conforme o número de slides visíveis.
        // Se slidesPerView for um número, por exemplo 3, você pode querer loop: items.length > 3
        navigation: true,          // Habilita as setas de navegação padrão
        // pagination: { clickable: true }, // Opcional: habilita dots de paginação clicáveis
        breakpoints: { // Para responsividade (opcional, mas recomendado)
            // Quando a largura da janela é >= 320px
            320: {
              slidesPerView: 2.2, // Mostrar um pouco do próximo
              spaceBetween: 10
            },
            // Quando a largura da janela é >= 480px
            480: {
              slidesPerView: 2.5,
              spaceBetween: 10
            },
            // Quando a largura da janela é >= 640px
            640: {
              slidesPerView: 3.5,
              spaceBetween: 15
            },
            // Quando a largura da janela é >= 768px
            768: {
              slidesPerView: 4.5,
              spaceBetween: 15
            },
            // Quando a largura da janela é >= 1024px
            1024: {
              slidesPerView: 5.5,
              spaceBetween: 15
            },
             // Quando a largura da janela é >= 1200px
            1200: {
              slidesPerView: 6.5, // Ajuste conforme o tamanho do seu ContentCard e container
              spaceBetween: 15
            }
        }
    };

    return (
        <div style={carouselContainerStyle} className="content-carousel-wrapper">
            <h2 style={titleStyle}>{title}</h2>
            <Swiper {...swiperParams}>
                {items.map(item => (
                    <SwiperSlide key={item.id} style={{ width: 'auto' /* Permite que o ContentCard defina sua largura */ }}>
                        <ContentCard 
                            item={item} 
                            // onCardClick não é mais passado daqui se o Card navega
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

export default ContentCarousel;