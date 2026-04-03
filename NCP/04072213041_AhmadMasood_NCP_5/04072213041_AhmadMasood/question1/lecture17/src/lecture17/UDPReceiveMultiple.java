package lecture17;

import java.io.*;
import java.net.*;

public class UDPReceiveMultiple {
    public static void main(String[] args) {
        int port = (args.length > 0) ? Integer.parseInt(args[0]) : 2134;

        DatagramPacket incoming = new DatagramPacket(new byte[8192], 8192);

        try (DatagramSocket ds = new DatagramSocket(port)) {
            System.out.println("Listening continuously on UDP port " + port + " ...");

            while (true) {
                try {
                    incoming.setLength(8192); // IMPORTANT reset each time (as slide says)
                    ds.receive(incoming);

                    byte[] data = incoming.getData();
                    String s = new String(data, 0, incoming.getLength());

                    System.out.println("Port " + incoming.getPort() + " on " + incoming.getAddress() + " sent:");
                    System.out.println(s);
                    System.out.println("----");
                } catch (IOException e) {
                    System.err.println(e);
                }
            }
        } catch (SocketException ex) {
            System.err.println(ex);
        }
    }
}
