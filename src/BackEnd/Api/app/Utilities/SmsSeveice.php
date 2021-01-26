<?php
namespace App\Utilities;

use AlibabaCloud\Client\AlibabaCloud;
use AlibabaCloud\Client\Exception\ClientException;
use AlibabaCloud\Client\Exception\ServerException;

class SmsSeveice
{
    private $accessKeyId;
    private $accessKeySecret;
    public function __construct()
    {
        $this->accessKeyId = env("OSSAccessKey");
        $this->accessKeySecret = env("OSSAccessKeySecret");
        AlibabaCloud::accessKeyClient($this->accessKeyId, $this->accessKeySecret)
            ->regionId('cn-hangzhou')
            ->asDefaultClient();
    }

    public function SendMsg($msg, $phone, $tempcode)
    {
        try {
            $result = AlibabaCloud::rpc()
                ->product('Dysmsapi')
            // ->scheme('https') // https | http
                ->version('2017-05-25')
                ->action('SendSms')
                ->method('POST')
                ->host('dysmsapi.aliyuncs.com')
                ->options([
                    'query' => [
                        'RegionId' => "cn-hangzhou",
                        'PhoneNumbers' => $phone,
                        'SignName' => "i觅宠",
                        'TemplateCode' => $tempcode,
                        'TemplateParam' => $msg,
                    ],
                ])
                ->request();
            return $result->toArray();
        } catch (ClientException $e) {
            return $e->getErrorMessage() . PHP_EOL;
        } catch (ServerException $e) {
            return $e->getErrorMessage() . PHP_EOL;
        }
    }

}
