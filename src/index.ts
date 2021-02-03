import { IApi } from '@umijs/types';
import { NVC_Option } from './config';
import { utils } from 'umi';
import { join } from 'path';
interface CaptchaParam {
  guideUrl?: string;
  smartCaptchaUrl?: string;
  quizCaptchaUrl?: string;
  include?: string;
}

const DIR_NAME = 'plugin-smart-captcha';

//暂时不提供多余的参数配置入口吧，需要的时候直接改这个组件，以后如果有需求再变更吧
export default function(api: IApi) {
  api.logger.info('use smart-captcha plugin');

  api.describe({
    key: 'captcha',
    config: {
      //貌似没有卵用
      // default: {
      //   guideUrl: '//g.alicdn.com/sd/nvc/1.1.112/guide.js',
      //   smartCaptchaUrl: '//g.alicdn.com/sd/smartCaptcha/0.0.4/index.js',
      //   quizCaptchaUrl: '//g.alicdn.com/sd/quizCaptcha/0.0.1/index.js',
      // },
      schema(joi) {
        return joi.object({
          guideUrl: joi.string(),
          smartCaptchaUrl: joi.string(),
          quizCaptchaUrl: joi.string(),
        });
      },
    },
  });

  const { captcha = {}, qiankun } = api.userConfig;
  const {
    guideUrl = '//g.alicdn.com/sd/nvc/1.1.112/guide.js',
    smartCaptchaUrl = '//g.alicdn.com/sd/smartCaptcha/0.0.4/index.js',
    quizCaptchaUrl = '//g.alicdn.com/sd/quizCaptcha/0.0.1/index.js',
  } = captcha;

  if (qiankun && qiankun.slave) {
  } else {
  }

  const windowContext =
    qiankun && qiankun.slave ? 'window.globalThis' : 'window';

  api.onGenerateFiles(() => {
    api.writeTmpFile({
      path: join(DIR_NAME, 'index.tsx'),
      content: `
        import React from 'react';
        const loadScript = (url: string, win: any = window) => {
          return new Promise((resolve, reject) => {
            let script = win.document.createElement('script');
            script.async = true;
            script.src = url;
            script.onload = function() {
              resolve();
            };
            script.onerror = function() {
              // eslint-disable-next-line
              reject();
            };
            win.document.head.appendChild(script);
          });
        };
        export default (props) => {
          const {children} = props;
          const [loaded, setLoaded] = React.useState(false);
          React.useEffect(()=>{
            async function init(){
              if(!${windowContext}.NVC_Opt){
                await Promise.all([
                  loadScript("${smartCaptchaUrl}", ${windowContext}),
                  loadScript("${quizCaptchaUrl}", ${windowContext}),
                ]);
                ${windowContext}.NVC_Opt = ${JSON.stringify(NVC_Option)};
                await loadScript("${guideUrl}", ${windowContext});
              }
              setLoaded(true);
            }
            init();
          }, [])
          return (
            <>
              {loaded && children}
            </>
          );
        };
      `,
    });
  });

  api.modifyRoutes(routes => {
    return [
      {
        path: '/',
        component: utils.winPath(
          join(api.paths.absTmpPath || '', DIR_NAME, 'index.tsx'),
        ),
        routes,
      },
    ];
  });
}

export { default as SmartCaptcha } from './smart-captcha';
