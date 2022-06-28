/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import * as CryptoJS from "crypto-js";
import { CryptoJSConfig } from 'src/config/crypto.config';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class CommService {
	constructor(private readonly mailerService: MailerService) {}
	// 获取指定当前格式的时间
    static currentTime(format: string = 'YYYY-MM-DD HH:mm:ss') {
        return moment(new Date()).format(format)
    }
    // 加密
    static cryptoEncrypt(data: string) {
        var srcs = CryptoJS.enc.Utf8.parse(data);
		var encrypted = CryptoJS.AES.encrypt(srcs, CryptoJSConfig.key, {
			iv: CryptoJSConfig.iv,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.ZeroPadding
		});
		return encrypted.toString();
    }
    // 解密
	static decrypt(encrypted) { 
		var decrypted = CryptoJS.AES.decrypt(encrypted, CryptoJSConfig.key, {
			iv: CryptoJSConfig.iv,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.ZeroPadding
		});
		return decrypted.toString(CryptoJS.enc.Utf8);
    }
	// 发送邮件
	example(mailOption: ISendMailOptions): void {
		this
		  .mailerService
		  .sendMail(mailOption)
		  .then((res) => {
			console.log('res:',res)
		  })
		  .catch((err) => {
			console.log('err', err)
		});
	}
}
