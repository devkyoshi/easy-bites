
export interface Manifest {
  manifestNumber: string;
  flightNumber: string;
  flightDepartureDate: string;
  mawbNo: string;
  hawbNo: string;
  mawbOrigin: string;
  mawbDestination: string;
  totalBags: number;
  totalWeight: number;
  valueType: string;
  from: {
    name: string;
    address: string[];
    country: string;
    contact: string;
    email: string;
  };
  to: {
    name: string;
    address: string[];
    country: string;
    contact: string;
  };
  orders: Order[];
}

export interface Order {
  id: string;
  sNo: number;
  consignmentNo: string;
  pieces: number;
  weight: number;
  consignor: {
    name: string;
    address: string[];
    country: string;
  };
  consignee: {
    name: string;
    address: string[];
    city: string;
    postcode: string;
    country: string;
    contact?: string;
  };
  description: string;
  value: number;
  currency: string;
  bagNo: string;
  serviceInfo: string;
  selected?: boolean;
  assignedDriver?: string;
  status?: string;
}

export interface Driver {
  id: string;
  name: string;
  available: boolean;
  maxCapacity: number;
  currentLoad: number;
  territory: string;
  vehicle: string;
  selected?: boolean;
}

export interface RouteAssignment {
  driverId: string;
  driverName: string;
  orders: Order[];
  totalPieces: number;
  totalWeight: number;
  estimatedDistance: number;
  estimatedTime: string;
}
