/**
 * # 阿里云／对象存储OSS／上传文件api：https://help.aliyun.com/document_detail/31886.html?spm=a2c4g.11186623.6.564.51126ab3Ldv0Iy
 *
 *  # oss和cdn区别：
 * oss类似于网盘，但是你可以拿到文件直链。可以作为web应用的： 附件服务器、图片服务器；
 * cdn内容分发，解决机房节点不好访问速度慢的问题。
 * 
 * ＃ 上传文件途径：
 * 1.通过OSS控制台上传小于5GB的文件。
 * 2.通过SDK或API使用Multipart Upload方法上传大于5GB的文件。
 * 3.通过图形化的管理工具ossbrowser上传文件。
 * 
 * ＃JavaScript客户端签名直传
 * https://help.aliyun.com/document_detail/31925.html?spm=a2c4g.11186623.2.10.54fd62125SG1fz#concept-frd-4gy-5db
 * 把AccesssKeyID 和AccessKeySecret写在代码里面有泄露的风险，建议采用服务端签名后直传。
 * 
 * #服务端签名后直传
 * https://help.aliyun.com/document_detail/31926.html?spm=a2c4g.11186623.6.643.6a2f2f08UsBc2F
 */
