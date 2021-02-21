<?php

namespace App\Providers;

use Godruoyi\Snowflake\Snowflake;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton('snowflake', function () {
            return (new Snowflake())
                ->setStartTimeStamp(strtotime('2019-08-08') * 1000)
                ->setSequenceResolver(
                    function ($currentTime) {
                        static $lastTime;
                        static $sequence;
                        if ($lastTime == $currentTime) {
                            ++$sequence;
                        } else {
                            $sequence = 0;
                        }
                        $lastTime = $currentTime;
                        return $sequence;
                    });
        });
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
