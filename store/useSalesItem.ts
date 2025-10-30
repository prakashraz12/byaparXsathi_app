import { create } from "zustand";

export type SalesItemDraft = {
  itemId: string;
  quantity: number;
  price?: number;
  itemName?: string;
  discountAmount?: number;
  measurementUnit?: string;
};

type SalesItemState = {
  salesItems: SalesItemDraft[];
  addSalesItem: (salesItem: SalesItemDraft) => void;
  removeSalesItem: (salesItemId: string) => void;
  updateSalesItem: (salesItemId: string, salesItem: SalesItemDraft) => void;
};


export const useSalesItemStore = create<SalesItemState>()(
    (set) => ({
        salesItems: [],
        addSalesItem: (salesItem: SalesItemDraft) =>
          set((state) => ({ salesItems: [...state.salesItems, salesItem] })),
        removeSalesItem: (salesItemId: string) =>
          set((state) => ({
            salesItems: state.salesItems.filter((item) => item.itemId !== salesItemId),
          })),
        updateSalesItem: (salesItemId: string, salesItem: SalesItemDraft) =>
          set((state) => ({
            salesItems: state.salesItems.map((item) =>
              item.itemId === salesItemId ? salesItem : item
            ),
          })),
    })
)
