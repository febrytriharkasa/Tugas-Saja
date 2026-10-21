// Varian hero responsif. Cermin dari App\Support\ImageVariant: URL /storage/...
// yang berupa raster bisa diminta ulang dalam lebar lebih kecil lewat /img/{w}/.
// Harus sama dengan WIDTHS di sisi PHP supaya route-nya cocok.
const WIDTHS = [640, 800, 960, 1280];
const RASTER = /\.(webp|jpe?g|png)$/i;

export function imageSrcSet(url) {
    if (typeof url !== 'string' || !url.startsWith('/storage/') || !RASTER.test(url)) {
        return undefined;
    }

    const path = url.slice('/storage/'.length);

    return [...WIDTHS.map((width) => `/img/${width}/${path} ${width}w`), `${url} 1920w`].join(', ');
}
