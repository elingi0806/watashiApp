import { defineStore } from 'pinia';

export const useMystore = defineStore('myStore', {
  state: () => ({
    selected_menu_id: 0,
    counter: 0,
  }),
  getters: {
    double: (state) => {
      return state.count * 2;
    },
  },
  actions: {
    set_selected_menu_id(id) {
      // 選択状態のメニューIDを保持する
      if (id >= 0) {
        this.selected_menu_id = id;
      } else {
        // 不正なidの場合先頭（0）に戻す
        this.selected_menu_id = 0;
      }
    },
  },
  persist: {
    storage: persistedState.sessionStorage,
  },
});
