import { mdiMenu, mdiArrowLeftThick, mdiHome, mdiChartArc } from '@mdi/js';
import { useMystore } from '../../stores/mainStore.js';
const mystore = useMystore();

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
      menutitle: '',
    };
  },
  computed: {
    //
  },
  mounted() {
    if (typeof mystore.selected_menu_id !== 'undefined') {
      this.selectedMenu = mystore.selected_menu_id;
      this.setMenuTitle();
    }
  },
  watch: {
    /**
     * タイトル文字列のアニメーション
     */
    selectedMenu(newVal) {
      mystore.set_selected_menu_id(newVal);

      // メニュータイトルを変数に代入
      this.setMenuTitle();

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
    //
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
    setMenuTitle() {
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
      this.menutitle = title;
    },
  },
};
