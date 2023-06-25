import moment from 'moment'
import webapis from '~/general/apis/web-apis.ts'

export default {
  name: 'awscostsetting',
  data() {
    return {
      // データ取得中
      isGetBucketData: false,
      isGetFileData: false,
      isGetCostData: false,
      isSetCostDatatoS3: false,

      // profileの指定
      profile: 'default',
      selectableProfiles: [
        {
          name: '開発（default）',
          value: 'default',
        },
        {
          name: 'STG（stg）',
          value: 'stg',
        },
        {
          name: '本番（product）',
          value: 'product',
        },
      ],
      // リージョンの指定
      targetRegion: 'ap-northeast-1',
      selectableRegions: [
        {
          name: '東京（ap-northeast-1）',
          value: 'ap-northeast-1',
        },
        {
          name: 'フランクフルト（eu-central-1）',
          value: 'eu-central-1',
        },
      ],

      // AWSのコスト情報
      costdata: {
        ResultsByTime: [],
      },
      // AWS S3のBucket情報
      s3buckets: [],
      targetbucket: null,
      // 指定したバケット内のファイル一覧
      bucketFileList: [],
      // S3への保存情報
      fileName: '',
      filetype: '.json',
      filetypes: ['.json', '.txt'],

      // 日時のフォーマット文字列
      selectFormatStrDate: 'YYYY年MM月',
      requestFormatStrDate: 'YYYY-MM-DD',
      fileNameFormatStr: 'YYYY-MM',

      // 日付選択
      selectableMonths: [],
      selectedDate: '',

      // ダイアログ関係
      success: false,
      error: false,
      dialogProps: {
        title: '',
        message: '',
        buttonCount: 0,
        width: 0,
      },
      // 確認ダイアログ
      isSaveDialog: false,
    }
  },
  mounted() {
    // 当月から数えて過去6カ月を選択候補とする
    const endMonth = moment().startOf('month')
    this.selectedDate = endMonth
    // 過去6カ月からデータを取得できるようにプルダウンを生成する
    for (let i = 0; i < 6; i++) {
      this.selectableMonths.push({
        disp: moment(endMonth).subtract(i, 'M').format(this.selectFormatStrDate),
        value: moment(endMonth).subtract(i, 'M'),
      })
    }
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
    isLoading() {
      return this.isGetBucketData || this.isGetFileData || this.isGetCostData || this.isSetCostDatatoS3
    },
    disabledSave() {
      // データ取得中
      if (this.isLoading) {
        return true
      }
      // コストデータが存在しない
      if (this.costdata.ResultsByTime.length <= 0) {
        return true
      }
      // 保存先のバケット名が不正の場合
      if (
        this.targetbucket === null ||
        this.targetbucket === '' ||
        this.targetbucket === `データなし` ||
        this.targetbucket === `取得失敗`
      ) {
        return true
      }
      // ファイル名が指定されていない
      if (this.fileName.length <= 0) {
        return true
      }
      return false
    },
    disabledGetFiles() {
      // データ取得中
      if (this.isLoading) {
        return true
      }
      // 保存先のバケット名が不正の場合
      if (
        this.targetbucket === null ||
        this.targetbucket === '' ||
        this.targetbucket === `データなし` ||
        this.targetbucket === `取得失敗`
      ) {
        return true
      }
      return false
    },
    profileStr() {
      const target = this.selectableProfiles.find((p) => p.value === this.profile)
      return target.name
    },
  },
  methods: {
    /**
     * awsからコスト情報を取得する
     */
    async getawscostBtn() {
      this.isGetCostData = true
      // 取得期間を指定
      const start = moment(this.selectedDate).format(this.requestFormatStrDate)
      const end = moment(this.selectedDate).endOf('M').format(this.requestFormatStrDate)
      // 取得先のリージョン
      const region = this.targetRegion
      this.costdata.ResultsByTime.splice(0, this.costdata.ResultsByTime.length)
      try {
        const response = await webapis.GetAWSCost(this.profile, start, end, region)
        if (response.data && response.data.ResultCode === '000000') {
          // 取得したデータを保存
          this.costdata.ResultsByTime.push(...response.data.CostData.ResultsByTime)
          // ファイル名はデフォルトでYYYY-MMにする
          this.fileName = moment(this.selectedDate).format(this.fileNameFormatStr)
        } else {
          this.setDialogMessage(1, ``, `AWSのコスト情報を取得するのに失敗しました。`, 0)
          console.error('コストデータ取得失敗', response)
          this.error = true
        }
      } catch (err) {
        this.setDialogMessage(1, ``, `AWSのコスト情報を取得するのに失敗しました。`, 0)
        console.error('コストデータ取得失敗', err)
        this.error = true
      } finally {
        this.isGetCostData = false
      }
    },
    /**
     * awsからS3のバケット一覧を取得する
     */
    async getawss3listBtn() {
      this.isGetBucketData = true
      this.s3buckets.splice(0, this.s3buckets.length)
      try {
        const response = await webapis.GetS3List(this.profile)
        if (response.data && response.data.ResultCode === '000000') {
          const datas = response.data.Buckets
          if (datas.length > 0) {
            datas.sort((a, b) => a.CreationDate - b.CreationDate) // 作成順にソート
            this.targetbucket = datas[0].Name
            for (const data of datas) {
              if (data.Name === 'billing-panasonic-ipro') {
                this.targetbucket = data.Name
              }
              this.s3buckets.push(data.Name)
            }
          } else {
            // データが存在しない場合
            this.targetbucket = `データなし`
            this.s3buckets.push(this.targetbucket)
          }
        } else {
          // 取得失敗
          this.targetbucket = `取得失敗`
          this.s3buckets.push(this.targetbucket)
          this.setDialogMessage(1, ``, `S3からBucket情報を取得するのに失敗しました。`, 0)
          console.error('S3データ取得失敗', response)
          this.error = true
        }
      } catch (err) {
        this.setDialogMessage(1, ``, `S3からBucket情報を取得するのに失敗しました。`, 0)
        console.error('S3データ取得失敗', err)
        this.error = true
      } finally {
        this.isGetBucketData = false
      }
    },
    /**
     * S3にファイルを保存する
     */
    async setFiletoS3() {
      this.isSetCostDatatoS3 = true
      // s3へ保存するデータを成型する
      let data
      if (this.filetype === '.txt') {
        data = JSON.stringify(this.costdata, null, '    ')
      } else {
        data = JSON.stringify(this.costdata)
      }
      try {
        const response = await webapis.SetFiletoS3(this.profile, this.targetbucket, this.fileName + this.filetype, data)
        if (response.data && response.data.ResultCode === '000000') {
          this.setDialogMessage(1, ``, `コストデータを保存しました。`, 0)
        } else {
          // 取得失敗
          this.setDialogMessage(1, ``, `コストデータを保存するのに失敗しました。`, 0)
          console.error('コストデータ保存失敗', response)
          this.error = true
        }
      } catch (err) {
        this.setDialogMessage(1, ``, `コストデータを保存するのに失敗しました。`, 0)
        console.error('コストデータ保存失敗', err)
        this.error = true
      } finally {
        this.isSetCostDatatoS3 = false
      }
    },
    /**
     * awsからS3のバケット内のファイル一覧を取得する
     */
    async getawss3filelistBtn() {
      this.isGetFileData = true
      this.bucketFileList.splice(0, this.bucketFileList)
      try {
        const response = await webapis.GetS3FileList(this.profile, this.targetbucket)
        if (response.data && response.data.ResultCode === '000000') {
          const files = response.data.Contents
          this.bucketFileList.push(...files)
        } else {
          // 取得失敗
          this.setDialogMessage(1, ``, `S3からファイル情報を取得するのに失敗しました。`, 0)
          console.error('S3ファイル取得失敗', response)
          this.error = true
        }
      } catch (err) {
        this.setDialogMessage(1, ``, `S3からファイル情報を取得するのに失敗しました。`, 0)
        console.error('S3ファイル取得失敗', err)
        this.error = true
      } finally {
        this.isGetFileData = false
      }
    },
    /**
     * S3への保存ボタンクリック
     */
    async saveClick() {
      this.isSaveDialog = true
      this.setDialogMessage(2, `確認`, `S3にファイルを保存します。よろしいですか。`, 0)
      this.dialog = true
    },
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
        this.setFiletoS3()
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
