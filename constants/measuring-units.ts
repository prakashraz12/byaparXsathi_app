import { MeasuringUnitType } from '@/types/measuring-unit';
import { SHOP_TYPE } from '@/types/shop';

export const MEASURING_UNITS: Record<SHOP_TYPE, MeasuringUnitType[]> = {
  [SHOP_TYPE.CLOTHING_STORE]: [
    { label: 'Piece', shortForm: 'Pc', active: true },
    { label: 'Dozen', shortForm: 'Dz', active: true },
    { label: 'Set', shortForm: 'Set', active: true },
  ],

  [SHOP_TYPE.JEWELRY_STORE]: [
    { label: 'Gram', shortForm: 'grm', active: true },
    { label: 'Carat', shortForm: 'crt', active: true },
    { label: 'Piece', shortForm: 'Pc', active: true },
    { label: 'Lal', shortForm: 'Lal', active: true },
  ],

  [SHOP_TYPE.BAKERY]: [
    { label: 'Piece', shortForm: 'Pc', active: true },
    { label: 'Kilogram', shortForm: 'Kg', active: true },
    { label: 'Gram', shortForm: 'grm', active: true },
    { label: 'Pound', shortForm: 'P', active: true },
    { label: 'Ounce', shortForm: 'Oz', active: true },
  ],

  [SHOP_TYPE.CAFE]: [
    { label: 'Cup', shortForm: 'Cup', active: true },
    { label: 'Milliliter', shortForm: 'ml', active: true },
    { label: 'Plate', shortForm: 'Plt', active: true },
    { label: 'Piece', shortForm: 'Pc', active: true },
    { label: 'Bottel', shortForm: 'Btl', active: true },
    { label: 'Packet', shortForm: 'Pkt', active: true },
  ],

  [SHOP_TYPE.RESTAURANT]: [
    { label: 'Plate', shortForm: 'Plt', active: true },
    { label: 'Bowl', shortForm: 'Bowl', active: true },
    { label: 'Piece', shortForm: 'Pc', active: true },
    { label: 'Bottel', shortForm: 'Btl', active: true },
    { label: 'Glass', shortForm: 'Gls', active: true },
    { label: 'Peg', shortForm: 'Peg', active: true },
    { label: 'Quarter', shortForm: 'Qtr', active: true },
    { label: 'Half', shortForm: 'Hlf', active: true },
    { label: 'Full', shortForm: 'Full', active: true },
    { label: 'Cup', shortForm: 'Cup', active: true },
    { label: 'Packet', shortForm: 'Pkt', active: true },
  ],

  [SHOP_TYPE.GROCERY]: [
    { label: 'Kilogram', shortForm: 'Kg', active: true },
    { label: 'Gram', shortForm: 'grm', active: true },
    { label: 'Liter', shortForm: 'ltr', active: true },
    { label: 'Milliliter', shortForm: 'ml', active: true },
    { label: 'Piece', shortForm: 'Pc', active: true },
    { label: 'Bottel', shortForm: 'Btl', active: true },
    { label: 'Packet', shortForm: 'Pkt', active: true },
    { label: 'Box', shortForm: 'Box', active: true },
    { label: 'Carton', shortForm: 'Carton', active: true },
    { label: 'Can', shortForm: 'Can', active: true },
    { label: 'Jar', shortForm: 'Jar', active: true },
    { label: 'Crate', shortForm: 'Crt', active: true },
    { label: 'Bora', shortForm: 'Bora', active: true },
    { label: 'Dozen', shortForm: 'Dzn', active: true },
  ],
};
