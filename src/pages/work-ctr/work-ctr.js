import moment from 'moment';
import { mdiCog } from '@mdi/js';
import webapis from '~/general/apis/web-apis.ts';
// import otherapis from '~/general/apis/other-apis.ts';
import { useMystore } from '~/stores/mainStore.js';

const filePath = '~/assets/json/webhook_teams.json';

export default {
  name: 'workpage',
  data() {
    return {
      // アイコン
      mdiCog,
      // store
      mystore: null,

      // 時刻情報
      formatStr: 'YYYY-MM-DD HH:mm',
      formatDate: 'YYYYMMDD',
      formatTime: 'HH:mm',

      // 設定関連
      settingTeamsDialog: false,
      json_teams_data: {
        webhook: '',
        title: '',
        text: '',
      },
      notExistTeamsSettingFlag: true, // Teamsファイル存在なしフラグ

      // ダイアログ関係
      success: false,
      error: false,
      dialogProps: {
        title: '',
        message: '',
        buttonCount: 0,
        width: 0,
      },
    };
  },
  async mounted() {
    // storeを読み込み
    this.mystore = useMystore();

    console.log('★', moment(this.starttime).startOf('days'));
    // storeの業務時刻データが本日中ではなかったらデータを初期化する
    if (
      this.starttime === '' ||
      this.endttime === '' ||
      moment(this.starttime).startOf('days').format(this.formatDate) !==
        moment().startOf('days').format(this.formatDate) ||
      moment(this.endtime).startOf('days').format(this.formatDate) !==
        moment().startOf('days').format(this.formatDate)
    ) {
      this.mystore.init_worktime();
    }
    // temas webhookファイルの読込
    try {
      const response = await webapis.ReadTeamsSetting();
      this.json_teams_data.webhook = response.data.FileData.webhook;
      this.json_teams_data.title = response.data.FileData.title;
      this.json_teams_data.text = response.data.FileData.text;
    } catch (err) {
      if (this.sendMessageFlag) {
        // teams送信フラグがONの時に設定ファイルを読み込めなかった場合はエラーメッセージ
        this.setDialogMessage(1, ``, `設定の読み込みに失敗しました。`, 0);
        this.error = true;
      }
    }
  },
  computed: {
    dialog: {
      get() {
        return this.success || this.error;
      },
      set(newVal) {
        this.success = newVal;
        this.error = newVal;
      },
    },
    sendMessageFlag: {
      get() {
        if (this.mystore) {
          return this.mystore.teams_send_flag;
        } else {
          return false;
        }
      },
      set(newVal) {
        this.mystore.change_teams_send_flag(newVal);
      },
    },
    startWorkingFlag: {
      get() {
        if (this.mystore) {
          return this.mystore.start_work_flag;
        } else {
          return false;
        }
      },
      set(newVal) {
        this.mystore.change_start_work_flag(newVal);
      },
    },
    restWorkingFlag: {
      get() {
        if (this.mystore) {
          return this.mystore.rest_work_flag;
        } else {
          return false;
        }
      },
      set(newVal) {
        this.mystore.change_rest_work_flag(newVal);
      },
    },
    starttimeStr() {
      if (this.starttime !== '') {
        return this.starttime;
      } else {
        return '設定なし';
      }
    },
    endtimeStr() {
      if (this.endtime !== '') {
        return this.endtime;
      } else {
        return '設定なし';
      }
    },
    starttime: {
      get() {
        if (this.mystore) {
          return this.mystore.work_starttime;
        } else {
          return '';
        }
      },
      set(newVal) {
        this.mystore.set_work_starttime(newVal);
      },
    },
    endtime: {
      get() {
        if (this.mystore) {
          return this.mystore.work_endtime;
        } else {
          return '';
        }
      },
      set(newVal) {
        this.mystore.set_work_endtime(newVal);
      },
    },
    resttime: {
      get() {
        if (this.mystore) {
          return this.mystore.work_resttime;
        } else {
          return {};
        }
      },
      set(time) {
        this.mystore.set_work_resttime(time);
      },
    },
    reststarttime: {
      get() {
        if (this.mystore) {
          return this.mystore.work_rest_starttime;
        } else {
          return {};
        }
      },
      set(time) {
        this.mystore.set_work_rest_starttime(time);
      },
    },
  },
  watch: {},
  methods: {
    /**
     * webhookのURLをtxtに保存
     */
    async saveSetting() {
      // URLの型と一致するかチェック
      const pattern =
        /https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#\u3000-\u30FE\u4E00-\u9FA0\uFF01-\uFFE3]+/g;
      const url_check = pattern.test(this.json_teams_data.webhook);
      if (!url_check) {
        this.setDialogMessage(
          1,
          ``,
          `入力したURLが正しいか確認してください。`,
          0
        );
        this.error = true;
        return;
      }
      try {
        const response = await webapis.WriteTeamsSetting(this.json_teams_data);
        this.setDialogMessage(1, ``, `設定の保存が完了しました。`, 0);
        this.success = true;
        console.log('saveSetting success', response);
      } catch (err) {
        this.setDialogMessage(
          1,
          ``,
          `設定の保存に失敗しました。${filePath}の読込権限を確認してください。`,
          0
        );
        this.error = true;
        console.log('saveSetting error', err);
      }
    },
    /**
     * teamsにメッセージを送る
     */
    async sendTeams() {
      const requestData = {
        text: this.json_teams_data.text,
      };
      if (this.json_teams_data.title.length > 0) {
        requestData.title = this.json_teams_data.title;
      }
      try {
        const response = await webapis.SendTeamsMessage(
          this.json_teams_data.webhook,
          requestData
        );
        this.setDialogMessage(1, ``, `メッセージの送信に成功しました。`, 0);
        this.success = true;
        console.log('sendMessage success', response);
      } catch (err) {
        this.setDialogMessage(1, ``, `メッセージの送信に失敗しました。`, 0);
        this.error = true;
        console.error('sendMessage error', err);
      }
    },
    /**
     * 業務開始ボタンクリック
     */
    async startWork() {
      this.mystore.init_worktime();
      // teams送信フラグがONの場合、メッセージを送信する
      if (this.sendMessageFlag) {
        await this.sendTeams();
      }
      this.starttime = moment().format(this.formatStr);
      this.endtime = '';
      this.startWorkingFlag = true;
    },
    /**
     * 休憩ボタンクリック
     */
    async restWork() {
      // teams送信フラグがONの場合、メッセージを送信する
      if (this.sendMessageFlag) {
        await this.sendTeams();
      }
      if (!this.restWorkingFlag) {
        // 休憩を始める場合
        this.reststarttime = moment().format(this.formatTime);
      } else {
        // 休憩を終了する場合
        const restendtime = moment().format(this.formatTime);
        if (this.reststarttime !== '') {
          const resttimeTmp = `${this.reststarttime}-${restendtime}`;
          this.resttime = resttimeTmp;
        } else {
          this.setDialogMessage(
            1,
            ``,
            `休憩開始時刻が保存されていません。休憩時刻を保存できませんでした。`,
            0
          );
        }
        this.reststarttime = '';
      }
      this.restWorkingFlag = !this.restWorkingFlag;
    },
    /**
     * 業務終了ボタンクリック
     */
    async endWork() {
      // teams送信フラグがONの場合、メッセージを送信する
      if (this.sendMessageFlag) {
        await this.sendTeams();
      }
      this.endtime = moment().format(this.formatStr);

      const date = moment(this.starttime).format(this.formatDate);
      const start = moment(this.starttime).format(this.formatTime);
      const end = moment(this.endtime).format(this.formatTime);

      await this.writeCSV(date, start, end, this.resttime);

      this.startWorkingFlag = false;
      this.restWorkingFlag = false;
    },
    /**
     * ダイアログ内の文字列を設定,表示する
     */
    setDialogMessage(buttonCount, title, message, width) {
      this.dialogProps.buttonCount = buttonCount;
      this.dialogProps.title = title;
      this.dialogProps.message = message;
      this.dialogProps.width = width;
    },
    /**
     * ダイアログOK
     */
    dialogOK() {
      this.dialog = false;
    },
    /**
     * ダイアログキャンセル
     */
    dialogCancel() {
      this.dialog = false;
    },
    /**
     * Teams設定保存
     */
    async teamsSettingOK() {
      await this.saveSetting();
      if (this.success) {
        this.settingTeamsDialog = false;
      }
    },
    /**
     * Teams設定保存キャンセル
     */
    teamsSettingCancel() {
      // ★ここで設定を元に戻しておく
      this.settingTeamsDialog = false;
    },
    async readCSV() {
      try {
        const response = await webapis.ReadWorkTime('202306');
        if (!response.data) {
          this.setDialogMessage(1, ``, `CSVの読み込みに失敗しました。`, 0);
          this.error = true;
          console.error('★error', response);
        } else {
          console.log('★success', response);
          console.log('★', JSON.parse(response.data.CSVData[0].rest));
        }
      } catch (err) {
        this.setDialogMessage(1, ``, `CSVの読み込みに失敗しました。`, 0);
        this.error = true;
        console.error('★error', err);
      }
    },
    async writeCSV(date, start, end, rest) {
      try {
        const response = await webapis.SaveWorkTime(date, start, end, rest);
        console.log('★success', response);
      } catch (err) {
        this.setDialogMessage(1, ``, `CSVの書き込みに失敗しました。`, 0);
        this.error = true;
        console.error('★error', err);
      }
    },
  },
};
