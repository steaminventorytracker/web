export type InventoryResponse = InventoryItem[];

export interface InventoryItem {
  count: number;
  Item: Item;
}

export const ItemWears = [
  "FACTORY_NEW",
  "MINIMAL_WEAR",
  "FIELD_TESTED",
  "WELL_WORN",
  "BATTLE_SCARRED",
] as const;

export type ItemWear = (typeof ItemWears)[number];

export interface Item {
  id: string;
  name: string;
  marketHashName: string;
  iconUrl: string | null;
  iconUrlLarge: string | null;
  gameId: string;
  isStattrak: boolean;
  isSouvenir: boolean;
  wear: ItemWear | null;
  type: ItemTypeType;
  createdAt: Date;
  updatedAt: Date;
  Price: Price[];
}

export interface Tag {
  category: string;
  internal_name: string;
  localized_tag_name: string;
  localized_category_name: string;
}

export interface Price {
  id: string;
  itemId: string;
  lowestPrice: string;
  volume: number;
  medianPrice: string;
  createdAt: string;
  updatedAt: string;
}

export type JobResponse = {
  job: {
    id: string;
    queue_length: number;
    estimated_time: number;
    finished: boolean;
  };
};

export const ItemTypes = [
  "KNIFE",
  "GLOVE",
  "STICKER",
  "CASE",
  "KEY",
  "GUN",
] as const;

export type ItemTypeType = (typeof ItemTypes)[number];
