// import webapis from '~/general/apis/web-apis.ts'

export default {
  name: 'awssetting',
  data() {
    return {
      // ダイアログ関係
      success: false,
      error: false,
      dialogProps: {
        title: '',
        message: '',
        buttonCount: 0,
        width: 0,
      },
    }
  },
  mounted() {
    //
  },
  computed: {
    dialog: {
      get() {
        return this.success || this.error
      },
      set(newVal) {
        this.success = newVal
        this.error = newVal
      },
    },
  },
  methods: {
    /**
     * ダイアログ内の文字列を設定,表示する
     */
    setDialogMessage(buttonCount, title, message, width) {
      this.dialogProps.buttonCount = buttonCount
      this.dialogProps.title = title
      this.dialogProps.message = message
      this.dialogProps.width = width
    },
    /**
     * ダイアログOK
     */
    dialogOK() {
      this.dialog = false
      // 保存時の確認ダイアログの場合
      if (this.isSaveDialog) {
        // ファイルを保存する
        // this.setFiletoS3()
        this.isSaveDialog = false
      }
    },
    /**
     * ダイアログキャンセル
     */
    dialogCancel() {
      this.dialog = false
      // 保存時の確認ダイアログの場合
      if (this.isSaveDialog) {
        this.isSaveDialog = false
      }
    },
  },
}
