
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Camera,
  File,
  FileImage,
  FileText,
  FileVideo,
  Mic,
  Pencil,
  Plus,
  Trash,
  Upload,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

interface RichMediaRemarksProps {
  form: UseFormReturn<any>;
  remarksFieldName: string;
  attachmentsFieldName: string;
}

type AttachmentType = "photo" | "document" | "video" | "voice" | "drawing";

interface Attachment {
  id: string;
  type: AttachmentType;
  name: string;
  url: string;
  thumbnailUrl?: string;
  size: number;
  createdAt: Date;
}

export function RichMediaRemarks({
  form,
  remarksFieldName,
  attachmentsFieldName
}: RichMediaRemarksProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("text");

  // Get attachments from form
  const attachments = form.watch(attachmentsFieldName) || [];
  
  const handleFileUpload = (type: AttachmentType) => {
    // In a real implementation, this would handle actual file uploads
    // For this demo, we'll simulate adding attachments
    
    const mockAttachments: Attachment[] = [
      {
        id: Date.now().toString(),
        type,
        name: `${type}-${Date.now()}.${type === 'photo' ? 'jpg' : type === 'document' ? 'pdf' : type === 'video' ? 'mp4' : type === 'voice' ? 'mp3' : 'png'}`,
        url: `/placeholder.svg`,
        thumbnailUrl: type === 'photo' ? `/placeholder.svg` : undefined,
        size: Math.floor(Math.random() * 1000000),
        createdAt: new Date()
      }
    ];

    const currentAttachments = form.getValues(attachmentsFieldName) || [];
    form.setValue(attachmentsFieldName, [...currentAttachments, ...mockAttachments]);
    
    toast({
      title: "File uploaded",
      description: `Your ${type} has been uploaded successfully.`
    });
  };

  const handleRemoveAttachment = (id: string) => {
    const currentAttachments = form.getValues(attachmentsFieldName) || [];
    form.setValue(
      attachmentsFieldName,
      currentAttachments.filter((attachment: Attachment) => attachment.id !== id)
    );
    
    toast({
      title: "File removed",
      description: "The attachment has been removed."
    });
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
      case "photo":
        return <FileImage className="h-8 w-8 text-accent-500" />;
      case "document":
        return <FileText className="h-8 w-8 text-primary-500" />;
      case "video":
        return <FileVideo className="h-8 w-8 text-warning-500" />;
      case "voice":
        return <Mic className="h-8 w-8 text-info-500" />;
      case "drawing":
        return <Pencil className="h-8 w-8 text-success-500" />;
      default:
        return <File className="h-8 w-8 text-gray-400" />;
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Order Remarks and Attachments</h3>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="text">Text Remarks</TabsTrigger>
          <TabsTrigger value="attachments">Attachments ({attachments.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="text">
          <FormField
            control={form.control}
            name={remarksFieldName}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Special Instructions & Remarks</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter any special handling instructions, delivery notes, or other important information for this order..."
                    className="min-h-32"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </TabsContent>
        
        <TabsContent value="attachments">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Attachment
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Attachment Type</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          variant="outline" 
                          className="h-20 flex flex-col justify-center"
                          onClick={() => handleFileUpload("photo")}
                        >
                          <Camera className="h-8 w-8 mb-1 text-accent-500" />
                          <span className="text-xs">Photo</span>
                        </Button>
                        <Button 
                          variant="outline"
                          className="h-20 flex flex-col justify-center"
                          onClick={() => handleFileUpload("document")}
                        >
                          <FileText className="h-8 w-8 mb-1 text-primary-500" />
                          <span className="text-xs">Document</span>
                        </Button>
                        <Button 
                          variant="outline"
                          className="h-20 flex flex-col justify-center"
                          onClick={() => handleFileUpload("video")}
                        >
                          <FileVideo className="h-8 w-8 mb-1 text-warning-500" />
                          <span className="text-xs">Video</span>
                        </Button>
                        <Button 
                          variant="outline"
                          className="h-20 flex flex-col justify-center"
                          onClick={() => handleFileUpload("voice")}
                        >
                          <Mic className="h-8 w-8 mb-1 text-info-500" />
                          <span className="text-xs">Voice Note</span>
                        </Button>
                      </div>
                      <Button 
                        variant="outline"
                        className="w-full h-12 mt-2"
                        onClick={() => handleFileUpload("drawing")}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Signature/Drawing</span>
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            {attachments.length === 0 ? (
              <div className="text-center py-10 border border-dashed rounded-md">
                <Upload className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500">No attachments yet</p>
                <p className="text-sm text-gray-400">Click 'Add Attachment' to upload files</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {attachments.map((attachment: Attachment) => (
                  <div key={attachment.id} className="border rounded-md p-4 flex items-center gap-4">
                    {getAttachmentIcon(attachment.type)}
                    <div className="flex-1 min-w-0">
                      <div className="truncate font-medium">{attachment.name}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-2">
                        <span>{formatBytes(attachment.size)}</span>
                        <span>•</span>
                        <span>{attachment.createdAt.toLocaleString()}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-danger-500"
                      onClick={() => handleRemoveAttachment(attachment.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
