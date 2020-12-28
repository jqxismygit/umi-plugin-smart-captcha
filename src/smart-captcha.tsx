import React from 'react';
import { NVC_Option } from './config';

declare const smartCaptcha: any;
declare const NVC_Opt: any;

interface SmartCaptchaSuccessData {
  token?: string;
  sessionId?: string;
  sig?: string;
  appKey?: string;
  scene?: string;
}

interface SmartCaptchaProps {
  className?: string;
  style?: React.CSSProperties;
  elementId?: string;
  width?: number;
  height?: number;
  onSuccess?: (data: SmartCaptchaSuccessData) => void;
  onFailed?: () => void;
}

const SmartCaptcha: React.FC<SmartCaptchaProps> = props => {
  const {
    className,
    style,
    elementId = 'smart-captcha',
    width = 300,
    height = 42,
    onSuccess,
    onFailed,
  } = props;

  React.useEffect(() => {
    if (typeof smartCaptcha !== 'undefined') {
      const ic = new smartCaptcha({
        //声明智能验证需要渲染的目标元素ID。
        renderTo: `#${elementId}`,
        //智能验证组件的宽度。
        width: width,
        //智能验证组件的高度。
        height: height,
        //智能验证组件初始状态文案。
        default_txt: '点击按钮开始智能验证',
        //智能验证组件验证通过状态文案。
        success_txt: '验证成功',
        //智能验证组件验证失败（拦截）状态文案。
        fail_txt: '验证失败，请在此点击按钮刷新',
        //智能验证组件验证中状态文案。
        scaning_txt: '智能检测中',
        //前端智能验证通过时会触发该回调参数。您可以在该回调参数中将请求标识（token）、会话ID（sessionid）、签名串（sig）字段记录下来，随业务请求一同发送至您的服务端调用验签。
        success: function(data: any) {
          onSuccess?.({
            token: NVC_Opt.token,
            sessionId: data.sessionId,
            sig: data.sig,
            appKey: NVC_Option.appkey,
            scene: NVC_Option.scene,
          });
        },
        fail: function() {
          ic?.reset();
          onFailed?.();
        },
        error: function() {
          ic?.reset();
          onFailed?.();
        },
      });
      ic.init();
    } else {
      throw new Error('请安装umi-plugin-smart-captcha');
    }
  }, []);
  return <div className={className} style={style} id={elementId} />;
};

export default SmartCaptcha;
