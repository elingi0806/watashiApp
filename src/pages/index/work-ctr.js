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
      formatStrDate: 'YYYY-MM-DD',
      formatDate: 'YYYYMMDD',
      formatMonth: 'YYYYMM',
      formatTime: 'HH:mm',

      // 設定関連
      settingTeamsDialog: false,
      json_teams_data: {
        webhook: '',
        start_title: '',
        start_text: '',
        end_title: '',
        end_text: '',
      },
      isSetting: false, // API送信中
      notExistTeamsSettingFlag: true, // Teamsファイル存在なしフラグ

      // ダイアログ関係
      overwriteFlag: false, // 上書きフラグ
      success: false,
      error: false,
      dialogProps: {
        title: '',
        message: '',
        buttonCount: 0,
        width: 0,
      },
      finishDialog: false, // 業務終了ダイアログ
      allworktime: 0, // 就業時間
    };
  },
  async mounted() {
    // storeを読み込み
    this.mystore = useMystore();

    // storeデータがなければCSVを読み込む
    if (
      typeof this.starttime === 'undefined' &&
      this.starttime === null &&
      this.starttime.length <= 0 &&
      typeof this.endtime === 'undefined' &&
      this.endttime === null &&
      this.endtime.length <= 0
    ) {
      const csvdate = moment().format(this.formatMonth);
      const csvResponse = await webapis.ReadWorkTime(csvdate);
      console.log('csv data', csvResponse);
      if (csvResponse.data && csvResponse.data.CSVData) {
        const csvData = csvResponse.data.CSVData;
        const csvdate = moment().format(this.formatDate);
        const target = csvData.find((d) => d.date === csvdate);
        console.log('todays csv', target);
        // 本日のデータが存在すれば上書きする
        if (target) {
          const strDate = moment().format(this.formatStrDate);
          // 初期化
          this.mystore.init_worktime();
          // csvのデータをstoreに保存
          this.starttime = target.start;
          this.endtime = target.end;
          const tmprest = JSON.parse(target.rest);
          Object.values(tmprest).forEach((r) => (this.resttime = r));
          console.log('new data', this.starttime, this.endtime, tmprest);
        }
      }
    }

    // storeの業務時刻データが本日中ではなかったらデータを初期化する
    if (
      typeof this.starttime !== 'undefined' &&
      this.starttime !== null &&
      this.starttime.length > 0 &&
      typeof this.endtime !== 'undefined' &&
      this.endttime !== null &&
      this.endtime.length > 0 &&
      !this.confirmToday()
    ) {
      this.mystore.init_worktime();
    }

    // 業務開始しているが日時が本日ではない場合
    if (
      this.startWorkingFlag &&
      moment(this.starttime).startOf('days').format(this.formatDate) !==
        moment().startOf('days').format(this.formatDate)
    ) {
      this.startWorkingFlag = false;
      this.mystore.init_worktime();
    }
    // temas webhookファイルの読込
    try {
      const response = await webapis.ReadTeamsSetting();
      this.json_teams_data.webhook = response.data.FileData.webhook;
      this.json_teams_data.start_title = response.data.FileData.start_title;
      this.json_teams_data.start_text = response.data.FileData.start_text;
      this.json_teams_data.end_title = response.data.FileData.end_title;
      this.json_teams_data.end_text = response.data.FileData.end_text;
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
        return moment(this.starttime).format(this.formatTime);
      } else {
        return '設定なし';
      }
    },
    endtimeStr() {
      if (this.endtime !== '') {
        return moment(this.endtime).format(this.formatTime);
      } else {
        return '設定なし';
      }
    },
    resttimeStr() {
      if (this.reststarttime !== '') {
        return moment(this.reststarttime).format(this.formatTime);
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
    disabledsavebtn() {
      // teams設定保存ボタンをアクティブ化するかどうか
      if (
        this.json_teams_data.webhook.length <= 0 ||
        this.json_teams_data.start_text.length <= 0 ||
        this.json_teams_data.end_text.length <= 0
      ) {
        return true;
      } else {
        return false;
      }
    },
    allworktimeStr() {
      if (this.allworktime <= 0) {
        return '0分';
      } else {
        const minutes = this.allworktime % 60;
        const hour = Math.floor(this.allworktime / 60);
        if (hour > 0) {
          return `${hour}時間${minutes}分`;
        } else {
          return `${minutes}分`;
        }
      }
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
    async sendTeams(kind) {
      let text = '';
      let title = '';
      switch (kind) {
        case 'start':
          text = this.json_teams_data.start_text;
          title = this.json_teams_data.start_title;
          break;
        case 'end':
          text = this.json_teams_data.end_text;
          title = this.json_teams_data.end_title;
          break;
        default:
          return;
      }
      // 送信用のメッセージが設定されていなければ何もしない
      if (text.length <= 0) {
        this.setDialogMessage(
          1,
          ``,
          `メッセージが設定されていないため、チャットを送信しませんでした。`,
          0
        );
        return;
      }
      const requestData = {
        text: text,
      };
      if (title.length > 0) {
        requestData.title = title;
      }
      try {
        const response = await webapis.SendTeamsMessage(
          this.json_teams_data.webhook,
          requestData
        );
        // this.setDialogMessage(1, ``, `メッセージの送信に成功しました。`, 0);
        // this.success = true;
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
      this.isSetting = true;
      this.mystore.init_worktime();
      // teams送信フラグがONの場合、メッセージを送信する
      if (this.sendMessageFlag) {
        await this.sendTeams('start');
      }
      this.starttime = moment().format(this.formatStr);
      this.endtime = '';
      this.startWorkingFlag = true;
      this.isSetting = false;
    },
    /**
     * 休憩ボタンクリック
     */
    async restWork() {
      if (!this.restWorkingFlag) {
        // 休憩を始める場合
        this.reststarttime = moment().format(this.formatStr);
      } else if (this.restWorkingFlag && this.reststarttime === '') {
        // 休憩を終了する場合がスタートタイムが保存されていない場合
        this.setDialogMessage(
          1,
          ``,
          `休憩開始時刻が保存されていません。休憩時刻を保存できませんでした。`,
          0
        );
      } else {
        const restendtime = moment().format(this.formatStr);
        const diff = moment(restendtime).diff(
          moment(this.reststarttime),
          'minutes'
        );
        if (diff === 0) {
          // 休憩時間が0分の場合、休憩時間として保存しない
          this.setDialogMessage(
            1,
            ``,
            `休憩時間が0分のため、データを保存しません。`,
            0
          );
        } else {
          const resttimeTmp = `${this.reststarttime}|${restendtime}`;
          this.resttime = resttimeTmp;
        }
        this.reststarttime = '';
      }
      this.restWorkingFlag = !this.restWorkingFlag;
    },
    /**
     * 業務終了ボタンクリック
     */
    async endWork() {
      this.isSetting = true;
      // teams送信フラグがONの場合、メッセージを送信する
      if (this.sendMessageFlag) {
        await this.sendTeams('end');
      }

      const date = moment(this.starttime).format(this.formatDate);
      const start = moment(this.starttime).format(this.formatStr);
      this.endtime = moment().format(this.formatStr);
      const end = moment(this.endtime).format(this.formatStr);

      const alltime = moment(this.endtime).diff(
        moment(this.starttime),
        'minutes'
      );
      console.log('★', this.resttime);
      let resttime = 0;
      Object.values(this.resttime).forEach((r) => {
        const str = r.split('|');
        resttime += moment(str[1]).diff(moment(str[0]), 'minutes');
      });
      this.allworktime = alltime - resttime;

      await this.writeCSV(date, start, end, this.resttime, this.allworktime);

      // 各データを初期化
      this.reststarttime = '';
      this.startWorkingFlag = false;
      this.restWorkingFlag = false;
      this.isSetting = false;
      this.finishDialog = true;
    },
    /**
     * 業務開始ボタンクリック
     */
    clickStart() {
      // ボタンクリック時にすでにデータが存在している場合は、上書きしてもいいか質問する
      if (this.starttime !== '' && this.endttime !== '') {
        this.overwriteFlag = true;
        this.setDialogMessage(
          2,
          '確認',
          'すでに本日の業務データが存在します。上書きしますか？',
          0
        );
      } else {
        this.startWork();
      }
    },
    /**
     * ダイアログ内の文字列を設定,表示する
     */
    setDialogMessage(buttonCount, title, message, width) {
      this.dialogProps.buttonCount = buttonCount;
      this.dialogProps.title = title;
      this.dialogProps.message = message;
      this.dialogProps.width = width;
      this.dialog = true;
    },
    /**
     * ダイアログOK
     */
    dialogOK() {
      this.dialog = false;
      if (this.overwriteFlag) {
        this.overwriteFlag = false;
        this.startWork();
      }
    },
    /**
     * ダイアログキャンセル
     */
    dialogCancel() {
      this.dialog = false;
      if (this.overwriteFlag) {
        this.overwriteFlag = false;
      }
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
    async readCSV(date) {
      try {
        const response = await webapis.ReadWorkTime(date);
        if (!response.data) {
          this.setDialogMessage(1, ``, `CSVの読み込みに失敗しました。`, 0);
          this.error = true;
        } else {
          console.log('★success', response);
          // console.log('★', JSON.parse(response.data.CSVData[0].rest));
        }
      } catch (err) {
        this.setDialogMessage(1, ``, `CSVの読み込みに失敗しました。`, 0);
        this.error = true;
        console.error('★error', err);
      }
    },
    async writeCSV(date, start, end, rest, alltime) {
      try {
        const response = await webapis.SaveWorkTime(
          date,
          start,
          end,
          rest,
          alltime
        );
        console.log('★success', response);
      } catch (err) {
        this.setDialogMessage(1, ``, `CSVの書き込みに失敗しました。`, 0);
        this.error = true;
        console.error('★error', err);
      }
    },
    /**
     * storeのデータが今日かどうか
     */
    confirmToday() {
      if (
        moment(this.starttime).startOf('days').format(this.formatDate) ===
          moment().startOf('days').format(this.formatDate) &&
        moment(this.endtime).startOf('days').format(this.formatDate) ===
          moment().startOf('days').format(this.formatDate)
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
};
