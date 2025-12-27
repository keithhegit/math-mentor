
import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/imageUtils';
import { X, Check, RotateCcw } from 'lucide-react';

interface ImageCropperProps {
  image: string;
  onCropComplete: (croppedImage: string) => void;
  onCancel: () => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ image, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onCropCompleteInternal = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleDone = async () => {
    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      onCropComplete(croppedImage);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col">
      <div className="flex items-center justify-between p-4 text-white z-10 bg-black/50 backdrop-blur-md">
        <button onClick={onCancel} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-bold">裁剪题目区域</h2>
        <button 
          onClick={handleDone} 
          className="flex items-center space-x-1 bg-indigo-600 px-4 py-2 rounded-xl font-bold active:scale-95 transition-all"
        >
          <Check className="w-5 h-5" />
          <span>确定</span>
        </button>
      </div>

      <div className="flex-1 relative bg-slate-900">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={undefined} // Free form crop
          onCropChange={onCropChange}
          onCropComplete={onCropCompleteInternal}
          onZoomChange={onZoomChange}
        />
      </div>

      <div className="p-6 bg-black/50 backdrop-blur-md z-10 space-y-4">
        <div className="flex items-center space-x-4">
          <span className="text-white text-xs font-bold uppercase tracking-wider opacity-60">缩放</span>
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>
        <p className="text-white/60 text-center text-sm">
          拖动边缘调整范围，双指或滑动条缩放
        </p>
      </div>
    </div>
  );
};

export default ImageCropper;
