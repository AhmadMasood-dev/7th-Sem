package lecture14;

import java.io.*;
import java.net.*;

public class FormPoster {
    private final URL url;
    private final QueryString query = new QueryString();

    public FormPoster(URL url) {
        String protocol = url.getProtocol().toLowerCase();
        if (!protocol.startsWith("http")) {
            throw new IllegalArgumentException("Posting only works for http/https URLs");
        }
        this.url = url;
    }

    public void add(String name, String value) {
        query.add(name, value);
    }

    public URL getURL() {
        return this.url;
    }

    public InputStream post() throws IOException {
        URLConnection conn = url.openConnection();
        conn.setDoOutput(true);
        conn.setDoInput(true);

        conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");

        try (OutputStream outRaw = conn.getOutputStream();
             Writer out = new OutputStreamWriter(outRaw, "UTF-8")) {

            out.write(query.toString());
            out.write("\r\n");
            out.flush();
        }

        return conn.getInputStream();
    }

    public static void main(String[] args) {
        String urlStr = (args.length > 0) ? args[0] : "https://httpbin.org/post";

        try {
            URL url = new URL(urlStr);
            FormPoster poster = new FormPoster(url);

            poster.add("name", "Ahmad Masood");
            poster.add("email", "ahmadmasood.dev@gmail.com");
            poster.add("course", "NCP");

            try (InputStream in = poster.post()) {
                Reader r = new InputStreamReader(in);
                int c;
                while ((c = r.read()) != -1) {
                    System.out.print((char) c);
                }
                System.out.println();
            }

        } catch (MalformedURLException ex) {
            System.err.println("Usage: java lecture14.FormPoster <url>");
        } catch (IOException ex) {
            System.err.println(ex);
        }
    }
}
