package lecture16;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;

public class WhoAmIServer {
    public static void main(String[] args) {
        int port = 5000;

        try (ServerSocket ss = new ServerSocket(port)) {
            System.out.println("WhoAmIServer listening on port " + port);

            while (true) {
                try (Socket s = ss.accept()) {
                    PrintWriter pw = new PrintWriter(s.getOutputStream());
                    pw.print("Hello " + s.getInetAddress() + " on port " + s.getPort() + "\r\n");
                    pw.print("This is " + s.getLocalAddress() + " on port " + s.getLocalPort() + "\r\n");
                    pw.flush();
                } catch (IOException ignored) {
                }
            }
        } catch (IOException e) {
            System.err.println(e);
        }
    }
}
