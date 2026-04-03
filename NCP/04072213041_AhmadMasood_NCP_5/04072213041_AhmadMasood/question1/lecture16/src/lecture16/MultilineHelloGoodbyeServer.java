package lecture16;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;

public class MultilineHelloGoodbyeServer {
    public static void main(String[] args) {
        int port = 2345;

        try (ServerSocket ss = new ServerSocket(port)) {
            System.out.println("MultilineHelloGoodbyeServer listening on port " + port);

            try (Socket s = ss.accept()) {
                PrintWriter pw = new PrintWriter(s.getOutputStream());
                pw.print("Hello There!\r\n");
                pw.print("Goodbye now.\r\n");
                pw.flush();
            }

            System.out.println("Client served, server exiting.");
        } catch (IOException e) {
            System.err.println(e);
        }
    }
}
