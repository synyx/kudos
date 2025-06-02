import { toPng, toJpeg, toBlob } from 'html-to-image';

interface DomToImageOptions {
  filename?: string;
  format?: 'png' | 'jpeg' | 'blob';
  quality?: number;
  width?: number;
  height?: number;
  backgroundColor?: string;
  hideSelectors?: string[];
  pixelRatio?: number;
  cacheBust?: boolean;
}

export async function downloadElementAsImage(
  element: HTMLElement,
  options: DomToImageOptions = {}
): Promise<void> {
  const {
    filename = 'download.png',
    format = 'png',
    quality = 1.0,
    width,
    height,
    backgroundColor = 'white',
    hideSelectors = [],
    pixelRatio = 2,
    cacheBust = true
  } = options;

  // Store original styles for elements we need to hide
  const hiddenElements: { element: HTMLElement; originalDisplay: string }[] = [];
  
  // Hide specified elements in the original element
  for (const selector of hideSelectors) {
    const elementsToHide = element.querySelectorAll(selector) as NodeListOf<HTMLElement>;
    for (const el of elementsToHide) {
      hiddenElements.push({
        element: el,
        originalDisplay: el.style.display
      });
      el.style.display = 'none';
    }
  }

  try {
    // Prepare html-to-image options
    const htmlToImageOptions = {
      quality,
      width,
      height,
      backgroundColor,
      pixelRatio,
      cacheBust,
      // Filter function to exclude hidden elements (extra safety)
      filter: (node: HTMLElement) => {
        return !hideSelectors.some(selector => 
          node.matches && node.matches(selector)
        );
      }
    };

    let dataUrl: string;
    let blob: Blob | null = null;

    // Generate image based on format
    switch (format) {
      case 'jpeg':
        dataUrl = await toJpeg(element, htmlToImageOptions);
        break;
      case 'blob':
        blob = await toBlob(element, htmlToImageOptions);
        if (blob) {
          dataUrl = URL.createObjectURL(blob);
        } else {
          throw new Error('Failed to generate blob');
        }
        break;
      case 'png':
      default:
        dataUrl = await toPng(element, htmlToImageOptions);
        break;
    }

    // Download the image
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();

    // Clean up blob URL if we created one
    if (blob && format === 'blob') {
      URL.revokeObjectURL(dataUrl);
    }

  } catch (error) {
    console.error('Failed to generate image:', error);
    throw error;
  } finally {
    // Restore original display styles for hidden elements
    for (const { element, originalDisplay } of hiddenElements) {
      element.style.display = originalDisplay;
    }
  }
}
