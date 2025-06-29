
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Link, X, Image } from 'lucide-react';

interface CoverImageSelectorProps {
  coverImage?: string;
  onImageChange: (url: string | undefined) => void;
}

const unsplashImages = [
  'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=300&h=150&fit=crop',
  'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=150&fit=crop',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=150&fit=crop',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=150&fit=crop',
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=300&h=150&fit=crop',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=150&fit=crop',
];

export function CoverImageSelector({ coverImage, onImageChange }: CoverImageSelectorProps) {
  const [imageUrl, setImageUrl] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onImageChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = () => {
    if (imageUrl.trim()) {
      onImageChange(imageUrl.trim());
      setImageUrl('');
    }
  };

  return (
    <div className="space-y-4">
      {coverImage && (
        <div className="relative">
          <img
            src={coverImage}
            alt="Capa do card"
            className="w-full h-32 object-cover rounded-lg"
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onImageChange(undefined)}
            className="absolute top-2 right-2"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      <Tabs defaultValue="gallery" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="gallery">Galeria</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="url">URL</TabsTrigger>
        </TabsList>
        
        <TabsContent value="gallery" className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {unsplashImages.map((url, index) => (
              <button
                key={index}
                onClick={() => onImageChange(url)}
                className="relative overflow-hidden rounded-lg hover:opacity-80 transition-opacity"
              >
                <img
                  src={url}
                  alt={`Opção ${index + 1}`}
                  className="w-full h-20 object-cover"
                />
              </button>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="upload" className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="cover-upload">Fazer upload de imagem</Label>
            <div className="flex items-center gap-2">
              <Input
                id="cover-upload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="cursor-pointer"
              />
              <Upload className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="url" className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="image-url">URL da imagem</Label>
            <div className="flex gap-2">
              <Input
                id="image-url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://exemplo.com/imagem.jpg"
              />
              <Button onClick={handleUrlSubmit} size="sm">
                <Link className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
