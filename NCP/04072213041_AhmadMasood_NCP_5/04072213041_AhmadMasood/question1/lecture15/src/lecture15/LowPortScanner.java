package lecture15;

import java.io.*;
import java.net.*;

public class LowPortScanner {
    public static void main(String[] args) {
        String host = (args.length > 0) ? args[0] : "localhost";

        for (int i = 1; i < 1024; i++) {
            try (Socket s = new Socket()) {
                s.connect(new InetSocketAddress(host, i), 200); // 200ms timeout
                System.out.println("There is a server on port " + i + " of " + host);
            } catch (UnknownHostException ex) {
                System.err.println(ex);
                break;
            } catch (IOException ex) {
                // no server on this port (ignore)
            }
        }
    }
}
