package com.example.phonegapmap;

import android.app.Activity;
import android.os.Bundle;
import org.apache.cordova.*;

public class MyActivity extends DroidGap
{
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
//        setContentView(R.layout.main);
        super.loadUrl(Config.getStartUrl());
    }
}
