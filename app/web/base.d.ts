export {};
import __render_html from 'web-utils/components/RenderHTML';
import __html_head from 'web-utils/components/HtmlHead';
import __hello_world from 'web-utils/components/HelloWorld';
import __loading from 'web.crud/src/legacy/Loading';
import __admin from 'web.crud/src/CRUD';
import __qform from 'web.crud/src/form/BaseForm';
import __qlist from 'web.crud/src/list/QBaseList';
import __w_sidebar from './src/components/w-sidebar';
import __w_topbar from './src/components/w-topbar';
import __inp_text from './src/components/inp-text';
import __btn from './src/components/btn';
import __m_page from '../../pkgs/web/mobile/src/m-page';
import __m_badge from '../../pkgs/web/mobile/src/m-badge';
import __m_button from '../../pkgs/web/mobile/src/m-button';
import __m_fab_backdrop from '../../pkgs/web/mobile/src/m-fab-backdrop';
import __m_fab_button from '../../pkgs/web/mobile/src/m-fab-button';
import __m_fab_buttons from '../../pkgs/web/mobile/src/m-fab-buttons';
import __m_fab from '../../pkgs/web/mobile/src/m-fab';
import __m_input from '../../pkgs/web/mobile/src/m-input';
import __m_link from '../../pkgs/web/mobile/src/m-link';
import __m_list_group from '../../pkgs/web/mobile/src/m-list-group';
import __m_list_item from '../../pkgs/web/mobile/src/m-list-item';
import __m_list_input from '../../pkgs/web/mobile/src/m-list-input';
import __m_list from '../../pkgs/web/mobile/src/m-list';
import __m_nav_left from '../../pkgs/web/mobile/src/m-nav-left';
import __m_nav_right from '../../pkgs/web/mobile/src/m-nav-right';
import __m_nav_title from '../../pkgs/web/mobile/src/m-nav-title';
import __m_navbar from '../../pkgs/web/mobile/src/m-navbar';
import __m_segmented from '../../pkgs/web/mobile/src/m-segmented';
import __m_tab from '../../pkgs/web/mobile/src/m-tab';
import __m_tabs from '../../pkgs/web/mobile/src/m-tabs';
import __m_toolbar from '../../pkgs/web/mobile/src/m-toolbar';
import __m_checkbox from '../../pkgs/web/mobile/src/m-checkbox';
import __m_popup from '../../pkgs/web/mobile/src/m-popup';
import __m_radio from '../../pkgs/web/mobile/src/m-radio';
import __m_range from '../../pkgs/web/mobile/src/m-range';
import __m_searchbar from '../../pkgs/web/mobile/src/m-searchbar';
import __m_sheet from '../../pkgs/web/mobile/src/m-sheet';
import __m_stepper from '../../pkgs/web/mobile/src/m-stepper';
import __m_toggle from '../../pkgs/web/mobile/src/m-toggle';
import __m_card from '../../pkgs/web/mobile/src/m-card';
import __m_cardcontent from '../../pkgs/web/mobile/src/m-cardcontent';
import __m_cardfooter from '../../pkgs/web/mobile/src/m-cardfooter';
import __m_cardheader from '../../pkgs/web/mobile/src/m-cardheader';
import __m_app_bar from '../../pkgs/web/mobile/src/m-app-bar';
import __m_panel from '../../pkgs/web/mobile/src/m-panel';
import __m_swiper from '../../pkgs/web/mobile/src/m-swiper';
import __m_swiper_slide from '../../pkgs/web/mobile/src/m-swiper-slide';
import * as __glb from './src/global';
import * as __emotion_react from '@emotion/react';
import * as __utils_api from 'web-utils/src/api';
import { ReactElement } from 'react';
type ExtractProps<T extends (args?: any) => any> = Parameters<T>[0] extends undefined ? {} : Parameters<T>[0];
declare global {
  const css: typeof __emotion_react.css;
  const api: typeof __utils_api.api;
  const db: typeof __db.db;
  function base<T extends Record<string, any>>(effect: {
    meta: T;
    init?: (args: {
      meta: T & {
        render: () => void;
      };
      children?: any;
    }) => void | Promise<void>;
  }, content: (args: {
    meta: T & {
      render: () => void;
    };
    children?: any;
  }) => ReactElement): void;
  function runInAction(func: () => void): void;
  function action<T>(func: T): T;
  namespace JSX {
    interface IntrinsicElements {
      effect: any;
      "render-html": ExtractProps<typeof __render_html>;
      "html-head": ExtractProps<typeof __html_head>;
      "hello-world": ExtractProps<typeof __hello_world>;
      "loading": ExtractProps<typeof __loading>;
      "admin": ExtractProps<typeof __admin>;
      "qform": ExtractProps<typeof __qform>;
      "qlist": ExtractProps<typeof __qlist>;
      "w-sidebar": ExtractProps<typeof __w_sidebar>;
      "w-topbar": ExtractProps<typeof __w_topbar>;
      "inp-text": ExtractProps<typeof __inp_text>;
      "btn": ExtractProps<typeof __btn>;
      "pure-tab": ExtractProps<typeof __pure_tab>;
      "m-page": ExtractProps<typeof __m_page>;
      "m-badge": ExtractProps<typeof __m_badge>;
      "m-button": ExtractProps<typeof __m_button>;
      "m-fab-backdrop": ExtractProps<typeof __m_fab_backdrop>;
      "m-fab-button": ExtractProps<typeof __m_fab_button>;
      "m-fab-buttons": ExtractProps<typeof __m_fab_buttons>;
      "m-fab": ExtractProps<typeof __m_fab>;
      "m-input": ExtractProps<typeof __m_input>;
      "m-link": ExtractProps<typeof __m_link>;
      "m-list-group": ExtractProps<typeof __m_list_group>;
      "m-list-item": ExtractProps<typeof __m_list_item>;
      "m-list-input": ExtractProps<typeof __m_list_input>;
      "m-list": ExtractProps<typeof __m_list>;
      "m-nav-left": ExtractProps<typeof __m_nav_left>;
      "m-nav-right": ExtractProps<typeof __m_nav_right>;
      "m-nav-title": ExtractProps<typeof __m_nav_title>;
      "m-navbar": ExtractProps<typeof __m_navbar>;
      "m-segmented": ExtractProps<typeof __m_segmented>;
      "m-tab": ExtractProps<typeof __m_tab>;
      "m-tabs": ExtractProps<typeof __m_tabs>;
      "m-toolbar": ExtractProps<typeof __m_toolbar>;
      "m-checkbox": ExtractProps<typeof __m_checkbox>;
      "m-popup": ExtractProps<typeof __m_popup>;
      "m-radio": ExtractProps<typeof __m_radio>;
      "m-range": ExtractProps<typeof __m_range>;
      "m-searchbar": ExtractProps<typeof __m_searchbar>;
      "m-sheet": ExtractProps<typeof __m_sheet>;
      "m-stepper": ExtractProps<typeof __m_stepper>;
      "m-toggle": ExtractProps<typeof __m_toggle>;
      "m-card": ExtractProps<typeof __m_card>;
      "m-cardcontent": ExtractProps<typeof __m_cardcontent>;
      "m-cardfooter": ExtractProps<typeof __m_cardfooter>;
      "m-cardheader": ExtractProps<typeof __m_cardheader>;
      "m-app-bar": ExtractProps<typeof __m_app_bar>;
      "m-panel": ExtractProps<typeof __m_panel>;
      "m-swiper": ExtractProps<typeof __m_swiper>;
      "m-swiper-slide": ExtractProps<typeof __m_swiper_slide>;
    }
  }
  namespace React {
    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
      class?: string | null | number | boolean;
    }
  }
}