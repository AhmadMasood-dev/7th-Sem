package lecture16;

import java.io.*;
import java.net.*;
import java.util.Date;
import java.util.concurrent.*;

public class PooledDaytimeServer {
    public final static int PORT = 1313; // slide uses 13

    public static void main(String[] args) {
        ExecutorService pool = Executors.newFixedThreadPool(50);

        try (ServerSocket server = new ServerSocket(PORT)) {
            System.out.println("PooledDaytimeServer listening on port " + PORT);

            while (true) {
                try {
                    Socket connection = server.accept();
                    Callable<Void> task = new DaytimeTask(connection);
                    pool.submit(task);
                } catch (IOException ex) {
                }
            }
        } catch (IOException ex) {
            System.err.println("Couldn't start server");
        }
    }

    private static class DaytimeTask implements Callable<Void> {
        private final Socket connection;

        DaytimeTask(Socket connection) {
            this.connection = connection;
        }

        public Void call() {
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
            return null;
        }
    }
}
