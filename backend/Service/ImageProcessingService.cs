using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Processing.Processors.Transforms;
using SixLabors.ImageSharp.Formats.Jpeg;

namespace agencia.Service
{
    public class ImageProcessingService
    {
        // Definições de tamanhos para o mosaico de galeria - Aumentadas para melhor qualidade
        private static readonly Dictionary<int, (int width, int height)> GalleryMosaicSizes = new()
        {
            { 0, (1200, 600) },   // Primeira imagem - Principal (maior) - Aumentada de 850x380
            { 1, (600, 400) },    // Segunda imagem - Secundária superior direita - Aumentada de 422x250
            { 2, (300, 200) }     // Terceira imagem - Secundária inferior direita - Aumentada de 208x125
        };

        public static async Task<byte[]> ResizeImageForGallery(IFormFile imageFile, int imageIndex)
        {
            // Se for além da terceira imagem, mantém tamanho padrão
            if (!GalleryMosaicSizes.ContainsKey(imageIndex))
            {
                using var stream = new MemoryStream();
                await imageFile.CopyToAsync(stream);
                return stream.ToArray();
            }

            var targetSize = GalleryMosaicSizes[imageIndex];

            using var image = await Image.LoadAsync(imageFile.OpenReadStream());
            
            // Redimensiona mantendo melhor qualidade
            image.Mutate(x => x.Resize(new ResizeOptions
            {
                Size = new Size(targetSize.width, targetSize.height),
                Mode = ResizeMode.Max, // Mantém proporção sem cortar - melhor qualidade
                Position = AnchorPositionMode.Center,
                Sampler = KnownResamplers.Lanczos3 // Algoritmo de alta qualidade
            }));

            using var output = new MemoryStream();
            await image.SaveAsync(output, new JpegEncoder { Quality = 98 }); // Qualidade máxima
            return output.ToArray();
        }

        public static async Task SaveProcessedImageAsync(byte[] imageData, string filePath)
        {
            await File.WriteAllBytesAsync(filePath, imageData);
        }

        // Método para obter informações dos tamanhos do mosaico (útil para frontend)
        public static Dictionary<int, (int width, int height)> GetMosaicSizes()
        {
            return new Dictionary<int, (int width, int height)>(GalleryMosaicSizes);
        }
    }
}
