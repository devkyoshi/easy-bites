
import { Manifest } from '@/types/manifest';

export const sampleManifest: Manifest = {
  manifestNumber: "400",
  flightNumber: "UL103/RA060",
  flightDepartureDate: "2023-02-22",
  mawbNo: "125 1518 5321",
  hawbNo: "0",
  mawbOrigin: "LK",
  mawbDestination: "LHR",
  totalBags: 48,
  totalWeight: 1167,
  valueType: "NV",
  from: {
    name: "SKY NET WWF PVT LTD",
    address: [
      "NO 419 KANDY ROAD",
      "PELIYAGODA",
      "COLOMBO"
    ],
    country: "SRI LANKA",
    contact: "94",
    email: "SKYNETWWF.COM"
  },
  to: {
    name: "UNITED BUSINESS EXPRESS LTD",
    address: [
      "AIRBUS 1435 6 POYLE TRADING ESTATE",
      "POYLE ROAD COLNDALE ROAD COLNBROOK",
      "SLOUGH",
      "LONDON"
    ],
    country: "UK",
    contact: "1753762860"
  },
  orders: [
    {
      id: "1",
      sNo: 1,
      consignmentNo: "005901729141",
      pieces: 1,
      weight: 19,
      consignor: {
        name: "UPR COURIER SERVICE",
        address: [
          "5A, GALPOTTA STREET",
          "COLOMBO"
        ],
        country: "LK - Sri Lanka"
      },
      consignee: {
        name: "A. SVASABTHAKUMARAN",
        address: [
          "111 CO ORMERSWELLS",
          "LANDSOUTHALL"
        ],
        city: "SOUTHALL",
        postcode: "UB1 2XL",
        country: "GB - United Kingdom",
        contact: "447949556909"
      },
      description: "FLOUR, COCONUT POWDER, BISCUITS, CHIPS",
      value: 9.5,
      currency: "GBP",
      bagNo: "30",
      serviceInfo: "EXP"
    },
    {
      id: "2",
      sNo: 2,
      consignmentNo: "005901732431",
      pieces: 2,
      weight: 21.4,
      consignor: {
        name: "RPT TRAVELS",
        address: [
          "NO 296 AT GALLE RD",
          "WELLAWATTE"
        ],
        country: "LK - Sri Lanka"
      },
      consignee: {
        name: "JEYAKUMAR GAVI",
        address: [
          "31 LITTLE OXHEY LANE",
          "SOUTH OXHEY WATFORD"
        ],
        city: "WATFORD",
        postcode: "WD19 6FL",
        country: "GB - United Kingdom",
        contact: "447974486968"
      },
      description: "CHILI POWDER, PEANUTS, SOYAMEAT",
      value: 10.7,
      currency: "GBP",
      bagNo: "40",
      serviceInfo: "EXP"
    },
    {
      id: "3",
      sNo: 3,
      consignmentNo: "005901732432",
      pieces: 1,
      weight: 14.9,
      consignor: {
        name: "RPT TRAVELS",
        address: [
          "NO 296 AT GALLE RD",
          "WELLAWATTE"
        ],
        country: "LK - Sri Lanka"
      },
      consignee: {
        name: "EMMANUEL WIJETHEVENTHIRAN KAVIOR",
        address: [
          "122, CHURCH ELM LANE DAGENHAM"
        ],
        city: "DAGENHAM",
        postcode: "RM10 9RL",
        country: "GB - United Kingdom",
        contact: "447587477504"
      },
      description: "FOOD ITEMS, FLOUR, COFFEE POWDER, CHILLI PASTE",
      value: 7.45,
      currency: "GBP",
      bagNo: "39",
      serviceInfo: "EXP"
    },
    {
      id: "4",
      sNo: 4,
      consignmentNo: "005901732562",
      pieces: 1,
      weight: 16.8,
      consignor: {
        name: "GEO LANKA ENTERPRISES",
        address: [
          "NO 22 ALDENIYA RD",
          "KANDY"
        ],
        country: "LK - Sri Lanka"
      },
      consignee: {
        name: "PASCAL KOEING",
        address: [
          "DER ROSE C/O AZEEM 123123"
        ],
        city: "BERLIN",
        postcode: "13088",
        country: "DE - Germany",
        contact: "4915222483335"
      },
      description: "CONFECTIONERY ITEM",
      value: 8.4,
      currency: "GBP",
      bagNo: "4",
      serviceInfo: "EXP"
    },
    {
      id: "5",
      sNo: 5,
      consignmentNo: "005901812401",
      pieces: 1,
      weight: 18.8,
      consignor: {
        name: "MR.S.PATHMASANAN",
        address: [
          "NP EXPRESS",
          "RAILWAY STATION ROAD",
          "PALLAI"
        ],
        country: "LK - Sri Lanka"
      },
      consignee: {
        name: "MR.SAMRAJAH KALIDASA SENTHUHAN",
        address: [
          "GSS CHICKEN FARM,2 AVENUE DE LA DIVISION LECLERC",
          "SAINT CYR LECOLE"
        ],
        city: "SAINT CYR LECOLE",
        postcode: "78210",
        country: "FR - France",
        contact: "0033783052802"
      },
      description: "DRESS, CURRY POWDER, RICE FLOUR, DRY CHIPS",
      value: 9.4,
      currency: "GBP",
      bagNo: "7",
      serviceInfo: "EXP"
    },
    {
      id: "6",
      sNo: 6,
      consignmentNo: "005901812402",
      pieces: 5,
      weight: 109.2,
      consignor: {
        name: "MRS.GOWRY NITHIYANANTHAN",
        address: [
          "NP EXPRESS",
          "RAILWAY STATION ROAD",
          "PALLAI"
        ],
        country: "LK - Sri Lanka"
      },
      consignee: {
        name: "MR.P.PREM",
        address: [
          "ROOFT BARN, 78 RAWMARSH HILL",
          "PARKGATE,ROTHERHAM"
        ],
        city: "ROTHERHAM",
        postcode: "S62 6EP",
        country: "GB - United Kingdom",
        contact: "0044 7515191632"
      },
      description: "CURRY POWDER, COFFEE, SWEETS",
      value: 54.6,
      currency: "GBP",
      bagNo: "36",
      serviceInfo: "EXP"
    }
  ]
};
