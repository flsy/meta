interface ReaderOptions {
  maxWidth?: number;
  maxHeight?: number;
}

export const loadImage = async (imageSrc: string) =>
  new Promise<HTMLImageElement>((resolve) => {
    const image = new Image();
    image.crossOrigin = 'Anonymous';
    image.src = imageSrc;
    image.onload = () => {
      resolve(image);
    };
  });

export const imageReader = async (file: File, options?: ReaderOptions): Promise<string | undefined> => {
  const fr = new FileReader();

  return new Promise((resolve, reject) => {
    fr.onerror = () => {
      fr.abort();
      reject(new DOMException('Error reading file.'));
    };

    fr.onload = async () => {
      const imageSrc = fr.result?.toString() ?? '';
      const canvas = document.createElement('canvas');
      const img = await loadImage(imageSrc);

      const maxw = options?.maxWidth ?? 400;
      const maxh = options?.maxHeight ?? 400;
      let { width } = img;
      let { height } = img;

      if (width > height) {
        if (width > maxw) {
          height *= maxw / width;
          width = maxw;
        }
      } else if (height > maxh) {
        width *= maxh / height;
        height = maxh;
      }

      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d')?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/png'));
    };

    fr.readAsDataURL(file);
  });
};

export const fileReader = async (file: File): Promise<string> => {
  const fr = new FileReader();

  return new Promise((resolve, reject) => {
    fr.onerror = () => {
      fr.abort();
      reject(new DOMException('Error reading file.'));
    };

    fr.onload = async (e) => {
      resolve(e?.target?.result as string);
    };

    fr.readAsDataURL(file);
  });
};
