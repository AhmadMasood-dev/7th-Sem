package lecture16;

import java.io.*;
import java.net.*;
import java.util.Date;

public class DaytimeServer {
    public final static int PORT = 1313; // slide uses 13; changed to 1313 for easy running

    public static void main(String[] args) {
        try (ServerSocket server = new ServerSocket(PORT)) {
            System.out.println("DaytimeServer listening on port " + PORT);

            while (true) {
                try (Socket connection = server.accept()) {
                    Writer out = new OutputStreamWriter(connection.getOutputStream());
                    Date now = new Date();
                    out.write(now.toString() + "\r\n");
                    out.flush();
                } catch (IOException ex) {
                    // ignore per slide
                }
            }
        } catch (IOException ex) {
            System.err.println(ex);
        }
    }
}
