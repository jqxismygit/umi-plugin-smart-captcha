import React from 'react';
import styles from './index.css';
import { SmartCaptcha } from '../../lib/index';
export default () => (
  <div className={styles.normal}>
    Hello Umi!
    <SmartCaptcha
      onSuccess={data => {
        console.log('data = ', data);
      }}
    />
  </div>
);
