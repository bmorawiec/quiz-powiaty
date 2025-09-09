export function preloadImage(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve();
        image.onerror = () => reject();
        image.src = url;
    });
}
