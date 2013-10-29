package com.goodloop.dealfinder;

import android.os.Bundle;
import android.app.Activity;
import android.content.Intent;
import android.view.Menu;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;

public class ActivityB extends Activity {

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_b);
		
		Button b =  (Button)findViewById(R.id.button_currentDeals);
		b.setOnClickListener(new OnClickListener() {
			public void onClick(View v) {
					Intent intent = new Intent(ActivityB.this, NavigatorList.class);
					intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP );
					Bundle b = new Bundle();
					b.putString("greeting", "HOLA");
					intent.putExtra("greetingBundle", b);
					intent.putExtra("message", "World!");
					intent.putExtra("ShowAll", true);
					intent.putExtra("numItems", 5);
					
					startActivity(intent);
			}
		});
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.activity, menu);
		return true;
	}

}
