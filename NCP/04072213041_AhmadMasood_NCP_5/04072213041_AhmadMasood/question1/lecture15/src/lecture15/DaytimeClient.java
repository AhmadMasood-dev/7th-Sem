package lecture15;

import java.io.*;
import java.net.*;

public class DaytimeClient {
    public static void main(String[] args) {
        String hostname = (args.length > 0) ? args[0] : "time.nist.gov";

        try (Socket socket = new Socket(hostname, 13)) {
            socket.setSoTimeout(15000);

            InputStream in = socket.getInputStream();
            StringBuilder time = new StringBuilder();
            InputStreamReader reader = new InputStreamReader(in);

            for (int c = reader.read(); c != -1; c = reader.read()) {
                time.append((char) c);
            }
            System.out.println(time);

        } catch (IOException ex) {
            System.err.println("Could not connect/read from " + hostname + ": " + ex);
        }
    }
}
