import {
  mdiMenu,
  mdiBriefcase,
  mdiArrowLeftThick,
  mdiAws,
  mdiHistory,
  mdiChartArc,
  mdiHandCoin,
  mdiAppleKeyboardControl,
} from '@mdi/js'
import { useMystore } from '../../stores/mainStore.js'
const mystore = useMystore()

export default {
  name: 'AppMenuComponent',
  data() {
    return {
      mdiMenu,
      mdiArrowLeftThick,
      mdiAppleKeyboardControl,
      drawer: false,
      selectedMenu: 1,
      menus: [
        {
          id: 1,
          icon: mdiBriefcase,
          title: '業務管理',
          link: '/',
          group: true,
          childs: [
            {
              id: 11,
              link: '/work-history',
              icon: mdiHistory,
              title: '業務記録',
            },
          ],
        },
        {
          id: 2,
          icon: mdiAws,
          title: 'AWSの設定',
          link: '/aws-setting',
          group: true,
          childs: [
            {
              id: 21,
              link: '/aws-cost-set',
              icon: mdiHandCoin,
              title: 'コスト情報の保存',
            },
          ],
        },
      ],
      menutitle: '',
      allmenus: [],
    }
  },
  computed: {
    //
  },
  mounted() {
    this.menus.forEach((m) => {
      this.allmenus.push(m)
      if (m.group && m.childs && m.childs.length > 0) {
        m.childs.forEach((subm) => {
          this.allmenus.push(subm)
        })
      }
    })
    if (typeof mystore.selected_menu_id !== 'undefined') {
      this.selectedMenu = mystore.selected_menu_id
      this.setMenuTitle()
    }
  },
  watch: {
    /**
     * タイトル文字列のアニメーション
     */
    selectedMenu(newVal) {
      mystore.set_selected_menu_id(newVal)

      // メニュータイトルを変数に代入
      this.setMenuTitle()

      // タイトル文字列のアニメーションを開始
      const titleID = document.getElementById('title')
      function removeClass() {
        titleID.classList.remove('animation')
      }
      titleID.classList.add('animation')
      setTimeout(removeClass, 100)
    },
  },
  computed: {
    //
  },
  methods: {
    openMenu() {
      this.drawer = true
    },
    closeMenu() {
      this.drawer = false
    },
    selectMenu(menuID) {
      this.selectedMenu = menuID
    },
    setMenuTitle() {
      let tmptitle = this.allmenus.find((m) => m.id === this.selectedMenu)
      if (!tmptitle) {
        tmptitle = { title: 'Not Found' }
      }
      let title = ''
      for (const char of tmptitle.title) {
        // 半角スペースなら空白文字を入れる
        if (char === ' ') {
          title += `&nbsp;`
        } else {
          title += `<span>${char}</span>`
        }
      }
      this.menutitle = title
    },
  },
}
