
import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { FileUp, Save, X, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { PaymentDetails } from './PaymentDetails';

// Type definition for the CSV row data
interface CsvRowData {
  [key: string]: string;
  'S. No': string;
  'Consignment No. *': string;
  'Pieces *': string;
  'Weight (kg) *': string;
  'Consignor *': string;
  'Consignee': string;
  'Description *': string;
  'Value *': string;
  'Currency *': string;
  'Bag No*': string;
  'Service Info': string;
}

// Type definition for the parsed and validated data
interface ParsedRow {
  id: number;
  consignmentNo: string;
  pieces: number;
  weight: number;
  consignor: string;
  consignee: string;
  description: string;
  value: number;
  currency: string;
  bagNo: string;
  serviceInfo: string;
  valid: boolean;
  errors: string[];
}

export function CsvImport() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [csvData, setCsvData] = useState<ParsedRow[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [importMethod, setImportMethod] = useState<string>("replace");

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const rows = parseCSV(text);
        processCSVData(rows);
      } catch (error) {
        toast({
          title: "Error processing CSV",
          description: error instanceof Error ? error.message : "Unknown error occurred",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    };

    reader.onerror = () => {
      toast({
        title: "Error reading file",
        description: "There was an error reading the uploaded file.",
        variant: "destructive",
      });
      setIsUploading(false);
    };

    reader.readAsText(file);
  };

  const parseCSV = (text: string): string[][] => {
    // Basic CSV parsing
    const lines = text.split('\n');
    return lines.map(line => line.split(','));
  };

  const processCSVData = (rows: string[][]) => {
    if (rows.length < 2) {
      throw new Error("CSV file must contain a header row and at least one data row");
    }

    const headers = rows[0];
    const expectedHeaders = [
      'S. No', 'Consignment No. *', 'Pieces *', 'Weight (kg) *', 
      'Consignor *', 'Consignee', 'Description *', 'Value *', 
      'Currency *', 'Bag No*', 'Service Info'
    ];

    // Validate headers
    const missingHeaders = expectedHeaders.filter(
      header => !headers.some(h => h.trim() === header)
    );

    if (missingHeaders.length > 0) {
      throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`);
    }

    // Process data rows
    const parsedData: ParsedRow[] = [];
    let errorCount = 0;

    for (let i = 1; i < rows.length; i++) {
      if (rows[i].length === 1 && rows[i][0].trim() === '') continue; // Skip empty rows
      
      const rowData: { [key: string]: string } = {};
      for (let j = 0; j < headers.length; j++) {
        rowData[headers[j]] = rows[i][j]?.trim() || '';
      }

      const errors: string[] = [];

      // Validate required fields
      if (!rowData['Consignment No. *']) errors.push('Consignment number is required');
      if (!rowData['Pieces *']) errors.push('Pieces is required');
      if (!rowData['Weight (kg) *']) errors.push('Weight is required');
      if (!rowData['Consignor *']) errors.push('Consignor is required');
      if (!rowData['Description *']) errors.push('Description is required');
      if (!rowData['Value *']) errors.push('Value is required');
      if (!rowData['Currency *']) errors.push('Currency is required');
      if (!rowData['Bag No*']) errors.push('Bag number is required');

      // Validate numeric fields
      if (isNaN(Number(rowData['Pieces *']))) errors.push('Pieces must be a number');
      if (isNaN(Number(rowData['Weight (kg) *']))) errors.push('Weight must be a number');
      if (isNaN(Number(rowData['Value *']))) errors.push('Value must be a number');

      if (errors.length > 0) errorCount++;

      parsedData.push({
        id: i,
        consignmentNo: rowData['Consignment No. *'],
        pieces: Number(rowData['Pieces *']) || 0,
        weight: Number(rowData['Weight (kg) *']) || 0,
        consignor: rowData['Consignor *'],
        consignee: rowData['Consignee'],
        description: rowData['Description *'],
        value: Number(rowData['Value *']) || 0,
        currency: rowData['Currency *'],
        bagNo: rowData['Bag No*'],
        serviceInfo: rowData['Service Info'],
        valid: errors.length === 0,
        errors
      });
    }

    setCsvData(parsedData.filter(row => row.consignmentNo !== '')); // Filter out completely empty rows
    setErrorCount(errorCount);
    setShowPreview(true);
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImport = () => {
    setIsSubmitting(true);
    
    // Simulate importing data
    setTimeout(() => {
      const validRows = csvData.filter(row => row.valid);
      toast({
        title: "Orders imported",
        description: `Successfully imported ${validRows.length} orders.`,
      });
      setIsSubmitting(false);
      setShowPreview(false);
      setCsvData([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 items-center justify-center p-8 border-2 border-dashed rounded-lg">
        <FileText className="h-12 w-12 text-gray-400" />
        <div className="text-center">
          <h3 className="text-lg font-medium">Upload CSV File</h3>
          <p className="text-sm text-gray-500 mt-1">
            Upload a CSV file containing order data following the required format
          </p>
        </div>
        
        <Input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={onFileChange}
        />
        
        <Button 
          onClick={handleUploadClick} 
          variant="outline"
          disabled={isUploading}
        >
          <FileUp className="mr-2 h-4 w-4" />
          {isUploading ? "Processing..." : "Select CSV File"}
        </Button>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">CSV Format Requirements</h3>
        <p className="text-sm text-gray-500">
          Your CSV file should include the following columns:
        </p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>S. No</TableHead>
              <TableHead>Consignment No. *</TableHead>
              <TableHead>Pieces *</TableHead>
              <TableHead>Weight (kg) *</TableHead>
              <TableHead>Consignor *</TableHead>
              <TableHead>Consignee</TableHead>
              <TableHead>Description *</TableHead>
              <TableHead>Value *</TableHead>
              <TableHead>Currency *</TableHead>
              <TableHead>Bag No *</TableHead>
              <TableHead>Service Info</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>1</TableCell>
              <TableCell>005901729141</TableCell>
              <TableCell>1</TableCell>
              <TableCell>19</TableCell>
              <TableCell>UPR COURIER SERVICE</TableCell>
              <TableCell>A SVASABTHAKUMARAN</TableCell>
              <TableCell>FLOUR, COCONUT POWDER, BISCUITS, CHIPS</TableCell>
              <TableCell>9.5</TableCell>
              <TableCell>GBP</TableCell>
              <TableCell>30</TableCell>
              <TableCell>EXP</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <p className="text-xs text-gray-500">
          * Required fields
        </p>
      </div>

      {/* CSV Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>CSV Import Preview</DialogTitle>
          </DialogHeader>
          
          {errorCount > 0 && (
            <Alert variant="destructive" className="my-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Import Errors</AlertTitle>
              <AlertDescription>
                {errorCount} rows contain errors that need to be fixed before importing.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="max-h-[60vh] overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-background">
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Consignment No.</TableHead>
                  <TableHead>Pieces</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead>Consignor</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Errors</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {csvData.map((row) => (
                  <TableRow key={row.id} className={row.valid ? "" : "bg-red-50"}>
                    <TableCell>
                      {row.valid ? 
                        <CheckCircle className="h-5 w-5 text-green-500" /> : 
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      }
                    </TableCell>
                    <TableCell>{row.consignmentNo}</TableCell>
                    <TableCell>{row.pieces}</TableCell>
                    <TableCell>{row.weight}</TableCell>
                    <TableCell>{row.consignor}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{row.description}</TableCell>
                    <TableCell>{row.value} {row.currency}</TableCell>
                    <TableCell className="text-xs text-red-500">
                      {row.errors.join(', ')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Import Method</h4>
            <ToggleGroup 
              type="single" 
              value={importMethod}
              onValueChange={(value) => value && setImportMethod(value)}
            >
              <ToggleGroupItem value="replace">Replace All</ToggleGroupItem>
              <ToggleGroupItem value="append">Append to Existing</ToggleGroupItem>
            </ToggleGroup>
          </div>
          
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Package & Payment</h4>
            <PaymentDetails isCompact={true} />
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPreview(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              disabled={errorCount > 0 || isSubmitting}
            >
              {isSubmitting ? "Importing..." : `Import ${csvData.filter(row => row.valid).length} Orders`}
              <Save className="ml-2 h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
