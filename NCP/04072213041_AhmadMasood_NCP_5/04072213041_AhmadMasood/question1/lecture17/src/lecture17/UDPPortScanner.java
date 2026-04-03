package lecture17;

import java.net.DatagramSocket;
import java.net.SocketException;

public class UDPPortScanner {
    public static void main(String[] args) {
        for (int port = 1024; port <= 65535; port++) {
            try {
                DatagramSocket server = new DatagramSocket(port);
                server.close();
            } catch (SocketException ex) {
                System.out.println("There is a server on port " + port + ".");
            }
        }
    }
}
