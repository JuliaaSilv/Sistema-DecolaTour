import React from "react";
import ImageGallery from "../common/ImageGallery";

/**
 * Componente de galeria em mosaico do hotel
 * @param {array} imagensGaleria - Array com URLs das imagens da galeria
 * @param {array} videosGaleria - Array com URLs dos vídeos da galeria
 * @param {boolean} galeriaAberta - Estado se a galeria modal está aberta
 * @param {function} setGaleriaAberta - Função para controlar abertura da galeria
 * @param {number} fotoIndex - Índice da foto atual
 * @param {function} setFotoIndex - Função para definir foto atual
 */
const HotelGallery = ({
  imagensGaleria,
  videosGaleria = [],
  galeriaAberta,
  setGaleriaAberta,
  fotoIndex,
  setFotoIndex,
}) => {
  const prepareMosaicImages = (images, videos) => {
    const allMedia = [];

    if (images && images.length > 0) {
      images.forEach((imgUrl) => {
        const cleanUrl = imgUrl.split("?")[0]; // Remove compressão/truncamento
        allMedia.push({ src: cleanUrl, type: "image" });
      });
    }

    if (videos && videos.length > 0) {
      videos.forEach((videoUrl) => {
        allMedia.push({ src: videoUrl, type: "video" });
      });
    }

    if (allMedia.length === 0) {
      return [
        {
          src: "https://cdn.pixabay.com/photo/2021/06/01/20/17/hotel-6303176_1280.jpg",
          alt: "Vista da fachada da hospedagem",
          type: "image",
        },
        {
          src: "https://cdn.pixabay.com/photo/2016/11/29/09/32/hotel-1867761_1280.jpg",
          alt: "Restaurante da hospedagem",
          type: "image",
        },
        {
          src: "https://cdn.pixabay.com/photo/2017/04/28/00/36/pool-2266663_1280.jpg",
          alt: "Quarto da hospedagem",
          type: "image",
        },
      ];
    }

    return allMedia.slice(0, 3).map((media, index) => ({
      src: media.src,
      type: media.type,
      alt: `Mídia ${index + 1}`,
    }));
  };

  const mosaicImages = prepareMosaicImages(imagensGaleria, videosGaleria);

  return (
    <div className="eva-3-mosaic-gallery w-full relative bg-transparent overflow-hidden">
      <div className="mosaic-gallery-container w-full h-[260px] sm:h-[300px] md:h-[380px] lg:h-[420px] relative">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-2 w-full h-full">
          {mosaicImages.map((media, index) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded-lg sm:rounded-xl ${
                index === 0
                  ? "col-span-2 row-span-2"
                  : "col-span-1 row-span-1"
              }`}
            >
              <div className="media-picture-container w-full h-full relative">
                {media.type === "video" ? (
                  <div className="relative w-full h-full">
                    <video
                      src={media.src}
                      className="object-cover w-full h-full cursor-pointer hover:opacity-90 transition-opacity"
                      style={{ display: "block" }}
                      onClick={() => {
                        setFotoIndex(index);
                        setGaleriaAberta(true);
                      }}
                      onError={(e) => {
                        console.error("Erro ao carregar vídeo:", e.target.src);
                      }}
                      muted
                      playsInline
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="bg-black bg-opacity-50 rounded-full p-2">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                ) : (
                  <img
                    src={media.src}
                    alt={media.alt}
                    loading="lazy"
                    decoding="async"
                    className="object-cover w-full h-full cursor-pointer hover:opacity-90 transition-opacity"
                    style={{ display: "block", imageRendering: "auto" }}
                    onClick={() => {
                      setFotoIndex(index);
                      setGaleriaAberta(true);
                    }}
                    onError={(e) => {
                      e.target.src =
                        "https://cdn.pixabay.com/photo/2015/10/30/20/13/sunset-1014712_1280.jpg";
                    }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute top-2 right-2 md:top-4 md:right-4 z-10">
        <button
          className="bg-white text-blue-900 font-semibold rounded-lg px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base hover:bg-orange-500 hover:text-white transition border border-blue-100 cursor-pointer shadow-md"
          onClick={() => setGaleriaAberta(true)}
        >
          <span className="hidden sm:inline">Ver galeria</span>
          <span className="sm:hidden">Galeria</span>
          <span className="ml-1">
            ({(imagensGaleria?.length || 0) + (videosGaleria?.length || 0)})
          </span>
        </button>
      </div>

      <ImageGallery
        imagensGaleria={[...(imagensGaleria || []), ...(videosGaleria || [])]}
        galeriaAberta={galeriaAberta}
        setGaleriaAberta={setGaleriaAberta}
        fotoIndex={fotoIndex}
        setFotoIndex={setFotoIndex}
        mediaTypes={[
          ...(imagensGaleria || []).map(() => "image"),
          ...(videosGaleria || []).map(() => "video"),
        ]}
      />
    </div>
  );
};

export default HotelGallery;
