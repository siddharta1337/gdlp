package com.goodloop.dealfinder;

import android.os.Bundle;
import android.app.Activity;
import android.content.Intent;
import android.content.res.Resources;
import android.view.Menu;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.TextView;

public class NavigatorList extends Activity {
	String[] mPies;
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		//setContentView(R.layout.activity_c);
		
		 ;
		
		/*
		Intent intent = getIntent();
		Bundle bundle = intent.getBundleExtra("greetingBundle");
		String greeting = bundle.getString("greeting");
		String message = intent.getStringExtra("message");
		Boolean showAll = intent.getBooleanExtra("showAll", false);
		*/
		 
		
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.activity, menu);
		return true;
	}

}
