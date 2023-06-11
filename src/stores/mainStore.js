import { defineStore } from 'pinia';

export const useMystore = defineStore('myStore', {
  state: () => ({
    selected_menu_id: 0, // 選択中のメニューID
    counter: 0,
    teams_send_flag: false, // Teams送信フラグ
    start_work_flag: false, // 業務開始フラグ
    rest_work_flag: false, // 業務休憩フラグ
  }),
  getters: {
    double: (state) => {
      return state.count * 2;
    },
  },
  actions: {
    set_selected_menu_id(id) {
      // 数字を渡されていなければ何もしない
      if (typeof id !== 'number') {
        return;
      }
      // 選択状態のメニューIDを保持する
      if (id >= 0) {
        this.selected_menu_id = id;
      } else {
        // 不正なidの場合先頭（0）に戻す
        this.selected_menu_id = 0;
      }
    },
    change_teams_send_flag(flag) {
      if (typeof flag !== 'boolean') {
        return;
      }
      this.teams_send_flag = flag;
    },
    change_start_work_flag(flag) {
      if (typeof flag !== 'boolean') {
        return;
      }
      this.start_work_flag = flag;
    },
    change_rest_work_flag(flag) {
      if (typeof flag !== 'boolean') {
        return;
      }
      this.rest_work_flag = flag;
    },
  },
  persist: {
    storage: persistedState.sessionStorage,
  },
});
