import { mdiMenu, mdiArrowLeftThick, mdiHome, mdiChartArc } from '@mdi/js';
export default {
  name: 'AppMenuComponent',
  data() {
    return {
      mdiMenu,
      mdiArrowLeftThick,
      drawer: false,
      selectedMenu: 0,
      menus: [
        {
          id: 0,
          link: '/',
          icon: mdiHome,
          title: 'HOME',
        },
        {
          id: 1,
          link: '/work-ctr',
          icon: mdiChartArc,
          title: 'WORK TIME',
        },
      ],
    };
  },
  computed: {
    /*
    storeSelectedMenu: {
      get() {
        return this.$store.state.selected_menu_id
      },
      set(id) {
        this.$store.commit('set_selected_menu_id', id)
      },
    },
    */
  },
  mounted() {
    // this.selectedMenu = this.storeSelectedMenu
  },
  watch: {
    /**
     * タイトル文字列のアニメーション
     */
    selectedMenu(newVal) {
      // this.storeSelectedMenu = newVal

      // タイトル文字列のアニメーションを開始
      const titleID = document.getElementById('title');
      function removeClass() {
        titleID.classList.remove('animation');
      }
      titleID.classList.add('animation');
      setTimeout(removeClass, 100);
    },
  },
  computed: {
    /**
     * メニュータイトル文字列
     */
    menutitle() {
      let tmptitle = this.menus.find((m) => m.id === this.selectedMenu);
      if (!tmptitle) {
        tmptitle = { title: 'Not Found' };
      }
      let title = '';
      for (const char of tmptitle.title) {
        // 半角スペースなら空白文字を入れる
        if (char === ' ') {
          title += `&nbsp;`;
        } else {
          title += `<span>${char}</span>`;
        }
      }
      return title;
    },
  },
  methods: {
    openMenu() {
      this.drawer = true;
    },
    closeMenu() {
      this.drawer = false;
    },
    selectMenu(menuID) {
      this.selectedMenu = menuID;
    },
  },
};
