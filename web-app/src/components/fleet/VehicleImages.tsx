
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Camera, 
  Plus, 
  Trash2, 
  Upload, 
  ImageIcon,
  X,
  RotateCcw
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface VehicleImage {
  id: string;
  url: string;
  type: 'front' | 'rear' | 'side' | 'interior' | 'damage' | 'other';
  caption?: string;
  uploadDate: Date;
}

interface VehicleImagesProps {
  vehicleId: string;
  initialImages?: VehicleImage[];
}

const IMAGE_TYPES = [
  { value: 'front', label: 'Front View' },
  { value: 'rear', label: 'Rear View' },
  { value: 'side', label: 'Side View' },
  { value: 'interior', label: 'Interior' },
  { value: 'damage', label: 'Damage Report' },
  { value: 'other', label: 'Other' }
];

export function VehicleImages({ vehicleId, initialImages = [] }: VehicleImagesProps) {
  const { toast } = useToast();
  const [images, setImages] = useState<VehicleImage[]>(initialImages);
  const [selectedImage, setSelectedImage] = useState<VehicleImage | null>(null);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedImageType, setSelectedImageType] = useState<string>('front');

  const handleAddImage = (type: string) => {
    // In a real app, this would upload an actual image
    // For demo purposes, we'll add a placeholder image
    const newImage: VehicleImage = {
      id: `img-${Date.now()}`,
      url: '/placeholder.svg',
      type: type as VehicleImage['type'],
      uploadDate: new Date()
    };
    
    setImages([...images, newImage]);
    setUploadDialogOpen(false);
    
    toast({
      title: "Image added",
      description: `${IMAGE_TYPES.find(t => t.value === type)?.label} image has been added to the vehicle.`
    });
  };

  const handleRemoveImage = (imageId: string) => {
    setImages(images.filter(img => img.id !== imageId));
    
    if (selectedImage?.id === imageId) {
      setSelectedImage(null);
      setShowImageDialog(false);
    }
    
    toast({
      title: "Image removed",
      description: "The image has been removed from the vehicle."
    });
  };

  const handleViewImage = (image: VehicleImage) => {
    setSelectedImage(image);
    setShowImageDialog(true);
  };

  const getImageTypeLabel = (type: string) => {
    return IMAGE_TYPES.find(t => t.value === type)?.label || 'Unknown';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle Images</CardTitle>
        <CardDescription>
          Upload and manage images for vehicle ID: {vehicleId}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex justify-end mb-4">
          <Button onClick={() => setUploadDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Image
          </Button>
        </div>
        
        {images.length === 0 ? (
          <div className="text-center py-12 border border-dashed rounded-md">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500 mb-2">No images uploaded yet</p>
            <Button variant="outline" onClick={() => setUploadDialogOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Upload First Image
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map(image => (
              <div 
                key={image.id} 
                className="relative group border rounded-md overflow-hidden"
              >
                <div 
                  className="aspect-square cursor-pointer"
                  onClick={() => handleViewImage(image)}
                >
                  <img 
                    src={image.url} 
                    alt={getImageTypeLabel(image.type)} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="text-white hover:bg-black/20"
                    onClick={() => handleViewImage(image)}
                  >
                    <ImageIcon className="h-5 w-5" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="text-white hover:bg-danger-500/50"
                    onClick={() => handleRemoveImage(image.id)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs py-1 px-2">
                  {getImageTypeLabel(image.type)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Image Viewer Dialog */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedImage && getImageTypeLabel(selectedImage.type)}</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <>
              <div className="flex justify-center">
                <img 
                  src={selectedImage.url} 
                  alt={getImageTypeLabel(selectedImage.type)} 
                  className="max-w-full max-h-[500px] object-contain rounded-md"
                />
              </div>
              <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                <span>Uploaded: {selectedImage.uploadDate.toLocaleDateString()}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-danger-600 hover:text-danger-700 hover:bg-danger-50"
                  onClick={() => handleRemoveImage(selectedImage.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove Image
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Vehicle Image</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">Image Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {IMAGE_TYPES.map(type => (
                    <Button
                      key={type.value}
                      variant="outline"
                      className={cn(
                        "h-auto py-2 justify-start",
                        selectedImageType === type.value && "border-primary text-primary bg-primary/5"
                      )}
                      onClick={() => setSelectedImageType(type.value)}
                    >
                      {type.label}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="border-t pt-4">
                <label className="text-sm font-medium block mb-2">Upload Method</label>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col justify-center"
                    onClick={() => handleAddImage(selectedImageType)}
                  >
                    <Camera className="h-8 w-8 mb-2 text-accent-500" />
                    <span className="text-xs">Take Photo</span>
                  </Button>
                  <Button 
                    variant="outline"
                    className="h-20 flex flex-col justify-center"
                    onClick={() => handleAddImage(selectedImageType)}
                  >
                    <Upload className="h-8 w-8 mb-2 text-primary-500" />
                    <span className="text-xs">Upload Image</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
