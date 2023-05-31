// import fs from 'fs';
// import webapi from '~/modules/web-apis.js'
import appDialog from '~/components/appDialog/index.vue';

const filePath = 'src/renderer/assets/json/webhook_teams.json';

export default {
  components: {
    appDialog,
  },
  data() {
    return {
      // チームズにメッセージ送信するかのフラグ
      sendMessageFlag: true,

      // 設定関連
      json_teams_data: {
        webhook: '',
        title: '',
        text: '',
      },
      notExistTeamsSettingFlag: true, // Teamsファイル存在なしフラグ

      // ダイアログ関係
      dialog: false,
      dialogProps: {
        title: '',
        message: '',
        buttonCount: 0,
      },
    };
  },
  mounted() {
    /*
    // temas webhookファイルの存在確認
    try {
      fs.statSync(filePath);
      this.notExistTeamsSettingFlag = false;
    } catch (err) {
      this.notExistTeamsSettingFlag = true;
      this.sendMessageFlag = false;
    }
    // ファイルからURLの読み込み
    try {
      const filejson = fs.readFileSync(filePath, 'utf8');
      this.json_teams_data.webhook = JSON.parse(filejson)?.webhook;
      this.json_teams_data.title = JSON.parse(filejson)?.title;
      this.json_teams_data.text = JSON.parse(filejson)?.text;
    } catch (err) {
      // teams送信フラグがONの時に設定ファイルを読み込めなかった場合はエラーメッセージ
      if (this.sendMessageFlag) {
        this.setDialogMessage(
          0,
          ``,
          `設定の読み込みに失敗しました。${filePath}の読込権限を確認してください。`
        );
      }
    }
    */
  },
  computed: {},
  watch: {},
  methods: {
    /**
     * webhookのURLをtxtに保存
     */
    saveSetting() {
      // URLの型と一致するかチェック
      const pattern =
        /https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#\u3000-\u30FE\u4E00-\u9FA0\uFF01-\uFFE3]+/g;
      const url_check = pattern.test(this.json_teams_data.webhook);
      if (!url_check) {
        this.setDialogMessage(0, ``, `入力したURLが正しいか確認してください。`);
        return;
      }
      /*
      try {
        fs.writeFileSync(
          filePath,
          JSON.stringify(this.json_teams_data, null, '    ')
        );
        this.setDialogMessage(0, ``, `設定の保存が完了しました。`);
      } catch (err) {
        this.setDialogMessage(
          0,
          ``,
          `設定の保存に失敗しました。${filePath}の読込権限を確認してください。`
        );
      }
      */
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
      /*
      try {
        const response = await webapi.sendTeamsMessage(
          this.json_teams_data.webhook,
          requestData
        )
        this.setDialogMessage(0, ``, `メッセージの送信に成功しました。`)
        console.log('sendMessage success', response)
      } catch (err) {
        this.setDialogMessage(0, ``, `メッセージの送信に失敗しました。`)
        console.error('sendMessage error', err)
      }
      */
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
     * ダイアログ内の文字列を設定,表示する
     */
    setDialogMessage(buttonCount, title, message) {
      this.$set(this.dialogProps, `buttonCount`, buttonCount);
      this.$set(this.dialogProps, `title`, title);
      this.$set(this.dialogProps, `message`, message);
      this.dialog = true;
    },
    /**
     * Teams設定保存
     */
    teamsSettingOK() {
      this.saveSetting();
    },
  },
};
