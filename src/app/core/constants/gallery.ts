/** A photo of the home gallery. Rounded frame (and tilt) are part of the image. */
export interface GalleryPhoto {
  /** Path relative to `assets/images/`. */
  readonly src: string;
  readonly width: number;
  readonly height: number;
  /** i18n key of the alt text. */
  readonly altKey: string;
}

/** Display order of the home gallery (Figma order first). */
export const GALLERY_PHOTOS: readonly GalleryPhoto[] = [
  { src: 'gallery/gallery-01.webp', width: 696, height: 824, altKey: 'home.gallery.photos.p1' },
  { src: 'gallery/gallery-02.webp', width: 643, height: 781, altKey: 'home.gallery.photos.p2' },
  { src: 'gallery/gallery-03.webp', width: 696, height: 824, altKey: 'home.gallery.photos.p3' },
  { src: 'gallery/gallery-04.webp', width: 643, height: 781, altKey: 'home.gallery.photos.p4' },
  { src: 'gallery/gallery-05.webp', width: 696, height: 824, altKey: 'home.gallery.photos.p5' },
  { src: 'gallery/gallery-06.webp', width: 643, height: 781, altKey: 'home.gallery.photos.p6' },
  { src: 'gallery/gallery-07.webp', width: 696, height: 824, altKey: 'home.gallery.photos.p7' },
  { src: 'gallery/gallery-08.webp', width: 643, height: 781, altKey: 'home.gallery.photos.p8' },
];
