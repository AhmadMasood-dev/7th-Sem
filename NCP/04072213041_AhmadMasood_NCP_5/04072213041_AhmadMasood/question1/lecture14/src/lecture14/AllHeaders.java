package lecture14;

import java.io.IOException;
import java.net.*;

public class AllHeaders {
    public static void main(String[] args) {
        String urlStr = (args.length > 0) ? args[0] : "https://www.qau.edu.pk/";

        try {
            URL u = new URL(urlStr);
            URLConnection uc = u.openConnection();

            for (int j = 1; ; j++) {
                String header = uc.getHeaderField(j);
                if (header == null) break;

                String key = uc.getHeaderFieldKey(j);
                System.out.println((key == null ? "" : key) + ": " + header);
            }

            System.out.println();
        } catch (MalformedURLException ex) {
            System.err.println(ex);
        } catch (IOException ex) {
            System.err.println(ex);
        }
    }
}
