package lecture14;

import java.io.*;
import java.net.*;

public class SourceViewer4 {
    public static void main(String[] args) {
        String urlStr = (args.length > 0) ? args[0] : "http://www.qau.edu.pk";

        try {
            URL u = new URL(urlStr);
            HttpURLConnection uc = (HttpURLConnection) u.openConnection();

            uc.setInstanceFollowRedirects(false);

            try (InputStream raw = uc.getInputStream()) {
                InputStream buffer = new BufferedInputStream(raw);
                Reader reader = new InputStreamReader(buffer);

                int c;
                while ((c = reader.read()) != -1) {
                    System.out.print((char) c);
                }
            }

        } catch (MalformedURLException ex) {
            System.err.println(urlStr + " is not a parseable URL");
        } catch (IOException ex) {
            System.err.println(ex);
        }
    }
}
