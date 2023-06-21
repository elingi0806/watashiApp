import moment from 'moment';
import { mdiCog } from '@mdi/js';
import webapis from '~/general/apis/web-apis.ts';
// import otherapis from '~/general/apis/other-apis.ts';
import { useMystore } from '~/stores/mainStore.js';

export default {
  name: 'workhistory',
  data() {
    return {
      // store
      mystore: null,

      // 時刻情報
      formatDispDate: 'DD',
      formatStrDate: 'YYYYMMDD',
      formatReadCSVDate: 'YYYYMM',
      formatTime: 'HH:mm',

      // ダイアログ関係
      success: false,
      error: false,
      dialogProps: {
        title: '',
        message: '',
        buttonCount: 0,
        width: 0,
      },

      loading: true,

      // グラフ
      chartType: 'DataTable',
      chartData: [
        ['年', '売上', '費用', '収益'],
        ['2014', 1000, 400, 200],
        ['2015', 1170, 460, 250],
        ['2016', 660, 1120, 300],
        ['2017', 1030, 540, 350],
      ],
      chartOptions: {
        title: '会社の損益',
        subtitle: '売上',
      },

      getDates: [],
      tableDatas: [],
    };
  },
  async mounted() {
    // storeを読み込み
    this.mystore = useMystore();

    const monthStartTime = moment().startOf('month');
    await this.getMonthData(monthStartTime);

    this.loading = false;
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
  },
  watch: {},
  methods: {
    async readCSV(date) {
      try {
        const response = await webapis.ReadWorkTime(date);
        if (!response.data || response.data.ResultCode !== '000000') {
          this.setDialogMessage(1, ``, `CSVの読み込みに失敗しました。`, 0);
          this.error = true;
        } else {
          return response.data.CSVData;
        }
      } catch (err) {
        this.setDialogMessage(1, ``, `CSVの読み込みに失敗しました。`, 0);
        this.error = true;
        console.error('★error', err);
      }
    },
    async formatCsvData(date) {
      const csvdata = await this.readCSV(date);
      for (const day of this.getDates) {
        const target = csvdata.find((d) => d.date === day);
        if (target) {
          target.rest = JSON.parse(target.rest);
          target.rest = Object.values(target.rest).map((r) => {
            const StartEnd = r.split('|');
            return {
              start: moment(StartEnd[0]).format(this.formatTime),
              end: moment(StartEnd[1]).format(this.formatTime),
            };
          });
          target.start = moment(target.start).format(this.formatTime);
          target.end = moment(target.end).format(this.formatTime);
          target.datestr = moment(target.date).format(this.formatDispDate);
          this.tableDatas.push(target);
        } else {
          this.tableDatas.push({
            alltime: '0',
            date: day,
            datestr: moment(day).format(this.formatDispDate),
            end: '',
            rest: [],
            start: '',
          });
        }
      }
      console.log('csvData / tableData', csvdata, this.tableDatas);
    },
    async getMonthData(monthStartTime) {
      const countmonth = moment(monthStartTime).daysInMonth(); // 月の日数を取得
      for (let i = 0; i < countmonth; i++) {
        const oneday = moment(monthStartTime)
          .add(i, 'days')
          .format(this.formatStrDate);
        this.getDates.push(oneday);
      }
      // csvデータの読み込み
      const readcsvdate = moment(monthStartTime).format(this.formatReadCSVDate);
      await this.formatCsvData(readcsvdate);
    },
  },
};
