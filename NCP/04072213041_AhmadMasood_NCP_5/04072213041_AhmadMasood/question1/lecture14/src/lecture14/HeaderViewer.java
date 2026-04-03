package lecture14;

import java.io.IOException;
import java.net.*;
import java.util.Date;

public class HeaderViewer {
    public static void main(String[] args) {
        String urlStr = (args.length > 0) ? args[0] : "https://www.qau.edu.pk/";

        try {
            URL u = new URL(urlStr);
            URLConnection uc = u.openConnection();

            System.out.println("Content-type: " + uc.getContentType());

            if (uc.getContentEncoding() != null) {
                System.out.println("Content-encoding: " + uc.getContentEncoding());
            }
            if (uc.getDate() != 0) {
                System.out.println("Date: " + new Date(uc.getDate()));
            }
            if (uc.getLastModified() != 0) {
                System.out.println("Last modified: " + new Date(uc.getLastModified()));
            }
            if (uc.getExpiration() != 0) {
                System.out.println("Expiration date: " + new Date(uc.getExpiration()));
            }
            if (uc.getContentLength() != -1) {
                System.out.println("Content-length: " + uc.getContentLength());
            }

            System.out.println();
        } catch (MalformedURLException ex) {
            System.err.println(ex);
        } catch (IOException ex) {
            System.err.println(ex);
        }
    }
}
