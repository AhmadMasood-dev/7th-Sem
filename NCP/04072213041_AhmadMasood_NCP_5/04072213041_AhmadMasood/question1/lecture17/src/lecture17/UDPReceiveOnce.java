package lecture17;

import java.io.*;
import java.net.*;

public class UDPReceiveOnce {
    public static void main(String[] args) {
        int port = (args.length > 0) ? Integer.parseInt(args[0]) : 2134;

        try {
            byte[] buffer = new byte[65536];
            DatagramPacket incoming = new DatagramPacket(buffer, buffer.length);
            DatagramSocket ds = new DatagramSocket(port);

            System.out.println("Listening on UDP port " + port + " ...");
            ds.receive(incoming);

            byte[] data = incoming.getData();
            String s = new String(data, 0, incoming.getLength());

            System.out.println("Port " + incoming.getPort() + " on " + incoming.getAddress() + " sent this message:");
            System.out.println(s);

            ds.close();
        } catch (IOException e) {
            System.err.println(e);
        }
    }
}
