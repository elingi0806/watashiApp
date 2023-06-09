export default {
  name: 'AppDialogComponent',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    // バツボタン表示切り替え
    showcrossicon: {
      type: Boolean,
      default: false,
    },
    // ダイアログタイトル
    title: {
      type: String,
      default: '',
    },
    // ボタンの数
    buttonCount: {
      type: Number,
      default: 1,
    },
    width: {
      type: Number,
      default: 0,
    },
    // OKボタンのテキスト
    okText: {
      type: String,
      default: 'OK',
    },
    // CANCELボタンのテキスト
    cancelText: {
      type: String,
      default: 'CANCEL',
    },
    // 3つめのボタンのテキスト
    customText: {
      type: String,
      default: 'CUSTOM',
    },
    // OKボタンをdisabledにするか
    disabledOK: {
      type: Boolean,
      default: false,
    },
    // 3つめのボタンをdisabledにするか
    disabledCustom: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  computed: {},
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    clickOk() {
      this.$emit('clickOk');
    },
    clickCancel() {
      this.$emit('clickCancel');
    },
    clickCustom() {
      this.$emit('clickCustom');
    },
    clickBatu() {
      this.$emit('clickBatu');
    },
  },
};
