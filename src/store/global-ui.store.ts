import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type TGlobalUIState = {
  pagination: {
    page: number;
    limit: number;
  };
  sorting: {
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };
  filters: {
    search: string;
  };
};

type TGlobalUIAction = {
  setPaginationPage: (value: number) => void;
  setPaginationLimit: (value: number) => void;
  setSortingSortBy: (value: string) => void;
  setSortingSortOrder: (value: 'asc' | 'desc') => void;
  setFiltersSearch: (value: string) => void;
};

export type TGlobalUIStore = TGlobalUIState & TGlobalUIAction;

export const initialState: TGlobalUIState = {
  filters: {
    search: '',
  },
  sorting: {
    sortBy: '',
    sortOrder: 'asc',
  },

  pagination: {
    page: 0,
    limit: 10,
  },
};

export const useGlobalUIStore = create<TGlobalUIStore>()(
  immer(
    devtools((set) => ({
      ...initialState,

      setFiltersSearch: (value) => {
        set((state) => {
          state.filters.search = value;
        });
      },

      setPaginationLimit: (value) => {
        set((state) => {
          state.pagination.limit = value;
        });
      },

      setPaginationPage: (value) => {
        set((state) => {
          state.pagination.page = value;
        });
      },

      setSortingSortBy: (value) => {
        set((state) => {
          state.sorting.sortBy = value;
        });
      },

      setSortingSortOrder: (value) => {
        set((state) => {
          state.sorting.sortOrder = value;
        });
      },
    })),
  ),
);
