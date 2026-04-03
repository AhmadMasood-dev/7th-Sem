package lecture16;

import java.io.*;
import java.net.*;
import java.util.Date;

public class MultithreadedDaytimeServer {
    public final static int PORT = 1313; // slide uses 13

    public static void main(String[] args) {
        try (ServerSocket server = new ServerSocket(PORT)) {
            System.out.println("MultithreadedDaytimeServer listening on port " + PORT);

            while (true) {
                try {
                    Socket connection = server.accept();
                    Thread task = new DaytimeThread(connection);
                    task.start();
                } catch (IOException ex) {
                    // ignore per slide
                }
            }
        } catch (IOException ex) {
            System.err.println("Couldn't start server");
        }
    }

    private static class DaytimeThread extends Thread {
        private final Socket connection;

        DaytimeThread(Socket connection) {
            this.connection = connection;
        }

        public void run() {
            try {
                Writer out = new OutputStreamWriter(connection.getOutputStream());
                Date now = new Date();
                out.write(now.toString() + "\r\n");
                out.flush();
            } catch (IOException ex) {
                System.err.println(ex);
            } finally {
                try {
                    connection.close();
                } catch (IOException ignored) {
                }
            }
        }
    }
}
