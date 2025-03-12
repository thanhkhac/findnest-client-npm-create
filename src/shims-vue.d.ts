//Cái này để fix lỗi khi import file .vue khi import js vào ts

declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
