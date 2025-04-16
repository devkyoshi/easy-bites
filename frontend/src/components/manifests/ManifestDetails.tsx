
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Manifest } from "@/types/manifest";

interface ManifestDetailsProps {
  manifest: Manifest;
}

export function ManifestDetails({ manifest }: ManifestDetailsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex justify-between items-center">
            <span>Courier Manifest</span>
            <span className="text-sm text-gray-500">Manifest Number: {manifest.manifestNumber}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* From details */}
            <div className="space-y-3">
              <h3 className="font-semibold">From</h3>
              <div className="text-sm space-y-1">
                <p className="font-medium">{manifest.from.name}</p>
                {manifest.from.address.map((line, i) => (
                  <p key={i} className="text-gray-500">{line}</p>
                ))}
                <p className="text-gray-500">{manifest.from.country}</p>
                <p className="text-gray-500">{manifest.from.contact}</p>
                <p className="text-gray-500">{manifest.from.email}</p>
              </div>
            </div>
            
            {/* To details */}
            <div className="space-y-3">
              <h3 className="font-semibold">To</h3>
              <div className="text-sm space-y-1">
                <p className="font-medium">{manifest.to.name}</p>
                {manifest.to.address.map((line, i) => (
                  <p key={i} className="text-gray-500">{line}</p>
                ))}
                <p className="text-gray-500">{manifest.to.country}</p>
                <p className="text-gray-500">{manifest.to.contact}</p>
              </div>
            </div>
            
            {/* Shipping details */}
            <div className="space-y-3">
              <h3 className="font-semibold">Shipping Details</h3>
              <div className="text-sm space-y-1 grid grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <p className="text-gray-500">Flight Number</p>
                  <p>{manifest.flightNumber}</p>
                </div>
                <div>
                  <p className="text-gray-500">Flight Date</p>
                  <p>{manifest.flightDepartureDate}</p>
                </div>
                <div>
                  <p className="text-gray-500">MAWB No.</p>
                  <p>{manifest.mawbNo}</p>
                </div>
                <div>
                  <p className="text-gray-500">HAWB No.</p>
                  <p>{manifest.hawbNo || "—"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Origin</p>
                  <p>{manifest.mawbOrigin}</p>
                </div>
                <div>
                  <p className="text-gray-500">Destination</p>
                  <p>{manifest.mawbDestination}</p>
                </div>
                <div>
                  <p className="text-gray-500">Total Bags</p>
                  <p>{manifest.totalBags}</p>
                </div>
                <div>
                  <p className="text-gray-500">Total Weight</p>
                  <p>{manifest.totalWeight} kg</p>
                </div>
                <div>
                  <p className="text-gray-500">Value Type</p>
                  <p>{manifest.valueType}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-md">
                <p className="text-sm text-blue-600 font-medium">Total Orders</p>
                <p className="text-2xl font-bold mt-1">{manifest.orders.length}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-md">
                <p className="text-sm text-green-600 font-medium">Total Pieces</p>
                <p className="text-2xl font-bold mt-1">
                  {manifest.orders.reduce((sum, order) => sum + order.pieces, 0)}
                </p>
              </div>
              <div className="bg-amber-50 p-4 rounded-md">
                <p className="text-sm text-amber-600 font-medium">Total Weight (kg)</p>
                <p className="text-2xl font-bold mt-1">
                  {manifest.orders.reduce((sum, order) => sum + order.weight, 0).toFixed(1)}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-md">
                <p className="text-sm text-purple-600 font-medium">Assigned Orders</p>
                <p className="text-2xl font-bold mt-1">
                  {manifest.orders.filter(order => order.status === "Assigned").length}
                </p>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <h3 className="font-semibold">Destination Distribution</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Calculate postcode distribution */}
              {(() => {
                const postcodeGroups: Record<string, number> = {};
                manifest.orders.forEach(order => {
                  const postArea = order.consignee.postcode.split(' ')[0];
                  postcodeGroups[postArea] = (postcodeGroups[postArea] || 0) + 1;
                });
                
                return Object.entries(postcodeGroups)
                  .sort((a, b) => b[1] - a[1])
                  .map(([postArea, count]) => (
                    <div key={postArea} className="flex justify-between items-center p-2 rounded bg-gray-50">
                      <span className="font-medium">{postArea}</span>
                      <span className="text-gray-500">{count} orders</span>
                    </div>
                  ));
              })()}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
