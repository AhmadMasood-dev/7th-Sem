package lecture15;

import java.io.*;
import java.net.*;

public class ConnectLaterExample {
    public static void main(String[] args) {
        String host = (args.length > 0) ? args[0] : "time.nist.gov";
        int port = (args.length > 1) ? Integer.parseInt(args[1]) : 13;

        try (Socket socket = new Socket()) {
            SocketAddress address = new InetSocketAddress(host, port);
            socket.connect(address, 15000);

            System.out.println("Connected to: " + socket.getRemoteSocketAddress());
        } catch (IOException ex) {
            System.err.println(ex);
        }
    }
}
