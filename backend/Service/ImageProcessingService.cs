using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Formats.Jpeg;

namespace agencia.Service
{
    public class ImageProcessingService
    {
        // Definições de tamanhos para o mosaico de galeria
        private static readonly Dictionary<int, (int width, int height)> GalleryMosaicSizes = new()
        {
            { 0, (850, 380) },   // Primeira imagem - Principal (maior)
            { 1, (422, 250) },   // Segunda imagem - Secundária superior direita
            { 2, (208, 125) }    // Terceira imagem - Secundária inferior direita
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
            
            // Redimensiona mantendo proporção e preenchendo o espaço
            image.Mutate(x => x.Resize(new ResizeOptions
            {
                Size = new Size(targetSize.width, targetSize.height),
                Mode = ResizeMode.Crop, // Corta para manter proporção exata
                Position = AnchorPositionMode.Center
            }));

            using var output = new MemoryStream();
            await image.SaveAsync(output, new JpegEncoder { Quality = 85 });
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
