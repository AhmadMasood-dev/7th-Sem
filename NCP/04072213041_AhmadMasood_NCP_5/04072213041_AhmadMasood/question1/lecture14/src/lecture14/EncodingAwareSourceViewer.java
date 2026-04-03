package lecture14;

import java.io.*;
import java.net.*;

public class EncodingAwareSourceViewer {

    private static String extractCharset(String contentType) {
        // Example content-type: text/html; charset=UTF-8
        if (contentType == null) return null;

        String lower = contentType.toLowerCase();
        int idx = lower.indexOf("charset=");
        if (idx == -1) return null;

        String charset = contentType.substring(idx + 8).trim();
        // remove anything after ; (rare but possible)
        int semi = charset.indexOf(';');
        if (semi != -1) charset = charset.substring(0, semi).trim();
        // remove quotes if any
        charset = charset.replace("\"", "").trim();
        return charset.isEmpty() ? null : charset;
    }

    public static void main(String[] args) {
        String urlStr = (args.length > 0) ? args[0] : "https://www.google.com";

        try {
            URL u = new URL(urlStr);
            URLConnection uc = u.openConnection();

            String encoding = "ISO-8859-1";
            String contentType = uc.getContentType();
            String serverCharset = extractCharset(contentType);
            if (serverCharset != null) encoding = serverCharset;

            try (InputStream in = new BufferedInputStream(uc.getInputStream());
                 Reader r = new InputStreamReader(in, encoding)) {

                int c;
                while ((c = r.read()) != -1) {
                    System.out.print((char) c);
                }
            }

        } catch (MalformedURLException ex) {
            System.err.println(urlStr + " is not a parseable URL");
        } catch (UnsupportedEncodingException ex) {
            System.err.println("Server sent an encoding Java does not support: " + ex.getMessage());
        } catch (IOException ex) {
            System.err.println(ex);
        }
    }
}
