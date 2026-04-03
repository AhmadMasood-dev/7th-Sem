package lecture14;

import java.io.*;
import java.net.*;

public class BinarySaver {

    public static void main(String[] args) {
        String urlStr = (args.length > 0)
                ? args[0]
                : "https://www.qau.edu.pk/wp-content/uploads/2015/02/libqau.jpg";

        try {
            URL root = new URL(urlStr);
            saveBinaryFile(root);
        } catch (MalformedURLException ex) {
            System.err.println(urlStr + " is not a URL I understand.");
        } catch (IOException ex) {
            System.err.println(ex);
        }
    }

    public static void saveBinaryFile(URL u) throws IOException {
        URLConnection uc = u.openConnection();

        String contentType = uc.getContentType();
        if (contentType == null) contentType = "";

        int contentLength = uc.getContentLength();

        if (contentType.startsWith("text/")) {
            throw new IOException("This looks like a text resource, not binary: " + contentType);
        }

    try (InputStream raw = uc.getInputStream();
             InputStream in = new BufferedInputStream(raw)) {

            ByteArrayOutputStream bout = new ByteArrayOutputStream();
            byte[] buffer = new byte[8192];
            int read;
            while ((read = in.read(buffer)) != -1) {
                bout.write(buffer, 0, read);
            }
            byte[] data = bout.toByteArray();

            String filename = u.getPath();
            filename = filename.substring(filename.lastIndexOf('/') + 1);
            if (filename.isEmpty()) filename = "download.bin";

            try (FileOutputStream fout = new FileOutputStream(filename)) {
                fout.write(data);
                fout.flush();
            }

            System.out.println("Saved: " + filename);
             }
    }
}
