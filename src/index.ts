import { IApi } from '@umijs/types';
import { NVC_Option } from './config';

interface CaptchaParam {
  guideUrl?: string;
  smartCaptchaUrl?: string;
  quizCaptchaUrl?: string;
  include?: string;
}

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
          include: joi.string(),
        });
      },
    },
  });

  const { captcha = {}, qiankun } = api.userConfig;
  const {
    guideUrl = '//g.alicdn.com/sd/nvc/1.1.112/guide.js',
    smartCaptchaUrl = '//g.alicdn.com/sd/smartCaptcha/0.0.4/index.js',
    quizCaptchaUrl = '//g.alicdn.com/sd/quizCaptcha/0.0.1/index.js',
    include = /^(\/user\/login)/,
  } = captcha;

  //乾坤的子项目不生效
  if (qiankun && qiankun.slave) {
    api.logger.info('检测到该项目是qiankun的子项目，smart-captcha插件不生效');
  } else {
    api.addHTMLHeadScripts(() => {
      return [
        {
          content: `
            if(${include}.test(window.location.pathname)){
              console.log(123);
              function addScript(url, parent = window.document.body) {
                let script = window.document.createElement('script');
                script.src = url;
                parent.appendChild(script);
              }
              window.addScript = addScript;
              addScript("${smartCaptchaUrl}", window.document.head);
              addScript("${quizCaptchaUrl}", window.document.head);
            }
          `,
        },
      ];
    });

    api.addHTMLScripts(() => {
      return [
        {
          content: `
          if(${include}.test(window.location.pathname)){
            window.NVC_Opt = ${JSON.stringify(NVC_Option)};
            window.addScript("${guideUrl}");
          }
          `,
        },
      ];
    });
  }
}

export { default as SmartCaptcha } from './smart-captcha';
