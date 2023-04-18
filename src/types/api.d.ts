export type InventoryResponse = InventoryItem[];

export interface InventoryItem {
  count: number;
  Item: Item;
}

export interface Item {
  id: string;
  name: string;
  marketHashName: string;
  iconUrl: string;
  iconUrlLarge: string;
  gameId: string;
  createdAt: string;
  updatedAt: string;
  Price?: Price[];
  tags: Tag[];
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
