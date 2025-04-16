
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { FileUp, Upload, X, Check, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Manifest, Order } from '@/types/manifest';
import { sampleManifest } from '@/data/sampleManifest';

interface ManifestImportProps {
  onImport: (manifest: Manifest) => void;
  onCancel: () => void;
}

export function ManifestImport({ onImport, onCancel }: ManifestImportProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<Manifest | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    // In a real app, this would actually parse the CSV
    // For this demo, we'll simulate a successful upload with the sample data
    setTimeout(() => {
      try {
        // In a real app, this would parse the CSV data and validate it
        setPreview(sampleManifest);
        setIsUploading(false);
      } catch (err) {
        setError("Failed to parse manifest file. Please check format and try again.");
        setIsUploading(false);
      }
    }, 1000);
  };

  const handleImport = () => {
    if (!preview) return;
    onImport(preview);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Import Manifest</h2>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {!preview ? (
        <div className="flex flex-col gap-4 items-center justify-center p-8 border-2 border-dashed rounded-lg">
          <FileUp className="h-12 w-12 text-gray-400" />
          <div className="text-center">
            <h3 className="text-lg font-medium">Upload Manifest CSV</h3>
            <p className="text-sm text-gray-500 mt-1">
              Upload a CSV file containing manifest data
            </p>
          </div>
          
          <Input
            type="file"
            accept=".csv"
            className="hidden"
            id="manifest-file"
            onChange={handleFileUpload}
          />
          
          <Button 
            onClick={() => document.getElementById('manifest-file')?.click()} 
            variant="outline"
            disabled={isUploading}
          >
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? "Processing..." : "Select CSV File"}
          </Button>
          
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="w-full mt-4">
            <p className="text-sm font-medium mb-2">For demo purposes, you can also:</p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setPreview(sampleManifest)}
            >
              Use Sample Manifest Data
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <Alert className="bg-green-50 border-green-200">
            <Check className="h-4 w-4 text-green-500" />
            <AlertTitle>File Parsed Successfully</AlertTitle>
            <AlertDescription>
              Manifest #{preview.manifestNumber} with {preview.orders.length} orders is ready to import
            </AlertDescription>
          </Alert>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-sm font-medium mb-2">Manifest Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Manifest Number</p>
                <p className="text-sm font-medium">{preview.manifestNumber}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Flight Number</p>
                <p className="text-sm font-medium">{preview.flightNumber}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Flight Departure Date</p>
                <p className="text-sm font-medium">{preview.flightDepartureDate}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">MAWB No.</p>
                <p className="text-sm font-medium">{preview.mawbNo}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Bags</p>
                <p className="text-sm font-medium">{preview.totalBags}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Weight</p>
                <p className="text-sm font-medium">{preview.totalWeight} kg</p>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto max-h-[300px]">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    S.No
                  </th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Consignment No.
                  </th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pieces
                  </th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Weight
                  </th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Consignee
                  </th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {preview.orders.map((order) => (
                  <tr key={order.consignmentNo}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {order.sNo}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.consignmentNo}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {order.pieces}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {order.weight}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      <div className="text-sm">
                        <div className="font-medium">{order.consignee.name}</div>
                        <div className="text-gray-500">{order.consignee.postcode}</div>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-500 max-w-[200px] truncate">
                      {order.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleImport}>
              Import Manifest
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
