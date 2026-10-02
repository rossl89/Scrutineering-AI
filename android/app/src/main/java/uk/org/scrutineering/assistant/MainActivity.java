package uk.org.scrutineering.assistant;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import java.io.IOException;

public class MainActivity extends Activity {
    private static final String APP_HOST = "appassets.androidplatform.net";
    private static final String ASSET_PREFIX = "/assets/www/";
    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        webView = new WebView(this);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if (APP_HOST.equals(uri.getHost())) return false;
                startActivity(new Intent(Intent.ACTION_VIEW, uri));
                return true;
            }

            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                String path = uri.getPath();
                if (!APP_HOST.equals(uri.getHost()) || path == null || !path.startsWith(ASSET_PREFIX)) return null;

                String assetPath = path.substring("/assets/".length());
                if (assetPath.endsWith("/")) assetPath += "index.html";
                if (assetPath.contains("..")) return null;
                try {
                    return new WebResourceResponse(mimeType(assetPath), "UTF-8", getAssets().open(assetPath));
                } catch (IOException ignored) {
                    return null;
                }
            }
        });

        setContentView(webView);
        webView.loadUrl("https://" + APP_HOST + ASSET_PREFIX + "index.html");
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) webView.goBack();
        else super.onBackPressed();
    }

    @Override
    protected void onDestroy() {
        webView.destroy();
        super.onDestroy();
    }

    private static String mimeType(String path) {
        if (path.endsWith(".html")) return "text/html";
        if (path.endsWith(".js")) return "text/javascript";
        if (path.endsWith(".css")) return "text/css";
        if (path.endsWith(".svg")) return "image/svg+xml";
        if (path.endsWith(".webmanifest") || path.endsWith(".json")) return "application/json";
        return "application/octet-stream";
    }
}
