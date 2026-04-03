package lecture16;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;

public class HelloGoodbyeServer {
    public static void main(String[] args) {
        int port = 2345;

        try (ServerSocket ss = new ServerSocket(port)) {
            System.out.println("HelloGoodbyeServer listening on port " + port);

            try (Socket s = ss.accept()) {
                PrintWriter pw = new PrintWriter(s.getOutputStream(), true);
                pw.println("Hello There!");
                pw.println("Goodbye now.");
            }

            System.out.println("Client served, server exiting.");
        } catch (IOException e) {
            System.err.println(e);
        }
    }
}
