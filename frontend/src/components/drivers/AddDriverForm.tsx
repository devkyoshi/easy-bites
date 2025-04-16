
import { useState, useRef } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, X, Camera, FileText, FileVideo, Mic } from "lucide-react";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useLoading } from '@/contexts/LoadingContext';

const driverFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
  license: z.string().min(5, { message: "License number is required." }),
  licenseExpiry: z.string().min(1, { message: "License expiry date is required." }),
  cpcExpiry: z.string().min(1, { message: "CPC expiry date is required." }),
  territory: z.string().min(1, { message: "Territory is required." }),
  specialization: z.string().min(1, { message: "Specialization is required." }),
  status: z.string().min(1, { message: "Status is required." }),
  dateOfBirth: z.string().optional(), // Add optional Date of Birth field
  notes: z.string().optional(),
});

type DriverFormValues = z.infer<typeof driverFormSchema>;

const territories = [
  "London", "Manchester", "Birmingham", "Leeds", "Glasgow", 
  "Liverpool", "Newcastle", "Sheffield", "Bristol", "Edinburgh"
];

const specializations = [
  "Standard Delivery", "Heavy Goods", "Refrigerated", 
  "Hazardous Materials", "International", "Express Delivery"
];

const statuses = ["Active", "On Leave", "Suspended"];

interface AddDriverFormProps {
  onClose: () => void;
  onDriverAdded?: (driver: any) => void;
}

type AttachmentType = "document" | "image" | "video" | "audio";

interface Attachment {
  id: string;
  type: AttachmentType;
  name: string;
  file: File;
  previewUrl: string;
  size: number;
}

export function AddDriverForm({ onClose, onDriverAdded }: AddDriverFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { startLoading, stopLoading } = useLoading();
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<DriverFormValues>({
    resolver: zodResolver(driverFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      license: "",
      licenseExpiry: "",
      cpcExpiry: "",
      territory: "",
      specialization: "",
      status: "Active",
      dateOfBirth: "", // Add default value for Date of Birth
      notes: "",
    },
  });

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const type: AttachmentType = file.type.startsWith('image/') 
          ? 'image' 
          : file.type.startsWith('video/') 
            ? 'video' 
            : file.type.startsWith('audio/') 
              ? 'audio' 
              : 'document';
        
        const reader = new FileReader();
        reader.onloadend = () => {
          const newAttachment: Attachment = {
            id: `attachment-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            type,
            name: file.name,
            file,
            previewUrl: reader.result as string,
            size: file.size
          };
          
          setAttachments(prev => [...prev, newAttachment]);
        };
        reader.readAsDataURL(file);
      });
    }
    // Reset the input to allow uploading the same file again
    if (attachmentInputRef.current) {
      attachmentInputRef.current.value = '';
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(attachment => attachment.id !== id));
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const getAttachmentIcon = (type: AttachmentType) => {
    switch (type) {
      case 'image':
        return <Camera className="h-5 w-5 text-accent-500" />;
      case 'document':
        return <FileText className="h-5 w-5 text-primary-500" />;
      case 'video':
        return <FileVideo className="h-5 w-5 text-warning-500" />;
      case 'audio':
        return <Mic className="h-5 w-5 text-info-500" />;
    }
  };

  const onSubmit = async (data: DriverFormValues) => {
    setIsSubmitting(true);
    startLoading();
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newDriver = {
        id: `D${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
        name: data.name,
        email: data.email,
        phone: data.phone,
        license: data.license,
        licenseExpiry: data.licenseExpiry,
        cpcExpiry: data.cpcExpiry,
        territory: data.territory,
        specialization: data.specialization,
        status: data.status,
        dateOfBirth: data.dateOfBirth, // Include Date of Birth in the submitted data
        notes: data.notes,
        profileImage: profileImagePreview,
        attachments: attachments.length > 0 ? attachments.map(att => ({
          id: att.id,
          name: att.name,
          type: att.type,
          url: att.previewUrl,
          size: att.size
        })) : [],
        vehicle: "Unassigned",
      };
      
      if (onDriverAdded) {
        onDriverAdded(newDriver);
      }
      
      toast({
        title: "Driver added successfully",
        description: `${data.name} has been added to your driver list.`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error adding driver",
        description: "There was a problem adding the driver. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      stopLoading();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col items-center mb-6">
          <div 
            className="relative cursor-pointer mb-2" 
            onClick={() => fileInputRef.current?.click()}
          >
            <Avatar className="h-24 w-24 border-2 border-primary">
              {profileImagePreview ? (
                <AvatarImage src={profileImagePreview} alt="Profile" />
              ) : (
                <AvatarFallback className="bg-accent-500 text-xl">
                  <Upload className="h-8 w-8" />
                </AvatarFallback>
              )}
            </Avatar>
            <div className="absolute bottom-0 right-0 bg-primary rounded-full p-1">
              <Camera className="h-4 w-4 text-white" />
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleProfileImageChange}
            accept="image/*"
            className="hidden"
          />
          <span className="text-sm text-muted-foreground">
            Click to upload profile picture
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Driver Name *</FormLabel>
                <FormControl>
                  <Input placeholder="John Smith" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status *</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Add Date of Birth field */}
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth (Optional)</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address *</FormLabel>
                <FormControl>
                  <Input placeholder="driver@example.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number *</FormLabel>
                <FormControl>
                  <Input placeholder="+44 7123 456789" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="license"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Driver License Number *</FormLabel>
                <FormControl>
                  <Input placeholder="SMITH123456AB9CD" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="licenseExpiry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>License Expiry Date *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="cpcExpiry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPC Expiry Date *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="territory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Territory *</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a territory" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {territories.map((territory) => (
                      <SelectItem key={territory} value={territory}>
                        {territory}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="specialization"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specialization *</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a specialization" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {specializations.map((spec) => (
                      <SelectItem key={spec} value={spec}>
                        {spec}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-medium mb-2">Documents & Attachments</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => attachmentInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Files
              </Button>
              <input
                type="file"
                multiple
                ref={attachmentInputRef}
                onChange={handleAttachmentChange}
                className="hidden"
              />
            </div>
            
            <div className="border rounded-md p-4">
              {attachments.length === 0 ? (
                <div className="text-center py-6">
                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-muted-foreground">No attachments yet</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload driver documents, certifications, or other relevant files
                  </p>
                </div>
              ) : (
                <div className="grid gap-2">
                  {attachments.map((attachment) => (
                    <div 
                      key={attachment.id} 
                      className="flex items-center justify-between p-2 bg-muted/50 rounded"
                    >
                      <div className="flex items-center space-x-2">
                        {getAttachmentIcon(attachment.type)}
                        <div className="text-sm truncate max-w-[300px]">
                          <p className="font-medium truncate">{attachment.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatBytes(attachment.size)}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => removeAttachment(attachment.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Notes</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Any additional information about the driver..." 
                    className="min-h-[100px]" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding Driver..." : "Add Driver"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
