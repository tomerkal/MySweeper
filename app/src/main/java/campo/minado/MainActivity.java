package campo.minado;

import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.webkit.WebView;

public class MainActivity extends Activity {
	@Override protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		WebView gameView;
		gameView=new WebView(this);
		gameView.getSettings().setJavaScriptEnabled(true);
		gameView.getSettings().setDomStorageEnabled(true);
		gameView.loadUrl("file:///android_res/raw/index.htm");
		setContentView(gameView);
	}
}
