import React from "react";
import ImageGallery from "../common/ImageGallery";

/**
 * Componente de galeria em mosaico do hotel
 * @param {array} imagensGaleria - Array com URLs das imagens da galeria
 * @param {boolean} galeriaAberta - Estado se a galeria modal está aberta
 * @param {function} setGaleriaAberta - Função para controlar abertura da galeria
 * @param {number} fotoIndex - Índice da foto atual
 * @param {function} setFotoIndex - Função para definir foto atual
 */
const HotelGallery = ({
  imagensGaleria,
  galeriaAberta,
  setGaleriaAberta,
  fotoIndex,
  setFotoIndex,
}) => {
  // Prepara imagens do mosaico - usa as imagens dinâmicas quando disponível
  const prepareMosaicImages = (images) => {
    if (!images || images.length === 0) {
      // Fallback para imagens padrão
      return [
        {
          src: "https://media.staticontent.com/media/pictures/6fa5bc8d-4480-4751-9ad5-20635d6d5053/853x380?op=TRUNCATE&enlarge=false&gravity=ce_0_0&quality=80",
          alt: "Vista da fachada da hospedagem",
          className:
            "col mosaic-gallery-item -lg-8 -md-6 row-span-2 col-span-2 h-full",
        },
        {
          src: "https://media.staticontent.com/media/pictures/319e43ac-bbe0-4eb6-bec9-c00b04e42d74/422x250?op=TRUNCATE&enlarge=false&gravity=ce_0_0&quality=80",
          alt: "Restaurante da hospedagem",
          className:
            "col -lg-4 -md-6 mosaic-gallery-item col-span-1 row-span-1",
        },
        {
          src: "https://media.staticontent.com/media/pictures/166ead6b-eb6e-43f7-a91c-0e6c05142f34/208x125?op=TRUNCATE&enlarge=false&gravity=ce_0_0&quality=80",
          alt: "Quarto da hospedagem",
          className:
            "col mosaic-gallery-item -lg-2 -md-3 col-span-1 row-span-1",
        },
      ];
    }

    // Usa as imagens dinâmicas
    const mosaicConfig = [
      {
        className:
          "col mosaic-gallery-item -lg-8 -md-6 row-span-2 col-span-2 h-full",
        alt: "Imagem principal",
        size: "853x380"
      },
      {
        className: "col -lg-4 -md-6 mosaic-gallery-item col-span-1 row-span-1",
        alt: "Imagem secundária",
        size: "422x250"
      },
      {
        className: "col mosaic-gallery-item -lg-2 -md-3 col-span-1 row-span-1",
        alt: "Imagem adicional",
        size: "208x125"
      },
    ];

    return images.slice(0, 3).map((imgUrl, index) => ({
      src: imgUrl,
      alt: mosaicConfig[index]?.alt || `Imagem ${index + 1}`,
      className:
        mosaicConfig[index]?.className ||
        "col mosaic-gallery-item col-span-1 row-span-1",
    }));
  };

  const mosaicImages = prepareMosaicImages(imagensGaleria);
  
console.log("🔍 imagensGaleria recebidas:", imagensGaleria);


  return (
    <div className="eva-3-mosaic-gallery w-full relative bg-transparent">
      {/* Grid de imagens em mosaico */}
      <ul className="eva-3-row -no-gutter mosaic-gallery-list grid grid-cols-3 gap-2 w-full h-[260px] md:h-[380px] bg-transparent">
        {mosaicImages.map((image, index) => (
          <li key={index} className={image.className}>
            <div className="media-picture-container w-full h-full">
              <img
                src={image.src}
                alt={image.alt}
                className="rounded-xl object-cover w-full h-full cursor-pointer hover:opacity-90 transition-opacity"
                style={{ display: "block" }}
                onClick={() => {
                  setFotoIndex(index);
                  setGaleriaAberta(true);
                }}
                onError={(e) => {
                  // Fallback para imagem padrão se houver erro
                  e.target.src =
                    "https://media.staticontent.com/media/pictures/6fa5bc8d-4480-4751-9ad5-20635d6d5053/853x380?op=TRUNCATE&enlarge=false&gravity=ce_0_0&quality=80";
                }}
              />
            </div>
          </li>
        ))}
      </ul>

      {/* Botão Ver galeria */}
      <div className="absolute top-4 right-4 z-10">
        <button
          className="bg-white text-blue-900 font-semibold rounded-lg px-4 py-2 hover:bg-orange-500 hover:text-white transition border border-blue-100 cursor-pointer"
          onClick={() => setGaleriaAberta(true)}
        >
          Ver galeria
        </button>
      </div>

      {/* Modal de galeria componentizado */}
      <ImageGallery
        imagensGaleria={imagensGaleria}
        galeriaAberta={galeriaAberta}
        setGaleriaAberta={setGaleriaAberta}
        fotoIndex={fotoIndex}
        setFotoIndex={setFotoIndex}
      />
    </div>
  );
};

export default HotelGallery;
