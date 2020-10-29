import { IApi } from '@umijs/types';
import { NVC_Option } from './config';

interface CaptchaParam {
  guideUrl?: string;
  smartCaptchaUrl?: string;
  quizCaptchaUrl?: string;
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
        });
      },
    },
  });

  const { captcha = {} } = api.userConfig;
  const {
    guideUrl = '//g.alicdn.com/sd/nvc/1.1.112/guide.js',
    smartCaptchaUrl = '//g.alicdn.com/sd/smartCaptcha/0.0.4/index.js',
    quizCaptchaUrl = '//g.alicdn.com/sd/quizCaptcha/0.0.1/index.js',
  } = captcha;
  console.log('captcha = ', captcha);

  api.addHTMLHeadScripts(() => {
    return [
      {
        src: smartCaptchaUrl,
      },
      {
        src: quizCaptchaUrl,
      },
    ];
  });

  api.addHTMLScripts(() => {
    return [
      {
        content: `window.NVC_Opt = ${JSON.stringify(NVC_Option)}`,
      },
      {
        src: guideUrl,
      },
    ];
  });
}

export { default as SmartCaptcha } from './smart-captcha';
