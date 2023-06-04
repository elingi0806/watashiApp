<template>
  <v-app>
    <appMenu />
    <v-main>
      <NuxtLink> </NuxtLink>
      <slot />
    </v-main>
    <!--フッター-->
    <v-footer
      class="pa-1"
      style="
        flex: none;
        background-image: linear-gradient(
          90deg,
          rgba(83, 218, 222, 1),
          rgba(47, 110, 212, 1) 31%,
          rgba(254, 158, 226, 1) 71%,
          rgba(234, 114, 0, 1)
        );
      "
    >
      <v-row justify="center" no-gutters>
        <v-col class="text-center" cols="12">
          {{ new Date().getFullYear() }} — <strong>watashiApp</strong>
          <v-btn
            @click="dialog = true"
            color="primary"
            flat
            rounded="xl"
            style="margin-left: 10px; height: 30px"
          >
            About me
          </v-btn>
        </v-col>
      </v-row>
    </v-footer>
    <!--about me-->
    <appDialog
      v-model="dialog"
      title="About me"
      message="お知らせ"
      :buttonCount="1"
      okText="閉じる"
      @clickOk="dialog = false"
    >
      <div>
        内藤 春が作成したデスクトップアプリです。<br />
        個人学習用のため頒布はしません。<br /><br />
        【関連サイト】
        <ul>
          <li>ICON8：<a href="https://icons8.com">https://icons8.com</a></li>
        </ul>
      </div>
    </appDialog>
  </v-app>
</template>

<script>
import appMenu from '@/components/appMenu';
import appDialog from '@/components/appDialog/index.vue';
import '@/assets/common.scss';

export default {
  name: 'DefaultLayout',
  components: { appMenu, appDialog },
  data() {
    return {
      dialog: false,
    };
  },
};
</script>

<style>
* {
  font-family: 'Sen', sans-serif;
}
</style>
