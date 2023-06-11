import { defineStore } from 'pinia';

export const useMystore = defineStore('myStore', {
  state: () => ({
    selected_menu_id: 0, // 選択中のメニューID
    counter: 0,
    teams_send_flag: false, // Teams送信フラグ
    start_work_flag: false, // 業務開始フラグ
    rest_work_flag: false, // 業務休憩フラグ
    work_starttime: '', // 業務開始時間
    work_endtime: '', // 業務終了時間
    work_resttime: {}, // 業務休憩時間
    work_rest_starttime: '', // 業務休憩開始時間
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
    set_work_starttime(time) {
      this.work_starttime = time;
    },
    set_work_endtime(time) {
      this.work_endtime = time;
    },
    set_work_resttime(time) {
      const keys = Object.keys(this.work_resttime);
      if (keys.length <= 0) {
        this.work_resttime[0] = time;
      } else {
        const maxnum = Math.max(...keys);
        this.work_resttime[maxnum + 1] = time;
      }
    },
    set_work_rest_starttime(time) {
      this.work_rest_starttime = time;
    },
    init_worktime() {
      this.work_starttime = '';
      this.work_endtime = '';
      this.work_rest_starttime = '';
      this.work_resttime = {};
    },
  },
  persist: {
    storage: persistedState.sessionStorage,
  },
});
