package lecture15;

import java.io.*;
import java.net.*;

public class HalfClosedHTTP {
    public static void main(String[] args) {
        String host = (args.length > 0) ? args[0] : "example.com";

        try (Socket connection = new Socket(host, 80)) {
            connection.setSoTimeout(15000);

            Writer out = new OutputStreamWriter(connection.getOutputStream(), "ISO-8859-1");
            out.write("GET / HTTP/1.0\r\nHost: " + host + "\r\n\r\n");
            out.flush();

            connection.shutdownOutput();

            BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            String line;
            while ((line = in.readLine()) != null) {
                System.out.println(line);
            }

        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }
}
