import { GChart } from 'vue-google-charts';

export default {
  name: 'AppGraphComponent',
  components: {
    GChart,
  },
  props: {
    chartType: {
      type: String,
      default: '',
    },
    chartData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    chartOptions: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
};
