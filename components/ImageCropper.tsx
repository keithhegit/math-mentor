
import React, { useState, useRef } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { getCroppedImg } from '../utils/imageUtils';
import { X, Check } from 'lucide-react';

interface ImageCropperProps {
  image: string;
  onCropComplete: (croppedImage: string) => void;
  onCancel: () => void;
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      undefined,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

const ImageCropper: React.FC<ImageCropperProps> = ({ image, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height));
  }

  const handleDone = async () => {
    if (completedCrop && imgRef.current) {
      try {
        const imageElement = imgRef.current;
        const scaleX = imageElement.naturalWidth / imageElement.width;
        const scaleY = imageElement.naturalHeight / imageElement.height;

        const pixelCrop = {
          x: completedCrop.x * scaleX,
          y: completedCrop.y * scaleY,
          width: completedCrop.width * scaleX,
          height: completedCrop.height * scaleY,
        };

        const croppedImage = await getCroppedImg(image, pixelCrop);
        onCropComplete(croppedImage);
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col backdrop-blur-sm">
      <div className="flex items-center justify-between p-4 text-white z-10 bg-slate-900/80 border-b border-white/10">
        <button onClick={onCancel} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-bold">框选题目区域</h2>
        <button 
          onClick={handleDone} 
          disabled={!completedCrop}
          className="flex items-center space-x-1 bg-indigo-600 disabled:bg-slate-700 px-4 py-2 rounded-xl font-bold active:scale-95 transition-all"
        >
          <Check className="w-5 h-5" />
          <span>确定</span>
        </button>
      </div>

      <div className="flex-1 relative overflow-auto flex items-center justify-center p-4">
        <ReactCrop
          crop={crop}
          onChange={(c) => setCrop(c)}
          onComplete={(c) => setCompletedCrop(c)}
          className="max-h-full"
        >
          <img
            ref={imgRef}
            alt="Crop me"
            src={image}
            onLoad={onImageLoad}
            style={{ maxHeight: 'calc(100vh - 160px)', objectFit: 'contain' }}
          />
        </ReactCrop>
      </div>

      <div className="p-6 bg-slate-900/80 border-t border-white/10 z-10">
        <p className="text-white/60 text-center text-sm">
          拖动矩形框边缘或角落，精确覆盖您想要分析的题目内容
        </p>
      </div>
    </div>
  );
};

export default ImageCropper;
